import Action from "./Action";
import Oui from "../../OliUI";

class SetLiftSpeed extends Action {
    constructor(element) {
        super(element);

        this.rideId = -1;
        this.chainSpeed = 1;
    }

    isValid() {
        if (this.rideId == -1) {
            this.validationMessage = "No ride selected";
            return false;
        }
        
        if (map.getRide(this.rideId) == null)
        {
            this.validationMessage = "Invalid ride selected";
            return false;
        }
        this.validationMessage = "Set lift speed is ready to go";
        return true;
    }

    perform() {
        if (map.getRide(this.rideId) != null)
        {
            const gameActionData = {
                "setting": 8, // RideSetSetting::LiftHillSpeed
                "ride": this.rideId,
                "value": this.chainSpeed
            };
            
            context.queryAction("ridesetsetting", gameActionData, (result) => {
                if (result.error != 0)
                {
                    console.log("Can't set chain lift speed: " + result.errorMessage);
                    return;
                }
                
                context.executeAction("ridesetsetting", gameActionData);
            });
        }
    }

    serialize() {
        return {
            rideId: this.rideId,
            chainSpeed: this.chainSpeed
        };
    }

    deserialize(data) {
        this.rideId = data.rideId;
        this.chainSpeed = data.chainSpeed;
    }

    createWidget() {
        let that = this;
        let box = new Oui.VerticalBox();
        box.setPadding(0, 0, 0, 0);

        {
            let info = new Oui.Widgets.Label("Sets the chain lift speed");
            box.addChild(info);
        }
        {
            let info = new Oui.Widgets.Label("when triggered.");
            box.addChild(info);
        }

        this.isValid();
        let statusLabel = new Oui.Widgets.Label(this.validationMessage);

        let rideNames = [];
        let rideIndices = [];
        
        let rides = map.rides;
        let selectedRide = 0;
        for (let i = 0; i < rides.length; i++)
        {
            if (rides[i].classification == "ride")
            {
                rideNames.push(rides[i].name);
                rideIndices.push(rides[i].id);
                
                if (rides[i].id == this.rideId)
                {
                    selectedRide = rideIndices.length - 1;
                }
            }
        }
        
        let rideSelection = new Oui.Widgets.Dropdown(rideNames, (value) => {
            this.rideId = rideIndices[value];
        });
        rideSelection.setSelectedItem(selectedRide);
        box.addChild(rideSelection);

        let chainSpeedspinner = new Oui.Widgets.Spinner(this.chainSpeed, 1, (value) => {
            this.chainSpeed = value;
        });
        box.addChild(chainSpeedspinner);
        {
            let info = new Oui.Widgets.Label("The speed does not translate to a known unit (kmh/mph).");
            box.addChild(info);
        }

        box.addChild(statusLabel);

        return box;
    }
}

export default SetLiftSpeed;