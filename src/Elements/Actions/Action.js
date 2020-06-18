
class Action {
    constructor(element) {
        this.element = element;

        this.validationMessage = "";
    }

    isValid() {
        return true;
    }

    perform() {

    }

    serialize() {
        return {};
    }

    createWidget() {

    }
}

export default Action;