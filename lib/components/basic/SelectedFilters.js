'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('@emotion/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emotionTheming = require('emotion-theming');

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _Button = require('../../styles/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var SelectedFilters = function (_Component) {
	_inherits(SelectedFilters, _Component);

	function SelectedFilters(props) {
		_classCallCheck(this, SelectedFilters);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.componentDidUpdate = function () {
			if (_this.props.onChange) {
				_this.props.onChange(_this.props.selectedValues);
			}
		};

		_this.remove = function (component) {
			var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var onClear = _this.props.onClear;

			_this.props.setValue(component, null);
			if (onClear) {
				onClear(component, value);
			}
		};

		_this.clearValues = function () {
			var _this$props = _this.props,
			    onClear = _this$props.onClear,
			    resetToDefault = _this$props.resetToDefault;

			if (resetToDefault) {
				_this.props.resetValuesToDefault();
			} else {
				_this.props.clearValues();
			}
			if (onClear) {
				onClear(null);
			}
		};

		_this.renderValue = function (value, isArray) {
			if (isArray && value.length) {
				var arrayToRender = value.map(function (item) {
					return _this.renderValue(item);
				});
				return arrayToRender.join(', ');
			} else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				// TODO: support for NestedList
				var label = (typeof value.label === 'string' ? value.label : value.value) || value.key || value.distance || null;
				if (value.location) {
					label = value.location + ' - ' + label;
				}
				return label;
			}
			return value;
		};

		_this.renderFilters = function () {
			var _this$props2 = _this.props,
			    selectedValues = _this$props2.selectedValues,
			    components = _this$props2.components,
			    componentProps = _this$props2.componentProps;

			return Object.keys(selectedValues)
			//add ability for groups to properly filter
			.filter(function (id) {
				return _this.props.components.includes(id) && selectedValues[id].showFilter || components.map(function (component) {
					return componentProps[component].group === id;
				}) && selectedValues[id].showFilter;
			}).map(function (component, index) {
				var _selectedValues$compo = selectedValues[component],
				    label = _selectedValues$compo.label,
				    value = _selectedValues$compo.value,
				    category = _selectedValues$compo.category;

				var isArray = Array.isArray(value);

				if (label && (isArray && value.length || !isArray && value)) {
					var valueToRender = category ? _this.renderValue(value + ' in ' + category + ' category', isArray) : _this.renderValue(value, isArray);
					return (0, _core.jsx)(
						_Button2.default,
						{
							className: (0, _helper.getClassName)(_this.props.innerClass, 'button') || null,
							key: component + '-' + (index + 1),
							tabIndex: '0',
							onKeyPress: function onKeyPress(event) {
								return (0, _helper.handleA11yAction)(event, function () {
									return _this.remove(component, value);
								});
							},
							onClick: function onClick() {
								return _this.remove(component, value);
							}
						},
						(0, _core.jsx)(
							'span',
							null,
							selectedValues[component].label,
							': ',
							valueToRender
						),
						(0, _core.jsx)(
							'span',
							null,
							'\u2715'
						)
					);
				}
				return null;
			}).filter(Boolean);
		};

		_this.hasFilters = function () {
			var _this$props3 = _this.props,
			    componentProps = _this$props3.componentProps,
			    selectedValues = _this$props3.selectedValues,
			    components = _this$props3.components;

			return Object.keys(selectedValues).filter(function (id) {
				return components.includes(id);
			}).some(function (component) {
				var value = selectedValues[component].value;

				var isResultComponent = componentProps[component] && componentProps[component].componentType === _constants.componentTypes.reactiveList;
				var isArray = Array.isArray(value);
				return (isArray && value.length || !isArray && value) && !isResultComponent;
			});
		};

		_this.extracted(props);
		return _this;
	}

	SelectedFilters.prototype.extracted = function extracted(props) {
		if (props.showClearAll === true) {
			this._showClearAll = _constants.CLEAR_ALL.ALWAYS;
		} else {
			this._showClearAll = props.showClearAll === false ? _constants.CLEAR_ALL.NEVER : props.showClearAll;
		}
	};

	// determines whether any filter has been applied regardless of `showFilter=false`


	SelectedFilters.prototype.render = function render() {
		var _this2 = this;

		if (this.props.render) {
			return this.props.render(this.props);
		}

		var theme = this.props.theme;

		var filtersToRender = this.renderFilters();
		var hasFilters = void 0;
		if (this._showClearAll === _constants.CLEAR_ALL.ALWAYS) {
			hasFilters = this.hasFilters();
		} else {
			hasFilters = this._showClearAll === _constants.CLEAR_ALL.DEFAULT ? !!filtersToRender.length : false;
		}

		return (0, _core.jsx)(
			_Container2.default,
			{
				style: this.props.style,
				css: (0, _Button.filters)(theme),
				className: '' + (this.props.className || '')
			},
			this.props.title && hasFilters && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			filtersToRender,
			this.props.showClearAll && hasFilters ? (0, _core.jsx)(
				_Button2.default,
				{
					className: (0, _helper.getClassName)(this.props.innerClass, 'button') || null,
					onClick: this.clearValues,
					tabIndex: '0',
					onKeyPress: function onKeyPress(event) {
						return (0, _helper.handleA11yAction)(event, _this2.clearValues);
					}
				},
				this.props.clearAllLabel
			) : null
		);
	};

	return SelectedFilters;
}(_react.Component);

SelectedFilters.propTypes = {
	clearValues: _types2.default.func,
	setValue: _types2.default.func,
	components: _types2.default.components,
	componentProps: _types2.default.props,
	selectedValues: _types2.default.selectedValues,
	className: _types2.default.string,
	clearAllLabel: _types2.default.title,
	innerClass: _types2.default.style,
	showClearAll: _types2.default.showClearAll,
	style: _types2.default.style,
	theme: _types2.default.style,
	onClear: _types2.default.func,
	render: _types2.default.func,
	title: _types2.default.title,
	onChange: _types2.default.func,
	resetToDefault: _types2.default.bool,
	resetValuesToDefault: _types2.default.func
};

SelectedFilters.defaultProps = {
	className: null,
	clearAllLabel: 'Clear All',
	showClearAll: true,
	style: {},
	componentProps: {},
	resetToDefault: false
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		components: state.components,
		selectedValues: state.selectedValues,
		componentProps: state.props
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		clearValues: function clearValues() {
			return dispatch((0, _actions.clearValues)());
		},
		setValue: function setValue(component, value) {
			return dispatch((0, _actions.setValue)(component, value));
		},
		resetValuesToDefault: function resetValuesToDefault() {
			return dispatch((0, _actions.resetValuesToDefault)());
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(function (props) {
	return (0, _core.jsx)(SelectedFilters, _extends({ ref: props.myForwardedRef }, props));
}));

// eslint-disable-next-line
exports.default = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});