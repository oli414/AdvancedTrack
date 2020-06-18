import Oui from "./OliUI";

class ParkData {
    constructor() {
        this.namespace = "";
        this.parkName = "";

        this.identifier = 0;
        this.loaded = false;

        this.overwrite = false;
    }

    init(namespace) {
        this.namespace = namespace;
        this.parkName = park.name;
    }

    save(parkData) {
        this.parkName = park.name;
        let allParksData = context.sharedStorage.get(this.namespace + ".ParkData");
        if (allParksData == null) {
            allParksData = [];
        }
        if (this.identifier < allParksData.length) {
            if (this.loaded && this.checkExistingName() && !this.overwrite) {
                this.showDupeWarning(parkData);
            }
            else {
                allParksData[this.identifier] = {
                    parkName: this.parkName,
                    data: parkData
                };

                if (parkData.elements.length == 0) {
                    allParksData.splice(this.identifier, 1);
                    this.identifier = allParksData.length;
                }
            }
        }
        else {
            if (this.checkExistingName() && !this.overwrite) {
                this.showDupeWarning(parkData);
            }
            else {
                if (parkData.elements.length > 0) {
                    allParksData.push({
                        parkName: this.parkName,
                        data: parkData
                    });
                }
            }
        }
        this.loaded = true;
        context.sharedStorage.set(this.namespace + ".ParkData", allParksData);

        this.overwrite = false;
    }

    showDupeWarning(data) {
        let that = this;
        let window = new Oui.Window("advanced-track-dupe", "Advanced Track Warning");
        window.setColors(28);
        window.setWidth(300);

        {
            let line = new Oui.Widgets.Label("Advanced track data has not been saved.");
            line._marginBottom = 8;
            window.addChild(line);
        }
        {
            let line = new Oui.Widgets.Label("This plugin uses the park name to link save data");
            window.addChild(line);
        }
        {
            let line = new Oui.Widgets.Label("but a park with this name already exists.");
            window.addChild(line);
        }
        {
            let line = new Oui.Widgets.Label("Please change the park name to something unique");
            window.addChild(line);
        }
        {
            let line = new Oui.Widgets.Label("or proceed to overwrite the existing data.");
            window.addChild(line);
        }

        let bottom = new Oui.HorizontalBox();
        bottom.setPadding(0, 0, 0, 0);
        window.addChild(bottom);

        let overwriteButton = new Oui.Widgets.Button("Overwrite", () => {
            that.overwriteData(data);
        });
        overwriteButton.setWidth(80);
        bottom.addChild(overwriteButton);

        let bottomLabel = new Oui.Widgets.Label("");
        bottom.addChild(bottomLabel);
        bottom.setRemainingWidthFiller(bottomLabel);

        let cancelButton = new Oui.Widgets.Button("Cancel", () => {
            window._handle.close();
        });
        cancelButton.setWidth(80);
        bottom.addChild(cancelButton);


        window._x = ui.width / 2 - window.getPixelWidth() / 2;
        window._y = ui.height / 2 - window.getPixelHeight() / 2;
        window._openAtPosition = true;
        window.open();
    }

    overwriteData(data) {
        this.overwrite = true;
        let allParksData = context.sharedStorage.get(this.namespace + ".ParkData");
        if (allParksData == null) {
            allParksData = [];
        }
        for (let i = 0; i < allParksData.length; i++) {
            if (allParksData[i].parkName == this.parkName && this.identifier != i) {
                this.identifier = i;
                return;
            }
        }
        this.save(data);
    }

    checkExistingName() {
        let allParksData = context.sharedStorage.get(this.namespace + ".ParkData");
        if (allParksData == null) {
            allParksData = [];
        }
        for (let i = 0; i < allParksData.length; i++) {
            if (allParksData[i].parkName == this.parkName && this.identifier != i) {
                return true;
            }
        }
        return false;
    }

    load() {
        let allParksData = context.sharedStorage.get(this.namespace + ".ParkData");
        if (allParksData == null) {
            allParksData = [];
        }
        for (let i = 0; i < allParksData.length; i++) {
            if (allParksData[i].parkName == this.parkName) {
                this.identifier = i;
                this.loaded = true;
                return allParksData[i].data;
            }
        }
        this.identifier = allParksData.length;
        return null;
    }
}

export default ParkData;