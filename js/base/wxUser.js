/**********************
*******  2019.8 *******
*******   page  *******
**********************/

var wxUser = new WxUser();

function WxUser() {
    var _self = this;

    _self.wxSigned = false;
    var dominUrl, shareInfo;
    var appId = "wxe3869e539fd487f6";
    var imonitor = window.imonitor || {};
    var jsdkAPI = 'https://www.seventh77.com/API/wxjsdk/wxjsdk.php';
    var authAPI = 'http://t.phper.be-xx.com/invisalign/index.php';

    var returnUserInfo = null;
    var TIME_USERINFO = 60 * 1000; //1分钟后过期 重新拉取用户信息 防止不同步
    var DEFAULT_USERINFO = {
        "openid": "test",
        "nickname": "彼邑测试账号",
        "headimgurl": "images/share.jpg",
        "country": "中国",
        "province": "上海",
        "city": "上海市",
        "unionid": "test",
        "sex": "1"
    };

    /**
     * 初始化
     * @param {*} opts               配置信息
     */
    _self.init = function (opts) {
        opts = opts || {};

        _sharInfoInit();

        if (opts.hasOwnProperty("shareInfo")) shareInfo = $.extend(shareInfo, opts.shareInfo);
        if (opts.hasOwnProperty("appId")) appId = opts.appId;
        if (opts.hasOwnProperty("jsdkAPI")) jsdkAPI = opts.jsdkAPI;

        var data = {
            url: location.href,
            appid: appId
        };

        $.get(jsdkAPI, data, function (data) {
            wxShareConfig(data.result, shareInfo);
        }, 'JSON')
    }

    /**
     * 获取用户信息
     */
    _self.getUserInfo = function (opts) {
        if (opts) {
            if (os.weixin) {
                if (opts.hasOwnProperty("callback")) returnUserInfo = opts.callback;
                if (opts.hasOwnProperty("url")) authAPI = opts.url;
                if (opts.type == "base") _getUserInfo("Oath-getBase");
                else if (opts.type == "user") _getUserInfo("Oath-getInfo");
                // if(authAPI.split("/")[2] != location.href.split("/")[2] && opts.hasOwnProperty("callback")) opts.callback(DEFAULT_USERINFO);
            }
            else if (opts.hasOwnProperty("callback")) opts.callback(DEFAULT_USERINFO);
        }
        else console.warn("请传相应的授权类型");
    }

    /**
     * 分享重置
     * @param {*} shareInfo                 分享信息
     */
    _self.shareReset = function (info) {
        if (_self.wxSigned) {
            if (info) shareInfo = $.extend(shareInfo, info);
            wx.onMenuShareAppMessage({
                title: shareInfo.title,                         // 分享标题
                desc: shareInfo.friend,                         // 分享描述
                link: shareInfo.link,                           // 分享链接
                imgUrl: shareInfo.image,                        // 分享图标
                type: 'link',                                   // 分享类型,music、video或link，不填默认为link
                dataUrl: '',                                    // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    if (imonitor.hasOwnProperty("add")) imonitor.add({ label: '分享给朋友' });
                    if (_self.wxShareSuccess) _self.wxShareSuccess();
                }
            });

            wx.onMenuShareTimeline({
                title: shareInfo.timeline,                      // 分享标题
                link: shareInfo.link,                           // 分享链接
                imgUrl: shareInfo.image,                        // 分享图标
                success: function () {
                    if (imonitor.hasOwnProperty("add")) imonitor.add({ label: '分享到朋友圈' });
                    if (_self.wxShareSuccess) _self.wxShareSuccess();
                }
            });
        }
        else setTimeout(function () { _self.shareReset() }, 250);
    }

    /**
     * 隐藏微信部分菜单
     */
    _self.hideMenu = function (menuList) {
        if (_self.wxSigned) {
            wx.ready(function () {
                menuList = menuList || ["menuItem:copyUrl"];
                wx.hideMenuItems({
                    menuList: menuList
                });
            });
        }
        else setTimeout(function () { _self.hideMenu() }, 250);
    }

    /**
     * 分享信息初始化
     */
    function _sharInfoInit() {
        var hrefs = window.location.href.split('?');
        dominUrl = hrefs[0].substr(0, hrefs[0].lastIndexOf('/') + 1);

        shareInfo = {
            link: dominUrl,
            image: dominUrl + 'images/share.jpg?v=' + Math.random(),
            title: $('title').html(),
            friend: '发送给朋友的分享文案',
            timeline: '发送到给朋友圈的分享文案'
        }
    }

    /**
     * 微信分享设置
     * @param {*} data 
     * @param {*} shareInfo 
     */
    function wxShareConfig(data, shareInfo) {
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                // 'updateAppMessageShareData',
                // 'updateTimelineShareData',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });//end wx.config
        _self.wxSigned = true;  //通过微信新SDK验证

        wx.ready(function () {
            wx.showOptionMenu();
            _self.shareReset(shareInfo);
        });//end wx.ready
    }

    /**
     * 获取用户信息
     */
    function _getUserInfo(type) {
        if (type == "Oath-getBase") {
            var openID = localStorage.openID;
            if (openID) {
                if (returnUserInfo) returnUserInfo({ openid: openID });
            }
            else _requestAuthAdd(type);
        }
        else if (type == "Oath-getInfo") {
            var userInfo = localStorage.userInfo;
            var time = Date.now() - localStorage.userTime;     
            if (userInfo && time <= TIME_USERINFO) {
                // userInfo = eval('(' + userInfo + ')');
                if (returnUserInfo) returnUserInfo(JSON.parse(userInfo));
            }
            else _requestAuthAdd(type)
        }
    }

    /**
     * 请求授权地址
     */
    function _requestAuthAdd(type) {
        var data = {
            action: type
        };
        $.ajax({
            type: "get",
            url: authAPI,
            data: data,
            dataType: "JSON",
            xhrFields: {
                withCredentials: true
            },
            success: function (sucRes) {

                if (sucRes.code == -10) {
                    var url = sucRes.data.oath_url;
                    url = url.indexOf("?") == -1 ? url + "?" : url + "&";
                    url += "backurl=" + encodeURIComponent(location.href);
                    location.href = url;
                }
                else if (sucRes.code == -11 && type == "Oath-getInfo") {
                    _refuseGetInfoAutoTips();
                }
                else if (sucRes.code == 0) {
                    if (type == "Oath-getBase") _saveUserOpendId(sucRes.data);
                    else if (type == "Oath-getInfo") _saveUserInfo(sucRes.data);
                }
            },
            fail: function(failRes){
                alert(JSON.stringify(failRes));
            }
        });
    }

    /**
     * 保存用户opendid
     */
    function _saveUserOpendId(data) {
        localStorage.openID = data.openid;
        if (returnUserInfo) returnUserInfo({ openid: data.openid });
    }

    /**
     * 保存用户信息
     */
    function _saveUserInfo(data) {
        var info = JSON.stringify(data);
        localStorage.userInfo = info;
        localStorage.userTime = Date.now();
        if (returnUserInfo) returnUserInfo(data);
    }

    /**
     * 拒绝授权提示
     */
    function _refuseGetInfoAutoTips() {
        icom.confirm("接受授权，才能继续体验H5哦", function () {
            _requestAuthAdd("Oath-getInfo");
        }, function () {
            wx.closeWindow();
        })
    }
}