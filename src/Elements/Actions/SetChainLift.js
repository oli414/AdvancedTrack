import Action from "./Action";
import LocationPromptWidget from "../../LocationPromptWidget";
import Oui from "../../OliUI";
import MapHelper from "../../MapHelper";

class SetChainLift extends Action {
    constructor(element) {
        super(element);

        this.x = -1;
        this.y = -1;
        this.chainLift = true;
    }

    isValid() {
        if (this.x == -1 || this.y == -1) {
            this.validationMessage = "Chain lift location has not been set";
            return false;
        }
        if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
            this.validationMessage = "There is no track at the set location";
            return false;
        }
        this.validationMessage = "Chain lift is ready to go";
        return true;
    }

    perform() {
        console.log("setting chainlift");
        MapHelper.SetChainLift(map.getTile(this.x, this.y), this.chainLift);
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            chainLift: this.chainLift
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.chainLift = data.chainLift;
    }

    createWidget() {
        let that = this;
        let box = new Oui.VerticalBox();
        box.setPadding(0, 0, 0, 0);

        {
            let info = new Oui.Widgets.Label("Sets a track section's chain lift property");
            box.addChild(info);
        }
        {
            let info = new Oui.Widgets.Label("when triggered.");
            box.addChild(info);
        }

        this.isValid();
        let statusLabel = new Oui.Widgets.Label(this.validationMessage);

        let switchLoc = new LocationPromptWidget("Track Section:", this.element.manager.locationPrompt, this.x, this.y, (x, y) => {
            this.x = x;
            this.y = y;
            this.isValid();
            statusLabel.setText(this.validationMessage);
        });
        box.addChild(switchLoc.element);

        let checkBox = new Oui.Widgets.Dropdown([
            "Enable chain lift",
            "Disable chain lift",
        ], (val) => {
            that.chainLift = val == 0;
        })
        checkBox.setSelectedItem(1 - this.chainLift);
        box.addChild(checkBox);

        box.addChild(statusLabel);

        return box;
    }
}

export default SetChainLift;