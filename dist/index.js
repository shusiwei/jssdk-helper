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
  function JssdkHelper(request) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, JssdkHelper);

    var descElement = document.querySelector('meta[name="descripton"]');

    var title = config.title || document.title;
    var desc = config.desc || (descElement ? descElement.content : document.title);
    var link = config.link || location.href;
    var callback = {
      success: config.callback ? config.callback.success || function () {} : function () {},
      cancel: config.callback ? config.callback.cancel || function () {} : function () {}
    };
    var imgUrl = config.imgUrl;

    var apiList = _lodash2.default.isArray(options.apiList) || ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
    var hideMenu = _lodash2.default.isBoolean(options.hideMenu) ? options.hideMenu : false;
    var showBase = _lodash2.default.isBoolean(options.showBase) ? options.showBase : false;
    var hideItem = _lodash2.default.isArray(options.hideItem) || [];
    var showItem = _lodash2.default.isArray(options.showItem) || ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite'];

    this.share = { title: title, desc: desc, link: link, callback: callback, imgUrl: imgUrl };
    this.config = { apiList: apiList, hideMenu: hideMenu, showBase: showBase, hideItem: hideItem, showItem: showItem };
    this.state = {};

    this.pushState(request, settings);
    this.updateShare(this.share);
  }

  JssdkHelper.prototype.pushState = function pushState(request, settings) {
    var _this = this;

    var config = this.config;

    fetch(request, settings).then(function (response) {
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
            jsApiList: config.apiList
          });
        }.bind(this));
      } else {
        this.pushState(request, settings);
      };
    }.bind(this));
  };

  JssdkHelper.prototype.getState = function getState() {
    var state = this.state;

    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    if (keys.length === 0) {
      return state;
    } else if (keys.length === 1) {
      return state[keys[0]];
    } else {
      var result = {};

      for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var key = _ref;

        result[key] = state[key];
      };

      return result;
    }
  };

  JssdkHelper.prototype.updateShare = function updateShare(data) {
    var _this2 = this;

    var state = this.state;
    var config = this.config;
    var share = this.share;

    var title = state.title = data ? data.title || share.title : share.title;
    var desc = state.desc = data ? data.desc || share.desc : share.desc;
    var link = state.link = data ? data.link || share.link : share.link;
    var imgSrc = data ? data.imgUrl || share.imgUrl : share.imgUrl;
    var callback = data ? data.callback || share.callback : share.callback;

    _weixinJsSdk2.default.ready(function () {
      _newArrowCheck(this, _this2);

      var tempImg = new Image();
      var imgUrl = tempImg.src = imgSrc;

      _weixinJsSdk2.default.onMenuShareAppMessage(_lodash2.default.assign({ title: title, desc: desc, link: link, imgUrl: imgUrl, type: 'link', dataUrl: '' }, this.getCallback(callback, 'message')));
      _weixinJsSdk2.default.onMenuShareTimeline(_lodash2.default.assign({ title: title, link: link, imgUrl: imgUrl }, this.getCallback(callback, 'timeline')));
      _weixinJsSdk2.default.onMenuShareQQ(_lodash2.default.assign({ title: title, desc: desc, link: link, imgUrl: imgUrl }, this.getCallback(callback, 'qq')));
      _weixinJsSdk2.default.onMenuShareQZone(_lodash2.default.assign({ title: title, desc: desc, link: link, imgUrl: imgUrl }, this.getCallback(callback, 'qzone')));

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
    }.bind(this));
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