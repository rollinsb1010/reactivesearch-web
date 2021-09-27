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

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _actions = require('@appbaseio/reactivecore/lib/actions');

var _helper = require('@appbaseio/reactivecore/lib/utils/helper');

var _constants = require('@appbaseio/reactivecore/lib/utils/constants');

var _transform = require('@appbaseio/reactivecore/lib/utils/transform');

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _causes = require('@appbaseio/reactivecore/lib/utils/causes');

var _causes2 = _interopRequireDefault(_causes);

var _hotkeysJs = require('hotkeys-js');

var _hotkeysJs2 = _interopRequireDefault(_hotkeysJs);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _InputGroup = require('../../styles/InputGroup');

var _InputGroup2 = _interopRequireDefault(_InputGroup);

var _InputWrapper = require('../../styles/InputWrapper');

var _InputWrapper2 = _interopRequireDefault(_InputWrapper);

var _InputAddon = require('../../styles/InputAddon');

var _InputAddon2 = _interopRequireDefault(_InputAddon);

var _Input = require('../../styles/Input');

var _Input2 = _interopRequireDefault(_Input);

var _CancelSvg = require('../shared/CancelSvg');

var _CancelSvg2 = _interopRequireDefault(_CancelSvg);

var _SearchSvg = require('../shared/SearchSvg');

var _SearchSvg2 = _interopRequireDefault(_SearchSvg);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Mic = require('./addons/Mic');

var _Mic2 = _interopRequireDefault(_Mic);

var _CustomSvg = require('../shared/CustomSvg');

var _CustomSvg2 = _interopRequireDefault(_CustomSvg);

var _utils = require('../../utils');

var _SuggestionItem = require('./addons/SuggestionItem');

var _SuggestionItem2 = _interopRequireDefault(_SuggestionItem);

var _SuggestionWrapper = require('./addons/SuggestionWrapper');

var _SuggestionWrapper2 = _interopRequireDefault(_SuggestionWrapper);

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

var _IconWrapper = require('../../styles/IconWrapper');

var _IconWrapper2 = _interopRequireDefault(_IconWrapper);

var _IconGroup = require('../../styles/IconGroup');

var _IconGroup2 = _interopRequireDefault(_IconGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var Text = (0, _emotionTheming.withTheme)(function (props) {
	return (0, _core.jsx)(
		'span',
		{
			className: 'trim',
			style: {
				color: props.primary ? props.theme.colors.primaryColor : props.theme.colors.textColor
			}
		},
		props.children
	);
});

var CategorySearch = function (_Component) {
	_inherits(CategorySearch, _Component);

	function CategorySearch(props) {
		_classCallCheck(this, CategorySearch);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var value = props.value || props.defaultValue || {};
		// eslint-disable-next-line
		var _value$term = value.term,
		    currentValue = _value$term === undefined ? '' : _value$term,
		    _value$category = value.category,
		    currentCategory = _value$category === undefined ? null : _value$category;
		// add preference to selected-X value from URL/SSR

		currentValue = props.selectedValue || currentValue;
		currentCategory = props.selectedCategory || currentCategory;

		_this.state = {
			currentValue: currentValue,
			currentCategory: currentCategory,
			suggestions: [],
			isOpen: false
		};
		/**
   * To regulate the query execution based on the input handler,
   * the component query will only get executed when it sets to `true`.
   * */
		_this.isPending = false;

		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);
		_this.queryOptions = (0, _helper.getQueryOptions)(props);
		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		(0, _helper.updateDefaultQuery)(props.componentId, props, currentValue);

		if (props.highlight) {
			var queryOptions = CategorySearch.highlightQuery(props) || {};
			if (props.customHighlight && typeof props.customHighlight === 'function') {
				props.setCustomHighlightOptions(props.componentId, props.customHighlight(props));
			}
			queryOptions.size = props.size;
			_this.queryOptions = queryOptions;
			props.setQueryOptions(props.componentId, queryOptions);
		} else {
			props.setQueryOptions(props.componentId, _this.queryOptions);
		}

		var aggsQuery = _this.getCombinedAggsQuery();
		props.setQueryOptions(_this.internalComponent, aggsQuery, false);
		var hasMounted = false;
		var cause = null;

		if (currentValue) {
			var calcValue = {
				term: currentValue,
				category: currentCategory
			};
			if (props.onChange) {
				props.onChange(calcValue, function () {
					return _this.triggerQuery(calcValue);
				});
			}
			_this.setValue(currentValue, true, props, currentCategory, cause, hasMounted);
		}
		return _this;
	}

	CategorySearch.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['highlight', 'dataField', 'highlightField'], function () {
			var queryOptions = CategorySearch.highlightQuery(_this2.props) || {};
			if (_this2.props.customHighlight && typeof _this2.props.customHighlight === 'function') {
				_this2.props.setCustomHighlightOptions(_this2.props.componentId, _this2.props.customHighlight(_this2.props));
			}
			queryOptions.size = _this2.props.size;
			_this2.queryOptions = queryOptions;
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

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['fieldWeights', 'fuzziness', 'queryFormat', 'dataField', 'categoryField', 'nestedField', 'searchOperators'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);
		});

		if (!(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			var _props$value = this.props.value,
			    currentValue = _props$value.term,
			    _props$value$category = _props$value.category,
			    currentCategory = _props$value$category === undefined ? null : _props$value$category;

			this.setValue(currentValue, true, this.props, currentCategory, undefined, undefined, false);
		} else if (
		// since, selectedValue will be updated when currentValue changes,
		// we must only check for the changes introduced by
		// clear action from SelectedFilters component in which case,
		// the currentValue will never match the updated selectedValue
		this.props.selectedValue !== prevProps.selectedValue && this.state.currentValue !== this.props.selectedValue) {
			if (!this.props.selectedValue && this.state.currentValue) {
				// selected value is cleared, call onValueSelected
				this.onValueSelected('', _causes2.default.CLEAR_VALUE, null);
			}
			var _props = this.props,
			    value = _props.value,
			    onChange = _props.onChange;

			if (value === undefined) {
				this.setValue(this.props.selectedValue || '', true, this.props, this.props.selectedCategory);
			} else if (onChange) {
				var _currentValue = {
					term: this.props.selectedValue || '',
					category: this.props.selectedCategory || null
				};
				// value prop exists
				onChange(_currentValue, function () {
					return _this2.triggerQuery(_currentValue);
				});
			} else {
				// value prop exists and onChange is not defined:
				// we need to put the current value back into the store
				// if the clear action was triggered by interacting with
				// selected-filters component
				this.isPending = false;
				this.setValue(this.state.currentValue, true, this.props, this.state.currentCategory);
			}
		}
	};

	CategorySearch.prototype.componentDidMount = function componentDidMount() {
		// register hotkeys for listening to focusShortcuts' key presses
		this.listenForFocusShortcuts();
		var _props2 = this.props,
		    enableQuerySuggestions = _props2.enableQuerySuggestions,
		    renderQuerySuggestions = _props2.renderQuerySuggestions,
		    fetchPopularSuggestions = _props2.fetchPopularSuggestions,
		    enableRecentSearches = _props2.enableRecentSearches,
		    fetchRecentSearches = _props2.fetchRecentSearches,
		    componentId = _props2.componentId,
		    aggregationField = _props2.aggregationField,
		    distinctField = _props2.distinctField,
		    distinctFieldConfig = _props2.distinctFieldConfig,
		    index = _props2.index,
		    enableAppbase = _props2.enableAppbase;

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
		if (enableRecentSearches) {
			fetchRecentSearches();
		}
		fetchPopularSuggestions(componentId);
	};

	CategorySearch.prototype.componentWillUnmount = function componentWillUnmount() {
		document.removeEventListener('keydown', this.onKeyDown);
	};

	CategorySearch.prototype.shouldMicRender = function shouldMicRender(showVoiceSearch) {
		// checks for SSR
		if (typeof window === 'undefined') return false;
		return showVoiceSearch && (window.webkitSpeechRecognition || window.SpeechRecognition);
	};

	CategorySearch.prototype.render = function render() {
		var _this3 = this;

		var currentValue = this.state.currentValue;
		var _props3 = this.props,
		    theme = _props3.theme,
		    themePreset = _props3.themePreset,
		    size = _props3.size,
		    recentSearchesIcon = _props3.recentSearchesIcon,
		    popularSearchesIcon = _props3.popularSearchesIcon;

		var finalSuggestionsList = this.parsedSuggestions;
		var hasSuggestions = currentValue ? finalSuggestionsList.length || this.topSuggestions.length : this.defaultSuggestions.length;
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
							isOpen && _this3.renderLoader(),
							isOpen && _this3.renderError(),
							_this3.hasCustomRenderer && _this3.getComponent(_extends({
								getInputProps: getInputProps,
								getItemProps: getItemProps,
								isOpen: isOpen,
								highlightedIndex: highlightedIndex,
								setHighlightedIndex: setHighlightedIndex
							}, rest)),
							!_this3.hasCustomRenderer && isOpen && hasSuggestions ? (0, _core.jsx)(
								'ul',
								{
									css: (0, _Input.suggestions)(themePreset, theme),
									className: (0, _helper.getClassName)(_this3.props.innerClass, 'list')
								},
								finalSuggestionsList.slice(0, size).map(function (item, index) {
									return (0, _core.jsx)(
										'li',
										_extends({}, getItemProps({ item: item }), {
											key: index + 1 + '-' + item.value // eslint-disable-line
											, style: {
												backgroundColor: _this3.getBackgroundColor(highlightedIndex, index)
											}
										}),
										(0, _core.jsx)(
											Text,
											{ primary: !!item.category },
											(0, _core.jsx)(_SuggestionItem2.default, {
												currentValue: currentValue,
												suggestion: item
											})
										)
									);
								}),
								_this3.defaultSuggestions.map(function (sugg, index) {
									return (0, _core.jsx)(
										'li',
										_extends({}, getItemProps({ item: sugg }), {
											key: finalSuggestionsList.length + index + 1 + '-' + sugg.value,
											style: {
												backgroundColor: _this3.getBackgroundColor(highlightedIndex, finalSuggestionsList.length + index),
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
											key: finalSuggestionsList.length + index + 1 + '-' + sugg.value,
											style: {
												backgroundColor: _this3.getBackgroundColor(highlightedIndex, finalSuggestionsList.length + index),
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
							) : _this3.renderNoSuggestion(finalSuggestionsList)
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
									ref: function ref(c) {
										_this3._inputRef = c;
									},
									'aria-label': _this3.props.componentId,
									showClear: _this3.props.showClear,
									id: _this3.props.componentId + '-input',
									showIcon: _this3.props.showIcon,
									iconPosition: _this3.props.iconPosition
								}, getInputProps({
									className: (0, _helper.getClassName)(_this3.props.innerClass, 'input'),
									placeholder: _this3.props.placeholder,
									value: _this3.state.currentValue === null ? '' : _this3.state.currentValue,
									onChange: _this3.onInputChange,
									onBlur: _this3.withTriggerQuery(_this3.props.onBlur),
									onFocus: _this3.handleFocus,
									onKeyPress: _this3.withTriggerQuery(_this3.props.onKeyPress),
									onKeyDown: function onKeyDown(e) {
										return _this3.handleKeyDown(e, highlightedIndex);
									},
									onKeyUp: _this3.withTriggerQuery(_this3.props.onKeyUp),
									onClick: function onClick() {
										// clear highlighted index
										setHighlightedIndex(null);
									},
									autoFocus: _this3.props.autoFocus
								}), {
									themePreset: themePreset
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
							ref: function ref(c) {
								_this3._inputRef = c;
							},
							'aria-label': this.props.componentId,
							className: (0, _helper.getClassName)(this.props.innerClass, 'input'),
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
							showClear: this.props.showClear,
							showIcon: this.props.showIcon,
							themePreset: themePreset
						}),
						this.renderIcons()
					),
					this.renderInputAddonAfter()
				)
			)
		);
	};

	_createClass(CategorySearch, [{
		key: 'stats',
		get: function get() {
			return (0, _helper.getResultStats)(this.props);
		}
	}, {
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}, {
		key: 'filteredCategories',
		get: function get() {
			var categories = this.props.categories;

			return categories.filter(function (category) {
				return Boolean(category.key);
			});
		}
	}, {
		key: 'parsedSuggestions',
		get: function get() {
			var finalSuggestionsList = [];
			var suggestionsList = [];

			// filter out empty categories
			var filteredCategories = this.filteredCategories;

			if (!this.state.currentValue && this.props.defaultSuggestions && this.props.defaultSuggestions.length) {
				finalSuggestionsList = this.props.defaultSuggestions;
			} else if (this.state.currentValue) {
				suggestionsList = this.state.suggestions;
			}

			if (this.state.currentValue && this.state.suggestions.length && filteredCategories.length) {
				var categorySuggestions = [{
					label: this.state.currentValue + ' in all categories',
					value: this.state.currentValue,
					category: '*',
					// no source object exists for category based suggestions
					source: null
				}, {
					label: this.state.currentValue + ' in ' + filteredCategories[0].key,
					value: this.state.currentValue,
					category: filteredCategories[0].key,
					source: null
				}];

				if (filteredCategories.length > 1) {
					categorySuggestions = [].concat(categorySuggestions, [{
						label: this.state.currentValue + ' in ' + filteredCategories[1].key,
						value: this.state.currentValue,
						category: filteredCategories[1].key,
						source: null
					}]);
				}
				finalSuggestionsList = [].concat(categorySuggestions, suggestionsList);
			}
			return (0, _helper.withClickIds)(finalSuggestionsList);
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

			return recentSearches;
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

	return CategorySearch;
}(_react.Component);

CategorySearch.highlightQuery = function (props) {
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

CategorySearch.defaultQuery = function (value, props, category) {
	var finalQuery = null;

	if (value) {
		var fields = (0, _helper.normalizeDataField)(props.dataField, props.fieldWeights);

		if (props.queryString) {
			finalQuery = {
				query_string: CategorySearch.shouldQuery(value, fields, props)
			};
		} else if (props.searchOperators) {
			finalQuery = {
				simple_query_string: CategorySearch.shouldQuery(value, fields, props)
			};
		} else {
			finalQuery = {
				bool: {
					should: CategorySearch.shouldQuery(value, fields, props),
					minimum_should_match: '1'
				}
			};
		}

		if (category && category !== '*') {
			var _term;

			finalQuery = [finalQuery, {
				term: (_term = {}, _term[props.categoryField] = category, _term)
			}];
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

CategorySearch.shouldQuery = function (value) {
	var dataFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	var props = arguments[2];

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

	this.getAggsQuery = function (field) {
		var _aggs;

		return {
			aggs: (_aggs = {}, _aggs[field] = {
				terms: {
					field: field
				}
			}, _aggs)
		};
	};

	this.getCombinedAggsQuery = function () {
		var _props7 = _this4.props,
		    categoryField = _props7.categoryField,
		    aggregationField = _props7.aggregationField;

		var aggsQuery = _this4.getAggsQuery(categoryField);
		if (aggregationField) {
			var compositeAggsQuery = (0, _helper.getCompositeAggsQuery)({
				value: null,
				props: _this4.props,
				showTopHits: true
			});
			aggsQuery.aggs = _extends({}, aggsQuery.aggs, compositeAggsQuery.aggs);
		}
		return aggsQuery;
	};

	this.onSuggestions = function (searchResults) {
		return (0, _helper.handleOnSuggestions)(searchResults, _this4.state.currentValue, _this4.props);
	};

	this.setValue = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this4.props;
		var category = arguments[3];
		var cause = arguments[4];
		var hasMounted = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
		var toggleIsOpen = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;

		var performUpdate = function performUpdate() {
			if (hasMounted) {
				var _props8 = _this4.props,
				    enableRecentSearches = _props8.enableRecentSearches,
				    fetchRecentSearches = _props8.fetchRecentSearches;
				// Refresh recent searches when value becomes empty

				if (!value && _this4.state.currentValue && enableRecentSearches) {
					fetchRecentSearches();
				}
				_this4.setState({
					currentValue: value || '',
					currentCategory: category || null
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
								_this4.updateQuery(value, props, category);
							} else {
								_this4.setValue('', true);
							}
						} else {
							_this4.updateQuery(value, props, category);
						}
					} else {
						// debounce for handling text while typing
						_this4.handleTextChange(value);
					}
					if (props.onValueChange) props.onValueChange(value);
				});
			} else {
				_this4.updateDefaultQuery(value, props);
				_this4.updateQuery(value, props, category);
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
		var category = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this4.state.currentCategory;
		var defaultQuery = props.defaultQuery;

		var defaultQueryOptions = void 0;
		var query = CategorySearch.defaultQuery(value, props, category);
		if (defaultQuery) {
			var defaultQueryTobeSet = defaultQuery(value, props, category) || {};
			if (defaultQueryTobeSet.query) {
				query = defaultQueryTobeSet.query;
			}
			defaultQueryOptions = (0, _helper.getOptionsFromQuery)(defaultQueryTobeSet);
			// Update calculated default query in store
			(0, _helper.updateDefaultQuery)(props.componentId, props, value);
		}
		props.setSuggestionsSearchValue(value);
		var aggsQuery = _this4.getCombinedAggsQuery();
		props.setQueryOptions(_this4.internalComponent, _extends({}, _this4.queryOptions, aggsQuery, defaultQueryOptions));
		props.updateQuery({
			componentId: _this4.internalComponent,
			query: query,
			value: value,
			category: category,
			componentType: _constants.componentTypes.categorySearch
		});
	};

	this.updateQuery = function (value, props) {
		var category = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this4.state.currentCategory;
		var customQuery = props.customQuery,
		    filterLabel = props.filterLabel,
		    showFilter = props.showFilter,
		    URLParams = props.URLParams;


		var customQueryOptions = void 0;
		var query = CategorySearch.defaultQuery(value, props, category);
		if (customQuery) {
			var customQueryTobeSet = customQuery(value, props, category) || {};
			if (customQueryTobeSet.query) {
				query = customQueryTobeSet.query;
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
				componentType: _constants.componentTypes.categorySearch,
				category: category
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
		_this4.setValue('', true);
		_this4.onValueSelected('', _causes2.default.CLEAR_VALUE, null);
	};

	this.handleKeyDown = function (event, highlightedIndex) {
		var _props9 = _this4.props,
		    value = _props9.value,
		    onChange = _props9.onChange;

		if (value !== undefined && onChange) {
			_this4.isPending = true;
		}
		// if a suggestion was selected, delegate the handling to suggestion handler
		if (event.key === 'Enter' && highlightedIndex === null) {
			_this4.setValue(event.target.value, true);
			var currentValue = {
				term: event.target.value,
				category: null
			};
			_this4.onValueSelected(currentValue, _causes2.default.ENTER_PRESS);
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

		var _props10 = _this4.props,
		    value = _props10.value,
		    onChange = _props10.onChange;

		if (value === undefined) {
			_this4.setValue(inputValue);
		} else if (onChange) {
			_this4.isPending = true;
			var currentValue = {
				term: inputValue
				// category: null,
			};
			// handle caret position in controlled components
			(0, _utils.handleCaretPosition)(e);
			onChange(currentValue, function () {
				return _this4.triggerQuery(currentValue);
			}, e);
		} else {
			_this4.setValue(inputValue);
		}
	};

	this.triggerQuery = function (value) {
		var currentValue = value.term,
		    _value$category2 = value.category,
		    currentCategory = _value$category2 === undefined ? null : _value$category2,
		    _value$isOpen = value.isOpen,
		    isOpen = _value$isOpen === undefined ? false : _value$isOpen;

		_this4.isPending = false;
		_this4.setValue(currentValue, !isOpen, _this4.props, currentCategory);
	};

	this.onSuggestionSelected = function (suggestion) {
		var _props11 = _this4.props,
		    value = _props11.value,
		    onChange = _props11.onChange;

		var currentValue = {
			term: suggestion.value,
			category: suggestion.category || null
		};
		_this4.setState({
			isOpen: false
		});
		if (value === undefined) {
			_this4.setValue(currentValue.term, true, _this4.props, currentValue.category, _causes2.default.SUGGESTION_SELECT);
		} else if (onChange) {
			_this4.isPending = false;
			onChange(currentValue, function () {
				return _this4.triggerQuery(currentValue);
			});
		}
		// Record analytics for selected suggestions
		_this4.triggerClickAnalytics(suggestion._click_id);
		// onValueSelected is user interaction driven:
		// it should be triggered irrespective of controlled (or)
		// uncontrolled component behavior
		_this4.onValueSelected(currentValue, _causes2.default.SUGGESTION_SELECT, suggestion.source);
	};

	this.onValueSelected = function (selectedValue, cause, source) {
		var onValueSelected = _this4.props.onValueSelected;

		if (onValueSelected) {
			onValueSelected(selectedValue, cause, source);
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

	this.handleVoiceResults = function (_ref2) {
		var results = _ref2.results;

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
		var _props12 = _this4.props,
		    showIcon = _props12.showIcon,
		    showClear = _props12.showClear,
		    renderMic = _props12.renderMic,
		    getMicInstance = _props12.getMicInstance,
		    showVoiceSearch = _props12.showVoiceSearch,
		    iconPosition = _props12.iconPosition,
		    innerClass = _props12.innerClass;


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
		var _props13 = _this4.props,
		    themePreset = _props13.themePreset,
		    theme = _props13.theme,
		    isLoading = _props13.isLoading,
		    renderNoSuggestion = _props13.renderNoSuggestion,
		    innerClass = _props13.innerClass,
		    renderError = _props13.renderError,
		    error = _props13.error;
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
		var _props14 = _this4.props,
		    loader = _props14.loader,
		    isLoading = _props14.isLoading,
		    themePreset = _props14.themePreset,
		    theme = _props14.theme,
		    innerClass = _props14.innerClass;
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
		var _props15 = _this4.props,
		    error = _props15.error,
		    renderError = _props15.renderError,
		    themePreset = _props15.themePreset,
		    theme = _props15.theme,
		    isLoading = _props15.isLoading,
		    innerClass = _props15.innerClass;
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
		var isQuerySuggestionsRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var _props16 = _this4.props,
		    error = _props16.error,
		    isLoading = _props16.isLoading,
		    aggregationData = _props16.aggregationData,
		    promotedResults = _props16.promotedResults,
		    customData = _props16.customData,
		    rawData = _props16.rawData;
		var currentValue = _this4.state.currentValue;

		var data = {
			error: error,
			loading: isLoading,
			downshiftProps: downshiftProps,
			data: _this4.parsedSuggestions,
			promotedData: promotedResults || [],
			customData: customData || {},
			rawData: rawData,
			aggregationData: aggregationData || [],
			value: currentValue,
			suggestions: _this4.state.suggestions,
			rawSuggestions: _this4.props.suggestions || [],
			categories: _this4.filteredCategories,
			rawCategories: _this4.props.categories,
			triggerClickAnalytics: _this4.triggerClickAnalytics,
			resultStats: _this4.stats,
			// TODO: Remove in v4
			querySuggestions: _this4.normalizedPopularSuggestions,
			popularSuggestions: _this4.normalizedPopularSuggestions,
			recentSearches: _this4.normalizedRecentSearches
		};
		if (isQuerySuggestionsRender) {
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
				return func(e, function () {
					return _this4.triggerQuery(_this4.props.value);
				});
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

CategorySearch.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,
	setSuggestionsSearchValue: _types2.default.funcRequired,
	fetchPopularSuggestions: _types2.default.funcRequired,
	defaultPopularSuggestions: _types2.default.suggestions,
	options: _types2.default.options,
	categories: _types2.default.data,
	rawData: _types2.default.rawData,
	promotedResults: _types2.default.hits,
	customData: _types2.default.title,
	selectedValue: _types2.default.selectedValue,
	selectedCategory: _types2.default.selectedValue,
	suggestions: _types2.default.suggestions,
	aggregationData: _types2.default.aggregationData,
	isLoading: _types2.default.bool,
	enableAppbase: _types2.default.bool,
	triggerAnalytics: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	setDefaultQuery: _types2.default.funcRequired,
	time: _types2.default.number,
	setCustomHighlightOptions: _types2.default.funcRequired,
	fetchRecentSearches: _types2.default.funcRequired,
	recentSearches: _types2.default.suggestions,
	// eslint-disable-next-line
	error: _types2.default.any,
	// component props
	autoFocus: _types2.default.bool,
	autosuggest: _types2.default.bool,
	enableSynonyms: _types2.default.bool,
	enableQuerySuggestions: _types2.default.bool,
	distinctField: _types2.default.string,
	distinctFieldConfig: _types2.default.componentObject,
	index: _types2.default.string,
	// TODO: Remove in v4
	enablePopularSuggestions: _types2.default.bool,
	enableRecentSearches: _types2.default.bool,
	queryString: _types2.default.bool,
	beforeValueChange: _types2.default.func,
	categoryField: _types2.default.string,
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
	defaultValue: _types2.default.categorySearchValue,
	value: _types2.default.categorySearchValue,
	defaultSuggestions: _types2.default.suggestions,
	downShiftProps: _types2.default.props,
	excludeFields: _types2.default.excludeFields,
	fieldWeights: _types2.default.fieldWeights,
	filterLabel: _types2.default.string,
	fuzziness: _types2.default.fuzziness,
	highlight: _types2.default.bool,
	highlightField: _types2.default.stringOrArray,
	icon: _types2.default.children,
	iconPosition: _types2.default.iconPosition,
	includeFields: _types2.default.includeFields,
	innerClass: _types2.default.style,
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
	renderError: _types2.default.title,
	// TODO: Remove in v4
	renderQuerySuggestions: _types2.default.func,
	renderPopularSuggestions: _types2.default.func,
	parseSuggestion: _types2.default.func,
	renderNoSuggestion: _types2.default.title,
	showClear: _types2.default.bool,
	showFilter: _types2.default.bool,
	showVoiceSearch: _types2.default.bool,
	showDistinctSuggestions: _types2.default.bool,
	showIcon: _types2.default.bool,
	style: _types2.default.style,
	title: _types2.default.title,
	theme: _types2.default.style,
	themePreset: _types2.default.themePreset,
	URLParams: _types2.default.bool,
	strictSelection: _types2.default.bool,
	searchOperators: _types2.default.bool,
	recentSearchesIcon: _types2.default.componentObject,
	popularSearchesIcon: _types2.default.componentObject,
	// Mic props
	getMicInstance: _types2.default.func,
	renderMic: _types2.default.func,
	enablePredictiveSuggestions: _types2.default.bool,
	//
	focusShortcuts: _types2.default.focusShortcuts,
	addonBefore: _types2.default.children,
	addonAfter: _types2.default.children,
	expandSuggestionsContainer: _types2.default.bool
};

CategorySearch.defaultProps = {
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
	showClear: false,
	showFilter: true,
	showIcon: true,
	style: {},
	URLParams: false,
	strictSelection: false,
	searchOperators: false,
	showVoiceSearch: false,
	showDistinctSuggestions: true,
	size: 10,
	defaultPopularSuggestions: [],
	recentSearches: [],
	time: 0,
	enablePredictiveSuggestions: false,
	autoFocus: false,
	focusShortcuts: ['/'],
	addonBefore: undefined,
	addonAfter: undefined,
	expandSuggestionsContainer: true
};

// Add componentType for SSR
CategorySearch.componentType = _constants.componentTypes.categorySearch;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		categories: state.aggregations[props.componentId] && state.aggregations[props.componentId][props.categoryField] && state.aggregations[props.componentId][props.categoryField].buckets || [],
		rawData: state.rawData[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		selectedCategory: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].category || null,
		suggestions: state.hits[props.componentId] && state.hits[props.componentId].hits || [],
		aggregationData: state.compositeAggregations[props.componentId] || [],
		themePreset: state.config.themePreset,
		isLoading: !!state.isLoading[props.componentId + '_active'],
		error: state.error[props.componentId],
		enableAppbase: state.config.enableAppbase,
		promotedResults: state.promotedResults[props.componentId],
		customData: state.customData[props.componentId],
		time: state.hits[props.componentId] && state.hits[props.componentId].time,
		total: state.hits[props.componentId] && state.hits[props.componentId].total,
		hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
		defaultPopularSuggestions: state.defaultPopularSuggestions[props.componentId],
		popularSuggestions: state.querySuggestions[props.componentId],
		recentSearches: state.recentSearches.data
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
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
		},
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		},
		triggerAnalytics: function triggerAnalytics(searchPosition, documentId) {
			return dispatch((0, _actions.recordSuggestionClick)(searchPosition, documentId));
		},
		fetchPopularSuggestions: function fetchPopularSuggestions(component) {
			return dispatch((0, _actions.loadPopularSuggestions)(component));
		},
		fetchRecentSearches: function fetchRecentSearches(queryOptions) {
			return dispatch((0, _actions.getRecentSearches)(queryOptions));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(function (props) {
	return (0, _core.jsx)(
		_ComponentWrapper2.default,
		_extends({}, props, {
			internalComponent: true,
			componentType: _constants.componentTypes.categorySearch
		}),
		function () {
			return (0, _core.jsx)(CategorySearch, _extends({ ref: props.myForwardedRef }, props));
		}
	);
}));

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return (0, _core.jsx)(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, CategorySearch);

ForwardRefComponent.displayName = 'CategorySearch';
exports.default = ForwardRefComponent;