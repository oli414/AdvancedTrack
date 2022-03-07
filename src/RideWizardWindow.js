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
        for (let i = 0; i < rides.length; i++)
        {
            if (rides[i].classification == "ride")
            {
                if (rides[i].object.carsPerFlatRide != 255)
                    continue;
                
                rideNames.push(rides[i].name);
                rideIndices.push(rides[i].id);
            }
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
        
        let rides = new Oui.Widgets.Dropdown(this.getPotentionalRides().names, (index) => {
            that.rideId = that.getPotentionalRides().indices[index];
        })
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