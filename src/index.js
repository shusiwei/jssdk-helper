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
import {isArray, isBoolean, isPlainObject, isFunction} from 'tiny';
import jssdk from 'weixin-js-sdk';

export default class JssdkHelper {
  constructor(request, config = {}, options = {}, debug = false) {
    const descElement = document.querySelector('meta[name="descripton"]');

    const title = config.title || document.title;
    const desc = config.desc || (descElement ? descElement.content : document.title);
    const link = config.link || location.href;
    const callback = {
      success: isPlainObject(config.callback) && isFunction(config.callback.success) ? config.callback.success : function() {},
      cancel: isPlainObject(config.callback) && isFunction(config.callback.cancel) ? config.callback.cancel : function() {}
    };
    const imgUrl = config.imgUrl;

    const apiList = isArray(options.apiList) ? options.apiList : ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
    const hideMenu = isBoolean(options.hideMenu) ? options.hideMenu : false;
    const showBase = isBoolean(options.showBase) ? options.showBase : false;
    const hideItem = isArray(options.hideItem) ? options.hideItem : [];
    const showItem = isArray(options.showItem) ? options.showItem : ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite'];

    this.jssdk = jssdk;
    this.request = request;
    this.share = {title, desc, link, callback, imgUrl};
    this.config = {apiList, hideMenu, showBase, hideItem, showItem, debug};
    this.state = {};

    this.updateConfig(request);
    this.updateShare(this.share);
  }
  async updateConfig(request = this.request) {
    const config = this.config;

    try {
      const {data} = await request();
      const {appId, timestamp, nonceStr, signature} = data;

      jssdk.config({
        debug: config.debug,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: config.apiList
      });

      jssdk.error(res => {
        console.error(res.errMsg);
        window.setTimeout(() => {
          this.updateConfig(request);
        }, 12 * 1000);
      });
    } catch ({error}) {
      throw error;
    };
  }
  getState(...keys) {
    const state = this.state;

    if (keys.length === 0) {
      return state;
    } else if (keys.length === 1) {
      return state[keys[0]];
    } else {
      const result = {};

      for (let key of keys) {
        result[key] = state[key];
      };

      return result;
    }
  }
  updateShare(data = {}) {
    const {state, config, share} = this;

    const title = data.hasOwnProperty('title') ? data.title : share.title;
    const desc = data.hasOwnProperty('desc') ? data.desc : share.desc;
    const link = data.hasOwnProperty('link') ? data.link : share.link;
    const imgSrc = data.hasOwnProperty('imgUrl') ? data.imgUrl : share.imgUrl;
    const callback = data.hasOwnProperty('callback') ? data.callback : share.callback;

    state.title = title;
    state.desc = desc;
    state.link = link;

    jssdk.ready(() => {
      const tempImg = new Image();
      tempImg.src = imgSrc;

      const imgUrl = tempImg.src;

      const newState = {...state, imgUrl};

      jssdk.onMenuShareAppMessage({...newState, type: 'link', dataUrl: '', ...this.getCallback(callback, 'message')});
      jssdk.onMenuShareTimeline({...newState, ...this.getCallback(callback, 'timeline')});
      jssdk.onMenuShareQQ({...newState, ...this.getCallback(callback, 'qq')});
      jssdk.onMenuShareQZone({...newState, ...this.getCallback(callback, 'qzone')});

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
    });
  }
  getCallback(callback, type) {
    return {
      success: isPlainObject(callback[type]) && 'success' in callback[type] ? callback[type].success : callback.success || this.config.share.callback.success,
      cancel: isPlainObject(callback[type]) && 'cancel' in callback[type] ? callback[type].cancel : callback.cancel || this.config.share.callback.cancel
    };
  }
};
