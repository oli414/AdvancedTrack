import AdvancedTrackManager from "./AdvancedTrackManager";
import AdvancedTrackWindow from "./AdvancedTrackWindow";
import ParkData from "./ParkData";

// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

function main() {
    function closeWindow(classification) {
        let window = ui.getWindow(classification);
        if (window) {
            window.close();
        }
    }

    let parkData = new ParkData();
    parkData.init("Oli414.AdvancedTrack");
    let advancedTrackManager = new AdvancedTrackManager(parkData);
    let advancedTrackWindow = new AdvancedTrackWindow(advancedTrackManager);

    ui.registerMenuItem("Advanced Track", function () {
        advancedTrackWindow.open();
    })

    context.subscribe("interval.tick", () => {
        advancedTrackManager.tick();
    });

    closeWindow("advanced-track-edit");
    closeWindow("advanced-track-main");

    advancedTrackManager.load();
}

registerPlugin({
    name: 'AdvancedTrack',
    version: '0.2',
    licence: "MIT",
    targetApiVersion: 46,
    authors: ['Oli414'],
    type: 'local',
    main: main
});