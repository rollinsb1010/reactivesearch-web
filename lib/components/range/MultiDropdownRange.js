'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Dropdown = require('../shared/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiDropdownRange = function (_Component) {
	_inherits(MultiDropdownRange, _Component);

	function MultiDropdownRange(props) {
		_classCallCheck(this, MultiDropdownRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var value = props.selectedValue || defaultValue || [];
		var currentValue = MultiDropdownRange.parseValue(value, props);

		// selectedValues hold the selected items as keys for O(1) complexity
		_this.selectedValues = {};
		currentValue.forEach(function (item) {
			_this.selectedValues[item.label] = true;
		});

		_this.state = {
			currentValue: currentValue
		};

		_this.type = 'range';
		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		var hasMounted = false;

		if (value.length) {
			_this.selectItem({
				item: value,
				isDefaultValue: true,
				props: props,
				hasMounted: hasMounted
			});
		}
		return _this;
	}

	MultiDropdownRange.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	MultiDropdownRange.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.selectItem({
				item: this.props.value,
				isDefaultValue: true
			});
		} else if (!(0, _helper.isEqual)(this.state.currentValue, this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props2 = this.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (value === undefined) {
				this.selectItem({ item: this.props.selectedValue || null });
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				var selectedValuesArray = Object.keys(this.selectedValues);
				this.selectItem({
					item: selectedValuesArray,
					isDefaultValue: true
				});
			}
		}
	};

	// parses range label to get start and end


	MultiDropdownRange.prototype.render = function render() {
		return _react2.default.createElement(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			_react2.default.createElement(_Dropdown2.default, {
				innerClass: this.props.innerClass,
				items: this.props.data,
				onChange: this.handleChange,
				selectedItem: this.state.currentValue,
				placeholder: this.props.placeholder,
				searchPlaceholder: this.props.searchPlaceholder,
				keyField: 'label',
				multi: true,
				returnsObject: true,
				customLabelRenderer: this.props.renderLabel,
				themePreset: this.props.themePreset
			})
		);
	};

	return MultiDropdownRange;
}(_react.Component);

MultiDropdownRange.parseValue = function (value, props) {
	return value ? props.data.filter(function (item) {
		return value.includes(item.label);
	}) : null;
};

MultiDropdownRange.defaultQuery = function (values, props) {
	var generateRangeQuery = function generateRangeQuery(dataField, items) {
		if (items.length > 0) {
			return items.map(function (value) {
				return (0, _utils.getRangeQueryWithNullValues)([value.start, value.end], props);
			});
		}
		return null;
	};

	var query = null;

	if (values && values.length) {
		query = {
			bool: {
				should: generateRangeQuery(props.dataField, values),
				minimum_should_match: 1,
				boost: 1.0
			}
		};
	}

	if (query && props.nestedField) {
		return {
			nested: {
				path: props.nestedField,
				query: query
			}
		};
	}

	return query;
};

var _initialiseProps = function _initialiseProps() {
	var _this3 = this;

	this.selectItem = function (_ref) {
		var item = _ref.item,
		    _ref$isDefaultValue = _ref.isDefaultValue,
		    isDefaultValue = _ref$isDefaultValue === undefined ? false : _ref$isDefaultValue,
		    _ref$props = _ref.props,
		    props = _ref$props === undefined ? _this3.props : _ref$props,
		    _ref$hasMounted = _ref.hasMounted,
		    hasMounted = _ref$hasMounted === undefined ? true : _ref$hasMounted;
		var currentValue = _this3.state.currentValue;

		if (!item) {
			currentValue = [];
			_this3.selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = MultiDropdownRange.parseValue(item, props);
			currentValue.forEach(function (value) {
				var _extends2;

				_this3.selectedValues = _extends({}, _this3.selectedValues, (_extends2 = {}, _extends2[value.label] = true, _extends2));
			});
		} else if (Array.isArray(item) && item.length && typeof item[0] === 'string') {
			currentValue = props.data.filter(function (dataItem) {
				return item.includes(dataItem.label);
			});
			_this3.selectedValues = {};
			item.forEach(function (value) {
				var _extends3;

				_this3.selectedValues = _extends({}, _this3.selectedValues, (_extends3 = {}, _extends3[value] = true, _extends3));
				return true;
			});
		} else if (_this3.selectedValues[item.label]) {
			currentValue = currentValue.filter(function (value) {
				return value.label !== item.label;
			});

			var _selectedValues = _this3.selectedValues,
			    del = _selectedValues[item.label],
			    selectedValues = _objectWithoutProperties(_selectedValues, [item.label]);

			_this3.selectedValues = selectedValues;
		} else if (item.label) {
			var _extends4;

			currentValue = [].concat(currentValue, [item]);
			_this3.selectedValues = _extends({}, _this3.selectedValues, (_extends4 = {}, _extends4[item.label] = true, _extends4));
		}
		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this3.updateQuery(currentValue, props);
				if (props.onValueChange) props.onValueChange(currentValue);
			};

			if (hasMounted) {
				_this3.setState({
					currentValue: currentValue
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};

		(0, _helper.checkValueChange)(props.componentId, currentValue, props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var query = MultiDropdownRange.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref2 = customQuery(value, props) || {};

			query = _ref2.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query: query,
			value: value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.multiDropdownRange
		});
	};

	this.handleChange = function (items) {
		var _props3 = _this3.props,
		    value = _props3.value,
		    onChange = _props3.onChange;

		if (value === undefined) {
			_this3.selectItem({ item: items });
		} else if (onChange) {
			onChange((0, _utils.parseValueArray)(_this3.props.value, items.label));
		}
	};
};

MultiDropdownRange.propTypes = {
	updateQuery: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setQueryOptions: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	data: _types2.default.data,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.stringArray,
	value: _types2.default.stringArray,
	filterLabel: _types2.default.filterLabel,
	innerClass: _types2.default.style,
	nestedField: _types2.default.string,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	placeholder: _types2.default.string,
	searchPlaceholder: _types2.default.string,
	react: _types2.default.react,
	showFilter: _types2.default.bool,
	style: _types2.default.style,
	title: _types2.default.title,
	themePreset: _types2.default.themePreset,
	URLParams: _types2.default.bool,
	includeNullValues: _types2.default.bool,
	renderLabel: _types2.default.func,
	index: _types2.default.string
};

MultiDropdownRange.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	URLParams: false,
	includeNullValues: false
};

// Add componentType for SSR
MultiDropdownRange.componentType = _constants.componentTypes.multiDropdownRange;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : null,
		themePreset: state.config.themePreset,
		enableAppbase: state.config.enableAppbase
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		},
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return _react2.default.createElement(
		_ComponentWrapper2.default,
		_extends({}, props, { componentType: _constants.componentTypes.multiDropdownRange }),
		function () {
			return _react2.default.createElement(MultiDropdownRange, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, MultiDropdownRange);

ForwardRefComponent.displayName = 'MultiDropdownRange';
exports.default = ForwardRefComponent;