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

var _transform = require('@rollinsb1010/reactivecore/lib/utils/transform');

var _constants = require('@rollinsb1010/reactivecore/lib/utils/constants');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _Title = require('../../styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Input = require('../../styles/Input');

var _Input2 = _interopRequireDefault(_Input);

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

var SingleDataList = function (_Component) {
	_inherits(SingleDataList, _Component);

	function SingleDataList(props) {
		_classCallCheck(this, SingleDataList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		var defaultValue = props.defaultValue || props.value;
		var currentValue = props.selectedValue || defaultValue || '';
		_this.state = {
			currentValue: currentValue,
			searchTerm: '',
			options: props.data || []
		};

		_this.internalComponent = (0, _transform.getInternalComponentID)(props.componentId);

		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, currentValue);
		(0, _helper.updateDefaultQuery)(props.componentId, props, currentValue);
		var hasMounted = false;

		if (props.showCount) {
			_this.updateQueryOptions(props);
		}

		if (currentValue) {
			_this.setValue(currentValue, true, props, hasMounted);
		}
		return _this;
	}

	SingleDataList.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    enableAppbase = _props.enableAppbase,
		    index = _props.index;

		if (!enableAppbase && index) {
			console.warn('Warning(ReactiveSearch): In order to use the `index` prop, the `enableAppbase` prop must be set to true in `ReactiveBase`.');
		}
	};

	SingleDataList.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentValue, _this2.props);

			if (_this2.props.showCount) {
				_this2.updateQueryOptions(_this2.props);
			}
		});

		(0, _helper.checkPropChange)(this.props.data, prevProps.data, function () {
			if (_this2.props.showCount) {
				_this2.updateQueryOptions(_this2.props);
			}
		});

		(0, _helper.checkPropChange)(this.props.options, prevProps.options, function () {
			if (_this2.props.options[_this2.props.dataField]) {
				_this2.updateStateOptions(_this2.props.options[_this2.props.dataField].buckets);
			}
		});

		// Treat defaultQuery and customQuery as reactive props
		if (!(0, _utils.isQueryIdentical)(this.state.currentValue, this.props, prevProps, 'defaultQuery')) {
			this.updateDefaultQuery();
			this.updateQuery('', this.props);
		}

		if (!(0, _utils.isQueryIdentical)(this.state.currentValue, this.props, prevProps, 'customQuery')) {
			this.updateQuery(this.state.currentValue, this.props);
		}

		if (this.props.value !== prevProps.value) {
			this.setValue(this.props.value);
		} else if (this.state.currentValue !== this.props.selectedValue && this.props.selectedValue !== prevProps.selectedValue) {
			var _props2 = this.props,
			    value = _props2.value,
			    onChange = _props2.onChange;

			if (value === undefined) {
				this.setValue(this.props.selectedValue || '');
			} else if (onChange) {
				onChange(this.props.selectedValue || '');
			} else {
				this.setValue(this.state.currentValue, true);
			}
		}
	};

	SingleDataList.generateQueryOptions = function generateQueryOptions(props, state) {
		var queryOptions = (0, _helper.getQueryOptions)(props);
		var includes = state.options.map(function (item) {
			return item.value;
		});
		return (0, _helper.getAggsQuery)(state.currentValue, queryOptions, props, includes);
	};

	SingleDataList.prototype.getComponent = function getComponent() {
		var currentValue = this.state.currentValue;

		var data = {
			value: currentValue,
			data: this.listItems,
			handleChange: this.handleClick,
			rawData: this.props.rawData
		};
		return (0, _utils.getComponent)(data, this.props);
	};

	SingleDataList.prototype.render = function render() {
		var _this3 = this;

		var _props3 = this.props,
		    selectAllLabel = _props3.selectAllLabel,
		    showCount = _props3.showCount,
		    renderItem = _props3.renderItem;
		var options = this.state.options;


		if (!this.hasCustomRenderer && options.length === 0) {
			return this.props.renderNoResults ? this.props.renderNoResults() : null;
		}

		var listItems = this.listItems;

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
					'aria-label': this.props.componentId + '-items',
					role: 'radiogroup'
				},
				selectAllLabel && _react2.default.createElement(
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
						onChange: this.handleClick,
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
				),
				listItems.length ? listItems.map(function (item) {
					var isChecked = _this3.state.currentValue === item.label;
					return _react2.default.createElement(
						'li',
						{
							key: item.label,
							className: '' + (isChecked ? 'active' : ''),
							role: 'radio',
							'aria-checked': isChecked
						},
						_react2.default.createElement(_FormControlList.Radio, {
							className: (0, _helper.getClassName)(_this3.props.innerClass, 'radio'),
							id: _this3.props.componentId + '-' + item.label,
							tabIndex: isChecked ? '-1' : '0',
							value: item.label,
							onClick: _this3.handleClick,
							readOnly: true,
							checked: isChecked,
							show: _this3.props.showRadio
						}),
						_react2.default.createElement(
							'label',
							{
								className: (0, _helper.getClassName)(_this3.props.innerClass, 'label') || null,
								htmlFor: _this3.props.componentId + '-' + item.label
							},
							renderItem ? renderItem(item.label, item.count, isChecked) : _react2.default.createElement(
								'span',
								null,
								item.label,
								showCount && item.count && _react2.default.createElement(
									'span',
									{
										className: (0, _helper.getClassName)(_this3.props.innerClass, 'count') || null
									},
									'\xA0(',
									item.count,
									')'
								)
							)
						)
					);
				}) // prettier-ignore
				: this.props.renderNoResults && this.props.renderNoResults()
			)
		);
	};

	_createClass(SingleDataList, [{
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}, {
		key: 'listItems',
		get: function get() {
			var _this4 = this;

			var options = this.state.options;


			var listItems = options.filter(function (item) {
				if (_this4.props.showSearch && _this4.state.searchTerm) {
					return item.label.toLowerCase().includes(_this4.state.searchTerm.toLowerCase());
				}
				return true;
			});
			return listItems;
		}
	}]);

	return SingleDataList;
}(_react.Component);

SingleDataList.defaultQuery = function (value, props) {
	var query = null;
	if (props.selectAllLabel && props.selectAllLabel === value) {
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

	this.updateDefaultQuery = function (queryOptions) {
		var currentValue = _this5.state.currentValue;
		// Update default query for RS API

		(0, _helper.updateDefaultQuery)(_this5.props.componentId, _this5.props, currentValue);
		(0, _helper.updateInternalQuery)(_this5.internalComponent, queryOptions, currentValue, _this5.props, SingleDataList.generateQueryOptions(_this5.props, _this5.state), null);
	};

	this.updateQuery = function (value, props) {
		var customQuery = props.customQuery;

		var customQueryOptions = void 0;

		var currentValue = value;
		if (value !== props.selectAllLabel) {
			currentValue = props.data.find(function (item) {
				return item.label === value;
			});
			currentValue = currentValue ? currentValue.value : null;
		}
		var query = SingleDataList.defaultQuery(currentValue, props);
		if (customQuery) {
			var _ref = customQuery(currentValue, props) || {};

			query = _ref.query;

			customQueryOptions = (0, _helper.getOptionsFromQuery)(customQuery(currentValue, props));
			(0, _helper.updateCustomQuery)(props.componentId, props, value);
		}
		props.setQueryOptions(props.componentId, customQueryOptions);

		props.updateQuery({
			componentId: props.componentId,
			query: query,
			value: currentValue ? value : null,
			label: props.filterLabel,
			showFilter: props.showFilter,
			URLParams: props.URLParams,
			componentType: _constants.componentTypes.singleDataList
		});
	};

	this.updateQueryOptions = function (props) {
		var queryOptions = SingleDataList.generateQueryOptions(props, _this5.state);
		if (props.defaultQuery) {
			var value = _this5.state.currentValue;
			var defaultQueryOptions = (0, _helper.getOptionsFromQuery)(props.defaultQuery(value, props));
			props.setQueryOptions(_this5.internalComponent, _extends({}, queryOptions, defaultQueryOptions));
			(0, _helper.updateDefaultQuery)(props.componentId, props, value);
		} else {
			props.setQueryOptions(_this5.internalComponent, queryOptions);
		}
	};

	this.updateStateOptions = function (bucket) {
		if (bucket) {
			var bucketDictionary = bucket.reduce(function (obj, item) {
				var _extends2;

				return _extends({}, obj, (_extends2 = {}, _extends2[item.key] = item.doc_count, _extends2));
			}, {});

			var options = _this5.state.options;

			var newOptions = options.map(function (item) {
				if (bucketDictionary[item.value]) {
					return _extends({}, item, {
						count: bucketDictionary[item.value]
					});
				}

				return item;
			});

			_this5.setState({
				options: newOptions
			});
		}
	};

	this.handleInputChange = function (e) {
		var value = e.target.value;

		_this5.setState({
			searchTerm: value
		});
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
		var _props4 = _this5.props,
		    value = _props4.value,
		    onChange = _props4.onChange;

		if (value === undefined) {
			_this5.setValue(currentValue);
		} else if (onChange) {
			onChange(currentValue);
		}
		return true;
	};
};

SingleDataList.propTypes = {
	setQueryOptions: _types2.default.funcRequired,
	updateQuery: _types2.default.funcRequired,

	selectedValue: _types2.default.selectedValue,
	options: _types2.default.options,
	rawData: _types2.default.rawData,
	setCustomQuery: _types2.default.funcRequired,
	enableAppbase: _types2.default.bool,
	// component props
	beforeValueChange: _types2.default.func,
	children: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	customQuery: _types2.default.func,
	data: _types2.default.data,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.string,
	value: _types2.default.string,
	filterLabel: _types2.default.string,
	innerClass: _types2.default.style,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	onChange: _types2.default.func,
	placeholder: _types2.default.string,
	nestedField: _types2.default.string,
	react: _types2.default.react,
	selectAllLabel: _types2.default.string,
	showFilter: _types2.default.bool,
	showRadio: _types2.default.boolRequired,
	showSearch: _types2.default.bool,
	style: _types2.default.style,
	themePreset: _types2.default.themePreset,
	title: _types2.default.title,
	URLParams: _types2.default.bool,
	showCount: _types2.default.bool,
	render: _types2.default.func,
	renderItem: _types2.default.func,
	renderNoResults: _types2.default.func,
	index: _types2.default.string,
	enableStrictSelection: _types2.default.bool
};

SingleDataList.defaultProps = {
	className: null,
	placeholder: 'Search',
	showFilter: true,
	showRadio: true,
	showSearch: true,
	style: {},
	URLParams: false,
	showCount: false,
	enableStrictSelection: false
};

// Add componentType for SSR
SingleDataList.componentType = _constants.componentTypes.singleDataList;

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		rawData: state.rawData[props.componentId],
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		themePreset: state.config.themePreset,
		options: props.nestedField && state.aggregations[props.componentId] ? state.aggregations[props.componentId].reactivesearch_nested : state.aggregations[props.componentId],
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

		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		},

		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return _react2.default.createElement(
		_ComponentWrapper2.default,
		_extends({}, props, { internalComponent: true, componentType: _constants.componentTypes.singleDataList }),
		function () {
			return _react2.default.createElement(SingleDataList, _extends({ ref: props.myForwardedRef }, props));
		}
	);
});

// eslint-disable-next-line
var ForwardRefComponent = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});
(0, _hoistNonReactStatics2.default)(ForwardRefComponent, SingleDataList);

ForwardRefComponent.displayName = 'SingleDataList';
exports.default = ForwardRefComponent;