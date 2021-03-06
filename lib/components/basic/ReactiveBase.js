'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _appbaseJs = require('appbase-js');

var _appbaseJs2 = _interopRequireDefault(_appbaseJs);

require('url-search-params-polyfill');

var _emotionTheming = require('emotion-theming');

var _reactivecore = require('@rollinsb1010/reactivecore');

var _reactivecore2 = _interopRequireDefault(_reactivecore);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _analytics = require('@rollinsb1010/reactivecore/lib/actions/analytics');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _URLParamsProvider = require('./URLParamsProvider');

var _URLParamsProvider2 = _interopRequireDefault(_URLParamsProvider);

var _theme = require('../../styles/theme');

var _theme2 = _interopRequireDefault(_theme);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable global-require */

var ReactiveBase = function (_Component) {
	_inherits(ReactiveBase, _Component);

	function ReactiveBase(props) {
		_classCallCheck(this, ReactiveBase);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.state = {
			key: '__REACTIVE_BASE__'
		};

		_this.setStore(props);
		return _this;
	}

	ReactiveBase.prototype.componentDidMount = function componentDidMount() {
		var _props = this.props,
		    searchStateHeader = _props.searchStateHeader,
		    analyticsConfig = _props.analyticsConfig,
		    analytics = _props.analytics;
		// TODO: Remove in 4.0

		if (searchStateHeader !== undefined) {
			console.warn('Warning(ReactiveSearch): The `searchStateHeader` prop has been marked as deprecated, please use the `appbaseConfig` prop instead.');
		}
		// TODO: Remove in 4.0
		if (analyticsConfig !== undefined) {
			console.warn('Warning(ReactiveSearch): The `analyticsConfig` prop has been marked as deprecated, please use the `appbaseConfig` prop instead.');
		}
		// TODO: Remove in 4.0
		if (analytics !== undefined) {
			console.warn('Warning(ReactiveSearch): The `analytics` prop has been marked as deprecated, please set the `recordAnalytics` property as `true` in `appbaseConfig` prop instead.');
		}
	};

	ReactiveBase.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['app', 'url', 'type', 'credentials', 'mapKey', 'headers', 'graphQLUrl'], function () {
			_this2.setStore(_this2.props);
			_this2.setState(function (state) {
				return {
					key: state.key + '-0'
				};
			});
		});
		(0, _helper.checkSomePropChange)(this.props, prevProps, ['analyticsConfig'], function () {
			if (_this2.store) {
				_this2.store.dispatch((0, _analytics.updateAnalyticsConfig)(_this2.props.analyticsConfig));
			}
		});
		(0, _helper.checkSomePropChange)(this.props, prevProps, ['appbaseConfig'], function () {
			if (_this2.store) {
				_this2.store.dispatch((0, _analytics.updateAnalyticsConfig)(_this2.props.appbaseConfig));
			}
		});
	};

	ReactiveBase.prototype.componentDidCatch = function componentDidCatch(error, errorInfo) {
		console.error("An error has occured. You're using Reactivesearch Version:", (process.env.VERSION || require('../../../package.json').version) + '.', 'If you think this is a problem with Reactivesearch, please try updating', "to the latest version. If you're already at the latest version, please open", 'an issue at https://github.com/appbaseio/reactivesearch/issues', error, errorInfo);
	};

	ReactiveBase.prototype.render = function render() {
		var theme = (0, _utils.composeThemeObject)((0, _theme2.default)(this.props.themePreset), this.props.theme);
		return _react2.default.createElement(
			_emotionTheming.ThemeProvider,
			{ theme: theme, key: this.state.key },
			_react2.default.createElement(
				_reactRedux.Provider,
				{ context: _utils.ReactReduxContext, store: this.store },
				_react2.default.createElement(
					_URLParamsProvider2.default,
					{
						headers: this.props.headers,
						style: this.props.style,
						as: this.props.as,
						className: this.props.className,
						getSearchParams: this.props.getSearchParams,
						setSearchParams: this.props.setSearchParams
					},
					this.props.children
				)
			)
		);
	};

	return ReactiveBase;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
	var _this3 = this;

	this.setStore = function (props) {
		_this3.type = props.type ? props.type : '*';

		var credentials = props.url && props.url.trim() !== '' && !props.credentials ? null : props.credentials;

		var appbaseConfig = _extends({
			searchStateHeader: props.searchStateHeader }, props.analyticsConfig, props.appbaseConfig);
		var config = {
			url: props.url && props.url.trim() !== '' ? props.url : 'https://scalr.api.appbase.io',
			app: props.app,
			credentials: credentials,
			type: _this3.type,
			transformRequest: props.transformRequest,
			analytics: props.appbaseConfig ? props.appbaseConfig.recordAnalytics : !!props.analytics,
			enableAppbase: props.enableAppbase,
			analyticsConfig: appbaseConfig,
			graphQLUrl: props.graphQLUrl,
			transformResponse: props.transformResponse
		};

		var queryParams = '';
		if (typeof window !== 'undefined') {
			queryParams = props.getSearchParams ? props.getSearchParams() : window.location.search;
		} else {
			queryParams = props.queryParams || '';
		}

		var params = new URLSearchParams(queryParams);
		var selectedValues = {};
		var urlValues = {};

		Array.from(params.keys()).forEach(function (key) {
			try {
				var _extends2, _extends3;

				var parsedParams = JSON.parse(params.get(key));
				var selectedValue = {};
				if (parsedParams.value) {
					selectedValue.value = parsedParams.value;
				} else {
					selectedValue.value = parsedParams;
				}
				if (parsedParams.category) selectedValue.category = parsedParams.category;
				selectedValue.reference = 'URL';
				selectedValues = _extends({}, selectedValues, (_extends2 = {}, _extends2[key] = selectedValue, _extends2));
				urlValues = _extends({}, urlValues, (_extends3 = {}, _extends3[key] = selectedValue.value, _extends3));
			} catch (e) {
				// Do not add to selectedValues if JSON parsing fails.
			}
		});

		var _props$headers = props.headers,
		    headers = _props$headers === undefined ? {} : _props$headers,
		    themePreset = props.themePreset;

		var appbaseRef = (0, _appbaseJs2.default)(config);
		if (_this3.props.transformRequest) {
			appbaseRef.transformRequest = _this3.props.transformRequest;
		}

		var initialState = _extends({
			config: _extends({}, config, {
				mapKey: props.mapKey,
				themePreset: themePreset,
				initialQueriesSyncTime: props.initialQueriesSyncTime,
				initialTimestamp: new Date().getTime()
			}),
			appbaseRef: appbaseRef,
			selectedValues: selectedValues,
			urlValues: urlValues,
			headers: headers
		}, _this3.props.initialState);
		_this3.store = (0, _reactivecore2.default)(initialState);
	};
};

ReactiveBase.defaultProps = {
	theme: {},
	themePreset: 'light',
	initialState: {},
	graphQLUrl: '',
	as: 'div',
	enableAppbase: false
};

ReactiveBase.propTypes = {
	app: _types2.default.stringRequired,
	searchStateHeader: _types2.default.bool,
	as: _types2.default.string,
	children: _types2.default.children,
	credentials: _types2.default.string,
	headers: _types2.default.headers,
	queryParams: _types2.default.string,
	theme: _types2.default.style,
	themePreset: _types2.default.themePreset,
	type: _types2.default.string,
	url: _types2.default.string,
	transformRequest: _types2.default.func,
	initialQueriesSyncTime: _types2.default.number,
	mapKey: _types2.default.string,
	style: _types2.default.style,
	className: _types2.default.string,
	initialState: _types2.default.children,
	analytics: _types2.default.bool,
	enableAppbase: _types2.default.bool,
	analyticsConfig: _types2.default.analyticsConfig,
	appbaseConfig: _types2.default.appbaseConfig,
	graphQLUrl: _types2.default.string,
	transformResponse: _types2.default.func,
	getSearchParams: _types2.default.func,
	setSearchParams: _types2.default.func
};

exports.default = ReactiveBase;