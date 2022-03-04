import Trigger from "./Trigger";
import Oui from "../../OliUI";
import LocationPromptWidget from "../../LocationPromptWidget";
import MapHelper from "../../MapHelper";

class VehicleSensor extends Trigger {
    constructor(element) {
        super(element);
        this.element = element;

        this.rideId = -1;
        this.x = -1;
        this.y = -1;

        this.method = 0;

        this._sensedEntityIds = [];
    }

    isValid() {
        if (this.x == -1 || this.y == -1) {
            this.validationMessage = "Sensor location has not been set";
            return false;
        }
        if (this.rideId == -1) {
            this.validationMessage = "Sensor is not at a location with track";
            return false;
        }
        if (map.getRide(this.rideId) == null) {
            this.validationMessage = "Sensor is not at a location with track";
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
                ((trainGoingForwards && carDetails.isFirstCarOfTrain) || 
                (!trainGoingForwards && carDetails.isLastCarOfTrain)))
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
                ((trainGoingForwards && carDetails.isLastCarOfTrain) || 
                (!trainGoingForwards && carDetails.isFirstCarOfTrain)))
            {
                this.element.action.perform();
                return true;
            }
        }
        return false;
    }

    serialize() {
        return {
            rideId: this.rideId,
            x: this.x,
            y: this.y,
            method: this.method
        };
    }

    deserialize(data) {
        this.rideId = data.rideId;
        this.x = data.x;
        this.y = data.y;

        if (data.method != null) {
            this.method = data.method;
        }
        else {
            this.method = 1;
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

        let sensorLoc = new LocationPromptWidget("Vehicle Sensor:", this.element.manager.locationPrompt, this.x, this.y, (x, y) => {
            let track = MapHelper.GetTrackElement(map.getTile(x, y));
            if (track) {
                this.rideId = track.ride;
            }
            else {
                this.rideId = -1;
            }
            this.x = x;
            this.y = y;
            this.isValid();
            statusLabel.setText(this.validationMessage);
        });
        box.addChild(sensorLoc.element);

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

        box.addChild(statusLabel);

        return box;
    }
}

export default VehicleSensor;