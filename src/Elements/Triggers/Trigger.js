
class Trigger {
    constructor(element) {
        this.element = element;

        this.validationMessage = "";
    }

    isValid() {
        return true;
    }

    test(car) {
        return false;
    }

    serialize() {
        return {};
    }

    createWidget() {

    }
}

export default Trigger;