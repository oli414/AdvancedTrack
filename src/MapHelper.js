
class MapHelper {
    static InsertTileElement(tile, height) {
        let index = MapHelper.FindPlacementPosition(tile, height);
        let element = tile.insertElement(index);
        element._index = index;
        element.baseHeight = height;
        return element;
    }

    static FindPlacementPosition(tile, height) {
        let index = 0;
        for (index = 0; index < tile.numElements; index++) {
            let element = tile.getElement(index);
            if (element.baseHeight >= height) {
                break;
            }
        }
        return index;
    }

    static GetTileSurfaceZ(x, y) {
        var tile = map.getTile(x, y);
        if (tile) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element && element.type == "surface") {
                    return element.baseHeight;
                }
            }
        }
        return null;
    }

    static PlaceSmallScenery(tile, objectIndex, height, orientation = 0) {
        let element = MapHelper.InsertTileElement(tile, height);
        element.type = "small_scenery";
        element.object = objectIndex;
        element.clearanceHeight = height + 1;
        return element;
    }

    static PlaceWall(tile, objectIndex, height, orientation = 0) {
        let element = MapHelper.InsertTileElement(tile, height);
        element.type = "wall";
        element.object = objectIndex;
        element.clearanceHeight = height + 1;
        return element;
    }

    static GetElementIndex(tile, element) {
        for (var i = 0; i < tile.numElements; i++) {
            var elementB = tile.getElement(i);
            if (elementB && element == elementB) {
                return i;
            }
        }
        return null;
    }

    static SetPrimaryTileColor(tile, elementIndex, color) {
        let data = tile.data;
        let typeFieldIndex = 6;
        data[16 * elementIndex + typeFieldIndex] = color;
        tile.data = data;
    }

    static SetFlag(tile, elementIndex, flag, enable) {
        let data = tile.data;
        let typeFieldIndex = 1;
        if (enable) {
            data[16 * elementIndex + typeFieldIndex] |= flag;
        }
        else {
            data[16 * elementIndex + typeFieldIndex] &= ~flag;
        }
        tile.data = data;
    }

    static SetFlag2(tile, elementIndex, flag, enable) {
        let data = tile.data;
        let typeFieldIndex = 11;
        if (enable) {
            data[16 * elementIndex + typeFieldIndex] |= flag;
        }
        else {
            data[16 * elementIndex + typeFieldIndex] &= ~flag;
        }
        tile.data = data;
    }

    static GetFlag(tile, elementIndex, flag) {
        let data = tile.data;
        let typeFieldIndex = 1;
        return data[16 * elementIndex + typeFieldIndex] & flag;
    }

    static SetTileElementRotation(tile, elementIndex, orientation) {
        let data = tile.data;
        let typeFieldIndex = 0;
        let directionMask = 3;
        data[16 * elementIndex + typeFieldIndex] &= ~directionMask;
        data[16 * elementIndex + typeFieldIndex] |= orientation & directionMask;
        tile.data = data;
    }

    static GetTileElementRotation(tile, elementIndex) {
        let data = tile.data;
        let typeFieldIndex = 0;
        let directionMask = 3;
        return (data[16 * elementIndex + typeFieldIndex] & directionMask);
    }

    static GetTrackElement(tile) {
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track") {
                return element;
            }
        }
        return null;
    }

    static GetTrackElementIndex(tile) {
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track") {
                return i;
            }
        }
        return null;
    }

    static SetBlockBrake(tile, blocked) {
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track") {
                MapHelper.SetFlag2(tile, i, 32, blocked);
            }
        }
    }

    static SetChainLift(tile, hasChain) {
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track") {
                element.hasChainLift = hasChain;
            }
        }
    }

    static SetBrakeBoosterSpeed(tile, speed) {
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track" && element.brakeBoosterSpeed != null) {
                element.brakeBoosterSpeed = speed;
            }
        }
    }

    static GetBrakeBoosterSpeed(tile) {
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track" && element.brakeBoosterSpeed != null) {
                return element.brakeBoosterSpeed;
            }
        }
        return 1;
    }

    static SwitchTrackElements(tile) {
        let trackElements = [];
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track") {
                trackElements.push(i);
            }
        }

        if (trackElements.length == 0) {
            return false;
        }

        let data = tile.data;
        let trackData = [];
        for (let i = 0; i < trackElements.length; i++) {
            let a = new Uint8Array(16);
            for (let j = 0; j < 16; j++) {
                a[j] = data[trackElements[i] * 16 + j];
            }
            trackData.push(a);
        }

        let prev = trackElements.length - 1;
        for (let i = 0; i < trackElements.length; i++) {
            for (let j = 0; j < 16; j++) {
                data[trackElements[i] * 16 + j] = trackData[prev][j];
            }
            prev = i;
        }

        // Set last tile element flags
        for (let i = 0; i < tile.numElements; i++) {
            data[i * 16 + 1] &= ~128;
            if (i == tile.numElements - 1) {
                data[i * 16 + 1] |= 128;
            }
        }

        tile.data = data;

        return true;
    }
}

export default MapHelper;