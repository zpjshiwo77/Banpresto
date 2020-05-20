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
	var idBox = $("#idBox");
	

	/**
	 * 页面初始化
	 */
	function pageInit(){
		eventInit();
		// DevelopTest();
		monitor_handler();
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

		indexBox.find(".idBtn").on("touchend",showIdBox);
	}

	/**
	 * 显示
	 */
	function showIdBox(){
		icom.popOn(idBox)
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
