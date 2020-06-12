var tradeRoom = function () {
    var _self = this;
    var ws;
    var roomMaster = true;
    var roomPeopleNum = 1;
    var roomKey = "";
    var socketTimer;
    var waitTime = 5000;
    var ikey;

    /**
     * 初始化
     */
    _self.init = function () {
        roomKey = randomString(10);
        _self.roomKey = roomKey;
        ws = new WS({ callback: OnMessage, channel: roomKey });
        ikey = localStorage.ikey;
        ws.Open();
    }

    /**
     * 关闭
     */
    function close() {
        ws.Close();
    }

    /**
     * 加入频道
     */
    function join(channel) {
        ws.Join(channel);
    }

    /**
     * 发送消息
     */
    function send(data) {
        ws.Send(data);
    }

    /**
     * 
     */
    _self.enterOtherRoom = function (channel, name) {
        roomKey = channel;
        _self.roomKey = roomKey;
        roomMaster = false;
        join(channel);
        send({ func: "enterRoom", data: { name: name } });
    }

    /**
     * 发送交易的赏品
     */
    _self.sendTradeAward = function (awards) {
        send({ func: "getTradeAward", data: { awards: awards, key: ikey } });
        showAlert("他已经离开了，快去自己创建一个吧");
    }

    /**
     * 发送锁定的信息
     */
    _self.sendLockInfo = function (){
        send({ func: "dealLockInfo", data: { key: ikey } });
        showAlert("他已经离开了，快去自己创建一个吧");
    }

    /**
     * 发送同意交易的信息
     */
    _self.sendAllowTrade= function (){
        send({ func: "dealAllowTrade", data: { key: ikey } });
        showAlert("他已经离开了，快去自己创建一个吧");
    }

    /**
     * 收到的消息
     */
    function OnMessage(result) {
        if (funcFactory.hasOwnProperty(result.func)) {
            let func = funcFactory[result.func];
            func(result.data)
        }
    }

    var funcFactory = {
        enterRoom: enterRoom,
        allowEnterRoom: allowEnterRoom,
        refuseEnterRoom: refuseEnterRoom,
        getTradeAward: getTradeAward,
        backMsg: backMsg,
        dealLockInfo: dealLockInfo,
        dealAllowTrade: dealAllowTrade
    };

    /**
     * 处理锁定的信息
     */
    function dealLockInfo(data){
        if (data.key != ikey && roomPeopleNum == 2) {
            HislockTradeAward();
            ws.Send({ func: "backMsg", data: { key: ikey } });
        }
    }

    /**
     * 处理同意交易的信息
     */
    function dealAllowTrade(data){
        if (data.key != ikey && roomPeopleNum == 2) {
            hisAllowTrade();
            ws.Send({ func: "backMsg", data: { key: ikey } });
        }
    }

    /**
     * 获取交易的赏品
     */
    function getTradeAward(data) {
        // console.log(data)
        if (data.key != ikey && roomPeopleNum == 2) {
            updateHisTradeAward(data.awards);
            ws.Send({ func: "backMsg", data: { key: ikey } });
        }
    }

    /**
     * 进入房间
     * @param {*} data 
     */
    function enterRoom(data) {
        if (roomMaster) {
            if (roomPeopleNum < 2) {
                roomPeopleNum++;
                _self.roomPeopleNum = roomPeopleNum;
                updateHisName(data.name);
                ws.Send({ func: "allowEnterRoom", data: { name: localStorage.iname } });
            }
            else ws.Send({ func: "refuseEnterRoom" });
        }
        else showAlert("主人已经离开了，快去自己创建一个吧");
    }

    /**
     * 同意进入房间
     */
    function allowEnterRoom(data) {
        if (!roomMaster) {
            clearTimeout(socketTimer);
            roomPeopleNum++;
            _self.roomPeopleNum = roomPeopleNum;
            updateHisName(data.name);
        }
    }

    /**
     * 拒绝进入房间
     */
    function refuseEnterRoom(data) {
        if (!roomMaster && roomPeopleNum == 1) {
            clearTimeout(socketTimer);
            icom.alert("他已经有交易伙伴了，快去自己创建一个吧", function () {
                location.replace("index.html");
            })
        }
    }

    /**
     * 显示提示
     * @param {} word 
     */
    function showAlert(word) {
        socketTimer = setTimeout(function () {
            icom.alert(word, function () {
                location.replace("index.html");
            })
        }, waitTime);
    }

    /**
     * 确认收到消息
     */
    function backMsg(data){
        if (data.key != ikey && roomPeopleNum == 2) {
            clearTimeout(socketTimer);
        }
    }

    /**
	 * 随机字符串
	 * @param {*} len 
	 */
    function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
}
var itradeRoom = new tradeRoom();