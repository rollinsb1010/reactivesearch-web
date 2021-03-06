'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('@emotion/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _emotionTheming = require('emotion-theming');

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _Pagination = require('./addons/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _PoweredBy = require('./addons/PoweredBy');

var _PoweredBy2 = _interopRequireDefault(_PoweredBy);

var _Flex = require('../../styles/Flex');

var _Flex2 = _interopRequireDefault(_Flex);

var _results = require('../../styles/results');

var _Card = require('../../styles/Card');

var _ListItem = require('../../styles/ListItem');

var _utils = require('../../utils');

var _Results = require('./addons/Results');

var _Results2 = _interopRequireDefault(_Results);

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var ReactiveList = function (_Component) {
	_inherits(ReactiveList, _Component);

	function ReactiveList(props) {
		_classCallCheck(this, ReactiveList);

		// no support for pagination and aggregationField together
		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		if (props.pagination && props.aggregationField) {
			console.warn('Pagination is not supported when aggregationField is present. The list will be rendered with infinite scroll');
		}

		var currentPage = 0;
		if (_this.props.defaultPage >= 0) {
			currentPage = _this.props.defaultPage;
		} else if (_this.props.currentPage) {
			currentPage = Math.max(_this.props.currentPage - 1, 0);
		}
		_this.initialFrom = currentPage * props.size; // used for page resetting on query change
		_this.shouldRenderPagination = props.pagination && !props.aggregationField;
		_this.state = {
			from: _this.initialFrom,
			currentPage: currentPage
		};
		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);
		_this.sortOptionIndex = _this.props.defaultSortOption ? _this.props.sortOptions.findIndex(function (s) {
			return s.label === _this.props.defaultSortOption;
		}) : 0;
		return _this;
	}

	ReactiveList.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    aggregationField = _props.aggregationField,
		    distinctField = _props.distinctField,
		    distinctFieldConfig = _props.distinctFieldConfig,
		    index = _props.index,
		    enableAppbase = _props.enableAppbase;


		if (enableAppbase && aggregationField) {
			console.warn('Warning(ReactiveSearch): The `aggregationField` prop has been marked as deprecated, please use the `distinctField` prop instead.');
		}
		if (!enableAppbase && (distinctField || distinctFieldConfig)) {
			console.warn('Warning(ReactiveSearch): In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}

		var options = (0, _helper.getQueryOptions)(this.props);
		options.from = this.state.from;
		if (this.props.sortOptions) {
			var _ref;

			var sortField = this.props.sortOptions[this.sortOptionIndex].dataField;
			var sortBy = this.props.sortOptions[this.sortOptionIndex].sortBy;
			options.sort = [(_ref = {}, _ref[sortField] = {
				order: sortBy
			}, _ref)];
			// To handle sort options for RS API
			this.props.updateComponentProps(this.props.componentId, Object.assign({}, this.props, { dataField: sortField }, { sortBy: sortBy }, this.absProps), _constants.componentTypes.reactiveList);
		} else if (this.props.sortBy) {
			var _ref2;

			options.sort = [(_ref2 = {}, _ref2[this.props.dataField] = {
				order: this.props.sortBy
			}, _ref2)];
		}

		// Override sort query with defaultQuery's sort if defined
		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			options = _extends({}, options, (0, _helper.getOptionsFromQuery)(this.defaultQuery));
		}

		var _ref3 = this.defaultQuery || {},
		    query = _ref3.query;

		// execute is set to false at the time of mount
		// to avoid firing (multiple) partial queries.
		// Hence we are building the query in parts here
		// and only executing it with setReact() at core


		var execute = false;

		this.props.setQueryOptions(this.props.componentId, _extends({}, options, this.getAggsQuery()), execute);

		if (this.defaultQuery) {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: query
			}, execute);
			// Update calculated default query in store
			(0, _helper.updateDefaultQuery)(this.props.componentId, this.props);
		} else {
			this.props.updateQuery({
				componentId: this.internalComponent,
				query: null
			}, execute);
		}

		this.domNode = window;
		if (this.showInfiniteScroll) {
			var scrollTarget = this.props.scrollTarget;

			if (typeof scrollTarget === 'string' || scrollTarget instanceof String) {
				this.domNode = document.getElementById(scrollTarget);
			} else if (scrollTarget instanceof Element || scrollTarget instanceof HTMLDocument) {
				this.domNode = scrollTarget;
			}
			this.domNode.addEventListener('scroll', this.scrollHandler);
		}
	};

	ReactiveList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		var totalPages = Math.ceil(this.props.total / this.props.size) || 0;
		if (this.props.onData) {
			(0, _helper.checkSomePropChange)(this.props, prevProps, ['hits', 'promotedResults', 'customData', 'total', 'size', 'time', 'hidden'], function () {
				_this2.props.onData(_this2.getData());
			});
		}
		if (!(0, _helper.isEqual)(this.props.sortOptions, prevProps.sortOptions) || this.props.sortBy !== prevProps.sortBy || this.props.size !== prevProps.size || !(0, _helper.isEqual)(this.props.dataField, prevProps.dataField) || !(0, _helper.isEqual)(this.props.includeFields, prevProps.includeFields) || !(0, _helper.isEqual)(this.props.excludeFields, prevProps.excludeFields)) {
			var options = (0, _helper.getQueryOptions)(this.props);
			options.from = this.state.from;
			if (this.props.sortOptions) {
				var _ref4;

				options.sort = [(_ref4 = {}, _ref4[this.props.sortOptions[this.sortOptionIndex].dataField] = {
					order: this.props.sortOptions[this.sortOptionIndex].sortBy
				}, _ref4)];
			} else if (this.props.sortBy) {
				var _ref5;

				options.sort = [(_ref5 = {}, _ref5[this.props.dataField] = {
					order: this.props.sortBy
				}, _ref5)];
			}
			this.props.setQueryOptions(this.props.componentId, _extends({}, options, this.getAggsQuery()), true);
		}

		if (this.props.defaultQuery && !(0, _helper.isEqual)(this.props.defaultQuery(), this.defaultQuery)) {
			var _options = (0, _helper.getQueryOptions)(this.props);
			_options.from = 0;
			this.defaultQuery = this.props.defaultQuery();
			// Update calculated default query in store
			(0, _helper.updateDefaultQuery)(this.props.componentId, this.props);

			var query = this.defaultQuery.query;


			var queryOptions = (0, _helper.getOptionsFromQuery)(this.defaultQuery);
			if (queryOptions) {
				_options = _extends({}, _options, (0, _helper.getOptionsFromQuery)(this.defaultQuery));
				this.props.setQueryOptions(this.props.componentId, _options, !query);
			}

			this.props.updateQuery({
				componentId: this.internalComponent,
				query: query
			}, true);

			// reset page because of query change
			// eslint-disable-next-line
			this.setState({
				currentPage: 0,
				from: 0
			}, function () {
				_this2.updatePageURL(0);
			});
		}

		if (this.shouldRenderPagination) {
			// called when page is changed
			if (this.props.isLoading && (this.props.hits || prevProps.hits)) {
				if (this.props.onPageChange) {
					this.props.onPageChange(this.state.currentPage + 1, totalPages);
				} else if (this.props.scrollOnChange && this.props.pagination) {
					this.scrollToTop();
				}
			}

			if (this.props.currentPage !== prevProps.currentPage && this.props.currentPage > 0 && this.props.currentPage <= totalPages) {
				this.setPage(this.props.currentPage - 1);
			}
		}

		if (this.showInfiniteScroll) {
			if (this.props.hits && prevProps.hits) {
				if (
				// new items are loaded (from: 0)
				this.props.hits.length < prevProps.hits.length
				// new items are loaded and 'from' hasn't changed
				|| this.props.hits.length === prevProps.hits.length && this.props.hits !== prevProps.hits) {
					// query has changed
					if (this.props.scrollOnChange) {
						this.scrollToTop();
					}
					// eslint-disable-next-line
					this.setState({
						from: 0
					});
				}
			}
		}

		if (prevProps.queryLog && this.props.queryLog && prevProps.queryLog !== this.props.queryLog) {
			// usecase:
			// - query has changed from non-null prev query

			if (this.props.queryLog.from !== this.state.from) {
				// query's 'from' key doesn't match the state's 'from' key,
				// i.e. this query change was not triggered by the page change (loadMore)
				// eslint-disable-next-line
				this.setState({
					currentPage: 0
				}, function () {
					_this2.updatePageURL(0);
				});

				if (this.props.onPageChange) {
					this.props.onPageChange(1, totalPages);
				}
			}
		}

		// handle window url history change (on native back and forth interactions)
		if (this.state.currentPage !== this.props.defaultPage && this.props.defaultPage !== prevProps.defaultPage) {
			this.setPage(this.props.defaultPage >= 0 ? this.props.defaultPage : 0);
		}
	};

	ReactiveList.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.domNode) {
			this.domNode.removeEventListener('scroll', this.scrollHandler);
		}
	};

	// Calculate results


	ReactiveList.prototype.render = function render() {
		var _props2 = this.props,
		    renderItem = _props2.renderItem,
		    size = _props2.size,
		    error = _props2.error,
		    renderPagination = _props2.renderPagination,
		    analytics = _props2.analytics;
		var currentPage = this.state.currentPage;

		var _getAllData = this.getAllData(),
		    filteredResults = _getAllData.filteredResults;

		var paginationProps = {
			pages: this.props.pages,
			totalPages: Math.ceil(this.props.total / size),
			currentPage: this.state.currentPage,
			setPage: this.setPage,
			showEndPage: this.props.showEndPage,
			innerClass: this.props.innerClass,
			fragmentName: this.props.componentId
		};
		var paginationElement = renderPagination ? renderPagination(paginationProps) : (0, _core.jsx)(_Pagination2.default, paginationProps);

		var base = currentPage * size;
		return (0, _core.jsx)(
			'div',
			{ style: this.props.style, className: this.props.className },
			this.props.isLoading && this.shouldRenderPagination && this.props.loader,
			this.renderError(),
			(0, _core.jsx)(
				_Flex2.default,
				{
					labelPosition: this.props.sortOptions ? 'right' : 'left',
					className: (0, _helper.getClassName)(this.props.innerClass, 'resultsInfo')
				},
				this.props.sortOptions ? this.renderSortOptions() : null,
				this.props.showResultStats ? this.renderResultStats() : null
			),
			!this.props.isLoading && !error && filteredResults.length === 0 ? this.renderNoResults() : null,
			this.shouldRenderPagination && ['top', 'both'].indexOf(this.props.paginationAt) !== -1 ? paginationElement : null,
			(0, _core.jsx)(_Results2.default, {
				base: base,
				analytics: analytics,
				hasCustomRender: this.hasCustomRenderer,
				getComponent: this.getComponent,
				listClass: this.props.listClass,
				innerClass: this.props.innerClass,
				renderItem: renderItem,
				triggerClickAnalytics: this.triggerClickAnalytics,
				filteredResults: filteredResults
			}),
			this.props.showLoader && this.props.isLoading && this.showInfiniteScroll ? this.props.loader || (0, _core.jsx)(
				'div',
				{
					style: {
						textAlign: 'center',
						margin: '20px 0',
						color: '#666'
					}
				},
				'Loading...'
			) // prettier-ignore
			: null,
			this.shouldRenderPagination && ['bottom', 'both'].indexOf(this.props.paginationAt) !== -1 ? paginationElement : null,
			(0, _core.jsx)(_PoweredBy2.default, {
				show: !!(this.props.config.url.endsWith('appbase.io') && filteredResults.length),
				innerClass: this.props.innerClass
			})
		);
	};

	_createClass(ReactiveList, [{
		key: 'stats',
		get: function get() {
			var currentPage = this.state.currentPage;

			var _getAllData2 = this.getAllData(),
			    filteredResults = _getAllData2.filteredResults;

			return _extends({}, (0, _helper.getResultStats)(this.props), {
				currentPage: currentPage,
				displayedResults: filteredResults.length
			});
		}
		// Returns the props without default props to apply search relevancy settings for RS API

	}, {
		key: 'absProps',
		get: function get() {
			var _props$originalProps = this.props.originalProps,
			    includeFields = _props$originalProps.includeFields,
			    excludeFields = _props$originalProps.excludeFields,
			    size = _props$originalProps.size;

			return {
				includeFields: includeFields || undefined,
				excludeFields: excludeFields || undefined,
				size: size || undefined
			};
		}
	}, {
		key: 'showInfiniteScroll',
		get: function get() {
			// Pagination has higher priority then infinite scroll
			var infiniteScroll = this.props.infiniteScroll;

			return infiniteScroll && !this.shouldRenderPagination;
		}
	}, {
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}

		// only used for SSR

	}]);

	return ReactiveList;
}(_react.Component);

ReactiveList.ResultCardsWrapper = function (_ref6) {
	var children = _ref6.children,
	    rest = _objectWithoutProperties(_ref6, ['children']);

	return (0, _core.jsx)(
		'div',
		_extends({ css: _Card.container }, rest),
		children
	);
};

ReactiveList.ResultListWrapper = function (_ref7) {
	var children = _ref7.children,
	    rest = _objectWithoutProperties(_ref7, ['children']);

	return (0, _core.jsx)(
		'div',
		_extends({ css: _ListItem.container }, rest),
		children
	);
};

ReactiveList.generateQueryOptions = function (props) {
	// simulate default (includeFields and excludeFields) props to generate consistent query
	var options = (0, _helper.getQueryOptions)(_extends({ includeFields: ['*'], excludeFields: [] }, props));
	var size = props.size,
	    dataField = props.dataField,
	    defaultSortOption = props.defaultSortOption,
	    sortOptionsNew = props.sortOptions,
	    currentPage = props.currentPage,
	    sortBy = props.sortBy;

	options.from = currentPage ? (currentPage - 1) * (size || 10) : 0;
	options.size = size || 10;

	var getSortOption = function getSortOption() {
		var _ref9;

		if (defaultSortOption) {
			var sortOption = sortOptionsNew.find(function (option) {
				return option.label === defaultSortOption;
			});
			if (sortOption) {
				var _ref8;

				return _ref8 = {}, _ref8[sortOption.dataField] = {
					order: sortOption.sortBy
				}, _ref8;
			}
		}
		return _ref9 = {}, _ref9[sortOptionsNew[0].dataField] = {
			order: sortOptionsNew[0].sortBy
		}, _ref9;
	};

	if (sortOptionsNew) {
		options.sort = [getSortOption()];
	} else if (sortBy) {
		var _ref10;

		options.sort = [(_ref10 = {}, _ref10[dataField] = {
			order: sortBy
		}, _ref10)];
	}

	return options;
};

var _initialiseProps = function _initialiseProps() {
	var _this3 = this;

	this.getAggsQuery = function () {
		var _props3 = _this3.props,
		    size = _props3.size,
		    aggregationField = _props3.aggregationField,
		    afterKey = _props3.afterKey;

		var queryOptions = { size: size };
		if (aggregationField) {
			queryOptions.aggs = (0, _helper.getCompositeAggsQuery)({
				props: _this3.props,
				after: afterKey ? { after: afterKey } : null,
				showTopHits: true
			}).aggs;
		}
		return queryOptions;
	};

	this.getAllData = function () {
		var _props4 = _this3.props,
		    size = _props4.size,
		    promotedResults = _props4.promotedResults,
		    aggregationData = _props4.aggregationData,
		    customData = _props4.customData;
		var currentPage = _this3.state.currentPage;

		var results = (0, _helper.parseHits)(_this3.props.hits) || [];
		var parsedPromotedResults = (0, _helper.parseHits)(promotedResults) || [];
		var filteredResults = results;
		var base = currentPage * size;

		if (parsedPromotedResults.length) {
			var ids = parsedPromotedResults.map(function (item) {
				return item._id;
			}).filter(Boolean);
			if (ids) {
				filteredResults = filteredResults.filter(function (item) {
					return !ids.includes(item._id);
				});
			}

			filteredResults = [].concat(parsedPromotedResults, filteredResults);
		}
		return {
			results: results,
			filteredResults: filteredResults,
			promotedResults: parsedPromotedResults,
			customData: customData || {},
			aggregationData: aggregationData || [],
			loadMore: _this3.loadMore,
			base: base,
			triggerClickAnalytics: _this3.triggerClickAnalytics
		};
	};

	this.scrollToTop = function () {
		if (_this3.domNode === window) {
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		} else {
			_this3.domNode.scrollTop = 0;
		}
	};

	this.scrollHandler = function () {
		var renderLoader = window.innerHeight + window.pageYOffset + 300 >= document.body.scrollHeight;
		if (_this3.props.scrollTarget) {
			renderLoader = _this3.domNode.clientHeight + _this3.domNode.scrollTop + 300 >= _this3.domNode.scrollHeight;
		}
		if (!_this3.props.isLoading && renderLoader) {
			_this3.loadMore();
		}
	};

	this.loadMore = function () {
		if (_this3.props.aggregationField && !_this3.props.afterKey) return;
		if (_this3.props.hits && _this3.props.total > _this3.props.hits.length) {
			var value = _this3.state.from + _this3.props.size;
			// If current hits length is less than the current from then it means
			// that there are no results present.
			// It can happen because of many reasons some of them are:
			// 1. Using the `collapse` query to remove results
			// 2. Shard failure
			// In above cases infinite scroll should not load more results that can
			// cause the resetting of the `from` value

			if (_this3.props.hits.length < value) {
				return;
			}
			var options = _extends({}, (0, _helper.getQueryOptions)(_this3.props), _this3.getAggsQuery());
			_this3.setState({
				from: value
			});
			_this3.props.loadMore(_this3.props.componentId, _extends({}, options, {
				from: value
			}), true, !!_this3.props.aggregationField);
		}
	};

	this.setPage = function (page) {
		// onPageClick will be called everytime a pagination button is clicked
		if (page !== _this3.state.currentPage) {
			var onPageClick = _this3.props.onPageClick;

			if (onPageClick) {
				onPageClick(page + 1);
			}
			var value = _this3.props.size * page;
			var options = (0, _helper.getQueryOptions)(_this3.props);
			options.from = _this3.state.from;
			_this3.setState({
				from: value,
				currentPage: page
			}, function () {
				_this3.props.loadMore(_this3.props.componentId, _extends({}, options, {
					from: value
				}), false);

				_this3.updatePageURL(page);
			});
		}
	};

	this.renderResultStats = function () {
		var _props5 = _this3.props,
		    hits = _props5.hits,
		    promotedResults = _props5.promotedResults,
		    total = _props5.total;


		var shouldStatsVisible = hits && promotedResults && (hits.length || promotedResults.length);
		if (_this3.props.renderResultStats && shouldStatsVisible) {
			return _this3.props.renderResultStats(_this3.stats);
		} else if (total) {
			return (0, _core.jsx)(
				'p',
				{ css: _results.resultStats, className: (0, _helper.getClassName)(_this3.props.innerClass, 'resultStats') },
				_this3.props.total,
				' results found in ',
				_this3.props.time,
				'ms'
			);
		}
		return null;
	};

	this.renderNoResults = function () {
		return (0, _core.jsx)(
			'div',
			{ className: (0, _helper.getClassName)(_this3.props.innerClass, 'noResults') || null },
			_this3.props.renderNoResults()
		);
	};

	this.handleSortChange = function (e) {
		var _ref11;

		var index = e.target.value;
		var options = (0, _helper.getQueryOptions)(_this3.props);
		// This fixes issue #371 (where sorting a multi-result page with infinite loader breaks)
		options.from = 0;

		var sortField = _this3.props.sortOptions[index].dataField;
		var sortBy = _this3.props.sortOptions[index].sortBy;
		options.sort = [(_ref11 = {}, _ref11[sortField] = {
			order: sortBy
		}, _ref11)];
		// To handle sortOptions for RS API
		_this3.props.updateComponentProps(_this3.props.componentId, Object.assign({}, _this3.props, { dataField: sortField }, { sortBy: sortBy }, _this3.absProps), _constants.componentTypes.reactiveList);
		_this3.props.setQueryOptions(_this3.props.componentId, options, true);
		_this3.sortOptionIndex = index;

		_this3.setState({
			currentPage: 0,
			from: 0
		}, function () {
			_this3.updatePageURL(0);
		});
	};

	this.updatePageURL = function (page) {
		_this3.props.setPageURL(_this3.props.componentId, page + 1, _this3.props.componentId, false, _this3.props.URLParams);
	};

	this.triggerClickAnalytics = function (searchPosition, documentId) {
		var docId = documentId;
		if (!docId) {
			var _getData = _this3.getData(),
			    data = _getData.data;

			var hitData = data.find(function (hit) {
				return hit._click_id === searchPosition;
			});
			if (hitData && hitData._id) {
				docId = hitData._id;
			}
		}
		_this3.props.triggerAnalytics(searchPosition, docId);
	};

	this.renderSortOptions = function () {
		return (0, _core.jsx)(
			'select',
			{
				css: _results.sortOptions,
				className: (0, _helper.getClassName)(_this3.props.innerClass, 'sortOptions'),
				name: 'sort-options',
				'aria-label': 'Sort options',
				onChange: _this3.handleSortChange,
				value: _this3.sortOptionIndex
			},
			_this3.props.sortOptions.map(function (sort, index) {
				return (0, _core.jsx)(
					'option',
					{ key: sort.label, value: index },
					sort.label
				);
			})
		);
	};

	this.renderError = function () {
		var _props6 = _this3.props,
		    error = _props6.error,
		    isLoading = _props6.isLoading,
		    renderError = _props6.renderError;

		if (renderError && error && !isLoading) {
			return (0, _utils.isFunction)(renderError) ? renderError(error) : renderError;
		}
		return null;
	};

	this.withClickIds = function (results) {
		var _getAllData3 = _this3.getAllData(),
		    base = _getAllData3.base;

		return results.map(function (result, index) {
			return _extends({}, result, {
				_click_id: base + index
			});
		});
	};

	this.getData = function () {
		var _getAllData4 = _this3.getAllData(),
		    filteredResults = _getAllData4.filteredResults,
		    promotedResults = _getAllData4.promotedResults,
		    aggregationData = _getAllData4.aggregationData,
		    customData = _getAllData4.customData;

		return {
			data: _this3.withClickIds(filteredResults),
			aggregationData: _this3.withClickIds(aggregationData || []),
			promotedData: _this3.withClickIds(promotedResults),
			customData: customData,
			rawData: _this3.props.rawData,
			resultStats: _this3.stats
		};
	};

	this.getComponent = function () {
		var _props7 = _this3.props,
		    error = _props7.error,
		    isLoading = _props7.isLoading;

		var data = _extends({
			error: error,
			loading: isLoading,
			loadMore: _this3.loadMore,
			// TODO: Remove in v4
			triggerAnalytics: _this3.triggerClickAnalytics,
			triggerClickAnalytics: _this3.triggerClickAnalytics
		}, _this3.getData());
		return (0, _utils.getComponent)(data, _this3.props);
	};
};

ReactiveList.propTypes = {
	loadMore: _types2.default.funcRequired,
	onQueryChange: _types2.default.func,
	onError: _types2.default.func,
	setPageURL: _types2.default.func,
	setQueryOptions: _types2.default.funcRequired,
	setDefaultQuery: _types2.default.funcRequired,
	updateComponentProps: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	currentPage: _types2.default.number,
	hits: _types2.default.hits,
	rawData: _types2.default.rawData,
	isLoading: _types2.default.bool,
	includeFields: _types2.default.includeFields,
	promotedResults: _types2.default.hits,
	customData: _types2.default.title,
	time: _types2.default.number,
	total: _types2.default.number,
	hidden: _types2.default.number,
	config: _types2.default.props,
	analytics: _types2.default.bool,
	queryLog: _types2.default.props,
	error: _types2.default.title,
	headers: _types2.default.headers,
	enableAppbase: _types2.default.bool,
	// component props
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	children: _types2.default.func,
	dataField: _types2.default.stringRequired,
	aggregationField: _types2.default.string,
	aggregationSize: _types2.default.number,
	aggregationData: _types2.default.aggregationData,
	defaultPage: _types2.default.number,
	defaultQuery: _types2.default.func,
	excludeFields: _types2.default.excludeFields,
	innerClass: _types2.default.style,
	infiniteScroll: _types2.default.bool,
	listClass: _types2.default.string,
	loader: _types2.default.title,
	render: _types2.default.func,
	renderItem: _types2.default.func,
	renderError: _types2.default.title,
	renderPagination: _types2.default.func,
	onData: _types2.default.func,
	renderNoResults: _types2.default.title,
	onPageChange: _types2.default.func,
	onPageClick: _types2.default.func,
	pages: _types2.default.number,
	pagination: _types2.default.bool,
	paginationAt: _types2.default.paginationAt,
	showEndPage: _types2.default.bool,
	react: _types2.default.react,
	renderResultStats: _types2.default.func,
	scrollOnChange: _types2.default.bool,
	scrollTarget: _types2.default.string,
	showLoader: _types2.default.bool,
	showResultStats: _types2.default.bool,
	size: _types2.default.number,
	sortBy: _types2.default.sortBy,
	sortOptions: _types2.default.sortOptions,
	style: _types2.default.style,
	triggerAnalytics: _types2.default.funcRequired,
	URLParams: _types2.default.bool,
	defaultSortOption: _types2.default.string,
	afterKey: _types2.default.props,
	distinctField: _types2.default.string,
	distinctFieldConfig: _types2.default.componentObject,
	// eslint-disable-next-line
	originalProps: _types2.default.any,
	index: _types2.default.string
};

ReactiveList.defaultProps = {
	className: null,
	currentPage: 0,
	listClass: '',
	pages: 5,
	infiniteScroll: true,
	pagination: false,
	analytics: false,
	paginationAt: 'bottom',
	showEndPage: false,
	includeFields: ['*'],
	excludeFields: [],
	showResultStats: true,
	size: 10,
	style: {},
	URLParams: false,
	showLoader: true,
	renderNoResults: function renderNoResults() {
		return 'No Results found.';
	},
	scrollOnChange: true,
	defaultSortOption: null,
	originalProps: {}
};

// Add componentType for SSR
ReactiveList.componentType = _constants.componentTypes.reactiveList;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		defaultPage: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value - 1 || -1,
		hits: state.hits[props.componentId] && state.hits[props.componentId].hits,
		rawData: state.rawData[props.componentId],
		analytics: state.config && state.config.analytics,
		aggregationData: state.compositeAggregations[props.componentId],
		isLoading: state.isLoading[props.componentId] || false,
		time: state.hits[props.componentId] && state.hits[props.componentId].time || 0,
		total: state.hits[props.componentId] && state.hits[props.componentId].total,
		hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
		config: state.config,
		enableAppbase: state.config.enableAppbase,
		queryLog: state.queryLog[props.componentId],
		error: state.error[props.componentId],
		promotedResults: state.promotedResults[props.componentId] || [],
		customData: state.customData[props.componentId],
		afterKey: state.aggregations[props.componentId] && state.aggregations[props.componentId][props.aggregationField] && state.aggregations[props.componentId][props.aggregationField].after_key
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setDefaultQuery: function setDefaultQuery(component, query) {
			return dispatch((0, _actions.setDefaultQuery)(component, query));
		},
		updateComponentProps: function updateComponentProps(component, options, componentType) {
			return dispatch((0, _actions.updateComponentProps)(component, options, componentType));
		},
		loadMore: function loadMore(component, options, append, appendAggs) {
			return dispatch((0, _actions.loadMore)(component, options, append, appendAggs));
		},
		setPageURL: function setPageURL(component, value, label, showFilter, URLParams) {
			return dispatch((0, _actions.setValue)(component, value, label, showFilter, URLParams));
		},
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
		},
		updateQuery: function updateQuery(updateQueryObject, execute) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject, execute));
		},
		triggerAnalytics: function triggerAnalytics(searchPosition, docId) {
			return dispatch((0, _actions.recordResultClick)(searchPosition, docId));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(function (props) {
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({ internalComponent: true, componentType: _constants.componentTypes.reactiveList }, props),
		function () {
			var includeFields = props.includeFields,
			    excludeFields = props.excludeFields,
			    size = props.size;

			return (0, _core.jsx)(ReactiveList, _extends({
				ref: props.myForwardedRef
			}, props, {
				originalProps: {
					includeFields: includeFields, excludeFields: excludeFields, size: size
				}
			}));
		}
	);
}));

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, ReactiveList);

ForwardRefComponent.displayName = 'ReactiveList';
exports.default = ForwardRefComponent;