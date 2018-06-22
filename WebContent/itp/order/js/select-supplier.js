var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
var g_selectRowsId = [];
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
            merchantsId: itp.getUserMerchantsId(),
            supplierName: $("#searchSupplierName").val(),
            supplierAdmin: $("#searchSupplierAdmin").val(),
            supplierPhone: $("#searchSupplierPhone").val(),
        };
        return retParam;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/customer/getSupplierInfoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 360,
        onClickRow: function(row, $el){        		
    		appTable.setRowClickStatus($table, row, $el);
    		g_selectRowsId = row;
        }
    });
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchSupplierName").val("");
		$("#searchSupplierAdmin").val("");
		$("#searchSupplierPhone").val("");
		$table.bootstrapTable('refresh');
    });
}


/**
 * 提交数据
 */
function submitAction(){
	if(g_selectRowsId == null || g_selectRowsId == undefined || g_selectRowsId.length == 0){
		top.app.message.notice("请选择一条数据进行操作！");
		return;
	}
	var rowObj = [];
	rowObj.supplierId = g_selectRowsId.id;
	rowObj.supplierName = g_selectRowsId.supplierName;
	rowObj.supplierBalance = g_selectRowsId.supplierBalance;
	parent.app.layer.retParams = [];
	parent.app.layer.retParams.push(rowObj);

	//关闭页面前设置结果
	parent.app.layer.editLayerRet = true;
	parent.layer.close(g_iframeIndex);
}