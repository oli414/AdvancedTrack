import VehicleSensor from "./Triggers/VehicleSensor";
import SwitchTrack from "./Actions/SwitchTrack";
import SetBlockBrake from "./Actions/SetBlockBrake";
import SetLiftSpeed from "./Actions/SetLiftSpeed";
import SetChainLift from "./Actions/SetChainLift";
import SetBrakeBoosterSpeed from "./Actions/SetBrakeBoosterSpeed";
import Feature from "../Feature";
import EditElementWindow from "./EditElementWindow";
import ElementWizardWindow from "./ElementWizardWindow";

class Element extends Feature {
    constructor(ride, triggerType = -1, actionType = -1) {
        super(ride, Feature.Types.indexOf(Element));

        this.triggerType = -1;
        this.actionType = -1;
        
        if (triggerType > -1 && actionType > -1) {
            this.triggerType = triggerType;
            this.trigger = new Element.TriggerTypes[triggerType](this);
            this.actionType = actionType;
            this.action = new Element.ActionTypes[actionType](this);
        }
    }
    
    highlight(enable) {
        if (enable) {
            ui.mainViewport.visibilityFlags |= (1 << 7);
            ui.tileSelection.tiles = [
                ...this.trigger.getTiles(),
                ...this.action.getTiles()
            ];
        }
        else {
            ui.tileSelection.tiles = null;
            ui.mainViewport.visibilityFlags &= ~(1 << 7);
        }
    }

    getTitle() {
        return Feature.TypeNames[this.type] + ": " + Element.TriggerTypeNames[this.triggerType] + " > " + Element.ActionTypeNames[this.actionType];
    }

    isValid() {
        let a = this.trigger.isValid() && this.action.isValid();
        return a;
    }
    
    checkCollision(carDetails) {
        this.trigger.test(carDetails);
    }
    
    tick() {
        
    }

    serialize() {
        let data = super.serialize();
        return {
            ...data,
            triggerType: this.triggerType,
            actionType: this.actionType,
            trigger: this.trigger.serialize(),
            action: this.action.serialize()
        }
    }

    deserialize(data) {
        this.triggerType = data.triggerType;
        this.actionType = data.actionType;
        
        this.trigger = new Element.TriggerTypes[data.triggerType](this);
        this.action = new Element.ActionTypes[data.actionType](this);
        
        super.deserialize(data);
        
        this.trigger.deserialize(data.trigger);
        this.action.deserialize(data.action);
        this.isValid();
    }
    
    getEditWindow(parent, onFinished) {
        return new EditElementWindow(parent, this, onFinished);
    }
    
    static getWizardWindow(ride, onComplete) {
        return new ElementWizardWindow(ride, onComplete, Element);
    }
}

Element.TriggerTypes = [
    VehicleSensor
];

Element.TriggerTypeNames = [
    "Vehicle Sensor"
];

Element.ActionTypes = [
    SwitchTrack,
    SetBlockBrake,
    SetChainLift,
    SetLiftSpeed,
    SetBrakeBoosterSpeed
];

Element.ActionTypeNames = [
    "Switch Track",
    "Set Block Brake",
    "Set Chain Lift",
    "Set Chain Lift Speed",
    "Set Brake/Booster Speed"
];

export default Element;