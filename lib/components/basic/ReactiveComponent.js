'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactiveComponent = function (_Component) {
	_inherits(ReactiveComponent, _Component);

	function ReactiveComponent(props) {
		_classCallCheck(this, ReactiveComponent);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.getAggsQuery = function () {
			if (_this.props.aggregationField) {
				return (0, _helper.getCompositeAggsQuery)({
					props: _this.props,
					showTopHits: true,
					value: _this.props.value
				});
			}
			return {};
		};

		_this.internalComponent = null;
		_this.defaultQuery = null;
		_this.setQuery = function (data) {
			if (!data) {
				console.error('setQuery accepts the arguments of shape { query, options, value }.');
				return;
			}

			var options = data.options,
			    obj = _objectWithoutProperties(data, ['options']);

			if (options) {
				props.setQueryOptions(props.componentId, _extends({}, options, _this.getAggsQuery()), false);
			}

			var queryToBeSet = obj.query;

			// when enableAppbase is true, Backend throws error because of repeated query in request body
			if (obj && obj.query && obj.query.query) {
				queryToBeSet = obj.query.query;
			}

			// Update customQuery field for RS API
			if (obj && obj.query || options) {
				var customQuery = _extends({}, options);
				if (obj && obj.query) {
					customQuery.query = queryToBeSet;
				}
				props.setCustomQuery(props.componentId, customQuery);
			}
			_this.props.updateQuery(_extends({}, obj, {
				query: queryToBeSet,
				componentId: props.componentId,
				label: props.filterLabel,
				showFilter: props.showFilter,
				URLParams: props.URLParams
			}));
		};

		if (props.defaultQuery) {
			_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);
		}

		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, undefined);
		(0, _helper.updateDefaultQuery)(props.componentId, props, undefined);

		if (_this.internalComponent && props.defaultQuery) {
			_this.defaultQuery = props.defaultQuery();

			var _ref = _this.defaultQuery || {},
			    query = _ref.query;

			var defaultQueryOptions = _this.defaultQuery ? (0, _helper.getOptionsFromQuery)(_this.defaultQuery) : null;

			if (defaultQueryOptions) {
				props.setQueryOptions(_this.internalComponent, _extends({}, defaultQueryOptions, _this.getAggsQuery()), false);
			} else _this.props.setQueryOptions(_this.internalComponent, _this.getAggsQuery());

			props.updateQuery({
				componentId: _this.internalComponent,
				query: query || null
			});
		}
		return _this;
	}

	ReactiveComponent.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    customQuery = _props.customQuery,
		    selectedValue = _props.selectedValue,
		    value = _props.value,
		    defaultValue = _props.defaultValue,
		    componentId = _props.componentId,
		    filterLabel = _props.filterLabel,
		    showFilter = _props.showFilter,
		    URLParams = _props.URLParams,
		    aggregationField = _props.aggregationField,
		    config = _props.config,
		    distinctField = _props.distinctField,
		    distinctFieldConfig = _props.distinctFieldConfig,
		    index = _props.index;

		var initialValue = selectedValue || value || defaultValue || null;
		var enableAppbase = config.enableAppbase;


		if (enableAppbase && aggregationField) {
			console.warn('Warning(ReactiveSearch): The `aggregationField` prop has been marked as deprecated, please use the `distinctField` prop instead.');
		}
		if (!enableAppbase && (distinctField || distinctFieldConfig)) {
			console.warn('Warning(ReactiveSearch): In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}

		if (customQuery) {
			var calcCustomQuery = customQuery(this.props);

			var _ref2 = calcCustomQuery || {},
			    query = _ref2.query;

			var customQueryOptions = calcCustomQuery ? (0, _helper.getOptionsFromQuery)(calcCustomQuery) : null;
			if (customQueryOptions) {
				this.props.setQueryOptions(componentId, _extends({}, customQueryOptions, this.getAggsQuery()), false);
			} else this.props.setQueryOptions(componentId, this.getAggsQuery(), false);
			this.props.updateQuery({
				componentId: componentId,
				query: query,
				value: initialValue,
				label: filterLabel,
				showFilter: showFilter,
				URLParams: URLParams
			});
		}
	};

	ReactiveComponent.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		// only consider hits and defaultQuery when customQuery is absent
		if (this.props.onData) {
			(0, _helper.checkSomePropChange)(this.props, prevProps, ['hits', 'aggregations', 'promotedResults', 'total', 'time', 'hidden'], function () {
				_this2.props.onData(_this2.getData());
			});
		}

		(0, _helper.checkPropChange)(this.props.selectedValue, prevProps.selectedValue, function () {
			/*
   	Reset query when SelectedFilters are clicked. Note: `selectedValue` becomes null.
   */

			if (_this2.props.selectedValue === null) {
				_this2.props.updateQuery({
					componentId: _this2.props.componentId,
					query: null
				});
			}
		});

		if (this.props.defaultQuery && !(0, _helper.isEqual)(this.props.defaultQuery(), this.defaultQuery)) {
			this.defaultQuery = this.props.defaultQuery();

			var _ref3 = this.defaultQuery || {},
			    query = _ref3.query,
			    queryOptions = _objectWithoutProperties(_ref3, ['query']);

			if (queryOptions) {
				this.props.setQueryOptions(this.internalComponent, _extends({}, queryOptions, this.getAggsQuery()), false);
			} else this.props.setQueryOptions(this.internalComponent, this.getAggsQuery(), false);
			(0, _helper.updateDefaultQuery)(this.props.componentId, this.props, undefined);
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: query || null
			});
		}

		if (this.props.customQuery && !(0, _helper.isEqual)(this.props.customQuery(this.props), prevProps.customQuery(this.props))) {
			var _ref4 = this.props.customQuery(this.props) || {},
			    _query = _ref4.query,
			    _queryOptions = _objectWithoutProperties(_ref4, ['query']);

			if (_queryOptions) {
				this.props.setQueryOptions(this.props.componentId, _extends({}, _queryOptions, this.getAggsQuery()), false);
			} else this.props.setQueryOptions(this.props.componentId, this.getAggsQuery(), false);
			(0, _helper.updateCustomQuery)(this.props.componentId, this.props, undefined);
			this.props.updateQuery({
				componentId: this.props.componentId,
				query: _query || null
			});
		}
	};

	ReactiveComponent.prototype.getData = function getData() {
		var _props2 = this.props,
		    hits = _props2.hits,
		    aggregations = _props2.aggregations,
		    aggregationData = _props2.aggregationData,
		    promotedResults = _props2.promotedResults,
		    rawData = _props2.rawData;

		var filteredResults = (0, _helper.parseHits)(hits);
		if (promotedResults.length) {
			var ids = promotedResults.map(function (item) {
				return item._id;
			}).filter(Boolean);
			if (ids) {
				filteredResults = filteredResults.filter(function (item) {
					return !ids.includes(item._id);
				});
			}
			filteredResults = [].concat(promotedResults, filteredResults);
		}
		return {
			data: filteredResults,
			promotedData: promotedResults,
			aggregationData: aggregationData || [],
			rawData: rawData,
			aggregations: aggregations,
			resultStats: this.stats
		};
	};

	ReactiveComponent.prototype.getComponent = function getComponent() {
		var _props3 = this.props,
		    error = _props3.error,
		    isLoading = _props3.isLoading,
		    selectedValue = _props3.selectedValue;

		var data = _extends({
			error: error,
			loading: isLoading
		}, this.getData(), {
			value: selectedValue,
			setQuery: this.setQuery
		});
		return (0, _utils.getComponent)(data, this.props);
	};

	ReactiveComponent.prototype.render = function render() {
		if ((0, _utils.hasCustomRenderer)(this.props)) {
			return this.getComponent();
		}
		return null;
	};

	_createClass(ReactiveComponent, [{
		key: 'stats',
		get: function get() {
			return (0, _helper.getResultStats)(this.props);
		}
	}]);

	return ReactiveComponent;
}(_react.Component);

ReactiveComponent.defaultProps = {
	showFilter: true,
	URLParams: false,
	size: 20
};

ReactiveComponent.propTypes = {
	error: _types2.default.title,
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	aggregationField: _types2.default.string,
	aggregationSize: _types2.default.number,
	size: _types2.default.number,
	aggregations: _types2.default.selectedValues,
	aggregationData: _types2.default.aggregationData,
	hits: _types2.default.data,
	rawData: _types2.default.rawData,
	promotedResults: _types2.default.hits,
	isLoading: _types2.default.bool,
	selectedValue: _types2.default.selectedValue,
	setCustomQuery: _types2.default.funcRequired,
	// component props
	children: _types2.default.func,
	componentId: _types2.default.stringRequired,
	defaultQuery: _types2.default.func,
	customQuery: _types2.default.func,
	defaultValue: _types2.default.any, // eslint-disable-line
	value: _types2.default.any, // eslint-disable-line
	filterLabel: _types2.default.string,
	onQueryChange: _types2.default.func,
	onError: _types2.default.func,
	react: _types2.default.react,
	render: _types2.default.func,
	showFilter: _types2.default.bool,
	URLParams: _types2.default.bool,
	onData: _types2.default.func,
	distinctField: _types2.default.string,
	distinctFieldConfig: _types2.default.componentObject,
	config: _types2.default.props,
	index: _types2.default.string
};

// Add componentType for SSR
ReactiveComponent.componentType = _constants.componentTypes.reactiveComponent;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		aggregations: state.aggregations[props.componentId] && state.aggregations[props.componentId] || null,
		aggregationData: state.compositeAggregations[props.componentId] || [],
		hits: state.hits[props.componentId] && state.hits[props.componentId].hits || [],
		rawData: state.rawData[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		isLoading: state.isLoading[props.componentId],
		error: state.error[props.componentId],
		promotedResults: state.promotedResults[props.componentId] || [],
		time: state.hits[props.componentId] && state.hits[props.componentId].time || 0,
		total: state.hits[props.componentId] && state.hits[props.componentId].total,
		hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
		config: state.config
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
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
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
			internalComponent: !!props.defaultQuery,
			componentType: _constants.componentTypes.reactiveComponent
		}),
		function () {
			return _react2.default.createElement(ReactiveComponent, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});

ForwardRefComponent.displayName = 'ReactiveComponent';
exports.default = ForwardRefComponent;