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

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Input = require('../../styles/Input');

var _Input2 = _interopRequireDefault(_Input);

var _Button = require('../../styles/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Container = require('../../styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _FormControlList = require('../../styles/FormControlList');

var _utils = require('../../utils');

var _ComponentWrapper = require('../basic/ComponentWrapper');

var _ComponentWrapper2 = _interopRequireDefault(_ComponentWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// showLoadMore is experimental API and works only with ES6
var SingleList = function (_Component) {
	_inherits(SingleList, _Component);

	function SingleList(props) {
		_classCallCheck(this, SingleList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var currentValue = props.selectedValue || defaultValue;

		_this.state = {
			currentValue: currentValue || '',
			options: props.options && props.options[props.dataField] ? _this.getOptions(props.options[props.dataField].buckets, props) : [],
			searchTerm: '',
			after: {}, // for composite aggs,
			prevAfter: {}, // useful when we want to prevent the showLoadMore results
			isLastBucket: false
		};
		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);

		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		(0, _helper.updateDefaultQuery)(props.componentId, props, currentValue);
		_this.updateQueryOptions(props);

		var hasMounted = false;

		if (currentValue) {
			_this.setValue(currentValue, true, props, hasMounted);
		}
		return _this;
	}

	SingleList.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	SingleList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkPropChange)(prevProps.options, this.props.options, function () {
			var _props2 = _this2.props,
			    showLoadMore = _props2.showLoadMore,
			    dataField = _props2.dataField,
			    options = _props2.options;


			if (showLoadMore && options && options[dataField]) {
				var buckets = options[dataField].buckets;

				var after = options[dataField].after_key;
				var prevAfter = prevProps.options && prevProps.options[dataField] && prevProps.options[dataField].after_key;
				// detect the last bucket by checking if the
				// after key is absent
				var isLastBucket = !after;
				_this2.setState(function (state) {
					return _extends({}, state, {
						after: after ? { after: after } : state.after,
						prevAfter: prevAfter ? { after: prevAfter } : state.prevAfter,
						isLastBucket: isLastBucket,
						options: _this2.getOptions(buckets, _this2.props)
					});
				});
			} else {
				_this2.setState({
					options: options && options[dataField] ? _this2.getOptions(options[dataField].buckets, _this2.props) : []
				});
			}
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

		(0, _helper.checkSomePropChange)(prevProps, this.props, ['size', 'sortBy'], function () {
			return _this2.updateQueryOptions(_this2.props);
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
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
				this.setValue(this.state.currentValue, true);
			}
		}
	};

	SingleList.generateQueryOptions = function generateQueryOptions(props, after, value) {
		var queryOptions = (0, _helper.getQueryOptions)(props);
		return props.showLoadMore ? (0, _helper.getCompositeAggsQuery)({
			value: value,
			query: queryOptions,
			props: props,
			after: after
		}) : (0, _helper.getAggsQuery)(value, queryOptions, props);
	};

	SingleList.prototype.getComponent = function getComponent() {
		var _props4 = this.props,
		    error = _props4.error,
		    isLoading = _props4.isLoading,
		    rawData = _props4.rawData;
		var currentValue = this.state.currentValue;

		var data = {
			error: error,
			loading: isLoading,
			value: currentValue,
			data: this.listItems,
			rawData: rawData,
			handleChange: this.handleClick
		};
		return (0, _utils.getComponent)(data, this.props);
	};

	SingleList.prototype.render = function render() {
		var _this3 = this;

		var _props5 = this.props,
		    selectAllLabel = _props5.selectAllLabel,
		    renderItem = _props5.renderItem,
		    showLoadMore = _props5.showLoadMore,
		    loadMoreLabel = _props5.loadMoreLabel,
		    renderError = _props5.renderError,
		    error = _props5.error,
		    isLoading = _props5.isLoading;
		var isLastBucket = this.state.isLastBucket;


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

		var isAllChecked = this.state.currentValue === selectAllLabel;

		return _react2.default.createElement(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && _react2.default.createElement(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.renderSearch(),
			this.hasCustomRenderer ? this.getComponent() : _react2.default.createElement(
				_FormControlList.UL,
				{
					className: (0, _helper.getClassName)(this.props.innerClass, 'list') || null,
					role: 'radiogroup',
					'aria-label': this.props.componentId + '-items'
				},
				selectAllLabel ? _react2.default.createElement(
					'li',
					{
						key: selectAllLabel,
						className: '' + (isAllChecked ? 'active' : ''),
						role: 'radio',
						'aria-checked': isAllChecked
					},
					_react2.default.createElement(_FormControlList.Radio, {
						className: (0, _helper.getClassName)(this.props.innerClass, 'radio'),
						id: this.props.componentId + '-' + selectAllLabel,
						value: selectAllLabel,
						tabIndex: isAllChecked ? '-1' : '0',
						onClick: this.handleClick,
						readOnly: true,
						checked: isAllChecked,
						show: this.props.showRadio
					}),
					_react2.default.createElement(
						'label',
						{
							className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null,
							htmlFor: this.props.componentId + '-' + selectAllLabel
						},
						selectAllLabel
					)
				) : null,
				this.listItems.length ? this.listItems.map(function (item) {
					var isChecked = _this3.state.currentValue === String(item.key);
					return _react2.default.createElement(
						'li',
						{ key: item.key, className: '' + (isChecked ? 'active' : ''), role: 'radio', 'aria-checked': isChecked },
						_react2.default.createElement(_FormControlList.Radio, {
							className: (0, _helper.getClassName)(_this3.props.innerClass, 'radio'),
							id: _this3.props.componentId + '-' + item.key,
							tabIndex: isChecked ? '-1' : '0',
							value: item.key,
							readOnly: true,
							onClick: _this3.handleClick,
							checked: isChecked,
							show: _this3.props.showRadio
						}),
						_react2.default.createElement(
							'label',
							{
								className: (0, _helper.getClassName)(_this3.props.innerClass, 'label') || null,
								htmlFor: _this3.props.componentId + '-' + item.key
							},
							renderItem ? renderItem(item.key, item.doc_count, isChecked) : _react2.default.createElement(
								'span',
								null,
								_react2.default.createElement(
									'span',
									null,
									item.key
								),
								_this3.props.showCount && _react2.default.createElement(
									'span',
									{
										className: (0, _helper.getClassName)(_this3.props.innerClass, 'count') || null
									},
									item.doc_count
								)
							)
						)
					);
				}) // prettier-ignore
				: this.props.renderNoResults && this.props.renderNoResults(),
				showLoadMore && !isLastBucket && _react2.default.createElement(
					'div',
					{ css: _Button.loadMoreContainer },
					_react2.default.createElement(
						_Button2.default,
						{ disabled: isLoading, onClick: this.handleLoadMore },
						loadMoreLabel
					)
				)
			)
		);
	};

	_createClass(SingleList, [{
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}, {
		key: 'listItems',
		get: function get() {
			var _this4 = this;

			var itemsToRender = this.state.options;

			if (this.props.transformData) {
				itemsToRender = this.props.transformData(itemsToRender);
			}

			var listItems = itemsToRender.filter(function (item) {
				if (String(item.key).length) {
					if (_this4.props.showSearch && _this4.state.searchTerm) {
						return String(item.key).toLowerCase().includes(_this4.state.searchTerm.toLowerCase());
					}
					return true;
				}
				return false;
			});

			return listItems;
		}
	}]);

	return SingleList;
}(_react.Component);

SingleList.defaultQuery = function (value, props) {
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

		query = {
			term: (_term = {}, _term[props.dataField] = value, _term)
		};
		if (props.showMissing && props.missingLabel === value) {
			query = {
				bool: {
					must_not: {
						exists: { field: props.dataField }
					}
				}
			};
		}
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
	var _this5 = this;

	this.getOptions = function (buckets, props) {
		if (props.showLoadMore) {
			return buckets.map(function (bucket) {
				return {
					key: bucket.key[props.dataField],
					doc_count: bucket.doc_count
				};
			});
		}

		return buckets;
	};

	this.setValue = function (nextValue) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this5.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		var value = nextValue;
		if (isDefaultValue) {
			value = nextValue;
		} else if (nextValue === _this5.state.currentValue && hasMounted) {
			value = '';
		}
		var performUpdate = function performUpdate() {
			var handleUpdates = function handleUpdates() {
				_this5.updateQuery(value, props);
				if (props.onValueChange) props.onValueChange(value);
			};
			if (hasMounted) {
				_this5.setState({
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

		var query = SingleList.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref = customQuery(value, props) || {};

			query = _ref.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, _extends({}, SingleList.generateQueryOptions(props, _this5.state.prevAfter, _this5.state.currentValue), customQueryOptions));
		props.updateQuery({
			componentId: props.componentId,
			query: query,
			value: value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.singleList
		});
	};

	this.updateDefaultQuery = function (queryOptions) {
		var currentValue = _this5.state.currentValue;

		(0, _helper.updateDefaultQuery)(_this5.props.componentId, _this5.props, currentValue);
		(0, _helper.updateInternalQuery)(_this5.internalComponent, queryOptions, currentValue, _this5.props, SingleList.generateQueryOptions(_this5.props, _this5.state.prevAfter, currentValue));
	};

	this.updateQueryOptions = function (props) {
		var addAfterKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		// when using composite aggs flush the current options for a fresh query
		if (props.showLoadMore && !addAfterKey) {
			_this5.setState({
				options: []
			});
		}
		// for a new query due to other changes don't append after to get fresh results
		var queryOptions = SingleList.generateQueryOptions(props, addAfterKey ? _this5.state.after : {}, _this5.state.currentValue);
		if (props.defaultQuery) {
			_this5.updateDefaultQuery(queryOptions);
		} else {
			props.setQueryOptions(_this5.internalComponent, queryOptions);
		}
	};

	this.handleInputChange = function (e) {
		var value = e.target.value;

		_this5.setState({
			searchTerm: value
		});
	};

	this.handleLoadMore = function () {
		var queryOptions = SingleList.generateQueryOptions(_this5.props, _this5.state.after, _this5.state.currentValue);
		_this5.props.loadMore(_this5.props.componentId, queryOptions);
	};

	this.renderSearch = function () {
		if (_this5.props.showSearch) {
			return _react2.default.createElement(_Input2.default, {
				className: (0, _helper.getClassName)(_this5.props.innerClass, 'input') || null,
				onChange: _this5.handleInputChange,
				value: _this5.state.searchTerm,
				placeholder: _this5.props.placeholder,
				style: {
					margin: '0 0 8px'
				},
				'aria-label': _this5.props.componentId + '-search',
				themePreset: _this5.props.themePreset
			});
		}
		return null;
	};

	this.handleClick = function (e) {
		var currentValue = e;
		if ((0, _utils.isEvent)(e)) {
			currentValue = e.target.value;
		}
		var enableStrictSelection = _this5.props.enableStrictSelection;

		if (enableStrictSelection && currentValue === _this5.state.currentValue) {
			return false;
		}
		var _props6 = _this5.props,
		    value = _props6.value,
		    onChange = _props6.onChange;

		if (value === undefined) {
			_this5.setValue(currentValue);
		} else if (onChange) {
			onChange(currentValue);
		}
		return false;
	};
};

SingleList.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	loadMore: _types2.default.funcRequired,
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
	defaultValue: _types2.default.string,
	value: _types2.default.string,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	loader: _types2.default.title,
	onQueryChange: _types2.default.func,
	onError: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	placeholder: _types2.default.string,
	react: _types2.default.react,
	render: _types2.default.func,
	renderItem: _types2.default.func,
	renderError: _types2.default.title,
	renderNoResults: _types2.default.func,
	transformData: _types2.default.func,
	selectAllLabel: _types2.default.string,
	showCount: _types2.default.bool,
	showFilter: _types2.default.bool,
	showRadio: _types2.default.boolRequired,
	showSearch: _types2.default.bool,
	size: _types2.default.number,
	sortBy: _types2.default.sortByWithCount,
	style: _types2.default.style,
	themePreset: _types2.default.themePreset,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	showMissing: _types2.default.bool,
	missingLabel: _types2.default.string,
	showLoadMore: _types2.default.bool,
	loadMoreLabel: _types2.default.title,
	nestedField: _types2.default.string,
	index: _types2.default.string,
	enableStrictSelection: _types2.default.bool
};

SingleList.defaultProps = {
	className: null,
	placeholder: 'Search',
	showCount: true,
	showFilter: true,
	showRadio: true,
	showSearch: true,
	size: 100,
	sortBy: 'count',
	style: {},
	URLParams: false,
	showMissing: false,
	missingLabel: 'N/A',
	showLoadMore: false,
	loadMoreLabel: 'Load More',
	enableStrictSelection: false
};

// Add componentType for SSR
SingleList.componentType = _constants.componentTypes.singleList;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		rawData: state.rawData[props.componentId],
		options: props.nestedField && state.aggregations[props.componentId] ? state.aggregations[props.componentId].reactivesearch_nested : state.aggregations[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || '',
		themePreset: state.config.themePreset,
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
		setDefaultQuery: function setDefaultQuery(component, query) {
			return dispatch((0, _actions.setDefaultQuery)(component, query));
		},

		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		},
		loadMore: function loadMore(component, aggsQuery) {
			return dispatch((0, _actions.loadMore)(component, aggsQuery, true, true));
		},

		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return _react2.default.createElement(
		_ComponentWrapper2.default,
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.singleList }),
		function () {
			return _react2.default.createElement(SingleList, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, SingleList);

ForwardRefComponent.displayName = 'SingleList';
exports.default = ForwardRefComponent;