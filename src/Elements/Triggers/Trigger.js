
class Trigger {
    constructor(element) {
        this.element = element;

        this.validationMessage = "";
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