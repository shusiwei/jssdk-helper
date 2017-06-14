var _this = this;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* ==================================================
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
import { isArray, isBoolean, assign, isPlainObject, isFunction } from 'tiny';
import jssdk from 'weixin-js-sdk';

var JssdkHelper = function () {
  function JssdkHelper(request) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, JssdkHelper);

    var descElement = document.querySelector('meta[name="descripton"]');

    var title = config.title || document.title;
    var desc = config.desc || (descElement ? descElement.content : document.title);
    var link = config.link || location.href;
    var callback = {
      success: isPlainObject(config.callback) && isFunction(config.callback.success) ? config.callback.success : function () {},
      cancel: isPlainObject(config.callback) && isFunction(config.callback.cancel) ? config.callback.cancel : function () {}
    };
    var imgUrl = config.imgUrl;

    var apiList = isArray(options.apiList) ? options.apiList : ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
    var hideMenu = isBoolean(options.hideMenu) ? options.hideMenu : false;
    var showBase = isBoolean(options.showBase) ? options.showBase : false;
    var hideItem = isArray(options.hideItem) ? options.hideItem : [];
    var showItem = isArray(options.showItem) ? options.showItem : ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite'];

    this.jssdk = jssdk;
    this.share = { title: title, desc: desc, link: link, callback: callback, imgUrl: imgUrl };
    this.config = { apiList: apiList, hideMenu: hideMenu, showBase: showBase, hideItem: hideItem, showItem: showItem };
    this.state = {};

    this.pushState(request);
    this.updateShare(this.share);
  }

  JssdkHelper.prototype.pushState = function () {
    _newArrowCheck(this, _this);

    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
      var _this2 = this;

      var config, _ref2, data, appId, timestamp, nonceStr, signature, error;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              config = this.config;
              _context.prev = 1;
              _context.next = 4;
              return request();

            case 4:
              _ref2 = _context.sent;
              data = _ref2.data;
              appId = data.appId, timestamp = data.timestamp, nonceStr = data.nonceStr, signature = data.signature;


              jssdk.config({
                debug: false,
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: config.apiList
              });

              jssdk.error(function (res) {
                console.error(res.errMsg);
                window.setTimeout(function () {
                  _this2.pushState(request);
                }, 12 * 1000);
              });
              _context.next = 15;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context['catch'](1);
              error = _context.t0.error;
              throw error;

            case 15:
              ;

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 11]]);
    }));

    function pushState(_x3) {
      return _ref.apply(this, arguments);
    }

    return pushState;
  }.bind(_this)();

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
        var _ref4;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref4 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref4 = _i.value;
        }

        var key = _ref4;

        result[key] = state[key];
      };

      return result;
    }
  };

  JssdkHelper.prototype.updateShare = function updateShare() {
    var _this3 = this;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var state = this.state,
        config = this.config,
        share = this.share;


    var title = data.hasOwnProperty('title') ? data.title : share.title;
    var desc = data.hasOwnProperty('desc') ? data.desc : share.desc;
    var link = data.hasOwnProperty('link') ? data.link : share.link;
    var imgSrc = data.hasOwnProperty('imgUrl') ? data.imgUrl : share.imgUrl;
    var callback = data.hasOwnProperty('callback') ? data.callback : share.callback;

    state.title = title;
    state.desc = desc;
    state.link = link;

    jssdk.ready(function () {
      _newArrowCheck(this, _this3);

      var tempImg = new Image();
      tempImg.src = imgSrc;

      var imgUrl = tempImg.src;

      jssdk.onMenuShareAppMessage(assign({ title: title, desc: desc, link: link, imgUrl: imgUrl, type: 'link', dataUrl: '' }, this.getCallback(callback, 'message')));
      jssdk.onMenuShareTimeline(assign({ title: title, link: link, imgUrl: imgUrl }, this.getCallback(callback, 'timeline')));
      jssdk.onMenuShareQQ(assign({ title: title, desc: desc, link: link, imgUrl: imgUrl }, this.getCallback(callback, 'qq')));
      jssdk.onMenuShareQZone(assign({ title: title, desc: desc, link: link, imgUrl: imgUrl }, this.getCallback(callback, 'qzone')));

      if (config.hideMenu) {
        jssdk.showOptionMenu();
      } else {
        jssdk.hideOptionMenu();
      };

      if (config.showBase) {
        jssdk.showAllNonBaseMenuItem();
      } else {
        jssdk.hideAllNonBaseMenuItem();
      };

      if (config.hideItem.length > 0) {
        jssdk.hideMenuItems({
          menuList: config.hideItem
        });
      };

      if (config.showItem.length > 0) {
        jssdk.showMenuItems({
          menuList: config.showItem
        });
      };
    }.bind(this));
  };

  JssdkHelper.prototype.getCallback = function getCallback(callback, type) {
    return {
      success: isPlainObject(callback[type]) && 'success' in callback[type] ? callback[type].success : callback.success || this.config.share.callback.success,
      cancel: isPlainObject(callback[type]) && 'cancel' in callback[type] ? callback[type].cancel : callback.cancel || this.config.share.callback.cancel
    };
  };

  return JssdkHelper;
}();

;

export default JssdkHelper;