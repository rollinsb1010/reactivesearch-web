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

var _Button = require('../../styles/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Flex = require('../../styles/Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var NumberBox = function (_Component) {
	_inherits(NumberBox, _Component);

	function NumberBox(props) {
		_classCallCheck(this, NumberBox);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.type = 'term';
		var currentValue = props.selectedValue || props.defaultValue || props.value || props.data.start;
		_this.state = {
			currentValue: currentValue
		};

		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		var hasMounted = false;

		if (currentValue) {
			_this.setValue(currentValue, _this.props, hasMounted);
		}
		return _this;
	}

	NumberBox.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	NumberBox.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkPropChange)(this.props.value, prevProps.value, function () {
			_this2.setValue(_this2.props.value, _this2.props);
		});
		(0, _helper.checkPropChange)(this.props.queryFormat, this.props.queryFormat, function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});
		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});
	};

	NumberBox.prototype.render = function render() {
		return (0, _core.jsx)(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			(0, _core.jsx)(
				_Flex2.default,
				{
					labelPosition: this.props.labelPosition,
					justifyContent: 'space-between',
					css: _Button.numberBoxContainer
				},
				(0, _core.jsx)(
					'span',
					{ className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null },
					this.props.data.label
				),
				(0, _core.jsx)(
					'div',
					null,
					(0, _core.jsx)(
						_Button2.default,
						{
							className: (0, _helper.getClassName)(this.props.innerClass, 'button') || null,
							onClick: this.decrementValue,
							disabled: this.state.currentValue === this.props.data.start
						},
						(0, _core.jsx)(
							'b',
							null,
							'-'
						)
					),
					this.state.currentValue,
					(0, _core.jsx)(
						_Button2.default,
						{
							className: (0, _helper.getClassName)(this.props.innerClass, 'button') || null,
							onClick: this.incrementValue,
							disabled: this.state.currentValue === this.props.data.end
						},
						(0, _core.jsx)(
							'b',
							null,
							'+'
						)
					)
				)
			)
		);
	};

	return NumberBox;
}(_react.Component);

NumberBox.defaultQuery = function (value, props) {
	var _term, _range, _range2;

	var query = null;
	switch (props.queryFormat) {
		case 'exact':
			query = {
				term: (_term = {}, _term[props.dataField] = value, _term)
			};
			break;
		case 'lte':
			query = {
				range: (_range = {}, _range[props.dataField] = {
					lte: value,
					boost: 2.0
				}, _range)
			};
			break;
		default:
			query = {
				range: (_range2 = {}, _range2[props.dataField] = {
					gte: value,
					boost: 2.0
				}, _range2)
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

	this.incrementValue = function () {
		if (_this3.state.currentValue === _this3.props.data.end) {
			return;
		}
		var currentValue = _this3.state.currentValue;
		var _props2 = _this3.props,
		    value = _props2.value,
		    onChange = _props2.onChange;


		if (value === undefined) {
			_this3.setValue(currentValue + 1);
		} else if (onChange) {
			onChange(currentValue + 1);
		}
	};

	this.decrementValue = function () {
		if (_this3.state.currentValue === _this3.props.data.start) {
			return;
		}
		var currentValue = _this3.state.currentValue;
		var _props3 = _this3.props,
		    value = _props3.value,
		    onChange = _props3.onChange;


		if (value === undefined) {
			_this3.setValue(currentValue - 1);
		} else if (onChange) {
			onChange(currentValue - 1);
		}
	};

	this.setValue = function (value) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.props;
		var hasMounted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this3.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			};

			if (hasMounted) {
				_this3.setState({
					currentValue: value
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};
		(0, _helper.checkValueChange)(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var query = NumberBox.defaultQuery(value, props);
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
			showFilter: false, // we don't need filters for NumberBox
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.numberBox
		});
	};
};

NumberBox.propTypes = {
	updateQuery: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setQueryOptions: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	data: _types2.default.dataNumberBox,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.number,
	value: _types2.default.number,
	innerClass: _types2.default.style,
	nestedField: _types2.default.string,
	labelPosition: _types2.default.labelPosition,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	queryFormat: _types2.default.queryFormatNumberBox,
	react: _types2.default.react,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	index: _types2.default.string
};

NumberBox.defaultProps = {
	className: null,
	labelPosition: 'left',
	queryFormat: 'gte',
	style: {},
	URLParams: false
};

// Add componentType for SSR
NumberBox.componentType = _constants.componentTypes.numberBox;

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
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({}, props, { componentType: _constants.componentTypes.numberBox }),
		function () {
			return (0, _core.jsx)(NumberBox, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});

(0, _hoistNonReactStatics2.default)(ForwardRefComponent, NumberBox);

ForwardRefComponent.displayName = 'NumberBox';
exports.default = ForwardRefComponent;