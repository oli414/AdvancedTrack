import Action from "./Action";
import LocationPromptWidget from "../../../LocationPromptWidget";
import Oui from "../../../OliUI";
import MapHelper from "../../../MapHelper";

class SetBlockBrake extends Action {
    constructor(element) {
        super(element);

        this.x = -1;
        this.y = -1;
        this.block = false;
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
            this.validationMessage = "Block brake location has not been set";
            return false;
        }
        if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
            this.validationMessage = "There is no track at the set location";
            return false;
        }
        this.validationMessage = "Block brake is ready to go";
        return true;
    }

    perform() {
        MapHelper.SetBlockBrake(map.getTile(this.x, this.y), this.block);
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            block: this.block
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.block = data.block;
    }

    createWidget() {
        let that = this;
        let box = new Oui.VerticalBox();
        box.setPadding(0, 0, 0, 0);

        {
            let info = new Oui.Widgets.Label("Block or unblocks a block brake");
            box.addChild(info);
        }
        {
            let info = new Oui.Widgets.Label("when triggered.");
            box.addChild(info);
        }

        this.isValid();
        let statusLabel = new Oui.Widgets.Label(this.validationMessage);

        let switchLoc = new LocationPromptWidget("Block Brake:", this.element.ride.manager.locationPrompt, this.x, this.y, (x, y) => {
            this.x = x;
            this.y = y;
            this.isValid();
            statusLabel.setText(this.validationMessage);
            this.element.highlight(true);
        });
        box.addChild(switchLoc.element);

        let checkBox = new Oui.Widgets.Dropdown([
            "Set to open",
            "Set to closed",
        ], (val) => {
            that.block = val > 0;
        })
        checkBox.setSelectedItem(this.block + 0);
        box.addChild(checkBox);

        box.addChild(statusLabel);

        return box;
    }
}

export default SetBlockBrake;