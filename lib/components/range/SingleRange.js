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

var _FormControlList = require('../../styles/FormControlList');

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleRange = function (_Component) {
	_inherits(SingleRange, _Component);

	function SingleRange(props) {
		_classCallCheck(this, SingleRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var value = props.selectedValue || defaultValue || null;
		var currentValue = SingleRange.parseValue(value, props);

		_this.state = {
			currentValue: currentValue
		};
		_this.type = 'range';
		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		var hasMounted = false;

		if (currentValue) {
			_this.setValue(currentValue, props, hasMounted);
		}
		return _this;
	}

	SingleRange.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	SingleRange.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.setValue(this.props.value);
		} else if (!(0, _helper.isEqual)(this.state.currentValue, this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props2 = this.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (value === undefined) {
				this.setValue(this.props.selectedValue || null);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				this.setValue(this.state.currentValue);
			}
		}
	};

	// parses range label to get start and end


	SingleRange.prototype.render = function render() {
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
					'aria-label': this.props.componentId + '-items',
					role: 'radiogroup'
				},
				this.props.data.map(function (item) {
					var selected = !!_this3.state.currentValue && _this3.state.currentValue.label === item.label;
					return _react2.default.createElement(
						'li',
						{
							key: item.label,
							className: '' + (selected ? 'active' : ''),
							role: 'radio',
							'aria-checked': selected
						},
						_react2.default.createElement(_FormControlList.Radio, {
							className: (0, _helper.getClassName)(_this3.props.innerClass, 'radio'),
							id: _this3.props.componentId + '-' + item.label,
							tabIndex: selected ? '-1' : '0',
							value: item.label,
							onChange: _this3.handleClick,
							checked: selected,
							show: _this3.props.showRadio
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

	return SingleRange;
}(_react.Component);

SingleRange.parseValue = function (value, props) {
	return props.data.find(function (item) {
		return item.label === value;
	}) || null;
};

SingleRange.defaultQuery = function (value, props) {
	var query = null;
	if (value) {
		query = (0, _utils.getRangeQueryWithNullValues)([value.start, value.end], props);
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

	this.setValue = function (value) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;
		var hasMounted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		var currentValue = typeof value === 'string' ? SingleRange.parseValue(value, props) : value;

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this4.updateQuery(currentValue, props);
				if (props.onValueChange) props.onValueChange(currentValue);
			};
			if (hasMounted) {
				_this4.setState({
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

		var query = SingleRange.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref = customQuery(value, props) || {};

			query = _ref.query;

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
			componentType: _constants.componentTypes.singleRange
		});
	};

	this.handleClick = function (e) {
		var _props3 = _this4.props,
		    value = _props3.value,
		    onChange = _props3.onChange;
		var rangeValue = e.target.value;


		if (value === undefined) {
			_this4.setValue(rangeValue);
		} else if (onChange) {
			onChange(rangeValue);
		}
	};
};

SingleRange.propTypes = {
	updateQuery: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	data: _types2.default.data,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.string,
	value: _types2.default.string,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	nestedField: _types2.default.string,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	react: _types2.default.react,
	showFilter: _types2.default.bool,
	showRadio: _types2.default.boolRequired,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	includeNullValues: _types2.default.bool,
	index: _types2.default.string
};

SingleRange.defaultProps = {
	className: null,
	showFilter: true,
	showRadio: true,
	style: {},
	URLParams: false,
	includeNullValues: false
};

// Add componentType for SSR
SingleRange.componentType = _constants.componentTypes.singleRange;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
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
		_extends({}, props, { componentType: _constants.componentTypes.singleRange }),
		function () {
			return _react2.default.createElement(SingleRange, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, SingleRange);

ForwardRefComponent.displayName = 'SingleRange';
exports.default = ForwardRefComponent;