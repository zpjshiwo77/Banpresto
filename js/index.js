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
	var inputBox = $("#inputBox");
	
	var listBoxScroll = new IScroll('#listBox',{
		bounce:false,
		click:true,
	});
	var listBoxScroll2 = new IScroll('#listBox2',{
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
		getRecords();
		selectInit($("#Stype"),$("#Sname"));
		selectInit($("#Atype"),$("#Aname"));
		selectInit($("#Btype"),$("#Bname"));
	}//end func
	
	/**
	 * 开发测试使用
	 */
	function DevelopTest(){
		loadingBox.hide();
		QABox.show();
	}

	/**
	 * 选择器初始化
	 */
	function selectInit(selectA,selectB){
		var contA = "";
		for (const key in choseData) {
			const ele = choseData[key];
			contA += '<option value="'+key+'">'+key+'</option>';
		}
		selectA.empty().append(contA);

		var arr = choseData["和之国"].list;
		var contB = "";
		for (let i = 0; i < arr.length; i++) {
			const ele = arr[i];
			contB += '<option value="'+ele+'">'+ele+'</option>';
		}
		selectB.empty().append(contB);
	}

	/**
	 * 事件初始化
	 */
	function eventInit(){
		$(".limitBtn").on("touchend",limitClick);

		indexBox.find(".idBtn").on("touchend",showIdBox);
		indexBox.find(".regBtn").on("touchend",showInputBox);

		inputBox.find(".closeBtn").on("touchend",CloseInputBox);
		inputBox.find(".changeBtn").on("touchend",changeName);
		inputBox.find(".addBtn").on("touchend",addRecord);
		inputBox.on("touchend",".del",delRecord);

		$("#Stype").on("change",changeSelectS);
		$("#Atype").on("change",changeSelectA);
		$("#Btype").on("change",changeSelectB);
	}
	
	/**
	 * 修改选择器
	 */
	function changeSelectS(){
		var val = $("#Stype").val();

		var arr = choseData[val].list;
		var contB = "";
		for (let i = 0; i < arr.length; i++) {
			const ele = arr[i];
			contB += '<option value="'+ele+'">'+ele+'</option>';
		}
		$("#Sname").empty().append(contB);
	}

	/**
	 * 修改选择器
	 */
	function changeSelectA(){
		var val = $("#Atype").val();

		var arr = choseData[val].list;
		var contB = "";
		for (let i = 0; i < arr.length; i++) {
			const ele = arr[i];
			contB += '<option value="'+ele+'">'+ele+'</option>';
		}
		$("#Aname").empty().append(contB);
	}

	/**
	 * 修改选择器
	 */
	function changeSelectB(){
		var val = $("#Btype").val();

		var arr = choseData[val].list;
		var contB = "";
		for (let i = 0; i < arr.length; i++) {
			const ele = arr[i];
			contB += '<option value="'+ele+'">'+ele+'</option>';
		}
		$("#Bname").empty().append(contB);
	}

	/**
	 * 删除记录
	 */
	function delRecord(){
		var id = $(this).data("id");
		API.deleteRecord({id:id},function(data){
			if(data.errorCode == 0){
				icom.alert("删除成功");
				for (const key in userData) {
					const ele = userData[key];
					ele.record = [];
				}
				getRecords();
			}
		})
	}

	/**
	 * 添加记录
	 */
	function addRecord(){
		var numsA = $("#numsA").val();
		var numsB = $("#numsB").val();
		var Atype = $("#Atype").val();
		var Aname = $("#Aname").val();
		var Btype = $("#Btype").val();
		var Bname = $("#Bname").val();
		if(numsA == "" || numsA < 1 || numsA > 99) icom.alert("请输入正确数量，大于1，小于99");
		else if(numsB == "" || numsA < 1 || numsB > 99) icom.alert("请输入正确数量，大于1，小于99");
		else{
			API.addRecord({
				key:localStorage.ikey,
				word:`<p>${Atype+Aname} * ${numsA}<span>换</span>${Btype+Bname} * ${numsB}</p>`
			},function(data){
				if(data.errorCode == 0){
					icom.alert("添加成功")
					getRecords();
				}
				else{
					icom.alert("添加失败")
				}
			})
		}
	}

	/**
	 * 添加用户
	 */
	function addUser(){
		var key = localStorage.ikey;
		if(key){
			API.getUser({key:key},function(data){
				if(data.errorCode == 0){
					$("#iname").val(data.result.name);
					$("#iId").val(data.result.wxCode);
				}
			})
		}
		else{
			key = randomString(16);
			localStorage.ikey = key;
			API.addUser({
				key:key,
				name:"",
				wxcode:""
			});
		}
	}

	function changeName(){
		var name = $("#iname").val();
		var id = $("#iId").val();
		if(name == "") icom.alert("请输入昵称");
		else{
			API.addUser({
				key:localStorage.ikey,
				name:name,
				wxcode:id
			},function(data){
				if(data.errorCode == 0){
					icom.alert("修改成功")
				}
				else{
					icom.alert("修改失败")
				}
			});
		}
	}

	/**
	 * 显示输入的页面
	 */
	function showInputBox(){
		icom.fadeIn(inputBox);
		listBoxScroll2.refresh();
	}

	/**
	 * 关闭输入页面
	 */
	function CloseInputBox(){
		icom.fadeOut(inputBox);
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
	 * 获取记录
	 */
	function getRecords(){
		loadBox.show();
		API.getRecords(function(data){
			if(data.errorCode == 0){
				creatUserData(data.result);
			}
		});
	}

	/**
	 * 创建用户数据
	 */
	function creatUserData(list){
		for (let i = 0; i < list.length; i++) {
			const item = list[i];
			if(userData.hasOwnProperty(item.key)){
				addOneUserData(item);
			}
			else{
				craetOneUserData(item);
			}
		}
		setTimeout(function(){
			icom.fadeOut(loadBox);
			updateIndexList();
			updateUserList();
		},1000);
	}

	/**
	 * 更新首页列表
	 */
	function updateIndexList(){
		// console.log(userData)
		var box = $("#listBox .scrollBox");
		var cont = "";
		for (const key in userData) {
			const ele = userData[key];
			if(ele.record.length == 0) continue;
			cont += `<div class="block">
						<div class="nameBox">
							<div class="nickname">${ele.name}</div>
							<div class="num">微信号：${ele.wxcode}</div>
						</div>
						<div class="listBox">`;

			for (let i = 0; i < ele.record.length; i++) {
				const element = ele.record[i];
				cont += element.word;
			}

			cont += `</div></div>`;
		}

		box.empty().append(cont);
		listBoxScroll.refresh();
	}

	/**
	 * 更新用户列表
	 */
	function updateUserList(){
		// console.log(userData)
		var data = [];
		var box = $("#listBox2 .listBox");
		var cont = "";

		for (const key in userData) {
			const ele = userData[key];
			if(key == localStorage.ikey){
				data = ele.record;
				break;
			}
		}
		
		for (let i = 0; i < data.length; i++) {
			const ele = data[i];
			cont += ele.word.replace('</p>','<span data-id="'+ele.id+'" class="del">删除</span></p>');
		}
		box.empty().append(cont);
		listBoxScroll2.refresh();
	}

	/**
	 * 添加一个用户数据
	 */
	function addOneUserData(data){
		var user = userData[data.key];
		var bool = judgeExit(user.record,data);
		if(bool) user.record.push(data);
	}

	/**
	 * 判断是否存在
	 */
	function judgeExit(arr,item){
		for (let i = 0; i < arr.length; i++) {
			const ele = arr[i];
			if(ele.id == item.id) return false;
		}
		return true;
	}

	/**
	 * 添加一个用户
	 */
	function craetOneUserData(data){
		var key = data.key;
		userData[key] = {};
		userData[key]["key"] = key;
		userData[key]["record"] = [];
		userData[key].record.push(data);
		API.getUser({key:key},function(data){
			if(data.errorCode == 0){
				userData[key]["name"] = data.result.name == "" ? "保密" : data.result.name;
				userData[key]["wxcode"] = data.result.wxCode == "" ? "保密" : data.result.wxCode;
			}
		})
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
