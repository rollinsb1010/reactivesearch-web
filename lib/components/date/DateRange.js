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

var _xdate = require('xdate');

var _xdate2 = _interopRequireDefault(_xdate);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _DayPickerInput = require('react-day-picker/DayPickerInput');

var _DayPickerInput2 = _interopRequireDefault(_DayPickerInput);

var _emotionTheming = require('emotion-theming');

var _DateContainer = require('../../styles/DateContainer');

var _DateContainer2 = _interopRequireDefault(_DateContainer);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Flex = require('../../styles/Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _utils = require('../../utils');

var _CancelSvg = require('../shared/CancelSvg');

var _CancelSvg2 = _interopRequireDefault(_CancelSvg);

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateRange = function (_Component) {
	_inherits(DateRange, _Component);

	function DateRange(props) {
		_classCallCheck(this, DateRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var currentDate = props.defaultValue || props.value || null;
		if (props.selectedValue) {
			if (Array.isArray(props.selectedValue)) {
				currentDate = {
					start: new _xdate2.default(props.selectedValue[0])[0],
					end: new _xdate2.default(props.selectedValue[1])[0]
				};
			} else {
				var _props$selectedValue = props.selectedValue,
				    start = _props$selectedValue.start,
				    end = _props$selectedValue.end;

				currentDate = {
					start: new _xdate2.default(start)[0],
					end: new _xdate2.default(end)[0]
				};
			}
		}

		_this.state = {
			currentDate: currentDate,
			dateHovered: null,
			startKey: 'on-start',
			endKey: 'on-end'
		};
		var hasMounted = false;

		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, _this.state.currentDate);

		if (currentDate) {
			_this.handleDateChange(currentDate, false, props, hasMounted);
		}
		return _this;
	}

	DateRange.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	DateRange.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		if (!(0, _helper.isEqual)(JSON.stringify(this.props.value), JSON.stringify(prevProps.value))) {
			this.handleDateChange(this.props.value, false, this.props);
		} else {
			var currentDate = this.state.currentDate;
			var _props2 = this.props,
			    selectedValue = _props2.selectedValue,
			    value = _props2.value,
			    onChange = _props2.onChange;
			// comparing array format of selectedValue with object form of the state if not null

			var formattedSelectedValue = Array.isArray(selectedValue) && selectedValue.length ? [this.formatInputDate(selectedValue[0]), this.formatInputDate(selectedValue[1])] : [];
			if (!(0, _helper.isEqual)(currentDate ? [this.formatInputDate(currentDate.start), this.formatInputDate(currentDate.end)] // prettier-ignore
			: null, formattedSelectedValue) && !(0, _helper.isEqual)(prevProps.selectedValue, selectedValue)) {
				var modDate = selectedValue ? {
					start: this.props.selectedValue[0] || '',
					end: this.props.selectedValue[1] || '' // prettier-ignore
				} : { start: '', end: '' };
				if ((value === undefined || value && value.start === '' && value.end === '') && !onChange) {
					this.handleDateChange(modDate, true, this.props);
				} else if (onChange) {
					onChange(modDate);
				}
			}
		}

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			return _this2.updateQuery(_this2.state.currentDate ? {
				// we need the date in correct queryFormat
				start: (0, _helper.formatDate)(_this2.state.currentDate.start, _this2.props),
				end: (0, _helper.formatDate)(_this2.state.currentDate.end, _this2.props) // prettier-ignore
			} : _this2.state.currentDate, _this2.props);
		});
	};

	DateRange.prototype.render = function render() {
		var _state = this.state,
		    currentDate = _state.currentDate,
		    dateHovered = _state.dateHovered;

		var start = currentDate ? currentDate.start : '';
		var end = currentDate ? currentDate.end : '';
		var endDay = currentDate ? dateHovered : '';
		var selectedDays = [start, { from: start, to: endDay }];
		var modifiers = { start: start, end: endDay };
		return _react2.default.createElement(
			_DateContainer2.default,
			{
				range: true,
				style: this.props.style,
				className: this.props.className,
				showBorder: !this.props.showClear
			},
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			_react2.default.createElement(
				_Flex2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'input-container') || null },
				_react2.default.createElement(
					_Flex2.default,
					{
						flex: 2,
						showBorder: this.props.showClear,
						iconPosition: 'right',
						style: {
							background: this.props.theme.colors.backgroundColor || 'transparent'
						}
					},
					_react2.default.createElement(_DayPickerInput2.default, _extends({
						ref: this.getStartDateRef,
						showOverlay: this.props.focused,
						formatDate: this.formatInputDate,
						value: start,
						key: this.state.startKey,
						placeholder: this.props.placeholder.start,
						dayPickerProps: {
							numberOfMonths: this.props.numberOfMonths,
							initialMonth: this.props.initialMonth,
							disabledDays: {
								after: this.state.currentDate ? this.state.currentDate.end : ''
							},
							selectedDays: selectedDays,
							modifiers: modifiers
						},
						inputProps: {
							'aria-label': this.props.componentId + '-start-input'
						},
						onDayChange: this.handleStartDate,
						classNames: {
							container: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-container') || 'DayPickerInput',
							overlayWrapper: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-overlay-wrapper') || 'DayPickerInput-OverlayWrapper',
							overlay: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-overlay') || 'DayPickerInput-Overlay'
						}
					}, this.props.dayPickerInputProps)),
					this.props.showClear && this.state.currentDate && this.state.currentDate.start && _react2.default.createElement(_CancelSvg2.default, { onClick: this.clearDayPickerStart })
				),
				_react2.default.createElement(
					_Flex2.default,
					{ justifyContent: 'center', alignItems: 'center', basis: '20px' },
					'-'
				),
				_react2.default.createElement(
					_Flex2.default,
					{
						flex: 2,
						showBorder: this.props.showClear,
						iconPosition: 'right',
						style: {
							background: this.props.theme.colors.backgroundColor || 'transparent'
						}
					},
					_react2.default.createElement(_DayPickerInput2.default, _extends({
						ref: this.getEndDateRef,
						showOverlay: this.props.focused,
						formatDate: this.formatInputDate,
						value: end,
						key: this.state.endKey,
						placeholder: this.props.placeholder.end,
						dayPickerProps: {
							numberOfMonths: this.props.numberOfMonths,
							initialMonth: this.props.initialMonth,
							onDayMouseEnter: this.handleDayMouseEnter,
							disabledDays: {
								before: this.state.currentDate ? this.state.currentDate.start : ''
							},
							selectedDays: selectedDays,
							modifiers: modifiers
						},
						inputProps: {
							'aria-label': this.props.componentId + '-end-input'
						},
						onDayChange: this.handleEndDate,
						classNames: {
							container: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-container') || 'DayPickerInput',
							overlayWrapper: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-overlay-wrapper') || 'DayPickerInput-OverlayWrapper',
							overlay: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-overlay') || 'DayPickerInput-Overlay'
						}
					}, this.props.dayPickerInputProps)),
					this.props.showClear && this.state.currentDate && this.state.currentDate.end && _react2.default.createElement(_CancelSvg2.default, { onClick: this.clearDayPickerEnd })
				)
			)
		);
	};

	return DateRange;
}(_react.Component);

DateRange.defaultQuery = function (value, props) {
	var query = null;
	if (value) {
		if (Array.isArray(props.dataField) && props.dataField.length === 2) {
			var _range, _range2;

			query = {
				bool: {
					must: [{
						range: (_range = {}, _range[props.dataField[0]] = {
							lte: (0, _helper.formatDate)(new _xdate2.default(value.start), props)
						}, _range)
					}, {
						range: (_range2 = {}, _range2[props.dataField[1]] = {
							gte: (0, _helper.formatDate)(new _xdate2.default(value.end), props)
						}, _range2)
					}]
				}
			};
		} else if (Array.isArray(props.dataField)) {
			var _range3;

			query = {
				range: (_range3 = {}, _range3[props.dataField[0]] = {
					gte: (0, _helper.formatDate)(new _xdate2.default(value.start), props),
					lte: (0, _helper.formatDate)(new _xdate2.default(value.end), props)
				}, _range3)
			};
		} else {
			var _range4;

			query = {
				range: (_range4 = {}, _range4[props.dataField] = {
					gte: (0, _helper.formatDate)(new _xdate2.default(value.start), props),
					lte: (0, _helper.formatDate)(new _xdate2.default(value.end), props)
				}, _range4)
			};
		}
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

	this.formatInputDate = function (date) {
		var xdate = new _xdate2.default(date);
		return xdate.valid() ? xdate.toString('yyyy-MM-dd') : '';
	};

	this.getEndDateRef = function (ref) {
		_this3.endDateRef = ref;
	};

	this.getStartDateRef = function (ref) {
		_this3.startDateRef = ref;
	};

	this.clearDayPickerStart = function () {
		if (_this3.state.currentDate && _this3.state.currentDate.start !== '') {
			var _props3 = _this3.props,
			    value = _props3.value,
			    onChange = _props3.onChange;


			if (value === undefined && !onChange) {
				_this3.handleStartDate('', false); // resets the day picker component
			} else if (onChange) {
				onChange({ start: '', end: _this3.state.currentDate.end });
			} else {
				// Since value prop is defined and onChange is not define
				// we keep the same date as in store
				_this3.setState({
					currentDate: _this3.state.currentDate
				});
			}
		}
	};

	this.clearDayPickerEnd = function () {
		if (_this3.state.currentDate && _this3.state.currentDate.end !== '') {
			_this3.handleEndDate(''); // resets the day picker component
			var _props4 = _this3.props,
			    value = _props4.value,
			    onChange = _props4.onChange;


			if (value === undefined && !onChange) {
				_this3.handleEndDate('', false); // resets the day picker component
			} else if (onChange) {
				onChange({ start: _this3.state.currentDate.start, end: '' });
			} else {
				// Since value prop is defined and onChange is not define
				// we keep the same date as in store
				_this3.setState({
					currentDate: _this3.state.currentDate
				});
			}
		}
	};

	this.handleStartDate = function (date) {
		var autoFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
		var currentDate = _this3.state.currentDate;

		var end = currentDate ? currentDate.end : '';
		var _props5 = _this3.props,
		    value = _props5.value,
		    onChange = _props5.onChange;

		if ((value === undefined || value && value.start === '') && !onChange) {
			if (_this3.startDateRef.getInput().value.length === 10) {
				_this3.handleDateChange({
					start: date,
					end: end
				});
				_this3.setState(function (state) {
					return {
						startKey: state.startKey === 'on-start' ? 'off-start' : 'on-start'
					};
				});
				// focus the end date DayPicker if its empty
				if (_this3.props.autoFocusEnd && autoFocus) {
					_this3.endDateRef.getInput().focus();
				}
			}
		} else if (onChange) {
			if (_this3.startDateRef.getInput().value.length === 10) {
				onChange({
					start: date,
					end: end
				});
				// focus the end date DayPicker if its empty
				if (_this3.props.autoFocusEnd && autoFocus) {
					_this3.endDateRef.getInput().focus();
				}
				// this will trigger a remount on the date component
				// since DayPickerInput doesn't respect the controlled behavior setting on its own
				_this3.setState(function (state) {
					return {
						startKey: state.startKey === 'on-start' ? 'off-start' : 'on-start'
					};
				});
			}
		} else {
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			_this3.setState(function (state) {
				return {
					startKey: state.startKey === 'on-start' ? 'off-start' : 'on-start'
				};
			});
		}
	};

	this.handleEndDate = function (selectedDay) {
		var currentDate = _this3.state.currentDate;
		var _props6 = _this3.props,
		    value = _props6.value,
		    onChange = _props6.onChange;

		var start = currentDate ? currentDate.start : '';

		if ((value === undefined || value && value.end === '') && !onChange) {
			if (_this3.endDateRef.getInput().value.length === 10) {
				_this3.handleDayMouseEnter(selectedDay);
				_this3.handleDateChange({
					start: currentDate ? currentDate.start : '',
					end: selectedDay
				});
				_this3.setState(function (state) {
					return {
						endKey: state.endKey === 'on-end' ? 'off-end' : 'on-end'
					};
				});
			}
		} else if (onChange) {
			if (_this3.endDateRef.getInput().value.length === 10) {
				onChange({
					start: start,
					end: selectedDay
				});
			}
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			_this3.setState(function (state) {
				return {
					endKey: state.endKey === 'on-end' ? 'off-end' : 'on-end'
				};
			});
		} else {
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			_this3.setState(function (state) {
				return {
					endKey: state.endKey === 'on-end' ? 'off-end' : 'on-end'
				};
			});
		}
	};

	this.handleDayMouseEnter = function (day) {
		_this3.setState({
			dateHovered: day
		});
	};

	this.handleDateChange = function (currentDate) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this3.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		var value = null;
		// modCurrentDate would check if the currentValue passed is
		// in correct format or not
		// when setting value from outside this component
		// the selectedvalue passed was in a different format and
		// thus breaking the code
		var modCurrentDate = currentDate;
		if (typeof currentDate.start === 'string' || typeof currentDate.end === 'string') {
			modCurrentDate = {
				start: currentDate.start ? new _xdate2.default(currentDate.start)[0] : '',
				end: currentDate.end ? new _xdate2.default(currentDate.end)[0] : ''
			};
		}
		if (modCurrentDate && !(modCurrentDate.start === '' && modCurrentDate.end === '')) {
			value = {
				start: _this3.formatInputDate(modCurrentDate.start),
				end: _this3.formatInputDate(modCurrentDate.end)
			}; // prettier-ignore
		}

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this3.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			};

			if (hasMounted) {
				_this3.setState({
					currentDate: modCurrentDate
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};
		(0, _helper.checkValueChange)(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props) {
		if (!value || value && value.start.length && value.end.length) {
			var customQuery = props.customQuery;

			var query = DateRange.defaultQuery(value, props);
			var customQueryOptions = void 0;
			if (customQuery) {
				var customQueryObject = customQuery(value, props);
				query = customQueryObject && customQueryObject.query;
				customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
				(0, _helper.updateCustomQuery)(props.componentId, props, value);
			}
			props.setQueryOptions(props.componentId, customQueryOptions);
			props.updateQuery({
				componentId: props.componentId,
				query: query,
				value: value ? [value.start, value.end] : null,
				showFilter: props.showFilter,
				label: props.filterLabel,
				URLParams: props.URLParams,
				componentType: _constants.componentTypes.dateRange
			});
		}
	};
};

DateRange.propTypes = {
	updateQuery: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setQueryOptions: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	autoFocusEnd: _types2.default.bool,
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	dataField: _types2.default.dataFieldArray,
	dayPickerInputProps: _types2.default.props,
	defaultValue: _types2.default.dateObject,
	value: _types2.default.dateObject,
	filterLabel: _types2.default.string,
	focused: _types2.default.bool,
	initialMonth: _types2.default.dateObject,
	innerClass: _types2.default.style,
	numberOfMonths: _types2.default.number,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	placeholder: _types2.default.rangeLabels,
	nestedField: _types2.default.string,
	queryFormat: _types2.default.queryFormatDate,
	parseDate: _types2.default.func,
	react: _types2.default.react,
	showClear: _types2.default.bool,
	showFilter: _types2.default.bool,
	style: _types2.default.style,
	theme: _types2.default.style,
	title: _types2.default.string,
	index: _types2.default.string
};

DateRange.defaultProps = {
	autoFocusEnd: true,
	numberOfMonths: 2,
	placeholder: {
		start: 'Start date',
		end: 'End date'
	},
	showClear: true,
	showFilter: true,
	queryFormat: 'epoch_millis'
};

// Add componentType for SSR
DateRange.componentType = _constants.componentTypes.dateRange;

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
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(function (props) {
	return _react2.default.createElement(
		_ComponentWrapper2.default,
		_extends({}, props, { componentType: _constants.componentTypes.dateRange }),
		function () {
			return _react2.default.createElement(DateRange, _extends({ ref: props.myForwardedRef }, props));
		}
	);
}));

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, DateRange);

ForwardRefComponent.displayName = 'DateRange';
exports.default = ForwardRefComponent;