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

var _Slider = require('rheostat/lib/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _HistogramContainer = require('./addons/HistogramContainer');

var _HistogramContainer2 = _interopRequireDefault(_HistogramContainer);

var _RangeLabel = require('./addons/RangeLabel');

var _RangeLabel2 = _interopRequireDefault(_RangeLabel);

var _SliderHandle = require('./addons/SliderHandle');

var _SliderHandle2 = _interopRequireDefault(_SliderHandle);

var _Slider3 = require('../../styles/Slider');

var _Slider4 = _interopRequireDefault(_Slider3);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Label = require('../../styles/Label');

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var RangeSlider = function (_Component) {
	_inherits(RangeSlider, _Component);

	function RangeSlider(props) {
		_classCallCheck(this, RangeSlider);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var selectedValue = props.selectedValue,
		    defaultValue = props.defaultValue,
		    value = props.value;

		var valueToParse = selectedValue || value || defaultValue;
		var currentValue = RangeSlider.parseValue(valueToParse, props);
		if (!_this.shouldUpdate(currentValue)) {
			currentValue = [props.range.start, props.range.end];
		}
		_this.state = {
			currentValue: currentValue,
			stats: []
		};

		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);
		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);

		_this.updateQueryOptions(props);
		var hasMounted = false;

		if (currentValue) {
			_this.handleChange(currentValue, props, hasMounted);
		}
		return _this;
	}

	RangeSlider.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	RangeSlider.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['showHistogram', 'interval'], function () {
			return _this2.updateQueryOptions(_this2.props);
		});
		(0, _helper.checkPropChange)(this.props.options, prevProps.options, function () {
			var options = _this2.props.options;

			if (Array.isArray(options)) {
				options.sort(function (a, b) {
					if (a.key < b.key) return -1;
					if (a.key > b.key) return 1;
					return 0;
				});
			}
			_this2.setState({
				stats: options || []
			});
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQueryOptions(_this2.props);
			_this2.handleChange(_this2.state.currentValue, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			var value = RangeSlider.parseValue(this.props.value, this.props);
			this.handleChange(value, this.props);
		} else if (!(0, _helper.isEqual)(this.state.currentValue, this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props2 = this.props,
			    _value = _props2.value,
			    onChange = _props2.onChange;


			if (_value === undefined) {
				var selectedValue = RangeSlider.parseValue(this.props.selectedValue, this.props);
				this.handleChange(selectedValue, this.props);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				this.handleChange(this.state.currentValue);
			}
		}
	};

	RangeSlider.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
		var upperLimit = Math.floor((nextProps.range.end - nextProps.range.start) / 2);
		if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
			console.warn('stepValue for RangeSlider ' + nextProps.componentId + ' should be greater than 0 and less than or equal to ' + upperLimit);
			return false;
		}
		return true;
	};

	RangeSlider.prototype.render = function render() {
		var _this3 = this;

		return (0, _core.jsx)(
			_Slider4.default,
			{ primary: true, style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.state.stats.length && this.props.showHistogram && this.props.showSlider ? (0, _core.jsx)(_HistogramContainer2.default, {
				stats: this.state.stats,
				range: this.props.range,
				interval: this.getValidInterval(this.props)
			}) : null,
			this.props.showSlider && (0, _core.jsx)(_Slider2.default, {
				min: this.props.range.start,
				max: this.props.range.end,
				values: this.state.currentValue,
				onChange: this.handleSlider,
				onValuesUpdated: this.handleDrag,
				snap: this.props.snap,
				snapPoints: this.props.snap ? this.getSnapPoints() : null,
				className: (0, _helper.getClassName)(this.props.innerClass, 'slider'),
				handle: function handle(_ref) {
					var className = _ref.className,
					    style = _ref.style,
					    passProps = _objectWithoutProperties(_ref, ['className', 'style']);

					return (0, _core.jsx)(_SliderHandle2.default, _extends({
						style: style,
						className: className
					}, passProps, {
						renderTooltipData: _this3.props.renderTooltipData,
						tooltipTrigger: _this3.props.tooltipTrigger
					}));
				}
			}),
			this.props.rangeLabels && this.props.showSlider && (0, _core.jsx)(
				'div',
				{ css: _Label.rangeLabelsContainer },
				(0, _core.jsx)(
					_RangeLabel2.default,
					{
						align: 'left',
						className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null
					},
					this.props.rangeLabels.start
				),
				(0, _core.jsx)(
					_RangeLabel2.default,
					{
						align: 'right',
						className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null
					},
					this.props.rangeLabels.end
				)
			)
		);
	};

	return RangeSlider;
}(_react.Component);

RangeSlider.parseValue = function (value, props) {
	if (Array.isArray(value)) return value;
	return value ? [value.start, value.end] : [props.range.start, props.range.end];
};

RangeSlider.defaultQuery = function (value, props) {
	var query = null;
	if (Array.isArray(value) && value.length) {
		query = (0, _utils.getRangeQueryWithNullValues)(value, props);
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

	this.getSnapPoints = function () {
		var snapPoints = [];
		var stepValue = _this4.props.stepValue;

		// limit the number of steps to prevent generating a large number of snapPoints

		if ((_this4.props.range.end - _this4.props.range.start) / stepValue > 100) {
			stepValue = (_this4.props.range.end - _this4.props.range.start) / 100;
		}

		for (var i = _this4.props.range.start; i <= _this4.props.range.end; i += stepValue) {
			snapPoints = snapPoints.concat(i);
		}
		if (snapPoints[snapPoints.length - 1] !== _this4.props.range.end) {
			snapPoints = snapPoints.concat(_this4.props.range.end);
		}
		return snapPoints;
	};

	this.getValidInterval = function (props) {
		var min = Math.ceil((props.range.end - props.range.start) / 100) || 1;
		if (!props.interval) {
			return min;
		} else if (props.interval < min) {
			console.error(props.componentId + ': interval prop\'s value should be greater than or equal to ' + min);
			return min;
		}
		return props.interval;
	};

	this.histogramQuery = function (props) {
		var _query;

		var query = (_query = {}, _query[props.dataField] = {
			histogram: {
				field: props.dataField,
				interval: _this4.getValidInterval(props),
				offset: props.range.start
			}
		}, _query);
		if (props.nestedField) {
			return {
				inner: {
					aggs: query,
					nested: {
						path: props.nestedField
					}
				}
			};
		}
		return query;
	};

	this.handleChange = function (currentValue) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;
		var hasMounted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				var start = currentValue[0],
				    end = currentValue[1];

				_this4.updateQuery([start, end], props);
				if (props.onValueChange) {
					props.onValueChange({
						start: start,
						end: end
					});
				}
			};

			var start = currentValue[0],
			    end = currentValue[1];
			var range = props.range;

			if (hasMounted && start <= end && start >= range.start && end <= range.end) {
				_this4.setState({
					currentValue: currentValue
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};
		(0, _helper.checkValueChange)(props.componentId, {
			start: currentValue[0],
			end: currentValue[1]
		}, props.beforeValueChange, performUpdate);
	};

	this.handleSlider = function (_ref2) {
		var values = _ref2.values;

		if (_this4.shouldUpdate(values)) {
			if (!(0, _helper.isEqual)(values, _this4.state.currentValue)) {
				var _props3 = _this4.props,
				    value = _props3.value,
				    onChange = _props3.onChange;


				if (value === undefined) {
					_this4.handleChange(values);
				} else if (onChange) {
					// force re-rendering to avail the currentValue
					// in rheostat component since it doesn't respect
					// the controlled behavior properly
					_this4.forceUpdate();
					onChange(values);
				} else {
					// since value prop is set & onChange is not defined
					// we need to reset the slider position
					// to the original 'value' prop
					_this4.setState({
						currentValue: _this4.state.currentValue
					});
				}
			}
		}
	};

	this.handleDrag = function (values) {
		if (_this4.props.onDrag) {
			var min = values.min,
			    max = values.max,
			    currentValue = values.values;

			_this4.props.onDrag(currentValue, [min, max]);
		}
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var query = RangeSlider.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref3 = customQuery(value, props) || {};

			query = _ref3.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}
		var showFilter = props.showFilter,
		    _props$range = props.range,
		    start = _props$range.start,
		    end = _props$range.end;
		var currentStart = value[0],
		    currentEnd = value[1];
		// check if the slider is at its initial position

		var isInitialValue = currentStart === start && currentEnd === end;
		props.setQueryOptions(props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query: query,
			value: value,
			label: props.filterLabel,
			showFilter: showFilter && !isInitialValue,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.rangeSlider
		});
	};

	this.updateQueryOptions = function (props) {
		if (props.showHistogram) {
			var customQuery = props.customQuery;

			var queryOptions = {
				size: 0,
				aggs: (props.histogramQuery || _this4.histogramQuery)(props)
			};
			var value = [props.range.start, props.range.end];
			var query = customQuery || RangeSlider.defaultQuery;

			var customQueryOptions = customQuery ? (0, _helper.getOptionsFromQuery)(customQuery(value, props)) : null;
			props.setQueryOptions(_this4.internalComponent, _extends({}, queryOptions, customQueryOptions), false);
			props.updateQuery({
				componentId: _this4.internalComponent,
				query: query(value, props),
				value: value
			});
		}
	};

	this.shouldUpdate = function (value) {
		var validateRange = _this4.props.validateRange;

		if (validateRange) {
			return validateRange(value);
		}
		return true;
	};
};

RangeSlider.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	options: _types2.default.options,
	selectedValue: _types2.default.selectedValue,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.range,
	value: _types2.default.range,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	interval: _types2.default.number,
	nestedField: _types2.default.string,
	onDrag: _types2.default.func,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	range: _types2.default.range,
	rangeLabels: _types2.default.rangeLabels,
	react: _types2.default.react,
	showHistogram: _types2.default.bool,
	histogramQuery: _types2.default.func,
	showFilter: _types2.default.bool,
	showSlider: _types2.default.bool,
	tooltipTrigger: _types2.default.tooltipTrigger,
	renderTooltipData: _types2.default.func,
	snap: _types2.default.bool,
	stepValue: _types2.default.number,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	includeNullValues: _types2.default.bool,
	validateRange: _types2.default.func,
	index: _types2.default.string
};

RangeSlider.defaultProps = {
	className: null,
	range: {
		start: 0,
		end: 10
	},
	showHistogram: true,
	showSlider: true,
	tooltipTrigger: 'none',
	snap: true,
	stepValue: 1,
	showFilter: true,
	style: {},
	URLParams: false,
	includeNullValues: false
};

// Add componentType for SSR
RangeSlider.componentType = _constants.componentTypes.rangeSlider;

var mapStateToProps = function mapStateToProps(state, props) {
	var aggregation = props.nestedField && state.aggregations[props.componentId] ? state.aggregations[props.componentId].inner : state.aggregations[props.componentId];

	return {
		options: aggregation ? aggregation[props.dataField] && aggregation[props.dataField].buckets : [],
		selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : null,
		enableAppbase: state.config.enableAppbase
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
		},
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.rangeSlider }),
		function () {
			return (0, _core.jsx)(RangeSlider, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, RangeSlider);

ForwardRefComponent.displayName = 'RangeSlider';
exports.default = ForwardRefComponent;