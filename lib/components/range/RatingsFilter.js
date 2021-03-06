'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('@emotion/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _propTypes = require('prop-types');

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _StarRating = require('./addons/StarRating');

var _StarRating2 = _interopRequireDefault(_StarRating);

var _ratingsList = require('../../styles/ratingsList');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var RatingsFilter = function (_Component) {
	_inherits(RatingsFilter, _Component);

	function RatingsFilter(props) {
		_classCallCheck(this, RatingsFilter);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var value = props.selectedValue || defaultValue || null;
		var currentValue = RatingsFilter.parseValue(value, props);

		_this.state = {
			currentValue: currentValue
		};
		_this.type = 'range';
		// Set custom query in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);

		var hasMounted = false;

		if (currentValue) {
			_this.setValue({
				value: currentValue,
				props: props,
				hasMounted: hasMounted,
				includeUnrated: _this.getIncludeUnratedFromData(currentValue)
			});
		}
		return _this;
	}

	RatingsFilter.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	RatingsFilter.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.setValue({ value: this.props.value });
		} else if (!(0, _helper.isEqual)(this.state.currentValue, this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props2 = this.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (value === undefined) {
				this.setValue({
					value: this.props.selectedValue || null,
					includeUnrated: this.getIncludeUnratedFromData(this.props.selectedValue)
				});
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				this.setValue({
					value: this.state.currentValue,
					includeUnrated: this.getIncludeUnratedFromData(this.state.currentValue)
				});
			}
		}
	};

	// parses range label to get start and end


	RatingsFilter.prototype.render = function render() {
		var _this3 = this;

		return (0, _core.jsx)(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			(0, _core.jsx)(
				'ul',
				{ css: _ratingsList.ratingsList },
				this.props.data.map(function (item) {
					var start = item.start,
					    end = item.end,
					    label = item.label,
					    rest = _objectWithoutProperties(item, ['start', 'end', 'label']);

					return (0, _core.jsx)(
						'li',
						{
							role: 'menuitem',
							tabIndex: '0',
							className: _this3.state.currentValue && _this3.state.currentValue[0] === start ? 'active' : '',
							onClick: function onClick() {
								return _this3.handleClick([start, end], rest);
							},
							onKeyPress: function onKeyPress(e) {
								return (0, _helper.handleA11yAction)(e, function () {
									return _this3.handleClick([start, end], rest);
								});
							},
							key: _this3.props.componentId + '-' + start + '-' + end
						},
						(0, _core.jsx)(_StarRating2.default, {
							icon: _this3.props.icon,
							dimmedIcon: _this3.props.dimmedIcon,
							stars: start
						}),
						label ? (0, _core.jsx)(
							'span',
							null,
							label
						) : null
					);
				})
			)
		);
	};

	return RatingsFilter;
}(_react.Component);

RatingsFilter.parseValue = function (value) {
	if (Array.isArray(value)) return value;
	return value ? [value.start, value.end] : null;
};

RatingsFilter.defaultQuery = function (value, props) {
	var includeUnrated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var query = null;
	if (value) {
		query = (0, _utils.getRangeQueryWithNullValues)(value, {
			dataField: props.dataField,
			includeNullValues: props.includeNullValues || includeUnrated
		});
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

	this.getIncludeUnratedFromData = function (range) {
		if (!_this4.props.data || !range) return false;
		var dataObj = _this4.props.data.find(function (data) {
			return data.start === range[0] && data.end === range[1];
		});
		return dataObj && dataObj.includeUnrated;
	};

	this.setValue = function (_ref) {
		var value = _ref.value,
		    _ref$props = _ref.props,
		    props = _ref$props === undefined ? _this4.props : _ref$props,
		    _ref$hasMounted = _ref.hasMounted,
		    hasMounted = _ref$hasMounted === undefined ? true : _ref$hasMounted,
		    _ref$includeUnrated = _ref.includeUnrated,
		    includeUnrated = _ref$includeUnrated === undefined ? false : _ref$includeUnrated;

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this4.updateQuery(value, props, includeUnrated);
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
		(0, _helper.checkValueChange)(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props, includeUnrated) {
		var customQuery = props.customQuery;

		var query = RatingsFilter.defaultQuery(value, props, includeUnrated);
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
			componentType: _constants.componentTypes.ratingsFilter
		});
	};

	this.handleClick = function (selectedItem, params) {
		var _props3 = _this4.props,
		    value = _props3.value,
		    onChange = _props3.onChange;

		if (value === undefined) {
			_this4.setValue({ value: selectedItem, includeUnrated: params.includeUnrated });
		} else if (onChange) {
			onChange(selectedItem);
		}
	};
};

RatingsFilter.propTypes = {
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
	defaultValue: _types2.default.range,
	dimmedIcon: _propTypes.element,
	value: _types2.default.range,
	filterLabel: _types2.default.string,
	icon: _propTypes.element,
	innerClass: _types2.default.style,
	nestedField: _types2.default.string,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	react: _types2.default.react,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	includeNullValues: _types2.default.bool,
	index: _types2.default.string
};

RatingsFilter.defaultProps = {
	className: null,
	style: {},
	URLParams: false,
	includeNullValues: false
};

// Add componentType for SSR
RatingsFilter.componentType = _constants.componentTypes.ratingsFilter;

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
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({}, props, { componentType: _constants.componentTypes.ratingsFilter }),
		function () {
			return (0, _core.jsx)(RatingsFilter, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, RatingsFilter);

ForwardRefComponent.displayName = 'RatingsFilter';
exports.default = ForwardRefComponent;