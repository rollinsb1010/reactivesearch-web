'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiList = function (_Component) {
	_inherits(MultiList, _Component);

	function MultiList(props) {
		_classCallCheck(this, MultiList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var currentValueArray = props.selectedValue || defaultValue || [];
		var currentValue = {};
		currentValueArray.forEach(function (item) {
			currentValue[item] = true;
		});

		var options = props.options && props.options[props.dataField] ? _this.getOptions(props.options[props.dataField].buckets, props) : [];

		_this.state = {
			currentValue: currentValue,
			options: options,
			searchTerm: '',
			after: {}, // for composite aggs,
			prevAfter: {}, // useful when we want to prevent the showLoadMore results
			isLastBucket: false
		};
		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);

		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValueArray);
		(0, _helper.updateDefaultQuery)(props.componentId, props, currentValueArray);

		var hasMounted = false;

		_this.updateQueryOptions(props, false, hasMounted);

		if (currentValueArray.length) {
			_this.setValue(currentValueArray, true, props, hasMounted);
		}
		return _this;
	}

	MultiList.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	MultiList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkPropChange)(this.props.options, prevProps.options, function () {
			var _props2 = _this2.props,
			    showLoadMore = _props2.showLoadMore,
			    dataField = _props2.dataField,
			    options = _props2.options;

			if (showLoadMore && options && options[dataField]) {
				var buckets = options[dataField].buckets;

				var after = options[dataField].after_key;
				var prevAfter = prevProps.options && prevProps.options[dataField] && prevProps.options[dataField].after_key;
				// detect the last bucket by checking if the after key is absent
				var isLastBucket = !after;
				_this2.setState(function (state) {
					return _extends({}, state, {
						prevAfter: prevAfter ? { after: prevAfter } : state.prevAfter,
						after: after ? { after: after } : state.after,
						isLastBucket: isLastBucket,
						options: _this2.getOptions(buckets, _this2.props)
					});
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
					options: options && options[dataField] ? _this2.getOptions(options[dataField].buckets, _this2.props) : []
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

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
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

	MultiList.generateQueryOptions = function generateQueryOptions(props, after) {
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

	MultiList.prototype.getComponent = function getComponent() {
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
			handleChange: this.handleClick,
			rawData: rawData
		};
		return (0, _utils.getComponent)(data, this.props);
	};

	MultiList.prototype.render = function render() {
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

		if (!this.hasCustomRenderer && this.state.options && this.state.options.length === 0) {
			return this.props.renderNoResults ? this.props.renderNoResults() : null;
		}

		var listItems = this.listItems;

		var isAllChecked = selectAllLabel ? !!this.state.currentValue[selectAllLabel] : false;
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
					role: 'listbox',
					'aria-label': this.props.componentId + '-items'
				},
				selectAllLabel ? _react2.default.createElement(
					'li',
					{
						key: selectAllLabel,
						className: '' + (isAllChecked ? 'active' : ''),
						role: 'option',
						'aria-checked': isAllChecked,
						'aria-selected': isAllChecked
					},
					_react2.default.createElement(_FormControlList.Checkbox, {
						className: (0, _helper.getClassName)(this.props.innerClass, 'checkbox') || null,
						id: this.props.componentId + '-' + selectAllLabel,
						name: selectAllLabel,
						value: selectAllLabel,
						onChange: this.handleClick,
						checked: isAllChecked,
						show: this.props.showCheckbox
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
				listItems.length ? listItems.map(function (item) {
					var isChecked = !!_this3.state.currentValue[item.key];
					return _react2.default.createElement(
						'li',
						{
							key: item.key,
							className: '' + (isChecked ? 'active' : ''),
							role: 'option',
							'aria-checked': isChecked,
							'aria-selected': isChecked
						},
						_react2.default.createElement(_FormControlList.Checkbox, {
							className: (0, _helper.getClassName)(_this3.props.innerClass, 'checkbox') || null,
							id: _this3.props.componentId + '-' + item.key,
							name: _this3.props.componentId + '-' + item.key,
							value: item.key,
							onChange: _this3.handleClick,
							checked: isChecked,
							show: _this3.props.showCheckbox
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

	_createClass(MultiList, [{
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

	return MultiList;
}(_react.Component);

MultiList.defaultQuery = function (value, props) {
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

	this.setValue = function (value) {
		var isDefaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this5.props;
		var hasMounted = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
		var selectAllLabel = props.selectAllLabel;
		var currentValue = _this5.state.currentValue;

		var finalValues = null;
		if (selectAllLabel && (Array.isArray(value) && value.includes(selectAllLabel) || typeof value === 'string' && value === selectAllLabel)) {
			if (currentValue[selectAllLabel] && hasMounted && !isDefaultValue) {
				currentValue = {};
				finalValues = [];
			} else {
				_this5.state.options.forEach(function (item) {
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
				_this5.updateQuery(finalValues, props);
				if (props.onValueChange) props.onValueChange(finalValues);
			};

			if (hasMounted) {
				_this5.setState({
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

		var query = MultiList.defaultQuery(value, props);
		var customQueryOptions = void 0;
		if (customQuery) {
			var _ref3 = customQuery(value, props) || {};

			query = _ref3.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(value, props));
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, _extends({}, MultiList.generateQueryOptions(props, _this5.state.prevAfter, _this5.state.currentValue), customQueryOptions));

		props.updateQuery({
			componentId: props.componentId,
			query: query,
			value: value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.multiList
		});
	};

	this.updateDefaultQuery = function (queryOptions) {
		var value = Object.keys(_this5.state.currentValue);
		// Update default query for RS API
		(0, _helper.updateDefaultQuery)(_this5.props.componentId, _this5.props, value);
		(0, _helper.updateInternalQuery)(_this5.internalComponent, queryOptions, value, _this5.props, MultiList.generateQueryOptions(_this5.props, _this5.state.prevAfter, _this5.state.currentValue), null);
	};

	this.updateQueryOptions = function (props) {
		var addAfterKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var hasMounted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

		// when using composite aggs flush the current options for a fresh query
		if (props.showLoadMore && !addAfterKey) {
			if (hasMounted) {
				_this5.setState({
					options: []
				});
			} else {
				_this5.state = _extends({}, _this5.state || {}, {
					options: []
				});
			}
		}
		// for a new query due to other changes don't append after to get fresh results
		var queryOptions = MultiList.generateQueryOptions(props, addAfterKey ? _this5.state.after : {}, _this5.state.currentValue);
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
		var queryOptions = MultiList.generateQueryOptions(_this5.props, _this5.state.after, _this5.state.currentValue);
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
		var _props6 = _this5.props,
		    value = _props6.value,
		    onChange = _props6.onChange,
		    selectAllLabel = _props6.selectAllLabel;

		if (value === undefined) {
			_this5.setValue(currentValue);
		} else if (onChange) {
			var valueToSet = (0, _utils.parseValueArray)(value, currentValue);
			if (selectAllLabel) {
				// Remove selectAllLabel if any other option is selected
				if (currentValue === selectAllLabel) {
					if (value === selectAllLabel || Array.isArray(value) && value.includes(selectAllLabel)) {
						valueToSet = [];
					} else {
						var options = [];
						_this5.state.options.forEach(function (item) {
							options.unshift(item.key);
						});
						options.unshift(selectAllLabel);
						valueToSet = options;
					}
				} else if (Array.isArray(valueToSet) && valueToSet.length > 1 && valueToSet.includes(selectAllLabel)) {
					valueToSet = valueToSet.filter(function (val) {
						return val !== selectAllLabel;
					});
				}
			}
			onChange(valueToSet);
		}
	};
};

MultiList.propTypes = {
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
	nestedField: _types2.default.string,
	defaultValue: _types2.default.stringArray,
	value: _types2.default.stringArray,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	loader: _types2.default.title,
	onError: _types2.default.func,
	renderNoResults: _types2.default.func,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	placeholder: _types2.default.string,
	queryFormat: _types2.default.queryFormatSearch,
	react: _types2.default.react,
	render: _types2.default.func,
	renderItem: _types2.default.func,
	renderError: _types2.default.title,
	transformData: _types2.default.func,
	selectAllLabel: _types2.default.string,
	showCheckbox: _types2.default.boolRequired,
	showCount: _types2.default.bool,
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
	index: _types2.default.string
};

MultiList.defaultProps = {
	className: null,
	placeholder: 'Search',
	queryFormat: 'or',
	showCheckbox: true,
	showCount: true,
	showSearch: true,
	size: 100,
	sortBy: 'count',
	style: {},
	URLParams: false,
	showMissing: false,
	missingLabel: 'N/A',
	showLoadMore: false,
	loadMoreLabel: 'Load More'
};

// Add componentType for SSR
MultiList.componentType = _constants.componentTypes.multiList;

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
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.multiList }),
		function () {
			return _react2.default.createElement(MultiList, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, MultiList);

ForwardRefComponent.displayName = 'MultiList';
exports.default = ForwardRefComponent;