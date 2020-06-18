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
        let carEntities = map.getAllEntities("car");
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if (!element.isValid())
                continue;

            for (let j = 0; j < carEntities.length; j++) {
                let car = carEntities[j];
                element.trigger.test(car);
            }
        }
    }
}

export default AdvancedTrackManager;