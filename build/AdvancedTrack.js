"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocationPrompt = function () {
    function LocationPrompt() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "location-prompt";

        _classCallCheck(this, LocationPrompt);

        this.id = id;
        this.cursor = "cross_hair";
        this.onFinish = null;
        this.onCancelled = null;

        this.selectedCoords = { x: 0, y: 0 };

        this.hasGridOn = false;
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
            var _this = this;

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
                    ui.tileSelection.range = null;
                    ui.mainViewport.visibilityFlags |= 1 << 7;
                },
                onDown: function onDown(e) {
                    _this.selectedCoords = e.mapCoords;
                    _this.setSelectionRange(_this.selectedCoords, _this.selectedCoords);
                },
                onMove: function onMove(e) {
                    _this.selectedCoords = e.mapCoords;
                    _this.setSelectionRange(_this.selectedCoords, _this.selectedCoords);
                },
                onUp: function onUp(e) {
                    _this.selectedCoords = e.mapCoords;
                    _this.setSelectionRange(_this.selectedCoords, _this.selectedCoords);
                    ui.tileSelection.range = null;
                    ui.tool.cancel();
                },
                onFinish: function onFinish() {
                    ui.tileSelection.range = null;
                    ui.mainViewport.visibilityFlags &= ~(1 << 7);
                    if (_this.onFinish) _this.onFinish(Math.floor(_this.selectedCoords.x / 32), Math.floor(_this.selectedCoords.y / 32));
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

var Trigger = function () {
    function Trigger(element) {
        _classCallCheck(this, Trigger);

        this.element = element;

        this.validationMessage = "";
    }

    _createClass(Trigger, [{
        key: "getTiles",
        value: function getTiles() {
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            return true;
        }
    }, {
        key: "test",
        value: function test(carDetails) {
            return false;
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {};
        }
    }, {
        key: "createWidget",
        value: function createWidget() {}
    }]);

    return Trigger;
}();

/**
 * The element class is the base class for all UI elements.
 */


var Element$1 = function () {
    function Element$1() {
        _classCallCheck(this, Element$1);

        this._parent = null;

        this._marginTop = 4;
        this._marginBottom = 4;
        this._marginLeft = 4;
        this._marginRight = 4;

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


    _createClass(Element$1, [{
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

    return Element$1;
}();

/**
 * The box class is the base class for UI elements that is able to hold children.
 * @extends Element
 */


var Box = function (_Element$) {
    _inherits(Box, _Element$);

    function Box() {
        _classCallCheck(this, Box);

        var _this2 = _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this));

        _this2._width = 100;

        _this2.setPadding(4, 4, 6, 6);

        _this2._isHorizontal = false;

        _this2._children = [];
        return _this2;
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
}(Element$1);

/**
 * The vertical box is an element that holds children and positions them vertically in a top to bottom fasion.
 */


var VerticalBox = function (_Box) {
    _inherits(VerticalBox, _Box);

    function VerticalBox() {
        _classCallCheck(this, VerticalBox);

        var _this3 = _possibleConstructorReturn(this, (VerticalBox.__proto__ || Object.getPrototypeOf(VerticalBox)).call(this));

        _this3._remainingHeightFiller = null;
        return _this3;
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

        var _this4 = _possibleConstructorReturn(this, (Window.__proto__ || Object.getPrototypeOf(Window)).call(this));

        _this4._hasRelativeWidth = false;
        _this4._width = 100;

        _this4._height = _this4._paddingTop + _this4._paddingBottom;

        _this4._handle = null;

        _this4._title = title;
        _this4._classification = classification;

        _this4._canResizeHorizontally = false;
        _this4._minWidth = 100;
        _this4._maxWidth = 100;
        _this4._canResizeVertically = false;
        _this4._minHeight = 100;
        _this4._maxHeight = 100;

        _this4._titleBarColor = 1;
        _this4._mainColor = 1;

        _this4._requestedRefresh = false;
        _this4._openAtPosition = false;

        _this4._onUpdate = null;
        _this4._onClose = null;
        return _this4;
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
            var _this5 = this;

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
                    _this5._update();
                    if (_this5._onUpdate != null) _this5._onUpdate.call(_this5);
                },
                onClose: function onClose() {
                    _this5._handle = null;
                    if (_this5._onClose != null) _this5._onClose.call(_this5);
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

        var _this6 = _possibleConstructorReturn(this, (HorizontalBox.__proto__ || Object.getPrototypeOf(HorizontalBox)).call(this));

        _this6._remainingWidthFiller = null;
        _this6._isHorizontal = true;
        return _this6;
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

var Widget = function (_Element$2) {
    _inherits(Widget, _Element$2);

    function Widget() {
        _classCallCheck(this, Widget);

        var _this7 = _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).call(this));

        _this7.setMargins(2, 4, 2, 2);
        _this7._type = "none";
        _this7._name = NumberGen();
        return _this7;
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
}(Element$1);

Widget.NumberGen = NumberGen;

/**
 * The group box is a vertical box that a border and an optional label.
 */

var GroupBox = function (_VerticalBox2) {
    _inherits(GroupBox, _VerticalBox2);

    function GroupBox() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        _classCallCheck(this, GroupBox);

        var _this8 = _possibleConstructorReturn(this, (GroupBox.__proto__ || Object.getPrototypeOf(GroupBox)).call(this));

        _this8._text = text;
        _this8._name = "groupbox-" + Widget.NumberGen();
        if (_this8._text != "") _this8._paddingTop = 15;else _this8._paddingTop = 10;
        _this8._paddingBottom = 6;
        return _this8;
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

        var _this9 = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));

        _this9._type = "button";
        _this9._name = _this9._type + "-" + _this9._name;
        _this9._height = 13;
        _this9._onClick = onClick;
        _this9._hasBorder = true;
        _this9._isPressed = false;
        return _this9;
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
            var _this10 = this;

            var desc = _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), "_getDescription", this).call(this);
            desc.onClick = function () {
                if (_this10._onClick) _this10._onClick.call(_this10);
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
    Element: Element$1,
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

        var _this11 = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this));

        _this11._marginTop = 2;
        _this11._marginBottom = 2;
        _this11._marginLeft = 2;
        _this11._marginRight = 2;

        _this11._type = "label";
        _this11._text = text;
        _this11._name = _this11._type + "-" + _this11._name;
        _this11._height = 10;
        return _this11;
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

        var _this12 = _possibleConstructorReturn(this, (TextButton.__proto__ || Object.getPrototypeOf(TextButton)).call(this, onClick));

        _this12._text = text;
        return _this12;
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

        var _this13 = _possibleConstructorReturn(this, (ImageButton.__proto__ || Object.getPrototypeOf(ImageButton)).call(this, onClick));

        _this13._image = image;
        _this13._hasBorder = false;
        return _this13;
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

        var _this14 = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this));

        _this14._type = "checkbox";
        _this14._text = text;
        _this14._name = _this14._type + "-" + _this14._name;
        _this14._height = 10;
        _this14._onChange = onChange;
        _this14._isChecked = false;
        return _this14;
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
            var _this15 = this;

            var desc = _get(Checkbox.prototype.__proto__ || Object.getPrototypeOf(Checkbox.prototype), "_getDescription", this).call(this);
            desc.text = this._text;

            desc.onChange = function (checked) {
                _this15._isChecked = checked;
                if (_this15._onChange) _this15._onChange.call(_this15, checked);
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

        var _this16 = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this));

        _this16._type = "dropdown";
        _this16._name = _this16._type + "-" + _this16._name;
        _this16._height = 13;
        _this16._onChange = onChange;
        _this16._items = items.slice(0);
        _this16._selectedIndex = 0;
        return _this16;
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
    }, {
        key: "getSelectedItem",
        value: function getSelectedItem() {
            return this._selectedIndex;
        }
    }, {
        key: "setSelectedItem",
        value: function setSelectedItem(itemIndex) {
            this._selectedIndex = itemIndex;
            this.requestSync();
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
            var _this17 = this;

            var desc = _get(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), "_getDescription", this).call(this);
            desc.items = this._items;
            desc.onChange = function (i) {
                _this17._selectedIndex = i;
                if (_this17._onChange) _this17._onChange.call(_this17, i);
            };
            desc.selectedIndex = this._selectedIndex;
            return desc;
        }
    }, {
        key: "_applyDescription",
        value: function _applyDescription(handle, desc) {
            _get(Dropdown.prototype.__proto__ || Object.getPrototypeOf(Dropdown.prototype), "_applyDescription", this).call(this, handle, desc);
            handle.items = desc.items;
            desc.selectedIndex = desc.selectedIndex;
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

        var _this18 = _possibleConstructorReturn(this, (Spinner.__proto__ || Object.getPrototypeOf(Spinner)).call(this));

        _this18._type = "spinner";
        _this18._value = Number(value);
        _this18._step = Number(step);
        _this18._decimals = Math.max(_this18.countDecimals(_this18._step), _this18.countDecimals(_this18._value));
        _this18._name = _this18._type + "-" + _this18._name;
        _this18._height = 13;
        _this18._onChange = onChange;
        return _this18;
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
            var _this19 = this;

            var desc = _get(Spinner.prototype.__proto__ || Object.getPrototypeOf(Spinner.prototype), "_getDescription", this).call(this);
            desc.text = this._value.toFixed(this._decimals);
            desc.onIncrement = function () {
                _this19._value += _this19._step;
                _this19._value = Number(_this19._value.toFixed(_this19._decimals));
                if (_this19._onChange) _this19._onChange.call(_this19, _this19._value);
                _this19.requestSync();
            };
            desc.onDecrement = function () {
                _this19._value -= _this19._step;
                _this19._value = Number(_this19._value.toFixed(_this19._decimals));
                if (_this19._onChange) _this19._onChange.call(_this19, _this19._value);
                _this19.requestSync();
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

        var _this20 = _possibleConstructorReturn(this, (ListView.__proto__ || Object.getPrototypeOf(ListView)).call(this));

        _this20._type = "listview";
        _this20._name = _this20._type + "-" + _this20._name;
        _this20._height = 64;

        _this20._scrollbars = "vertical";
        _this20._isStriped = false;
        _this20._showColumnHeaders = true;
        _this20._canSelect = false;

        _this20._columns = [];
        _this20._items = [];

        _this20._highlightedRow = -1;
        _this20._highlightedColumn = -1;

        _this20._selectedRow = -1;
        _this20._selectedColumn = -1;

        _this20._onHighlight = null;
        _this20._onClick = onClick;
        return _this20;
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
                for (var _i = 0; _i < listViewColumns.length; _i++) {
                    listViewColumns[_i]._listView = this;
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
            var _this21 = this;

            var desc = _get(ListView.prototype.__proto__ || Object.getPrototypeOf(ListView.prototype), "_getDescription", this).call(this);
            desc.scrollbars = this._scrollbars;
            desc.isStriped = this._isStriped;

            desc.onClick = function (item, column) {
                _this21._selectedRow = item;
                _this21._selectedColumn = column;
                if (_this21._onClick != null) _this21._onClick.call(_this21, _this21._selectedRow, _this21._selectedColumn);
            };
            desc.onHighlight = function (item, column) {
                _this21._highlightedRow = item;
                _this21._highlightedColumn = column;
                if (_this21._onHighlight != null) _this21._onHighlight.call(_this21, _this21._highlightedRow, _this21._highlightedColumn);
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
            if (desc.selectedCell) {
                if (handle.selectedCell == null) {
                    handle.selectedCell = desc.selectedCell;
                } else {
                    handle.selectedCell.row = desc.selectedCell.row;
                    handle.selectedCell.column = desc.selectedCell.column;
                }
            }

            for (var i = 0; i < handle.columns.length && i < desc.columns.length; i++) {
                handle.columns[i] = desc.columns[i];
            }

            for (var _i2 = 0; _i2 < handle.items.length && _i2 < desc.items.length; _i2++) {
                for (var j = 0; j < handle.items[_i2].length && j < desc.items[_i2].length; j++) {
                    handle.items[_i2][j] = desc.items[_i2][j];
                }
            }
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

        var _this22 = _possibleConstructorReturn(this, (ViewportWidget.__proto__ || Object.getPrototypeOf(ViewportWidget)).call(this));

        _this22._type = "viewport";
        _this22._name = _this22._type + "-" + _this22._name;
        _this22._height = 64;

        _this22._viewX = viewX;
        _this22._viewY = viewY;
        _this22._zoom = 0;
        _this22._rotation = 0;

        _this22._scrollView = false;

        _this22._initMove = false;
        return _this22;
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
            _get(ViewportWidget.prototype.__proto__ || Object.getPrototypeOf(ViewportWidget.prototype), "_applyDescription", this).call(this, handle, desc);
            //handle.viewport.rotation = this._rotation;
            //handle.viewport.zoom = this._zoom;
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

        var _this23 = _possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this, ["Black", "Grey", "White", "Dark Purple", "Light Purple", "Bright Purple", "Dark Blue", "Light Blue", "Icy Blue", "Teal", "Aquamarine", "Saturated Green", "Dark Green", "Moss Green", "Bright Green", "Olive Green", "Dark Olive Green", "Bright Yellow", "Yellow", "Dark Yellow", "Light Orange", "Dark Orange", "Light Brown", "Saturated Brown", "Dark Brown", "Salmon Pink", "Bordeaux Red", "Saturated Red", "Bright Red", "Dark Pink", "Bright Pink", "Light Pink"], onChange));

        _this23._height = 12;
        return _this23;
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

var LocationPromptWidget = function () {
    function LocationPromptWidget(text, locationPrompt, x, y) {
        var onSet = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        _classCallCheck(this, LocationPromptWidget);

        this.isSet = x > -1 && y > -1;
        this.onSet = onSet;

        this.currentLocationX = x;
        this.currentLocationY = y;

        this.element = this._createElements(text, locationPrompt);
    }

    _createClass(LocationPromptWidget, [{
        key: "_createElements",
        value: function _createElements(text, locationPrompt) {
            var that = this;
            var horizontalBox = new Oui.HorizontalBox();
            horizontalBox.setPadding(0, 0, 0, 0);

            var locateButton = null;

            var promptLocationButton = new Oui.Widgets.ImageButton(5504, function () {
                if (!promptLocationButton.isPressed()) {
                    statusLabel.setText("Select a tile...");
                    locationPrompt.prompt(function (x, y) {
                        that.currentLocationX = x;
                        that.currentLocationY = y;
                        locateButton.setIsDisabled(false);
                        promptLocationButton.setIsPressed(false);
                        statusLabel.setText("Location set (x: " + x + ", y: " + y + ")");
                        //statusLabel.setTooltip("x: " + x + ", y: " + y);
                        that.isSet = true;
                        if (that.onSet) that.onSet(x, y);
                    }, function () {
                        promptLocationButton.setIsPressed(false);
                    });
                    promptLocationButton.setIsPressed(true);
                } else {
                    if (that.isSet) {
                        statusLabel.setText("Location set (x: " + that.currentLocationX + ", y: " + that.currentLocationY + ")");
                    } else {
                        statusLabel.setText("No location");
                    }
                    locationPrompt.cancel();
                    promptLocationButton.setIsPressed(false);
                }
            });
            promptLocationButton.setWidth(44);
            promptLocationButton.setHeight(32);
            promptLocationButton.setBorder(true);
            horizontalBox.addChild(promptLocationButton);

            var infoBox = new Oui.VerticalBox();
            infoBox._paddingTop = infoBox._paddingTop + 1;
            horizontalBox.addChild(infoBox);
            horizontalBox.setRemainingWidthFiller(infoBox);

            var infoLabel = new Oui.Widgets.Label(text);
            infoBox.addChild(infoLabel);

            var statusLabel = new Oui.Widgets.Label("No location");
            infoBox.addChild(statusLabel);

            locateButton = new Oui.Widgets.ImageButton(5167, function () {
                ui.mainViewport.scrollTo({ x: that.currentLocationX * 32, y: that.currentLocationY * 32 });
            });
            locateButton.setWidth(24);
            locateButton.setHeight(24);
            locateButton.setIsDisabled(true);
            horizontalBox.addChild(locateButton);

            if (this.isSet) {
                statusLabel.setText("Location set (x: " + this.currentLocationX + ", y: " + this.currentLocationY + ")");
                locateButton.setIsDisabled(false);
            }

            return horizontalBox;
        }
    }]);

    return LocationPromptWidget;
}();

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
        key: "SetFlag2",
        value: function SetFlag2(tile, elementIndex, flag, enable) {
            var data = tile.data;
            var typeFieldIndex = 10;
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
        key: "SetBlockBrake",
        value: function SetBlockBrake(tile, blocked) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track") {
                    MapHelper.SetFlag2(tile, i, 32, blocked);
                }
            }
        }
    }, {
        key: "SetChainLift",
        value: function SetChainLift(tile, hasChain) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track") {
                    element.hasChainLift = hasChain;
                }
            }
        }
    }, {
        key: "SetBrakeBoosterSpeed",
        value: function SetBrakeBoosterSpeed(tile, speed) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track" && element.brakeBoosterSpeed != null) {
                    element.brakeBoosterSpeed = speed;
                }
            }
        }
    }, {
        key: "GetBrakeBoosterSpeed",
        value: function GetBrakeBoosterSpeed(tile) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track" && element.brakeBoosterSpeed != null) {
                    return element.brakeBoosterSpeed;
                }
            }
            return 1;
        }
    }, {
        key: "SwitchTrackElements",
        value: function SwitchTrackElements(tile) {
            var trackElements = [];
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element.type == "track") {
                    trackElements.push(i);
                }
            }

            if (trackElements.length == 0) {
                return false;
            }

            var data = tile.data;
            var trackData = [];
            for (var _i3 = 0; _i3 < trackElements.length; _i3++) {
                var a = new Uint8Array(16);
                for (var j = 0; j < 16; j++) {
                    a[j] = data[trackElements[_i3] * 16 + j];
                }
                trackData.push(a);
            }

            var prev = trackElements.length - 1;
            for (var _i4 = 0; _i4 < trackElements.length; _i4++) {
                for (var _j = 0; _j < 16; _j++) {
                    data[trackElements[_i4] * 16 + _j] = trackData[prev][_j];
                }
                prev = _i4;
            }

            // Set last tile element flags
            for (var _i5 = 0; _i5 < tile.numElements; _i5++) {
                data[_i5 * 16 + 1] &= ~128;
                if (_i5 == tile.numElements - 1) {
                    data[_i5 * 16 + 1] |= 128;
                }
            }

            tile.data = data;

            return true;
        }
    }]);

    return MapHelper;
}();

var VehicleSensor = function (_Trigger) {
    _inherits(VehicleSensor, _Trigger);

    function VehicleSensor(element) {
        _classCallCheck(this, VehicleSensor);

        var _this24 = _possibleConstructorReturn(this, (VehicleSensor.__proto__ || Object.getPrototypeOf(VehicleSensor)).call(this, element));

        _this24.element = element;

        _this24.x = -1;
        _this24.y = -1;

        _this24.method = 0;
        _this24.direction = 0;

        _this24._sensedEntityIds = [];
        return _this24;
    }

    _createClass(VehicleSensor, [{
        key: "getTiles",
        value: function getTiles() {
            if (this.x >= 0 && this.y >= 0) {
                return [{
                    x: this.x * 32,
                    y: this.y * 32
                }];
            }
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (this.x == -1 || this.y == -1) {
                this.validationMessage = "Sensor location has not been set";
                return false;
            }
            if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
                this.validationMessage = "There is no track at the set location";
                return false;
            }
            this.validationMessage = "Vehicle sensor is ready to go";
            return true;
        }
    }, {
        key: "addSensedEntity",
        value: function addSensedEntity(id) {
            this._sensedEntityIds.push(id);
        }
    }, {
        key: "hasSensedEntity",
        value: function hasSensedEntity(id) {
            return this._sensedEntityIds.indexOf(id) >= 0;
        }
    }, {
        key: "removeSensedEntity",
        value: function removeSensedEntity(id) {
            var index = this._sensedEntityIds.indexOf(id);
            if (index > -1) {
                this._sensedEntityIds.splice(index, 1);
            }
        }
    }, {
        key: "test",
        value: function test(carDetails) {
            var trainGoingForwards = carDetails.velocity > 0;
            var carIsOnTile = Math.floor(carDetails.car.x / 32) == this.x && Math.floor(carDetails.car.y / 32) == this.y;

            if (carIsOnTile && !this.hasSensedEntity(carDetails.car.id)) {
                // Train entered tile
                this.addSensedEntity(carDetails.car.id);

                // Trigger on train entered, depending on the direction of travel check if the
                // first or last car entered the tile.
                if (this.method == 0 && (this.direction != 2 && trainGoingForwards && carDetails.isFirstCarOfTrain || this.direction != 1 && !trainGoingForwards && carDetails.isLastCarOfTrain)) {
                    this.element.action.perform();
                    return true;
                }
            } else if (!carIsOnTile && this.hasSensedEntity(carDetails.car.id)) {
                // Train exited tile
                this.removeSensedEntity(carDetails.car.id);

                // Trigger on train entered, depending on the direction of travel check if the
                // first or last car exited the tile.
                if (this.method == 1 && (this.direction != 2 && trainGoingForwards && carDetails.isLastCarOfTrain || this.direction != 1 && !trainGoingForwards && carDetails.isFirstCarOfTrain)) {
                    this.element.action.perform();
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                x: this.x,
                y: this.y,
                method: this.method,
                direction: this.direction
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.x = data.x;
            this.y = data.y;

            if (data.method != null) {
                this.method = data.method;
            } else {
                this.method = 1;
            }

            if (data.direction) {
                this.direction = data.direction;
            }
        }
    }, {
        key: "createWidget",
        value: function createWidget() {
            var _this25 = this;

            var box = new Oui.VerticalBox();
            box.setPadding(0, 0, 0, 0);

            {
                var info = new Oui.Widgets.Label("Triggers when the last car of a train has cleared the");
                box.addChild(info);
            }
            {
                var _info = new Oui.Widgets.Label("selected tile.");
                box.addChild(_info);
            }

            this.isValid();
            var statusLabel = new Oui.Widgets.Label(this.validationMessage);

            var sensorLoc = new LocationPromptWidget("Vehicle Sensor:", this.element.ride.manager.locationPrompt, this.x, this.y, function (x, y) {
                _this25.x = x;
                _this25.y = y;
                _this25.isValid();
                statusLabel.setText(_this25.validationMessage);
                _this25.element.highlight(true);
            });
            box.addChild(sensorLoc.element);

            {
                var methodForm = new Oui.HorizontalBox();
                methodForm.setPadding(0, 0, 0, 0);
                box.addChild(methodForm);

                var methodLabel = new Oui.Widgets.Label("Trigger when the:");
                methodLabel.setWidth(100);
                methodForm.addChild(methodLabel);

                var method = new Oui.Widgets.Dropdown(["Train enters the sensor", "Train exits the sensor"], function (index) {
                    _this25.method = index;
                });
                method.setSelectedItem(this.method);
                methodForm.addChild(method);
                methodForm.setRemainingWidthFiller(method);
            }

            {
                var directionForm = new Oui.HorizontalBox();
                directionForm.setPadding(0, 0, 0, 0);
                box.addChild(directionForm);

                var directionLabel = new Oui.Widgets.Label("Direction:");
                directionLabel.setWidth(100);
                directionForm.addChild(directionLabel);

                var direction = new Oui.Widgets.Dropdown(["Any direction", "Forwards", "Backwards"], function (index) {
                    _this25.direction = index;
                });
                direction.setSelectedItem(this.direction);
                directionForm.addChild(direction);
                directionForm.setRemainingWidthFiller(direction);
            }

            box.addChild(statusLabel);

            return box;
        }
    }]);

    return VehicleSensor;
}(Trigger);

var Action = function () {
    function Action(element) {
        _classCallCheck(this, Action);

        this.element = element;

        this.validationMessage = "";
    }

    _createClass(Action, [{
        key: "getTiles",
        value: function getTiles() {
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            return true;
        }
    }, {
        key: "perform",
        value: function perform() {}
    }, {
        key: "serialize",
        value: function serialize() {
            return {};
        }
    }, {
        key: "createWidget",
        value: function createWidget() {}
    }]);

    return Action;
}();

var SwitchTrack = function (_Action) {
    _inherits(SwitchTrack, _Action);

    function SwitchTrack(element) {
        _classCallCheck(this, SwitchTrack);

        var _this26 = _possibleConstructorReturn(this, (SwitchTrack.__proto__ || Object.getPrototypeOf(SwitchTrack)).call(this, element));

        _this26.x = -1;
        _this26.y = -1;
        return _this26;
    }

    _createClass(SwitchTrack, [{
        key: "getTiles",
        value: function getTiles() {
            if (this.x >= 0 && this.y >= 0) {
                return [{
                    x: this.x * 32,
                    y: this.y * 32
                }];
            }
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (this.x == -1 || this.y == -1) {
                this.validationMessage = "Track switch location has not been set";
                return false;
            }
            if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
                this.validationMessage = "There is no track at the set location";
                return false;
            }
            this.validationMessage = "Switch track is ready to go";
            return true;
        }
    }, {
        key: "perform",
        value: function perform() {
            MapHelper.SwitchTrackElements(map.getTile(this.x, this.y));
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                x: this.x,
                y: this.y
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.x = data.x;
            this.y = data.y;
        }
    }, {
        key: "createWidget",
        value: function createWidget() {
            var _this27 = this;

            var box = new Oui.VerticalBox();
            box.setPadding(0, 0, 0, 0);

            {
                var info = new Oui.Widgets.Label("Switches the track elements at the location");
                box.addChild(info);
            }
            {
                var _info2 = new Oui.Widgets.Label("when triggered.");
                box.addChild(_info2);
            }

            this.isValid();
            var statusLabel = new Oui.Widgets.Label(this.validationMessage);

            var switchLoc = new LocationPromptWidget("Switch Track:", this.element.ride.manager.locationPrompt, this.x, this.y, function (x, y) {
                _this27.x = x;
                _this27.y = y;
                _this27.isValid();
                statusLabel.setText(_this27.validationMessage);
                _this27.element.highlight(true);
            });
            box.addChild(switchLoc.element);

            box.addChild(statusLabel);

            return box;
        }
    }]);

    return SwitchTrack;
}(Action);

var SetBlockBrake = function (_Action2) {
    _inherits(SetBlockBrake, _Action2);

    function SetBlockBrake(element) {
        _classCallCheck(this, SetBlockBrake);

        var _this28 = _possibleConstructorReturn(this, (SetBlockBrake.__proto__ || Object.getPrototypeOf(SetBlockBrake)).call(this, element));

        _this28.x = -1;
        _this28.y = -1;
        _this28.block = false;
        return _this28;
    }

    _createClass(SetBlockBrake, [{
        key: "getTiles",
        value: function getTiles() {
            if (this.x >= 0 && this.y >= 0) {
                return [{
                    x: this.x * 32,
                    y: this.y * 32
                }];
            }
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (this.x == -1 || this.y == -1) {
                this.validationMessage = "Block brake location has not been set";
                return false;
            }
            if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
                this.validationMessage = "There is no track at the set location";
                return false;
            }
            this.validationMessage = "Block brake is ready to go";
            return true;
        }
    }, {
        key: "perform",
        value: function perform() {
            MapHelper.SetBlockBrake(map.getTile(this.x, this.y), this.block);
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                x: this.x,
                y: this.y,
                block: this.block
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.x = data.x;
            this.y = data.y;
            this.block = data.block;
        }
    }, {
        key: "createWidget",
        value: function createWidget() {
            var _this29 = this;

            var that = this;
            var box = new Oui.VerticalBox();
            box.setPadding(0, 0, 0, 0);

            {
                var info = new Oui.Widgets.Label("Block or unblocks a block brake");
                box.addChild(info);
            }
            {
                var _info3 = new Oui.Widgets.Label("when triggered.");
                box.addChild(_info3);
            }

            this.isValid();
            var statusLabel = new Oui.Widgets.Label(this.validationMessage);

            var switchLoc = new LocationPromptWidget("Block Brake:", this.element.ride.manager.locationPrompt, this.x, this.y, function (x, y) {
                _this29.x = x;
                _this29.y = y;
                _this29.isValid();
                statusLabel.setText(_this29.validationMessage);
                _this29.element.highlight(true);
            });
            box.addChild(switchLoc.element);

            var checkBox = new Oui.Widgets.Dropdown(["Set to open", "Set to closed"], function (val) {
                that.block = val > 0;
            });
            checkBox.setSelectedItem(this.block + 0);
            box.addChild(checkBox);

            box.addChild(statusLabel);

            return box;
        }
    }]);

    return SetBlockBrake;
}(Action);

var SetLiftSpeed = function (_Action3) {
    _inherits(SetLiftSpeed, _Action3);

    function SetLiftSpeed(element) {
        _classCallCheck(this, SetLiftSpeed);

        var _this30 = _possibleConstructorReturn(this, (SetLiftSpeed.__proto__ || Object.getPrototypeOf(SetLiftSpeed)).call(this, element));

        _this30.rideId = -1;
        _this30.chainSpeed = 1;
        return _this30;
    }

    _createClass(SetLiftSpeed, [{
        key: "getTiles",
        value: function getTiles() {
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (this.rideId == -1) {
                this.validationMessage = "No ride selected";
                return false;
            }

            if (map.getRide(this.rideId) == null) {
                this.validationMessage = "Invalid ride selected";
                return false;
            }
            this.validationMessage = "Set lift speed is ready to go";
            return true;
        }
    }, {
        key: "perform",
        value: function perform() {
            if (map.getRide(this.rideId) != null) {
                var gameActionData = {
                    "setting": 8, // RideSetSetting::LiftHillSpeed
                    "ride": this.rideId,
                    "value": this.chainSpeed
                };

                context.queryAction("ridesetsetting", gameActionData, function (result) {
                    if (result.error != 0) {
                        console.log("Can't set chain lift speed: " + result.errorMessage);
                        return;
                    }

                    context.executeAction("ridesetsetting", gameActionData);
                });
            }
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                rideId: this.rideId,
                chainSpeed: this.chainSpeed
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.rideId = data.rideId;
            this.chainSpeed = data.chainSpeed;
        }
    }, {
        key: "createWidget",
        value: function createWidget() {
            var _this31 = this;

            var box = new Oui.VerticalBox();
            box.setPadding(0, 0, 0, 0);

            {
                var info = new Oui.Widgets.Label("Sets the chain lift speed");
                box.addChild(info);
            }
            {
                var _info4 = new Oui.Widgets.Label("when triggered.");
                box.addChild(_info4);
            }

            this.isValid();
            var statusLabel = new Oui.Widgets.Label(this.validationMessage);

            var rideNames = [];
            var rideIndices = [];

            var rides = map.rides;
            var selectedRide = 0;
            for (var i = 0; i < rides.length; i++) {
                if (rides[i].classification == "ride") {
                    rideNames.push(rides[i].name);
                    rideIndices.push(rides[i].id);

                    if (rides[i].id == this.rideId) {
                        selectedRide = rideIndices.length - 1;
                    }
                }
            }

            var rideSelection = new Oui.Widgets.Dropdown(rideNames, function (value) {
                _this31.rideId = rideIndices[value];
            });
            rideSelection.setSelectedItem(selectedRide);
            box.addChild(rideSelection);

            var chainSpeedspinner = new Oui.Widgets.Spinner(this.chainSpeed, 1, function (value) {
                _this31.chainSpeed = value;
            });
            box.addChild(chainSpeedspinner);
            {
                var _info5 = new Oui.Widgets.Label("The speed does not translate to a known unit (kmh/mph).");
                box.addChild(_info5);
            }

            box.addChild(statusLabel);

            return box;
        }
    }]);

    return SetLiftSpeed;
}(Action);

var SetChainLift = function (_Action4) {
    _inherits(SetChainLift, _Action4);

    function SetChainLift(element) {
        _classCallCheck(this, SetChainLift);

        var _this32 = _possibleConstructorReturn(this, (SetChainLift.__proto__ || Object.getPrototypeOf(SetChainLift)).call(this, element));

        _this32.x = -1;
        _this32.y = -1;
        _this32.chainLift = true;
        return _this32;
    }

    _createClass(SetChainLift, [{
        key: "getTiles",
        value: function getTiles() {
            if (this.x >= 0 && this.y >= 0) {
                return [{
                    x: this.x * 32,
                    y: this.y * 32
                }];
            }
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (this.x == -1 || this.y == -1) {
                this.validationMessage = "Chain lift location has not been set";
                return false;
            }
            if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
                this.validationMessage = "There is no track at the set location";
                return false;
            }
            this.validationMessage = "Chain lift is ready to go";
            return true;
        }
    }, {
        key: "perform",
        value: function perform() {
            MapHelper.SetChainLift(map.getTile(this.x, this.y), this.chainLift);
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                x: this.x,
                y: this.y,
                chainLift: this.chainLift
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.x = data.x;
            this.y = data.y;
            this.chainLift = data.chainLift;
        }
    }, {
        key: "createWidget",
        value: function createWidget() {
            var _this33 = this;

            var that = this;
            var box = new Oui.VerticalBox();
            box.setPadding(0, 0, 0, 0);

            {
                var info = new Oui.Widgets.Label("Sets a track section's chain lift property");
                box.addChild(info);
            }
            {
                var _info6 = new Oui.Widgets.Label("when triggered.");
                box.addChild(_info6);
            }

            this.isValid();
            var statusLabel = new Oui.Widgets.Label(this.validationMessage);

            var switchLoc = new LocationPromptWidget("Track Section:", this.element.ride.manager.locationPrompt, this.x, this.y, function (x, y) {
                _this33.x = x;
                _this33.y = y;
                _this33.isValid();
                statusLabel.setText(_this33.validationMessage);
                _this33.element.highlight(true);
            });
            box.addChild(switchLoc.element);

            var checkBox = new Oui.Widgets.Dropdown(["Enable chain lift", "Disable chain lift"], function (val) {
                that.chainLift = val == 0;
            });
            checkBox.setSelectedItem(1 - this.chainLift);
            box.addChild(checkBox);

            box.addChild(statusLabel);

            return box;
        }
    }]);

    return SetChainLift;
}(Action);

var SetBrakeBoosterSpeed = function (_Action5) {
    _inherits(SetBrakeBoosterSpeed, _Action5);

    function SetBrakeBoosterSpeed(element) {
        _classCallCheck(this, SetBrakeBoosterSpeed);

        var _this34 = _possibleConstructorReturn(this, (SetBrakeBoosterSpeed.__proto__ || Object.getPrototypeOf(SetBrakeBoosterSpeed)).call(this, element));

        _this34.x = -1;
        _this34.y = -1;
        _this34.speed = 1;
        return _this34;
    }

    _createClass(SetBrakeBoosterSpeed, [{
        key: "getTiles",
        value: function getTiles() {
            if (this.x >= 0 && this.y >= 0) {
                return [{
                    x: this.x * 32,
                    y: this.y * 32
                }];
            }
            return [];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (this.x == -1 || this.y == -1) {
                this.validationMessage = "Brake/booster location has not been set";
                return false;
            }
            if (!MapHelper.GetTrackElement(map.getTile(this.x, this.y))) {
                this.validationMessage = "There is no track at the set location";
                return false;
            }
            this.validationMessage = "Brake/booster is ready to go";
            return true;
        }
    }, {
        key: "perform",
        value: function perform() {
            MapHelper.SetBrakeBoosterSpeed(map.getTile(this.x, this.y), this.speed);
        }
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                x: this.x,
                y: this.y,
                speed: this.speed
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.x = data.x;
            this.y = data.y;
            this.speed = data.speed;
        }
    }, {
        key: "createWidget",
        value: function createWidget() {
            var _this35 = this;

            var box = new Oui.VerticalBox();
            box.setPadding(0, 0, 0, 0);

            {
                var info = new Oui.Widgets.Label("Sets the brake/booster speed when triggered.");
                box.addChild(info);
            }

            this.isValid();
            var statusLabel = new Oui.Widgets.Label(this.validationMessage);
            var speedSpinner = null;
            var switchLoc = new LocationPromptWidget("Brake/Booster:", this.element.ride.manager.locationPrompt, this.x, this.y, function (x, y) {
                _this35.x = x;
                _this35.y = y;
                if (_this35.isValid()) {
                    _this35.speed = MapHelper.GetBrakeBoosterSpeed(map.getTile(_this35.x, _this35.y));
                    speedSpinner.setValue(_this35.speed);
                }
                statusLabel.setText(_this35.validationMessage);
                _this35.element.highlight(true);
            });
            box.addChild(switchLoc.element);

            speedSpinner = new Oui.Widgets.Spinner(this.speed, 1, function (value) {
                _this35.speed = value;
            });
            box.addChild(speedSpinner);
            {
                var _info7 = new Oui.Widgets.Label("The speed does not translate to a known unit (kmh/mph).");
                box.addChild(_info7);
            }

            box.addChild(statusLabel);

            return box;
        }
    }]);

    return SetBrakeBoosterSpeed;
}(Action);

var Feature = function () {
    function Feature(ride, type) {
        _classCallCheck(this, Feature);

        this.ride = ride;

        this.type = type;

        this._savedIndex = 0;
    }

    _createClass(Feature, [{
        key: "getTitle",
        value: function getTitle() {
            return Feature.TypeNames[this.type];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            return false;
        }
    }, {
        key: "checkCollision",
        value: function checkCollision(carDetails) {}
    }, {
        key: "tick",
        value: function tick() {}
    }, {
        key: "highlight",
        value: function highlight(enable) {}
    }, {
        key: "serialize",
        value: function serialize() {
            return {
                type: this.type
            };
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.type = data.type;
        }
    }, {
        key: "getEditWindow",
        value: function getEditWindow(parent, onFinished) {
            return null;
        }
    }], [{
        key: "getWizardWindow",
        value: function getWizardWindow(ride, onComplete) {
            return null;
        }
    }]);

    return Feature;
}();

Feature.Types = [];

Feature.TypeNames = [];

var EditElementWindow = function () {
    function EditElementWindow(parent, element, onFinished) {
        _classCallCheck(this, EditElementWindow);

        this.parent = parent;
        this.element = element;
        this.onFinished = onFinished;
        this.locationPrompt = new LocationPrompt("loc-prompt");
        this.window = this.createWindow();
    }

    _createClass(EditElementWindow, [{
        key: "createWindow",
        value: function createWindow() {
            var that = this;

            var window = new Oui.Window("advanced-track-edit-element", "Advanced Track - Edit Control System");
            window._paddingBottom = 6;
            window._paddingLeft = 6;
            window._paddingRight = 6;
            window.setColors(24);
            window.setWidth(300);

            window.setOnClose(function () {
                that.element.highlight(false);
                that.locationPrompt.cancel();
            });

            var labelTriggerExpl = new Oui.Widgets.Label("The trigger is what makes an action happen");
            window.addChild(labelTriggerExpl);

            var triggerBox = new Oui.GroupBox("Trigger");
            triggerBox.setMargins(6, 6, triggerBox._marginLeft, triggerBox._marginRight);
            window.addChild(triggerBox);

            triggerBox.addChild(this.element.trigger.createWidget());

            var labelActionExpl = new Oui.Widgets.Label("The action occurs when the trigger is activated");
            window.addChild(labelActionExpl);

            var actionBox = new Oui.GroupBox("Action");
            actionBox.setMargins(6, 6, actionBox._marginLeft, actionBox._marginRight);
            window.addChild(actionBox);

            actionBox.addChild(this.element.action.createWidget());

            var bottom = new Oui.HorizontalBox();
            bottom.setPadding(0, 0, 0, 0);
            window.addChild(bottom);

            var bottomFiller = new Oui.VerticalBox();
            bottom.addChild(bottomFiller);
            bottom.setRemainingWidthFiller(bottomFiller);

            var okButton = new Oui.Widgets.Button("Ok", function () {
                that.window._handle.close();
                that.onFinished();
            });
            okButton.setWidth(50);
            bottom.addChild(okButton);

            return window;
        }
    }]);

    return EditElementWindow;
}();

var ElementWizardWindow = function () {
    function ElementWizardWindow(ride, onComplete, elementType) {
        _classCallCheck(this, ElementWizardWindow);

        this.ride = ride;

        this.selectedTriggerType = 0;
        this.selectedReactionType = 0;

        this.elementType = elementType;

        this.onComplete = onComplete;

        this.window = this.createWindow();
    }

    _createClass(ElementWizardWindow, [{
        key: "createWindow",
        value: function createWindow() {
            var that = this;

            var window = new Oui.Window("advanced-track-wizard-element", "Advanced Track - Control System Wizard");
            window._paddingBottom = 6;
            window._paddingLeft = 6;
            window._paddingRight = 6;
            window.setColors(26, 24);
            window.setWidth(300);

            var horizontalBox = new Oui.HorizontalBox();
            horizontalBox.setPadding(0, 0, 0, 0);
            window.addChild(horizontalBox);

            {
                var label = new Oui.Widgets.Label("Trigger:");
                label.setRelativeWidth(30);
                horizontalBox.addChild(label);
            }

            var elementTypes = new Oui.Widgets.Dropdown(this.elementType.TriggerTypeNames, function (index) {
                that.selectedTriggerType = index;
            });
            elementTypes.setRelativeWidth(70);
            elementTypes._marginRight = 4;
            elementTypes.setHeight(13);
            horizontalBox.addChild(elementTypes);

            horizontalBox = new Oui.HorizontalBox();
            horizontalBox.setPadding(0, 0, 0, 0);
            window.addChild(horizontalBox);

            {
                var _label = new Oui.Widgets.Label("Action:");
                _label.setRelativeWidth(30);
                horizontalBox.addChild(_label);
            }

            var elementReactionTypes = new Oui.Widgets.Dropdown(this.elementType.ActionTypeNames, function (index) {
                that.selectedReactionType = index;
            });
            elementReactionTypes.setRelativeWidth(70);
            elementReactionTypes._marginRight = 4;
            elementReactionTypes.setHeight(13);
            horizontalBox.addChild(elementReactionTypes);

            var createButton = new Oui.Widgets.Button("Create", function () {
                that.ride.manager.save();
                that.window._handle.close();

                that.onComplete(new that.elementType(that.ride, that.selectedTriggerType, that.selectedReactionType));
            });
            window.addChild(createButton);

            return window;
        }
    }]);

    return ElementWizardWindow;
}();

var Element = function (_Feature) {
    _inherits(Element, _Feature);

    function Element(ride) {
        var triggerType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
        var actionType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

        _classCallCheck(this, Element);

        var _this36 = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this, ride, Feature.Types.indexOf(Element)));

        _this36.triggerType = -1;
        _this36.actionType = -1;

        if (triggerType > -1 && actionType > -1) {
            _this36.triggerType = triggerType;
            _this36.trigger = new Element.TriggerTypes[triggerType](_this36);
            _this36.actionType = actionType;
            _this36.action = new Element.ActionTypes[actionType](_this36);
        }
        return _this36;
    }

    _createClass(Element, [{
        key: "highlight",
        value: function highlight(enable) {
            if (enable) {
                ui.mainViewport.visibilityFlags |= 1 << 7;
                ui.tileSelection.tiles = [].concat(_toConsumableArray(this.trigger.getTiles()), _toConsumableArray(this.action.getTiles()));
            } else {
                ui.tileSelection.tiles = null;
                ui.mainViewport.visibilityFlags &= ~(1 << 7);
            }
        }
    }, {
        key: "getTitle",
        value: function getTitle() {
            return Feature.TypeNames[this.type] + ": " + Element.TriggerTypeNames[this.triggerType] + " > " + Element.ActionTypeNames[this.actionType];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            var a = this.trigger.isValid() && this.action.isValid();
            return a;
        }
    }, {
        key: "checkCollision",
        value: function checkCollision(carDetails) {
            this.trigger.test(carDetails);
        }
    }, {
        key: "tick",
        value: function tick() {}
    }, {
        key: "serialize",
        value: function serialize() {
            var data = _get(Element.prototype.__proto__ || Object.getPrototypeOf(Element.prototype), "serialize", this).call(this);
            return _extends({}, data, {
                triggerType: this.triggerType,
                actionType: this.actionType,
                trigger: this.trigger.serialize(),
                action: this.action.serialize()
            });
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.triggerType = data.triggerType;
            this.actionType = data.actionType;

            this.trigger = new Element.TriggerTypes[data.triggerType](this);
            this.action = new Element.ActionTypes[data.actionType](this);

            _get(Element.prototype.__proto__ || Object.getPrototypeOf(Element.prototype), "deserialize", this).call(this, data);

            this.trigger.deserialize(data.trigger);
            this.action.deserialize(data.action);
            this.isValid();
        }
    }, {
        key: "getEditWindow",
        value: function getEditWindow(parent, onFinished) {
            return new EditElementWindow(parent, this, onFinished);
        }
    }], [{
        key: "getWizardWindow",
        value: function getWizardWindow(ride, onComplete) {
            return new ElementWizardWindow(ride, onComplete, Element);
        }
    }]);

    return Element;
}(Feature);

Element.TriggerTypes = [VehicleSensor];

Element.TriggerTypeNames = ["Vehicle Sensor"];

Element.ActionTypes = [SwitchTrack, SetBlockBrake, SetChainLift, SetLiftSpeed, SetBrakeBoosterSpeed];

Element.ActionTypeNames = ["Switch Track", "Set Block Brake", "Set Chain Lift", "Set Chain Lift Speed", "Set Brake/Booster Speed"];

var EditLiftTrackWindow = function () {
    function EditLiftTrackWindow(parent, feature, onFinished) {
        _classCallCheck(this, EditLiftTrackWindow);

        this.parent = parent;
        this.feature = feature;
        this.onFinished = onFinished;
        this.locationPrompt = new LocationPrompt("loc-prompt");

        this.startHeightSpinner = null;
        this.endHeightSpinner = null;

        this.window = this.createWindow();
    }

    _createClass(EditLiftTrackWindow, [{
        key: "createWindow",
        value: function createWindow() {
            var that = this;

            var window = new Oui.Window("advanced-track-edit-lifttrack", "Advanced Track - Edit Lift/Drop Track");
            window._paddingBottom = 6;
            window._paddingLeft = 6;
            window._paddingRight = 6;
            window.setColors(24);
            window.setWidth(300);

            window.setOnClose(function () {
                that.feature.highlight(false);
                that.locationPrompt.cancel();
            });

            var statusLabel = void 0;

            var sensorLoc = new LocationPromptWidget("Lift Track Lock Point:", this.feature.ride.manager.locationPrompt, that.feature.startX, that.feature.startY, function (x, y) {
                var track = MapHelper.GetTrackElement(map.getTile(x, y));
                that.feature.startZ = -1;
                if (track) {
                    that.feature.startZ = track.baseZ;
                }
                if (that.feature.endZ == -1) {
                    that.feature.endZ = that.feature.startZ;
                }
                that.startHeightSpinner.setValue(Math.floor(that.feature.startZ / 8));
                that.startHeightSpinner.setValue(Math.floor(that.feature.endZ / 8));
                that.feature.startX = x;
                that.feature.startY = y;
                that.feature.isValid();
                statusLabel.setText(that.feature.validationMessage);
                that.feature.affectedTiles = [];
                that.feature.highlight(true);
            });
            window.addChild(sensorLoc.element);

            {
                var topicBox = new Oui.GroupBox("Height");

                var row = new Oui.HorizontalBox();
                topicBox.addChild(row);

                var label = new Oui.Widgets.Label("Start:");
                label.setRelativeWidth(15);
                row.addChild(label);

                this.startHeightSpinner = new Oui.Widgets.Spinner(Math.floor(this.feature.startZ / 8), 1, function (value) {
                    that.feature.startZ = value * 8;
                });
                this.startHeightSpinner.setRelativeWidth(35);
                row.addChild(this.startHeightSpinner);

                label = new Oui.Widgets.Label("End:");
                label.setRelativeWidth(15);
                row.addChild(label);

                this.endHeightSpinner = new Oui.Widgets.Spinner(Math.floor(this.feature.endZ / 8), 1, function (value) {
                    that.feature.endZ = value * 8;
                });
                this.endHeightSpinner.setRelativeWidth(35);
                row.addChild(this.endHeightSpinner);

                window.addChild(topicBox);
            }

            {
                var _row = new Oui.HorizontalBox();

                var _label2 = new Oui.Widgets.Label("Speed (%):");
                _label2.setWidth(60);
                _row.addChild(_label2);

                var spinner = new Oui.Widgets.Spinner(this.feature.speed, 5, function (value) {
                    if (value < 0) {
                        spinner.setValue(0);
                    } else {
                        that.feature.speed = value;
                    }
                });
                _row.addChild(spinner);
                _row.setRemainingWidthFiller(spinner);
                _label2.setHeight(_row.getPixelHeight());

                window.addChild(_row);
            }

            statusLabel = new Oui.Widgets.Label(this.feature.validationMessage);
            window.addChild(statusLabel);

            var bottom = new Oui.HorizontalBox();
            bottom.setPadding(0, 0, 0, 0);
            window.addChild(bottom);

            var bottomFiller = new Oui.VerticalBox();
            bottom.addChild(bottomFiller);
            bottom.setRemainingWidthFiller(bottomFiller);

            var okButton = new Oui.Widgets.Button("Ok", function () {
                that.window._handle.close();
                that.onFinished();
            });
            okButton.setWidth(50);
            bottom.addChild(okButton);

            return window;
        }
    }]);

    return EditLiftTrackWindow;
}();

var LiftTrack = function (_Feature2) {
    _inherits(LiftTrack, _Feature2);

    function LiftTrack(ride) {
        _classCallCheck(this, LiftTrack);

        var _this37 = _possibleConstructorReturn(this, (LiftTrack.__proto__ || Object.getPrototypeOf(LiftTrack)).call(this, ride, Feature.Types.indexOf(LiftTrack)));

        _this37._sensedEntityIds = [];

        _this37.startX = -1;
        _this37.startY = -1;
        _this37.startZ = -1;
        _this37.endZ = 128;

        _this37.currentTrainEntityId = -1;
        _this37.vehicleStartDetails = null;

        _this37.vehicleState = LiftTrack.VehicleState.Empty;
        _this37.liftState = LiftTrack.LiftState.Idle;

        _this37.tickTimerCount = 0;

        _this37.speed = 100;

        _this37.affectedTiles = [];

        _this37.validationMessage = "";
        return _this37;
    }

    _createClass(LiftTrack, [{
        key: "highlight",
        value: function highlight(enable) {
            if (enable) {
                if (this.affectedTiles.length > 0) {
                    ui.tileSelection.range = {
                        leftTop: {
                            x: this.affectedTiles[0].x * 32,
                            y: this.affectedTiles[0].y * 32
                        },
                        rightBottom: {
                            x: this.affectedTiles[this.affectedTiles.length - 1].x * 32,
                            y: this.affectedTiles[this.affectedTiles.length - 1].y * 32
                        }
                    };
                } else {
                    ui.tileSelection.range = {
                        leftTop: {
                            x: this.startX * 32,
                            y: this.startY * 32
                        },
                        rightBottom: {
                            x: this.startX * 32,
                            y: this.startY * 32
                        }
                    };
                }
            } else {
                ui.tileSelection.range = null;
                ui.tileSelection.tiles = null;
            }
        }
    }, {
        key: "addSensedEntity",
        value: function addSensedEntity(id) {
            this._sensedEntityIds.push(id);
        }
    }, {
        key: "hasSensedEntity",
        value: function hasSensedEntity(id) {
            return this._sensedEntityIds.indexOf(id) >= 0;
        }
    }, {
        key: "removeSensedEntity",
        value: function removeSensedEntity(id) {
            var index = this._sensedEntityIds.indexOf(id);
            if (index > -1) {
                this._sensedEntityIds.splice(index, 1);
            }
        }
    }, {
        key: "getTitle",
        value: function getTitle() {
            return Feature.TypeNames[this.type];
        }
    }, {
        key: "isValid",
        value: function isValid() {
            if (!(this.startX >= 0 && this.startY >= 0 && this.startZ >= 0)) {
                this.validationMessage = "Start location has not been set.";
                return false;
            }
            this.validationMessage = "Lift track is ready to go.";
            return true;
        }
    }, {
        key: "onEnter",
        value: function onEnter(carDetails) {
            this.currentTrainEntityId = carDetails.trainId;

            if (this.vehicleState == LiftTrack.VehicleState.Empty) {
                this.vehicleStartDetails = {
                    x: carDetails.car.x,
                    y: carDetails.car.y,
                    z: carDetails.car.z,
                    velocity: carDetails.velocity
                };

                this.gatherAffectedTiles();

                this.vehicleState = LiftTrack.VehicleState.Entering;
            }
        }
    }, {
        key: "onExit",
        value: function onExit(carDetails) {
            this.tickTimerCount = 0;
            this.currentTrainEntityId = -1;
            this.vehicleStartDetails = null;
            this.vehicleState = LiftTrack.VehicleState.Empty;
        }
    }, {
        key: "gatherAffectedTiles",
        value: function gatherAffectedTiles() {
            var lastTile = {
                x: this.startX,
                y: this.startY
            };
            var thisCar = map.getEntity(this.currentTrainEntityId);

            var firstTile = {
                x: this.startX,
                y: this.startY
            };

            var firstCar = true;
            while (thisCar != null) {
                lastTile.x = Math.floor(thisCar.x / 32);
                lastTile.y = Math.floor(thisCar.y / 32);

                if (firstCar) {
                    firstTile = {
                        x: lastTile.x,
                        y: lastTile.y
                    };
                    firstCar = false;
                }

                if (thisCar.nextCarOnTrain == null) break;
                thisCar = map.getEntity(thisCar.nextCarOnTrain);
            }

            this.affectedTiles = [];

            var minX = Math.min(Math.min(this.startX, lastTile.x), firstTile.x);
            var minY = Math.min(Math.min(this.startY, lastTile.y), firstTile.y);
            var maxX = Math.max(Math.max(this.startX, lastTile.x), firstTile.x);
            var maxY = Math.max(Math.max(this.startY, lastTile.y), firstTile.y);
            for (var i = minX; i <= maxX; i++) {
                for (var j = minY; j <= maxY; j++) {
                    this.affectedTiles.push({
                        x: i,
                        y: j
                    });
                }
            }
        }
    }, {
        key: "checkCollision",
        value: function checkCollision(carDetails) {
            var trainGoingForwards = carDetails.velocity > 0;
            var carIsOnTile = carDetails.car.trackLocation.x == this.startX * 32 && carDetails.car.trackLocation.y == this.startY * 32;

            if (carIsOnTile && !this.hasSensedEntity(carDetails.car.id)) {
                // Train entered tile
                this.addSensedEntity(carDetails.car.id);

                if (trainGoingForwards && carDetails.isFirstCarOfTrain || !trainGoingForwards && carDetails.isLastCarOfTrain) {
                    this.onEnter(carDetails);
                }
            } else if (!carIsOnTile && this.hasSensedEntity(carDetails.car.id)) {
                // Train exited tile
                this.removeSensedEntity(carDetails.car.id);

                if (trainGoingForwards && carDetails.isLastCarOfTrain || !trainGoingForwards && carDetails.isFirstCarOfTrain) {
                    this.onExit(carDetails);
                }
            }
            return false;
        }
    }, {
        key: "easeCubic",
        value: function easeCubic(x) {
            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        }
    }, {
        key: "easeSine",
        value: function easeSine(x) {
            return -(Math.cos(Math.PI * x) - 1) / 2;
        }
    }, {
        key: "updatePosition",
        value: function updatePosition(time, car, ease) {
            time = ease(time);

            var heightDifference = (this.endZ - this.startZ) * time;
            var currentZ = this.startZ + heightDifference;

            var newBaseZ = Math.round(currentZ / 8);

            var heightDelta = 0;
            for (var i = 0; i < this.affectedTiles.length; i++) {
                var track = MapHelper.GetTrackElement(map.getTile(this.affectedTiles[i].x, this.affectedTiles[i].y));

                if (track) {
                    if (i == 0) {
                        heightDelta = newBaseZ - track.baseHeight;
                    }
                    track.baseHeight += heightDelta;
                    track.clearanceHeight += heightDelta;
                }
            }

            if (car != null) {
                var thisCar = car;
                while (thisCar != null) {
                    thisCar.z = this.vehicleStartDetails.z + heightDifference;
                    // thisCar.z += heightDelta * 8;
                    thisCar.trackLocation = {
                        x: thisCar.trackLocation.x,
                        y: thisCar.trackLocation.y,
                        z: newBaseZ * 8,
                        direction: thisCar.trackLocation.direction
                    };

                    if (thisCar.nextCarOnTrain == null) break;
                    thisCar = map.getEntity(thisCar.nextCarOnTrain);
                }
            }
        }
    }, {
        key: "tickTimerUpdate",
        value: function tickTimerUpdate(goal) {
            this.tickTimerCount++;

            var value = Math.min(this.tickTimerCount / Math.floor(goal), 1);
            if (value == 1) {
                this.tickTimerCount = 0;
                return 1;
            }
            return value;
        }
    }, {
        key: "tick",
        value: function tick() {
            var car = map.getEntity(this.currentTrainEntityId);

            if (this.currentTrainEntityId == -1 || car == null) {
                this.vehicleState = LiftTrack.VehicleState.Empty;
            }

            var time = 0;
            var easeFunc = this.easeSine;
            switch (this.vehicleState) {
                case LiftTrack.VehicleState.Entering:
                    var distanceTravelled = Math.abs(this.vehicleStartDetails.x - car.x) + Math.abs(this.vehicleStartDetails.y - car.y);

                    car.acceleration = 0;
                    if (distanceTravelled > 16 || car.velocity == 0) {
                        car.velocity = 0;
                        this.vehicleState = LiftTrack.VehicleState.Locked;
                    } else {
                        car.velocity = this.vehicleStartDetails.velocity * (1 - Math.min(distanceTravelled, 16) / 32);
                    }
                    break;
                case LiftTrack.VehicleState.Locked:
                    car.velocity = 0;
                    car.acceleration = 0;

                    if (this.liftState == LiftTrack.LiftState.Idle) {
                        if (this.tickTimerUpdate(50) == 1) {
                            this.liftState = LiftTrack.LiftState.Traveling;
                        }
                    }
                    break;
                case LiftTrack.VehicleState.Exiting:
                    if (this.vehicleStartDetails.velocity >= 0) {
                        if (car.velocity < this.vehicleStartDetails.velocity) {
                            car.velocity += this.vehicleStartDetails.velocity / 8;
                        } else {
                            car.velocity = this.vehicleStartDetails.velocity;
                        }
                    } else {
                        if (car.velocity > this.vehicleStartDetails.velocity) {
                            car.velocity -= -this.vehicleStartDetails.velocity / 8;
                        } else {
                            car.velocity = this.vehicleStartDetails.velocity;
                        }
                    }
                    break;
                case LiftTrack.VehicleState.Empty:
                    if (this.liftState == LiftTrack.LiftState.TargetReached) {
                        if (this.tickTimerUpdate(50) == 1) {
                            this.liftState = LiftTrack.LiftState.Returning;
                        }
                    }
                    break;
            }

            switch (this.liftState) {
                case LiftTrack.LiftState.Traveling:
                    time = this.tickTimerUpdate(Math.abs(this.endZ - this.startZ) * (100 / this.speed));

                    // More dramatic easing when going down with the train on it to indicate the weight of the train.
                    if (this.endZ < this.startZ) {
                        easeFunc = this.easeCubic;
                    }

                    this.updatePosition(time, car, easeFunc);

                    if (time == 1) {
                        this.liftState = LiftTrack.LiftState.TargetReached;
                        this.vehicleState = LiftTrack.VehicleState.Exiting;
                    }
                    break;
                case LiftTrack.LiftState.Returning:
                    time = this.tickTimerUpdate(Math.abs(this.endZ - this.startZ) * (100 / this.speed));

                    this.updatePosition(1 - time, car, this.easeSine);

                    if (time == 1) {
                        this.liftState = LiftTrack.LiftState.Idle;
                    }
                    break;
            }
        }
    }, {
        key: "serialize",
        value: function serialize() {
            var data = _get(LiftTrack.prototype.__proto__ || Object.getPrototypeOf(LiftTrack.prototype), "serialize", this).call(this);
            data.startX = this.startX;
            data.startY = this.startY;
            data.startZ = this.startZ;
            data.endZ = this.endZ;
            data.vehicleStartDetails = this.vehicleStartDetails;
            data.currentTrainEntityId = this.currentTrainEntityId;
            data.vehicleState = this.vehicleState;
            data.liftState = this.liftState;
            data.tickTimerCount = this.tickTimerCount;
            data.affectedTiles = this.affectedTiles;
            data.speed = this.speed;
            return data;
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            _get(LiftTrack.prototype.__proto__ || Object.getPrototypeOf(LiftTrack.prototype), "deserialize", this).call(this, data);
            this.startX = data.startX;
            this.startY = data.startY;
            this.startZ = data.startZ;
            this.endZ = data.endZ;
            this.vehicleStartDetails = data.vehicleStartDetails;
            this.currentTrainEntityId = data.currentTrainEntityId;
            this.vehicleState = data.vehicleState;
            this.liftState = data.liftState;
            this.tickTimerCount = data.tickTimerCount;
            this.affectedTiles = data.affectedTiles;
            this.speed = data.speed;
        }
    }, {
        key: "getEditWindow",
        value: function getEditWindow(parent, onFinished) {
            return new EditLiftTrackWindow(parent, this, onFinished);
        }
    }]);

    return LiftTrack;
}(Feature);

LiftTrack.VehicleState = {
    Empty: 0,
    Entering: 1,
    Locked: 2,
    Exiting: 3
};

LiftTrack.LiftState = {
    Idle: 0,
    Traveling: 1,
    TargetReached: 2,
    Returning: 3
};

var Ride = function () {
    function Ride(manager) {
        var rideId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

        _classCallCheck(this, Ride);

        this.manager = manager;

        this.rideId = rideId;

        this.features = [];

        this._savedIndex = 0;
    }

    _createClass(Ride, [{
        key: "getDisplayName",
        value: function getDisplayName() {
            var rideName = "Missing Ride";
            var ride = map.getRide(this.rideId);
            if (ride) {
                rideName = ride.name;
            }
            return "[" + this.features.length + "] " + rideName;
        }
    }, {
        key: "addFeature",
        value: function addFeature(feature) {
            this.features.push(feature);
            this.manager.save();
        }
    }, {
        key: "deleteFeature",
        value: function deleteFeature(feature) {
            var index = this.features.indexOf(feature);
            if (index >= 0) {
                this.features.splice(index, 1);
            }

            this.manager.save();
        }
    }, {
        key: "hasFeature",
        value: function hasFeature(feature) {
            return this.features.indexOf(feature) >= 0;
        }
    }, {
        key: "serialize",
        value: function serialize() {
            var data = {
                rideId: this.rideId,
                features: []
            };

            for (var i = 0; i < this.features.length; i++) {
                this.features[i]._savedIndex = i;
                data.features.push(this.features[i].serialize());
            }

            return data;
        }
    }, {
        key: "deserialize",
        value: function deserialize(data) {
            this.rideId = data.rideId;

            for (var i = 0; i < data.features.length; i++) {
                var featureData = data.features[i];
                var newFeature = new Feature.Types[featureData.type](this);
                newFeature.deserialize(featureData);
                newFeature._savedIndex = i;
                this.features.push(newFeature);
            }
        }
    }, {
        key: "tick",
        value: function tick() {
            var ride = map.getRide(this.rideId);

            if (ride == null) return;

            var features = this.features;

            // Double check that the ride is not a flat ride.
            if (ride.object.carsPerFlatRide != 255) return;

            var vehicles = ride.vehicles;
            var trainIndex = 0;

            var entityId = vehicles[0];
            var firstCarOfTrain = null;

            var isFirstCarOfTrain = true;

            // Iterate over all the ride car.
            while (trainIndex < vehicles.length) {
                var vehicle = map.getEntity(entityId);

                if (vehicle == null) break;

                var isLastCarOfTrain = vehicle.nextCarOnTrain == null;

                // Only test collisions on the first and last car of each train.
                if (isLastCarOfTrain || isFirstCarOfTrain) {
                    if (isFirstCarOfTrain) firstCarOfTrain = vehicle;

                    var velocity = firstCarOfTrain.velocity;

                    // Test the collision for al the advanced track features that are acting on this ride.
                    for (var k = 0; k < features.length; k++) {
                        if (!features[k].isValid()) continue;

                        features[k].checkCollision({
                            car: vehicle,
                            velocity: velocity,
                            isFirstCarOfTrain: isFirstCarOfTrain,
                            isLastCarOfTrain: isLastCarOfTrain,
                            trainId: firstCarOfTrain.id
                        });
                    }
                }

                // Setup for the next iteration.
                entityId = vehicle.nextCarOnTrain;
                isFirstCarOfTrain = false;
                if (isLastCarOfTrain) {
                    // If this is the last car of the train, we can assume that the next ride car will be the first car of a train.
                    trainIndex++;
                    entityId = vehicles[trainIndex];
                    isFirstCarOfTrain = true;
                }
            }

            for (var i = 0; i < this.features.length; i++) {
                this.features[i].tick();
            }
        }
    }]);

    return Ride;
}();

Feature.Types = [Element, LiftTrack];

Feature.TypeNames = ["Control System", "Lift/Drop Track"];

var AdvancedTrackManager = function () {
    function AdvancedTrackManager(parkData) {
        _classCallCheck(this, AdvancedTrackManager);

        this.parkData = parkData;
        this.rides = [];

        this.locationPrompt = new LocationPrompt("advanced-track-location-prompt");
    }

    _createClass(AdvancedTrackManager, [{
        key: "addRide",
        value: function addRide(newRide) {
            for (var i = 0; i < this.rides.length; i++) {
                if (this.rides[i].rideId == newRide.rideId) {
                    return;
                }
            }
            this.rides.push(newRide);
            this.save();
        }
    }, {
        key: "deleteRide",
        value: function deleteRide(ride) {
            var index = this.rides.indexOf(ride);
            if (index >= 0) {
                this.rides.splice(index, 1);
            }
            this.save();
        }
    }, {
        key: "getOrCreateRide",
        value: function getOrCreateRide(rideId) {
            if (rideId == -1) {
                console.log("Invalid ride ID -1");
                return null;
            }

            for (var i = 0; i < this.rides.length; i++) {
                if (this.rides[i].rideId == rideId) {
                    return this.rides[i];
                }
            }
            var newRide = new Ride(this, rideId);
            this.rides.push(newRide);
            this.save();
            return newRide;
        }
    }, {
        key: "save",
        value: function save() {
            var data = {};

            data.rides = [];
            for (var i = 0; i < this.rides.length; i++) {
                if (this.rides[i].features.length > 0) {
                    if (this.rides[i].rideId >= 0) {
                        var savedIndex = data.rides.push(this.rides[i].serialize()) - 1;
                        this.rides[i]._savedIndex = savedIndex;
                    }
                }
            }
            this.parkData.save(data);
        }
    }, {
        key: "load",
        value: function load() {
            var data = this.parkData.load();
            if (data == null) {
                return; // No data to load.
            }

            for (var i = 0; i < data.rides.length; i++) {
                var newRide = new Ride(this, data.rides[i].rideId);
                newRide.deserialize(data.rides[i]);
                newRide._savedIndex = i;
                this.rides.push(newRide);
            }
        }
    }, {
        key: "tick",
        value: function tick() {
            for (var i = 0; i < this.rides.length; i++) {
                this.rides[i].tick();
            }
        }
    }]);

    return AdvancedTrackManager;
}();

var RideWizardWindow = function () {
    function RideWizardWindow(onComplete) {
        _classCallCheck(this, RideWizardWindow);

        this.onComplete = onComplete;

        this.rideId = -1;

        this.window = this.createWindow();
    }

    _createClass(RideWizardWindow, [{
        key: "getPotentionalRides",
        value: function getPotentionalRides() {
            var rideNames = [];
            var rideIndices = [];

            var rides = map.rides;

            var collectedRides = [];
            for (var i = 0; i < rides.length; i++) {
                if (rides[i].classification == "ride") {
                    if (rides[i].object.carsPerFlatRide != 255) continue;

                    collectedRides.push({
                        name: rides[i].name,
                        id: rides[i].id
                    });
                }
            }

            collectedRides.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
            });

            for (var _i6 = 0; _i6 < collectedRides.length; _i6++) {
                rideNames.push(collectedRides[_i6].name);
                rideIndices.push(collectedRides[_i6].id);
            }

            return {
                names: rideNames,
                indices: rideIndices
            };
        }
    }, {
        key: "createWindow",
        value: function createWindow() {
            var that = this;

            var window = new Oui.Window("advanced-track-ride-wizard", "Advanced Track - Add Ride");
            window._paddingBottom = 6;
            window._paddingLeft = 6;
            window._paddingRight = 6;
            window.setColors(26, 24);
            window.setWidth(300);

            var potentionalRides = this.getPotentionalRides();
            var rides = new Oui.Widgets.Dropdown(potentionalRides.names, function (index) {
                that.rideId = that.getPotentionalRides().indices[index];
            });
            this.rideId = potentionalRides.indices[0];
            window.addChild(rides);

            var createButton = new Oui.Widgets.Button("Add Ride", function () {
                that.window._handle.close();
                that.onComplete(that.rideId);
            });
            window.addChild(createButton);

            return window;
        }
    }]);

    return RideWizardWindow;
}();

var AdvancedTrackWindow = function () {
    function AdvancedTrackWindow(advancedTrackManager) {
        _classCallCheck(this, AdvancedTrackWindow);

        this.advancedTrackManager = advancedTrackManager;

        this.listView = null;
        this.rideSelectionDropDown = null;
        this.createButton = null;
        this.window = this.createWindow();

        this.selectedRide = this.advancedTrackManager.rides[0];
        this.selectedRideId = 0;

        this.selectedFeatureType = 0;
        this.selectedItem = 0;

        this.editWindow = null;
    }

    _createClass(AdvancedTrackWindow, [{
        key: "open",
        value: function open() {
            this.updateRideDropDown();
            this.updateListView();

            this.window.open();

            var indices = this.getAdvancedTrackRides().indices;
            if (indices[0] < 0) {
                this.createButton.setIsDisabled(true);
                this.openAddRideWindow();
            }
        }
    }, {
        key: "updateListView",
        value: function updateListView() {
            this.listView._items = [];

            if (this.selectedRide != null) {
                for (var i = 0; i < this.selectedRide.features.length; i++) {
                    var feature = this.selectedRide.features[i];
                    this.listView._items.push(this.getRowFromItem(feature, i));
                }
            }

            this.listView.requestRefresh();
        }
    }, {
        key: "getAdvancedTrackRides",
        value: function getAdvancedTrackRides() {
            var rideNames = [];
            var rideIndices = [];

            var rides = this.advancedTrackManager.rides;
            for (var i = 0; i < rides.length; i++) {
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
            };
        }
    }, {
        key: "updateRideDropDown",
        value: function updateRideDropDown() {
            var names = this.getAdvancedTrackRides().names;
            this.rideSelectionDropDown.setItems(names);

            var selectedItem = this.getAdvancedTrackRides().indices.indexOf(this.selectedRideId);

            if (selectedItem < 0) {
                selectedItem = 0;
            }

            this.rideSelectionDropDown.setSelectedItem(selectedItem);

            this.selectedRideId = this.getAdvancedTrackRides().indices[selectedItem];
            if (this.selectedRideId < 0) {
                this.selectedRide = null;
            } else {
                this.selectedRide = this.advancedTrackManager.getOrCreateRide(this.selectedRideId);
            }
        }
    }, {
        key: "createWindow",
        value: function createWindow() {
            var that = this;

            var infoRight = null;

            var window = new Oui.Window("advanced-track-main", "Advanced Track");
            window.setColors(26, 24);
            window._paddingBottom = 14;
            window._paddingTop = 16 + 6;
            window._paddingLeft = 6;
            window._paddingRight = 6;
            window.setWidth(500);
            window.setHorizontalResize(true, 500, 800);
            window.setHeight(250);
            window.setVerticalResize(true, 200, 600);
            window.setOnClose(function () {
                if (that.selectedItem) {
                    that.selectedItem.highlight(false);
                }

                infoRight.setIsDisabled(true);
            });

            {
                var label = new Oui.Widgets.Label("Setup specialized track interactions.");
                label._marginBottom = 6;
                window.addChild(label);
            }

            this.rideSelectionDropDown = new Oui.Widgets.Dropdown(this.getAdvancedTrackRides().names, function (value) {
                var indices = that.getAdvancedTrackRides().indices;

                if (indices[value] < 0) {
                    // new ride
                    that.openAddRideWindow();
                } else {
                    that.createButton.setIsDisabled(false);
                    that.selectedRideId = indices[value];
                    that.selectedRide = that.advancedTrackManager.getOrCreateRide(that.selectedRideId);
                    that.updateListView();
                }
            });
            this.updateRideDropDown();
            window.addChild(this.rideSelectionDropDown);

            var listView = new Oui.Widgets.ListView();
            this.listView = listView;
            listView.setCanSelect(true);
            listView.setColumns(["ID", "Valid", "Title"]);
            listView.getColumns()[0].setMinWidth(16);
            listView.getColumns()[0].setMaxWidth(16);
            listView.getColumns()[1].setMinWidth(16);
            listView.getColumns()[1].setMaxWidth(32);
            window.addChild(listView);
            window.setRemainingHeightFiller(listView);

            var infoBar = new Oui.HorizontalBox();
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

            var infoRightLabel = new Oui.Widgets.Label("");
            infoRight.addChild(infoRightLabel);
            infoRight.setRemainingHeightFiller(infoRightLabel);

            var editButton = new Oui.Widgets.Button("Edit", function () {
                that.openEditWindow(that.selectedItem);
                if (that.selectedItem) {
                    that.selectedItem.highlight(true);
                }
            });
            infoRight.addChild(editButton);

            var deleteButton = new Oui.Widgets.Button("Delete", function () {
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

            listView.setOnClick(function (row, column) {
                var feature = that.selectedRide.features[row];
                that.selectedItem = feature;

                if (that.selectedItem) {
                    that.selectedItem.highlight(true);
                }
                infoRight.setIsDisabled(false);
            });

            var bottom = new Oui.HorizontalBox();
            bottom.setPadding(0, 0, 0, 0);
            window.addChild(bottom);

            {
                var _label3 = new Oui.Widgets.Label("Feature:");
                _label3.setRelativeWidth(15);
                bottom.addChild(_label3);
            }

            var featureTypes = new Oui.Widgets.Dropdown(Feature.TypeNames, function (index) {
                that.selectedFeatureType = index;
            });
            featureTypes._marginRight = 4;
            featureTypes.setHeight(13);
            bottom.addChild(featureTypes);
            bottom.setRemainingWidthFiller(featureTypes);

            this.createButton = new Oui.Widgets.Button("Create", function () {
                var onFeatureCreated = function onFeatureCreated(newFeature) {
                    that.advancedTrackManager.addRide(that.selectedRide);
                    that.selectedRide.addFeature(newFeature);
                    that.openEditWindow(newFeature);
                };

                var wizardWindow = Feature.Types[that.selectedFeatureType].getWizardWindow(that.selectedRide, onFeatureCreated);

                if (wizardWindow == null) {
                    var newFeature = new Feature.Types[that.selectedFeatureType](that.selectedRide);
                    onFeatureCreated(newFeature);
                } else {
                    wizardWindow.window.open();
                }
            });
            this.createButton.setRelativeWidth(15);
            this.createButton.setHeight(13);
            bottom.addChild(this.createButton);

            return window;
        }
    }, {
        key: "openAddRideWindow",
        value: function openAddRideWindow() {
            var that = this;
            this.selectedRide = null;
            this.selectedRideId = -1;

            this.createButton.setIsDisabled(true);

            var rideWizardWindow = new RideWizardWindow(function (rideId) {
                if (rideId >= 0) {
                    that.createButton.setIsDisabled(false);
                    that.selectedRideId = rideId;
                    that.selectedRide = that.advancedTrackManager.getOrCreateRide(that.selectedRideId);

                    that.updateRideDropDown();

                    that.updateListView();
                    that.open();
                }
            });

            this.window._handle.close();
            rideWizardWindow.window.open();

            this.updateListView();
        }
    }, {
        key: "openEditWindow",
        value: function openEditWindow(item) {
            var that = this;

            this.editWindow = item.getEditWindow(this, function () {
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
    }, {
        key: "getRowFromItem",
        value: function getRowFromItem(item, i) {
            return [i + "", item.isValid() ? "Y" : "N", item.getTitle()];
        }
    }]);

    return AdvancedTrackWindow;
}();

// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

var ParkData = function () {
    function ParkData() {
        _classCallCheck(this, ParkData);

        this.namespace = "";
        this.parkName = "";

        this.loaded = false;
    }

    _createClass(ParkData, [{
        key: "init",
        value: function init(namespace) {
            this.namespace = namespace;
            this.parkName = park.name;
        }
    }, {
        key: "save",
        value: function save(parkData) {
            var parkStorage = context.getParkStorage(this.namespace);
            parkStorage.set("ParkData", parkData);

            this.loaded = true;
        }
    }, {
        key: "load",
        value: function load() {
            var parkStorage = context.getParkStorage(this.namespace);
            var parkData = parkStorage.get("ParkData", null);

            if (parkData == null) {
                // Legacy support for parkname identified save data in the shared storage:
                var allParksData = context.sharedStorage.get(this.namespace + ".ParkData");
                if (allParksData == null) {
                    allParksData = [];
                }
                for (var i = 0; i < allParksData.length; i++) {
                    if (allParksData[i].parkName == this.parkName) {
                        this.loaded = true;
                        parkData = allParksData[i].data;

                        console.log("Park data will be transferred from the shared storage to the park store.");
                        break;
                    }
                }
            } else {
                this.loaded = true;
            }

            if (!this.loaded) {
                // No park data for this park.
                return null;
            }

            parkData = this.fix_1_3(parkData);

            return parkData;
        }
    }, {
        key: "fix_1_3",
        value: function fix_1_3(parkData) {
            // Group track features by ride, and the introduction of the "Feature" type.

            // Check the version of the park data.
            if (!parkData.elements) {
                return parkData;
            }

            var newParkData = {
                rides: []
            };

            var rideIds = [];
            var rideElements = [];
            for (var i = 0; i < parkData.elements.length; i++) {
                var element = parkData.elements[i];
                var rideId = element.trigger.rideId;

                var _index = rideIds.indexOf(rideId);
                if (_index < 0) {
                    _index = rideIds.push(rideId) - 1;
                    rideElements.push([]);
                }
                element.type = Feature.Types.indexOf(Element);
                rideElements[_index].push(element);
            }

            for (var _i7 = 0; _i7 < rideIds.length; _i7++) {
                newParkData.rides.push({
                    rideId: rideIds[_i7],
                    features: rideElements[_i7]
                });
            }

            return newParkData;
        }
    }]);

    return ParkData;
}();

// Expose the OpenRCT2 to Visual Studio Code's Intellisense
/// <reference path="../../../bin/openrct2.d.ts" />

function closeWindow(classification) {
    var window = ui.getWindow(classification);
    if (window) {
        window.close();
    }
}

function closeAll() {
    closeWindow("advanced-track-edit");
    closeWindow("advanced-track-main");
    closeWindow("advanced-track-ride-wizard");
    closeWindow("advanced-track-wizard-element");
    closeWindow("advanced-track-edit-lifttrack");
}

function main() {
    if (network.mode != "none") {
        return;
    }

    try {
        var parkData = new ParkData();
        parkData.init("Oli414.AdvancedTrack");
        var advancedTrackManager = new AdvancedTrackManager(parkData);
        var advancedTrackWindow = new AdvancedTrackWindow(advancedTrackManager);

        ui.registerMenuItem("Advanced Track", function () {
            closeAll();
            advancedTrackWindow.open();
        });

        context.subscribe("interval.tick", function () {
            advancedTrackManager.tick();
        });

        context.subscribe("map.save", function (e) {
            advancedTrackManager.save();
        });

        advancedTrackManager.load();
    } catch (exc) {
        console.log(exc.stack);
    }
}

registerPlugin({
    name: 'AdvancedTrack',
    version: '1.3.3',
    licence: "MIT",
    minApiVersion: 47,
    targetApiVersion: 47,
    authors: ['Oli414'],
    type: 'local',
    main: main
});
