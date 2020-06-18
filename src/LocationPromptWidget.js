import Oui from "./OliUI";

class LocationPromptWidget {
    constructor(text, locationPrompt, x, y, onSet = null) {

        this.isSet = x > -1 && y > -1;
        this.onSet = onSet;

        this.currentLocationX = x;
        this.currentLocationY = y;

        this.element = this._createElements(text, locationPrompt);
    }

    _createElements(text, locationPrompt) {
        let that = this;
        let horizontalBox = new Oui.HorizontalBox();
        horizontalBox.setPadding(0, 0, 0, 0);

        let locateButton = null;

        let promptLocationButton = new Oui.Widgets.ImageButton(5504, () => {
            if (!promptLocationButton.isPressed()) {
                locationPrompt.prompt((x, y) => {
                    this.currentLocationX = x;
                    this.currentLocationY = y;
                    locateButton.setIsDisabled(false);
                    promptLocationButton.setIsPressed(false);
                    statusLabel.setText("Location set (x: " + x + ", y: " + y + ")");
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
        promptLocationButton.setWidth(44);
        promptLocationButton.setHeight(32);
        promptLocationButton.setBorder(true);
        horizontalBox.addChild(promptLocationButton);

        let infoBox = new Oui.VerticalBox();
        infoBox._paddingTop = infoBox._paddingTop + 1;
        horizontalBox.addChild(infoBox);
        horizontalBox.setRemainingWidthFiller(infoBox);

        let infoLabel = new Oui.Widgets.Label(text);
        infoBox.addChild(infoLabel);

        let statusLabel = new Oui.Widgets.Label("No location");
        infoBox.addChild(statusLabel);

        locateButton = new Oui.Widgets.ImageButton(5167, () => {
            ui.mainViewport.scrollTo({ x: that.currentLocationX * 32, y: that.currentLocationY * 32 });
        });
        locateButton.setWidth(24);
        locateButton.setHeight(24);
        locateButton.setIsDisabled(true);
        horizontalBox.addChild(locateButton);

        if (this.isSet) {
            statusLabel.setText("Location set (x: " + this.currentLocationX + ", y: " + this.currentLocationY + ")");
            locateButton.setIsDisabled(false);
        }

        return horizontalBox;
    }
}

export default LocationPromptWidget