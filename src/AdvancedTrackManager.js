import LocationPrompt from "./LocationPrompt";
import Element from "./Elements/Element";

class AdvancedTrackManager {
    constructor(parkData) {
        this.parkData = parkData;
        this.elements = [];

        this.locationPrompt = new LocationPrompt("advanced-track-location-prompt");
    }

    addElement(element) {
        this.elements.push(element);
    }

    deleteElement(element) {
        let index = this.elements.indexOf(element);
        if (index >= 0) {
            this.elements.splice(index, 1);
        }

        this.save();
    }

    hasElement(element) {
        return this.elements.indexOf(element) >= 0;
    }

    save() {
        let data = {};

        data.elements = [];
        for (let i = 0; i < this.elements.length; i++) {
            data.elements.push(this.elements[i].serialize());
        }
        this.parkData.save(data);
    }

    load() {
        let data = this.parkData.load();
        if (data == null) {
            return; // No data to load.
        }

        for (let i = 0; i < data.elements.length; i++) {
            let newElement = new Element(this, data.elements[i].triggerType, data.elements[i].actionType);
            newElement.deserialize(data.elements[i]);
            this.elements.push(newElement);
        }
    }

    tick() {
        // Find the advanced track elements and group them by ride ID.
        // Additionally create a list of all the relevant ride IDs.
        let relevantRideIds = [];
        let relevantElements = [];
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            let indexOf = relevantRideIds.indexOf(element.trigger.rideId);
            if (indexOf < 0) {
                relevantRideIds.push(element.trigger.rideId);
                relevantElements.push([element]);
            }
            else {
                relevantElements[indexOf].push(element);
            }
        }
        
        // Iterate over the rides that are used by advanced track elements.
        for (let i = 0; i < relevantRideIds.length; i++) {
            let ride = map.getRide(relevantRideIds[i]);
            let elements = relevantElements[i];
            
            // Double check that the ride is not a flat ride.
            if (ride.object.carsPerFlatRide != 255)
                continue;
            
            let vehicles = ride.vehicles;
            let trainIndex = 0;
            
            let entityId = vehicles[0];
            let firstCarOfTrain = null;
            
            let isFirstCarOfTrain = true;
            
            // Iterate over all the ride car.
            while (trainIndex < vehicles.length) {
                let vehicle = map.getEntity(entityId);
                
                if (vehicle == null)
                    break;
                
                let isLastCarOfTrain = vehicle.nextCarOnTrain == null;
                
                // Only test collisions on the first and last car of each train.
                if (isLastCarOfTrain || isFirstCarOfTrain) {
                    if (isFirstCarOfTrain)
                        firstCarOfTrain = vehicle;
                    
                    let velocity = firstCarOfTrain.velocity;
                    
                    // Test the collision for al the advanced track elements that are acting on this ride.
                    for (let k = 0; k < elements.length; k++) {
                        elements[k].test({
                            car: vehicle, 
                            velocity: velocity,
                            isFirstCarOfTrain: isFirstCarOfTrain,
                            isLastCarOfTrain: isLastCarOfTrain,
                            trainId: firstCarOfTrain.id
                        });
                    }
                }
                
                // Setup for the next iteration.
                entityId = vehicle.nextCarOnTrain;
                isFirstCarOfTrain = false;
                if (isLastCarOfTrain) {
                    // If this is the last car of the train, we can assume that the next ride car will be the first car of a train.
                    trainIndex++;
                    entityId = vehicles[trainIndex];
                    isFirstCarOfTrain = true;
                }
            }
        }
    }
}

export default AdvancedTrackManager;