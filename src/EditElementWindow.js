import Oui from "./OliUI";
import LocationPrompt from "./LocationPrompt";

class EditElementWindow {
    constructor(parent, element) {
        this.parent = parent;
        this.element = element;
        this.locationPrompt = new LocationPrompt("loc-prompt");
        this.window = this.createWindow();
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("advanced-track-edit", "Advanced Track - Edit Element");
        window._paddingBottom = 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setColors(24);
        window.setWidth(300);

        window.setOnClose(() => {
            that.locationPrompt.cancel();
        });

        let labelTriggerExpl = new Oui.Widgets.Label("The trigger is the cause for of an action");
        window.addChild(labelTriggerExpl);

        let triggerBox = new Oui.GroupBox("Trigger");
        triggerBox.setMargins(6, 6, triggerBox._marginLeft, triggerBox._marginRight);
        window.addChild(triggerBox);

        triggerBox.addChild(this.element.trigger.createWidget());

        let labelActionExpl = new Oui.Widgets.Label("The action happens when the trigger is triggered");
        window.addChild(labelActionExpl);

        let actionBox = new Oui.GroupBox("Action");
        actionBox.setMargins(6, 6, actionBox._marginLeft, actionBox._marginRight);
        window.addChild(actionBox);

        actionBox.addChild(this.element.action.createWidget());

        let bottom = new Oui.HorizontalBox();
        bottom.setPadding(0, 0, 0, 0);
        window.addChild(bottom);

        let bottomFiller = new Oui.VerticalBox();
        bottom.addChild(bottomFiller);
        bottom.setRemainingWidthFiller(bottomFiller);

        let okButton = new Oui.Widgets.Button("Ok", () => {
            if (!that.parent.advancedTrackManager.hasElement(that.element)) {
                that.parent.advancedTrackManager.addElement(that.element);
            }
            that.parent.advancedTrackManager.save();
            that.window._handle.close();
            that.parent.advancedTrackManager.locationPrompt.cancel();
            that.parent.window._openAtPosition = true;
            that.parent.open();
        });
        okButton.setWidth(50);
        bottom.addChild(okButton)


        return window;
    }
}

export default EditElementWindow;