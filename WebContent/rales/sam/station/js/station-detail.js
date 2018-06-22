var $table = $('#tableList'), g_backUrl = null, g_params = {};
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	// 初始化权限
	initFunc();
	// 初始化列表信息
	initTable();
	// 初始化权限功能按钮点击事件
	initFuncBtnEvent();
	$('#company').text(g_params.data.orgName);
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
//	var length = operRights.length;
//	for (var i = 0; i < length; i++) {
//		if(operRights[i].funcFlag.indexOf("dictData") != -1){
//			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
//							"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
//						 "</button>";
//		}
//	}
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarNew'>" + 
					"<i class='glyphicon glyphicon-plus' aria-hidden='true'></i> 年审/缴费" +
				 "</button>"
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarBack'>" + 
					"<i class='glyphicon glyphicon-arrow-left' aria-hidden='true'></i> 返回" +
				 "</button>"
	// 添加表格的权限
//	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable(){
	// 搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						// 页面大小
            page: params.offset / params.limit,  		// 当前页
            orgCode: g_params.data.orgCode
        };
        return param;
    };
    // 初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getStationListByOrgCode",   		// 请求后台的URL（*）
        queryParams: searchParams,										// 传递参数（*）
        uniqueId: 'guid',
        onClickRow: function(row, $el){
        		appTable.setRowClickStatus($table, row, $el);
        }
    });
	// 搜索面板高度
	appTable.searchPannelHeight = $('#titleInfo').outerHeight(true) - 10;
	// 初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	// 绑定工具条事件
	$("#toolbarNew").click(function () {
		var params = {};
		params.data = g_params.data;
		top.app.layer.editLayer('年审/缴费', ['710px', '420px'], '/rales/sam/station/station-pay-edit.html', params, function(){
		});
    });
	// 返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= g_backUrl + "?_pid=" + pid + "&code=" + g_params.data.licenseCode;
    });
}

function tableFormatStatType(value, row) {
	return appTable.tableFormatDictValue(g_params.statTypeDict, value);
}
function tableFormatStatWork(value, row) {
	return appTable.tableFormatDictValue(g_params.statWorkDict, value);
}
