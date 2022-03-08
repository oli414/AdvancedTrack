
class Trigger {
    constructor(element) {
        this.element = element;

        this.validationMessage = "";
    }
    
    getTiles() {
        return [];
    }

    isValid() {
        return true;
    }

    test(carDetails) {
        return false;
    }

    serialize() {
        return {};
    }

    createWidget() {

    }
}

export default Trigger;