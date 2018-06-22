var $table = $('#tableList'), g_operRights = [];

$(function () {
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});


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
			customerName: $("#searchCustomerName").val(),
			customerPhone: $("#searchCustomerPhone").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerInfoList",   		//请求后台的URL（*）
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
		$("#searchCustomerName").val("");
		$("#searchCustomerPhone").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#scmsCustomerInfoAdd").click(function () {
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsCustomerInfoAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/scms-customer-info-edit.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });

	$("#scmsCustomerReceipt").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/customer-receipt.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsCustomerDealHistory").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/customer-deal-history.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsCustomerReturnHistory").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/customer-return-history.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsCustomerReceiptHistory").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/customer-receipt-history.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsCustomerCheckHistory").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/customer-check-history.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsCustomerReserveHistory").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/customer/customer-reserve-history.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
		window.location.href = encodeURI(url);
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2'){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function scmsCustomerInfoEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.type = 'edit';
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + url;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/scms/customer/scms-customer-info-edit.html?_pid=" + pid + "&backUrl=/scms/customer/scms-customer-info.html";
	window.location.href = encodeURI(url);
}

function scmsCustomerInfoDel(id, url){
	appTable.delData($table, url, id + "");
}


