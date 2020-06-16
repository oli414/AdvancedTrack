import Oui from "./OliUI";
import LocationPromptWidget from "./LocationPromptWidget";
import LocationPrompt from "./LocationPrompt";
import MapHelper from "./MapHelper";

class SensorSwitchWindow {
    constructor(sensor) {
        this.sensor = sensor;
        this.locationPrompt = new LocationPrompt("loc-prompt");
        this.window = this.createWindow();
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("advanced-track-sensor-switch", "Advanced Track - Edit Sensor Switch");
        window.setWidth(300);

        window.setOnClose(() => {
            that.locationPrompt.cancel();
        });

        let label = new Oui.Widgets.Label("Select the location for the sensor,");
        window.addChild(label);
        let label2 = new Oui.Widgets.Label("and the location of the track to switch.");
        window.addChild(label2);

        let horBox = new Oui.HorizontalBox();
        window.addChild(horBox);

        let sensorLoc = new LocationPromptWidget("Sensor", this.locationPrompt, (x, y) => {
            this.sensor.x = x;
            this.sensor.y = y;

            let track = MapHelper.GetTrackElement(map.getTile(x, y));
            this.sensor.rideId = track.ride;
        });
        sensorLoc.element.setRelativeWidth(50);
        horBox.addChild(sensorLoc.element);

        let switchLoc = new LocationPromptWidget("Switch", this.locationPrompt, (x, y) => {
            this.sensor.onExit = () => {
                MapHelper.SwitchTrackElements(map.getTile(x, y));
            };
        });
        switchLoc.element.setRelativeWidth(50);
        horBox.addChild(switchLoc.element);


        return window;
    }
}

export default SensorSwitchWindow;