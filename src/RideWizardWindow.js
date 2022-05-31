import Oui from "./OliUI";

class RideWizardWindow {
    constructor(onComplete) {
        this.onComplete = onComplete;
        
        this.rideId = -1;
        
        this.window = this.createWindow();
    }
    

    getPotentionalRides() {
        let rideNames = [];
        let rideIndices = [];
        
        let rides = map.rides;
        
        let collectedRides = [];
        for (let i = 0; i < rides.length; i++)
        {
            if (rides[i].classification == "ride")
            {
                if (rides[i].object.carsPerFlatRide != 255)
                    continue;
                
                collectedRides.push({
                    name: rides[i].name,
                    id: rides[i].id
                });
            }
        }
        
        collectedRides.sort((a, b) => {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        
        for (let i = 0; i < collectedRides.length; i++)
        {
            rideNames.push(collectedRides[i].name);
            rideIndices.push(collectedRides[i].id);
        }
        
        return {
            names: rideNames,
            indices: rideIndices
        }
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("advanced-track-ride-wizard", "Advanced Track - Add Ride");
        window._paddingBottom = 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setColors(26, 24);
        window.setWidth(300);
        
        let potentionalRides = this.getPotentionalRides();
        let rides = new Oui.Widgets.Dropdown(potentionalRides.names, (index) => {
            that.rideId = that.getPotentionalRides().indices[index];
        })
        this.rideId = potentionalRides.indices[0];
        window.addChild(rides);
        
        let createButton = new Oui.Widgets.Button("Add Ride", () => {
            that.window._handle.close();
            that.onComplete(that.rideId);
        });
        window.addChild(createButton)

        return window;
    }
}

export default RideWizardWindow;