var API = new importAPI();

function importAPI () {
	var _self = this;

	var requestDomain = "https://quikbl.beats-digital.com/Api/Handler.ashx?method=";

	function _Ajax(opts){
	    var type = opts.type || "POST";
	    $.ajax({
	        type: type,
	        url: requestDomain + opts.API,
	        dataType: 'json',
	        async: true,
	        data: opts.data,
	        success: function(data){
                if (opts.onSuccess) opts.onSuccess(data);
	        },
	        error: function(){
	        	alert("网络可能存在问题，请刷新试试！");
	        }
	    });
	}

	/**
     * 获取用户信息
     * @param {*} onSuccess 回调函数
     */
	_self.GetUser = function(onSuccess){
		_Ajax({
            API:"GetUser",
            data:{},
            onSuccess:onSuccess
        });
    }//end func

}//end import