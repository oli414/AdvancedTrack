class LocationPrompt {
    constructor(id = "location-prompt") {
        this.id = id;
        this.cursor = "cross_hair";
        this.onFinish = null;
        this.onCancelled = null;

        this.selectedCoords = { x: 0, y: 0 };
    }

    setSelectionRange(start, end) {
        const left = Math.min(start.x, end.x);
        const right = Math.max(start.x, end.x);
        const top = Math.min(start.y, end.y);
        const bottom = Math.max(start.y, end.y);
        ui.tileSelection.range = {
            leftTop: { x: left, y: top },
            rightBottom: { x: right, y: bottom }
        };
    }

    prompt(onFinish = null, onCancelled = null) {
        if (ui.tool && ui.tool.id == this.id) {
            this.cancel();
        }
        this.onFinish = onFinish;
        this.onCancelled = onCancelled;

        ui.activateTool({
            id: this.id,
            cursor: this.cursor,
            onStart: (e) => {
                ui.mainViewport.visibilityFlags |= (1 << 7);
            },
            onDown: (e) => {
                this.selectedCoords = e.mapCoords;
                this.setSelectionRange(this.selectedCoords, this.selectedCoords);
            },
            onMove: (e) => {
                this.selectedCoords = e.mapCoords;
                this.setSelectionRange(this.selectedCoords, this.selectedCoords);
            },
            onUp: (e) => {
                this.selectedCoords = e.mapCoords;
                this.setSelectionRange(this.selectedCoords, this.selectedCoords);
                if (this.onFinish)
                    this.onFinish(Math.floor(this.selectedCoords.x / 32), Math.floor(this.selectedCoords.y / 32));
                ui.tileSelection.range = null;
                ui.tool.cancel();
            },
            onFinish: () => {
                ui.tileSelection.range = null;
                ui.mainViewport.visibilityFlags &= ~(1 << 7);
            },
        });
    }

    cancel() {
        if (ui.tool && ui.tool.id == this.id) {
            if (this.onCancelled) {
                this.onCancelled();
            }
            ui.tool.cancel();
        }
    }
}

export default LocationPrompt;