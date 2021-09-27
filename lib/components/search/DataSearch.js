'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('@emotion/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _downshift = require('downshift');

var _downshift2 = _interopRequireDefault(_downshift);

var _emotionTheming = require('emotion-theming');

var _actions = require('@appbaseio/reactivecore/lib/actions');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _helper = require('@appbaseio/reactivecore/lib/utils/helper');

var _transform = require('@appbaseio/reactivecore/lib/utils/transform');

var _constants = require('@appbaseio/reactivecore/lib/utils/constants');

var _hotkeysJs = require('hotkeys-js');

var _hotkeysJs2 = _interopRequireDefault(_hotkeysJs);

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _causes = require('@appbaseio/reactivecore/lib/utils/causes');

var _causes2 = _interopRequireDefault(_causes);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Input = require('../../styles/Input');

var _Input2 = _interopRequireDefault(_Input);

var _SearchSvg = require('../shared/SearchSvg');

var _SearchSvg2 = _interopRequireDefault(_SearchSvg);

var _CancelSvg = require('../shared/CancelSvg');

var _CancelSvg2 = _interopRequireDefault(_CancelSvg);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _CustomSvg = require('../shared/CustomSvg');

var _CustomSvg2 = _interopRequireDefault(_CustomSvg);

var _utils = require('../../utils');

var _SuggestionItem = require('./addons/SuggestionItem');

var _SuggestionItem2 = _interopRequireDefault(_SuggestionItem);

var _SuggestionWrapper = require('./addons/SuggestionWrapper');

var _SuggestionWrapper2 = _interopRequireDefault(_SuggestionWrapper);

var _Mic = require('./addons/Mic');

var _Mic2 = _interopRequireDefault(_Mic);

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

var _InputGroup = require('../../styles/InputGroup');

var _InputGroup2 = _interopRequireDefault(_InputGroup);

var _InputWrapper = require('../../styles/InputWrapper');

var _InputWrapper2 = _interopRequireDefault(_InputWrapper);

var _InputAddon = require('../../styles/InputAddon');

var _InputAddon2 = _interopRequireDefault(_InputAddon);

var _IconGroup = require('../../styles/IconGroup');

var _IconGroup2 = _interopRequireDefault(_IconGroup);

var _IconWrapper = require('../../styles/IconWrapper');

var _IconWrapper2 = _interopRequireDefault(_IconWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var DataSearch = function (_Component) {
	_inherits(DataSearch, _Component);

	function DataSearch(props) {
		_classCallCheck(this, DataSearch);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var currentValue = props.selectedValue || props.value || props.defaultValue || '';

		_this.state = {
			currentValue: currentValue,
			suggestions: [],
			isOpen: false
		};
		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);
		/**
   * To regulate the query execution based on the input handler,
   * the component query will only get executed when it sets to `true`.
   * */
		_this.isPending = false;
		_this.queryOptions = _this.getBasicQueryOptions();
		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		(0, _helper.updateDefaultQuery)(props.componentId, props, currentValue);
		if (props.highlight) {
			var queryOptions = DataSearch.highlightQuery(props) || {};
			if (props.customHighlight && typeof props.customHighlight === 'function') {
				props.setCustomHighlightOptions(props.componentId, props.customHighlight(props));
			}
			_this.queryOptions = _extends({}, queryOptions, _this.getBasicQueryOptions());
			props.setQueryOptions(props.componentId, queryOptions);
		} else {
			props.setQueryOptions(props.componentId, _this.queryOptions);
		}

		var hasMounted = false;
		var cause = null;

		if (currentValue) {
			if (props.onChange) {
				props.onChange(currentValue, _this.triggerQuery);
			}
			_this.setValue(currentValue, true, props, cause, hasMounted);
		}
		return _this;
	}

	DataSearch.prototype.componentDidMount = function componentDidMount() {
		// register hotkeys for listening to focusShortcuts' key presses
		this.listenForFocusShortcuts();
		var _props = this.props,
		    enableQuerySuggestions = _props.enableQuerySuggestions,
		    renderQuerySuggestions = _props.renderQuerySuggestions,
		    fetchPopularSuggestions = _props.fetchPopularSuggestions,
		    enableRecentSearches = _props.enableRecentSearches,
		    fetchRecentSearches = _props.fetchRecentSearches,
		    componentId = _props.componentId,
		    aggregationField = _props.aggregationField,
		    distinctField = _props.distinctField,
		    distinctFieldConfig = _props.distinctFieldConfig,
		    index = _props.index,
		    enableAppbase = _props.enableAppbase;

		// TODO: Remove in 4.0

		if (enableQuerySuggestions !== undefined) {
			console.warn('Warning(ReactiveSearch): The `enableQuerySuggestions` prop has been marked as deprecated, please use the `enablePopularSuggestions` prop instead.');
		}
		// TODO: Remove in 4.0
		if (renderQuerySuggestions !== undefined) {
			console.warn('Warning(ReactiveSearch): The `renderQuerySuggestions` prop has been marked as deprecated, please use the `renderPopularSuggestions` prop instead.');
		}
		if (enableAppbase && aggregationField) {
			console.warn('Warning(ReactiveSearch): The `aggregationField` prop has been marked as deprecated, please use the `distinctField` prop instead.');
		}
		if (!enableAppbase && (distinctField || distinctFieldConfig)) {
			console.warn('Warning(ReactiveSearch): In order to use the `distinctField` and `distinctFieldConfig` props, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
		fetchPopularSuggestions(componentId);
		if (enableRecentSearches) {
			fetchRecentSearches();
		}
	};

	DataSearch.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['highlight', 'dataField', 'highlightField', 'aggregationField'], function () {
			var queryOptions = DataSearch.highlightQuery(_this2.props) || {};
			if (_this2.props.customHighlight && typeof _this2.props.customHighlight === 'function') {
				_this2.props.setCustomHighlightOptions(_this2.props.componentId, _this2.props.customHighlight(_this2.props));
			}
			_this2.queryOptions = _extends({}, queryOptions, _this2.getBasicQueryOptions());
			_this2.props.setQueryOptions(_this2.props.componentId, queryOptions);
		});
		// Treat defaultQuery and customQuery as reactive props
		if (!(0, _utils.isQueryIdentical)(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery(this.state.currentValue, this.props);
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (!(0, _utils.isQueryIdentical)(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (Array.isArray(this.props.suggestions) && this.state.currentValue.trim().length) {
			// shallow check allows us to set suggestions even if the next set
			// of suggestions are same as the current one
			if (this.props.suggestions !== prevProps.suggestions) {
				if (this.props.onSuggestions) {
					this.props.onSuggestions(this.props.suggestions);
				}
				// eslint-disable-next-line
				this.setState({
					suggestions: this.onSuggestions(this.props.suggestions)
				});
			}
		}

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['fieldWeights', 'fuzziness', 'queryFormat', 'dataField', 'nestedField', 'searchOperators'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});
		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value, true, this.props, undefined, undefined, false);
		} else if (
		// since, selectedValue will be updated when currentValue changes,
		// we must only check for the changes introduced by
		// clear action from SelectedFilters component in which case,
		// the currentValue will never match the updated selectedValue
		this.props.selectedValue !== prevProps.selectedValue && this.state.currentValue !== this.props.selectedValue) {
			var _props2 = this.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (!this.props.selectedValue && this.state.currentValue) {
				// selected value is cleared, call onValueSelected
				this.onValueSelected('', _causes2.default.CLEAR_VALUE, null);
			}
			if (value === undefined) {
				this.setValue(this.props.selectedValue || '', true, this.props);
			} else if (onChange) {
				// value prop exists
				onChange(this.props.selectedValue || '', this.triggerQuery);
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				this.isPending = false;
				this.setValue(this.state.currentValue, true, this.props);
			}
		}
	};

	DataSearch.prototype.componentWillUnmount = function componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeyDown);
	};

	// returns size and aggs property


	DataSearch.prototype.shouldMicRender = function shouldMicRender(showVoiceSearch) {
		// checks for SSR
		if (typeof window === 'undefined') return false;
		return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
	};

	DataSearch.prototype.render = function render() {
		var _this3 = this;

		var currentValue = this.state.currentValue;

		var suggestionsList = this.parsedSuggestions;
		var _props3 = this.props,
		    theme = _props3.theme,
		    themePreset = _props3.themePreset,
		    size = _props3.size,
		    recentSearchesIcon = _props3.recentSearchesIcon,
		    popularSearchesIcon = _props3.popularSearchesIcon;

		var hasSuggestions = currentValue ? suggestionsList.length || this.topSuggestions.length : this.defaultSuggestions.length;
		return (0, _core.jsx)(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.props.defaultSuggestions || this.props.autosuggest ? (0, _core.jsx)(_downshift2.default, _extends({
				id: this.props.componentId + '-downshift',
				onChange: this.onSuggestionSelected,
				onStateChange: this.handleStateChange,
				isOpen: this.state.isOpen,
				itemToString: function itemToString(i) {
					return i;
				},
				render: function render(_ref) {
					var getRootProps = _ref.getRootProps,
					    getInputProps = _ref.getInputProps,
					    getItemProps = _ref.getItemProps,
					    isOpen = _ref.isOpen,
					    highlightedIndex = _ref.highlightedIndex,
					    setHighlightedIndex = _ref.setHighlightedIndex,
					    rest = _objectWithoutProperties(_ref, ['getRootProps', 'getInputProps', 'getItemProps', 'isOpen', 'highlightedIndex', 'setHighlightedIndex']);

					var renderSuggestionsDropdown = function renderSuggestionsDropdown() {
						return (0, _core.jsx)(
							_react2.default.Fragment,
							null,
							_this3.hasCustomRenderer && _this3.getComponent(_extends({
								getInputProps: getInputProps,
								getItemProps: getItemProps,
								isOpen: isOpen,
								highlightedIndex: highlightedIndex,
								setHighlightedIndex: setHighlightedIndex
							}, rest)),
							isOpen && _this3.renderLoader(),
							isOpen && _this3.renderError(),
							!_this3.hasCustomRenderer && isOpen && hasSuggestions ? (0, _core.jsx)(
								'ul',
								{
									css: (0, _Input.suggestions)(themePreset, theme),
									className: (0, _helper.getClassName)(_this3.props.innerClass, 'list')
								},
								suggestionsList.slice(0, size).map(function (item, index) {
									return (0, _core.jsx)(
										'li',
										_extends({}, getItemProps({ item: item }), {
											key: index + 1 + '-' + item.value,
											style: {
												backgroundColor: _this3.getBackgroundColor(highlightedIndex, index)
											}
										}),
										(0, _core.jsx)(_SuggestionItem2.default, {
											currentValue: currentValue,
											suggestion: item
										})
									);
								}),
								_this3.defaultSuggestions.map(function (sugg, index) {
									return (0, _core.jsx)(
										'li',
										_extends({}, getItemProps({ item: sugg }), {
											key: suggestionsList.length + index + 1 + '-' + sugg.value,
											style: {
												backgroundColor: _this3.getBackgroundColor(highlightedIndex, suggestionsList.length + index),
												justifyContent: 'flex-start'
											}
										}),
										(0, _core.jsx)(
											'div',
											{ style: { padding: '0 10px 0 0' } },
											sugg.source && sugg.source._recent_search && (0, _core.jsx)(_CustomSvg2.default, {
												iconId: sugg.label + '-icon',
												className: (0, _helper.getClassName)(_this3.props.innerClass, 'recent-search-icon') || null,
												icon: recentSearchesIcon,
												type: 'recent-search-icon'
											}),
											sugg.source && sugg.source._popular_suggestion && (0, _core.jsx)(_CustomSvg2.default, {
												iconId: sugg.label + '-icon',
												className: (0, _helper.getClassName)(_this3.props.innerClass, 'popular-search-icon') || null,
												icon: popularSearchesIcon,
												type: 'popular-search-icon'
											})
										),
										(0, _core.jsx)(_SuggestionItem2.default, {
											currentValue: currentValue,
											suggestion: sugg
										})
									);
								}),
								(0, _utils.hasPopularSuggestionsRenderer)(_this3.props) ? _this3.getComponent(_extends({
									getInputProps: getInputProps,
									getItemProps: getItemProps,
									isOpen: isOpen,
									highlightedIndex: highlightedIndex
								}, rest), true) : _this3.topSuggestions.map(function (sugg, index) {
									return (0, _core.jsx)(
										'li',
										_extends({}, getItemProps({ item: sugg }), {
											key: suggestionsList.length + index + 1 + '-' + sugg.value,
											style: {
												backgroundColor: _this3.getBackgroundColor(highlightedIndex, suggestionsList.length + index),
												justifyContent: 'flex-start'
											}
										}),
										(0, _core.jsx)(
											'div',
											{ style: { padding: '0 10px 0 0' } },
											(0, _core.jsx)(_CustomSvg2.default, {
												iconId: sugg.label + '-icon',
												className: (0, _helper.getClassName)(_this3.props.innerClass, 'popular-search-icon') || null,
												icon: popularSearchesIcon,
												type: 'popular-search-icon'
											})
										),
										(0, _core.jsx)(_SuggestionItem2.default, {
											currentValue: currentValue,
											suggestion: sugg
										})
									);
								})
							) : _this3.renderNoSuggestion(suggestionsList)
						);
					};

					return (0, _core.jsx)(
						'div',
						getRootProps({ css: _Input.suggestionsContainer }, { suppressRefError: true }),
						(0, _core.jsx)(
							_InputGroup2.default,
							null,
							_this3.renderInputAddonBefore(),
							(0, _core.jsx)(
								_InputWrapper2.default,
								null,
								(0, _core.jsx)(_Input2.default, _extends({
									'aria-label': _this3.props.componentId,
									id: _this3.props.componentId + '-input',
									showIcon: _this3.props.showIcon,
									showClear: _this3.props.showClear,
									iconPosition: _this3.props.iconPosition,
									ref: function ref(c) {
										_this3._inputRef = c;
									}
								}, getInputProps({
									className: (0, _helper.getClassName)(_this3.props.innerClass, 'input'),
									placeholder: _this3.props.placeholder,
									value: _this3.state.currentValue === null ? '' : _this3.state.currentValue,
									onChange: _this3.onInputChange,
									onBlur: _this3.withTriggerQuery(_this3.props.onBlur),
									onFocus: _this3.handleFocus,
									onClick: function onClick() {
										// clear highlighted index
										setHighlightedIndex(null);
									},
									onKeyPress: _this3.withTriggerQuery(_this3.props.onKeyPress),
									onKeyDown: function onKeyDown(e) {
										return _this3.handleKeyDown(e, highlightedIndex);
									},
									onKeyUp: _this3.withTriggerQuery(_this3.props.onKeyUp),
									autoFocus: _this3.props.autoFocus
								}), {
									themePreset: themePreset,
									type: _this3.props.type
								})),
								_this3.renderIcons(),
								!_this3.props.expandSuggestionsContainer && renderSuggestionsDropdown.apply(undefined, [getRootProps, getInputProps, getItemProps, isOpen, highlightedIndex, setHighlightedIndex].concat(rest))
							),
							_this3.renderInputAddonAfter()
						),
						_this3.props.expandSuggestionsContainer && renderSuggestionsDropdown.apply(undefined, [getRootProps, getInputProps, getItemProps, isOpen, highlightedIndex, setHighlightedIndex].concat(rest))
					);
				}
			}, this.props.downShiftProps)) : (0, _core.jsx)(
				'div',
				{ css: _Input.suggestionsContainer },
				(0, _core.jsx)(
					_InputGroup2.default,
					null,
					this.renderInputAddonBefore(),
					(0, _core.jsx)(
						_InputWrapper2.default,
						null,
						(0, _core.jsx)(_Input2.default, {
							'aria-label': this.props.componentId,
							className: (0, _helper.getClassName)(this.props.innerClass, 'input') || null,
							placeholder: this.props.placeholder,
							value: this.state.currentValue ? this.state.currentValue : '',
							onChange: this.onInputChange,
							onBlur: this.withTriggerQuery(this.props.onBlur),
							onFocus: this.withTriggerQuery(this.props.onFocus),
							onKeyPress: this.withTriggerQuery(this.props.onKeyPress),
							onKeyDown: this.withTriggerQuery(this.props.onKeyDown),
							onKeyUp: this.withTriggerQuery(this.props.onKeyUp),
							autoFocus: this.props.autoFocus,
							iconPosition: this.props.iconPosition,
							showIcon: this.props.showIcon,
							showClear: this.props.showClear,
							themePreset: themePreset
						}),
						this.renderIcons()
					),
					this.renderInputAddonAfter()
				)
			)
		);
	};

	_createClass(DataSearch, [{
		key: 'stats',
		get: function get() {
			return (0, _helper.getResultStats)(this.props);
		}
	}, {
		key: 'parsedSuggestions',
		get: function get() {
			var suggestionsList = [];
			var currentValue = this.state.currentValue;
			var defaultSuggestions = this.props.defaultSuggestions;

			if (!currentValue && defaultSuggestions && defaultSuggestions.length) {
				suggestionsList = defaultSuggestions;
			} else if (currentValue) {
				suggestionsList = this.state.suggestions;
			}
			return (0, _helper.withClickIds)(suggestionsList);
		}
	}, {
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}, {
		key: 'topSuggestions',
		get: function get() {
			var _props4 = this.props,
			    enableQuerySuggestions = _props4.enableQuerySuggestions,
			    enablePopularSuggestions = _props4.enablePopularSuggestions;
			var currentValue = this.state.currentValue;

			if (!currentValue) {
				return [];
			}
			return enableQuerySuggestions || enablePopularSuggestions ? this.normalizedPopularSuggestions : [];
		}
	}, {
		key: 'normalizedRecentSearches',
		get: function get() {
			var recentSearches = this.props.recentSearches;

			return recentSearches || [];
		}
	}, {
		key: 'normalizedPopularSuggestions',
		get: function get() {
			var _props5 = this.props,
			    popularSuggestions = _props5.popularSuggestions,
			    showDistinctSuggestions = _props5.showDistinctSuggestions,
			    defaultPopularSuggestions = _props5.defaultPopularSuggestions;
			var currentValue = this.state.currentValue;

			return (0, _helper.getTopSuggestions)(
			// use default popular suggestions if value is empty
			currentValue ? popularSuggestions : defaultPopularSuggestions, currentValue, showDistinctSuggestions);
		}
	}, {
		key: 'defaultSuggestions',
		get: function get() {
			var _props6 = this.props,
			    enableQuerySuggestions = _props6.enableQuerySuggestions,
			    enablePopularSuggestions = _props6.enablePopularSuggestions,
			    showDistinctSuggestions = _props6.showDistinctSuggestions,
			    defaultPopularSuggestions = _props6.defaultPopularSuggestions;

			var isPopularSuggestionsEnabled = enableQuerySuggestions || enablePopularSuggestions;
			var currentValue = this.state.currentValue;

			if (currentValue) {
				return [];
			}
			var customDefaultPopularSuggestions = defaultPopularSuggestions.map(function (suggestion) {
				return _extends({}, suggestion, {
					_popular_suggestion: true
				});
			});
			var customNormalizedRecentSearches = this.normalizedRecentSearches.map(function (search) {
				return _extends({}, search, {
					_recent_search: true
				});
			});
			var defaultSuggestions = isPopularSuggestionsEnabled ? [].concat(customNormalizedRecentSearches, customDefaultPopularSuggestions) : customNormalizedRecentSearches;

			return (0, _helper.getTopSuggestions)(
			// use default popular suggestions if value is empty
			defaultSuggestions, currentValue, showDistinctSuggestions);
		}
	}]);

	return DataSearch;
}(_react.Component);

DataSearch.highlightQuery = function (props) {
	if (props.customHighlight) {
		return props.customHighlight(props);
	}
	if (!props.highlight) {
		return null;
	}
	var fields = {};
	var normalizedDataField = (0, _helper.normalizeDataField)(props.dataField).map(function (dataField) {
		return dataField.field;
	});
	var highlightField = props.highlightField ? props.highlightField : normalizedDataField;

	if (typeof highlightField === 'string') {
		fields[highlightField] = {};
	} else if (Array.isArray(highlightField)) {
		highlightField.forEach(function (item) {
			fields[item] = {};
		});
	}

	return {
		highlight: _extends({
			pre_tags: ['<mark>'],
			post_tags: ['</mark>'],
			fields: fields
		}, props.highlightField && { require_field_match: false })
	};
};

DataSearch.defaultQuery = function (value, props) {
	var finalQuery = null;

	if (value) {
		var fields = (0, _helper.normalizeDataField)(props.dataField, props.fieldWeights);

		if (props.queryString) {
			finalQuery = {
				query_string: DataSearch.shouldQuery(value, fields, props)
			};
		} else if (props.searchOperators) {
			finalQuery = {
				simple_query_string: DataSearch.shouldQuery(value, fields, props)
			};
		} else {
			finalQuery = {
				bool: {
					should: DataSearch.shouldQuery(value, fields, props),
					minimum_should_match: '1'
				}
			};
		}
	}

	if (value === '') {
		finalQuery = null;
	}

	if (finalQuery && props.nestedField) {
		finalQuery = {
			nested: {
				path: props.nestedField,
				query: finalQuery
			}
		};
	}
	return finalQuery;
};

DataSearch.shouldQuery = function (value, dataFields, props) {
	var finalQuery = [];
	var phrasePrefixFields = [];
	var fields = dataFields.map(function (dataField) {
		var queryField = '' + dataField.field + (dataField.weight ? '^' + dataField.weight : '');
		if (!(dataField.field.endsWith('.keyword') || dataField.field.endsWith('.autosuggest') || dataField.field.endsWith('.search'))) {
			phrasePrefixFields.push(queryField);
		}
		return queryField;
	});
	if (props.searchOperators || props.queryString) {
		return {
			query: value,
			fields: fields,
			default_operator: props.queryFormat
		};
	}

	if (props.queryFormat === 'and') {
		finalQuery.push({
			multi_match: {
				query: value,
				fields: fields,
				type: 'cross_fields',
				operator: 'and'
			}
		});
		finalQuery.push({
			multi_match: {
				query: value,
				fields: fields,
				type: 'phrase',
				operator: 'and'
			}
		});
		if (phrasePrefixFields.length > 0) {
			finalQuery.push({
				multi_match: {
					query: value,
					fields: phrasePrefixFields,
					type: 'phrase_prefix',
					operator: 'and'
				}
			});
		}
		return finalQuery;
	}

	finalQuery.push({
		multi_match: {
			query: value,
			fields: fields,
			type: 'best_fields',
			operator: 'or',
			fuzziness: props.fuzziness ? props.fuzziness : 0
		}
	});

	finalQuery.push({
		multi_match: {
			query: value,
			fields: fields,
			type: 'phrase',
			operator: 'or'
		}
	});

	if (phrasePrefixFields.length > 0) {
		finalQuery.push({
			multi_match: {
				query: value,
				fields: phrasePrefixFields,
				type: 'phrase_prefix',
				operator: 'or'
			}
		});
	}

	return finalQuery;
};

var _initialiseProps = function _initialiseProps() {
	var _this4 = this;

	this.getBasicQueryOptions = function () {
		var aggregationField = _this4.props.aggregationField;
		var currentValue = _this4.state.currentValue;

		var queryOptions = (0, _helper.getQueryOptions)(_this4.props);
		if (aggregationField) {
			queryOptions.aggs = (0, _helper.getCompositeAggsQuery)({
				value: currentValue,
				props: _this4.props,
				showTopHits: true
			}).aggs;
		}
		return queryOptions;
	};

	this.onSuggestions = function (results) {
		return (0, _helper.handleOnSuggestions)(results, _this4.state.currentValue, _this4.props);
	};

	this.setValue = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this4.props;
		var cause = arguments[3];
		var hasMounted = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
		var toggleIsOpen = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

		var performUpdate = function performUpdate() {
			if (hasMounted) {
				var _props7 = _this4.props,
				    enableRecentSearches = _props7.enableRecentSearches,
				    fetchRecentSearches = _props7.fetchRecentSearches;
				// Refresh recent searches when value becomes empty

				if (!value && _this4.state.currentValue && enableRecentSearches) {
					fetchRecentSearches();
				}
				_this4.setState({
					currentValue: value
				}, function () {
					if (isDefaultValue) {
						if (_this4.props.autosuggest) {
							if (toggleIsOpen) {
								_this4.setState({
									isOpen: false
								});
							}
							_this4.updateDefaultQuery(value, props);
						}
						// in case of strict selection only SUGGESTION_SELECT should be able
						// to set the query otherwise the value should reset
						if (props.strictSelection) {
							if (cause === _causes2.default.SUGGESTION_SELECT || value === '') {
								_this4.updateQuery(value, props);
							} else {
								_this4.setValue('', true);
							}
						} else {
							_this4.updateQuery(value, props);
						}
					} else {
						// debounce for handling text while typing
						_this4.handleTextChange(value);
					}
					if (props.onValueChange) props.onValueChange(value);
					var suggestionChangeHandler = function suggestionChangeHandler() {
						// invoke on suggestions
						if (_this4.props.onSuggestions) {
							_this4.props.onSuggestions(_this4.props.suggestions);
						}
					};
					// Set the already fetched suggestions if query is same as used last to fetch the hits
					if (value === props.lastUsedQuery) {
						_this4.setState({
							suggestions: _this4.onSuggestions(_this4.props.suggestions)
						}, suggestionChangeHandler);
					} else if (!value) {
						// reset suggestions
						_this4.setState({
							suggestions: []
						}, suggestionChangeHandler);
					}
				});
			} else {
				if (_this4.props.autosuggest) {
					_this4.updateDefaultQuery(value, props);
				}
				_this4.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			}
		};
		(0, _helper.checkValueChange)(props.componentId, value, props.beforeValueChange, performUpdate);
	};

	this.handleTextChange = (0, _helper.debounce)(function (value) {
		if (_this4.props.autosuggest) {
			_this4.updateDefaultQuery(value, _this4.props);
		} else {
			_this4.updateQuery(value, _this4.props);
		}
	}, this.props.debounce);

	this.updateDefaultQuery = function (value, props) {
		var defaultQuery = props.defaultQuery;

		var defaultQueryOptions = void 0;
		var query = DataSearch.defaultQuery(value, props);
		if (defaultQuery) {
			var defaultQueryTobeSet = defaultQuery(value, props) || {};
			if (defaultQueryTobeSet.query) {
				query = defaultQueryTobeSet.query;
			}
			defaultQueryOptions = (0, _helper.getOptionsFromQuery)(defaultQueryTobeSet);
			// Update calculated default query in store
			(0, _helper.updateDefaultQuery)(props.componentId, props, value);
		}
		props.setSuggestionsSearchValue(value);
		props.setQueryOptions(_this4.internalComponent, _extends({}, _this4.queryOptions, defaultQueryOptions));
		props.updateQuery({
			componentId: _this4.internalComponent,
			query: query,
			value: value,
			componentType: _constants.componentTypes.dataSearch
		});
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery,
		    filterLabel = props.filterLabel,
		    showFilter = props.showFilter,
		    URLParams = props.URLParams;


		var customQueryOptions = void 0;
		var query = DataSearch.defaultQuery(value, props);
		if (customQuery) {
			var customQueryTobeSet = customQuery(value, props) || {};
			var queryTobeSet = customQueryTobeSet.query;
			if (queryTobeSet) {
				query = queryTobeSet;
			}
			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQueryTobeSet);
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}

		if (!_this4.isPending) {
			// execute the query on an uncontrolled component
			// query options should be applied to the source component,
			// not on internal component, hence using `this.props.componentId` here
			props.setQueryOptions(props.componentId, _extends({}, _this4.queryOptions, customQueryOptions));
			props.updateQuery({
				componentId: props.componentId,
				query: query,
				value: value,
				label: filterLabel,
				showFilter: showFilter,
				URLParams: URLParams,
				componentType: _constants.componentTypes.dataSearch
			});
		}
	};

	this.handleFocus = function (event) {
		_this4.setState({
			isOpen: true
		});
		if (_this4.props.onFocus) {
			_this4.props.onFocus(event, _this4.triggerQuery);
		}
	};

	this.clearValue = function () {
		_this4.isPending = false;
		var onChange = _this4.props.onChange;

		_this4.setValue('', true);
		if (onChange) {
			onChange('', _this4.triggerQuery);
		}
		_this4.onValueSelected('', _causes2.default.CLEAR_VALUE, null);
	};

	this.handleKeyDown = function (event, highlightedIndex) {
		var _props8 = _this4.props,
		    value = _props8.value,
		    onChange = _props8.onChange;

		if (value !== undefined && onChange) {
			_this4.isPending = true;
		}
		// if a suggestion was selected, delegate the handling
		// to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			_this4.setValue(event.target.value, true);
			_this4.onValueSelected(event.target.value, _causes2.default.ENTER_PRESS);
		}
		if (_this4.props.onKeyDown) {
			_this4.props.onKeyDown(event, _this4.triggerQuery);
		}
	};

	this.onInputChange = function (e) {
		var inputValue = e.target.value;

		if (!_this4.state.isOpen) {
			_this4.setState({
				isOpen: true
			});
		}

		var _props9 = _this4.props,
		    value = _props9.value,
		    onChange = _props9.onChange;

		if (value === undefined) {
			_this4.setValue(inputValue);
		} else if (onChange) {
			_this4.isPending = true;
			// handle caret position in controlled components
			(0, _utils.handleCaretPosition)(e);
			onChange(inputValue, _this4.triggerQuery, e);
		}
	};

	this.triggerQuery = function () {
		var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref2$isOpen = _ref2.isOpen,
		    isOpen = _ref2$isOpen === undefined ? false : _ref2$isOpen;

		_this4.isPending = false;
		_this4.setValue(_this4.props.value, !isOpen, _this4.props);
	};

	this.onSuggestionSelected = function (suggestion) {
		var _props10 = _this4.props,
		    value = _props10.value,
		    onChange = _props10.onChange;

		_this4.setState({
			isOpen: false
		});
		if (value === undefined) {
			_this4.setValue(suggestion.value, true, _this4.props, _causes2.default.SUGGESTION_SELECT);
		} else if (onChange) {
			_this4.isPending = false;
			onChange(suggestion.value, _this4.triggerQuery);
		}
		// Record analytics for selected suggestions
		_this4.triggerClickAnalytics(suggestion._click_id);
		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		_this4.onValueSelected(suggestion.value, _causes2.default.SUGGESTION_SELECT, suggestion.source);
	};

	this.onValueSelected = function () {
		for (var _len = arguments.length, cause = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			cause[_key - 1] = arguments[_key];
		}

		var currentValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this4.state.currentValue;
		var onValueSelected = _this4.props.onValueSelected;

		if (onValueSelected) {
			onValueSelected.apply(undefined, [currentValue].concat(cause));
		}
	};

	this.handleStateChange = function (changes) {
		var isOpen = changes.isOpen,
		    type = changes.type;

		if (type === _downshift2.default.stateChangeTypes.mouseUp && isOpen !== undefined) {
			_this4.setState({
				isOpen: isOpen
			});
		}
	};

	this.getBackgroundColor = function (highlightedIndex, index) {
		var isDark = _this4.props.themePreset === 'dark';
		if (isDark) {
			return highlightedIndex === index ? '#555' : '#424242';
		}
		return highlightedIndex === index ? '#eee' : '#fff';
	};

	this.handleSearchIconClick = function () {
		var currentValue = _this4.state.currentValue;

		if (currentValue.trim()) {
			_this4.isPending = false;
			_this4.setValue(currentValue, true);
			_this4.onValueSelected(currentValue, _causes2.default.SEARCH_ICON_CLICK);
		}
	};

	this.handleVoiceResults = function (_ref3) {
		var results = _ref3.results;

		if (results && results[0] && results[0].isFinal && results[0][0] && results[0][0].transcript && results[0][0].transcript.trim()) {
			_this4.isPending = false;
			_this4.setValue(results[0][0].transcript.trim(), true);
		}
	};

	this.renderInputAddonBefore = function () {
		var addonBefore = _this4.props.addonBefore;

		if (addonBefore) {
			return (0, _core.jsx)(
				_InputAddon2.default,
				null,
				addonBefore
			);
		}

		return null;
	};

	this.renderInputAddonAfter = function () {
		var addonAfter = _this4.props.addonAfter;

		if (addonAfter) {
			return (0, _core.jsx)(
				_InputAddon2.default,
				null,
				addonAfter
			);
		}

		return null;
	};

	this.renderIcon = function () {
		if (_this4.props.showIcon) {
			return _this4.props.icon || (0, _core.jsx)(_SearchSvg2.default, null);
		}
		return null;
	};

	this.renderCancelIcon = function () {
		if (_this4.props.showClear) {
			return _this4.props.clearIcon || (0, _core.jsx)(_CancelSvg2.default, null);
		}
		return null;
	};

	this.renderIcons = function () {
		var _props11 = _this4.props,
		    showIcon = _props11.showIcon,
		    showClear = _props11.showClear,
		    renderMic = _props11.renderMic,
		    getMicInstance = _props11.getMicInstance,
		    showVoiceSearch = _props11.showVoiceSearch,
		    iconPosition = _props11.iconPosition,
		    innerClass = _props11.innerClass;

		return (0, _core.jsx)(
			'div',
			null,
			(0, _core.jsx)(
				_IconGroup2.default,
				{ groupPosition: 'right', positionType: 'absolute' },
				_this4.state.currentValue && showClear && (0, _core.jsx)(
					_IconWrapper2.default,
					{ onClick: _this4.clearValue, showIcon: showIcon, isClearIcon: true },
					_this4.renderCancelIcon()
				),
				_this4.shouldMicRender(showVoiceSearch) && (0, _core.jsx)(_Mic2.default, {
					getInstance: getMicInstance,
					render: renderMic,
					onResult: _this4.handleVoiceResults,
					className: (0, _helper.getClassName)(innerClass, 'mic') || null
				}),
				iconPosition === 'right' && (0, _core.jsx)(
					_IconWrapper2.default,
					{ onClick: _this4.handleSearchIconClick },
					_this4.renderIcon()
				)
			),
			(0, _core.jsx)(
				_IconGroup2.default,
				{ groupPosition: 'left', positionType: 'absolute' },
				iconPosition === 'left' && (0, _core.jsx)(
					_IconWrapper2.default,
					{ onClick: _this4.handleSearchIconClick },
					_this4.renderIcon()
				)
			)
		);
	};

	this.renderNoSuggestion = function () {
		var finalSuggestionsList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		var _props12 = _this4.props,
		    themePreset = _props12.themePreset,
		    theme = _props12.theme,
		    isLoading = _props12.isLoading,
		    renderNoSuggestion = _props12.renderNoSuggestion,
		    innerClass = _props12.innerClass,
		    error = _props12.error,
		    renderError = _props12.renderError;
		var _state = _this4.state,
		    isOpen = _state.isOpen,
		    currentValue = _state.currentValue;

		if (renderNoSuggestion && isOpen && !finalSuggestionsList.length && !isLoading && currentValue && !(renderError && error)) {
			return (0, _core.jsx)(
				_SuggestionWrapper2.default,
				{
					innerClass: innerClass,
					themePreset: themePreset,
					theme: theme,
					innerClassName: 'noSuggestion'
				},
				typeof renderNoSuggestion === 'function' ? renderNoSuggestion(currentValue) : renderNoSuggestion
			);
		}
		return null;
	};

	this.renderLoader = function () {
		var _props13 = _this4.props,
		    loader = _props13.loader,
		    isLoading = _props13.isLoading,
		    themePreset = _props13.themePreset,
		    theme = _props13.theme,
		    innerClass = _props13.innerClass;
		var currentValue = _this4.state.currentValue;

		if (isLoading && loader && currentValue) {
			return (0, _core.jsx)(
				_SuggestionWrapper2.default,
				{
					innerClass: innerClass,
					innerClassName: 'loader',
					theme: theme,
					themePreset: themePreset
				},
				loader
			);
		}
		return null;
	};

	this.renderError = function () {
		var _props14 = _this4.props,
		    error = _props14.error,
		    renderError = _props14.renderError,
		    themePreset = _props14.themePreset,
		    theme = _props14.theme,
		    isLoading = _props14.isLoading,
		    innerClass = _props14.innerClass;
		var currentValue = _this4.state.currentValue;

		if (error && renderError && currentValue && !isLoading) {
			return (0, _core.jsx)(
				_SuggestionWrapper2.default,
				{
					innerClass: innerClass,
					innerClassName: 'error',
					theme: theme,
					themePreset: themePreset
				},
				(0, _utils.isFunction)(renderError) ? renderError(error) : renderError
			);
		}
		return null;
	};

	this.getComponent = function () {
		var downshiftProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var isPopularSuggestionsRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var _props15 = _this4.props,
		    error = _props15.error,
		    isLoading = _props15.isLoading,
		    aggregationData = _props15.aggregationData,
		    promotedResults = _props15.promotedResults,
		    customData = _props15.customData,
		    rawData = _props15.rawData;
		var currentValue = _this4.state.currentValue;

		var data = {
			error: error,
			loading: isLoading,
			downshiftProps: downshiftProps,
			data: _this4.parsedSuggestions,
			promotedData: promotedResults || [],
			customData: customData || {},
			aggregationData: aggregationData || [],
			rawData: rawData,
			value: currentValue,
			triggerClickAnalytics: _this4.triggerClickAnalytics,
			resultStats: _this4.stats,
			// TODO: Remove in v4
			querySuggestions: _this4.normalizedPopularSuggestions,
			popularSuggestions: _this4.normalizedPopularSuggestions,
			recentSearches: _this4.normalizedRecentSearches
		};
		if (isPopularSuggestionsRender) {
			return (0, _utils.getPopularSuggestionsComponent)({
				downshiftProps: downshiftProps,
				data: _this4.normalizedPopularSuggestions,
				value: currentValue,
				loading: isLoading,
				error: error
			}, _this4.props);
		}
		return (0, _utils.getComponent)(data, _this4.props);
	};

	this.triggerClickAnalytics = function (searchPosition, documentId) {
		var docId = documentId;
		if (!docId) {
			var hitData = _this4.parsedSuggestions.find(function (hit) {
				return hit._click_id === searchPosition;
			});
			if (hitData && hitData.source && hitData.source._id) {
				docId = hitData.source._id;
			}
		}
		_this4.props.triggerAnalytics(searchPosition, docId);
	};

	this.withTriggerQuery = function (func) {
		if (func) {
			return function (e) {
				return func(e, _this4.triggerQuery);
			};
		}
		return undefined;
	};

	this.focusSearchBox = function (event) {
		var elt = event.target || event.srcElement;
		var tagName = elt.tagName;
		if (elt.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
			// already in an input
			return;
		}

		if (_this4._inputRef) {
			_this4._inputRef.focus();
		}
	};

	this.listenForFocusShortcuts = function () {
		var focusShortcuts = _this4.props.focusShortcuts;

		if ((0, _utils.isEmpty)(focusShortcuts)) {
			return;
		}

		// for single press keys (a-z, A-Z) &, hotkeys' combinations such as 'cmd+k', 'ctrl+shft+a', etc
		(0, _hotkeysJs2.default)((0, _utils.parseFocusShortcuts)(focusShortcuts).join(','),
		/* eslint-disable no-shadow */
		// eslint-disable-next-line no-unused-vars
		function (event, handler) {
			// Prevent the default refresh event under WINDOWS system
			event.preventDefault();
			_this4.focusSearchBox(event);
		});

		// if one of modifier keys are used, they are handled below
		(0, _hotkeysJs2.default)('*', function (event) {
			var modifierKeys = (0, _utils.extractModifierKeysFromFocusShortcuts)(focusShortcuts);

			if (modifierKeys.length === 0) return;

			for (var index = 0; index < modifierKeys.length; index += 1) {
				var element = modifierKeys[index];
				if (_hotkeysJs2.default[element]) {
					_this4.focusSearchBox(event);
					break;
				}
			}
		});
	};
};

DataSearch.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	fetchPopularSuggestions: _types2.default.funcRequired,
	fetchRecentSearches: _types2.default.funcRequired,
	recentSearches: _types2.default.suggestions,
	options: _types2.default.options,
	selectedValue: _types2.default.selectedValue,
	suggestions: _types2.default.suggestions,
	defaultPopularSuggestions: _types2.default.suggestions,
	rawData: _types2.default.rawData,
	aggregationData: _types2.default.aggregationData,
	setCustomQuery: _types2.default.funcRequired,
	setDefaultQuery: _types2.default.funcRequired,
	setCustomHighlightOptions: _types2.default.funcRequired,
	setSuggestionsSearchValue: _types2.default.funcRequired,
	triggerAnalytics: _types2.default.funcRequired,
	error: _types2.default.title,
	isLoading: _types2.default.bool,
	lastUsedQuery: _types2.default.string,
	time: _types2.default.number,
	enableAppbase: _types2.default.bool,
	// component props
	autoFocus: _types2.default.bool,
	autosuggest: _types2.default.bool,
	enableSynonyms: _types2.default.bool,
	distinctField: _types2.default.string,
	distinctFieldConfig: _types2.default.componentObject,
	index: _types2.default.string,
	// TODO: Remove in v4
	enableQuerySuggestions: _types2.default.bool,
	enablePopularSuggestions: _types2.default.bool,
	enableRecentSearches: _types2.default.bool,
	queryString: _types2.default.bool,
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	clearIcon: _types2.default.children,
	componentId: _types2.default.stringRequired,
	customHighlight: _types2.default.func,
	customQuery: _types2.default.func,
	defaultQuery: _types2.default.func,
	dataField: _types2.default.dataFieldValidator,
	aggregationField: _types2.default.string,
	aggregationSize: _types2.default.number,
	size: _types2.default.number,
	debounce: _types2.default.number,
	defaultValue: _types2.default.string,
	value: _types2.default.string,
	defaultSuggestions: _types2.default.suggestions,
	promotedResults: _types2.default.hits,
	customData: _types2.default.title,
	downShiftProps: _types2.default.props,
	children: _types2.default.func,
	excludeFields: _types2.default.excludeFields,
	fieldWeights: _types2.default.fieldWeights,
	filterLabel: _types2.default.string,
	fuzziness: _types2.default.fuzziness,
	highlight: _types2.default.bool,
	highlightField: _types2.default.stringOrArray,
	icon: _types2.default.children,
	iconPosition: _types2.default.iconPosition,
	innerClass: _types2.default.style,
	includeFields: _types2.default.includeFields,
	loader: _types2.default.title,
	nestedField: _types2.default.string,
	onError: _types2.default.func,
	onBlur: _types2.default.func,
	onFocus: _types2.default.func,
	onKeyDown: _types2.default.func,
	onKeyPress: _types2.default.func,
	onKeyUp: _types2.default.func,
	onQueryChange: _types2.default.func,
	onSuggestions: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	onValueSelected: _types2.default.func,
	placeholder: _types2.default.string,
	queryFormat: _types2.default.queryFormatSearch,
	popularSuggestions: _types2.default.hits,
	react: _types2.default.react,
	render: _types2.default.func,
	// TODO: Remove in v4
	renderQuerySuggestions: _types2.default.func,
	renderPopularSuggestions: _types2.default.func,
	renderError: _types2.default.title,
	parseSuggestion: _types2.default.func,
	renderNoSuggestion: _types2.default.title,
	showClear: _types2.default.bool,
	showDistinctSuggestions: _types2.default.bool,
	showFilter: _types2.default.bool,
	showIcon: _types2.default.bool,
	showVoiceSearch: _types2.default.bool,
	style: _types2.default.style,
	title: _types2.default.title,
	theme: _types2.default.style,
	themePreset: _types2.default.themePreset,
	type: _types2.default.string,
	URLParams: _types2.default.bool,
	strictSelection: _types2.default.bool,
	searchOperators: _types2.default.bool,
	enablePredictiveSuggestions: _types2.default.bool,
	recentSearchesIcon: _types2.default.componentObject,
	popularSearchesIcon: _types2.default.componentObject,
	// Mic props
	getMicInstance: _types2.default.func,
	renderMic: _types2.default.func,
	//
	focusShortcuts: _types2.default.focusShortcuts,
	addonBefore: _types2.default.children,
	addonAfter: _types2.default.children,
	expandSuggestionsContainer: _types2.default.bool
};

DataSearch.defaultProps = {
	autosuggest: true,
	className: null,
	debounce: 0,
	downShiftProps: {},
	enableSynonyms: true,
	enablePopularSuggestions: false,
	excludeFields: [],
	iconPosition: 'left',
	includeFields: ['*'],
	placeholder: 'Search',
	queryFormat: 'or',
	showFilter: true,
	showIcon: true,
	showVoiceSearch: false,
	style: {},
	URLParams: false,
	showClear: false,
	showDistinctSuggestions: true,
	strictSelection: false,
	searchOperators: false,
	size: 10,
	enablePredictiveSuggestions: false,
	recentSearches: [],
	defaultPopularSuggestions: [],
	time: 0,
	focusShortcuts: ['/'],
	addonBefore: undefined,
	addonAfter: undefined,
	expandSuggestionsContainer: true
};

// Add componentType for SSR
DataSearch.componentType = _constants.componentTypes.dataSearch;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits,
		rawData: state.rawData[props.componentId],
		aggregationData: state.compositeAggregations[props.componentId],
		themePreset: state.config.themePreset,
		isLoading: !!state.isLoading[props.componentId + '_active'],
		error: state.error[props.componentId],
		enableAppbase: state.config.enableAppbase,
		promotedResults: state.promotedResults[props.componentId],
		customData: state.customData[props.componentId],
		time: state.hits[props.componentId] && state.hits[props.componentId].time,
		total: state.hits[props.componentId] && state.hits[props.componentId].total,
		hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
		popularSuggestions: state.querySuggestions[props.componentId],
		defaultPopularSuggestions: state.defaultPopularSuggestions[props.componentId],
		recentSearches: state.recentSearches.data,
		lastUsedQuery: state.queryToHits[props.componentId]
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setCustomHighlightOptions: function setCustomHighlightOptions(component, options) {
			return dispatch((0, _actions.setCustomHighlightOptions)(component, options));
		},
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		setDefaultQuery: function setDefaultQuery(component, query) {
			return dispatch((0, _actions.setDefaultQuery)(component, query));
		},
		setSuggestionsSearchValue: function setSuggestionsSearchValue(value) {
			return dispatch((0, _actions.setSuggestionsSearchValue)(value));
		},
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		},
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		},
		triggerAnalytics: function triggerAnalytics(searchPosition, documentId) {
			return dispatch((0, _actions.recordSuggestionClick)(searchPosition, documentId));
		},
		fetchRecentSearches: function fetchRecentSearches(queryOptions) {
			return dispatch((0, _actions.getRecentSearches)(queryOptions));
		},
		fetchPopularSuggestions: function fetchPopularSuggestions(component) {
			return dispatch((0, _actions.loadPopularSuggestions)(component));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(function (props) {
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.dataSearch }),
		function () {
			return (0, _core.jsx)(DataSearch, _extends({ ref: props.myForwardedRef }, props));
		}
	);
}));

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, DataSearch);

ForwardRefComponent.displayName = 'DataSearch';
exports.default = ForwardRefComponent;