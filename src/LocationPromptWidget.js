import Oui from "./OliUI";
import LocationPrompt from "./LocationPrompt";

class LocationPromptWidget {
    constructor(title, locationPrompt, onSet = null) {
        this.element = this._createElements(title, locationPrompt);

        this.isSet = false;
        this.onSet = onSet;
    }

    _createElements(title, locationPrompt) {
        let groupbox = new Oui.GroupBox(title);
        groupbox.setWidth(120);

        let promptLocationButton = new Oui.Widgets.Button("Select Location", () => {
            if (!promptLocationButton.isPressed()) {
                locationPrompt.prompt((x, y) => {
                    promptLocationButton.setIsPressed(false);
                    statusLabel.setText("Set");
                    //statusLabel.setTooltip("x: " + x + ", y: " + y);
                    this.isSet = true;
                    if (this.onSet)
                        this.onSet(x, y);
                }, () => {
                    promptLocationButton.setIsPressed(false);
                });
                promptLocationButton.setIsPressed(true);
            }
            else {
                locationPrompt.cancel();
                promptLocationButton.setIsPressed(false);
            }
        });
        groupbox.addChild(promptLocationButton);

        let statusLabel = new Oui.Widgets.Label("Unset");
        groupbox.addChild(statusLabel);

        return groupbox;
    }
}

export default LocationPromptWidget