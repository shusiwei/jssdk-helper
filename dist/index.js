'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _weixinJsSdk = require('weixin-js-sdk');

var _weixinJsSdk2 = _interopRequireDefault(_weixinJsSdk);

require('whatwg-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* ==================================================
                                                                                                                                                           * @ 微信公众平台开发者文档
                                                                                                                                                           * @ url : http://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html
                                                                                                                                                          
                                                                                                                                                           * @constructor(*) 微信API
                                                                                                                                                           * - (xhr : json) 请求票据的API
                                                                                                                                                           *   - (url : url) 请求的接口API
                                                                                                                                                           *   - (type : url['POST']) 请求方法
                                                                                                                                                           *   - (data : url[{}]) 请求接口时的参数
                                                                                                                                                           *   - (dataType : url [json]) 接口返回的数据格式
                                                                                                                                                           * - (cfg : json) 分享的配置
                                                                                                                                                           *   - (title : string[document.title]) 分享的标题
                                                                                                                                                           *   - (desc : string[document.title]) 分享的描述
                                                                                                                                                           *   - (link : string[document.title]) 分享的链接地址
                                                                                                                                                           *   - (imgUrl : string) 分享的图片路径
                                                                                                                                                           *   - (callback : json) 回调
                                                                                                                                                           *     - (success : function) 分享成功时的回调
                                                                                                                                                           *     - (cancel : function) 分享失败时的回调
                                                                                                                                                           *     -----------------------------------------------
                                                                                                                                                           *     - (timeline/message/qq/qzone : json) 不同的分享目标不同的回调
                                                                                                                                                           *       - (success : function) 分享成功时的回调
                                                                                                                                                           *       - (cancel : function) 分享失败时的回调
                                                                                                                                                           *       -----------------------------------------------
                                                                                                                                                           *   - (options : json) 其它配置
                                                                                                                                                           *     - (menu : boolean) 是否显示更多菜单的按钮
                                                                                                                                                           *     - (api : array) 需要使用的功能API列表
                                                                                                                                                           *     - (item : boolean) 显示的功能按钮
                                                                                                                                                           *       - (base : boolean) 是否显示基础功能按钮
                                                                                                                                                           *       - (hide : array) 隐藏的功能按钮
                                                                                                                                                           *       - (show : array) 显示的功能按钮
                                                                                                                                                           * ================================================== */


var JssdkHelper = function () {
  function JssdkHelper(xhr, share) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, JssdkHelper);

    var state = {};
    var config = {};

    config.xhr = {
      url: xhr.url || '/',
      type: xhr.type || 'POST',
      data: xhr.data || {},
      dataType: xhr.dataType || 'json'
    };
    config.share = {
      title: share.title || document.title,
      desc: share.desc || document.querySelector('meta[name="descripton"]').content,
      link: share.link || location.href,
      callback: {
        success: share.callback ? share.callback.success || function () {} : function () {},
        cancel: share.callback ? share.callback.cancel || function () {} : function () {}
      },
      imgUrl: share.imgUrl
    };
    config.api = opts.api || ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
    config.hideMenu = _lodash2.default.isBoolean(opts.hideMenu) ? opts.hideMenu : false;
    config.showBase = _lodash2.default.isBoolean(opts.showBase) ? opts.showBase : false;
    config.hideItem = opts.hideItem || [];
    config.showItem = opts.showItem || ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite'];

    this.config = config;
    this.state = state;

    this.initialize(config);
  }

  JssdkHelper.prototype.initialize = function initialize(config) {
    this.pushState(config.xhr, config.api);
    this.updateShare(config.share);
  };

  JssdkHelper.prototype.pushState = function pushState(xhr, api) {
    var _this = this;

    fetch(xhr.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials: 'include',
      body: JSON.stringify(xhr.data).replace(/":"/g, '=').replace(/","/g, '&').slice(2, -2)
    }).then(function (response) {
      _newArrowCheck(this, _this);

      if (response.ok) {
        response.json().then(function (data) {
          _newArrowCheck(this, _this);

          _weixinJsSdk2.default.config({
            debug: false,
            appId: response.appId,
            timestamp: response.timestamp,
            nonceStr: response.nonceStr,
            signature: response.signature,
            jsApiList: api
          });
        }.bind(this));
      } else {
        this.pushState(xhr, api);
      };
    }.bind(this));
  };

  JssdkHelper.prototype.getState = function getState() {
    var _console;

    (_console = console).log.apply(_console, this.state);
    var state = this.state;

    for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
      states[_key] = arguments[_key];
    }

    if (states.length === 0) {
      return state;
    } else if (states.length === 1) {
      return state[states[0]];
    } else {
      var tempState = {};

      for (var _iterator = states, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var i = _ref;

        tempState[i] = state[i];
      };

      return tempState;
    }
  };

  JssdkHelper.prototype.updateShare = function updateShare(data) {
    var state = this.state;
    var config = this.config;
    var share = config.share;

    var title = state.title = data ? data.title || share.title : share.title;
    var desc = state.desc = data ? data.desc || share.desc : share.desc;
    var link = state.link = data ? data.link || share.link : share.link;
    var imgSrc = data ? data.imgUrl || share.imgUrl : share.imgUrl;
    var callback = data ? data.callback || share.callback : share.callback;

    _weixinJsSdk2.default.ready(function () {
      var tempImg = new Image();
      var imgUrl = tempImg.src = imgSrc;

      _weixinJsSdk2.default.onMenuShareAppMessage(_lodash2.default.assign({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        type: 'link',
        dataUrl: ''
      }, this.getCallback(callback, 'message')));

      _weixinJsSdk2.default.onMenuShareTimeline(_lodash2.default.assign({
        title: title,
        link: link,
        imgUrl: imgUrl
      }, this.getCallback(callback, 'timeline')));

      _weixinJsSdk2.default.onMenuShareQQ(_lodash2.default.assign({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
      }, this.getCallback(callback, 'qq')));

      _weixinJsSdk2.default.onMenuShareQZone(_lodash2.default.assign({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
      }, this.getCallback(callback, 'qzone')));

      if (config.hideMenu) {
        _weixinJsSdk2.default.showOptionMenu();
      } else {
        _weixinJsSdk2.default.hideOptionMenu();
      };

      if (config.showBase) {
        _weixinJsSdk2.default.showAllNonBaseMenuItem();
      } else {
        _weixinJsSdk2.default.hideAllNonBaseMenuItem();
      };

      if (config.hideItem.length > 0) {
        _weixinJsSdk2.default.hideMenuItems({
          menuList: config.hideItem
        });
      };

      if (config.showItem.length > 0) {
        _weixinJsSdk2.default.showMenuItems({
          menuList: config.showItem
        });
      };
    });
  };

  JssdkHelper.prototype.getCallback = function getCallback(callback, type) {
    return {
      success: _lodash2.default.isPlainObject(callback[type]) && 'success' in callback[type] ? callback[type].success : callback.success || this.config.share.callback.success,
      cancel: _lodash2.default.isPlainObject(callback[type]) && 'cancel' in callback[type] ? callback[type].cancel : callback.cancel || this.config.share.callback.cancel
    };
  };

  return JssdkHelper;
}();

;

exports.default = JssdkHelper;