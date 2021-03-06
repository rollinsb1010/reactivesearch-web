'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = initReactivesearch;

var _appbaseJs = require('appbase-js');

var _appbaseJs2 = _interopRequireDefault(_appbaseJs);

var _valueReducer = require('@rollinsb1010/reactivecore/lib/reducers/valueReducer');

var _valueReducer2 = _interopRequireDefault(_valueReducer);

var _queryReducer = require('@rollinsb1010/reactivecore/lib/reducers/queryReducer');

var _queryReducer2 = _interopRequireDefault(_queryReducer);

var _queryOptionsReducer = require('@rollinsb1010/reactivecore/lib/reducers/queryOptionsReducer');

var _queryOptionsReducer2 = _interopRequireDefault(_queryOptionsReducer);

var _dependencyTreeReducer = require('@rollinsb1010/reactivecore/lib/reducers/dependencyTreeReducer');

var _dependencyTreeReducer2 = _interopRequireDefault(_dependencyTreeReducer);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _graphQL = require('@rollinsb1010/reactivecore/lib/utils/graphQL');

var _graphQL2 = _interopRequireDefault(_graphQL);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _utils = require('@rollinsb1010/reactivecore/lib/actions/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var componentsWithHighlightQuery = [_constants.componentTypes.dataSearch, _constants.componentTypes.categorySearch];

var componentsWithOptions = [_constants.componentTypes.reactiveList, _constants.componentTypes.reactiveMap, _constants.componentTypes.singleList, _constants.componentTypes.multiList, _constants.componentTypes.tagCloud].concat(componentsWithHighlightQuery);

var componentsWithoutFilters = [_constants.componentTypes.numberBox, _constants.componentTypes.ratingsFilter];

var resultComponents = [_constants.componentTypes.reactiveList, _constants.componentTypes.reactiveMap];

function getValue(state, id, defaultValue) {
	if (state && state[id]) {
		try {
			// parsing for next.js - since it uses extra set of quotes to wrap params
			var parsedValue = JSON.parse(state[id]);
			return {
				value: parsedValue,
				reference: 'URL'
			};
		} catch (error) {
			// using react-dom-server for ssr
			return {
				value: state[id],
				reference: 'URL'
			};
		}
	}
	return {
		value: defaultValue,
		reference: 'DEFAULT'
	};
}

function parseValue(value, component) {
	if (component.source && component.source.parseValue) {
		return component.source.parseValue(value, component);
	}
	return value;
}

function getQuery(component, value, componentType) {
	// get default query of result components
	if (resultComponents.includes(componentType)) {
		return component.defaultQuery ? component.defaultQuery() : {};
	}

	// get custom or default query of sensor components
	var currentValue = parseValue(value, component);
	if (component.customQuery) {
		var customQuery = component.customQuery(currentValue, component);
		return customQuery && customQuery.query;
	}
	return component.source.defaultQuery ? component.source.defaultQuery(currentValue, component) : {};
}

function initReactivesearch(componentCollection, searchState, settings) {
	return new Promise(function (resolve, reject) {
		var credentials = settings.url && settings.url.trim() !== '' && !settings.credentials ? null : settings.credentials;
		var config = {
			url: settings.url && settings.url.trim() !== '' ? settings.url : 'https://scalr.api.appbase.io',
			app: settings.app,
			credentials: credentials,
			transformRequest: settings.transformRequest || null,
			type: settings.type ? settings.type : '*',
			transformResponse: settings.transformResponse || null,
			graphQLUrl: settings.graphQLUrl || '',
			headers: settings.headers || {},
			analyticsConfig: settings.appbaseConfig || null
		};
		var appbaseRef = (0, _appbaseJs2.default)(config);

		var components = [];
		var selectedValues = {};
		var internalValues = {};
		var queryList = {};
		var queryLog = {};
		var queryOptions = {};
		var dependencyTree = {};
		var finalQuery = [];
		var appbaseQuery = {}; // Use object to prevent duplicate query added by react prop
		var orderOfQueries = [];
		var hits = {};
		var aggregations = {};
		var state = {};
		var customQueries = {};
		var defaultQueries = {};
		var componentProps = {};

		componentCollection.forEach(function (component) {
			var componentType = component.source.componentType;

			components = [].concat(components, [component.componentId]);
			// Set component props
			var compProps = {};
			Object.keys(component).forEach(function (key) {
				if (_constants.validProps.includes(key)) {
					compProps[key] = component[key];
				}
			});
			var isInternalComponentPresent = false;
			// Set custom and default queries
			if (component.customQuery && typeof component.customQuery === 'function') {
				customQueries[component.componentId] = component.customQuery(component.value, compProps);
			}
			if (component.defaultQuery && typeof component.defaultQuery === 'function') {
				defaultQueries[component.componentId] = component.defaultQuery(component.value, compProps);
			}
			var isResultComponent = resultComponents.includes(componentType);
			var internalComponent = component.componentId + '__internal';
			var label = component.filterLabel || component.componentId;

			var _getValue = getValue(searchState, component.componentId, component.value || component.defaultValue),
			    value = _getValue.value,
			    reference = _getValue.reference;

			// [1] set selected values


			var showFilter = component.showFilter !== undefined ? component.showFilter : true;
			if (componentsWithoutFilters.includes(componentType)) {
				showFilter = false;
			}

			selectedValues = (0, _valueReducer2.default)(selectedValues, {
				type: 'SET_VALUE',
				component: component.componentId,
				label: label,
				value: value,
				reference: reference,
				showFilter: showFilter,
				URLParams: component.URLParams || false
			});

			// [2] set query options - main component query (valid for result components)
			if (componentsWithOptions.includes(componentType)) {
				var options = component.source.generateQueryOptions ? component.source.generateQueryOptions(component) : null;
				var highlightQuery = {};

				if (componentsWithHighlightQuery.includes(componentType) && component.highlight) {
					highlightQuery = component.source.highlightQuery(component);
				}

				if (options && Object.keys(options).length || highlightQuery && Object.keys(highlightQuery).length) {
					// eslint-disable-next-line
					var _ref = options || {},
					    aggs = _ref.aggs,
					    size = _ref.size,
					    otherQueryOptions = _objectWithoutProperties(_ref, ['aggs', 'size']);

					if (aggs && Object.keys(aggs).length) {
						isInternalComponentPresent = true;

						// query should be applied on the internal component
						// to enable feeding the data to parent component
						queryOptions = (0, _queryOptionsReducer2.default)(queryOptions, {
							type: 'SET_QUERY_OPTIONS',
							component: internalComponent,
							options: { aggs: aggs, size: typeof size === 'undefined' ? 100 : size }
						});
					}

					// sort, highlight, size, from - query should be applied on the main component
					if (otherQueryOptions && Object.keys(otherQueryOptions).length || highlightQuery && Object.keys(highlightQuery).length) {
						if (!otherQueryOptions) otherQueryOptions = {};
						if (!highlightQuery) highlightQuery = {};

						var mainQueryOptions = _extends({}, otherQueryOptions, highlightQuery, { size: size });
						if (isInternalComponentPresent) {
							mainQueryOptions = _extends({}, otherQueryOptions, highlightQuery);
						}
						if (isResultComponent) {
							var currentPage = component.currentPage ? component.currentPage - 1 : 0;
							if (selectedValues[component.componentId] && selectedValues[component.componentId].value) {
								currentPage = selectedValues[component.componentId].value - 1 || 0;
							}
							var resultSize = component.size || 10;
							var from = currentPage * resultSize;
							// Update props for RS API
							compProps.from = from;
							mainQueryOptions = _extends({}, mainQueryOptions, highlightQuery, {
								size: resultSize,
								from: from
							});
						}
						queryOptions = (0, _queryOptionsReducer2.default)(queryOptions, {
							type: 'SET_QUERY_OPTIONS',
							component: component.componentId,
							options: _extends({}, mainQueryOptions)
						});
					}
				}
			}

			// [3] set dependency tree
			if (component.react || isInternalComponentPresent || isResultComponent) {
				var react = component.react;

				if (isInternalComponentPresent || isResultComponent) {
					react = (0, _helper.pushToAndClause)(react, internalComponent);
				}

				dependencyTree = (0, _dependencyTreeReducer2.default)(dependencyTree, {
					type: 'WATCH_COMPONENT',
					component: component.componentId,
					react: react
				});
			}

			// [4] set query list
			if (isResultComponent) {
				var _getQuery = getQuery(component, null, componentType),
				    query = _getQuery.query;

				queryList = (0, _queryReducer2.default)(queryList, {
					type: 'SET_QUERY',
					component: internalComponent,
					query: query
				});
			} else {
				queryList = (0, _queryReducer2.default)(queryList, {
					type: 'SET_QUERY',
					component: component.componentId,
					query: getQuery(component, value, componentType)
				});
			}
			// Set component type in component props
			compProps.componentType = componentType;
			componentProps[component.componentId] = compProps;
		});

		state = {
			components: components,
			dependencyTree: dependencyTree,
			queryList: queryList,
			queryOptions: queryOptions,
			selectedValues: selectedValues,
			internalValues: internalValues,
			props: componentProps,
			customQueries: customQueries,
			defaultQueries: defaultQueries
		};

		// [5] Generate finalQuery for search
		componentCollection.forEach(function (component) {
			// eslint-disable-next-line
			var _buildQuery = (0, _helper.buildQuery)(component.componentId, dependencyTree, queryList, queryOptions),
			    queryObj = _buildQuery.queryObj,
			    options = _buildQuery.options;

			var validOptions = ['aggs', 'from', 'sort'];
			// check if query or options are valid - non-empty
			if (queryObj && !!Object.keys(queryObj).length || options && Object.keys(options).some(function (item) {
				return validOptions.includes(item);
			})) {
				var _extends2;

				if (!queryObj || queryObj && !Object.keys(queryObj).length) {
					queryObj = { match_all: {} };
				}

				orderOfQueries = [].concat(orderOfQueries, [component.componentId]);

				var currentQuery = _extends({
					query: _extends({}, queryObj)
				}, options, queryOptions[component.componentId]);

				queryLog = _extends({}, queryLog, (_extends2 = {}, _extends2[component.componentId] = currentQuery, _extends2));

				if (settings.enableAppbase) {
					var query = (0, _transform.getRSQuery)(component.componentId, (0, _transform.extractPropsFromState)(state, component.componentId, queryOptions && queryOptions[component.componentId] ? { from: queryOptions[component.componentId].from } : null));
					if (query) {
						var _extends3;

						// Apply dependent queries
						appbaseQuery = _extends({}, appbaseQuery, (_extends3 = {}, _extends3[component.componentId] = query, _extends3), (0, _transform.getDependentQueries)(state, component.componentId, orderOfQueries));
					}
				} else {
					finalQuery = [].concat(finalQuery, [{
						preference: component.componentId
					}, currentQuery]);
				}
			}
		});

		state.queryLog = queryLog;

		var handleTransformResponse = function handleTransformResponse(res, component) {
			if (config.transformResponse && typeof config.transformResponse === 'function') {
				return config.transformResponse(res, component);
			}
			return new Promise(function (resolveTransformResponse) {
				return resolveTransformResponse(res);
			});
		};

		var handleResponse = function handleResponse(res) {
			var allPromises = orderOfQueries.map(function (component, index) {
				return new Promise(function (responseResolve, responseReject) {
					handleTransformResponse(res.responses[index], component).then(function (response) {
						var _extends5;

						if (response.aggregations) {
							var _extends4;

							aggregations = _extends({}, aggregations, (_extends4 = {}, _extends4[component] = response.aggregations, _extends4));
						}
						hits = _extends({}, hits, (_extends5 = {}, _extends5[component] = {
							hits: response.hits.hits,
							total: _typeof(response.hits.total) === 'object' ? response.hits.total.value : response.hits.total,
							time: response.took
						}, _extends5));
						responseResolve();
					}).catch(function (err) {
						return responseReject(err);
					});
				});
			});

			Promise.all(allPromises).then(function () {
				state = _extends({}, state, {
					hits: hits,
					aggregations: aggregations
				});
				resolve(state);
			});
		};

		var handleRSResponse = function handleRSResponse(res) {
			var promotedResults = {};
			var rawData = {};
			var customData = {};
			var allPromises = orderOfQueries.map(function (component) {
				return new Promise(function (responseResolve, responseReject) {
					handleTransformResponse(res[component], component).then(function (response) {
						if (response) {
							var _extends7;

							if (response.promoted) {
								promotedResults[component] = response.promoted.map(function (promoted) {
									return _extends({}, promoted.doc, {
										_position: promoted.position
									});
								});
							}
							rawData[component] = response;
							// Update custom data
							if (response.customData) {
								customData[component] = response.customData;
							}

							if (response.aggregations) {
								var _extends6;

								aggregations = _extends({}, aggregations, (_extends6 = {}, _extends6[component] = response.aggregations, _extends6));
							}
							hits = _extends({}, hits, (_extends7 = {}, _extends7[component] = {
								hits: response.hits.hits,
								total: _typeof(response.hits.total) === 'object' ? response.hits.total.value : response.hits.total,
								time: response.took
							}, _extends7));
							responseResolve();
						}
					}).catch(function (err) {
						return responseReject(err);
					});
				});
			});

			Promise.all(allPromises).then(function () {
				state = _extends({}, state, {
					hits: hits,
					aggregations: aggregations,
					promotedResults: promotedResults,
					customData: customData,
					rawData: rawData
				});
				resolve(state);
			});
		};

		if (config.graphQLUrl) {
			var handleTransformRequest = function handleTransformRequest(res) {
				if (config.transformRequest && typeof config.transformRequest === 'function') {
					var transformRequestPromise = config.transformRequest(res);
					return transformRequestPromise instanceof Promise ? transformRequestPromise : Promise.resolve(transformRequestPromise);
				}
				return Promise.resolve(res);
			};
			handleTransformRequest(finalQuery).then(function (requestQuery) {
				(0, _graphQL2.default)(config.graphQLUrl, config.url, config.credentials, config.app, requestQuery).then(function (res) {
					handleResponse(res);
				}).catch(function (err) {
					return reject(err);
				});
			}).catch(function (err) {
				return reject(err);
			});
		} else if (settings.enableAppbase && Object.keys(appbaseQuery).length) {
			finalQuery = Object.keys(appbaseQuery).map(function (c) {
				return appbaseQuery[c];
			});
			// Call RS API
			var rsAPISettings = {};
			if (config.analyticsConfig) {
				rsAPISettings.recordAnalytics = (0, _utils.isPropertyDefined)(config.analyticsConfig.recordAnalytics) ? config.analyticsConfig.recordAnalytics : undefined;
				rsAPISettings.userId = (0, _utils.isPropertyDefined)(config.analyticsConfig.userId) ? config.analyticsConfig.userId : undefined;
				rsAPISettings.enableQueryRules = (0, _utils.isPropertyDefined)(config.analyticsConfig.enableQueryRules) ? config.analyticsConfig.enableQueryRules : undefined;
				rsAPISettings.customEvents = (0, _utils.isPropertyDefined)(config.analyticsConfig.customEvents) ? config.analyticsConfig.customEvents : undefined;
			}
			appbaseRef.reactiveSearchv3(finalQuery, rsAPISettings).then(function (res) {
				handleRSResponse(res);
			}).catch(function (err) {
				return reject(err);
			});
		} else {
			appbaseRef.msearch({
				type: config.type === '*' ? '' : config.type,
				body: finalQuery
			}).then(function (res) {
				handleResponse(res);
			}).catch(function (err) {
				return reject(err);
			});
		}
	});
}