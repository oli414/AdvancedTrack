import Oui from "./OliUI";
import Feature from "./Features/Feature";
import Ride from "./Ride";
import RideWizardWindow from "./RideWizardWindow";

class AdvancedTrackWindow {
    constructor(advancedTrackManager) {
        this.advancedTrackManager = advancedTrackManager;

        this.listView = null;
        this.rideSelectionDropDown = null;
        this.window = this.createWindow();
        
        this.selectedRide = this.advancedTrackManager.rides[0];
        this.selectedRideId = 0;

        this.selectedFeatureType = 0;
        this.selectedItem = 0;

        this.editWindow = null;
    }

    open() {
        this.updateRideDropDown();
        this.updateListView();

        this.window.open();
    }
    
    updateListView() {
        this.listView._items = [];
        
        if (this.selectedRide != null) {
            for (let i = 0; i < this.selectedRide.features.length; i++) {
                let feature = this.selectedRide.features[i];
                this.listView._items.push(this.getRowFromItem(feature, i));
            }
        }
        
        this.listView.requestRefresh();
    }
    
    getAdvancedTrackRides() {
        let rideNames = [];
        let rideIndices = [];
        
        let rides = this.advancedTrackManager.rides;
        for (let i = 0; i < rides.length; i++)
        {
            if (rides[i].rideId >= 0) {
                rideNames.push(rides[i].getDisplayName());
                rideIndices.push(rides[i].rideId);
            }
        }
        
        rideNames.push("Add Ride");
        rideIndices.push(-1);
        
        return {
            names: rideNames,
            indices: rideIndices
        }
    }
    
    updateRideDropDown() {
        let names = this.getAdvancedTrackRides().names;
        this.rideSelectionDropDown.setItems(names);
        
        let selectedItem = this.getAdvancedTrackRides().indices.indexOf(this.selectedRideId);
        
        if (selectedItem < 0) {
            selectedItem = 0;
        }
            
        this.rideSelectionDropDown.setSelectedItem(selectedItem);
        
        this.selectedRideId = this.getAdvancedTrackRides().indices[selectedItem];
        if (this.selectedRideId < 0) {
            this.selectedRide = null;
        }
        else {
            this.selectedRide = this.advancedTrackManager.getOrCreateRide(this.selectedRideId);
        }
    }

    createWindow() {
        const that = this;

        let infoRight = null;
        
        let createButton = null;

        let window = new Oui.Window("advanced-track-main", "Advanced Track");
        window.setColors(26, 24);
        window._paddingBottom = 14;
        window._paddingTop = 16 + 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setWidth(500);
        window.setHorizontalResize(true, 500, 800);
        window.setHeight(250);
        window.setVerticalResize(true, 200, 600);
        window.setOnClose(() => {
            if (that.selectedItem) {
                that.selectedItem.highlight(false);
            }
            
            infoRight.setIsDisabled(true);
        });

        {
            let label = new Oui.Widgets.Label("Setup specialized track interactions.");
            label._marginBottom = 6;
            window.addChild(label);
        }
        
        this.rideSelectionDropDown = new Oui.Widgets.Dropdown(this.getAdvancedTrackRides().names, (value) => {
            let indices = that.getAdvancedTrackRides().indices;
            
            if (indices[value] < 0) {
                // new ride
                that.selectedRide = null;
                that.selectedRideId = -1;
                
                createButton.setIsDisabled(true);
                
                let rideWizardWindow = new RideWizardWindow((rideId) => {
                    if (rideId >= 0) {
                        createButton.setIsDisabled(false);
                        that.selectedRideId = rideId;
                        that.selectedRide = that.advancedTrackManager.getOrCreateRide(that.selectedRideId);
                        
                        that.updateRideDropDown();
                
                        that.updateListView();
                        that.window.open();
                    }
                });
                that.window._handle.close();
                rideWizardWindow.window.open();
                
                that.updateListView();
            }
            else {
                createButton.setIsDisabled(false);
                that.selectedRideId = indices[value];
                that.selectedRide = that.advancedTrackManager.getOrCreateRide(that.selectedRideId);
                that.updateListView();
            }
        });
        this.updateRideDropDown();
        window.addChild(this.rideSelectionDropDown);

        let listView = new Oui.Widgets.ListView();
        this.listView = listView;
        listView.setCanSelect(true);
        listView.setColumns([
            "ID",
            "Valid",
            "Title"
        ]);
        listView.getColumns()[0].setMinWidth(16);
        listView.getColumns()[0].setMaxWidth(16);
        listView.getColumns()[1].setMinWidth(16);
        listView.getColumns()[1].setMaxWidth(32);
        window.addChild(listView);
        window.setRemainingHeightFiller(listView);

        let infoBar = new Oui.HorizontalBox();
        infoBar.setRelativeWidth(100);
        infoBar.setHeight(54);
        infoBar._marginBottom = 8;
        infoBar._paddingLeft = 0;
        infoBar._paddingRight = 0;
        window.addChild(infoBar);

        infoRight = new Oui.GroupBox("Element");
        infoRight.setRelativeHeight(100);
        infoBar.addChild(infoRight);
        infoBar.setRemainingWidthFiller(infoRight);

        let infoRightLabel = new Oui.Widgets.Label("");
        infoRight.addChild(infoRightLabel);
        infoRight.setRemainingHeightFiller(infoRightLabel);

        let editButton = new Oui.Widgets.Button("Edit", () => {
            that.openEditWindow(that.selectedItem);
            if (that.selectedItem) {
                that.selectedItem.highlight(true);
            }
        });
        infoRight.addChild(editButton);

        let deleteButton = new Oui.Widgets.Button("Delete", () => {
            if (that.selectedItem) {
                that.selectedItem.highlight(false);
            }
            that.selectedRide.deleteFeature(that.selectedItem);
            that.selectedItem = null;
            
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
            let feature = that.selectedRide.features[row];
            that.selectedItem = feature;
            
            if (that.selectedItem) {
                that.selectedItem.highlight(true);
            }
            infoRight.setIsDisabled(false);
        });

        let bottom = new Oui.HorizontalBox();
        bottom.setPadding(0, 0, 0, 0);
        window.addChild(bottom);

        {
            let label = new Oui.Widgets.Label("Feature:");
            label.setRelativeWidth(15);
            bottom.addChild(label);
        }

        let featureTypes = new Oui.Widgets.Dropdown(Feature.TypeNames, (index) => {
            that.selectedFeatureType = index;
        })
        featureTypes._marginRight = 4;
        featureTypes.setHeight(13);
        bottom.addChild(featureTypes);
        bottom.setRemainingWidthFiller(featureTypes);

        createButton = new Oui.Widgets.Button("Create", () => {
            let onFeatureCreated = (newFeature) => {
                that.advancedTrackManager.addRide(that.selectedRide);
                that.selectedRide.addFeature(newFeature);
                that.openEditWindow(newFeature);
            };
            
            let wizardWindow = Feature.Types[that.selectedFeatureType].getWizardWindow(that.selectedRide, onFeatureCreated);
            
            if (wizardWindow == null) {
                let newFeature = new Feature.Types[that.selectedFeatureType](that.selectedRide);
                onFeatureCreated(newFeature);
            }
            else {
                wizardWindow.window.open();
            }
        });
        createButton.setRelativeWidth(15);
        createButton.setHeight(13);
        bottom.addChild(createButton);

        return window;
    }

    openEditWindow(item) {
        const that = this;
        
        this.editWindow = item.getEditWindow(this, () => {
            that.advancedTrackManager.save();
            that.advancedTrackManager.locationPrompt.cancel();
            that.window._openAtPosition = true;
            that.open();
        });

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
            item.getTitle()
        ];
    }
}

export default AdvancedTrackWindow;