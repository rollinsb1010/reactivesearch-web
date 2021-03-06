'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _actions = require('@rollinsb1010/reactivecore/lib/actions');

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _helper = require('@rollinsb1010/reactivecore/lib/utils/helper');

var _Base = require('../../styles/Base');

var _Base2 = _interopRequireDefault(_Base);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var URLParamsProvider = function (_Component) {
	_inherits(URLParamsProvider, _Component);

	function URLParamsProvider() {
		var _temp, _this, _ret;

		_classCallCheck(this, URLParamsProvider);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.init = function () {
			_this.searchString = _this.props.getSearchParams ? _this.props.getSearchParams() : window.location.search;
			_this.params = new URLSearchParams(_this.searchString);
			_this.currentSelectedState = _this.props.selectedValues || {};
		}, _this.checkForURLParamsChange = function () {
			// we only compare the search string (window.location.search by default)
			// to see if the route has changed (or) not. This handles the following usecase:
			// search on homepage -> route changes -> search results page with same search query
			if (window) {
				var searchString = _this.props.getSearchParams ? _this.props.getSearchParams() : window.location.search;

				if (searchString !== _this.searchString) {
					var event = void 0;
					if (typeof Event === 'function') {
						event = new Event('popstate');
					} else {
						// Correctly fire popstate event on IE11 to prevent app crash.
						event = document.createEvent('Event');
						event.initEvent('popstate', true, true);
					}

					window.dispatchEvent(event);
				}
			}
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	URLParamsProvider.prototype.componentDidMount = function componentDidMount() {
		var _this2 = this;

		this.init();

		window.onpopstate = function () {
			_this2.init();
			var activeComponents = Array.from(_this2.params.keys());

			// remove inactive components from selectedValues
			Object.keys(_this2.currentSelectedState).filter(function (item) {
				return !activeComponents.includes(item);
			}).forEach(function (component) {
				_this2.props.setValue(component, null);
			});

			// update active components in selectedValues
			Array.from(_this2.params.entries()).forEach(function (item) {
				try {
					var component = item[0],
					    value = item[1];

					var _ref = _this2.props.selectedValues[component] || { label: component },
					    label = _ref.label,
					    showFilter = _ref.showFilter,
					    URLParams = _ref.URLParams;

					_this2.props.setValue(component, JSON.parse(value), label, showFilter, URLParams);
				} catch (e) {
					// Do not set value if JSON parsing fails.
				}
			});
		};
	};

	URLParamsProvider.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this3 = this;

		// this ensures the url params change are handled
		// when the url changes, which enables us to
		// make `onpopstate` event handler work with history.pushState updates
		this.checkForURLParamsChange();

		this.currentSelectedState = this.props.selectedValues;
		if (!(0, _helper.isEqual)(this.props.selectedValues, prevProps.selectedValues)) {
			this.searchString = this.props.getSearchParams ? this.props.getSearchParams() : window.location.search;
			this.params = new URLSearchParams(this.searchString);
			var currentComponents = Object.keys(this.props.selectedValues);
			var urlComponents = Array.from(this.params.keys());

			currentComponents.filter(function (component) {
				return _this3.props.selectedValues[component].URLParams;
			}).forEach(function (component) {
				// prevents empty history pollution on initial load
				if (_this3.hasValidValue(_this3.props.selectedValues[component]) || _this3.hasValidValue(prevProps.selectedValues[component])) {
					var selectedValues = _this3.props.selectedValues[component];
					var prevValues = prevProps.selectedValues[component];
					if (selectedValues.URLParams) {
						if (selectedValues.category) {
							_this3.setURL(component, _this3.getValue({
								category: selectedValues.category,
								value: selectedValues.value
							}));
						} else {
							var currentValue = _this3.getValue(selectedValues.value);
							var prevValue = prevValues && _this3.getValue(prevValues.value);

							/*
       	Push to history only if values are different because setting url on
       	same value will lead to 2 same entries in URL history which would cause
       	repeatation on pressing back button.
       */

							if (prevValue !== currentValue) {
								_this3.setURL(component, _this3.getValue(selectedValues.value));
							}
						}
					} else {
						_this3.params.delete(component);
						_this3.pushToHistory();
					}
				} else if (!_this3.hasValidValue(_this3.props.selectedValues[component]) && urlComponents.includes(component)) {
					// doesn't have a valid value, but the url has a (stale) valid value set
					_this3.params.delete(component);
					_this3.pushToHistory();
				}
			});

			// remove unmounted components
			Object.keys(this.props.selectedValues).filter(function (component) {
				return !currentComponents.includes(component);
			}).forEach(function (component) {
				_this3.params.delete(component);
				_this3.pushToHistory();
			});

			if (!currentComponents.length) {
				var searchComponents = this.props.searchComponents;

				Array.from(this.params.keys()).forEach(function (item) {
					if (searchComponents && searchComponents.includes(item)) {
						_this3.params.delete(item);
					}
				});
				this.pushToHistory();
			}
		}

		if (!(0, _helper.isEqual)(this.props.headers, prevProps.headers)) {
			this.props.setHeaders(this.props.headers);
		}
	};

	URLParamsProvider.prototype.hasValidValue = function hasValidValue(component) {
		if (!component) return false;
		if (Array.isArray(component.value)) return !!component.value.length;
		return !!component.value;
	};

	URLParamsProvider.prototype.getValue = function getValue(value) {
		var _this4 = this;

		if (Array.isArray(value) && value.length) {
			return value.map(function (item) {
				return _this4.getValue(item);
			});
		} else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
			// TODO: support for NestedList
			if (value.location) return value;
			if (value.category) return value;
			return value.label || value.key || null;
		}
		return value;
	};

	URLParamsProvider.prototype.setURL = function setURL(component, value) {
		this.searchString = this.props.getSearchParams ? this.props.getSearchParams() : window.location.search;
		this.params = new URLSearchParams(this.searchString);
		if (!value || typeof value === 'string' && value.trim() === '' || Array.isArray(value) && value.length === 0) {
			this.params.delete(component);
			this.pushToHistory();
		} else {
			var data = JSON.stringify(this.getValue(value));
			if (data !== this.params.get(component)) {
				this.params.set(component, data);
				this.pushToHistory();
			}
		}
	};

	URLParamsProvider.prototype.pushToHistory = function pushToHistory() {
		var paramsSting = this.params.toString() ? '?' + this.params.toString() : '';
		var base = window.location.href.split('?')[0];
		var newURL = '' + base + paramsSting;

		if (this.props.setSearchParams) {
			this.props.setSearchParams(newURL);
		} else if (window.history.pushState) {
			window.history.pushState({ path: newURL }, '', newURL);
		}
		this.init();
	};

	URLParamsProvider.prototype.render = function render() {
		return _react2.default.createElement(
			_Base2.default,
			{ as: this.props.as, style: this.props.style, className: this.props.className },
			this.props.children
		);
	};

	return URLParamsProvider;
}(_react.Component);

URLParamsProvider.propTypes = {
	setHeaders: _types2.default.func,
	setValue: _types2.default.func,
	selectedValues: _types2.default.selectedValues,
	searchComponents: _propTypes2.default.arrayOf(String),
	// component props
	children: _types2.default.children,
	as: _types2.default.string,
	headers: _types2.default.headers,
	style: _types2.default.style,
	className: _types2.default.string,
	getSearchParams: _types2.default.func,
	setSearchParams: _types2.default.func
};

URLParamsProvider.defaultProps = {
	style: {},
	className: null,
	as: 'div'
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		selectedValues: state.selectedValues,
		searchComponents: state.components
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		setHeaders: function setHeaders(headers) {
			return dispatch((0, _actions.setHeaders)(headers));
		},
		setValue: function setValue(component, value, label, showFilter, URLParams) {
			return dispatch((0, _actions.setValue)(component, value, label, showFilter, URLParams));
		}
	};
};

var ConnectedComponent = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(function (props) {
	return _react2.default.createElement(URLParamsProvider, _extends({ ref: props.myForwardedRef }, props));
});

// eslint-disable-next-line
exports.default = _react2.default.forwardRef(function (props, ref) {
	return _react2.default.createElement(ConnectedComponent, _extends({}, props, { myForwardedRef: ref }));
});