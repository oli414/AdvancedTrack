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

        this._sensedEntityId = -1;
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

    test(car) {
        if (car.ride != this.rideId)
            return false;

        if (car.nextCarOnTrain != null) // Last car on the train
            return false;

        if (this._sensedEntityId >= 0) {
            if (Math.floor(car.x / 32) != this.x || Math.floor(car.y / 32) != this.y) {
                if (this._sensedEntityId == car.id) {
                    this._sensedEntityId = -1;
                    this.element.action.perform();
                    return true;
                }
            }
        }
        else {
            if (Math.floor(car.x / 32) == this.x && Math.floor(car.y / 32) == this.y) {
                this._sensedEntityId = car.id;
            }
        }
        return false;
    }

    serialize() {
        return {
            rideId: this.rideId,
            x: this.x,
            y: this.y,
        };
    }

    deserialize(data) {
        this.rideId = data.rideId;
        this.x = data.x;
        this.y = data.y;
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
        sensorLoc.element._marginTop += 8;
        box.addChild(sensorLoc.element);

        box.addChild(statusLabel);

        return box;
    }
}

export default VehicleSensor;