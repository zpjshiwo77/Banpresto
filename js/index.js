$(document).ready(function(){
	
	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox=$('aside.loadBox');
	var articleBox=$('article');
	var windowScale=window.innerWidth/750;
	
	//----------------------------------------页面初始化----------------------------------------
	icom.init(init);//初始化
	icom.screenScrollUnable();//如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为
	
	function init(){
		requestAnimationFrame(function(){
            if(os.screenProp < 0.54) articleBox.addClass("screen189");
            if(os.screenProp <= 0.64 && os.screenProp >= 0.54) articleBox.addClass("screen169");
			if(os.screenProp > 0.64) articleBox.addClass("screen159");
			load_handler();
		});
		wxUser.init({
			shareInfo:{
				title: "一番赏",
            	friend: '我在这里登记了我的赏品，看看有没有你需要的',
            	timeline: '我在这里登记了我的赏品，看看有没有你需要的'
			}
		});
	}//edn func
	

	//----------------------------------------加载页面图片----------------------------------------
	function load_handler(){
		var loader = new PxLoader();
		loader.addImage('images/common/turn_phone.png');
		
		//实际加载进度
//		loader.addProgressListener(function(e) {
//			var per=Math.round(e.completedCount/e.totalCount*50);
//			loadPer.html(per+'%');
//		});
		
		loader.addCompletionListener(function() {
			icom.fadeIn(articleBox);
			pageInit();
//			load_timer(50);//模拟加载进度
			loader=null;
		});
		loader.start();	
	}//end func
	
	//模拟加载进度
	function load_timer(per){
		per=per||0;
		per+=imath.randomRange(1,3);
		per=per>100?100:per;
		loadPer.html(per+'%');
		if(per==100) setTimeout(pageInit,200);
		else setTimeout(load_timer,33,per);
	}//edn func
	
	//----------------------------------------页面逻辑代码----------------------------------------
	var indexBox = $("#indexBox");
	var tradeBox = $("#tradeBox");
	var choseBox = $("#choseBox");
	var getAwardBox = $("#getAwardBox");

	var myAward = [];
	
	var myAwardList = new IScroll('#myAwardList',{
		bounce:false,
		click:true,
	});

	var hisTradeAwardList = new IScroll('#hisTradeAwardList',{
		bounce:false,
		click:true,
	});

	var myTradeAwardList = new IScroll('#myTradeAwardList',{
		bounce:false,
		click:true,
	});

	var choseAwardList = new IScroll('#choseAwardList',{
		bounce:false,
		click:true,
	});

	var getAwardList = new IScroll('#getAwardList',{
		bounce:false,
		click:true,
	});

	/**
	 * 页面初始化
	 */
	function pageInit(){
		eventInit();
		// DevelopTest();
		monitor_handler();
		addUser();
	}//end func
	
	/**
	 * 开发测试使用
	 */
	function DevelopTest(){
		loadingBox.hide();
		QABox.show();
	}

	/**
	 * 事件初始化
	 */
	function eventInit(){
		$(".limitBtn").on("touchend",limitClick);

		$("#closeBtn").on("touchend",closeGetAwardBox);
	}

	/**
	 * 关闭获奖页面
	 */
	function closeGetAwardBox(){
		icom.fadeOut(getAwardBox);
	}
	
	/**
	 * 添加用户
	 */
	function addUser(){
		var key = localStorage.ikey;
		if(!key){
			key = randomString(16);
			localStorage.ikey = key;
			getAward();
			setTimeout(function(){
				renderGetAwardBox();
			},10)
		}
		myAward = localStorage.iawards.split(",");
		renderMyAwardList();
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
	function renderMyAwardList(){
		var cont = "";
		for (let i = 0; i < myAward.length; i++) {
			cont += makeAwardHtml(myAward[i]);
		}
		$("#myAwardList .scrollBox").empty().append(cont);
		$("#choseAwardList .scrollBox").empty().append(cont);
		myAwardList.refresh();
	}

	/**
	 * 生成奖品的html
	 */
	function makeAwardHtml(id){
		return `<div class="award" style="background: url(images/award/${id}.jpg) no-repeat;background-size: cover;background-position: center;" data-id="${id}">
					<div class="name">${awardData[id]}</div>
				</div>`
	}

	/**
	 * 渲染中的赏品
	 */
	function renderGetAwardBox(){
		var cont = "";
		for (let i = 0; i < myAward.length; i++) {
			cont += makeAwardHtml(myAward[i]);
		}
		$("#getAwardList .scrollBox").empty().append(cont);
		getAwardBox.show();
		getAwardList.refresh();
	}

	/**
	 * 获取奖品
	 */
	function getAward(){
		var awards = ""
		for (let i = 0; i < 30; i++) {
			awards += ( i == 0 ? "" : ",") + imath.randomRange(1,13);
		}
		localStorage.iawards = awards;
	}

	/**
	 * 限制点击
	 */
	function limitClick(){
		$(".limitBtn").addClass('noPointer');
		setTimeout(function(){$(".limitBtn").removeClass('noPointer')},500);
	}//end func
	
	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler(){
//		imonitor.add({obj:$('a.btnTest'),action:'touchstart',category:'default',label:'测试按钮'});
	}//end func
});//end ready
