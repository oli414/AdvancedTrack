import Trigger from "./Trigger";
import Oui from "../../../OliUI";
import LocationPromptWidget from "../../../LocationPromptWidget";
import MapHelper from "../../../MapHelper";

class VehicleSensor extends Trigger {
    constructor(element) {
        super(element);
        this.element = element;
        
        this.x = -1;
        this.y = -1;

        this.method = 0;
        this.direction = 0;

        this._sensedEntityIds = [];
    }
    
    getTiles() {
        if (this.x >= 0 && this.y >= 0) {
            return [{
                x: this.x * 32,
                y: this.y * 32
            }];
        }
        return [];
    }

    isValid() {
        if (this.x == -1 || this.y == -1) {
            this.validationMessage = "Sensor location has not been set";
            return false;
        }
        if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
            this.validationMessage = "There is no track at the set location";
            return false;
        }
        this.validationMessage = "Vehicle sensor is ready to go";
        return true;
    }
    
    addSensedEntity(id) {
        this._sensedEntityIds.push(id);
    }
    
    hasSensedEntity(id) {
        return this._sensedEntityIds.indexOf(id) >= 0;
    }
    
    removeSensedEntity(id) {
        const index = this._sensedEntityIds.indexOf(id);
        if (index > -1) {
            this._sensedEntityIds.splice(index, 1);
        }
    }

    test(carDetails) {
        let trainGoingForwards = carDetails.velocity > 0;
        let carIsOnTile = Math.floor(carDetails.car.x / 32) == this.x && Math.floor(carDetails.car.y / 32) == this.y;
        
        if (carIsOnTile && !this.hasSensedEntity(carDetails.car.id)) {
            // Train entered tile
            this.addSensedEntity(carDetails.car.id);
            
            // Trigger on train entered, depending on the direction of travel check if the
            // first or last car entered the tile.
            if (this.method == 0 && 
                ((this.direction != 2 && trainGoingForwards && carDetails.isFirstCarOfTrain) || 
                (this.direction != 1 && !trainGoingForwards && carDetails.isLastCarOfTrain)))
            {
                this.element.action.perform();
                return true;
            }
        }
        else if (!carIsOnTile && this.hasSensedEntity(carDetails.car.id)) {
            // Train exited tile
            this.removeSensedEntity(carDetails.car.id);
            
            // Trigger on train entered, depending on the direction of travel check if the
            // first or last car exited the tile.
            if (this.method == 1 && 
                (this.direction != 2 && (trainGoingForwards && carDetails.isLastCarOfTrain) || 
                (this.direction != 1 && !trainGoingForwards && carDetails.isFirstCarOfTrain)))
            {
                this.element.action.perform();
                return true;
            }
        }
        return false;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            method: this.method,
            direction: this.direction,
            sensedEntityIds: this._sensedEntityIds
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;

        if (data.method != null) {
            this.method = data.method;
        }
        else {
            this.method = 1;
        }
        
        if (data.direction) {
            this.direction = data.direction;
        }
        
        if (data.sensedEntityIds) {
            this._sensedEntityIds = data.sensedEntityIds;
        }
    }

    createWidget() {
        let box = new Oui.VerticalBox();
        box.setPadding(0, 0, 0, 0);

        {
            let info = new Oui.Widgets.Label("Triggers when the last car of a train has cleared the");
            box.addChild(info);
        }
        {
            let info = new Oui.Widgets.Label("selected tile.");
            box.addChild(info);
        }

        this.isValid();
        let statusLabel = new Oui.Widgets.Label(this.validationMessage);

        let sensorLoc = new LocationPromptWidget("Vehicle Sensor:", this.element.ride.manager.locationPrompt, this.x, this.y, (x, y) => {
            this.x = x;
            this.y = y;
            this.isValid();
            statusLabel.setText(this.validationMessage);
            this.element.highlight(true);
        });
        box.addChild(sensorLoc.element);

        {
            let methodForm = new Oui.HorizontalBox();
            methodForm.setPadding(0, 0, 0, 0);
            box.addChild(methodForm);

            let methodLabel = new Oui.Widgets.Label("Trigger when the:");
            methodLabel.setWidth(100);
            methodForm.addChild(methodLabel);

            let method = new Oui.Widgets.Dropdown([
                "Train enters the sensor",
                "Train exits the sensor"
            ], (index) => {
                this.method = index;
            });
            method.setSelectedItem(this.method);
            methodForm.addChild(method);
            methodForm.setRemainingWidthFiller(method);
        }

        {
            let directionForm = new Oui.HorizontalBox();
            directionForm.setPadding(0, 0, 0, 0);
            box.addChild(directionForm);

            let directionLabel = new Oui.Widgets.Label("Direction:");
            directionLabel.setWidth(100);
            directionForm.addChild(directionLabel);

            let direction = new Oui.Widgets.Dropdown([
                "Any direction",
                "Forwards",
                "Backwards"
            ], (index) => {
                this.direction = index;
            });
            direction.setSelectedItem(this.direction);
            directionForm.addChild(direction);
            directionForm.setRemainingWidthFiller(direction);
        }

        box.addChild(statusLabel);

        return box;
    }
}

export default VehicleSensor;