class Feature {
    constructor(ride, type) {
        this.ride = ride;

        this.type = type;
        
        this._savedIndex = 0;
    }

    getTitle() {
        return Feature.TypeNames[this.type];
    }

    isValid() {
        return false;
    }
    
    checkCollision(carDetails) {
        
    }
    
    tick() {
        
    }
    
    highlight(enable) {
        
    }

    serialize() {
        return {
            type: this.type
        }
    }

    deserialize(data) {
        this.type = data.type;
    }
    
    getEditWindow(parent, onFinished) {
        return null;
    }
    
    static getWizardWindow(ride, onComplete) {
        return null;
    } 
}

Feature.Types = [];

Feature.TypeNames = [];

export default Feature;