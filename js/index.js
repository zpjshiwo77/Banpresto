//-----------------------------------------定义和初始化变量----------------------------------------
var loadBox = $('aside.loadBox');
var articleBox = $('article');
var windowScale = window.innerWidth / 750;

//----------------------------------------页面初始化----------------------------------------
icom.init(init);//初始化
icom.screenScrollUnable();//如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为

function init() {
	requestAnimationFrame(function () {
		if (os.screenProp < 0.54) articleBox.addClass("screen189");
		if (os.screenProp <= 0.64 && os.screenProp >= 0.54) articleBox.addClass("screen169");
		if (os.screenProp > 0.64) articleBox.addClass("screen159");
		load_handler();
	});
	wxUser.init({
		shareInfo: {
			title: "一番赏换换demo",
			friend: '我在这里登记了我的赏品，看看有没有你需要的',
			timeline: '我在这里登记了我的赏品，看看有没有你需要的'
		}
	});
}//edn func


//----------------------------------------加载页面图片----------------------------------------
function load_handler() {
	var loader = new PxLoader();
	loader.addImage('images/common/turn_phone.png');

	//实际加载进度
	//		loader.addProgressListener(function(e) {
	//			var per=Math.round(e.completedCount/e.totalCount*50);
	//			loadPer.html(per+'%');
	//		});

	loader.addCompletionListener(function () {
		icom.fadeIn(articleBox);
		pageInit();
		//			load_timer(50);//模拟加载进度
		loader = null;
	});
	loader.start();
}//end func

//模拟加载进度
function load_timer(per) {
	per = per || 0;
	per += imath.randomRange(1, 3);
	per = per > 100 ? 100 : per;
	loadPer.html(per + '%');
	if (per == 100) setTimeout(pageInit, 200);
	else setTimeout(load_timer, 33, per);
}//edn func

//----------------------------------------页面逻辑代码----------------------------------------
var indexBox = $("#indexBox");
var tradeBox = $("#tradeBox");
var choseBox = $("#choseBox");
var getAwardBox = $("#getAwardBox");
var shareBox = $("#shareBox");

var myAward = [];
var myName = "";
var myKey = "";
var myChoseAward = [];
var myLock = false;
var hisLock = false;
var iSure = false;
var hisSure = false;
var hisChoseAward = [];
var roomKey = icom.getQueryString("r");
var tradeRoomInit = false;

var myAwardList = new IScroll('#myAwardList', {
	bounce: false,
	click: true,
});

var hisTradeAwardList = new IScroll('#hisTradeAwardList', {
	bounce: false,
	click: true,
});

var myTradeAwardList = new IScroll('#myTradeAwardList', {
	bounce: false,
	click: true,
});

var choseAwardList = new IScroll('#choseAwardList', {
	bounce: false,
	click: true,
});

var getAwardList = new IScroll('#getAwardList', {
	bounce: false,
	click: true,
});

/**
 * 页面初始化
 */
function pageInit() {
	eventInit();
	// DevelopTest();
	monitor_handler();
	judgeEnterOtherRoom();
	addUser();
}//end func

/**
 * 开发测试使用
 */
function DevelopTest() {
	loadingBox.hide();
	QABox.show();
}

/**
 * 事件初始化
 */
function eventInit() {
	$(".limitBtn").on("touchend", limitClick);

	$("#closeBtn").on("touchend", closeGetAwardBox);
	$("#confirmBtn").on("touchend", recordNickname);

	$("#tipsBtn").on("touchend", showTips);
	$("#enterTrade").on("touchend", creatTrade);

	// $("#tipsBtn").on("touchend",test);
	// $("#enterTrade").on("touchend",test2);

	// tradeBox.on("swiperight",hideTradeBox);
	$("#enterChose").on("touchend", showChosePage);
	$("#choseBox").on("click", ".award", choseAward);

	$("#choseBtn").on("touchend", updateChoseAward);

	$("#lockBtn").on("touchend", lockTradeAward);
	$("#tradeBtn").on("touchend", confirmTradeAward);
}

/**
 * 测试
 */
function test() {
	itradeRoom.init("test");
}

/**
 * 测试2
 */
function test2() {
	itradeRoom.send("testmsg");
}

/**
 * 判断进入别人的房间
 */
function judgeEnterOtherRoom() {
	if (roomKey) {
		var key = localStorage.ikey;
		var name = localStorage.iname;
		if (!key || !name) {
			icom.alert("你还没抽赏呢，快去抽赏吧", function () {
				location.replace("index.html");
			})
		}
		else {
			itradeRoom.init();
			tradeRoomInit = true;
			tradeBox.show();
			setTimeout(function () {
				itradeRoom.enterOtherRoom(roomKey, myName);
			}, 500);
		}
	}
}

/**
 * 锁定交易的赏品
 */
function lockTradeAward() {
	if (itradeRoom.roomPeopleNum != 2) {
		icom.alert("稍等一下，还没人和你进行交易");
		return;
	}
	if (!myLock) {
		myLock = true;
		$("#myTradeAwardList").addClass("act");
		$("#enterChose").hide();
		itradeRoom.sendLockInfo();
	}
}

/**
 * 他锁定了交易的赏品
 */
function HislockTradeAward() {
	if (!hisLock) {
		hisLock = true;
		$("#hisTradeAwardList").addClass("act");
	}
}

/**
 * 确认交易的赏品
 */
function confirmTradeAward() {
	if (itradeRoom.roomPeopleNum != 2) {
		icom.alert("稍等一下，还没人和你进行交易");
		return;
	}
	if (!myLock) icom.alert("你还没有锁定赏品");
	else if (!hisLock) icom.alert("他还没有锁定赏品")
	else {
		icom.confirm("确定要交易吗？", function () {
			loadBox.show();
			iSure = true;
			completeTrade();
			itradeRoom.sendAllowTrade();
		})
	}
}

/**
 * 他同意交易
 */
function hisAllowTrade() {
	hisSure = true;
	completeTrade();
}

/**
 * 完成交易
 */
function completeTrade() {
	if (iSure && hisSure) {
		loadBox.hide();
		removePointById(myAward, myChoseAward);
		myAward.push(...hisChoseAward);
		localStorage.iawards = myAward.toString();
		icom.alert("交易完成，快去看看自己的赏品吧", function () {
			location.replace("index.html");
		});
	}
}

/**
 * 从数组1中删除数组2的元素
 * @param {*} arr1 
 * @param {*} arr2 
 */
function removePointById(arr1, arr2) {
	for (let i = 0; i < arr2.length; i++) {
		dealEleInArr(arr1, arr2[i]);
	}
	return arr1
}

/**
 * 删除数组中指定元素
 */
function dealEleInArr(arr1, item) {
	for (let j = 0; j < arr1.length; j++) {
		if (item == arr1[j]) {
			let indexs = arr1.indexOf(arr1[j]);
			arr1.splice(indexs, 1);
			return;
		}
	}
}

/**
 * 更新我选中的赏品
 */
function updateChoseAward() {
	myChoseAward = [];
	$("#choseBox .award").each(function () {
		if ($(this).hasClass("act")) {
			myChoseAward.push($(this).data("id"));
		}
	})
	renderAwardBox($("#myTradeAwardList .scrollBox"), myChoseAward);

	icom.fadeOut(choseBox);
	myTradeAwardList.refresh();
	itradeRoom.sendTradeAward(myChoseAward);
}

/**
 * 更新他选中的赏品
 */
function updateHisTradeAward(awards) {
	// console.log(awards)
	hisChoseAward = awards;
	renderAwardBox($("#hisTradeAwardList .scrollBox"), hisChoseAward);
	hisTradeAwardList.refresh();
}

/**
 * 选择赏品
 */
function choseAward() {
	var that = $(this);
	if (that.hasClass("act")) that.removeClass("act");
	else that.addClass("act");
}

/**
 * 显示选择的页面
 */
function showChosePage() {
	if (itradeRoom.roomPeopleNum != 2) {
		icom.alert("稍等一下，还没人和你进行交易");
		return;
	}
	icom.fadeIn(choseBox);
	choseAwardList.refresh();
}

/**
 * 创建交易
 */
function creatTrade() {
	showTradeBox();
	if (!tradeRoomInit) {
		tradeRoomInit = true;
		itradeRoom.init()
		wxUser.shareReset({
			link: wxUser.dominUrl + "?r=" + itradeRoom.roomKey,
			friend: myName + '邀请你来和我交易',
			timeline: myName + '邀请你来和我交易'
		});
		setTimeout(function () {
			showShareBox();
		}, 500)
	}
}

/**
 * 更新他的名字
 */
function updateHisName(name) {
	$(".otherBox .title").html(name + "的交易赏品");
}


/**
 * 显示交易页面
 */
function showTradeBox() {
	tradeBox.show();
	tradeBox.css({ x: "100%" });
	tradeBox.transition({ x: 0 });
}

/**
 * 隐藏交易页面
 */
function hideTradeBox() {
	tradeBox.transition({ x: "100%" });
}

/**
 * 显示分享页面
 */
function showShareBox() {
	icom.popOn(shareBox)
}

/**
 * 显示提示
 */
function showTips() {
	icom.alert("不要点了，别指望我会给你发货！")
}

/**
 * 记录昵称
 */
function recordNickname() {
	var name = $("#name").val();
	if (name == "") icom.alert("请输入昵称")
	else {
		localStorage.iname = name;
		getAward();
		myName = name;
		myAward = localStorage.iawards.split(",");
		renderMyAwardList();
		renderGetAwardBox();
	}
}

/**
 * 关闭获奖页面
 */
function closeGetAwardBox() {
	icom.fadeOut(getAwardBox);
}

/**
 * 添加用户
 */
function addUser() {
	var key = localStorage.ikey;
	var name = localStorage.iname;
	if (!key || !name) {
		key = randomString(16);
		localStorage.ikey = key;
		myKey = key;
		getAwardBox.show();
	}
	else {
		myName = localStorage.iname;
		myKey = localStorage.ikey;
		myAward = localStorage.iawards.split(",");
		renderMyAwardList();
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

/**
 * 渲染我的赏品
 */
function renderMyAwardList() {
	getAwardBox.find(".title").html("恭喜获得");
	$("#name").hide();
	$("#getAwardList").show();
	getAwardBox.find(".tips").show();
	$("#confirmBtn").hide();
	$("#closeBtn").show();

	if (myAward.length == 0) {
		$("#myAwardList").hide();
		$("#choseAwardList").hide();
		$("#indexBox .tips").show();
		$("#choseBox .tips").show();
	}
	else {
		var cont = "";
		for (let i = 0; i < myAward.length; i++) {
			cont += makeAwardHtml(myAward[i]);
		}
		$("#myAwardList .scrollBox").empty().append(cont);
		$("#choseAwardList .scrollBox").empty().append(cont);
		myAwardList.refresh();
	}
}

/**
 * 生成奖品的html
 */
function makeAwardHtml(id) {
	return `<div class="award" style="background: url(images/award/${id}.jpg) no-repeat;background-size: cover;background-position: center;" data-id="${id}">
					<div class="name">${awardData[id]}</div>
				</div>`
}

/**
 * 渲染中的赏品
 */
function renderGetAwardBox() {
	renderAwardBox($("#getAwardList .scrollBox"), myAward);
	getAwardBox.show();
	getAwardList.refresh();
}

/**
 * 渲染奖品的盒子
 */
function renderAwardBox(box, list) {
	var cont = "";
	for (let i = 0; i < list.length; i++) {
		cont += makeAwardHtml(list[i]);
	}
	box.empty().append(cont);
}

/**
 * 获取奖品
 */
function getAward() {
	var awards = ""
	for (let i = 0; i < 30; i++) {
		awards += (i == 0 ? "" : ",") + imath.randomRange(1, 13);
	}
	localStorage.iawards = awards;
}

/**
 * 限制点击
 */
function limitClick() {
	$(".limitBtn").addClass('noPointer');
	setTimeout(function () { $(".limitBtn").removeClass('noPointer') }, 500);
}//end func

//----------------------------------------页面监测代码----------------------------------------
function monitor_handler() {
	//		imonitor.add({obj:$('a.btnTest'),action:'touchstart',category:'default',label:'测试按钮'});
}//end func

