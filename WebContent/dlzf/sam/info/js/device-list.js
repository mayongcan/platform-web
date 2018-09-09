var $table = $('#tableList');
var g_statWorkDict = [], g_statPfDict = [], g_statMbDict = [];

$(function () {
	//初始化字典
	initDict();
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
 * 初始化字典
 * @returns
 */
function initDict(){
	g_statWorkDict = rales.getDictByCode("00062006");
	g_statPfDict = rales.getDictByCode("00082006");
	g_statMbDict = rales.getDictByCode("00342006");
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	top.app.addComboBoxOption($("#searchStatWork"), g_statWorkDict, true);
}

/**
 * 初始化权限
 */
function initFunc(){
	var g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
						"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
					 "</button>";
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
			statWork: $("#searchStatWork").val(),
			deviceType: $("#searchDeviceType").val(),
			deviceAuth: $("#searchDeviceAuth").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getEquList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        		appTable.setRowClickStatus($table, row, $el);
        },
        onDblClickRow: function(row, $el){
        		btnDetail(row);
	    }
    });
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchStatWork").val("");
		$("#searchDeviceType").val("");
		$("#searchDeviceAuth").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}


function tableFormatType(value, row) {
	return appTable.tableFormatDictValue(g_statWorkDict, value);
}
function tableFormatPf(value, row) {
	return appTable.tableFormatDictValue(g_statPfDict, value);
}
function tableFormatMb(value, row) {
	return appTable.tableFormatDictValue(g_statMbDict, value);
}
