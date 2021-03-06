var $table = $('#tableList'), g_operRights = [], g_dateFormatBegin, g_dateFormatEnd;

$(function () {
	//初始化搜索面板
	initSearchPanel();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	//搜索面板高度
	appTable.searchPannelHeight = $('#searchPannel').outerHeight(true);
	//实现日期联动
	$.date.initSearchDate('divBeginTime', 'divEndTime', 'YYYY-MM-DD HH:mm:ss');
	g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss");
	g_dateFormatBegin = $.date.dateFormat($.date.dateAdd('m', -1, g_dateFormatEnd), "YYYY-MM-DD HH:mm:ss");
	$('#searchBeginTime').val(g_dateFormatBegin);
	$('#searchEndTime').val(g_dateFormatEnd);
	itp.getShopPullDown($("#searchShopId"), itp.getUserMerchantsId(), true);
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
		if(g_operRights[i].dispPosition == '1'){
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
			merchantsId: itp.getUserMerchantsId(),
            shopId: $("#searchShopId").val(),
            orderNum: $("#searchOrderNum").val(),
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/merchants/getFinanceFlowList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//appTable.searchPannelHeight = $('#searchPannel').outerHeight(true) + 60;
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchShopId").val("");
		$("#searchOrderNum").val("");
		$('#searchBeginTime').val(g_dateFormatBegin);
		$('#searchEndTime').val(g_dateFormatEnd);
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}

function tableFormatOrderNum(value,row,index){
	if($.utils.isEmpty(value)) return '';
	else return '<a href="javascript:jumpToDetail(\'' + value +'\', \'' + row.orderType + '\')">' + value +' </a>'
}

function jumpToDetail(orderNum, orderType){
	top.app.message.loading();
	//获取字典
	var g_orderTypeDict = top.app.getDictDataByDictTypeValue('ITP_ORDER_TYPE');
	var g_orderStatusDict = top.app.getDictDataByDictTypeValue('ITP_ORDER_STATUS');
	var g_orderPayStatusDict = top.app.getDictDataByDictTypeValue('ITP_ORDER_PAY_STATUS');
	var g_orderSendStatusDict = top.app.getDictDataByDictTypeValue('ITP_ORDER_SEND_STATUS');
	var g_orderReceiveStatusDict = top.app.getDictDataByDictTypeValue('ITP_ORDER_RECEIVE_STATUS');
	
	top.app.info.iframe.params = {};
	//获取对应的订单
	top.app.info.iframe.params.row = itp.getOrderByOrderNum(orderNum, orderType);
	top.app.info.iframe.params.orderTypeId = orderType;
	top.app.info.iframe.params.orderTypeName = top.app.getDictName(orderType, g_orderTypeDict);
	top.app.info.iframe.params.orderTypeDict = g_orderTypeDict;
	top.app.info.iframe.params.orderStatusDict = g_orderStatusDict;
	top.app.info.iframe.params.orderPayStatusDict = g_orderPayStatusDict;
	top.app.info.iframe.params.orderSendStatusDict = g_orderSendStatusDict;
	top.app.info.iframe.params.orderReceiveStatusDict = g_orderReceiveStatusDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	top.app.message.loadingClose();
	var url = "";
	if(orderType == 'lsd' || orderType == 'pfd' || orderType == 'thd' || orderType == 'ysd')
		url = "/itp/order/order-lsd-detail.html?_pid=" + pid;
	else if(orderType == 'jhd' || orderType == 'fcd') 
		url = "/itp/order/order-jhd-detail.html?_pid=" + pid;
	else if(orderType == 'pdd') 
		url = "/itp/order/order-pdd-detail.html?_pid=" + pid;
	else if(orderType == 'dhd') 
		url = "/itp/order/order-dhd-detail.html?_pid=" + pid;
	else if(orderType == 'syd') 
		url = "/itp/order/order-syd-detail.html?_pid=" + pid;
	window.location.href = encodeURI(url);
}

function tableFormatMoney(value,row,index){
	return accounting.formatMoney(value, "¥");
}

function tableFormatOrderStatus(value,row,index){
	if(value == '1') return '未支付';
	else if(value == '2') return '<font color="red">支付失败</font>';
	else if(value == '3') return '<font color="green">支付成功</font>';
	else return '未支付';
}