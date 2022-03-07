import AdvancedTrackManager from "./AdvancedTrackManager";
import AdvancedTrackWindow from "./AdvancedTrackWindow";
import ParkData from "./ParkData";

// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

function closeWindow(classification) {
    let window = ui.getWindow(classification);
    if (window) {
        window.close();
    }
}

function closeAll() {
    closeWindow("advanced-track-edit");
    closeWindow("advanced-track-main");
    closeWindow("advanced-track-ride-wizard");
    closeWindow("advanced-track-wizard-element");
    closeWindow("advanced-track-edit-lifttrack");
}

function main() {
    if (network.mode != "none") {
        return;
    }
    
    try {
        let parkData = new ParkData();
        parkData.init("Oli414.AdvancedTrack");
        let advancedTrackManager = new AdvancedTrackManager(parkData);
        let advancedTrackWindow = new AdvancedTrackWindow(advancedTrackManager);
        
        ui.registerMenuItem("Advanced Track", function () {
            closeAll();
            advancedTrackWindow.open();
        })

        context.subscribe("interval.tick", () => {
            advancedTrackManager.tick();
        });
        
        context.subscribe("map.save", (e) => {
            advancedTrackManager.save(); 
        });
        
        advancedTrackManager.load();
    }
    catch (exc) {
        console.log(exc.stack);
    }
}

registerPlugin({
    name: 'AdvancedTrack',
    version: '1.3',
    licence: "MIT",
    targetApiVersion: 47,
    authors: ['Oli414'],
    type: 'local',
    main: main
});