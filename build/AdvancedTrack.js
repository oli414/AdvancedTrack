"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapHelper = function () {
    function MapHelper() {
        _classCallCheck(this, MapHelper);
    }

    _createClass(MapHelper, null, [{
        key: "InsertTileElement",
        value: function InsertTileElement(tile, height) {
            var index = MapHelper.FindPlacementPosition(tile, height);
            var element = tile.insertElement(index);
            element._index = index;
            element.baseHeight = height;
            return element;
        }
    }, {
        key: "FindPlacementPosition",
        value: function FindPlacementPosition(tile, height) {
            var index = 0;
            for (index = 0; index < tile.numElements; index++) {
                var element = tile.getElement(index);
                if (element.baseHeight >= height) {
                    break;
                }
            }
            return index;
        }
    }, {
        key: "GetTileSurfaceZ",
        value: function GetTileSurfaceZ(x, y) {
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
    }, {
        key: "PlaceSmallScenery",
        value: function PlaceSmallScenery(tile, objectIndex, height) {
            var orientation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var element = MapHelper.InsertTileElement(tile, height);
            element.type = "small_scenery";
            element.object = objectIndex;
            element.clearanceHeight = height + 1;
            return element;
        }
    }, {
        key: "PlaceWall",
        value: function PlaceWall(tile, objectIndex, height) {
            var orientation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var element = MapHelper.InsertTileElement(tile, height);
            element.type = "wall";
            element.object = objectIndex;
            element.clearanceHeight = height + 1;
            return element;
        }
    }, {
        key: "GetElementIndex",
        value: function GetElementIndex(tile, element) {
            for (var i = 0; i < tile.numElements; i++) {
                var elementB = tile.getElement(i);
                if (elementB && element == elementB) {
                    return i;
                }
            }
            return null;
        }
    }, {
        key: "SetPrimaryTileColor",
        value: function SetPrimaryTileColor(tile, elementIndex, color) {
            var data = tile.data;
            var typeFieldIndex = 6;
            data[16 * elementIndex + typeFieldIndex] = color;
            tile.data = data;
        }
    }, {
        key: "SetFlag",
        value: function SetFlag(tile, elementIndex, flag, enable) {
            var data = tile.data;
            var typeFieldIndex = 1;
            if (enable) {
                data[16 * elementIndex + typeFieldIndex] |= flag;
            } else {
                data[16 * elementIndex + typeFieldIndex] &= ~flag;
            }
            tile.data = data;
        }
    }, {
        key: "GetFlag",
        value: function GetFlag(tile, elementIndex, flag) {
            var data = tile.data;
            var typeFieldIndex = 1;
            return data[16 * elementIndex + typeFieldIndex] & flag;
        }
    }, {
        key: "SetTileElementRotation",
        value: function SetTileElementRotation(tile, elementIndex, orientation) {
            var data = tile.data;
            var typeFieldIndex = 0;
            var directionMask = 3;
            data[16 * elementIndex + typeFieldIndex] &= ~directionMask;
            data[16 * elementIndex + typeFieldIndex] |= orientation & directionMask;
            tile.data = data;
        }
    }, {
        key: "GetTileElementRotation",
        value: function GetTileElementRotation(tile, elementIndex) {
            var data = tile.data;
            var typeFieldIndex = 0;
            var directionMask = 3;
            return data[16 * elementIndex + typeFieldIndex] & directionMask;
        }
    }, {
        key: "GetTrackElement",
        value: function GetTrackElement(tile) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track") {
                    return element;
                }
            }
            return null;
        }
    }, {
        key: "SwitchTrackElements",
        value: function SwitchTrackElements(tile) {
            var firstTrackElement = -1;
            var secondTrackElement = -1;
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track") {
                    if (firstTrackElement < 0) {
                        firstTrackElement = i;
                    } else {
                        secondTrackElement = i;
                        break;
                    }
                }
            }
            if (firstTrackElement < 0 || secondTrackElement < 0) return false;

            var isFinalElement = MapHelper.GetFlag(tile, secondTrackElement, 128);

            var data = tile.data;

            var getDataA = new Uint8Array(16);
            for (var _i = 0; _i < 16; _i++) {
                getDataA[_i] = data[firstTrackElement * 16 + _i];
            }
            var getDataB = new Uint8Array(16);
            for (var _i2 = 0; _i2 < 16; _i2++) {
                getDataB[_i2] = data[secondTrackElement * 16 + _i2];
            }
            for (var _i3 = 0; _i3 < 16; _i3++) {
                data[firstTrackElement * 16 + _i3] = getDataB[_i3];
                data[secondTrackElement * 16 + _i3] = getDataA[_i3];
            }

            if (isFinalElement) {
                // Set last tile element flags
                for (var _i4 = 0; _i4 < tile.numElements; _i4++) {
                    data[_i4 * 16 + 1] &= ~128;
                    if (_i4 == tile.numElements - 1) {
                        data[_i4 * 16 + 1] |= 128;
                    }
                }
            }

            tile.data = data;

            return true;
        }
    }]);

    return MapHelper;
}();

/**
 * The element class is the base class for all UI elements.
 */


var Element = function () {
    function Element() {
        _classCallCheck(this, Element);

        this._parent = null;

        this._marginTop = 0;
        this._marginBottom = 2;
        this._marginLeft = 0;
        this._marginRight = 0;

        this._x = 0;
        this._y = 0;

        this._width = 100;
        this._height = 0;
        this._hasRelativeWidth = true;
        this._hasRelativeHeight = false;
        this._isRemainingFiller = false;

        this._requireSync = false;

        this._isDisabled = false;
    }

    /**
     * Get wether or not this element or one of its parents (recursive) is disabled (greyed out).
     * @returns {boolean}
     */


    _createClass(Element, [{
        key: "isDisabled",
        value: function isDisabled() {
            if (!this._isDisabled && this._parent != null) {
                return this._parent.isDisabled();
            }
            return this._isDisabled;
        }

        /**
         * Set wether or not this element and its children are disabled (greyed out).
         * @param {boolean} isDisabled 
         */

    }, {
        key: "setIsDisabled",
        value: function setIsDisabled(isDisabled) {
            this._isDisabled = isDisabled;
            this.requestSync();
        }

        /**
         * Get the width of this element in pixels. For elements with a relative width the calculated width based on the element's parent is used.
         * @returns {number} The calculated width in pixels.
         */

    }, {
        key: "getPixelWidth",
        value: function getPixelWidth() {
            if (this._parent == null) {
                return this._width;
            } else if (this._isRemainingFiller && this._parent._isHorizontal) {
                return this._parent.getRemainingWidth();
            } else if (this._hasRelativeWidth) {
                if (!this._parent._isHorizontal) {
                    return this._parent.getContentWidth() / 100 * this._width;
                } else {
                    return (this._parent.getContentWidth() - this._parent.getTotalChildMarginWidths()) / 100 * this._width;
                }
            } else {
                return this._width;
            }
        }

        /**
         * Set the element's width in pixels.
         * @param {number} width The new width in pixels. 
         */

    }, {
        key: "setWidth",
        value: function setWidth(width) {
            this._width = width;
            this._hasRelativeWidth = false;
            this.onDimensionsChanged();
        }

        /**
         * Get the height of this element in pixels. For elements with a relative height the calculated height based on the element's parent is used.
         * @returns {number} The calculated height in pixels.
         */

    }, {
        key: "getPixelHeight",
        value: function getPixelHeight() {
            if (this._parent == null) {
                return this._height;
            } else if (this._isRemainingFiller && !this._parent._isHorizontal) {
                return this._parent.getRemainingHeight();
            } else if (this._hasRelativeHeight) {
                if (!this._parent._isHorizontal) {
                    return (this._parent.getContentHeight() - this._parent.getTotalChildMarginHeights()) / 100 * this._height;
                } else {
                    return this._parent.getContentHeight() / 100 * this._height;
                }
            } else {
                return this._height;
            }
        }

        /**
         * Set the element's height in pixels.
         * @param {number} height The new height in pixels. 
         */

    }, {
        key: "setHeight",
        value: function setHeight(height) {
            this._height = height;
            this._hasRelativeHeight = false;
            this.onDimensionsChanged();
        }

        /**
         * Get the relative width as a percentage. 
         * If the element does not have a relative width the relative width is calculated using the real width of the parent.
         * @returns The width as a percentage relative to the parent.
         */

    }, {
        key: "getRelativeWidth",
        value: function getRelativeWidth() {
            if (this._hasRelativeWidth) {
                return this._width;
            } else {
                if (this._parent != null) {
                    return this._width / this._parent.getContentWidth() * 100;
                }
                throw new Error("The relative width could not be calculated since this element does not have a parent");
            }
        }

        /**
         * Set the relative width as a percentage.
         * @param {number} percentage The width as a percentage.
         */

    }, {
        key: "setRelativeWidth",
        value: function setRelativeWidth(percentage) {
            this._width = percentage;
            this._hasRelativeWidth = true;
            this.onDimensionsChanged();
        }

        /**
         * Get the relative height as a percentage. 
         * If the element does not have a relative height the relative height is calculated using the real height of the parent.
         * @returns The height as a percentage relative to the parent.
         */

    }, {
        key: "getRelativeHeight",
        value: function getRelativeHeight() {
            if (this._hasRelativeHeight) {
                return this._height;
            } else {
                if (this._parent != null) {
                    return this._height / this._parent.getContentHeight() * 100;
                }
                throw new Error("The relative height could not be calculated since this element does not have a parent");
            }
        }

        /**
         * Set the relative height as a percentage.
         * @param {number} percentage The height as a percentage.
         */

    }, {
        key: "setRelativeHeight",
        value: function setRelativeHeight(percentage) {
            this._height = percentage;
            this._hasRelativeHeight = true;
            this.onDimensionsChanged();
        }

        /**
         * @typedef {Object} Margins The spacing outside of the element.
         * @property {number} top       - The margin at the top of the element.
         * @property {number} bottom    - The margin at the bottom of the element.
         * @property {number} left      - The left side margin of the element.
         * @property {number} right     - The right side margin of the element.
         */

        /**
         * Get the margins (spacing outside of the element) on this element.
         * @returns {Margins} The margins for each side of the element.
         */

    }, {
        key: "getMargins",
        value: function getMargins() {
            return {
                top: this._marginTop,
                bottom: this._marginBottom,
                left: this._marginLeft,
                right: this._marginRight
            };
        }

        /**
         * Set the margins (spacing outside of the element).
         * @param {*} top The margin at the top of the element.
         * @param {*} bottom The margin at the bottom of the element.
         * @param {*} left The left side margin of the element.
         * @param {*} right The right side margin of the element.
         */

    }, {
        key: "setMargins",
        value: function setMargins(top, bottom, left, right) {
            this._marginTop = top;
            this._marginBottom = bottom;
            this._marginLeft = left;
            this._marginRight = right;
        }

        /**
         * Get the reference to the window at the root of the window tree.
         * @returns {Window|null} Reference to the window. Can be null if the element or its parents aren't part of a window.
         */

    }, {
        key: "getWindow",
        value: function getWindow() {
            if (this._parent == null) return null;
            return this._parent.getWindow();
        }

        /**
         * Request a synchronization with the real widgets. 
         * Values on this element and its children will be applied to the OpenRCT2 Plugin API UI widgets. 
         * The synchronization is performed at the next window update.
         */

    }, {
        key: "requestSync",
        value: function requestSync() {
            var window = this.getWindow();
            if (window != null && window.isOpen()) {
                this._requireSync = true;
            }
        }

        /**
         * Check if this element, or one of its parents has requested a synchronization update.
         * @returns {boolean} True if this element, or one of its parents has requested a synchronization update.
         */

    }, {
        key: "requiresSync",
        value: function requiresSync() {
            if (this._parent != null) {
                return this._requireSync || this._parent.requiresSync();
            }
            return this._requireSync;
        }

        /**
         * Request a full recreation of the entire window. This is sometimes necessary in order to dynamically add and remove widgets and/or list view items.
         */

    }, {
        key: "requestRefresh",
        value: function requestRefresh() {
            var window = this.getWindow();
            if (window != null) {
                window.requestRefresh();
            }
        }

        /**
         * Update the dimensions of this element recursively and request for the OpenRCT2 Plugin API UI widgets to be updated.
         */

    }, {
        key: "onDimensionsChanged",
        value: function onDimensionsChanged() {
            if (this._parent != null) {
                this._parent._updateChildDimensions();
            }
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            return null;
        }
    }, {
        key: "_update",
        value: function _update() {
            this._requireSync = false;
        }
    }, {
        key: "_getWindowPixelPosition",
        value: function _getWindowPixelPosition() {
            if (this._parent) {
                var pos = this._parent._getWindowPixelPosition();
                pos.x += this._x;
                pos.y += this._y;
                return pos;
            } else {
                return { x: this._x, y: this._y };
            }
        }
    }]);

    return Element;
}();

/**
 * The box class is the base class for UI elements that is able to hold children.
 * @extends Element
 */


var Box = function (_Element) {
    _inherits(Box, _Element);

    function Box() {
        _classCallCheck(this, Box);

        var _this = _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this));

        _this._width = 100;

        _this.setPadding(3, 3, 4, 4);

        _this._isHorizontal = false;

        _this._children = [];
        return _this;
    }

    /**
     * Add a child to this box.
     * @param {Element} child The element to add as a child.
     */


    _createClass(Box, [{
        key: "addChild",
        value: function addChild(child) {
            this._children.push(child);
            child._parent = this;

            this._updateChildDimensions();
        }

        /**
         * Get a list with references to all the children in this box.
         */

    }, {
        key: "getChildren",
        value: function getChildren() {
            return this._children;
        }

        /**
         * Remove a child from this box.
         * @param {Element} child The child to remove.
         */

    }, {
        key: "removeChild",
        value: function removeChild(child) {
            var index = this._children.indexOf(child);
            if (index < 0) {
                throw new Error("The specified element is not a child of this box.");
            }
            this._children[index]._parent = null;
            this._children.splice(index, 1);
            this.requestSync();
        }

        /**
         * Get the inner width of this box in pixels. The inner width is calculated by taking the width in pixels minus the paddings.
         * @returns {number} The inner width in pixels.
         */

    }, {
        key: "getContentWidth",
        value: function getContentWidth() {
            return this.getPixelWidth() - this._paddingLeft - this._paddingRight;
        }

        /**
         * Get the inner height of this box in pixels. The inner height is calculated by taking the height in pixels minus the paddings.
         * @returns {number} The inner width in pixels.
         */

    }, {
        key: "getContentHeight",
        value: function getContentHeight() {
            return this.getPixelHeight() - this._paddingTop - this._paddingBottom;
        }

        /**
         * @typedef {Object} Padding The spacing inside of the element.
         * @property {number} top       - The padding at the top of the element.
         * @property {number} bottom    - The padding at the bottom of the element.
         * @property {number} left      - The left side padding of the element.
         * @property {number} right     - The right side padding of the element.
         */

        /**
         * Get the padding (spacing inside of the element) on this element.
         * @returns { Padding } The padding for each side of the element.
         */

    }, {
        key: "getPadding",
        value: function getPadding() {
            return {
                top: this._paddingTop,
                bottom: this._paddingBottom,
                left: this._paddingLeft,
                right: this._paddingRight
            };
        }

        /**
         * Set the padding (spacing inside of the element).
         * @param {*} top The margin at the top of the element.
         * @param {*} bottom The margin at the bottom of the element.
         * @param {*} left The left side margin of the element.
         * @param {*} right The right side margin of the element.
         */

    }, {
        key: "setPadding",
        value: function setPadding(top, bottom, left, right) {
            this._paddingTop = top;
            this._paddingBottom = bottom;
            this._paddingLeft = left;
            this._paddingRight = right;
        }
    }, {
        key: "onDimensionsChanged",
        value: function onDimensionsChanged() {
            this._updateChildDimensions();
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (child._hasRelativeWidth || child._hasRelativeHeight) {
                    child.onDimensionsChanged();
                }
            }
            _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "onDimensionsChanged", this).call(this);
        }

        /**
         * Calculate the total width of all the margins of the children that are used between the child elements.
         */

    }, {
        key: "getTotalChildMarginWidths",
        value: function getTotalChildMarginWidths() {
            var width = 0;
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (i < this._children.length - 1) {
                    width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
                }
            }
            return width;
        }

        /**
         * Calculate the total height of all the margins of the children that are used between the child elements.
         */

    }, {
        key: "getTotalChildMarginHeights",
        value: function getTotalChildMarginHeights() {
            var height = 0;
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (i < this._children.length - 1) {
                    height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
                }
            }
            return height;
        }
    }, {
        key: "_updateChildDimensions",
        value: function _updateChildDimensions() {}
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var fullDesc = [];
            for (var i = 0; i < this._children.length; i++) {
                var rDesc = this._children[i]._getDescription();
                if (rDesc != null) {
                    if (Array.isArray(rDesc)) {
                        fullDesc = fullDesc.concat(rDesc);
                    } else {
                        fullDesc.push(rDesc);
                    }
                }
            }
            return fullDesc;
        }
    }, {
        key: "_update",
        value: function _update() {
            for (var i = 0; i < this._children.length; i++) {
                this._children[i]._update();
            }
            this._requireSync = false;
        }
    }]);

    return Box;
}(Element);

/**
 * The vertical box is an element that holds children and positions them vertically in a top to bottom fasion.
 */


var VerticalBox = function (_Box) {
    _inherits(VerticalBox, _Box);

    function VerticalBox() {
        _classCallCheck(this, VerticalBox);

        var _this2 = _possibleConstructorReturn(this, (VerticalBox.__proto__ || Object.getPrototypeOf(VerticalBox)).call(this));

        _this2._remainingHeightFiller = null;
        return _this2;
    }

    _createClass(VerticalBox, [{
        key: "addChild",
        value: function addChild(child) {
            _get(VerticalBox.prototype.__proto__ || Object.getPrototypeOf(VerticalBox.prototype), "addChild", this).call(this, child);
            if (child._hasRelativeHeight) {
                child.onDimensionsChanged();
            }
        }

        /**
         * Calculate the left over vertical space.
         * @returns {number} The remaining vertical space in pixels.
         */

    }, {
        key: "getRemainingHeight",
        value: function getRemainingHeight() {
            var height = 0;
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (!child._isRemainingFiller) height += child.getPixelHeight();

                if (i < this._children.length - 1) {
                    height += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
                }
            }
            return this.getContentHeight() - height;
        }

        /**
         * Set a child element to take up the remaining vertical space.
         * @param {Element} child Reference to an element to fill the remaining vertical space. This element has to be a child of the box. 
         */

    }, {
        key: "setRemainingHeightFiller",
        value: function setRemainingHeightFiller(child) {
            if (this._children.indexOf(child) < 0) {
                throw new Error("The remaining height filler has to be a child of this element.");
            }
            if (this._remainingHeightFiller != null) {
                this._remainingHeightFiller._isRemainingFiller = false;
            }
            this._remainingHeightFiller = child;
            child._isRemainingFiller = true;
            this._updateChildDimensions();
            child.onDimensionsChanged();
        }
    }, {
        key: "_updateChildDimensions",
        value: function _updateChildDimensions() {
            var yPos = this._paddingTop;
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child._x = this._paddingLeft;
                child._y = yPos;
                yPos += child.getPixelHeight();

                if (i < this._children.length - 1) {
                    yPos += Math.max(child._marginBottom, this._children[i + 1]._marginTop);
                }
            }

            if (!this._hasRelativeHeight && yPos + this._paddingBottom > this._height) {
                this.setHeight(yPos + this._paddingBottom);
            }
        }
    }]);

    return VerticalBox;
}(Box);

/**
 * A window that can hold elements.
 */


var Window = function (_VerticalBox) {
    _inherits(Window, _VerticalBox);

    /**
     * @param {string} classification A custom unique "type" identifier to identify the window's classification by. This is used to manage multiple instances of the same kind of windows.
     * @param {string} [title] The window title that is displayed in the window's top bar.
     */
    function Window(classification) {
        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        _classCallCheck(this, Window);

        var _this3 = _possibleConstructorReturn(this, (Window.__proto__ || Object.getPrototypeOf(Window)).call(this));

        _this3._hasRelativeWidth = false;
        _this3._width = 100;

        _this3._height = _this3._paddingTop + _this3._paddingBottom;

        _this3._handle = null;

        _this3._title = title;
        _this3._classification = classification;

        _this3._canResizeHorizontally = false;
        _this3._minWidth = 100;
        _this3._maxWidth = 100;
        _this3._canResizeVertically = false;
        _this3._minHeight = 100;
        _this3._maxHeight = 100;

        _this3._titleBarColor = 1;
        _this3._mainColor = 1;

        _this3._requestedRefresh = false;
        _this3._openAtPosition = false;

        _this3._onUpdate = null;
        _this3._onClose = null;
        return _this3;
    }

    /**
     * Set the window title.
     * @param {string} title 
     */


    _createClass(Window, [{
        key: "setTitle",
        value: function setTitle(title) {
            this._title = title;
            this.requestRefresh();
        }

        /**
         * Get the window title.
         * @returns {string}
         */

    }, {
        key: "getTitle",
        value: function getTitle() {
            return this._title;
        }

        /**
         * Get the main window color.
         * @returns {number}
         */

    }, {
        key: "getMainColor",
        value: function getMainColor() {
            return this._mainColor;
        }

        /**
         * Get the title bar color.
         * @returns {number}
         */

    }, {
        key: "getTitleBarColor",
        value: function getTitleBarColor() {
            return this._titleBarColor;
        }

        /**
         * Set the window colors. The title bar color is usually the same as the main color unless it is a window with tabs.
         * @param {number} mainColor 
         * @param {number} [titleBarColor] Optional, the main color will be used for the title bar if not present.
         */

    }, {
        key: "setColors",
        value: function setColors(mainColor) {
            var titleBarColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            this._mainColor = mainColor;
            if (titleBarColor < 0) {
                this._titleBarColor = mainColor;
            } else {
                this._titleBarColor = titleBarColor;
            }
            this.requestRefresh();
        }

        /**
         * Set the on update callback.
         */

    }, {
        key: "setOnUpdate",
        value: function setOnUpdate(onUpdate) {
            this._onUpdate = onUpdate;
        }

        /**
         * Set the on update callback.
         */

    }, {
        key: "setOnClose",
        value: function setOnClose(onClose) {
            this._onClose = onClose;
        }

        /**
         * Open the window.
         */

    }, {
        key: "open",
        value: function open() {
            var desc = this._getDescription();
            this._handle = ui.openWindow(desc);
        }

        /**
         * Check if the window is open.
         * @returns {boolean} True if the window is open.
         */

    }, {
        key: "isOpen",
        value: function isOpen() {
            return this._handle != null;
        }
    }, {
        key: "requestRefresh",
        value: function requestRefresh() {
            // Refreshes are only needed when the window is open.
            if (this.isOpen()) {
                this._requestedRefresh = true;
            }
        }

        /**
         * Enable or disable the window's horizontal resizeability.
         * @param {boolean} canResizeHorizontally Wether or not the window should be set to be resizeable.
         * @param {number} [minWidth] The minimum width that the window can resize to. Should be lower or equal to the width of the window.
         * @param {number} [maxWidth] The maximum width that the window can resize to. Should be higher or equal to the width of the window.
         */

    }, {
        key: "setHorizontalResize",
        value: function setHorizontalResize(canResizeHorizontally) {
            var minWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var maxWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this._canResizeHorizontally = canResizeHorizontally;
            if (canResizeHorizontally) {
                this._minWidth = minWidth;
                this._maxWidth = maxWidth;
                if (minWidth == 0) {
                    this._minWidth = this._width;
                }
                if (maxWidth == 0) {
                    this._minWidth = this._width;
                }
            } else {
                this._minWidth = this._width;
                this._maxWidth = this._width;
            }
            this.requestSync();
        }

        /**
         * Enable or disable the window's vertical resizeability.
         * @param {boolean} canResizeHorizontally Wether or not the window should be set to be resizeable.
         * @param {number} [minHeight] The minimum height that the window can resize to. Should be lower or equal to the height of the window.
         * @param {number} [maxHeight] The maximum height that the window can resize to. Should be higher or equal to the height of the window.
         */

    }, {
        key: "setVerticalResize",
        value: function setVerticalResize(canResizeVertically) {
            var minHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var maxHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this._canResizeVertically = canResizeVertically;
            if (canResizeVertically) {
                this._minHeight = minHeight;
                this._maxHeight = maxHeight;
                if (minHeight == 0) {
                    this._minHeight = this._height;
                }
                if (maxHeight == 0) {
                    this._maxHeight = this._height;
                }
            } else {
                this._minHeight = this._height;
                this._maxHeight = this._height;
            }
            this.requestSync();
        }
    }, {
        key: "setWidth",
        value: function setWidth(pixels) {
            if (this.isOpen()) {
                this._handle.width = pixels;
            }
            _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "setWidth", this).call(this, pixels);
            if (!this._canResizeHorizontally) {
                this._minWidth = this._width;
                this._maxWidth = this._width;
            }
            this.requestRefresh();
        }
    }, {
        key: "setHeight",
        value: function setHeight(pixels) {
            if (pixels < 16) pixels = 16;
            if (this.isOpen()) {
                this._handle.height = pixels;
            }
            _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "setHeight", this).call(this, pixels);
            if (!this._canResizeVertically) {
                this._minHeight = this._height;
                this._maxHeight = this._height;
            }
            this.requestRefresh();
        }
    }, {
        key: "getPixelWidth",
        value: function getPixelWidth() {
            return this._width;
        }
    }, {
        key: "getPixelHeight",
        value: function getPixelHeight() {
            return this._height;
        }
    }, {
        key: "setPadding",
        value: function setPadding(top, bottom, left, right) {
            this._paddingTop = top + 15;
            this._paddingBottom = bottom + 1;
            this._paddingLeft = left;
            this._paddingRight = right;
            this.requestSync();
        }
    }, {
        key: "getWindow",
        value: function getWindow() {
            return this;
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var _this4 = this;

            var widgets = _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "_getDescription", this).call(this);

            var desc = {
                classification: this._classification,
                width: this._width,
                height: this._height,
                minWidth: this._minWidth,
                maxWidth: this._maxWidth,
                minHeight: this._minHeight,
                maxHeight: this._maxHeight,
                title: this._title,
                colours: [this._titleBarColor, this._mainColor],
                widgets: widgets,
                onUpdate: function onUpdate() {
                    _this4._update();
                    if (_this4._onUpdate != null) _this4._onUpdate.call(_this4);
                },
                onClose: function onClose() {
                    _this4._handle = null;
                    if (_this4._onClose != null) _this4._onClose.call(_this4);
                }
            };
            if (this._openAtPosition) {
                desc.x = this._x;
                desc.y = this._y;
            }

            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            handle.width = desc.width;
            handle.height = desc.height;
            handle.minWidth = desc.minWidth;
            handle.maxWidth = desc.maxWidth;
            handle.minHeight = desc.minHeight;
            handle.maxHeight = desc.maxHeight;
            handle.title = desc.title;
            handle.colours[0] = this._titleBarColor;
            handle.colours[1] = this._mainColor;
        }
    }, {
        key: "_update",
        value: function _update() {
            if (this._handle.width != this._width || this._handle.height != this._height) {
                this._width = this._handle.width;
                this._height = this._handle.height;
                this.requestSync();
                this.onDimensionsChanged();
            }
            _get(Window.prototype.__proto__ || Object.getPrototypeOf(Window.prototype), "_update", this).call(this);

            if (this._requestedRefresh || this._requireSync) {
                var desc = this._getDescription();
                this._applyDescription(this._handle, desc);
                this._requireSync = false;
            }

            if (this._requestedRefresh) {
                this._refresh();
                this._requestedRefresh = false;
            }
        }
    }, {
        key: "_getWindowPixelPosition",
        value: function _getWindowPixelPosition() {
            return { x: 0, y: 0 };
        }
    }, {
        key: "_refresh",
        value: function _refresh() {
            this._x = this._handle.x;
            this._y = this._handle.y;

            this._handle.close();
            this._openAtPosition = true;
            this.open();
            this._openAtPosition = false;

            this._requestedRefresh = false;
        }
    }]);

    return Window;
}(VerticalBox);

/**
 * The horizontal box is an element that holds children and positions them horizontally in a left to right fasion.
 */


var HorizontalBox = function (_Box2) {
    _inherits(HorizontalBox, _Box2);

    function HorizontalBox() {
        _classCallCheck(this, HorizontalBox);

        var _this5 = _possibleConstructorReturn(this, (HorizontalBox.__proto__ || Object.getPrototypeOf(HorizontalBox)).call(this));

        _this5._remainingWidthFiller = null;
        _this5._isHorizontal = true;
        return _this5;
    }

    _createClass(HorizontalBox, [{
        key: "addChild",
        value: function addChild(child) {
            _get(HorizontalBox.prototype.__proto__ || Object.getPrototypeOf(HorizontalBox.prototype), "addChild", this).call(this, child);
            if (child._hasRelativeWidth) {
                child.onDimensionsChanged();
            }
        }

        /**
         * Calculate the left over horizontal space.
         * @returns {number} The remaining horizontal space in pixels.
         */

    }, {
        key: "getRemainingWidth",
        value: function getRemainingWidth() {
            var width = 0;
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                if (!child._isRemainingFiller) width += child.getPixelWidth();

                if (i < this._children.length - 1) {
                    width += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
                }
            }
            return this.getContentWidth() - width;
        }

        /**
         * Set a child element to take up the remaining horizontal space.
         * @param {Element} child Reference to an element to fill the remaining horizontal space. This element has to be a child of the box. 
         */

    }, {
        key: "setRemainingWidthFiller",
        value: function setRemainingWidthFiller(child) {
            if (this._children.indexOf(child) < 0) {
                throw new Error("The remaining width filler has to be a child of this element.");
            }
            if (this._remainingWidthFiller != null) {
                this._remainingWidthFiller._isRemainingFiller = false;
            }
            this._remainingWidthFiller = child;
            child._isRemainingFiller = true;
            this._updateChildDimensions();
            child.onDimensionsChanged();
        }
    }, {
        key: "_updateChildDimensions",
        value: function _updateChildDimensions() {
            var xPos = this._paddingLeft;
            var highestChild = 0;
            for (var i = 0; i < this._children.length; i++) {
                var child = this._children[i];
                child._x = xPos;
                child._y = this._paddingTop;
                xPos += child.getPixelWidth();

                if (i < this._children.length - 1) {
                    xPos += Math.max(child._marginRight, this._children[i + 1]._marginLeft);
                }

                if (!child._hasRelativeHeight && child.getPixelHeight() > highestChild) {
                    highestChild = child.getPixelHeight();
                }
            }

            if (!this._hasRelativeWidth && xPos + this._paddingRight > this._width) {
                this.setWidth(xPos + this._paddingRight);
            }

            if (!this._hasRelativeHeight && highestChild > this._height) {
                this.setHeight(highestChild + this._paddingTop + this._paddingBottom);
            }
        }
    }]);

    return HorizontalBox;
}(Box);

var numberCount = 0;
function NumberGen() {
    numberCount++;
    return numberCount - 1;
}

/**
 * This callback is called when a widget is click.
 * @callback onClickCallback
 */

/**
 * This callback is called when the value on an input widget has changed.
 * @callback onChangeCallback
 * @param {*} value The new value of the input widget.
 */

/**
 * The widget base class that wraps around the OpenRCT2 Plugin API UI widgets, and is mostly used for input widgets and labels.
 * @extends Element
 */

var Widget = function (_Element2) {
    _inherits(Widget, _Element2);

    function Widget() {
        _classCallCheck(this, Widget);

        var _this6 = _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).call(this));

        _this6.setMargins(2, 4, 2, 2);
        _this6._type = "none";
        _this6._name = NumberGen();
        return _this6;
    }

    /**
     * Get the reference to the OpenRCT2 Plugin API UI widget.
     * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
     */


    _createClass(Widget, [{
        key: "getHandle",
        value: function getHandle() {
            var window = this.getWindow();
            if (window != null && window.isOpen()) {
                return window._handle.findWidget(this._name);
            }
            return null;
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var calcPos = this._getWindowPixelPosition();
            return {
                type: this._type,
                name: this._name,
                x: calcPos.x,
                y: calcPos.y,
                width: this.getPixelWidth(),
                height: this.getPixelHeight(),
                isDisabled: this.isDisabled()
            };
        }
    }, {
        key: "_update",
        value: function _update() {
            if (this.requiresSync()) {
                var handle = this.getHandle();
                var desc = this._getDescription();
                this._applyDescription(handle, desc);
            }
            this._requireSync = false;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            handle.x = desc.x;
            handle.y = desc.y;
            handle.width = desc.width;
            handle.height = desc.height;
            handle.isDisabled = desc.isDisabled;
        }
    }]);

    return Widget;
}(Element);

Widget.NumberGen = NumberGen;

/**
 * The group box is a vertical box that a border and an optional label.
 */

var GroupBox = function (_VerticalBox2) {
    _inherits(GroupBox, _VerticalBox2);

    function GroupBox() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        _classCallCheck(this, GroupBox);

        var _this7 = _possibleConstructorReturn(this, (GroupBox.__proto__ || Object.getPrototypeOf(GroupBox)).call(this));

        _this7._text = text;
        _this7._name = "groupbox-" + Widget.NumberGen();
        if (_this7._text != "") _this7._paddingTop = 13;else _this7._paddingTop = 8;
        _this7._paddingBottom = 5;
        return _this7;
    }

    /**
     * Get the label text of this groupbox.
     * @returns {string}
     */


    _createClass(GroupBox, [{
        key: "getText",
        value: function getText() {
            return this._text;
        }

        /**
         * Set the groupbox label text. Set to an empty string to remove the label text.
         * @param {string} text
         */

    }, {
        key: "setText",
        value: function setText(text) {
            if (Boolean(this._text.length) != Boolean(text.length)) {
                if (text.length == 0) {
                    this._paddingTop -= 5;
                } else {
                    this._paddingTop += 5;
                }
                this.onDimensionsChanged();
            }
            this._text = text;
            this.requestSync();
        }

        /**
         * Get the reference to the OpenRCT2 Plugin API UI widget.
         * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
         */

    }, {
        key: "getHandle",
        value: function getHandle() {
            var window = this.getWindow();
            if (window != null) {
                return window._handle.findWidget(this._name);
            }
            return null;
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var fullDesc = _get(GroupBox.prototype.__proto__ || Object.getPrototypeOf(GroupBox.prototype), "_getDescription", this).call(this);

            var calcPos = this._getWindowPixelPosition();
            fullDesc.unshift({
                type: "groupbox",
                name: this._name,
                text: this._text,
                x: calcPos.x,
                y: calcPos.y,
                width: this.getPixelWidth(),
                height: this.getPixelHeight(),
                isDisabled: this.isDisabled()
            });
            return fullDesc;
        }
    }, {
        key: "_update",
        value: function _update() {
            if (this.requiresSync()) {
                var handle = this.getHandle();
                var desc = this._getDescription();
                this._applyDescription(handle, desc[0]);
            }
            _get(GroupBox.prototype.__proto__ || Object.getPrototypeOf(GroupBox.prototype), "_update", this).call(this);
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            handle.x = desc.x;
            handle.y = desc.y;
            handle.width = desc.width;
            handle.height = desc.height;
            handle.text = desc.text;
            handle.isDisabled = desc.isDisabled;
        }
    }]);

    return GroupBox;
}(VerticalBox);

/**
 * A button input that can be clicked.
 */


var Button = function (_Widget) {
    _inherits(Button, _Widget);

    /**
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    function Button() {
        var onClick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, Button);

        var _this8 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

        _this8._type = "button";
        _this8._name = _this8._type + "-" + _this8._name;
        _this8._height = 13;
        _this8._onClick = onClick;
        _this8._hasBorder = true;
        _this8._isPressed = false;
        return _this8;
    }

    /**
     * Set the on click callback.
     * @param {import("./Widget").onClickCallback} onClick 
     */


    _createClass(Button, [{
        key: "setOnClick",
        value: function setOnClick(onClick) {
            this._onClick = onClick;
        }

        /**
         * wether or not the button is stuck in a pressed down position (for toggleable buttons).
         * @returns {boolean}
         */

    }, {
        key: "isPressed",
        value: function isPressed() {
            return this._isPressed;
        }

        /**
         * Set wether or not the button is stuck in a pressed down position (for toggleable buttons).
         * @param {boolean} isPressed 
         */

    }, {
        key: "setIsPressed",
        value: function setIsPressed(isPressed) {
            this._isPressed = isPressed;
            this.requestSync();
        }

        /**
         * Get wether or not the button has a visible border.
         * @returns {boolean}
         */

    }, {
        key: "hasBorder",
        value: function hasBorder() {
            return this._hasBorder;
        }

        /**
         * Set wether or not the button has a visible border.
         * @param {boolean} hasBorder 
         */

    }, {
        key: "setBorder",
        value: function setBorder(hasBorder) {
            this._hasBorder = hasBorder;
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var _this9 = this;

            var desc = _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_getDescription", this).call(this);
            desc.onClick = function () {
                if (_this9._onClick) _this9._onClick.call(_this9);
            };
            desc.border = this._hasBorder;
            desc.isPressed = this._isPressed;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.border = desc.border;
            handle.isPressed = this._isPressed;
        }
    }]);

    return Button;
}(Widget);

var BaseClasses = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Element: Element,
    Box: Box,
    Widget: Widget,
    Button: Button
});

/**
 * A text label.
 */

var Label = function (_Widget2) {
    _inherits(Label, _Widget2);

    /**
     * @param {string} text The label text.
     */
    function Label() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        _classCallCheck(this, Label);

        var _this10 = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this));

        _this10._type = "label";
        _this10._text = text;
        _this10._name = _this10._type + "-" + _this10._name;
        _this10._height = 10;
        return _this10;
    }

    /**
     * Get the label text.
     */


    _createClass(Label, [{
        key: "getText",
        value: function getText() {
            return this._text;
        }

        /**
         * Set the label text.
         * @param {string} text 
         */

    }, {
        key: "setText",
        value: function setText(text) {
            this._text = text;
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var desc = _get(Label.prototype.__proto__ || Object.getPrototypeOf(Label.prototype), "_getDescription", this).call(this);
            desc.text = this._text;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(Label.prototype.__proto__ || Object.getPrototypeOf(Label.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.text = desc.text;
        }
    }]);

    return Label;
}(Widget);

/**
 * A button input that can be clicked that has a text label.
 */


var TextButton = function (_Button) {
    _inherits(TextButton, _Button);

    /**
     * @param {string} [text] The button text.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    function TextButton() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var onClick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, TextButton);

        var _this11 = _possibleConstructorReturn(this, (TextButton.__proto__ || Object.getPrototypeOf(TextButton)).call(this, onClick));

        _this11._text = text;
        return _this11;
    }

    /**
     * Get the button text.
     */


    _createClass(TextButton, [{
        key: "getText",
        value: function getText() {
            return this._text;
        }

        /**
         * Set the button text.
         * @param {string} text 
         */

    }, {
        key: "setText",
        value: function setText(text) {
            this._text = text;
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var desc = _get(TextButton.prototype.__proto__ || Object.getPrototypeOf(TextButton.prototype), "_getDescription", this).call(this);
            desc.text = this._text;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(TextButton.prototype.__proto__ || Object.getPrototypeOf(TextButton.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.text = desc.text;
        }
    }]);

    return TextButton;
}(Button);

/**
 * An image button input that can be clicked.
 */


var ImageButton = function (_Button2) {
    _inherits(ImageButton, _Button2);

    /**
     * @param {number} [image] The image index to display.
     * @param {import("./Widget").onClickCallback} [onClick] Callback for when the button is clicked.
     */
    function ImageButton() {
        var image = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var onClick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, ImageButton);

        var _this12 = _possibleConstructorReturn(this, (ImageButton.__proto__ || Object.getPrototypeOf(ImageButton)).call(this, onClick));

        _this12._image = image;
        _this12._hasBorder = false;
        return _this12;
    }

    /**
     * Get the button image index.
     */


    _createClass(ImageButton, [{
        key: "getImage",
        value: function getImage() {
            return this._image;
        }

        /**
         * Set the button image index.
         * @param {number} image The image index to display. 
         */

    }, {
        key: "setImage",
        value: function setImage(image) {
            this._image = image;
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var desc = _get(ImageButton.prototype.__proto__ || Object.getPrototypeOf(ImageButton.prototype), "_getDescription", this).call(this);
            desc.image = this._image;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(ImageButton.prototype.__proto__ || Object.getPrototypeOf(ImageButton.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.image = desc.image;
        }
    }]);

    return ImageButton;
}(Button);

/**
 * A checkbox with text behind it.
 */


var Checkbox = function (_Widget3) {
    _inherits(Checkbox, _Widget3);

    /**
     * @param {*} [text] The text displayed behind the checkbox.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the checkbox is ticked or unticked. The callback's parameter is boolean which is true if the checkbox is checked.
     */
    function Checkbox() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var onChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Checkbox);

        var _this13 = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this));

        _this13._type = "checkbox";
        _this13._text = text;
        _this13._name = _this13._type + "-" + _this13._name;
        _this13._height = 10;
        _this13._onChange = onChange;
        _this13._isChecked = false;
        return _this13;
    }

    /**
     * Set the on change callback.
     * @param {import("./Widget").onChangeCallback} onChange 
     */


    _createClass(Checkbox, [{
        key: "setOnChange",
        value: function setOnChange(onChange) {
            this._onChange = onChange;
        }

        /**
         * Check  if the checkbox is checked.
         * @returns {boolean} True if the checkbox is checked.
         */

    }, {
        key: "isChecked",
        value: function isChecked() {
            return this._isChecked;
        }

        /**
         * Set the state of the checkbox to check or unchecked.
         * @param {boolean} checked True if the checkbox should be checked.
         */

    }, {
        key: "setChecked",
        value: function setChecked(checked) {
            this._isChecked = checked;
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var _this14 = this;

            var desc = _get(Checkbox.prototype.__proto__ || Object.getPrototypeOf(Checkbox.prototype), "_getDescription", this).call(this);
            desc.text = this._text;

            desc.onChange = function (checked) {
                _this14._isChecked = checked;
                if (_this14._onChange) _this14._onChange.call(_this14, checked);
            };
            desc.isChecked = this._isChecked;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(Checkbox.prototype.__proto__ || Object.getPrototypeOf(Checkbox.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.text = desc.text;
        }
    }]);

    return Checkbox;
}(Widget);

/**
 * A dropdown input field with a set number of items that the user can choose from.
 */


var Dropdown = function (_Widget4) {
    _inherits(Dropdown, _Widget4);

    /**
     * @param {string[]} [items] String list with all the items to display in the dropdown.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when a dropdown item is selected. The callback's parameter is the index to the item that was selected.
     */
    function Dropdown() {
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var onChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, Dropdown);

        var _this15 = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this));

        _this15._type = "dropdown";
        _this15._name = _this15._type + "-" + _this15._name;
        _this15._height = 13;
        _this15._onChange = onChange;
        _this15._items = items.slice(0);
        _this15._selectedIndex = 0;
        return _this15;
    }

    /**
     * Set the on change callback.
     * @param {import("./Widget").onChangeCallback} onChange 
     */


    _createClass(Dropdown, [{
        key: "setOnChange",
        value: function setOnChange(onChange) {
            this._onChange = onChange;
        }

        /**
         * Get a copy of the dropdown items list.
         */

    }, {
        key: "getItems",
        value: function getItems() {
            return this._items.slice(0);
        }

        /**
         * Set the list of dropdown items.
         * @param {string[]} items List of all the items to display.
         */

    }, {
        key: "setItems",
        value: function setItems(items) {
            this._items = items.slice(0);
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var _this16 = this;

            var desc = _get(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), "_getDescription", this).call(this);
            desc.items = this._items;
            desc.onChange = function (i) {
                _this16._selectedIndex = i;
                if (_this16._onChange) _this16._onChange.call(_this16, i);
            };
            desc.selectedIndex = this._selectedIndex;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.items = desc.items;
            handle.selectedIndex = desc.selectedIndex;
        }
    }]);

    return Dropdown;
}(Widget);

/**
 * A number input with an increase and decrease button.
 */


var Spinner = function (_Widget5) {
    _inherits(Spinner, _Widget5);

    /**
     * Construct a spinner widget. The number of decimal places is set to the number of decimals of either the default value, or the step size whichever has more decimal places.
     * @param {number} [value] The default value of the spinner. 
     * @param {number} [step] The step size with which the spinner increases and decreases the value.
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when the spinner value changes. The callback's parameter is the new spinner value as a number.
     */
    function Spinner() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var onChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, Spinner);

        var _this17 = _possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).call(this));

        _this17._type = "spinner";
        _this17._value = Number(value);
        _this17._step = Number(step);
        _this17._decimals = Math.max(_this17.countDecimals(_this17._step), _this17.countDecimals(_this17._value));
        _this17._name = _this17._type + "-" + _this17._name;
        _this17._height = 13;
        _this17._onChange = onChange;
        return _this17;
    }

    /**
     * Set the on change callback.
     * @param {import("./Widget").onChangeCallback} onChange 
     */


    _createClass(Spinner, [{
        key: "setOnChange",
        value: function setOnChange(onChange) {
            this._onChange = onChange;
        }

        /**
         * Get the number of decimal places that the spinner displays.
         * @return {number}
         */

    }, {
        key: "getDecimalPlaces",
        value: function getDecimalPlaces() {
            return this._decimals;
        }

        /**
         * Set the number of decimal places that the spinner displays.
         * @param {*} decimals 
         */

    }, {
        key: "setDecimalPlaces",
        value: function setDecimalPlaces(decimals) {
            this._decimals = decimals;
            this.requestSync();
        }

        /**
         * Get the spinner value
         * @returns {number}
         */

    }, {
        key: "getValue",
        value: function getValue() {
            return this._value;
        }

        /**
         * Set the spinner value.
         * @param {number} value 
         */

    }, {
        key: "setValue",
        value: function setValue(value) {
            this._value = value;
            this.requestSync();
        }

        /**
         * Get the step size that the spinner value increases and decreases by.
         * @return {number}
         */

    }, {
        key: "getStep",
        value: function getStep() {
            return this._step;
        }

        /**
         * Set the step size that the spinner value increases and decreases by.
         * @param {number} step 
         */

    }, {
        key: "setStep",
        value: function setStep(step) {
            this._step = step;
            this.requestSync();
        }

        /**
         * Get the amount of decimal places of a value.
         * @param {number} val 
         */

    }, {
        key: "countDecimals",
        value: function countDecimals(val) {
            if (val % 1 != 0) return val.toString().split(".")[1].length;
            return 0;
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var _this18 = this;

            var desc = _get(Spinner.prototype.__proto__ || Object.getPrototypeOf(Spinner.prototype), "_getDescription", this).call(this);
            desc.text = this._value.toFixed(this._decimals);
            desc.onIncrement = function () {
                _this18._value += _this18._step;
                _this18._value = Number(_this18._value.toFixed(_this18._decimals));
                if (_this18._onChange) _this18._onChange.call(_this18, _this18._value);
                _this18.requestSync();
            };
            desc.onDecrement = function () {
                _this18._value -= _this18._step;
                _this18._value = Number(_this18._value.toFixed(_this18._decimals));
                if (_this18._onChange) _this18._onChange.call(_this18, _this18._value);
                _this18.requestSync();
            };
            desc.isChecked = this._isChecked;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(Spinner.prototype.__proto__ || Object.getPrototypeOf(Spinner.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.text = desc.text;
        }
    }]);

    return Spinner;
}(Widget);

/**
 * A column within a list view.
 */


var ListViewColumn = function () {
    function ListViewColumn() {
        var header = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, ListViewColumn);

        this._listView = null;
        this._header = header;
        this._headerTooltip = "";

        this._canSort = false;

        this._widthMode = "auto"; // auto, ratio, fixed
        this._width = 0;
        this._minWidth = -1;
        this._maxWidth = -1;
        this._ratioWidth = 0;
    }

    /**
     * Get the header tooltip.
     */


    _createClass(ListViewColumn, [{
        key: "getTooltip",
        value: function getTooltip() {
            return this._headerTooltip;
        }

        /**
         * Set the header tooltip.
         * @param {string} text 
         */

    }, {
        key: "setTooltip",
        value: function setTooltip(text) {
            this._headerTooltip = text;
        }

        /**
         * Set wether or not the column can be sorted.
         * @param {boolean} canSort
         */

    }, {
        key: "setCanSort",
        value: function setCanSort(canSort) {
            this._canSort = canSort;
            this.requestSync();
        }

        /**
         * Get wether or not the column can be sorted.
         * @returns {boolean}
         */

    }, {
        key: "canSort",
        value: function canSort() {
            return this._canSort;
        }

        /**
         * Get the sorting order.
         * @returns {SortOrder}
         */

    }, {
        key: "getSortingOrder",
        value: function getSortingOrder() {
            return this._sortOrder;
        }

        /**
         * Get the width mode ("auto", "ratio" or "fixed")
         * @returns {string}
         */

    }, {
        key: "getWidthMode",
        value: function getWidthMode() {
            return this._widthMode;
        }

        /**
         * Get the fixed width of the column if set.
         * @returns {number} 
         */

    }, {
        key: "getWidth",
        value: function getWidth() {
            return this._width;
        }

        /**
         * Set the fixed width of the column. Set to -1 to make the width dynamic.
         * @param {number} width 
         */

    }, {
        key: "setWidth",
        value: function setWidth(width) {
            if (width == -1) {
                this._widthMode = "auto";
            }
            this._widthMode = "fixed";
            this._width = width;
            this.requestSync();
        }

        /**
         * Get the ratio width if set.
         * @returns {number}
         */

    }, {
        key: "getRatioWidth",
        value: function getRatioWidth() {
            return this._ratioWidth;
        }

        /**
         * Set the ratio width. All columns in the listview need to have their ratio width set in order for this to work.
         * @param {number} ratio 
         */

    }, {
        key: "setRatioWidth",
        value: function setRatioWidth(ratio) {
            this._widthMode = "ratio";
            this._ratioWidth = ratio;
            this.requestSync();
        }

        /**
         * Get the minimum width if set.
         * @returns {number}
         */

    }, {
        key: "getMinWidth",
        value: function getMinWidth() {
            return this._minWidth;
        }

        /**
         * Set the minimum width of the column in pixels. The minimum width only works in the "auto" width mode. Set to -1 to disable.
         * @param {*} minWidth 
         */

    }, {
        key: "setMinWidth",
        value: function setMinWidth(minWidth) {
            this._minWidth = minWidth;
        }

        /**
         * Get the maximum width if set.
         * @returns {number}
         */

    }, {
        key: "getMaxWidth",
        value: function getMaxWidth() {
            return this._minWidth;
        }

        /**
         * Set the maximum width of the column in pixels. The maximum width only works in the "auto" width mode. Set to -1 to disable.
         * @param {*} maxWidth 
         */

    }, {
        key: "setMaxWidth",
        value: function setMaxWidth(maxWidth) {
            this._maxWidth = maxWidth;
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var desc = {
                header: this._header,
                canSort: this._canSort,
                headerTooltip: this._headerTooltip
            };
            if (this._widthMode == "auto") {
                if (this._minWidth > 0) {
                    desc.minWidth = this._minWidth;
                }
                if (this._maxWidth > 0) {
                    desc.maxWidth = this._maxWidth;
                }
            } else if (this._widthMode == "ratio") {
                desc.ratioWidth = this._ratioWidth;
            } else if (this._widthMode == "fixed") {
                desc.width = this._width;
            }

            return desc;
        }
    }, {
        key: "requestSync",
        value: function requestSync() {
            if (this._listView != null) {
                this._listView.requestSync();
            }
        }
    }]);

    return ListViewColumn;
}();

/**
 * @callback onListViewCallback
 * @param {number} row The row/item index
 * @param {number} column The column index
 */

/**
 * A list view to display a list of items in a scrollable box.
 */


var ListView = function (_Widget6) {
    _inherits(ListView, _Widget6);

    /**
     * @param {onListViewCallback} [onClick ]
     */
    function ListView() {
        var onClick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, ListView);

        var _this19 = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this));

        _this19._type = "listview";
        _this19._name = _this19._type + "-" + _this19._name;
        _this19._height = 64;

        _this19._scrollbars = "vertical";
        _this19._isStriped = false;
        _this19._showColumnHeaders = true;
        _this19._canSelect = false;

        _this19._columns = [];
        _this19._items = [];

        _this19._highlightedRow = -1;
        _this19._highlightedColumn = -1;

        _this19._selectedRow = -1;
        _this19._selectedColumn = -1;

        _this19._onHighlight = null;
        _this19._onClick = onClick;
        return _this19;
    }

    /**
     * Set the on click callback for when an item within the list view is clicked.
     * @param {onListViewCallback} onClick 
     */


    _createClass(ListView, [{
        key: "setOnClick",
        value: function setOnClick(onClick) {
            this._onClick = onClick;
        }

        /**
         * Set the on higlight callback for when an item within the list view is highlighted.
         * @param {onListViewCallback} onHighlight 
         */

    }, {
        key: "setOnHighlight",
        value: function setOnHighlight(onHighlight) {
            this._onHighlight = onHighlight;
        }

        /**
         * @typedef {Object} ListViewCell
         * @property {number} row - The row/item index
         * @property {number} column - The column index
         */

        /**
         * Get the selected cell.
         * @returns {ListViewCell}
         */

    }, {
        key: "getSelectedCell",
        value: function getSelectedCell() {
            return {
                row: this._selectedRow,
                column: this._selectedColumn
            };
        }

        /**
         * Set the selected cell.
         * @param {*} row 
         * @param {*} [column] Default to 0
         */

    }, {
        key: "setSelectedCell",
        value: function setSelectedCell(row) {
            var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            this._selectedRow = row;
            this._selectedColumn = column;
            this.requestSync();
        }

        /**
         * Wether or not the items can be selected.
         * @returns {boolean}
         */

    }, {
        key: "canSelect",
        value: function canSelect() {
            return this._canSelect;
        }

        /**
         * Set wether or not the items can be selected.
         * @param {boolean} canSelect 
         */

    }, {
        key: "setCanSelect",
        value: function setCanSelect(canSelect) {
            this._canSelect = canSelect;
            this.requestSync();
        }

        /**
         * Wether or not to show the column header.
         * @returns {boolean}
         */

    }, {
        key: "showColumnHeaders",
        value: function showColumnHeaders() {
            return this._showColumnHeaders;
        }

        /**
         * Wether or not to show the column header. The headers can only be visible when the columns are set.
         * @param {boolean} showColumnHeaders
         */

    }, {
        key: "setShowColumnHeaders",
        value: function setShowColumnHeaders(showColumnHeaders) {
            this._showColumnHeaders = showColumnHeaders;
            this.requestSync();
        }

        /**
         * Wether or not the item color is different for every other item.
         * @returns {boolean}
         */

    }, {
        key: "isStriped",
        value: function isStriped() {
            return this._isStriped;
        }

        /**
         * Set wether or not the item color is different for every other item.
         * @param {boolean} striped
         */

    }, {
        key: "setIsStriped",
        value: function setIsStriped(striped) {
            this._isStriped = striped;
            this.requestSync();
        }

        /**
         * @param {ListViewColumn|string} columns 
         */

    }, {
        key: "setColumns",
        value: function setColumns(columns) {
            var originalColumnsSize = this._columns.length;
            if (columns.length > 0) {
                var listViewColumns = columns;

                // Convert string columns to list view columns first
                if (typeof columns[0] === "string") {
                    listViewColumns = [];
                    for (var i = 0; i < columns.length; i++) {
                        var listViewColumn = new ListViewColumn(columns[i]);
                        listViewColumns.push(listViewColumn);
                    }
                }
                for (var _i5 = 0; _i5 < listViewColumns.length; _i5++) {
                    listViewColumns[_i5]._listView = this;
                }
                this._columns = listViewColumns;
            }
            if (this._columns.length != originalColumnsSize) {
                this.requestRefresh();
            } else {
                this.requestSync();
            }
        }

        /**
         * Get all the columns in this list view.
         * @returns {ListViewColumn[]}
         */

    }, {
        key: "getColumns",
        value: function getColumns() {
            return this._columns;
        }

        /**
         * Add an item to the list of items. Either as a string for list views with zero  or one columns, or as a string array with one item for each column.
         * @param {string[]|string} columns 
         */

    }, {
        key: "addItem",
        value: function addItem(columns) {
            if (this._columns.length > 1 && (typeof columns === "string" || typeof columns !== "string" && columns.length <= 1)) {
                throw new Error("Expected " + this._columns.length + " but only got one column for the item.");
            }
            if (typeof columns !== "string" && columns.length > 1 && columns.length != this._columns.length) {
                throw new Error("The number of fields in the item is not equal to the number of columns on this list view.");
            }
            if (typeof columns === "string") {
                columns = [columns];
            }
            this._items.push(columns);
            this.requestRefresh();
        }

        /**
         * Get all the items in this list view.
         * @returns {string[]}
         */

    }, {
        key: "getItems",
        value: function getItems() {
            return this._items;
        }

        /**
         * Remove item at the specified index.
         * @param {number} index 
         */

    }, {
        key: "removeItem",
        value: function removeItem(index) {
            this._items.splice(index, 1);
            this.requestRefresh();
        }

        /**
         * @returns {ScrollbarType}
         */

    }, {
        key: "getScrollbars",
        value: function getScrollbars() {
            return this._scrollbars;
        }

        /**
         * Set which scrollbars are available on the listview.
         * @param {ScrollbarType} scrollbars 
         */

    }, {
        key: "setScrollbars",
        value: function setScrollbars(scrollbars) {
            this._scrollbars = scrollbars;
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var _this20 = this;

            var desc = _get(ListView.prototype.__proto__ || Object.getPrototypeOf(ListView.prototype), "_getDescription", this).call(this);
            desc.scrollbars = this._scrollbars;
            desc.isStriped = this._isStriped;

            desc.onClick = function (item, column) {
                _this20._selectedRow = item;
                _this20._selectedColumn = column;
                if (_this20._onClick != null) _this20._onClick.call(_this20, _this20._selectedRow, _this20._selectedColumn);
            };
            desc.onHighlight = function (item, column) {
                _this20._highlightedRow = item;
                _this20._highlightedColumn = column;
                if (_this20._onHighlight != null) _this20._onHighlight.call(_this20, _this20._highlightedRow, _this20._highlightedColumn);
            };

            desc.showColumnHeaders = this._showColumnHeaders;
            if (this._columns.length == 0) desc.showColumnHeaders = false; // Showing column headers when there are no columns causes a crash.

            desc.canSelect = this._canSelect;

            if (this._canSelect && this._selectedRow > 0 && this._selectedColumn > 0) {
                desc.selectedCell = {
                    row: this._selectedRow,
                    column: this._selectedColumn
                };
            }

            var columnDesc = [];
            for (var i = 0; i < this._columns.length; i++) {
                columnDesc.push(this._columns[i]._getDescription());
            }
            desc.columns = columnDesc;

            desc.items = this._items;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(ListView.prototype.__proto__ || Object.getPrototypeOf(ListView.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.scrollbars = desc.scrollbars;
            handle.isStriped = desc.isStriped;
            handle.showColumnHeaders = desc.showColumnHeaders;
            handle.canSelect = desc.canSelect;

            /*
            if (desc.selectedCell) {
                if (handle.selectedCell == null) {
                    handle.selectedCell = desc.selectedCell;
                }
                else {
                    handle.selectedCell.row = desc.selectedCell.row;
                    handle.selectedCell.column = desc.selectedCell.column;
                }
            }
            for (let i = 0; i < handle.columns.length && i < desc.columns.length; i++) {
                handle.columns[i] = desc.columns[i];
            }
              for (let i = 0; i < handle.items.length && i < desc.items.length; i++) {
                for (let j = 0; j < handle.items[i].length && j < desc.items[i].length; j++) {
                    handle.items[i][j] = desc.items[i][j];
                }
            }*/
        }
    }]);

    return ListView;
}(Widget);

ListView.ListViewColumn = ListViewColumn;

/**
 * WIP. Viewport widget does not work as expected yet. Only use for testing.
 * A viewport widget. The size of the viewport widget cannot be changed while the window is open.
 */

var ViewportWidget = function (_Widget7) {
    _inherits(ViewportWidget, _Widget7);

    /**
     * @param {number} [viewX]
     * @param {number} [viewY] 
     */
    function ViewportWidget() {
        var viewX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var viewY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, ViewportWidget);

        var _this21 = _possibleConstructorReturn(this, (ViewportWidget.__proto__ || Object.getPrototypeOf(ViewportWidget)).call(this));

        _this21._type = "viewport";
        _this21._name = _this21._type + "-" + _this21._name;
        _this21._height = 64;

        _this21._viewX = viewX;
        _this21._viewY = viewY;
        _this21._zoom = 0;
        _this21._rotation = 0;
        _this21._visibilityFlags = 0;

        _this21._scrollView = false;

        _this21._initMove = false;
        return _this21;
    }

    /**
     * Set the viewport's focus position.
     * @param {number} viewX 
     * @param {number} viewY 
     */


    _createClass(ViewportWidget, [{
        key: "setView",
        value: function setView(viewX, viewY) {
            this._viewX = viewX;
            this._viewY = viewY;
            this._scrollView = false;

            var handle = this.getHandle();
            if (handle != null) handle.viewport.moveTo({ x: viewX, y: viewY });
        }
    }, {
        key: "scrollView",
        value: function scrollView(viewX, viewY) {
            this._viewX = viewX;
            this._viewY = viewY;
            this._scrollView = true;

            var handle = this.getHandle();
            if (handle != null) handle.viewport.scrollTo({ x: viewX, y: viewY });
        }

        /**
         * Set the viewport's zoom level. 0 is fully zoomed in.
         * @param {number} zoomLevel 
         */

    }, {
        key: "setZoom",
        value: function setZoom(zoomLevel) {
            this._zoom = zoomLevel;
            this.requestSync();
        }

        /**
         * Set the viewport's rotation.
         * @param {number} rotation
         */

    }, {
        key: "setRotation",
        value: function setRotation(rotation) {
            this._rotation = rotation;
            this.requestSync();
        }
    }, {
        key: "_getDescription",
        value: function _getDescription() {
            var desc = _get(ViewportWidget.prototype.__proto__ || Object.getPrototypeOf(ViewportWidget.prototype), "_getDescription", this).call(this);

            this._initMove = true;
            this.requestSync();
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            handle.x = desc.x;
            handle.y = desc.y;
            handle.width = desc.width;
            handle.height = desc.height;
            //super._applyDescription(handle, desc);

            handle.viewport.rotation = this._rotation;
            handle.viewport.zoom = this._zoom;
            //handle.viewport.visibilityFlags = this._visibilityFlags;

            if (this._initMove) {
                handle.viewport.moveTo({ x: this._viewX, y: this._viewY });
                this._initMove = false;
            }
        }
    }, {
        key: "_update",
        value: function _update() {
            _get(ViewportWidget.prototype.__proto__ || Object.getPrototypeOf(ViewportWidget.prototype), "_update", this).call(this);
        }
    }]);

    return ViewportWidget;
}(Widget);

/**
 * Dropdown implementation for a color picker as a temporary solution until a real color picker widget is added to the OpenRCT2 plugin API.
 */


var ColorPicker = function (_Dropdown) {
    _inherits(ColorPicker, _Dropdown);

    /**
     * 
     * @param {import("./Widget").onChangeCallback} [onChange] Callback for when a color is selected. The callback's parameter is the color palette index.
     */
    function ColorPicker() {
        var onChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, ColorPicker);

        var _this22 = _possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this, ["Black", "Grey", "White", "Dark Purple", "Light Purple", "Bright Purple", "Dark Blue", "Light Blue", "Icy Blue", "Teal", "Aquamarine", "Saturated Green", "Dark Green", "Moss Green", "Bright Green", "Olive Green", "Dark Olive Green", "Bright Yellow", "Yellow", "Dark Yellow", "Light Orange", "Dark Orange", "Light Brown", "Saturated Brown", "Dark Brown", "Salmon Pink", "Bordeaux Red", "Saturated Red", "Bright Red", "Dark Pink", "Bright Pink", "Light Pink"], onChange));

        _this22._height = 12;
        return _this22;
    }

    return ColorPicker;
}(Dropdown);

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Label: Label,
    TextButton: TextButton,
    ImageButton: ImageButton,
    Checkbox: Checkbox,
    Dropdown: Dropdown,
    Spinner: Spinner,
    ListView: ListView,
    ViewportWidget: ViewportWidget,
    ColorPicker: ColorPicker,
    Button: TextButton
});

// This file bundles all the objects in OlUI so it can later be exported under a single namespace.

var Oui = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BaseClasses: BaseClasses,
    Widgets: index,
    Window: Window,
    VerticalBox: VerticalBox,
    HorizontalBox: HorizontalBox,
    GroupBox: GroupBox
});

var LocationPrompt = function () {
    function LocationPrompt() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "location-prompt";

        _classCallCheck(this, LocationPrompt);

        this.id = id;
        this.cursor = "cross_hair";
        this.onFinish = null;
        this.onCancelled = null;

        this.selectedCoords = { x: 0, y: 0 };
    }

    _createClass(LocationPrompt, [{
        key: "setSelectionRange",
        value: function setSelectionRange(start, end) {
            var left = Math.min(start.x, end.x);
            var right = Math.max(start.x, end.x);
            var top = Math.min(start.y, end.y);
            var bottom = Math.max(start.y, end.y);
            ui.tileSelection.range = {
                leftTop: { x: left, y: top },
                rightBottom: { x: right, y: bottom }
            };
        }
    }, {
        key: "prompt",
        value: function prompt() {
            var _this23 = this;

            var onFinish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var onCancelled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (ui.tool && ui.tool.id == this.id) {
                this.cancel();
            }
            this.onFinish = onFinish;
            this.onCancelled = onCancelled;

            ui.activateTool({
                id: this.id,
                cursor: this.cursor,
                onStart: function onStart(e) {
                    ui.mainViewport.visibilityFlags |= 1 << 7;
                },
                onDown: function onDown(e) {
                    _this23.selectedCoords = e.mapCoords;
                    _this23.setSelectionRange(_this23.selectedCoords, _this23.selectedCoords);
                },
                onMove: function onMove(e) {
                    _this23.selectedCoords = e.mapCoords;
                    _this23.setSelectionRange(_this23.selectedCoords, _this23.selectedCoords);
                },
                onUp: function onUp(e) {
                    _this23.selectedCoords = e.mapCoords;
                    _this23.setSelectionRange(_this23.selectedCoords, _this23.selectedCoords);
                    if (_this23.onFinish) _this23.onFinish(Math.floor(_this23.selectedCoords.x / 32), Math.floor(_this23.selectedCoords.y / 32));
                    ui.tileSelection.range = null;
                    ui.tool.cancel();
                },
                onFinish: function onFinish() {
                    ui.tileSelection.range = null;
                    ui.mainViewport.visibilityFlags &= ~(1 << 7);
                }
            });
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (ui.tool && ui.tool.id == this.id) {
                if (this.onCancelled) {
                    this.onCancelled();
                }
                ui.tool.cancel();
            }
        }
    }]);

    return LocationPrompt;
}();

var LocationPromptWidget = function () {
    function LocationPromptWidget(title, locationPrompt) {
        var onSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, LocationPromptWidget);

        this.element = this._createElements(title, locationPrompt);

        this.isSet = false;
        this.onSet = onSet;
    }

    _createClass(LocationPromptWidget, [{
        key: "_createElements",
        value: function _createElements(title, locationPrompt) {
            var _this24 = this;

            var groupbox = new Oui.GroupBox(title);
            groupbox.setWidth(120);

            var promptLocationButton = new Oui.Widgets.Button("Select Location", function () {
                if (!promptLocationButton.isPressed()) {
                    locationPrompt.prompt(function (x, y) {
                        promptLocationButton.setIsPressed(false);
                        statusLabel.setText("Set");
                        //statusLabel.setTooltip("x: " + x + ", y: " + y);
                        _this24.isSet = true;
                        if (_this24.onSet) _this24.onSet(x, y);
                    }, function () {
                        promptLocationButton.setIsPressed(false);
                    });
                    promptLocationButton.setIsPressed(true);
                } else {
                    locationPrompt.cancel();
                    promptLocationButton.setIsPressed(false);
                }
            });
            groupbox.addChild(promptLocationButton);

            var statusLabel = new Oui.Widgets.Label("Unset");
            groupbox.addChild(statusLabel);

            return groupbox;
        }
    }]);

    return LocationPromptWidget;
}();

var TrainSensor = function () {
    function TrainSensor(rideId, x, y, onExit) {
        _classCallCheck(this, TrainSensor);

        this.rideId = rideId;
        this.x = x;
        this.y = y;

        this._sensedEntityId = -1;

        this.onExit = onExit;
    }

    _createClass(TrainSensor, [{
        key: "isValid",
        value: function isValid() {
            if (this.rideId == -1 || this.onExit == null) return false;
            if (this.x == -1 || this.y == -1) return false;
            return true;
        }
    }, {
        key: "test",
        value: function test(car) {
            if (car.ride != this.rideId) return false;
            if (car.nextCarOnTrain != null) // Last car on the train
                return false;

            if (this._sensedEntityId >= 0) {
                if (Math.floor(car.x / 32) != this.x && Math.floor(car.y / 32) != this.y) {
                    if (this._sensedEntityId == car.id) {
                        this._sensedEntityId = -1;
                        if (this.onExit) this.onExit();
                        return true;
                    }
                }
            } else {
                if (Math.floor(car.x / 32) == this.x && Math.floor(car.y / 32) == this.y) {
                    this._sensedEntityId = car.id;
                }
            }
            return false;
        }
    }]);

    return TrainSensor;
}();

var AdvancedTrackManager = function () {
    function AdvancedTrackManager() {
        _classCallCheck(this, AdvancedTrackManager);

        this.sensors = [];
    }

    _createClass(AdvancedTrackManager, [{
        key: "tick",
        value: function tick() {
            var carEntities = map.getAllEntities("car");
            for (var i = 0; i < this.sensors.length; i++) {
                var sensor = this.sensors[i];
                if (!sensor.isValid()) continue;

                for (var j = 0; j < carEntities.length; j++) {
                    var car = carEntities[j];
                    sensor.test(car);
                }
            }
        }
    }]);

    return AdvancedTrackManager;
}();

var SensorSwitchWindow = function () {
    function SensorSwitchWindow(sensor) {
        _classCallCheck(this, SensorSwitchWindow);

        this.sensor = sensor;
        this.locationPrompt = new LocationPrompt("loc-prompt");
        this.window = this.createWindow();
    }

    _createClass(SensorSwitchWindow, [{
        key: "createWindow",
        value: function createWindow() {
            var _this25 = this;

            var that = this;

            var window = new Oui.Window("advanced-track-sensor-switch", "Advanced Track - Edit Sensor Switch");
            window.setWidth(300);

            window.setOnClose(function () {
                that.locationPrompt.cancel();
            });

            var label = new Oui.Widgets.Label("Select the location for the sensor,");
            window.addChild(label);
            var label2 = new Oui.Widgets.Label("and the location of the track to switch.");
            window.addChild(label2);

            var horBox = new Oui.HorizontalBox();
            window.addChild(horBox);

            var sensorLoc = new LocationPromptWidget("Sensor", this.locationPrompt, function (x, y) {
                _this25.sensor.x = x;
                _this25.sensor.y = y;

                var track = MapHelper.GetTrackElement(map.getTile(x, y));
                _this25.sensor.rideId = track.ride;
            });
            sensorLoc.element.setRelativeWidth(50);
            horBox.addChild(sensorLoc.element);

            var switchLoc = new LocationPromptWidget("Switch", this.locationPrompt, function (x, y) {
                _this25.sensor.onExit = function () {
                    MapHelper.SwitchTrackElements(map.getTile(x, y));
                };
            });
            switchLoc.element.setRelativeWidth(50);
            horBox.addChild(switchLoc.element);

            return window;
        }
    }]);

    return SensorSwitchWindow;
}();

var AdvancedTrackWindow = function () {
    function AdvancedTrackWindow(advancedTrackManager) {
        _classCallCheck(this, AdvancedTrackWindow);

        this.advancedTrackManager = advancedTrackManager;

        this.listView = null;
        this.window = this.createWindow();

        this.selectedTriggerType = 0;
        this.selectedReactionType = 0;
        this.selectedItem = 0;

        this.editWindow = null;
    }

    _createClass(AdvancedTrackWindow, [{
        key: "open",
        value: function open() {
            // Update listview.

            this.listView._items = [];
            for (var i = 0; i < this.advancedTrackManager.sensors.length; i++) {
                var sensor = this.advancedTrackManager.sensors[i];
                this.listView._items.push(this.getRowFromItem(sensor, i));
            }

            this.window.open();
        }
    }, {
        key: "createWindow",
        value: function createWindow() {
            var _this26 = this;

            var that = this;

            var window = new Oui.Window("advanced-track-main", "Advanced Track");
            window._paddingBottom = 14;
            window._paddingLeft = 6;
            window._paddingRight = 6;
            window.setWidth(400);
            window.setHorizontalResize(true, 300, 600);
            window.setHeight(200);
            window.setVerticalResize(true, 200, 600);

            var label = new Oui.Widgets.Label("Advanced Track Elements");
            window.addChild(label);

            var listView = new Oui.Widgets.ListView();
            this.listView = listView;
            listView.setCanSelect(true);
            listView.setColumns(["ID", "Type", "Ride", "Location", "Valid"]);
            listView.getColumns()[0].setWidth(20);
            window.addChild(listView);
            window.setRemainingHeightFiller(listView);

            var infoBar = new Oui.HorizontalBox();
            infoBar.setRelativeWidth(100);
            infoBar.setHeight(50);
            window.addChild(infoBar);

            /*
            let viewport = new Oui.Widgets.ViewportWidget();
            viewport.setRelativeWidth(50);
            viewport.setHeight(100);
            infoBar.addChild(viewport);*/

            var infoRight = new Oui.GroupBox("Element");
            infoRight.setRelativeHeight(100);
            infoBar.addChild(infoRight);
            infoBar.setRemainingWidthFiller(infoRight);

            var editButton = new Oui.Widgets.Button("Edit", function () {
                that.openEditWindow(that.selectedItem);
            });
            infoRight.addChild(editButton);

            var deleteButton = new Oui.Widgets.Button("Delete", function () {
                infoRight.setIsDisabled(true);
            });
            infoRight.addChild(deleteButton);

            infoRight.setIsDisabled(true);

            listView.setOnClick(function (row, column) {
                var sensor = that.advancedTrackManager.sensors[row];
                that.selectedItem = sensor;
                //viewport.setView(sensor.x, sensor.y);
                infoRight.setIsDisabled(false);
            });

            var bottom = new Oui.HorizontalBox();
            window.addChild(bottom);

            var filler = new Oui.VerticalBox();
            bottom.addChild(filler);
            bottom.setRemainingWidthFiller(filler);

            var elementTypes = new Oui.Widgets.Dropdown(["Vehicle Sensor"], function (index) {
                _this26.selectedTriggerType = index;
            });
            elementTypes.setWidth(100);
            elementTypes.setHeight(13);
            bottom.addChild(elementTypes);

            var elementReactionTypes = new Oui.Widgets.Dropdown(["Track Switch"], function (index) {
                _this26.selectedReactionType = index;
            });
            elementReactionTypes.setWidth(100);
            elementReactionTypes.setHeight(13);
            bottom.addChild(elementReactionTypes);

            var addButton = new Oui.Widgets.Button("Create New", function () {
                var newSensor = new TrainSensor(-1, -1, -1, null);
                that.advancedTrackManager.sensors.push(newSensor);

                that.openEditWindow(newSensor);
            });
            addButton.setHeight(13);
            addButton.setWidth(100);
            bottom.addChild(addButton);

            return window;
        }
    }, {
        key: "openEditWindow",
        value: function openEditWindow(item) {
            this.window._handle.close();
            if (this.editWindow != null) {
                if (this.editWindow._handle) {
                    this.editWindow._handle.close();
                }
            }

            this.editWindow = new SensorSwitchWindow(item);
            this.editWindow.window.open();
        }
    }, {
        key: "getRowFromItem",
        value: function getRowFromItem(item, i) {
            var ride = map.getRide(item.rideId);
            if (ride == null) {
                return [i + "", "Sensor Switch", "Ride not found", item.x + ", " + item.y, "False"];
            }

            return [i + "", "Sensor Switch", ride.name, item.x + ", " + item.y, item.isValid() ? "True" : "False"];
        }
    }]);

    return AdvancedTrackWindow;
}();

function main() {
    var advancedTrackManager = new AdvancedTrackManager();
    var advancedTrackWindow = new AdvancedTrackWindow(advancedTrackManager);

    ui.registerMenuItem("Advanced Track", function () {
        advancedTrackWindow.open();
    });

    context.subscribe("interval.tick", function () {
        advancedTrackManager.tick();
    });
}

registerPlugin({
    name: 'AdvancedTrack',
    version: '0.1',
    licence: "MIT",
    authors: ['Oli414'],
    type: 'local',
    main: main
});
