import Oui from "./OliUI";

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
                    this.save(parkData);
                    
                    console.log("Park data has been transferred from the shared storage to the park store.");
                    return parkData;
                }
            }
            return null;
        }
        else {
            this.loaded = true;
            return parkData;
        }
    }
}

export default ParkData;