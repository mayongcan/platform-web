var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	$("#layerOk").click(function () {
		submitAction();
    });
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
			merchantsId: g_params.merchantsId,
			isBind: '0',
			isUsable: '1',
			name: $("#searchPointSourceName").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/point/getMerchantsPointSourceList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 380,
        onClickRow: function(row, $el){
    		appTable.setRowClickStatus($table, row, $el);
        }
    });
	appTable.multiCheckStatus = 2;
	//初始化Table相关信息
	appTable.initTable($table, "reset");
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchPointSourceName").val("");
		$table.bootstrapTable('refresh');
    });
}


/**
 * 提交数据
 */
function submitAction(){
	var rows = appTable.getSelectionRows($table);
	if(rows == null || rows == undefined || rows.length == 0){
		top.app.message.notice("请选择最少一条数据进行操作！");
		return;
	}
	top.app.message.loading();
	var idsList = "";
	$.each(rows, function(i, rowData) {
		if(idsList != "") idsList = idsList + ",";
		idsList = idsList + rowData.id;
	});
	//定义提交数据
	var submitData = {};
	submitData["idsList"] = idsList;
	submitData["merchantsId"] = g_params.merchantsId;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.notice("绑定积分源成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
//格式化图片
function formatImage(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else {
		var tmpImage = top.app.conf.url.res.url + value;
		return '<a href="' + tmpImage + '" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">显示图片</a>'
	}
}