var $table = $('#tableList'), g_operRights = [], g_params = {}, g_orderType = 'syd', g_orderTypeName = '收银单';
var g_orderTypeDict = null;
var g_orderStatusDict = null;

$(function () {
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	//初始化字典
	initView();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
	getReceiptHistoryStatistics();
	top.app.message.loadingClose();
});

/**
 * 初始基础视图
 * @returns
 */
function initView(){
	g_orderTypeDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_TYPE');
	g_orderStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_STATUS');
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
			orderCustomerType: '1',
			customerId: g_params.rows.id,
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/order/getOrderSydList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}


//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="detailActoin(' + row.id + ')">' + 
				'<i class="glyphicon glyphicon-info-sign" aria-hidden="true"></i> 详情' +
		  '</button>'
}

function detailActoin(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.orderTypeId = g_orderType;
	top.app.info.iframe.params.orderTypeName = g_orderTypeName;
	top.app.info.iframe.params.orderTypeDict = g_orderTypeDict;
	top.app.info.iframe.params.orderStatusDict = g_orderStatusDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/scms/order/order-syd-detail.html?_pid=" + pid + "&backUrl=/scms/order/order-syd-list.html";
	window.location.href = encodeURI(url);
}

function formatOrderStatus(value,row,index){
	return appTable.tableFormatDictValue(g_orderStatusDict, value);
}


/**
 * 获取统计
 * @returns
 */
function getReceiptHistoryStatistics(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getReceiptHistoryStatistics",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
			merchantsId: scms.getUserMerchantsId(),
			orderType: g_orderType,
			orderCustomerType: '1',
			customerId: g_params.rows.id,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				$('#totalCnt').text(data.rows[0].totalCnt);
	   				$('#finishCnt').text(data.rows[0].finishCnt);
	   				$('#cancelCnt').text(data.rows[0].cancelCnt);
	   				$('#totalMoney').text(accounting.formatMoney(data.rows[0].totalMoney, "¥"));
	   				$('#finishMoney').text(accounting.formatMoney(data.rows[0].finishMoney, "¥"));
	   				$('#cancelMoney').text(accounting.formatMoney(data.rows[0].cancelMoney, "¥"));
	   			}
	   		}
	   	}
	});
}
