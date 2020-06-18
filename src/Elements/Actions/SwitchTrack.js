import Action from "./Action";
import LocationPromptWidget from "../../LocationPromptWidget";
import Oui from "../../OliUI";
import MapHelper from "../../MapHelper";

class SwitchTrack extends Action {
    constructor(element) {
        super(element);

        this.x = -1;
        this.y = -1;
    }

    isValid() {
        if (this.x == -1 || this.y == -1) {
            this.validationMessage = "Track switch location has not been set";
            return false;
        }
        if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
            this.validationMessage = "There is no track at the set location";
            return false;
        }
        this.validationMessage = "Switch track is ready to go";
        return true;
    }

    perform() {
        MapHelper.SwitchTrackElements(map.getTile(this.x, this.y));
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
    }

    createWidget() {
        let box = new Oui.VerticalBox();
        box.setPadding(0, 0, 0, 0);

        {
            let info = new Oui.Widgets.Label("Switches the track elements at the location");
            box.addChild(info);
        }
        {
            let info = new Oui.Widgets.Label("when triggered.");
            box.addChild(info);
        }

        this.isValid();
        let statusLabel = new Oui.Widgets.Label(this.validationMessage);

        let switchLoc = new LocationPromptWidget("Switch Track:", this.element.manager.locationPrompt, this.x, this.y, (x, y) => {
            this.x = x;
            this.y = y;
            this.isValid();
            statusLabel.setText(this.validationMessage);
        });
        switchLoc.element._marginTop += 8;
        box.addChild(switchLoc.element);

        box.addChild(statusLabel);

        return box;
    }
}

export default SwitchTrack;