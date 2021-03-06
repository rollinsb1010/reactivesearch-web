'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('@emotion/core');

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

var _Button = require('../../styles/Button');

var _Button2 = _interopRequireDefault(_Button);

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var ToggleButton = function (_Component) {
	_inherits(ToggleButton, _Component);

	function ToggleButton(props) {
		_classCallCheck(this, ToggleButton);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var value = props.selectedValue || props.value || props.defaultValue || [];
		var currentValue = ToggleButton.parseValue(value, props);

		_this.state = {
			currentValue: currentValue
		};

		// Set custom query in store
		// updateCustomQuery(props.componentId, props, currentValue);
		// const hasMounted = false;

		// if ((currentValue.length && !props.group) || (currentValue.length && props.group && props.group !== props.selectedValue)) {
		// 	this.handleToggle(currentValue, true, props, hasMounted);
		// }
		return _this;
	}

	ToggleButton.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	ToggleButton.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.handleToggle(this.props.value, true, this.props);
		} else if (this.props.multiSelect) {
			// for multiselect selectedValue will be an array
			if (!(0, _helper.isEqual)(this.state.currentValue, this.props.selectedValue) && !(0, _helper.isEqual)(prevProps.selectedValue, this.props.selectedValue)) {
				var _props2 = this.props,
				    value = _props2.value,
				    onChange = _props2.onChange;

				if (value === undefined) {
					this.handleToggle(this.props.selectedValue || [], true, this.props);
				} else if (onChange) {
					// value prop exists
					onChange(this.props.selectedValue || '');
				} else {
					// value prop exists and onChange is not defined:
					// we need to put the current value back into the store
					// if the clear action was triggered by interacting with
					// selected-filters component
					this.handleToggle(this.state.currentValue, true, this.props);
				}
			}
		} else {
			// else selectedValue will be a string
			var currentValue = this.state.currentValue[0] ? this.state.currentValue[0].value : null;
			if (!(0, _helper.isEqual)(currentValue, this.props.selectedValue) && !(0, _helper.isEqual)(prevProps.selectedValue, this.props.selectedValue)) {
				var _props3 = this.props,
				    _value = _props3.value,
				    _onChange = _props3.onChange;

				if (_value === undefined) {
					this.handleToggle(this.props.selectedValue || [], true, this.props);
				} else if (_onChange) {
					// value prop exists
					_onChange(this.props.selectedValue || '');
				} else {
					// value prop exists and onChange is not defined:
					// we need to put the current value back into the store
					// if the clear action was triggered by interacting with
					// selected-filters component
					this.handleToggle(this.state.currentValue, true, this.props);
				}
			}
		}
	};

	ToggleButton.prototype.render = function render() {
		var _this3 = this;

		return (0, _core.jsx)(
			_Container2.default,
			{
				style: this.props.style,
				css: _Button.toggleButtons,
				className: '' + (this.props.className || '')
			},
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.props.data.map(function (item) {
				var isSelected = _this3.state.currentValue.some(function (value) {
					return value.value === item.value;
				});
				return (0, _core.jsx)(
					_Button2.default,
					{
						className: (0, _helper.getClassName)(_this3.props.innerClass, 'button') + ' ' + (isSelected ? 'active' : ''),
						onClick: function onClick(e) {
							return _this3.handleClick(item, e);
						},
						onKeyPress: function onKeyPress(e) {
							return (0, _helper.handleA11yAction)(e, function () {
								return _this3.handleClick(item, e);
							});
						},
						key: item.value,
						tabIndex: '0',
						primary: isSelected,
						large: true
					},
					item.label,
					_this3.props.children
				);
			})
		);
	};

	return ToggleButton;
}(_react.Component);

ToggleButton.parseValue = function (value, props) {
	if (Array.isArray(value)) {
		if (typeof value[0] === 'string') {
			return props.data.filter(function (item) {
				return value.includes(item.value);
			});
		}
		return value;
	}
	return props.data.filter(function (item) {
		return item.value === value;
	});
};

ToggleButton.defaultQuery = function (value, props) {
	var query = null;
	if (value && value.length) {
		query = {
			bool: {
				boost: 1.0,
				minimum_should_match: 1,
				should: value.map(function (item) {
					var _term;

					return {
						term: (_term = {}, _term[props.dataField] = item.value, _term)
					};
				})
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

	this.handleToggle = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this4.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var currentValue = _this4.state.currentValue;

		var toggleValue = value;
		var finalValue = [];

		if (isDefaultValue) {
			finalValue = ToggleButton.parseValue(toggleValue, props);
		} else if (_this4.props.multiSelect) {
			finalValue = currentValue.some(function (item) {
				return item.value === toggleValue.value;
			}) ? currentValue.filter(function (item) {
				return item.value !== toggleValue.value;
			}) : currentValue.concat(toggleValue);
		} else {
			finalValue = currentValue.some(function (item) {
				return item.value === toggleValue.value;
			}) ? [] : [toggleValue];
		}

		_this4.setValue(finalValue, props, hasMounted);
	};

	this.setValue = function (value) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;
		var hasMounted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this4.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			};

			if (hasMounted) {
				_this4.setState({
					currentValue: value
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};
		(0, _helper.checkValueChange)(props.componentId, props.multiSelect ? value : value[0], props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props) {
		var filterValue = value;
		if (!props.multiSelect) {
			filterValue = value[0] ? value[0].value : null;
		}
		var customQuery = props.customQuery;


		var query = ToggleButton.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref = customQuery(value, props) || {};

			query = _ref.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
			(0, _helper.updateCustomQuery)(props.group || props.componentId, props, value);
		}

		props.setQueryOptions(props.group || props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.group || props.componentId,
			query: query,
			value: filterValue, // sets a string in URL not array
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.toggleButton
		});
	};

	this.handleClick = function (item, e) {
		e.preventDefault();
		var _props4 = _this4.props,
		    enableStrictSelection = _props4.enableStrictSelection,
		    multiSelect = _props4.multiSelect;

		if (enableStrictSelection && !multiSelect && _this4.state.currentValue.find(function (stateItem) {
			return (0, _helper.isEqual)(item, stateItem);
		})) {
			return false;
		}
		var _props5 = _this4.props,
		    value = _props5.value,
		    onChange = _props5.onChange;

		if (value === undefined) {
			_this4.handleToggle(item);
		} else if (onChange) onChange(item);
		return true;
	};
};

ToggleButton.propTypes = {
	updateQuery: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setQueryOptions: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.props.enableAppbase,
	// component props
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	data: _types2.default.data,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.stringOrArray,
	value: _types2.default.stringOrArray,
	filterLabel: _types2.default.string,
	nestedField: _types2.default.string,
	innerClass: _types2.default.style,
	multiSelect: _types2.default.bool,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	onQueryChange: _types2.default.func,
	react: _types2.default.react,
	showFilter: _types2.default.bool,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	index: _types2.default.string,
	enableStrictSelection: _types2.default.bool,
	group: _types2.default.string
};

ToggleButton.defaultProps = {
	className: null,
	multiSelect: true,
	showFilter: true,
	style: {},
	URLParams: false,
	enableStrictSelection: false,
	group: null
};

// Add componentType for SSR
ToggleButton.componentType = _constants.componentTypes.toggleButton;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		selectedValue: state.selectedValues[props.group] && state.selectedValues[props.group].value || state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
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
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({}, props, { componentType: _constants.componentTypes.toggleButton }),
		function () {
			return (0, _core.jsx)(ToggleButton, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, ToggleButton);

ForwardRefComponent.displayName = 'ToggleButton';
exports.default = ForwardRefComponent;