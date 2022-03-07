import Oui from "../../OliUI";
import LocationPrompt from "../../LocationPrompt";
import LocationPromptWidget from "../../LocationPromptWidget";
import MapHelper from "../../MapHelper";

class EditLiftTrackWindow {
    constructor(parent, feature, onFinished) {
        this.parent = parent;
        this.feature = feature;
        this.onFinished = onFinished;
        this.locationPrompt = new LocationPrompt("loc-prompt");
        
        this.startHeightSpinner = null;
        this.endHeightSpinner = null;
        
        this.window = this.createWindow();
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("advanced-track-edit-lifttrack", "Advanced Track - Edit Lift/Drop Track");
        window._paddingBottom = 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setColors(24);
        window.setWidth(300);
        
        window.setOnClose(() => {
            that.feature.highlight(false);
            that.locationPrompt.cancel();
        });
        
        let statusLabel;
        
        let sensorLoc = new LocationPromptWidget("Lift Track Lock Point:", this.feature.ride.manager.locationPrompt, that.feature.startX, that.feature.startY, (x, y) => {
            let track = MapHelper.GetTrackElement(map.getTile(x, y));
            that.feature.startZ = -1;
            if (track) {
                that.feature.startZ = track.baseZ;
            }
            if (that.feature.endZ == -1) {
                that.feature.endZ = that.feature.startZ;
            }
            that.startHeightSpinner.setValue(Math.floor(that.feature.startZ / 8)); 
            that.startHeightSpinner.setValue(Math.floor(that.feature.endZ / 8)); 
            that.feature.startX = x;
            that.feature.startY = y;
            that.feature.isValid();
            statusLabel.setText(that.feature.validationMessage);
            that.feature.affectedTiles = [];
            that.feature.highlight(true);
        });
        window.addChild(sensorLoc.element);
        
        {
            let topicBox = new Oui.GroupBox("Height");
            
            let row = new Oui.HorizontalBox();
            topicBox.addChild(row);
            
            let label = new Oui.Widgets.Label("Start:");
            label.setRelativeWidth(15);
            row.addChild(label);
            
            this.startHeightSpinner = new Oui.Widgets.Spinner(Math.floor(this.feature.startZ / 8), 1, (value) => {
                that.feature.startZ = value * 8;
            });
            this.startHeightSpinner.setRelativeWidth(35);
            row.addChild(this.startHeightSpinner);
            
            label = new Oui.Widgets.Label("End:");
            label.setRelativeWidth(15);
            row.addChild(label);
            
            this.endHeightSpinner = new Oui.Widgets.Spinner(Math.floor(this.feature.endZ / 8), 1, (value) => {
                that.feature.endZ = value * 8;
            });
            this.endHeightSpinner.setRelativeWidth(35);
            row.addChild(this.endHeightSpinner);
            
            window.addChild(topicBox);
        }
        
        {
            let row = new Oui.HorizontalBox();
            
            let label = new Oui.Widgets.Label("Speed (%):");
            label.setWidth(60);
            row.addChild(label);
            
            let spinner = new Oui.Widgets.Spinner(this.feature.speed, 5, (value) => {
                if (value < 0) {
                    spinner.setValue(0);
                }
                else {
                    that.feature.speed = value;
                }
            });
            row.addChild(spinner);
            row.setRemainingWidthFiller(spinner);
            label.setHeight(row.getPixelHeight());
            
            window.addChild(row);
        }
        
        statusLabel = new Oui.Widgets.Label(this.feature.validationMessage);
        window.addChild(statusLabel);

        let bottom = new Oui.HorizontalBox();
        bottom.setPadding(0, 0, 0, 0);
        window.addChild(bottom);

        let bottomFiller = new Oui.VerticalBox();
        bottom.addChild(bottomFiller);
        bottom.setRemainingWidthFiller(bottomFiller);

        let okButton = new Oui.Widgets.Button("Ok", () => {
            that.window._handle.close();
            that.onFinished();
        });
        okButton.setWidth(50);
        bottom.addChild(okButton)

        return window;
    }
}

export default EditLiftTrackWindow;