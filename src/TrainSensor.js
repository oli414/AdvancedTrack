
class TrainSensor {
    constructor(rideId, x, y, onExit) {
        this.rideId = rideId;
        this.x = x;
        this.y = y;

        this._sensedEntityId = -1;

        this.onExit = onExit;
    }

    isValid() {
        if (this.rideId == -1 || this.onExit == null)
            return false;
        if (this.x == -1 || this.y == -1)
            return false;
        return true;
    }

    test(car) {
        if (car.ride != this.rideId)
            return false;
        if (car.nextCarOnTrain != null) // Last car on the train
            return false;

        if (this._sensedEntityId >= 0) {
            if (Math.floor(car.x / 32) != this.x && Math.floor(car.y / 32) != this.y) {
                if (this._sensedEntityId == car.id) {
                    this._sensedEntityId = -1;
                    if (this.onExit)
                        this.onExit();
                    return true;
                }
            }
        }
        else {
            if (Math.floor(car.x / 32) == this.x && Math.floor(car.y / 32) == this.y) {
                this._sensedEntityId = car.id;
            }
        }
        return false;
    }
}

export default TrainSensor;