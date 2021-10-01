'use strict';

exports.__esModule = true;
exports.MODIFIER_KEYS = exports.isEmpty = exports.getPopularSuggestionsComponent = exports.hasPopularSuggestionsRenderer = exports.isQueryIdentical = exports.getRangeQueryWithNullValues = exports.getNullValuesQuery = exports.handleCaretPosition = exports.getValidPropsKeys = exports.isIdentical = exports.isEvent = exports.hasCustomRenderer = exports.getComponent = exports.isFunction = exports.composeThemeObject = exports.connect = exports.ReactReduxContext = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.parseValueArray = parseValueArray;
exports.escapeRegExp = escapeRegExp;
exports.isNumeric = isNumeric;
exports.isHotkeyCombination = isHotkeyCombination;
exports.getCharFromCharCode = getCharFromCharCode;
exports.parseFocusShortcuts = parseFocusShortcuts;
exports.extractModifierKeysFromFocusShortcuts = extractModifierKeysFromFocusShortcuts;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactReduxContext = exports.ReactReduxContext = _react2.default.createContext(null);

var connect = exports.connect = function connect() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return _reactRedux.connect.apply(undefined, args.concat([null, { context: ReactReduxContext }]));
};

var composeThemeObject = exports.composeThemeObject = function composeThemeObject() {
	var ownTheme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var userTheme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	return {
		typography: _extends({}, ownTheme.typography, userTheme.typography),
		colors: _extends({}, ownTheme.colors, userTheme.colors),
		component: _extends({}, ownTheme.component, userTheme.component)
	};
};

/**
 * To determine wether an element is a function
 * @param {any} element
 */
var isFunction = exports.isFunction = function isFunction(element) {
	return typeof element === 'function';
};

/**
 * Extracts the render prop from props and returns a valid React element
 * @param {Object} data
 * @param {Object} props
 */
var getComponent = exports.getComponent = function getComponent() {
	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var children = props.children,
	    render = props.render;
	// Render function as child

	if (isFunction(children)) {
		return children(data);
	}
	// Render function as render prop
	if (isFunction(render)) {
		return render(data);
	}
	return null;
};
/**
 * To determine whether a component has render prop defined or not
 * @returns {Boolean}
 */
var hasCustomRenderer = exports.hasCustomRenderer = function hasCustomRenderer() {
	var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var render = props.render,
	    children = props.children;

	return isFunction(children) || isFunction(render);
};

var isEvent = exports.isEvent = function isEvent(candidate) {
	return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
};
/**
 * To check if two functions are identical
 */
var isIdentical = exports.isIdentical = function isIdentical(a, b) {
	if (!a && !b) return true;
	if (typeof a === 'function' && typeof b === 'function') {
		if ((0, _helper.isEqual)(a(), b())) {
			return true;
		}
		return false;
	}
	return false;
};
var getValidPropsKeys = exports.getValidPropsKeys = function getValidPropsKeys() {
	var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return Object.keys(props).filter(function (i) {
		return _constants.validProps.includes(i || 'group');
	});
};
/**
 * Handles the caret position for input components
 * @param {HTMLInputElement} e
 */
var handleCaretPosition = exports.handleCaretPosition = function handleCaretPosition(e) {
	if (window) {
		var caret = e.target.selectionStart;
		var element = e.target;
		window.requestAnimationFrame(function () {
			element.selectionStart = caret;
			element.selectionEnd = caret;
		});
	}
};
// elastic search query for including null values
var getNullValuesQuery = exports.getNullValuesQuery = function getNullValuesQuery(fieldName) {
	return {
		bool: {
			must_not: {
				exists: {
					field: fieldName
				}
			}
		}
	};
};

var getRangeQueryWithNullValues = exports.getRangeQueryWithNullValues = function getRangeQueryWithNullValues(value, props) {
	var _range;

	var query = null;
	var rangeQuery = {
		range: (_range = {}, _range[props.dataField] = {
			gte: value[0],
			lte: value[1],
			boost: 2.0
		}, _range)
	};
	if (props.includeNullValues) {
		query = {
			bool: {
				should: [rangeQuery, getNullValuesQuery(props.dataField)]
			}
		};
	} else query = rangeQuery;
	return query;
};

// parses current array (i.e. this.props.value) for `onChange` callback for multi-* components
function parseValueArray() {
	var originalArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var currentValue = arguments[1];

	var newValue = Object.assign([], originalArr);
	var currentValueIndex = newValue.indexOf(currentValue);
	if (currentValueIndex > -1) newValue.splice(currentValueIndex, 1);else newValue.push(currentValue);
	return newValue;
}

// escapes regex for special characters: \ => \\, $ => \$
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * @param value
 * @param {Object} props
 * @param {Object} prevProps
 * @param {'defaultQuery' | 'customQuery'} key
 */
var isQueryIdentical = exports.isQueryIdentical = function isQueryIdentical() {
	var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var prevProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var key = arguments[3];

	if (!key) return true;
	if (typeof props[key] !== 'function' || typeof prevProps[key] !== 'function') return true;
	// to not call original defaultQuery and customQuery, as here we are only comparing
	return (0, _helper.isEqual)(props[key](value, props), prevProps[key](value, prevProps));
};

/**
 * To determine whether a component has renderPopularSuggestions prop defined or not
 * @returns {Boolean}
 */
var hasPopularSuggestionsRenderer = exports.hasPopularSuggestionsRenderer = function hasPopularSuggestionsRenderer() {
	var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	// TODO: Remove renderQuerySuggestions in v4
	var renderQuerySuggestions = props.renderQuerySuggestions,
	    renderPopularSuggestions = props.renderPopularSuggestions;

	return isFunction(renderPopularSuggestions || renderQuerySuggestions);
};

/**
 * Extracts the renderPopularSuggestions prop from props and returns a valid React element
 * @param {Object} data
 * @param {Object} props
 */
var getPopularSuggestionsComponent = exports.getPopularSuggestionsComponent = function getPopularSuggestionsComponent() {
	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	// TODO: Remove renderQuerySuggestions in v4
	var renderQuerySuggestions = props.renderQuerySuggestions,
	    renderPopularSuggestions = props.renderPopularSuggestions;

	var renderFunc = renderPopularSuggestions || renderQuerySuggestions;
	// Render function as render prop
	if (isFunction(renderFunc)) {
		return renderFunc(data);
	}
	return null;
};

var isEmpty = exports.isEmpty = function isEmpty(val) {
	return !(val && val.length && Object.keys(val).length);
};

function isNumeric(value) {
	return (/^-?\d+$/.test(value)
	);
}

// check if passed shortcut a key combination
function isHotkeyCombination(hotkey) {
	return typeof hotkey === 'string' && hotkey.indexOf('+') !== -1;
}

// used for getting correct string char from keycode passed
// the below algebraic expression is used to get the correct ascii code out of the e.which
// || e.keycode returned value
// since the keyboards doesn't understand ascii but scan codes and they differ for
// certain keys such as '/'
// stackoverflow ref: https://stackoverflow.com/a/29811987/10822996
function getCharFromCharCode(passedCharCode) {
	var which = passedCharCode;
	var chrCode = which - 48 * Math.floor(which / 48);
	return String.fromCharCode(which >= 96 ? chrCode : which);
}

// used for parsing focusshortcuts for keycodes passed as string, eg: 'ctrl+/' is same as 'ctrl+47'
// returns focusShortcuts containing appropriate key charsas depicted on keyboards
function parseFocusShortcuts(focusShortcutsArray) {
	if (isEmpty(focusShortcutsArray)) return [];

	var parsedFocusShortcutsArray = [];
	focusShortcutsArray.forEach(function (element) {
		if (typeof element === 'string') {
			if (isHotkeyCombination(element)) {
				// splitting the combination into pieces
				var splitCombination = element.split('+');
				var parsedSplitCombination = [];
				// parsedCombination would have all the keycodes converted into chars
				var parsedCombination = '';
				for (var i = 0; i < splitCombination.length; i += 1) {
					if (isNumeric(splitCombination[i])) {
						parsedSplitCombination.push(getCharFromCharCode(+splitCombination[i]));
					} else {
						parsedSplitCombination.push(splitCombination[i]);
					}
				}
				parsedCombination = parsedSplitCombination.join('+');
				parsedFocusShortcutsArray.push(parsedCombination);
			} else if (isNumeric(element)) {
				parsedFocusShortcutsArray.push(getCharFromCharCode(+element));
			} else {
				// single char shortcut, eg: '/'
				parsedFocusShortcutsArray.push(element);
			}
		} else {
			// if not a string the the shortcut is assumed to be a keycode
			parsedFocusShortcutsArray.push(getCharFromCharCode(element));
		}
	});
	return parsedFocusShortcutsArray;
}

var MODIFIER_KEYS = exports.MODIFIER_KEYS = ['shift', 'ctrl', 'alt', 'control', 'option', 'cmd', 'command'];

// filter out modifierkeys such as ctrl, alt, command, shift from focusShortcuts prop
function extractModifierKeysFromFocusShortcuts(focusShortcutsArray) {
	return focusShortcutsArray.filter(function (shortcutKey) {
		return MODIFIER_KEYS.includes(shortcutKey);
	});
}