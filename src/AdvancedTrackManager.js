
class AdvancedTrackManager {
    constructor() {
        this.sensors = [];
    }

    tick() {
        let carEntities = map.getAllEntities("car");
        for (let i = 0; i < this.sensors.length; i++) {
            let sensor = this.sensors[i];
            if (!sensor.isValid())
                continue;

            for (let j = 0; j < carEntities.length; j++) {
                let car = carEntities[j];
                sensor.test(car);
            }
        }
    }
}

export default AdvancedTrackManager;