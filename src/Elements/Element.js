import VehicleSensor from "./Triggers/VehicleSensor";
import SwitchTrack from "./Actions/SwitchTrack";
import SetBlockBrake from "./Actions/SetBlockBrake";
import SetLiftSpeed from "./Actions/SetLiftSpeed";
import SetChainLift from "./Actions/SetChainLift";
import SetBrakeBoosterSpeed from "./Actions/SetBrakeBoosterSpeed";

class Element {
    constructor(manager, triggerType, actionType) {
        this.manager = manager;

        this._isValidCache = false;

        this.triggerType = triggerType;
        this.trigger = new Element.TriggerTypes[triggerType](this);
        this.actionType = actionType;
        this.action = new Element.ActionTypes[actionType](this);
    }

    getTitle() {
        if (this.triggerType == 0) {
            if (map.getRide(this.trigger.rideId))
                return map.getRide(this.trigger.rideId).name;
            return "Missing Ride";
        }
        return "Advanced Track Element";
    }

    isValid() {
        let a = this.trigger.isValid() && this.action.isValid();
        this._isValidCache = a;
        return a;
    }

    test(carDetails) {
        this.trigger.test(carDetails);
    }

    serialize() {
        return {
            triggerType: this.triggerType,
            actionType: this.actionType,
            trigger: this.trigger.serialize(),
            action: this.action.serialize()
        }
    }

    deserialize(data) {
        this.trigger.deserialize(data.trigger);
        this.action.deserialize(data.action);
        this.isValid();
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