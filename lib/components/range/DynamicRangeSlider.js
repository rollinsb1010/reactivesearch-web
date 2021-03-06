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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var formatRange = function formatRange() {
	var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return {
		start: Math.floor(range.start),
		end: Math.ceil(range.end)
	};
};

var DynamicRangeSlider = function (_Component) {
	_inherits(DynamicRangeSlider, _Component);

	function DynamicRangeSlider(props) {
		_classCallCheck(this, DynamicRangeSlider);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			currentValue: null,
			range: null,
			stats: []
		};

		// Caution: Don't change the ids unnecessarily.
		// If it's required then you need to update it in reactivecore(transform.js) too.
		_this.internalHistogramComponent = _this.props.componentId + '__histogram__internal';
		_this.internalRangeComponent = _this.props.componentId + '__range__internal';
		_this.internalMatchAllComponent = _this.props.componentId + '__match_all__internal';

		props.addComponent(props.componentId);
		props.addComponent(_this.internalHistogramComponent);
		props.addComponent(_this.internalRangeComponent);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		// Update props in store
		props.setComponentProps(props.componentId, props, _constants.componentTypes.dynamicRangeSlider);
		props.setComponentProps(_this.internalHistogramComponent, props, _constants.componentTypes.dynamicRangeSlider);
		props.setComponentProps(_this.internalRangeComponent, props, _constants.componentTypes.dynamicRangeSlider);
		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, _this.state.currentValue);
		// get range before executing other queries
		_this.updateRangeQueryOptions(props);
		return _this;
	}

	DynamicRangeSlider.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
		// Update the current value based on range to avoid the unnecessary API calls
		if (!state.currentValue && props.range) {
			var range = formatRange(props.range);
			if (props.selectedValue) {
				// selected value must be in limit
				if (props.selectedValue[0] >= range.start && props.selectedValue[1] <= range.end) {
					return {
						currentValue: null
					};
				}
				return {
					currentValue: [range.start, range.end]
				};
			} else if (!(0, _helper.isEqual)(state.currentValue, [range.start, range.end])) {
				// Just set the value for visibility don't apply as query or filter
				return {
					currentValue: [range.start, range.end]
				};
			}
		}
		return null;
	};

	DynamicRangeSlider.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, (0, _utils.getValidPropsKeys)(this.props), function () {
			_this2.props.updateComponentProps(_this2.props.componentId, _this2.props, _constants.componentTypes.dynamicRangeSlider);
			_this2.props.updateComponentProps(_this2.internalHistogramComponent, _this2.props, _constants.componentTypes.dynamicRangeSlider);
			_this2.props.updateComponentProps(_this2.internalRangeComponent, _this2.props, _constants.componentTypes.dynamicRangeSlider);
		});
		if (!(0, _helper.isEqual)(this.props.range, prevProps.range) && this.props.range && this.props.range.start >= 0 && this.props.range.end > 0) {
			// when range prop is changed
			// it will happen due to initial mount (or) due to subscription
			this.updateQueryOptions(this.props, this.props.range);
			// floor and ceil to take edge cases into account
			this.updateRange(formatRange(this.props.range));

			// only listen to selectedValue initially, after the
			// component has mounted and range is received
			if (this.props.selectedValue) {
				this.handleChange(this.props.selectedValue);
			} else {
				this.handleChange();
			}
		} else if (this.props.range && !(0, _helper.isEqual)(this.props.value && this.props.value(this.props.range.start, this.props.range.end), prevProps.value && prevProps.value(this.props.range.start, this.props.range.end))) {
			// when value prop is changed
			var _props$value = this.props.value(this.props.range.start, this.props.range.end),
			    start = _props$value.start,
			    end = _props$value.end;

			this.handleChange([start, end]);
		} else if (this.props.range && this.props.selectedValue === null && prevProps.selectedValue) {
			// when the filter is reset
			this.handleChange();
		}

		(0, _helper.checkPropChange)(this.props.react, prevProps.react, function () {
			_this2.updateRangeQueryOptions(_this2.props);
			_this2.setReact(_this2.props);
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateRangeQueryOptions(_this2.props);
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['showHistogram', 'interval'], function () {
			return _this2.updateQueryOptions(_this2.props, _this2.props.range || _this2.state.range);
		});

		(0, _helper.checkPropChange)(this.props.options, prevProps.options, function () {
			var options = _this2.props.options;

			options.sort(function (a, b) {
				if (a.key < b.key) return -1;
				if (a.key > b.key) return 1;
				return 0;
			});
			_this2.setState({
				stats: options
			});
		});
	};

	DynamicRangeSlider.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
		this.setReact(this.props);
	};

	DynamicRangeSlider.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
		if (nextState.range) {
			var upperLimit = Math.floor((nextState.range.end - nextState.range.start) / 2);
			if (nextProps.stepValue < 1 || nextProps.stepValue > upperLimit) {
				console.warn('stepValue for DynamicRangeSlider ' + nextProps.componentId + ' should be greater than 0 and less than or equal to ' + upperLimit);
				return false;
			}
			return true;
		}
		return true;
	};

	DynamicRangeSlider.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalHistogramComponent);
		this.props.removeComponent(this.internalRangeComponent);
		this.props.removeComponent(this.internalMatchAllComponent);
	};

	// value parser for SSR


	DynamicRangeSlider.prototype.renderHistogram = function renderHistogram() {
		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
		}
		if (this.state.stats.length && this.props.showHistogram) {
			return (0, _core.jsx)(_HistogramContainer2.default, {
				stats: this.state.stats,
				range: this.state.range,
				interval: this.getValidInterval(this.props, this.state.range)
			});
		}
		return null;
	};

	DynamicRangeSlider.prototype.render = function render() {
		var _this3 = this;

		if (!this.state.currentValue || !this.state.range || this.props.range.start === null) {
			return null;
		}

		var _getRangeLabels = this.getRangeLabels(),
		    startLabel = _getRangeLabels.startLabel,
		    endLabel = _getRangeLabels.endLabel;

		return (0, _core.jsx)(
			_Slider4.default,
			{ primary: true, style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.renderHistogram(),
			(0, _core.jsx)(_Slider2.default, {
				min: this.state.range.start,
				max: this.state.range.end,
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
			(0, _core.jsx)(
				'div',
				{ css: _Label.rangeLabelsContainer },
				(0, _core.jsx)(
					_RangeLabel2.default,
					{
						align: 'left',
						className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null
					},
					startLabel
				),
				(0, _core.jsx)(
					_RangeLabel2.default,
					{
						align: 'right',
						className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null
					},
					endLabel
				)
			)
		);
	};

	return DynamicRangeSlider;
}(_react.Component);

DynamicRangeSlider.parseValue = function (value) {
	if (Array.isArray(value)) return value;
	return value ? [value().start, value().end] : null;
};

DynamicRangeSlider.defaultQuery = function (value, props) {
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

	this.setReact = function (props) {
		var react = props.react;

		if (react) {
			props.watchComponent(_this4.internalRangeComponent, props.react);
			var newReact = (0, _helper.pushToAndClause)(react, _this4.internalHistogramComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			// internalRangeComponent watches internalMatchAll component allowing execution of query
			// in case of no react prop
			_this4.props.addComponent(_this4.internalMatchAllComponent);
			props.setQueryOptions(_this4.internalMatchAllComponent, { aggs: { match_all: {} } }, false);
			props.watchComponent(_this4.internalRangeComponent, {
				and: _this4.internalMatchAllComponent
			});
			props.watchComponent(props.componentId, {
				and: _this4.internalHistogramComponent
			});
		}
	};

	this.getSnapPoints = function () {
		var snapPoints = [];
		var stepValue = _this4.props.stepValue;
		var range = _this4.state.range;

		// limit the number of steps to prevent generating a large number of snapPoints

		if ((range.end - range.start) / stepValue > 100) {
			stepValue = (range.end - range.start) / 100;
		}

		for (var i = range.start; i <= range.end; i += stepValue) {
			snapPoints = snapPoints.concat(i);
		}
		if (snapPoints[snapPoints.length - 1] !== range.end) {
			snapPoints = snapPoints.concat(range.end);
		}
		return snapPoints;
	};

	this.getValidInterval = function (props, range) {
		var min = Math.ceil((range.end - range.start) / 100) || 1;
		if (!props.interval) {
			return min;
		} else if (props.interval < min) {
			console.error(props.componentId + ': interval prop\'s value should be greater than or equal to ' + min);
			return min;
		}
		return props.interval;
	};

	this.histogramQuery = function (props, range) {
		var _query;

		var query = (_query = {}, _query[props.dataField] = {
			histogram: {
				field: props.dataField,
				interval: _this4.getValidInterval(props, range),
				offset: range.start
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

	this.rangeQuery = function (props) {
		return {
			min: { min: { field: props.dataField } },
			max: { max: { field: props.dataField } }
		};
	};

	this.handleChange = function (currentValue) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;

		var normalizedValue = null;
		if (currentValue) {
			// always keep the values within range
			normalizedValue = [currentValue[0] < props.range.start ? props.range.start : currentValue[0], currentValue[1] > props.range.end ? props.range.end : currentValue[1]];
			if (props.range.start === null) {
				normalizedValue = [currentValue[0], currentValue[1]];
			}
		}
		var normalizedValues = normalizedValue ? [normalizedValue[0], normalizedValue[1]] : null;
		var performUpdate = function performUpdate() {
			_this4.setState({
				currentValue: normalizedValue
			}, function () {
				// Only update the queries for dependent components when range is changed by input
				_this4.updateQuery(normalizedValues, props);
				if (props.onValueChange) props.onValueChange(normalizedValues);
			});
		};
		(0, _helper.checkValueChange)(props.componentId, normalizedValues, props.beforeValueChange, performUpdate);
	};

	this.handleSlider = function (_ref2) {
		var values = _ref2.values;

		if (!(0, _helper.isEqual)(values, _this4.state.currentValue)) {
			var _props2 = _this4.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (value === undefined) {
				_this4.handleChange(values);
			} else if (onChange) {
				onChange(values);
			} else {
				_this4.handleChange(values);
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

		var query = DynamicRangeSlider.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref3 = customQuery(value, props) || {};

			query = _ref3.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}
		var showFilter = props.showFilter;

		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query: query,
			value: value,
			label: props.filterLabel,
			showFilter: showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.dynamicRangeSlider
		});
	};

	this.updateQueryOptions = function (props, range) {
		if (props.showHistogram) {
			var queryOptions = {
				aggs: _this4.histogramQuery(props, range)
			};
			var customQuery = props.customQuery;


			var query = props.customQuery || DynamicRangeSlider.defaultQuery;
			var value = [range.start, range.end];
			var customQueryOptions = customQuery ? (0, _helper.getOptionsFromQuery)(customQuery(value, props)) : null;
			props.setQueryOptions(_this4.internalHistogramComponent, _extends({}, queryOptions, customQueryOptions), false);
			props.updateQuery({
				componentId: _this4.internalHistogramComponent,
				query: query(value, props),
				value: value
			});
		}
	};

	this.updateRange = function (range) {
		_this4.setState({
			range: range
		});
	};

	this.updateRangeQueryOptions = function (props) {
		var queryOptions = {};
		var nestedField = props.nestedField;

		if (nestedField) {
			var _aggs;

			queryOptions = {
				aggs: (_aggs = {}, _aggs[nestedField] = {
					nested: {
						path: nestedField
					},
					aggs: _this4.rangeQuery(props)
				}, _aggs)
			};
		} else {
			queryOptions = {
				aggs: _this4.rangeQuery(props)
			};
		}

		props.setQueryOptions(_this4.internalRangeComponent, queryOptions);
	};

	this.getRangeLabels = function () {
		var _state$range = _this4.state.range,
		    startLabel = _state$range.start,
		    endLabel = _state$range.end;


		if (_this4.props.rangeLabels) {
			var rangeLabels = _this4.props.rangeLabels(_this4.props.range.start, _this4.props.range.end);
			startLabel = rangeLabels.start;
			endLabel = rangeLabels.end;
		}

		return {
			startLabel: startLabel,
			endLabel: endLabel
		};
	};
};

DynamicRangeSlider.propTypes = {
	addComponent: _types2.default.funcRequired,
	removeComponent: _types2.default.funcRequired,
	setQueryListener: _types2.default.funcRequired,
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	watchComponent: _types2.default.funcRequired,
	options: _types2.default.options,
	range: _types2.default.range,
	selectedValue: _types2.default.selectedValue,
	setComponentProps: _types2.default.funcRequired,
	updateComponentProps: _types2.default.funcRequired,
	isLoading: _types2.default.bool,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.func,
	value: _types2.default.func,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	interval: _types2.default.number,
	loader: _types2.default.title,
	nestedField: _types2.default.string,
	onDrag: _types2.default.func,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	rangeLabels: _types2.default.func,
	react: _types2.default.react,
	showHistogram: _types2.default.bool,
	showFilter: _types2.default.bool,
	tooltipTrigger: _types2.default.tooltipTrigger,
	renderTooltipData: _types2.default.func,
	snap: _types2.default.bool,
	stepValue: _types2.default.number,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	includeNullValues: _types2.default.bool,
	index: _types2.default.string
};

DynamicRangeSlider.defaultProps = {
	className: null,
	showHistogram: true,
	tooltipTrigger: 'none',
	snap: true,
	stepValue: 1,
	style: {},
	URLParams: false,
	showFilter: true,
	includeNullValues: false
};

// Add componentType for SSR
DynamicRangeSlider.componentType = _constants.componentTypes.dynamicRangeSlider;

var mapStateToProps = function mapStateToProps(state, props) {
	var aggregation = state.aggregations[props.componentId];
	if (props.nestedField) {
		aggregation = state.aggregations[props.componentId] && state.aggregations[props.componentId].inner;
	}
	var options = aggregation && aggregation[props.dataField];
	var range = state.aggregations[props.componentId + '__range__internal'];
	if (props.nestedField) {
		options = options && aggregation[props.dataField] && aggregation[props.dataField].buckets ? aggregation[props.dataField].buckets : [];
		range = range && state.aggregations[props.componentId + '__range__internal'][props.nestedField].min ? {
			start: state.aggregations[props.componentId + '__range__internal'][props.nestedField].min.value,
			end: state.aggregations[props.componentId + '__range__internal'][props.nestedField].max.value // prettier-ignore
		} : null;
	} else {
		options = options && aggregation[props.dataField].buckets ? aggregation[props.dataField].buckets : [];
		range = range && state.aggregations[props.componentId + '__range__internal'].min ? {
			start: state.aggregations[props.componentId + '__range__internal'].min.value,
			end: state.aggregations[props.componentId + '__range__internal'].max.value // prettier-ignore
		} : null;
	}
	if (range) {
		range = formatRange(range);
	}
	return {
		options: options,
		isLoading: state.isLoading[props.componentId],
		range: range,
		selectedValue: state.selectedValues[props.componentId] ? state.selectedValues[props.componentId].value : null,
		enableAppbase: state.config.enableAppbase
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setComponentProps: function setComponentProps(component, options, componentType) {
			return dispatch((0, _actions.setComponentProps)(component, options, componentType));
		},
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		updateComponentProps: function updateComponentProps(component, options, componentType) {
			return dispatch((0, _actions.updateComponentProps)(component, options, componentType));
		},
		addComponent: function addComponent(component) {
			return dispatch((0, _actions.addComponent)(component));
		},
		removeComponent: function removeComponent(component) {
			return dispatch((0, _actions.removeComponent)(component));
		},
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
		},
		setQueryListener: function setQueryListener(component, onQueryChange, beforeQueryChange) {
			return dispatch((0, _actions.setQueryListener)(component, onQueryChange, beforeQueryChange));
		},
		updateQuery: function updateQuery(updateQueryObject, execute) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject, execute));
		},
		watchComponent: function watchComponent(component, react) {
			return dispatch((0, _actions.watchComponent)(component, react));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return (0, _core.jsx)(DynamicRangeSlider, _extends({ ref: props.myForwardedRef }, props));
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, DynamicRangeSlider);

ForwardRefComponent.displayName = 'DynamicRangeSlider';
exports.default = ForwardRefComponent;