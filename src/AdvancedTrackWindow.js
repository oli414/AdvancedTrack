import Oui from "./OliUI";
import Element from "./Elements/Element";
import EditElementWindow from "./EditElementWindow";

class AdvancedTrackWindow {
    constructor(advancedTrackManager) {
        this.advancedTrackManager = advancedTrackManager;

        this.listView = null;
        this.window = this.createWindow();

        this.selectedTriggerType = 0;
        this.selectedReactionType = 0;
        this.selectedItem = 0;

        this.editWindow = null;
    }

    open() {
        // Update listview.

        this.listView._items = [];
        for (let i = 0; i < this.advancedTrackManager.elements.length; i++) {
            let element = this.advancedTrackManager.elements[i];
            this.listView._items.push(this.getRowFromItem(element, i));
        }

        this.window.open();
    }

    createWindow() {
        const that = this;

        let infoRight = null;

        let window = new Oui.Window("advanced-track-main", "Advanced Track");
        window.setColors(26, 24);
        window._paddingBottom = 14;
        window._paddingTop = 16 + 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setWidth(400);
        window.setHorizontalResize(true, 344, 600);
        window.setHeight(250);
        window.setVerticalResize(true, 200, 600);
        window.setOnClose(() => {
            infoRight.setIsDisabled(true);
        });

        {
            let label = new Oui.Widgets.Label("Advanced Track save data is linked to the park name, NOT to the save file");
            window.addChild(label);
        }
        {
            let label = new Oui.Widgets.Label("Changes are saved automatically upon making changes. Use with care.");
            window.addChild(label);
        }
        {
            let label = new Oui.Widgets.Label("Advanced Track save data does NOT transfer from user to user.");
            label._marginBottom = 8;
            window.addChild(label);
        }

        let listView = new Oui.Widgets.ListView();
        this.listView = listView;
        listView.setCanSelect(true);
        listView.setColumns([
            "ID",
            "Valid",
            "Trigger",
            "Action",
            "Ride"
        ]);
        listView.getColumns()[0].setMinWidth(16);
        listView.getColumns()[0].setRatioWidth(16);
        listView.getColumns()[1].setMinWidth(16);
        listView.getColumns()[1].setRatioWidth(30);
        listView.getColumns()[2].setMinWidth(42);
        listView.getColumns()[2].setRatioWidth(60);
        listView.getColumns()[3].setMinWidth(42);
        listView.getColumns()[3].setRatioWidth(60);
        listView.getColumns()[4].setRatioWidth(200);
        window.addChild(listView);
        window.setRemainingHeightFiller(listView);

        let infoBar = new Oui.HorizontalBox();
        infoBar.setRelativeWidth(100);
        infoBar.setHeight(54);
        infoBar._marginBottom = 8;
        infoBar._paddingLeft = 0;
        infoBar._paddingRight = 0;
        window.addChild(infoBar);


        /*
        let viewport = new Oui.Widgets.ViewportWidget();
        viewport.setWidth(160);
        viewport.setRelativeHeight(100);
        infoBar.addChild(viewport);*/

        infoRight = new Oui.GroupBox("Element");
        infoRight.setRelativeHeight(100);
        infoBar.addChild(infoRight);
        infoBar.setRemainingWidthFiller(infoRight);

        let infoRightLabel = new Oui.Widgets.Label("");
        infoRight.addChild(infoRightLabel);
        infoRight.setRemainingHeightFiller(infoRightLabel);

        let editButton = new Oui.Widgets.Button("Edit", () => {
            that.openEditWindow(that.selectedItem);
        });
        infoRight.addChild(editButton);

        let deleteButton = new Oui.Widgets.Button("Delete", () => {
            that.advancedTrackManager.deleteElement(that.selectedItem);
            infoRight.setIsDisabled(true);

            that.window._x = that.window._handle.x;
            that.window._y = that.window._handle.y;
            that.window._handle.close();
            that.window._openAtPosition = true;
            that.open();
        });
        infoRight.addChild(deleteButton);

        infoRight.setIsDisabled(true);


        listView.setOnClick((row, column) => {
            let element = that.advancedTrackManager.elements[row];
            that.selectedItem = element;
            //viewport.setView(element.x, element.y);
            infoRight.setIsDisabled(false);
        });

        let bottom = new Oui.HorizontalBox();
        bottom.setPadding(0, 0, 0, 0);
        window.addChild(bottom);

        let filler = new Oui.VerticalBox();
        bottom.addChild(filler);
        bottom.setRemainingWidthFiller(filler);

        {
            let label = new Oui.Widgets.Label("Trigger:");
            label.setWidth(45);
            bottom.addChild(label);
        }

        let elementTypes = new Oui.Widgets.Dropdown(Element.TriggerTypeNames, (index) => {
            that.selectedTriggerType = index;
        })
        elementTypes.setWidth(100);
        elementTypes._marginRight = 4;
        elementTypes.setHeight(13);
        bottom.addChild(elementTypes);

        {
            let label = new Oui.Widgets.Label("Action:");
            label.setWidth(40);
            bottom.addChild(label);
        }

        let elementReactionTypes = new Oui.Widgets.Dropdown(Element.ActionTypeNames, (index) => {
            that.selectedReactionType = index;
        })
        elementReactionTypes.setWidth(100);
        elementReactionTypes._marginRight = 4;
        elementReactionTypes.setHeight(13);
        bottom.addChild(elementReactionTypes);

        let addButton = new Oui.Widgets.Button("Create New", () => {
            let newElement = new Element(that.advancedTrackManager, that.selectedTriggerType, that.selectedReactionType);
            that.openEditWindow(newElement);
        });
        addButton.setWidth(80);
        addButton.setHeight(13);
        bottom.addChild(addButton);

        return window;
    }

    openEditWindow(item) {
        this.editWindow = new EditElementWindow(this, item);

        this.window._x = this.window._handle.x;
        this.window._y = this.window._handle.y;
        this.editWindow.window._x = this.window._x + this.window.getPixelWidth() / 2 - this.editWindow.window.getPixelWidth() / 2;
        this.editWindow.window._y = this.window._y;
        this.editWindow.window._openAtPosition = true;

        this.window._handle.close();
        if (this.editWindow != null) {
            if (this.editWindow._handle) {
                this.editWindow._handle.close();
            }
        }

        this.editWindow.window.open();
    }

    getRowFromItem(item, i) {
        return [
            i + "",
            item.isValid() ? "Y" : "N",
            Element.TriggerTypeNames[item.triggerType],
            Element.ActionTypeNames[item.actionType],
            item.getTitle()
        ];
    }
}

export default AdvancedTrackWindow;