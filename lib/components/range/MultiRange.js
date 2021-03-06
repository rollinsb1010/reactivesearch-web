'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _FormControlList = require('../../styles/FormControlList');

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiRange = function (_Component) {
	_inherits(MultiRange, _Component);

	function MultiRange(props) {
		_classCallCheck(this, MultiRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var value = props.selectedValue || defaultValue || [];
		var currentValue = MultiRange.parseValue(value, props);

		var selectedValues = {};
		currentValue.forEach(function (item) {
			selectedValues[item.label] = true;
		});

		_this.state = {
			currentValue: currentValue,
			// selectedValues hold the selected items as keys for O(1) complexity
			selectedValues: selectedValues
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

	MultiRange.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	MultiRange.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
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
				this.selectItem({ item: this.props.selectedValue || null, isDefaultValue: true });
			} else if (onChange) {
				this.selectItem({
					item: this.props.selectedValue || null
				});
			} else {
				var selectedValuesArray = Object.keys(this.state.selectedValues);
				this.selectItem({
					item: selectedValuesArray,
					isDefaultValue: true
				});
			}
		}
	};

	// parses range label to get start and end


	MultiRange.prototype.render = function render() {
		var _this3 = this;

		return _react2.default.createElement(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			_react2.default.createElement(
				_FormControlList.UL,
				{
					className: (0, _helper.getClassName)(this.props.innerClass, 'list') || null,
					role: 'listbox',
					'aria-label': this.props.componentId + '-items'
				},
				this.props.data.map(function (item) {
					var isChecked = !!_this3.state.selectedValues[item.label];
					return _react2.default.createElement(
						'li',
						{
							key: item.label,
							className: '' + (isChecked ? 'active' : ''),
							role: 'option',
							'aria-checked': isChecked,
							'aria-selected': isChecked
						},
						_react2.default.createElement(_FormControlList.Checkbox, {
							className: (0, _helper.getClassName)(_this3.props.innerClass, 'checkbox') || null,
							id: _this3.props.componentId + '-' + item.label,
							name: _this3.props.componentId + '-' + item.label,
							value: item.label,
							onChange: _this3.handleClick,
							checked: isChecked,
							show: _this3.props.showCheckbox
						}),
						_react2.default.createElement(
							'label',
							{
								className: (0, _helper.getClassName)(_this3.props.innerClass, 'label') || null,
								htmlFor: _this3.props.componentId + '-' + item.label
							},
							_react2.default.createElement(
								'span',
								null,
								item.label
							)
						)
					);
				})
			)
		);
	};

	return MultiRange;
}(_react.Component);

MultiRange.parseValue = function (value, props) {
	return value ? props.data.filter(function (item) {
		return value.includes(item.label);
	}) : null;
};

MultiRange.defaultQuery = function (values, props) {
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
	var _this4 = this;

	this.selectItem = function (_ref) {
		var item = _ref.item,
		    _ref$isDefaultValue = _ref.isDefaultValue,
		    isDefaultValue = _ref$isDefaultValue === undefined ? false : _ref$isDefaultValue,
		    _ref$props = _ref.props,
		    props = _ref$props === undefined ? _this4.props : _ref$props,
		    _ref$hasMounted = _ref.hasMounted,
		    hasMounted = _ref$hasMounted === undefined ? true : _ref$hasMounted;
		var _state = _this4.state,
		    currentValue = _state.currentValue,
		    selectedValues = _state.selectedValues;

		if (!item) {
			currentValue = [];
			selectedValues = {};
		} else if (isDefaultValue) {
			// checking if the items in defaultSeleted exist in the data prop
			currentValue = MultiRange.parseValue(item, props);
			selectedValues = item.reduce(function (accObj, valKey) {
				// eslint-disable-next-line no-param-reassign
				accObj[valKey] = true;
				return accObj;
			}, {});
		} else if (selectedValues[item]) {
			currentValue = currentValue.filter(function (value) {
				return value.label !== item;
			});

			var _selectedValues = selectedValues,
			    del = _selectedValues[item],
			    selected = _objectWithoutProperties(_selectedValues, [item]);

			selectedValues = selected;
		} else {
			var _extends2;

			var currentItem = props.data.find(function (value) {
				return item === value.label;
			});
			currentValue = [].concat(currentValue, [currentItem]);
			selectedValues = _extends({}, selectedValues, (_extends2 = {}, _extends2[item] = true, _extends2));
		}

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this4.updateQuery(currentValue, props);
				if (props.onValueChange) props.onValueChange(currentValue);
			};

			if (hasMounted) {
				_this4.setState({
					currentValue: currentValue,
					selectedValues: selectedValues
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};

		(0, _helper.checkValueChange)(props.componentId, currentValue, props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var query = MultiRange.defaultQuery(value, props);
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
			componentType: _constants.componentTypes.multiRange
		});
	};

	this.handleClick = function (e) {
		var _props3 = _this4.props,
		    value = _props3.value,
		    onChange = _props3.onChange;
		var rangeValue = e.target.value;

		if (value === undefined) {
			_this4.selectItem({ item: rangeValue });
		} else if (onChange) {
			onChange((0, _utils.parseValueArray)(_this4.props.value, rangeValue));
		}
	};
};

MultiRange.propTypes = {
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
	react: _types2.default.react,
	showCheckbox: _types2.default.boolRequired,
	showFilter: _types2.default.bool,
	style: _types2.default.style,
	supportedOrientations: _types2.default.supportedOrientations,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	includeNullValues: _types2.default.bool,
	index: _types2.default.string
};

MultiRange.defaultProps = {
	className: null,
	showCheckbox: true,
	showFilter: true,
	style: {},
	URLParams: false,
	includeNullValues: false
};

// Add componentType for SSR
MultiRange.componentType = _constants.componentTypes.multiRange;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : null,
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
		_extends({}, props, { componentType: _constants.componentTypes.multiRange }),
		function () {
			return _react2.default.createElement(MultiRange, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, MultiRange);

ForwardRefComponent.displayName = 'MultiRange';
exports.default = ForwardRefComponent;