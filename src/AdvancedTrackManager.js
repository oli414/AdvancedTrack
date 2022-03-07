import LocationPrompt from "./LocationPrompt";
import Element from "./Features/Elements/Element";
import Feature from "./Features/Feature";
import LiftTrack from "./Features/MovingTrack/LiftTrack";
import Ride from "./Ride";

Feature.Types = [
    Element,
    LiftTrack
];

Feature.TypeNames = [
    "Control System",
    "Lift/Drop Track"
];

class AdvancedTrackManager {
    constructor(parkData) {
        this.parkData = parkData;
        this.rides = [];

        this.locationPrompt = new LocationPrompt("advanced-track-location-prompt");
    }
    
    addRide(newRide) {
        for (let i = 0; i < this.rides.length; i++) {
            if (this.rides[i].rideId == newRide.rideId) {
                return;
            }
        }
        this.rides.push(newRide);
        this.save();
    }
    
    deleteRide(ride) {
        let index = this.rides.indexOf(ride);
        if (index >= 0) {
            this.rides.splice(index, 1);
        }
        this.save();
    }
    
    getOrCreateRide(rideId) {
        if (rideId == -1) {
            console.log("Invalid ride ID -1");
            return null;
        }
        
        for (let i = 0; i < this.rides.length; i++) {
            if (this.rides[i].rideId == rideId) {
                return this.rides[i];
            }
        }
        let newRide = new Ride(this, rideId);
        this.rides.push(newRide);
        this.save();
        return newRide;
    }

    save() {
        let data = {};

        data.rides = [];
        for (let i = 0; i < this.rides.length; i++) {
            if (this.rides[i].features.length > 0) {
                if (this.rides[i].rideId >= 0) {
                    let savedIndex = data.rides.push(this.rides[i].serialize()) - 1;
                    this.rides[i]._savedIndex = savedIndex;
                }
            }
        }
        this.parkData.save(data);
    }

    load() {
        let data = this.parkData.load();
        if (data == null) {
            return; // No data to load.
        }

        for (let i = 0; i < data.rides.length; i++) {
            let newRide = new Ride(this, data.rides[i].rideId);
            newRide.deserialize(data.rides[i]);
            newRide._savedIndex = i;
            this.rides.push(newRide);
        }
    }

    tick() {
        for (let i = 0; i < this.rides.length; i++) {
            this.rides[i].tick();
        }
    }
}

export default AdvancedTrackManager;