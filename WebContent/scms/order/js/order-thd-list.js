var $table = $('#tableList'), g_operRights = [], g_orderType = 'thd', g_orderTypeName = '退货单';
var g_orderTypeDict = null;
var g_orderStatusDict = null;
var g_orderPayStatusDict = null;
var g_orderSendStatusDict = null;
var g_orderReceiveStatusDict = null;

$(function () {
	//初始化字典
	initView();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始基础视图
 * @returns
 */
function initView(){
	g_orderTypeDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_TYPE');
	g_orderStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_STATUS');
	g_orderPayStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_PAY_STATUS');
	g_orderSendStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_SEND_STATUS');
	g_orderReceiveStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_RECEIVE_STATUS');
	top.app.addComboBoxOption($("#searchOrderType"), g_orderTypeDict, true);
	top.app.addComboBoxOption($("#searchOrderStatus"), g_orderStatusDict, true);
	top.app.addComboBoxOption($("#searchOrderPayStatus"), g_orderPayStatusDict, true);
	top.app.addComboBoxOption($("#searchOrderSendStatus"), g_orderSendStatusDict, true);
	top.app.addComboBoxOption($("#searchOrderReceiveStatus"), g_orderReceiveStatusDict, true);
	//获取店铺下拉列表
	scms.getShopPullDown($("#searchShopId"), scms.getUserMerchantsId(), true);
	scms.getCustomerType($("#searchCustomerType"), scms.getUserMerchantsId(), true);
	scms.getCustomerLevel($("#searchCustomerLevel"), scms.getUserMerchantsId(), true);
}

/**
 * 初始化权限
 */
function initFunc(){
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		//显示在列表上方的权限菜单
		if(g_operRights[i].dispPosition == '1' || g_operRights[i].dispPosition == undefined){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
	}
	//添加默认权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
			merchantsId: scms.getUserMerchantsId(),
			orderTypeList: g_orderType,
			shopId: $("#searchShopId").val(),
			orderStatus: $("#searchOrderStatus").val(),
			orderPayStatus: $("#searchOrderPayStatus").val(),
			orderReceiveStatus: $("#searchOrderReceiveStatus").val(),
			customerTypeId: $("#searchCustomerType").val(),
			customerLevelId: $("#searchCustomerLevel").val(),
			customerName: $("#searchCustomerName").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/order/getOrderInfoList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchMerchantsId").val("");
		$("#searchShopId").val("");
		$("#searchOrderStatus").val("");
		$("#searchOrderPayStatus").val("");
		$("#searchOrderReceiveStatus").val("");
		$("#searchCustomerType").val("");
		$("#searchCustomerLevel").val("");
		$("#searchCustomerName").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#scmsOrderThdAdd").click(function () {
		//进入创建订单页面
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.orderTypeId = g_orderType;
		top.app.info.iframe.params.orderTypeName = g_orderTypeName;
		top.app.info.iframe.params.orderTypeDict = g_orderTypeDict;
		top.app.info.iframe.params.orderStatusDict = g_orderStatusDict;
		top.app.info.iframe.params.orderPayStatusDict = g_orderPayStatusDict;
		top.app.info.iframe.params.orderSendStatusDict = g_orderSendStatusDict;
		top.app.info.iframe.params.orderReceiveStatusDict = g_orderReceiveStatusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsOrderThdAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/order/order-lsd-edit.html?_pid=" + pid + "&backUrl=/scms/order/order-thd-list.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsOrderThdEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		if(rows[0].orderStatus == '2'){
			top.app.message.alert("不能对已锁定的订单进行编辑！");
			return;
		}
		if(rows[0].orderStatus == '3'){
			top.app.message.alert("不能对已取消的订单进行编辑！");
			return;
		}
		if(rows[0].orderStatus == '4'){
			top.app.message.alert("不能对已完成的订单进行编辑！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'edit';
		top.app.info.iframe.params.row = rows[0];
		top.app.info.iframe.params.orderTypeId = g_orderType;
		top.app.info.iframe.params.orderTypeName = g_orderTypeName;
		top.app.info.iframe.params.orderTypeDict = g_orderTypeDict;
		top.app.info.iframe.params.orderStatusDict = g_orderStatusDict;
		top.app.info.iframe.params.orderPayStatusDict = g_orderPayStatusDict;
		top.app.info.iframe.params.orderSendStatusDict = g_orderSendStatusDict;
		top.app.info.iframe.params.orderReceiveStatusDict = g_orderReceiveStatusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsOrderThdEdit").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/order/order-lsd-edit.html?_pid=" + pid + "&backUrl=/scms/order/order-thd-list.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsOrderThdLock").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要锁定的订单！");
			return;
		}
		if(rows[0].orderStatus == '3'){
			top.app.message.alert("不能对已取消的订单进行锁定！");
			return;
		}
		if(rows[0].orderStatus == '4'){
			top.app.message.alert("不能对已完成的订单进行锁定！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		var obj = new Object();
		obj.idsList = idsList;
		obj.orderType = g_orderType;
		appTable.postData($table, $("#scmsOrderThdLock").data('action-url'), JSON.stringify(obj), "确定要锁定当前选中的订单？", "订单锁定成功！");
    });
	$("#scmsOrderThdCancel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要取消的订单！");
			return;
		}
		if(rows[0].orderStatus == '3'){
			top.app.message.alert("当前订单已取消！");
			return;
		}
		if(rows[0].orderStatus == '4'){
			top.app.message.alert("不能对已完成的订单进行操作！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		var obj = new Object();
		obj.idsList = idsList;
		obj.orderType = g_orderType;
		appTable.postData($table, $("#scmsOrderThdCancel").data('action-url'), JSON.stringify(obj), "确定要取消当前选中的订单？", "订单取消成功！");
    });
	$("#scmsOrderThdFinish").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要完成的订单！");
			return;
		}
		if(rows[0].orderStatus == '3'){
			top.app.message.alert("不能对已取消的订单进行操作！");
			return;
		}
		if(rows[0].orderStatus == '4'){
			top.app.message.alert("当前订单已完成！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		var obj = new Object();
		obj.idsList = idsList;
		obj.orderType = g_orderType;
		appTable.postData($table, $("#scmsOrderThdFinish").data('action-url'), JSON.stringify(obj), "确定要完成当前选中的订单？", "订单操作成功！");
    });
	$("#scmsOrderThdDetail").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行查看！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		top.app.info.iframe.params.orderTypeId = g_orderType;
		top.app.info.iframe.params.orderTypeName = g_orderTypeName;
		top.app.info.iframe.params.orderTypeDict = g_orderTypeDict;
		top.app.info.iframe.params.orderStatusDict = g_orderStatusDict;
		top.app.info.iframe.params.orderPayStatusDict = g_orderPayStatusDict;
		top.app.info.iframe.params.orderSendStatusDict = g_orderSendStatusDict;
		top.app.info.iframe.params.orderReceiveStatusDict = g_orderReceiveStatusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsOrderThdDetail").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/order/order-lsd-detail.html?_pid=" + pid + "&backUrl=/scms/order/order-thd-list.html";
		window.location.href = encodeURI(url);
    });
}

function formatOrderType(value,row,index){
	return appTable.tableFormatDictValue(g_orderTypeDict, value);
}
function formatOrderStatus(value,row,index){
	return appTable.tableFormatDictValue(g_orderStatusDict, value);
}
function formatOrderPayStatus(value,row,index){
	return appTable.tableFormatDictValue(g_orderPayStatusDict, value);
}
function formatOrderSendStatus(value,row,index){
	return appTable.tableFormatDictValue(g_orderSendStatusDict, value);
}
function formatOrderReceiveStatus(value,row,index){
	return appTable.tableFormatDictValue(g_orderReceiveStatusDict, value);
}

