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
	var searchParams = function (p) {
        var retParam = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: p.limit,   						//页面大小
            page: p.offset / p.limit,  		//当前页
            userId: g_params.userId,
            isIn: false
        };
        return retParam;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.staff.bind.getMemberUserList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        height: 320,
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
}


/**
 * 提交数据
 */
function submitAction(){
	var rows = $table.bootstrapTable('getSelections');
	if(rows == null || rows == undefined || rows.length == 0){
		top.app.message.alert("请选择最少一条数据进行操作！");
		return;
	}
	var idsList = "";
	$.each(rows, function(i, rowData) {
		if(idsList != "") idsList = idsList + ",";
		idsList = idsList + rowData.memberId;
	});
	//定义提交数据
	var submitData = {};
	submitData["userId"] = g_params.userId;
	submitData["idsList"] = idsList;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.alert("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}