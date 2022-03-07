import Oui from "../../OliUI";
import LocationPrompt from "../../LocationPrompt";

class ElementWizardWindow {
    constructor(ride, onComplete, elementType) {
        this.ride = ride;
        
        this.selectedTriggerType = 0;
        this.selectedReactionType = 0;
        
        this.elementType = elementType;
        
        this.onComplete = onComplete;
        
        this.window = this.createWindow();
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("advanced-track-wizard-element", "Advanced Track - Control System Wizard");
        window._paddingBottom = 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setColors(26, 24);
        window.setWidth(300);
        
        let horizontalBox = new Oui.HorizontalBox();
        horizontalBox.setPadding(0, 0, 0, 0);
        window.addChild(horizontalBox);

        {
            let label = new Oui.Widgets.Label("Trigger:");
            label.setRelativeWidth(30);
            horizontalBox.addChild(label);
        }

        let elementTypes = new Oui.Widgets.Dropdown(this.elementType.TriggerTypeNames, (index) => {
            that.selectedTriggerType = index;
        })
        elementTypes.setRelativeWidth(70);
        elementTypes._marginRight = 4;
        elementTypes.setHeight(13);
        horizontalBox.addChild(elementTypes);
        
        horizontalBox = new Oui.HorizontalBox();
        horizontalBox.setPadding(0, 0, 0, 0);
        window.addChild(horizontalBox);

        {
            let label = new Oui.Widgets.Label("Action:");
            label.setRelativeWidth(30);
            horizontalBox.addChild(label);
        }

        let elementReactionTypes = new Oui.Widgets.Dropdown(this.elementType.ActionTypeNames, (index) => {
            that.selectedReactionType = index;
        })
        elementReactionTypes.setRelativeWidth(70);
        elementReactionTypes._marginRight = 4;
        elementReactionTypes.setHeight(13);
        horizontalBox.addChild(elementReactionTypes);

        let createButton = new Oui.Widgets.Button("Create", () => {
            that.ride.manager.save();
            that.window._handle.close();
            
            that.onComplete(new that.elementType(that.ride, that.selectedTriggerType, that.selectedReactionType));
        });
        window.addChild(createButton)


        return window;
    }
}

export default ElementWizardWindow;