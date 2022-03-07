class Action {
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

    perform() {

    }

    serialize() {
        return {};
    }

    createWidget() {

    }
}

export default Action;