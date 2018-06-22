var g_params = {}, g_backUrl = "";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initView();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});

function initView(){
	$('#orderNum').text(g_params.row.orderNum);
	$('#orderStatus').text(top.app.getDictName(g_params.row.orderStatus, g_params.orderStatusDict));
	$('#shopId').text(g_params.row.shopName);
	$('#createByName').text(g_params.row.createByName);
	$('#createDate').text(g_params.row.createDate);
	$('#orderMemo').text(g_params.row.orderMemo);
	loadCustomer();
	loadPayList();
	
}

//加载客户信息
function loadCustomer(){
	$('#customerInfo').empty();
	if(g_params.row.orderCustomerType == '2'){
		var supplierInfo = scms.getSupplierById(g_params.row.customerId);
		$('#customerInfo').append('供货商名称：<span style="margin-right:50px;">' + supplierInfo.supplierName + '</span>');
		$('#customerInfo').append('供货商负责人：<span style="margin-right:50px;">' + supplierInfo.supplierAdmin + '</span>');
		$('#customerInfo').append('联系电话：<span style="margin-right:50px;">' + supplierInfo.supplierPhone + '</span>');
		$('#customerInfo').append('客户余额：<span style="margin-right:50px;color:#81c41f">' + accounting.formatMoney(supplierInfo.supplierBalance, "¥") + '</span>');
	}else{
		var customerInfo = scms.getCustomerById(g_params.row.customerId);
		$('#customerInfo').append('客户类型：<span style="margin-right:50px;">' + customerInfo.typeName + '</span>');
		$('#customerInfo').append('客户等级：<span style="margin-right:50px;">' + customerInfo.levelName + '</span>');
		$('#customerInfo').append('客户名称：<span style="margin-right:50px;">' + customerInfo.customerName + '</span>');
		$('#customerInfo').append('客户余额：<span style="margin-right:50px;color:#81c41f">' + accounting.formatMoney(customerInfo.customerBalance, "¥") + '</span>');
	}
}

//加载已付款列表
function loadPayList(){
	var orderPayList = scms.getOrderPayList(g_params.row.id);
	$('#orderPayList').empty();
	for(var i = 0; i < orderPayList.length; i++){
		$('#orderPayList').append('<tr>' + 
									'<td class="reference-td" style="width:120px">' + orderPayList[i].payTypeName + '：</td>' + 
									'<td class="reference-td" style="color:#e95879">' + accounting.formatMoney(orderPayList[i].payAmount, "¥") + '</td>' + 
								'</tr>');
	}
}
