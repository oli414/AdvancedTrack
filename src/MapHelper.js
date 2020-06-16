
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

    static SwitchTrackElements(tile) {
        let firstTrackElement = -1;
        let secondTrackElement = -1;
        for (let i = 0; i < tile.numElements; i++) {
            let element = tile.getElement(i);
            if (element.type == "track") {
                if (firstTrackElement < 0) {
                    firstTrackElement = i;
                }
                else {
                    secondTrackElement = i;
                    break;
                }
            }
        }
        if (firstTrackElement < 0 || secondTrackElement < 0)
            return false;

        let isFinalElement = MapHelper.GetFlag(tile, secondTrackElement, 128);

        let data = tile.data;

        let getDataA = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            getDataA[i] = data[firstTrackElement * 16 + i];
        }
        let getDataB = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            getDataB[i] = data[secondTrackElement * 16 + i];
        }
        for (let i = 0; i < 16; i++) {
            data[firstTrackElement * 16 + i] = getDataB[i];
            data[secondTrackElement * 16 + i] = getDataA[i];
        }

        if (isFinalElement) {
            // Set last tile element flags
            for (let i = 0; i < tile.numElements; i++) {
                data[i * 16 + 1] &= ~128;
                if (i == tile.numElements - 1) {
                    data[i * 16 + 1] |= 128;
                }
            }
        }

        tile.data = data;

        return true;
    }
}

export default MapHelper;