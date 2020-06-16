import MapHelper from "./MapHelper";
import Oui from "./OliUI";
import LocationPrompt from "./LocationPrompt";
import LocationPromptWidget from "./LocationPromptWidget";
import TrainSensor from "./TrainSensor";
import AdvancedTrackManager from "./AdvancedTrackManager";
import AdvancedTrackWindow from "./AdvancedTrackWindow";

// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

const locationPrompt = new LocationPrompt("advanced-track-location-prompt");

let tileSwitchStart = null;
let tileSwitchEnd = null;
let startSwitchSensor = null;
let endSwitchSensor = null;

function createWindow() {
    let window = new Oui.Window("advanced-track", "Advanced Track");
    window.setWidth(408);

    let horBox = new Oui.HorizontalBox();
    horBox.setPadding(0, 0, 0, 0);
    window.addChild(horBox);

    let switchStartSelect = new LocationPromptWidget("Switch Start", locationPrompt, (x, y) => {
        tileSwitchStart = map.getTile(x, y);
        let rideId = MapHelper.GetTrackElement(tileSwitchStart).ride;

        startSwitchSensor = new TrainSensor(rideId, x, y, () => {
            MapHelper.SwitchTrackElements(tileSwitchStart);
        });
    });
    horBox.addChild(switchStartSelect.element);

    let switchEndSelect = new LocationPromptWidget("Switch End", locationPrompt, (x, y) => {
        tileSwitchEnd = map.getTile(x, y);
    });
    horBox.addChild(switchEndSelect.element);

    let switchBlockEndSelect = new LocationPromptWidget("Switch Block End", locationPrompt, (x, y) => {
        let rideId = MapHelper.GetTrackElement(map.getTile(x, y)).ride;
        endSwitchSensor = new TrainSensor(rideId, x, y, () => {
            if (tileSwitchEnd) {
                MapHelper.SwitchTrackElements(tileSwitchEnd);
            }
        })
    });
    horBox.addChild(switchBlockEndSelect.element);

    return window;
}

function main() {
    let advancedTrackManager = new AdvancedTrackManager();
    let advancedTrackWindow = new AdvancedTrackWindow(advancedTrackManager);

    ui.registerMenuItem("Advanced Track", function () {
        advancedTrackWindow.open();
    })


    context.subscribe("interval.tick", () => {
        advancedTrackManager.tick();
    });
}

registerPlugin({
    name: 'AdvancedTrack',
    version: '0.1',
    licence: "MIT",
    authors: ['Oli414'],
    type: 'local',
    main: main
});