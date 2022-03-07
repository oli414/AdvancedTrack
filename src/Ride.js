import Feature from "./Features/Feature";

class Ride {
    constructor(manager, rideId = -1) {
        this.manager = manager;

        this.rideId = rideId;
        
        this.features = [];
        
        this._savedIndex = 0;
    }
    
    getDisplayName() {
        let rideName = "Missing Ride";
        let ride = map.getRide(this.rideId);
        if (ride) {
            rideName = ride.name;
        }
        return `[${this.features.length}] ${rideName}`;
    }

    addFeature(feature) {
        this.features.push(feature);
        this.manager.save();
    }

    deleteFeature(feature) {
        let index = this.features.indexOf(feature);
        if (index >= 0) {
            this.features.splice(index, 1);
        }
        
        this.manager.save();
    }

    hasFeature(feature) {
        return this.features.indexOf(feature) >= 0;
    }

    serialize() {
        let data = {
            rideId: this.rideId,
            features: []
        };
        
        for (let i = 0; i < this.features.length; i++) {
            this.features[i]._savedIndex = i;
            data.features.push(this.features[i].serialize());
        }
        
        return data;
    }

    deserialize(data) {
        this.rideId = data.rideId;
        
        for (let i = 0; i < data.features.length; i++) {
            let featureData = data.features[i];
            let newFeature = new Feature.Types[featureData.type](this);
            newFeature.deserialize(featureData);
            newFeature._savedIndex = i;
            this.features.push(newFeature);
        }
    }

    tick() {
        const ride = map.getRide(this.rideId);
        
        if (ride == null)
            return;
          
        const features = this.features;
        
        // Double check that the ride is not a flat ride.
        if (ride.object.carsPerFlatRide != 255)
        return;
        
        const vehicles = ride.vehicles;
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
                
                // Test the collision for al the advanced track features that are acting on this ride.
                for (let k = 0; k < features.length; k++) {
                    if (!features[k].isValid())
                        continue;
                    
                    features[k].checkCollision({
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
        
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].tick();
        }
    }
}

export default Ride;