'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('@rollinsb1010/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _utils = require('../../../utils');

var _MicSvg = require('../../shared/MicSvg');

var _MicSvg2 = _interopRequireDefault(_MicSvg);

var _MuteSvg = require('../../shared/MuteSvg');

var _MuteSvg2 = _interopRequireDefault(_MuteSvg);

var _ListenSvg = require('../../shared/ListenSvg');

var _ListenSvg2 = _interopRequireDefault(_ListenSvg);

var _IconWrapper = require('../../../styles/IconWrapper');

var _IconWrapper2 = _interopRequireDefault(_IconWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATUS = {
	inactive: 'INACTIVE',
	stopped: 'STOPPED',
	active: 'ACTIVE',
	denied: 'DENIED'
};

var Mic = function (_React$Component) {
	_inherits(Mic, _React$Component);

	function Mic() {
		_classCallCheck(this, Mic);

		var _this = _possibleConstructorReturn(this, _React$Component.call(this));

		_this.stopMic = function () {
			if (_this.instance) {
				_this.setState({
					status: STATUS.inactive
				}, function () {
					_this.instance.stop();
					_this.instance = null;
				});
			}
		};

		_this.handleClick = function () {
			_this.results = [];
			if (window && window.SpeechRecognition) {
				var status = _this.state.status;

				if (status === STATUS.active) {
					_this.setState({
						status: STATUS.inactive
					});
				}
				var _this$props = _this.props,
				    onResult = _this$props.onResult,
				    onNoMatch = _this$props.onNoMatch,
				    onError = _this$props.onError,
				    lang = _this$props.lang,
				    getInstance = _this$props.getInstance;
				var _window = window,
				    SpeechRecognition = _window.SpeechRecognition;

				if (_this.instance && status !== STATUS.denied) {
					_this.setState({
						status: STATUS.inactive
					}, function () {
						_this.instance.stop();
						_this.instance = null;
					});
					return;
				}
				_this.instance = new SpeechRecognition();
				_this.instance.continuous = true;
				_this.instance.interimResults = false;
				_this.instance.lang = lang;
				if (getInstance) {
					getInstance(_this.instance);
				}
				_this.instance.start();
				_this.instance.onstart = function () {
					_this.setState({
						status: STATUS.active
					});
				};
				_this.instance.onresult = function (_ref) {
					var results = _ref.results,
					    timeStamp = _ref.timeStamp;

					_this.stopMic();
					if (onResult) {
						onResult({ results: results, timeStamp: timeStamp });
					}
					_this.results.push({ results: results, timeStamp: timeStamp });
				};
				_this.instance.onnomatch = function (e) {
					return onNoMatch ? onNoMatch(e) : console.warn(e);
				};
				_this.instance.onerror = function (e) {
					if (e.error === 'no-speech' || e.error === 'audio-capture') {
						_this.setState({
							status: STATUS.inactive
						});
					} else if (e.error === 'not-allowed') {
						_this.setState({
							status: STATUS.denied
						});
					}
					console.error(e);
					if (onError) {
						onError(e);
					}
				};

				/* Below Two methods run when Continuous is False */
				_this.instance.onspeechend = function () {
					_this.setState({
						status: STATUS.inactive
					});
				};

				_this.instance.onaudioend = function () {
					_this.setState({
						status: STATUS.inactive
					});
				};
			}
		};

		_this.state = {
			status: STATUS.inactive
		};
		_this.results = [];

		if (typeof window !== 'undefined') {
			window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition || null;

			if (!window.SpeechRecognition) {
				console.error('SpeechRecognition is not supported in this browser. Please check the browser compatibility at https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility.');
			}
		}
		return _this;
	}

	Mic.prototype.getComponent = function getComponent() {
		var status = this.state.status;

		var data = {
			handleClick: this.handleClick,
			status: status
		};
		return (0, _utils.getComponent)(data, this.props);
	};

	Mic.prototype.render = function render() {
		if (this.hasCustomRenderer) {
			return this.getComponent();
		}
		return _react2.default.createElement(
			_IconWrapper2.default,
			null,
			this.Icon
		);
	};

	_createClass(Mic, [{
		key: 'Icon',
		get: function get() {
			var status = this.state.status;
			var className = this.props.className;

			switch (status) {
				case STATUS.active:
					return _react2.default.createElement(_ListenSvg2.default, { className: className, onClick: this.handleClick });
				case STATUS.stopped:
				case STATUS.denied:
					return _react2.default.createElement(_MuteSvg2.default, { className: className, onClick: this.handleClick });
				default:
					return _react2.default.createElement(_MicSvg2.default, { className: className, onClick: this.handleClick });
			}
		}
	}, {
		key: 'hasCustomRenderer',
		get: function get() {
			return (0, _utils.hasCustomRenderer)(this.props);
		}
	}]);

	return Mic;
}(_react2.default.Component);

Mic.defaultProps = {
	lang: 'en-US',
	iconPosition: 'left'
};

Mic.propTypes = {
	children: _types2.default.title,
	lang: _types2.default.string,
	iconPosition: _types2.default.string,
	onResult: _types2.default.func,
	onNoMatch: _types2.default.func,
	onError: _types2.default.func,
	getInstance: _types2.default.func,
	render: _types2.default.func,
	className: _types2.default.string,
	applyClearStyle: _types2.default.bool,
	showIcon: _types2.default.bool
};

exports.default = Mic;