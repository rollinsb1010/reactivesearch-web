'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _RangeSlider = require('./RangeSlider');

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

var _Input = require('../../styles/Input');

var _Input2 = _interopRequireDefault(_Input);

var _Flex = require('../../styles/Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _Content = require('../../styles/Content');

var _Content2 = _interopRequireDefault(_Content);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RangeInput = function (_Component) {
	_inherits(RangeInput, _Component);

	function RangeInput(props) {
		_classCallCheck(this, RangeInput);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var value = props.value || props.defaultValue || props.range;
		if (props.selectedValue) {
			value = {
				start: props.selectedValue[0],
				end: props.selectedValue[1]
			};
		}
		if (!_this.shouldUpdate(value)) {
			// assign the range if not valid
			value = props.range;
		}
		_this.state = {
			start: value.start,
			end: value.end,
			isStartValid: true,
			isEndValid: true
		};
		return _this;
	}

	RangeInput.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	RangeInput.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.handleSlider(this.props.value);
		}
	};

	// for SSR


	RangeInput.prototype.render = function render() {
		var _props2 = this.props,
		    className = _props2.className,
		    style = _props2.style,
		    themePreset = _props2.themePreset,
		    rest = _objectWithoutProperties(_props2, ['className', 'style', 'themePreset']);

		return _react2.default.createElement(
			_Container2.default,
			{ style: style, className: className },
			_react2.default.createElement(_RangeSlider2.default, _extends({}, rest, {
				value: {
					start: this.state.isStartValid ? +this.value.start : this.props.range.start,
					end: this.state.isEndValid ? +this.value.end : this.props.range.end
				},
				onChange: this.handleSliderChange,
				className: (0, _helper.getClassName)(this.props.innerClass, 'slider-container') || null
			})),
			_react2.default.createElement(
				_Flex2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'input-container') || null },
				_react2.default.createElement(
					_Flex2.default,
					{ direction: 'column', flex: 2 },
					_react2.default.createElement(_Input2.default, {
						name: 'start',
						type: 'number',
						onChange: this.handleInputChange,
						value: this.value.start,
						step: this.props.stepValue,
						alert: !this.state.isStartValid,
						className: (0, _helper.getClassName)(this.props.innerClass, 'input') || null,
						themePreset: themePreset,
						max: this.value.end,
						'aria-label': this.props.componentId + '-start-input'
					}),
					!this.state.isStartValid && _react2.default.createElement(
						_Content2.default,
						{ alert: true },
						'Input range is invalid'
					)
				),
				_react2.default.createElement(
					_Flex2.default,
					{ justifyContent: 'center', alignItems: 'center', flex: 1 },
					'-'
				),
				_react2.default.createElement(
					_Flex2.default,
					{ direction: 'column', flex: 2 },
					_react2.default.createElement(_Input2.default, {
						name: 'end',
						type: 'number',
						onChange: this.handleInputChange,
						value: this.value.end,
						step: this.props.stepValue,
						min: this.value.start,
						alert: !this.state.isEndValid,
						className: (0, _helper.getClassName)(this.props.innerClass, 'input') || null,
						themePreset: themePreset,
						'aria-label': this.props.componentId + '-end-input'
					}),
					!this.state.isEndValid && _react2.default.createElement(
						_Content2.default,
						{ alert: true },
						'Input range is invalid'
					)
				)
			)
		);
	};

	_createClass(RangeInput, [{
		key: 'isControlled',
		get: function get() {
			return !!(this.props.value && this.props.onChange);
		}
	}, {
		key: 'value',
		get: function get() {
			return {
				start: this.isControlled ? this.props.value.start : this.state.start,
				end: this.isControlled ? this.props.value.end : this.state.end
			};
		}
	}]);

	return RangeInput;
}(_react.Component);

RangeInput.defaultQuery = _RangeSlider2.default.defaultQuery;
RangeInput.parseValue = _RangeSlider2.default.parseValue;

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.handleInputChange = function (e) {
		var _extends2;

		var _e$target = e.target,
		    name = _e$target.name,
		    value = _e$target.value;

		if (Number.isNaN(value)) {
			// set errors for invalid inputs
			if (name === 'start') {
				_this2.setState({
					isStartValid: false
				});
			} else {
				_this2.setState({
					isEndValid: false
				});
			}
		} else {
			// reset error states for valid inputs
			// eslint-disable-next-line
			if (name === 'start' && !_this2.state.isStartValid) {
				_this2.setState({
					isStartValid: true
				});
			} else if (name === 'end' && !_this2.state.isEndValid) {
				_this2.setState({
					isEndValid: true
				});
			}
		}

		var currentValue = _extends({}, _this2.value, (_extends2 = {}, _extends2[name] = value, _extends2));

		var _props3 = _this2.props,
		    valueProp = _props3.value,
		    onChange = _props3.onChange;

		if (_this2.shouldUpdate(currentValue)) {
			if (valueProp === undefined) {
				var _this2$setState;

				_this2.setState((_this2$setState = {}, _this2$setState[name] = value, _this2$setState));
			} else if (onChange) {
				onChange(currentValue);
			}
		}
	};

	this.shouldUpdate = function () {
		var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var validateRange = _this2.props.validateRange;

		if (validateRange) {
			return validateRange([value.start, value.end]);
		}
		return true;
	};

	this.handleSliderChange = function (sliderValue) {
		var _ref = sliderValue || [_this2.props.range.start, _this2.props.range.end],
		    start = _ref[0],
		    end = _ref[1];

		var _props4 = _this2.props,
		    value = _props4.value,
		    onChange = _props4.onChange;


		if (value === undefined) {
			_this2.handleSlider({ start: start, end: end });
		} else if (onChange) {
			onChange({ start: start, end: end });
		}
	};

	this.handleSlider = function (_ref2) {
		var start = _ref2.start,
		    end = _ref2.end;

		if (!_this2.isControlled) {
			_this2.setState({
				start: start,
				end: end
			});
		}
		if (_this2.props.onValueChange) {
			_this2.props.onValueChange({
				start: start,
				end: end
			});
		}
	};
};

RangeInput.propTypes = {
	className: _types2.default.string,
	defaultValue: _types2.default.range,
	validateRange: _types2.default.func,
	value: _types2.default.range,
	selectedValue: _types2.default.selectedValue,
	innerClass: _types2.default.style,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	range: _types2.default.range,
	stepValue: _types2.default.number,
	style: _types2.default.style,
	themePreset: _types2.default.themePreset,
	componentId: _types2.default.stringRequired,
	includeNullValues: _types2.default.bool,
	enableAppbase: _types2.default.bool,
	index: _types2.default.string
};

RangeInput.defaultProps = {
	range: {
		start: 0,
		end: 10
	},
	stepValue: 1,
	includeNullValues: false
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		themePreset: state.config.themePreset,
		selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : null,
		enableAppbase: state.config.enableAppbase
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, null)(function (props) {
	return _react2.default.createElement(RangeInput, _extends({ ref: props.myForwardedRef }, props));
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, RangeInput);

ForwardRefComponent.displayName = 'RangeInput';
exports.default = ForwardRefComponent;