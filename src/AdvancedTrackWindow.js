import Oui from "./OliUI";
import TrainSensor from "./TrainSensor";
import SensorSwitchWindow from "./SensorSwitchWindow";

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
        for (let i = 0; i < this.advancedTrackManager.sensors.length; i++) {
            let sensor = this.advancedTrackManager.sensors[i];
            this.listView._items.push(this.getRowFromItem(sensor, i));
        }

        this.window.open();
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("advanced-track-main", "Advanced Track");
        window._paddingBottom = 14;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setWidth(400);
        window.setHorizontalResize(true, 300, 600);
        window.setHeight(200);
        window.setVerticalResize(true, 200, 600);

        let label = new Oui.Widgets.Label("Advanced Track Elements");
        window.addChild(label);

        let listView = new Oui.Widgets.ListView();
        this.listView = listView;
        listView.setCanSelect(true);
        listView.setColumns([
            "ID",
            "Type",
            "Ride",
            "Location",
            "Valid"
        ]);
        listView.getColumns()[0].setWidth(20);
        window.addChild(listView);
        window.setRemainingHeightFiller(listView);

        let infoBar = new Oui.HorizontalBox();
        infoBar.setRelativeWidth(100);
        infoBar.setHeight(50);
        window.addChild(infoBar);

        /*
        let viewport = new Oui.Widgets.ViewportWidget();
        viewport.setRelativeWidth(50);
        viewport.setHeight(100);
        infoBar.addChild(viewport);*/

        let infoRight = new Oui.GroupBox("Element");
        infoRight.setRelativeHeight(100);
        infoBar.addChild(infoRight);
        infoBar.setRemainingWidthFiller(infoRight);

        let editButton = new Oui.Widgets.Button("Edit", () => {
            that.openEditWindow(that.selectedItem);
        });
        infoRight.addChild(editButton);

        let deleteButton = new Oui.Widgets.Button("Delete", () => {
            infoRight.setIsDisabled(true);
        });
        infoRight.addChild(deleteButton);

        infoRight.setIsDisabled(true);


        listView.setOnClick((row, column) => {
            let sensor = that.advancedTrackManager.sensors[row];
            that.selectedItem = sensor;
            //viewport.setView(sensor.x, sensor.y);
            infoRight.setIsDisabled(false);
        });

        let bottom = new Oui.HorizontalBox();
        window.addChild(bottom);

        let filler = new Oui.VerticalBox();
        bottom.addChild(filler);
        bottom.setRemainingWidthFiller(filler);


        let elementTypes = new Oui.Widgets.Dropdown([
            "Vehicle Sensor"
        ], (index) => {
            this.selectedTriggerType = index;
        })
        elementTypes.setWidth(100);
        elementTypes.setHeight(13);
        bottom.addChild(elementTypes);

        let elementReactionTypes = new Oui.Widgets.Dropdown([
            "Track Switch"
        ], (index) => {
            this.selectedReactionType = index;
        })
        elementReactionTypes.setWidth(100);
        elementReactionTypes.setHeight(13);
        bottom.addChild(elementReactionTypes);

        let addButton = new Oui.Widgets.Button("Create New", () => {
            let newSensor = new TrainSensor(-1, -1, -1, null);
            that.advancedTrackManager.sensors.push(newSensor);

            that.openEditWindow(newSensor);
        });
        addButton.setHeight(13);
        addButton.setWidth(100);
        bottom.addChild(addButton);

        return window;
    }

    openEditWindow(item) {
        this.window._handle.close();
        if (this.editWindow != null) {
            if (this.editWindow._handle) {
                this.editWindow._handle.close();
            }
        }

        this.editWindow = new SensorSwitchWindow(item);
        this.editWindow.window.open();
    }

    getRowFromItem(item, i) {
        let ride = map.getRide(item.rideId);
        if (ride == null) {
            return [
                i + "",
                "Sensor Switch",
                "Ride not found",
                item.x + ", " + item.y,
                "False"
            ];
        }

        return [
            i + "",
            "Sensor Switch",
            ride.name,
            item.x + ", " + item.y,
            item.isValid() ? "True" : "False"
        ];
    }
}

export default AdvancedTrackWindow;