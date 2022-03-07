import Element from "./Features/Elements/Element";
import Feature from "./Features/Feature";

// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

class ParkData {
    constructor() {
        this.namespace = "";
        this.parkName = "";

        this.loaded = false;
    }

    init(namespace) {
        this.namespace = namespace;
        this.parkName = park.name;
    }
    
    save(parkData) {
        let parkStorage = context.getParkStorage(this.namespace);
        parkStorage.set("ParkData", parkData);
        
        this.loaded = true;
    }

    load() {
        let parkStorage = context.getParkStorage(this.namespace);
        let parkData = parkStorage.get("ParkData", null);
        
        if (parkData == null)
        {
            // Legacy support for parkname identified save data in the shared storage:
            let allParksData = context.sharedStorage.get(this.namespace + ".ParkData");
            if (allParksData == null) {
                allParksData = [];
            }
            for (let i = 0; i < allParksData.length; i++) {
                if (allParksData[i].parkName == this.parkName) {
                    this.loaded = true;
                    parkData = allParksData[i].data;
                    
                    console.log("Park data will be transferred from the shared storage to the park store.");
                    break;
                }
            }
        }
        else {
            this.loaded = true;
        }
        
        if (!this.loaded) {
            // No park data for this park.
            return null;
        }
        
        parkData = this.fix_1_3(parkData);
        
        return parkData;
    }
    
    fix_1_3(parkData) {
        // Group track features by ride, and the introduction of the "Feature" type.
        
        // Check the version of the park data.
        if (!parkData.elements) {
            return parkData;
        }
        
        let newParkData = {
            rides: []
        };
        
        let rideIds = [];
        let rideElements = [];
        for (let i = 0; i < parkData.elements.length; i++) {
            let element = parkData.elements[i];
            let rideId = element.trigger.rideId;
            
            let index = rideIds.indexOf(rideId);
            if (index < 0) {
                index = rideIds.push(rideId) - 1;
                rideElements.push([]);
            }
            element.type = Feature.Types.indexOf(Element);
            rideElements[index].push(element);
        }
        
        for (let i = 0; i < rideIds.length; i++) {
            newParkData.rides.push({
                rideId: rideIds[i],
                features: rideElements[i]
            });
        }
        
        return newParkData;
    }
}

export default ParkData;