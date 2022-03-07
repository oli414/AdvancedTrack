
class Trigger {
    constructor(element) {
        this.element = element;

        this.validationMessage = "";
    }
    
    getTiles() {
        
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