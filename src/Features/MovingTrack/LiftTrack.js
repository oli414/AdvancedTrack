import MapHelper from "../../MapHelper";
import Feature from "../Feature";
import EditLiftTrackWindow from "./EditLiftTrackWindow";

class LiftTrack extends Feature {
    constructor(ride) {
        super(ride, Feature.Types.indexOf(LiftTrack));
        
        this._sensedEntityIds = [];
        
        this.startX = -1;
        this.startY = -1;
        this.startZ = -1;
        this.endZ = 128;
        
        this.currentTrainEntityId = -1;
        this.vehicleStartDetails = null;
        
        this.vehicleState = LiftTrack.VehicleState.Empty;
        this.liftState = LiftTrack.LiftState.Idle;
        
        this.tickTimerCount = 0;
        
        this.speed = 100;
        
        this.affectedTiles = [];
        
        this.validationMessage = "";
    }
    
    highlight(enable) {
        if (enable) {
            if (this.affectedTiles.length > 0) {
                ui.tileSelection.range = {
                    leftTop: {
                        x: this.affectedTiles[0].x * 32,
                        y: this.affectedTiles[0].y * 32
                    },
                    rightBottom: {
                        x: this.affectedTiles[this.affectedTiles.length - 1].x * 32,
                        y: this.affectedTiles[this.affectedTiles.length - 1].y * 32
                    }
                };
            }
            else {
                ui.tileSelection.range = {
                    leftTop: {
                        x: this.startX * 32,
                        y: this.startY * 32,
                    },
                    rightBottom: {
                        x: this.startX * 32,
                        y: this.startY * 32,
                    },
                }
            }
        }
        else {
            ui.tileSelection.range = null;
            ui.tileSelection.tiles = null;
        }
    }
    
    addSensedEntity(id) {
        this._sensedEntityIds.push(id);
    }
    
    hasSensedEntity(id) {
        return this._sensedEntityIds.indexOf(id) >= 0;
    }
    
    removeSensedEntity(id) {
        const index = this._sensedEntityIds.indexOf(id);
        if (index > -1) {
            this._sensedEntityIds.splice(index, 1);
        }
    }

    getTitle() {
        return Feature.TypeNames[this.type];
    }

    isValid() {
        if (!(this.startX >= 0 && this.startY >= 0 && this.startZ >= 0)) {
            this.validationMessage = "Start location has not been set.";
            return false;
        }
        this.validationMessage = "Lift track is ready to go.";
        return true;
    }
    
    onEnter(carDetails) {
        this.currentTrainEntityId = carDetails.trainId;
        
        if (this.vehicleState == LiftTrack.VehicleState.Empty) {
            this.vehicleStartDetails = {
                x: carDetails.car.x,
                y: carDetails.car.y,
                z: carDetails.car.z,
                velocity: carDetails.velocity,
            };
            
            this.gatherAffectedTiles();
            
            this.vehicleState = LiftTrack.VehicleState.Entering;
        }
    }
    
    onExit(carDetails) {
        this.tickTimerCount = 0;
        this.currentTrainEntityId = -1;
        this.vehicleStartDetails = null;
        this.vehicleState = LiftTrack.VehicleState.Empty;
    }
    
    gatherAffectedTiles() {
        let lastTile = {
            x: this.startX,
            y: this.startY
        }
        let thisCar = map.getEntity(this.currentTrainEntityId);
        
        let firstTile = {
            x: this.startX,
            y: this.startY
        };
        
        let firstCar = true;
        while (thisCar != null) {
            lastTile.x = Math.floor(thisCar.x / 32);
            lastTile.y = Math.floor(thisCar.y / 32);
            
            if (firstCar) {
                firstTile = {
                    x: lastTile.x,
                    y: lastTile.y
                };
                firstCar = false;
            }
            
            if (thisCar.nextCarOnTrain == null)
                break;
            thisCar = map.getEntity(thisCar.nextCarOnTrain);
        }
        
        this.affectedTiles = [];
        
        let minX = Math.min(Math.min(this.startX, lastTile.x), firstTile.x);
        let minY = Math.min(Math.min(this.startY, lastTile.y), firstTile.y);
        let maxX = Math.max(Math.max(this.startX, lastTile.x), firstTile.x);
        let maxY = Math.max(Math.max(this.startY, lastTile.y), firstTile.y);
        for (let i = minX; i <= maxX; i++) {
            for (let j = minY; j <= maxY; j++) {
                this.affectedTiles.push({
                    x: i,
                    y: j
                })
            }
        }
    }
    
    checkCollision(carDetails) {
        let trainGoingForwards = carDetails.velocity > 0;
        let carIsOnTile = carDetails.car.trackLocation.x == this.startX * 32 && carDetails.car.trackLocation.y == this.startY * 32;
        
        if (carIsOnTile && !this.hasSensedEntity(carDetails.car.id)) {
            // Train entered tile
            this.addSensedEntity(carDetails.car.id);
            
            if (((trainGoingForwards && carDetails.isFirstCarOfTrain) || 
                (!trainGoingForwards && carDetails.isLastCarOfTrain)))
            {
                this.onEnter(carDetails);
            }
        }
        else if (!carIsOnTile && this.hasSensedEntity(carDetails.car.id)) {
            // Train exited tile
            this.removeSensedEntity(carDetails.car.id);
            
            if (((trainGoingForwards && carDetails.isLastCarOfTrain) || 
                (!trainGoingForwards && carDetails.isFirstCarOfTrain)))
            {
                this.onExit(carDetails);
            }
        }
        return false;
    }
    
    easeCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    
    easeSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    
    updatePosition(time, car, ease) {   
        time = ease(time);
        
        let heightDifference = (this.endZ - this.startZ) * time;
        let currentZ = this.startZ + heightDifference;
        
        let newBaseZ = Math.round(currentZ / 8);
        
        let heightDelta = 0;
        for (let i = 0; i < this.affectedTiles.length; i++) {
            let track = MapHelper.GetTrackElement(map.getTile(this.affectedTiles[i].x, this.affectedTiles[i].y));
            
            if (track) {
                if (i == 0) {
                    heightDelta = newBaseZ - track.baseHeight;
                }
                track.baseHeight += heightDelta;
                track.clearanceHeight += heightDelta;
            }
        }
        
        if (car != null) {
            let thisCar = car;
            while (thisCar != null) {
                // thisCar.z += heightDelta * 8;
                // thisCar.trackLocation = {
                //     x: thisCar.trackLocation.x,
                //     y: thisCar.trackLocation.y,
                //     z: newBaseZ * 8,
                //     direction: thisCar.trackLocation.direction
                // };
                let tile = map.getTile(Math.floor(thisCar.x / 32), Math.floor(thisCar.y / 32));
                if (tile == null) {
                    break;
                }
                console.log("Got tile");
                let elemIndex = MapHelper.GetTrackElementIndex(tile);
                if (elemIndex == null) {
                    break;
                }
                console.log("got elem index");
                thisCar.moveToTrack(Math.floor(thisCar.x / 32), Math.floor(thisCar.y / 32), elemIndex);
                thisCar.z = this.vehicleStartDetails.z + heightDifference;
                
                if (thisCar.nextCarOnTrain == null)
                    break;
                thisCar = map.getEntity(thisCar.nextCarOnTrain);
            }
        }
    }
    
    tickTimerUpdate(goal) {
        this.tickTimerCount++;
        
        const value = Math.min(this.tickTimerCount / Math.floor(goal), 1);
        if (value == 1) {
            this.tickTimerCount = 0;
            return 1;
        }
        return value;
    }
    
    tick() {
        const car = map.getEntity(this.currentTrainEntityId);
        
        if (this.currentTrainEntityId == -1 || car == null) {
            this.vehicleState = LiftTrack.VehicleState.Empty;
        }
        
        let time = 0;
        let easeFunc = this.easeSine;
        switch (this.vehicleState) {
            case LiftTrack.VehicleState.Entering:
                let distanceTravelled = Math.abs(this.vehicleStartDetails.x - car.x) + Math.abs(this.vehicleStartDetails.y - car.y);
                
                car.acceleration = 0;
                if (distanceTravelled > 16 || car.velocity == 0) {
                    car.velocity = 0;
                    this.vehicleState = LiftTrack.VehicleState.Locked;
                }
                else {
                    car.velocity = this.vehicleStartDetails.velocity * (1 - Math.min(distanceTravelled, 16) / 32);
                }
                break;
            case LiftTrack.VehicleState.Locked:
                car.velocity = 0;
                car.acceleration = 0;
                
                if (this.liftState == LiftTrack.LiftState.Idle) {
                    if (this.tickTimerUpdate(50) == 1) {
                        this.liftState = LiftTrack.LiftState.Traveling;
                    }
                }
                break;
            case LiftTrack.VehicleState.Exiting:
                if (this.vehicleStartDetails.velocity >= 0)
                {
                    if (car.velocity < this.vehicleStartDetails.velocity) {
                        car.velocity += this.vehicleStartDetails.velocity / 8;
                    }
                    else {
                        car.velocity = this.vehicleStartDetails.velocity;
                    }
                }
                else
                {
                    if (car.velocity > this.vehicleStartDetails.velocity) {
                        car.velocity -= -this.vehicleStartDetails.velocity / 8;
                    }
                    else {
                        car.velocity = this.vehicleStartDetails.velocity;
                    }
                }
                break;
            case LiftTrack.VehicleState.Empty:
                if (this.liftState == LiftTrack.LiftState.TargetReached) {
                    if (this.tickTimerUpdate(50) == 1) {
                        this.liftState = LiftTrack.LiftState.Returning;
                    }
                }
                break;
        }
        
        switch (this.liftState) {
            case LiftTrack.LiftState.Traveling:
                time = this.tickTimerUpdate(Math.abs(this.endZ - this.startZ) * (100 / this.speed));
                
                // More dramatic easing when going down with the train on it to indicate the weight of the train.
                if (this.endZ < this.startZ) {
                    easeFunc = this.easeCubic;
                }
                
                this.updatePosition(time, car, easeFunc);
                
                if (time == 1) {
                    this.liftState = LiftTrack.LiftState.TargetReached;
                    this.vehicleState = LiftTrack.VehicleState.Exiting;
                }
                break;
            case LiftTrack.LiftState.Returning:
                time = this.tickTimerUpdate(Math.abs(this.endZ - this.startZ) * (100 / this.speed));
                
                this.updatePosition(1 - time, car, this.easeSine);
                
                if (time == 1) {
                    this.liftState = LiftTrack.LiftState.Idle;
                }
                break;
        }
    }

    serialize() {
        let data = super.serialize();
        data.startX = this.startX;
        data.startY = this.startY;
        data.startZ = this.startZ;
        data.endZ = this.endZ;
        data.vehicleStartDetails = this.vehicleStartDetails;
        data.currentTrainEntityId = this.currentTrainEntityId;
        data.vehicleState = this.vehicleState;
        data.liftState = this.liftState;
        data.tickTimerCount = this.tickTimerCount;
        data.affectedTiles = this.affectedTiles;
        data.speed = this.speed;
        data.sensedEntityIds = this._sensedEntityIds;
        return data; 
    }

    deserialize(data) {
        super.deserialize(data);
        this.startX = data.startX;
        this.startY = data.startY;
        this.startZ = data.startZ;
        this.endZ = data.endZ;
        this.vehicleStartDetails = data.vehicleStartDetails;
        this.currentTrainEntityId = data.currentTrainEntityId;
        this.vehicleState = data.vehicleState;
        this.liftState = data.liftState;
        this.tickTimerCount = data.tickTimerCount;
        this.affectedTiles = data.affectedTiles;
        this.speed = data.speed;
        
        if (data.sensedEntityIds) {
            this._sensedEntityIds = data.sensedEntityIds;
        }
    }
    
    getEditWindow(parent, onFinished) {
        return new EditLiftTrackWindow(parent, this, onFinished);
    }
}

LiftTrack.VehicleState = {
    Empty: 0,
    Entering: 1,
    Locked: 2,
    Exiting: 3
}

LiftTrack.LiftState = {
    Idle: 0,
    Traveling: 1,
    TargetReached: 2,
    Returning: 3,
}

export default LiftTrack;