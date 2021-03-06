'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Button = require('../../styles/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Dropdown = require('../shared/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiDropdownList = function (_Component) {
	_inherits(MultiDropdownList, _Component);

	function MultiDropdownList(props) {
		_classCallCheck(this, MultiDropdownList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var currentValueArray = props.selectedValue || defaultValue || [];
		var currentValue = {};
		currentValueArray.forEach(function (item) {
			currentValue[item] = true;
		});
		var dataField = props.dataField;

		_this.state = {
			currentValue: currentValue,
			options: props.options && props.options[dataField] ? props.options[dataField].buckets : [],
			after: {}, // for composite aggs
			isLastBucket: false
		};
		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);

		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		(0, _helper.updateDefaultQuery)(props.componentId, props, currentValue);
		_this.updateQueryOptions(props);

		var hasMounted = false;

		if (currentValueArray.length) {
			_this.setValue(currentValueArray, true, props, hasMounted);
		}
		return _this;
	}

	MultiDropdownList.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	MultiDropdownList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkPropChange)(this.props.options, prevProps.options, function () {
			var _props2 = _this2.props,
			    showLoadMore = _props2.showLoadMore,
			    dataField = _props2.dataField;
			var options = _this2.state.options;

			if (showLoadMore && _this2.props.options && _this2.props.options[dataField]) {
				// append options with showLoadMore
				var buckets = _this2.props.options[dataField].buckets;

				var nextOptions = [].concat(options, buckets.map(function (bucket) {
					return {
						key: bucket.key[dataField],
						doc_count: bucket.doc_count
					};
				}));
				var after = _this2.props.options[dataField].after_key;
				// detect the last bucket by checking if the next set of buckets were empty
				var isLastBucket = !buckets.length;
				_this2.setState({
					after: {
						after: after
					},
					isLastBucket: isLastBucket,
					options: nextOptions
				}, function () {
					// this will ensure that the Select-All (or any)
					// value gets handled on the initial load and
					// consecutive loads
					var currentValue = _this2.state.currentValue;

					var value = Object.keys(currentValue).filter(function (item) {
						return currentValue[item];
					});
					if (value.length) _this2.setValue(value, true);
				});
			} else {
				_this2.setState({
					options: _this2.props.options && _this2.props.options[dataField] ? _this2.props.options[dataField].buckets : []
				}, function () {
					// this will ensure that the Select-All (or any)
					// value gets handled on the initial load and
					// consecutive loads
					var currentValue = _this2.state.currentValue;

					var value = Object.keys(currentValue).filter(function (item) {
						return currentValue[item];
					});
					if (value.length) _this2.setValue(value, true);
				});
			}
		});
		var valueArray = _typeof(this.state.currentValue) === 'object' ? Object.keys(this.state.currentValue) : [];
		// Treat defaultQuery and customQuery as reactive props
		if (!(0, _utils.isQueryIdentical)(valueArray, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			this.updateQuery([], this.props);
		}

		if (!(0, _utils.isQueryIdentical)(valueArray, this.props, prevProps, 'customQuery')) {
			this.updateQuery(valueArray, this.props);
		}

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['size', 'sortBy'], function () {
			return _this2.updateQueryOptions(_this2.props);
		});

		(0, _helper.checkPropChange)(this.props.dataField, prevProps.dataField, function () {
			_this2.updateQueryOptions(_this2.props);
			_this2.updateQuery(valueArray, _this2.props);
		});

		var selectedValue = valueArray;
		var selectAllLabel = this.props.selectAllLabel;


		if (selectAllLabel) {
			selectedValue = selectedValue.filter(function (val) {
				return val !== selectAllLabel;
			});
			if (this.state.currentValue[selectAllLabel]) {
				selectedValue = [selectAllLabel];
			}
		}

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true);
		} else if (!(0, _helper.isEqual)(selectedValue, this.props.selectedValue) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props3 = this.props,
			    value = _props3.value,
			    onChange = _props3.onChange;

			if (value === undefined) {
				this.setValue(this.props.selectedValue || [], true);
			} else if (onChange) {
				onChange(this.props.selectedValue || null);
			} else {
				var selectedListItems = valueArray;
				this.setValue(selectedListItems, true);
			}
		}
	};

	MultiDropdownList.generateQueryOptions = function generateQueryOptions(props, after) {
		var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		var queryOptions = (0, _helper.getQueryOptions)(props);
		var valueArray = Object.keys(value);
		return props.showLoadMore ? (0, _helper.getCompositeAggsQuery)({
			value: valueArray,
			query: queryOptions,
			props: props,
			after: after
		}) : (0, _helper.getAggsQuery)(valueArray, queryOptions, props);
	};

	MultiDropdownList.prototype.render = function render() {
		var _props4 = this.props,
		    showLoadMore = _props4.showLoadMore,
		    loadMoreLabel = _props4.loadMoreLabel,
		    error = _props4.error,
		    renderError = _props4.renderError,
		    isLoading = _props4.isLoading,
		    loader = _props4.loader;
		var isLastBucket = this.state.isLastBucket;

		var selectAll = [];

		if (isLoading && loader) {
			return loader;
		}

		if (renderError && error) {
			return (0, _utils.isFunction)(renderError) ? renderError(error) : renderError;
		}

		if (!this.hasCustomRenderer && this.state.options.length === 0) {
			if (this.props.renderNoResults && !this.props.isLoading) {
				return this.props.renderNoResults();
			}

			return null;
		}

		if (this.props.selectAllLabel) {
			selectAll = [{
				key: this.props.selectAllLabel
			}];
		}
		return _react2.default.createElement(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			_react2.default.createElement(_Dropdown2.default, {
				innerClass: this.props.innerClass,
				items: [].concat(selectAll, this.state.options.filter(function (item) {
					return String(item.key).trim().length;
				}).map(function (item) {
					return _extends({}, item, { key: String(item.key) });
				})),
				onChange: this.handleChange,
				selectedItem: this.state.currentValue,
				placeholder: this.props.placeholder,
				searchPlaceholder: this.props.searchPlaceholder,
				labelField: 'key',
				multi: true,
				showCount: this.props.showCount,
				themePreset: this.props.themePreset,
				renderItem: this.props.renderItem,
				hasCustomRenderer: this.hasCustomRenderer,
				customRenderer: this.getComponent,
				customLabelRenderer: this.props.renderLabel,
				renderNoResults: this.props.renderNoResults,
				showSearch: this.props.showSearch,
				transformData: this.props.transformData,
				footer: showLoadMore && !isLastBucket && _react2.default.createElement(
					'div',
					{ css: _Button.loadMoreContainer },
					_react2.default.createElement(
						_Button2.default,
						{ disabled: isLoading, onClick: this.handleLoadMore },
						loadMoreLabel
					)
				)
			})
		);
	};

	_createClass(MultiDropdownList, [{
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}]);

	return MultiDropdownList;
}(_react.Component);

MultiDropdownList.defaultQuery = function (value, props) {
	var query = null;
	var type = props.queryFormat === 'or' ? 'terms' : 'term';

	if (!Array.isArray(value) || value.length === 0) {
		return null;
	}

	if (props.selectAllLabel && value.includes(props.selectAllLabel)) {
		if (props.showMissing) {
			query = { match_all: {} };
		} else {
			query = {
				exists: {
					field: props.dataField
				}
			};
		}
	} else if (value) {
		var listQuery = void 0;
		if (props.queryFormat === 'or') {
			var _type, _ref;

			var should = [(_ref = {}, _ref[type] = (_type = {}, _type[props.dataField] = value.filter(function (item) {
				return item !== props.missingLabel;
			}), _type), _ref)];
			if (props.showMissing) {
				var hasMissingTerm = value.includes(props.missingLabel);

				if (hasMissingTerm) {
					should = should.concat({
						bool: {
							must_not: {
								exists: { field: props.dataField }
							}
						}
					});
				}
			}

			listQuery = {
				bool: {
					should: should
				}
			};
		} else {
			// adds a sub-query with must as an array of objects for each term/value
			var queryArray = value.map(function (item) {
				var _type2, _ref2;

				return _ref2 = {}, _ref2[type] = (_type2 = {}, _type2[props.dataField] = item, _type2), _ref2;
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
	var _this3 = this;

	this.setValue = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this3.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var selectAllLabel = _this3.props.selectAllLabel;
		var currentValue = _this3.state.currentValue;

		var finalValues = null;

		if (selectAllLabel && value.includes(selectAllLabel)) {
			if (currentValue[selectAllLabel] && hasMounted && !isDefaultValue) {
				currentValue = {};
				finalValues = [];
			} else {
				_this3.state.options.forEach(function (item) {
					currentValue[item.key] = true;
				});
				currentValue[selectAllLabel] = true;
				finalValues = [selectAllLabel];
			}
		} else if (isDefaultValue) {
			finalValues = value;
			currentValue = {};
			if (value) {
				value.forEach(function (item) {
					currentValue[item] = true;
				});
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				var _currentValue = currentValue,
				    del = _currentValue[selectAllLabel],
				    obj = _objectWithoutProperties(_currentValue, [selectAllLabel]);

				currentValue = _extends({}, obj);
			}
		} else {
			if (currentValue[value]) {
				var _currentValue2 = currentValue,
				    _del = _currentValue2[value],
				    rest = _objectWithoutProperties(_currentValue2, [value]);

				currentValue = _extends({}, rest);
			} else {
				currentValue[value] = true;
			}

			if (selectAllLabel && selectAllLabel in currentValue) {
				var _currentValue3 = currentValue,
				    _del2 = _currentValue3[selectAllLabel],
				    _obj = _objectWithoutProperties(_currentValue3, [selectAllLabel]);

				currentValue = _extends({}, _obj);
			}
			finalValues = Object.keys(currentValue);
		}

		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this3.updateQuery(finalValues, props);
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMounted) {
				_this3.setState({
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

		var query = MultiDropdownList.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref3 = customQuery(value, props) || {};

			query = _ref3.query;

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
			componentType: _constants.componentTypes.multiDropdownList
		});
	};

	this.updateDefaultQuery = function (queryOptions) {
		var value = Object.keys(_this3.state.currentValue);
		// Update default query for RS API
		(0, _helper.updateDefaultQuery)(_this3.props.componentId, _this3.props, value);
		(0, _helper.updateInternalQuery)(_this3.internalComponent, queryOptions, value, _this3.props, MultiDropdownList.generateQueryOptions(_this3.props, _this3.state.prevAfter, _this3.state.currentValue));
	};

	this.updateQueryOptions = function (props) {
		var addAfterKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		// when using composite aggs flush the current options for a fresh query
		if (props.showLoadMore && !addAfterKey) {
			_this3.setState({
				options: []
			});
		}
		// for a new query due to other changes don't append after to get fresh results
		var queryOptions = MultiDropdownList.generateQueryOptions(props, addAfterKey ? _this3.state.after : {}, _this3.state.currentValue);
		if (props.defaultQuery) {
			_this3.updateDefaultQuery(queryOptions);
		} else {
			props.setQueryOptions(_this3.internalComponent, queryOptions);
		}
	};

	this.handleLoadMore = function () {
		_this3.updateQueryOptions(_this3.props, true);
	};

	this.handleChange = function (e) {
		var currentValue = e;
		if ((0, _utils.isEvent)(e)) {
			currentValue = e.target.value;
		}
		var _props5 = _this3.props,
		    value = _props5.value,
		    onChange = _props5.onChange;

		if (value === undefined) {
			_this3.setValue(currentValue);
		} else if (onChange) {
			onChange((0, _utils.parseValueArray)(_this3.props.value, currentValue));
		}
	};

	this.getComponent = function (items, downshiftProps) {
		var _props6 = _this3.props,
		    error = _props6.error,
		    isLoading = _props6.isLoading,
		    rawData = _props6.rawData;
		var currentValue = _this3.state.currentValue;

		var data = {
			error: error,
			loading: isLoading,
			value: currentValue,
			data: items || [],
			rawData: rawData,
			handleChange: _this3.handleChange,
			downshiftProps: downshiftProps
		};
		return (0, _utils.getComponent)(data, _this3.props);
	};
};

MultiDropdownList.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	options: _types2.default.options,
	rawData: _types2.default.rawData,
	selectedValue: _types2.default.selectedValue,
	setCustomQuery: _types2.default.funcRequired,
	isLoading: _types2.default.bool,
	error: _types2.default.title,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	children: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	defaultQuery: _types2.default.func,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.stringArray,
	value: _types2.default.stringArray,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	loader: _types2.default.title,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	onError: _types2.default.func,
	placeholder: _types2.default.string,
	searchPlaceholder: _types2.default.string,
	queryFormat: _types2.default.queryFormatSearch,
	react: _types2.default.react,
	render: _types2.default.func,
	renderItem: _types2.default.func,
	renderNoResults: _types2.default.func,
	renderLabel: _types2.default.func,
	renderError: _types2.default.title,
	transformData: _types2.default.func,
	selectAllLabel: _types2.default.string,
	showCount: _types2.default.bool,
	showFilter: _types2.default.bool,
	size: _types2.default.number,
	sortBy: _types2.default.sortByWithCount,
	style: _types2.default.style,
	themePreset: _types2.default.themePreset,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	showMissing: _types2.default.bool,
	missingLabel: _types2.default.string,
	showSearch: _types2.default.bool,
	showLoadMore: _types2.default.bool,
	loadMoreLabel: _types2.default.title,
	nestedField: _types2.default.string,
	index: _types2.default.string
};

MultiDropdownList.defaultProps = {
	className: null,
	placeholder: 'Select values',
	queryFormat: 'or',
	showCount: true,
	showFilter: true,
	size: 100,
	sortBy: 'count',
	style: {},
	URLParams: false,
	showMissing: false,
	missingLabel: 'N/A',
	showSearch: false,
	showLoadMore: false,
	loadMoreLabel: 'Load More'
};

// Add componentType for SSR
MultiDropdownList.componentType = _constants.componentTypes.multiDropdownList;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		options: props.nestedField && state.aggregations[props.componentId] ? state.aggregations[props.componentId].reactivesearch_nested : state.aggregations[props.componentId],
		rawData: state.rawData[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		isLoading: state.isLoading[props.componentId],
		themePreset: state.config.themePreset,
		error: state.error[props.componentId],
		enableAppbase: state.config.enableAppbase
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		setDefaultQuery: function setDefaultQuery(component, query) {
			return dispatch((0, _actions.setDefaultQuery)(component, query));
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
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.multiDropdownList }),
		function () {
			return _react2.default.createElement(MultiDropdownList, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, MultiDropdownList);

ForwardRefComponent.displayName = 'MultiDropdownList';
exports.default = ForwardRefComponent;