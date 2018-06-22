var $table = $('#tableList'), g_operRights = [], g_dateFormatBegin, g_dateFormatEnd;

$(function () {
	//初始化搜索面板
	initSearchPanel();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	getFinanceFlowStatistics();
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
	scms.getShopPullDown($("#searchShopId"), scms.getUserMerchantsId(), true);
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
            merchantsId: scms.getUserMerchantsId(),
            shopId: $("#searchShopId").val(),
            orderNum: $("#searchOrderNum").val(),
            isValid: $('#searchIsValid').val(),
            createByName: $("#searchCreateByName").val(),
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/finance/getFinanceFlowList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	appTable.searchPannelHeight = $('#searchPannel').outerHeight(true) + 60;
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
		getFinanceFlowStatistics();
    });
	$("#btnReset").click(function () {
		$("#searchShopId").val("");
		$("#searchOrderNum").val("");
		$("#searchIsValid").val("");
		$("#searchCreateByName").val("");
		$('#searchBeginTime').val(g_dateFormatBegin);
		$('#searchEndTime').val(g_dateFormatEnd);
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
		getFinanceFlowStatistics();
    });
}

function tableFormatMoney(value,row,index){
	if(row.isValid == 'Y') return accounting.formatMoney(value, "¥");
	else return '<span style="text-decoration:line-through">' + accounting.formatMoney(value, "¥") + '</span>';
}

function tableFormatIsValid(value,row,index){
	if(value == 'Y') return '有效';
	else return '<span style="color:red">无效</span>';
}

function tableFormatIncomeType(value, row, index){
	if(value == '1') return '收入';
	else return '支出';
}

/**
 * 获取统计
 * @returns
 */
function getFinanceFlowStatistics(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/finance/getFinanceFlowStatistics",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
            shopId: $("#searchShopId").val(),
            orderNum: $("#searchOrderNum").val(),
            createByName: $("#searchCreateByName").val(),
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val()
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				$('#statisticsIn').text(accounting.formatMoney(data.rows[0].income, "¥"));
	   				$('#statisticsOut').text(accounting.formatMoney(data.rows[0].expend, "¥"));
	   				$('#statisticsAll').text(accounting.formatMoney(data.rows[0].all, "¥"));
	   			}
	   		}
	   	}
	});
}
