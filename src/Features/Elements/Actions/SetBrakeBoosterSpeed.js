import Action from "./Action";
import LocationPromptWidget from "../../../LocationPromptWidget";
import Oui from "../../../OliUI";
import MapHelper from "../../../MapHelper";

class SetBrakeBoosterSpeed extends Action {
    constructor(element) {
        super(element);

        this.x = -1;
        this.y = -1;
        this.speed = 1;
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
            this.validationMessage = "Brake/booster location has not been set";
            return false;
        }
        if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
            this.validationMessage = "There is no track at the set location";
            return false;
        }
        this.validationMessage = "Brake/booster is ready to go";
        return true;
    }

    perform() {
        MapHelper.SetBrakeBoosterSpeed(map.getTile(this.x, this.y), this.speed);
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            speed: this.speed
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.speed = data.speed;
    }

    createWidget() {
        let that = this;
        let box = new Oui.VerticalBox();
        box.setPadding(0, 0, 0, 0);

        {
            let info = new Oui.Widgets.Label("Sets the brake/booster speed when triggered.");
            box.addChild(info);
        }

        this.isValid();
        let statusLabel = new Oui.Widgets.Label(this.validationMessage);
        let speedSpinner = null;
        let switchLoc = new LocationPromptWidget("Brake/Booster:", this.element.ride.manager.locationPrompt, this.x, this.y, (x, y) => {
            this.x = x;
            this.y = y;
            if (this.isValid()) {
                this.speed = MapHelper.GetBrakeBoosterSpeed(map.getTile(this.x, this.y));
                speedSpinner.setValue(this.speed);
            }
            statusLabel.setText(this.validationMessage);
            this.element.highlight(true);
        });
        box.addChild(switchLoc.element);

        speedSpinner = new Oui.Widgets.Spinner(this.speed, 1, (value) => {
            this.speed = value;
        });
        box.addChild(speedSpinner);
        {
            let info = new Oui.Widgets.Label("The speed does not translate to a known unit (kmh/mph).");
            box.addChild(info);
        }

        box.addChild(statusLabel);

        return box;
    }
}

export default SetBrakeBoosterSpeed;