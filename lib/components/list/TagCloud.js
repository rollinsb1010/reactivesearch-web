'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _TagList = require('../../styles/TagList');

var _TagList2 = _interopRequireDefault(_TagList);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagCloud = function (_Component) {
	_inherits(TagCloud, _Component);

	function TagCloud(props) {
		_classCallCheck(this, TagCloud);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var currentValueArray = props.selectedValue || defaultValue || [];
		var currentValue = {};

		currentValueArray.forEach(function (item) {
			currentValue[item] = true;
		});

		var options = props.options && props.options[props.dataField] ? props.options[props.dataField].buckets : [];

		_this.state = {
			currentValue: currentValue,
			options: options
		};
		_this.type = 'term';
		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);
		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		_this.updateQueryOptions(props);

		var hasMounted = false;

		if (currentValueArray.length) {
			_this.setValue(currentValueArray, true, props, hasMounted);
		}
		return _this;
	}

	TagCloud.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	TagCloud.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkPropChange)(this.props.options, prevProps.options, function () {
			var buckets = _this2.props.options[_this2.props.dataField].buckets;

			_this2.setState({
				options: buckets
			});
		});
		(0, _helper.checkSomePropChange)(this.props, prevProps, ['size', 'sortBy'], function () {
			return _this2.updateQueryOptions(_this2.props);
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQueryOptions(_this2.props);
			_this2.updateQuery(Object.keys(_this2.state.currentValue), _this2.props);
		});

		var selectedValue = Object.keys(this.state.currentValue);

		if (!this.props.multiSelect) {
			selectedValue = selectedValue.length && selectedValue[0] || '';
		}

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true, this.props);
		} else if (!(0, _helper.isEqual)(selectedValue, this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props2 = this.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (value === undefined) {
				this.setValue(this.props.selectedValue || [], true, this.props);
			} else if (onChange) {
				// value prop exists
				onChange(this.props.selectedValue || '');
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				var selectedTags = Object.keys(this.state.currentValue);
				this.setValue(selectedTags, true, this.props, false);
			}
		}
	};

	TagCloud.generateQueryOptions = function generateQueryOptions(props) {
		var queryOptions = (0, _helper.getQueryOptions)(props);
		queryOptions.size = 0;
		return (0, _helper.getAggsQuery)('', queryOptions, props);
	};

	TagCloud.prototype.render = function render() {
		var _this3 = this;

		var min = 0.8;
		var max = 3;
		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
		}

		var _props3 = this.props,
		    renderError = _props3.renderError,
		    error = _props3.error;

		if (renderError && error) {
			return (0, _utils.isFunction)(renderError) ? renderError(error) : renderError;
		}

		if (this.state.options.length === 0) {
			return null;
		}

		var highestCount = 0;
		this.state.options.forEach(function (item) {
			highestCount = item.doc_count > highestCount ? item.doc_count : highestCount;
		});

		return _react2.default.createElement(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			_react2.default.createElement(
				_TagList2.default,
				{
					role: 'menu',
					className: (0, _helper.getClassName)(this.props.innerClass, 'list') || null
				},
				this.state.options.map(function (item) {
					// eslint-disable-next-line
					var size = item.doc_count / highestCount * (max - min) + min;

					return _react2.default.createElement(
						'span',
						{
							key: item.key,
							onClick: function onClick() {
								return _this3.handleClick(item.key);
							},
							onKeyPress: function onKeyPress(e) {
								return (0, _helper.handleA11yAction)(e, function () {
									return _this3.handleClick(item.key);
								});
							},
							style: { fontSize: size + 'em' },
							className: _this3.state.currentValue[item.key] ? ((0, _helper.getClassName)(_this3.props.innerClass, 'input') || '') + ' active' : (0, _helper.getClassName)(_this3.props.innerClass, 'input'),
							role: 'menuitem',
							tabIndex: '0'
						},
						item.key,
						_this3.props.showCount && ' (' + item.doc_count + ')'
					);
				})
			)
		);
	};

	return TagCloud;
}(_react.Component);

TagCloud.defaultQuery = function (value, props) {
	var query = null;
	var type = props.queryFormat === 'or' ? 'terms' : 'term';
	type = props.multiSelect ? type : 'term';
	if (value) {
		var listQuery = void 0;
		if (!props.multiSelect || props.queryFormat === 'or') {
			var _type, _listQuery;

			listQuery = (_listQuery = {}, _listQuery[type] = (_type = {}, _type[props.dataField] = value, _type), _listQuery);
		} else {
			// adds a sub-query with must as an array of objects for each term/value
			var queryArray = value.map(function (item) {
				var _type2, _ref;

				return _ref = {}, _ref[type] = (_type2 = {}, _type2[props.dataField] = item, _type2), _ref;
			});
			listQuery = {
				bool: {
					must: queryArray
				}
			};
		}

		query = value.length ? listQuery : null;
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
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this4.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var currentValue = _this4.state.currentValue;

		var finalValues = null;

		if (props.multiSelect) {
			if (isDefaultValue) {
				finalValues = value;
				currentValue = {};
				if (value) {
					value.forEach(function (item) {
						currentValue[item] = true;
					});
				}
			} else {
				if (currentValue[value]) {
					var _currentValue = currentValue,
					    del = _currentValue[value],
					    rest = _objectWithoutProperties(_currentValue, [value]);

					currentValue = _extends({}, rest);
				} else {
					currentValue[value] = true;
				}
				finalValues = Object.keys(currentValue);
			}
		} else {
			var _currentValue2;

			currentValue = (_currentValue2 = {}, _currentValue2[value] = true, _currentValue2);
			finalValues = value;
		}

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this4.updateQuery(finalValues, props);
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMounted) {
				_this4.setState({
					currentValue: currentValue
				}, handleUpdates);
			} else {
				handleUpdates();
			}
		};

		(0, _helper.checkValueChange)(props.componentId, finalValues, props.beforeValueChange, performUpdate);
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var query = TagCloud.defaultQuery(value, props);
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
			componentType: _constants.componentTypes.tagCloud
		});
	};

	this.updateQueryOptions = function (props) {
		var queryOptions = TagCloud.generateQueryOptions(props);
		props.setQueryOptions(_this4.internalComponent, queryOptions);
	};

	this.handleClick = function (item) {
		var _props4 = _this4.props,
		    value = _props4.value,
		    onChange = _props4.onChange;


		if (value === undefined) {
			_this4.setValue(item);
		} else if (onChange) {
			onChange(item);
		}
	};
};

TagCloud.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	options: _types2.default.options,
	selectedValue: _types2.default.selectedValue,
	setCustomQuery: _types2.default.funcRequired,
	error: _types2.default.title,
	isLoading: _types2.default.bool,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.stringOrArray,
	value: _types2.default.stringOrArray,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	loader: _types2.default.title,
	multiSelect: _types2.default.bool,
	onError: _types2.default.func,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	nestedField: _types2.default.string,
	queryFormat: _types2.default.queryFormatSearch,
	renderError: _types2.default.title,
	react: _types2.default.react,
	showCount: _types2.default.bool,
	showFilter: _types2.default.bool,
	size: _types2.default.number,
	sortBy: _types2.default.sortByWithCount,
	style: _types2.default.style,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	index: _types2.default.string
};

TagCloud.defaultProps = {
	className: null,
	multiSelect: false,
	queryFormat: 'or',
	showFilter: true,
	size: 100,
	sortBy: 'asc',
	style: {},
	URLParams: false
};

// Add componentType for SSR
TagCloud.componentType = _constants.componentTypes.tagCloud;

var mapStateToProps = function mapStateToProps(state, props) {
	var options = {};
	if (props.nestedField) {
		options = state.aggregations[props.componentId] && state.aggregations[props.componentId].reactivesearch_nested;
	} else {
		options = state.aggregations[props.componentId];
	}
	return {
		options: options,
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		isLoading: state.isLoading[props.componentId],
		error: state.error[props.componentId],
		enableAppbase: state.config.enableAppbase
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		},
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return _react2.default.createElement(
		_ComponentWrapper2.default,
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.tagCloud }),
		function () {
			return _react2.default.createElement(TagCloud, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});

(0, _hoistNonReactStatics2.default)(ForwardRefComponent, TagCloud);

ForwardRefComponent.displayName = 'TagCloud';
exports.default = ForwardRefComponent;