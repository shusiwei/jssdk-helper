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
import _ from 'lodash';
import jssdk from 'weixin-js-sdk';
import 'whatwg-fetch';

class JssdkHelper {
  constructor(url, init, share, options = {}) {
    const config = {};

    config.share = {
      title: share.title || document.title,
      desc: share.desc || (document.querySelector('meta[name="descripton"]') ? document.querySelector('meta[name="descripton"]').content : document.title),
      link: share.link || location.href,
      callback: {
        success: share.callback ? share.callback.success || function() {} : function() {},
        cancel: share.callback ? share.callback.cancel || function() {} : function() {}
      },
      imgUrl: share.imgUrl
    };
    config.api = options.api || ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
    config.hideMenu = _.isBoolean(options.hideMenu) ? options.hideMenu : false;
    config.showBase = _.isBoolean(options.showBase) ? options.showBase : false;
    config.hideItem = options.hideItem || [];
    config.showItem = options.showItem || ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite'];

    this.config = config;
    this.state = {};

    this.initialize(url, init, config);
  }
  initialize(url, init, config) {
    this.pushState(url, init, config.api);
    this.updateShare(config.share);
  }
  pushState(url, init, api) {
    fetch(url, init).then(response => {
      if (response.ok) {
        response.json().then(data => {
          jssdk.config({
            debug: false,
            appId: response.appId,
            timestamp: response.timestamp,
            nonceStr: response.nonceStr,
            signature: response.signature,
            jsApiList: api
          });
        });
      } else {
        this.pushState(url, init, api);
      };
    });
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
  updateShare(data) {
    const state = this.state;
    const config = this.config;
    const share = config.share;

    const title = state.title = data ? data.title || share.title : share.title;
    const desc = state.desc = data ? data.desc || share.desc : share.desc;
    const link = state.link = data ? data.link || share.link : share.link;
    const imgSrc = data ? data.imgUrl || share.imgUrl : share.imgUrl;
    const callback = data ? data.callback || share.callback : share.callback;

    jssdk.ready(function() {
      const tempImg = new Image();
      const imgUrl = tempImg.src = imgSrc;

      jssdk.onMenuShareAppMessage(_.assign({title, desc, link, imgUrl, type: 'link', dataUrl: ''}, this.getCallback(callback, 'message')));
      jssdk.onMenuShareTimeline(_.assign({title, link, imgUrl}, this.getCallback(callback, 'timeline')));
      jssdk.onMenuShareQQ(_.assign({title, desc, link, imgUrl}, this.getCallback(callback, 'qq')));
      jssdk.onMenuShareQZone(_.assign({title, desc, link, imgUrl}, this.getCallback(callback, 'qzone')));

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
      success: _.isPlainObject(callback[type]) && 'success' in callback[type] ? callback[type].success : callback.success || this.config.share.callback.success,
      cancel: _.isPlainObject(callback[type]) && 'cancel' in callback[type] ? callback[type].cancel : callback.cancel || this.config.share.callback.cancel
    };
  }
};

export default JssdkHelper;
