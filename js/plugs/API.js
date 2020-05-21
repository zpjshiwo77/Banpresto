var API = new importAPI();

function importAPI () {
	var _self = this;

	var requestDomain = "API/record/record.php?method=";

	function _Ajax(opts){
	    var type = opts.type || "GET";
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
	        	alert("网络可能存在问题，请刷新试试!");
	        }
	    });
	}

	/**
     * 
     * @param {*} onSuccess 回调函数
     */
	_self.addUser = function(data,onSuccess){
		_Ajax({
            API:"addUser",
            data:data,
            onSuccess:onSuccess
        });
	}//end func
	
	/**
     * 
     * @param {*} onSuccess 回调函数
     */
	_self.getUser = function(data,onSuccess){
		_Ajax({
            API:"getUser",
            data:data,
            onSuccess:onSuccess
        });
	}//end func
	
	/**
     * 
     * @param {*} onSuccess 回调函数
     */
	_self.addRecord = function(data,onSuccess){
		_Ajax({
            API:"addRecord",
            data:data,
            onSuccess:onSuccess
        });
	}//end func
	
	/**
     * 
     * @param {*} onSuccess 回调函数
     */
	_self.getRecords = function(onSuccess){
		_Ajax({
            API:"getRecords",
            data:{},
            onSuccess:onSuccess
        });
	}//end func
	
	/**
     * 
     * @param {*} onSuccess 回调函数
     */
	_self.deleteRecord = function(data,onSuccess){
		_Ajax({
            API:"deleteIRecord",
            data:data,
            onSuccess:onSuccess
        });
    }//end func

}//end import