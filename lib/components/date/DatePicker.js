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

var _xdate = require('xdate');

var _xdate2 = _interopRequireDefault(_xdate);

var _DayPickerInput = require('react-day-picker/DayPickerInput');

var _DayPickerInput2 = _interopRequireDefault(_DayPickerInput);

var _emotionTheming = require('emotion-theming');

var _DateContainer = require('../../styles/DateContainer');

var _DateContainer2 = _interopRequireDefault(_DateContainer);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Flex = require('../../styles/Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _CancelSvg = require('../shared/CancelSvg');

var _CancelSvg2 = _interopRequireDefault(_CancelSvg);

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DatePicker = function (_Component) {
	_inherits(DatePicker, _Component);

	function DatePicker(props) {
		_classCallCheck(this, DatePicker);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var currentDate = props.selectedValue || props.value || props.defaultValue || '';
		_this.state = {
			currentDate: currentDate,
			key: 'on'
		};

		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentDate);
		var hasMounted = false;

		if (currentDate) {
			_this.handleDateChange(currentDate, true, props, hasMounted);
		}
		return _this;
	}

	DatePicker.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	DatePicker.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			return _this2.updateQuery(_this2.state.currentDate ? _this2.formatInputDate(_this2.state.currentDate) : null, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.handleDateChange(this.props.value, true, this.props);
		} else if (!(0, _helper.isEqual)(this.formatInputDate(this.state.currentDate), this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			this.handleDateChange(this.props.selectedValue || '', true, this.props);
		}
	};

	DatePicker.prototype.render = function render() {
		return _react2.default.createElement(
			_DateContainer2.default,
			{
				showBorder: !this.props.showClear,
				style: this.props.style,
				className: this.props.className
			},
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			_react2.default.createElement(
				_Flex2.default,
				{
					showBorder: this.props.showClear,
					iconPosition: 'right',
					style: {
						background: this.props.theme.colors.backgroundColor || 'transparent'
					}
				},
				_react2.default.createElement(_DayPickerInput2.default, _extends({
					showOverlay: this.props.focused,
					formatDate: this.formatInputDate,
					value: this.state.currentDate,
					placeholder: this.props.placeholder,
					dayPickerProps: {
						numberOfMonths: this.props.numberOfMonths,
						initialMonth: this.props.initialMonth
					},
					inputProps: {
						'aria-label': this.props.componentId + '-input'
					},
					key: this.state.key,
					clickUnselectsDay: this.props.clickUnselectsDay,
					onDayChange: this.handleDayPicker,
					classNames: {
						container: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-container') || 'DayPickerInput',
						overlayWrapper: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-overlay-wrapper') || 'DayPickerInput-OverlayWrapper',
						overlay: (0, _helper.getClassName)(this.props.innerClass, 'daypicker-overlay') || 'DayPickerInput-Overlay'
					}
				}, this.props.dayPickerInputProps)),
				this.props.showClear && this.state.currentDate && _react2.default.createElement(_CancelSvg2.default, { onClick: this.clearDayPicker })
			)
		);
	};

	return DatePicker;
}(_react.Component);

DatePicker.defaultQuery = function (value, props) {
	var query = null;
	if (value && props.queryFormat) {
		var _range;

		query = {
			range: (_range = {}, _range[props.dataField] = {
				gte: (0, _helper.formatDate)(new _xdate2.default(value).addHours(-24), props),
				lte: (0, _helper.formatDate)(new _xdate2.default(value), props)
			}, _range)
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

	this.formatInputDate = function (date) {
		return new _xdate2.default(date).toString('yyyy-MM-dd');
	};

	this.clearDayPicker = function () {
		if (_this3.state.currentDate !== '') {
			var _props2 = _this3.props,
			    value = _props2.value,
			    onChange = _props2.onChange;


			if (value === undefined) {
				_this3.setState({
					currentDate: ''
				});
			} else if (onChange) {
				onChange('');
			} else {
				// Since value prop is defined and onChange is not define
				// we keep the same date as in store
				_this3.setState({
					currentDate: _this3.state.currentDate
				});
			}
		}
	};

	this.handleDayPicker = function (selectedDay, _, dayPickerInput) {
		var _props3 = _this3.props,
		    value = _props3.value,
		    onChange = _props3.onChange;


		if (value === undefined) {
			if (dayPickerInput.getInput().value.length === 10) {
				_this3.handleDateChange(selectedDay || '');
			}
		} else if (onChange) {
			if (dayPickerInput.getInput().value.length === 10) {
				onChange(selectedDay || '');
			}
		} else {
			// this will trigger a remount on the date component
			// since DayPickerInput doesn't respect the controlled behavior setting on its own
			_this3.setState(function (state) {
				return {
					key: state.key === 'on' ? 'off' : 'on'
				};
			});
		}
	};

	this.handleDateChange = function (currentDate) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this3.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		// currentDate should be valid or empty string for resetting the query
		if (isDefaultValue && !new _xdate2.default(currentDate).valid() && currentDate.length) {
			console.error('DatePicker: ' + props.componentId + ' invalid value passed for date');
		} else {
			var value = null;
			if (currentDate) {
				value = isDefaultValue ? currentDate : _this3.formatInputDate(currentDate);
			}

			var performUpdate = function performUpdate() {
				var handleUpdates = function handleUpdates() {
					_this3.updateQuery(value, props);
					if (props.onValueChange) props.onValueChange(value);
				};

				if (hasMounted) {
					_this3.setState({
						currentDate: currentDate
					}, handleUpdates);
				} else {
					handleUpdates();
				}
			};
			(0, _helper.checkValueChange)(props.componentId, value, props.beforeValueChange, performUpdate);
		}
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var query = DatePicker.defaultQuery(value, props);
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
			showFilter: props.showFilter,
			label: props.filterLabel,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.datePicker
		});
	};
};

DatePicker.propTypes = {
	updateQuery: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setQueryOptions: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	className: _types2.default.string,
	clickUnselectsDay: _types2.default.bool,
	componentId: _types2.default.stringRequired,
	dataField: _types2.default.stringRequired,
	dayPickerInputProps: _types2.default.props,
	defaultValue: _types2.default.date,
	value: _types2.default.date,
	filterLabel: _types2.default.string,
	focused: _types2.default.bool,
	initialMonth: _types2.default.dateObject,
	innerClass: _types2.default.style,
	numberOfMonths: _types2.default.number,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	placeholder: _types2.default.string,
	parseDate: _types2.default.func,
	nestedField: _types2.default.string,
	queryFormat: _types2.default.queryFormatDate,
	react: _types2.default.react,
	showClear: _types2.default.bool,
	showFilter: _types2.default.bool,
	style: _types2.default.style,
	theme: _types2.default.style,
	title: _types2.default.string,
	index: _types2.default.string
};

DatePicker.defaultProps = {
	clickUnselectsDay: true,
	numberOfMonths: 1,
	placeholder: 'Select Date',
	showClear: true,
	showFilter: true,
	queryFormat: 'epoch_millis'
};

// Add componentType for SSR
DatePicker.componentType = _constants.componentTypes.datePicker;

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
		_extends({}, props, { componentType: _constants.componentTypes.datePicker }),
		function () {
			return _react2.default.createElement(DatePicker, _extends({ ref: props.myForwardedRef }, props));
		}
	);
}));

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, DatePicker);

ForwardRefComponent.displayName = 'DatePicker';
exports.default = ForwardRefComponent;