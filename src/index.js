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
import 'whatwg-fetch';

const jssdk = window.jWeixin;

console.log(jssdk);

class JssdkHelper {
  constructor(request, settings = {}, config = {}, options = {}) {
    const descElement = document.querySelector('meta[name="descripton"]');

    const title = config.title || document.title;
    const desc = config.desc || (descElement ? descElement.content : document.title);
    const link = config.link || location.href;
    const callback = {
      success: config.callback ? config.callback.success || function() {} : function() {},
      cancel: config.callback ? config.callback.cancel || function() {} : function() {}
    };
    const imgUrl = config.imgUrl;

    const apiList = _.isArray(options.apiList) || ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'];
    const hideMenu = _.isBoolean(options.hideMenu) ? options.hideMenu : false;
    const showBase = _.isBoolean(options.showBase) ? options.showBase : false;
    const hideItem = _.isArray(options.hideItem) || [];
    const showItem = _.isArray(options.showItem) || ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite'];

    this.share = {title, desc, link, callback, imgUrl};
    this.config = {apiList, hideMenu, showBase, hideItem, showItem};
    this.state = {};

    this.pushState(request, settings);
    this.updateShare(this.share);
  }
  pushState(request, settings) {
    const config = this.config;

    fetch(request, settings).then(response => {
      if (response.ok) {
        response.json().then(data => {
          jssdk.config({
            debug: false,
            appId: response.appId,
            timestamp: response.timestamp,
            nonceStr: response.nonceStr,
            signature: response.signature,
            jsApiList: config.apiList
          });
        });
      } else {
        this.pushState(request, settings);
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
    const share = this.share;

    const title = state.title = data ? data.title || share.title : share.title;
    const desc = state.desc = data ? data.desc || share.desc : share.desc;
    const link = state.link = data ? data.link || share.link : share.link;
    const imgSrc = data ? data.imgUrl || share.imgUrl : share.imgUrl;
    const callback = data ? data.callback || share.callback : share.callback;

    jssdk.ready(() => {
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
