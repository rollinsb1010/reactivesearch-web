'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Button = require('../../styles/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Dropdown = require('../shared/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleDropdownList = function (_Component) {
	_inherits(SingleDropdownList, _Component);

	function SingleDropdownList(props) {
		_classCallCheck(this, SingleDropdownList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var currentValue = props.selectedValue || defaultValue;
		var dataField = props.dataField;

		_this.state = {
			currentValue: currentValue || '',
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

		if (currentValue) {
			_this.setValue(currentValue, props, hasMounted);
		}
		return _this;
	}

	SingleDropdownList.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	SingleDropdownList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
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
				});
			} else {
				_this2.setState({
					options: _this2.props.options && _this2.props.options[dataField] ? _this2.props.options[dataField].buckets : []
				});
			}
		});
		(0, _helper.checkSomePropChange)(this.props, prevProps, ['size', 'sortBy'], function () {
			return _this2.updateQueryOptions(_this2.props);
		});

		// Treat defaultQuery and customQuery as reactive props
		if (!(0, _utils.isQueryIdentical)(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			// Clear the component value
			this.updateQuery('', this.props);
		}

		if (!(0, _utils.isQueryIdentical)(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		(0, _helper.checkPropChange)(this.props.dataField, prevProps.dataField, function () {
			_this2.updateQueryOptions(_this2.props);
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value);
		} else if (this.state.currentValue !== this.props.selectedValue && this.props.selectedValue !== prevProps.selectedValue) {
			var _props3 = this.props,
			    value = _props3.value,
			    onChange = _props3.onChange;


			if (value === undefined) {
				this.setValue(this.props.selectedValue || '');
			} else if (onChange) {
				onChange(this.props.selectedValue || '');
			} else {
				this.setValue(this.state.currentValue);
			}
		}
	};

	SingleDropdownList.generateQueryOptions = function generateQueryOptions(props, after, value) {
		var queryOptions = (0, _helper.getQueryOptions)(props);
		return props.showLoadMore ? (0, _helper.getCompositeAggsQuery)({
			value: value,
			query: queryOptions,
			props: props,
			after: after
		}) : (0, _helper.getAggsQuery)(value, queryOptions, props);
	};

	SingleDropdownList.prototype.render = function render() {
		var _props4 = this.props,
		    showLoadMore = _props4.showLoadMore,
		    loadMoreLabel = _props4.loadMoreLabel,
		    renderError = _props4.renderError,
		    error = _props4.error,
		    isLoading = _props4.isLoading;
		var isLastBucket = this.state.isLastBucket;

		var selectAll = [];

		if (this.props.isLoading && this.props.loader) {
			return this.props.loader;
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

	_createClass(SingleDropdownList, [{
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}]);

	return SingleDropdownList;
}(_react.Component);

SingleDropdownList.defaultQuery = function (value, props) {
	var query = null;
	if (props.selectAllLabel && props.selectAllLabel === value) {
		if (props.showMissing) {
			query = { match_all: {} };
		}
		query = {
			exists: {
				field: props.dataField
			}
		};
	} else if (value) {
		var _term;

		if (props.showMissing && props.missingLabel === value) {
			query = {
				bool: {
					must_not: {
						exists: { field: props.dataField }
					}
				}
			};
		}
		query = {
			term: (_term = {}, _term[props.dataField] = value, _term)
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

		var query = SingleDropdownList.defaultQuery(value, props);
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
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.singleDropdownList
		});
	};

	this.updateDefaultQuery = function (queryOptions) {
		var currentValue = _this3.state.currentValue;
		// Update default query for RS API

		(0, _helper.updateDefaultQuery)(_this3.props.componentId, _this3.props, currentValue);
		(0, _helper.updateInternalQuery)(_this3.internalComponent, queryOptions, currentValue, _this3.props, SingleDropdownList.generateQueryOptions(_this3.props, _this3.state.prevAfter, currentValue));
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
		var queryOptions = SingleDropdownList.generateQueryOptions(props, addAfterKey ? _this3.state.after : {}, _this3.state.currentValue);
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
			onChange(currentValue);
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

SingleDropdownList.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	options: _types2.default.options,
	rawData: _types2.default.rawData,
	selectedValue: _types2.default.selectedValue,
	setCustomQuery: _types2.default.funcRequired,
	error: _types2.default.title,
	isLoading: _types2.default.bool,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	children: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	defaultQuery: _types2.default.func,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.string,
	value: _types2.default.string,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	loader: _types2.default.title,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	onError: _types2.default.func,
	placeholder: _types2.default.string,
	searchPlaceholder: _types2.default.string,
	react: _types2.default.react,
	render: _types2.default.func,
	renderItem: _types2.default.func,
	renderLabel: _types2.default.func,
	renderError: _types2.default.title,
	renderNoResults: _types2.default.func,
	transformData: _types2.default.func,
	selectAllLabel: _types2.default.string,
	showCount: _types2.default.bool,
	showFilter: _types2.default.bool,
	size: _types2.default.number,
	sortBy: _types2.default.sortByWithCount,
	style: _types2.default.style,
	title: _types2.default.title,
	themePreset: _types2.default.themePreset,
	URLParams: _types2.default.bool,
	showMissing: _types2.default.bool,
	missingLabel: _types2.default.string,
	showSearch: _types2.default.bool,
	showLoadMore: _types2.default.bool,
	loadMoreLabel: _types2.default.title,
	nestedField: _types2.default.string,
	index: _types2.default.string
};

SingleDropdownList.defaultProps = {
	className: null,
	placeholder: 'Select a value',
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
SingleDropdownList.componentType = _constants.componentTypes.singleDropdownList;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		rawData: state.rawData[props.componentId],
		options: props.nestedField && state.aggregations[props.componentId] ? state.aggregations[props.componentId].reactivesearch_nested : state.aggregations[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || '',
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
		_extends({}, props, {
			internalComponent: true,
			componentType: _constants.componentTypes.singleDropdownList
		}),
		function () {
			return _react2.default.createElement(SingleDropdownList, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, SingleDropdownList);

ForwardRefComponent.displayName = 'SingleDropdownList';
exports.default = ForwardRefComponent;