var $table = $('#tableList'), g_operRights = [];
var g_clearingTypeDict = null;
var g_clearingPeriodDict = null;

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
	g_clearingTypeDict = top.app.getDictDataByDictTypeValue('SCMS_CLEARING_TYPE');
	g_clearingPeriodDict = top.app.getDictDataByDictTypeValue('SCMS_CLEARING_PERIOD');
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	top.app.addComboBoxOption($("#searchClearingType"), g_clearingTypeDict, true);
	top.app.addComboBoxOption($("#searchClearingPeriod"), g_clearingPeriodDict, true);
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
			ruleName: $("#searchRuleName").val(),
			clearingType: $("#searchClearingType").val(),
			clearingPeriod: $("#searchClearingPeriod").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/user/getCommissionRuleList",   		//请求后台的URL（*）
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
		$("#searchRuleName").val("");
		$("#searchClearingType").val("");
		$("#searchClearingPeriod").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#scmsCommissionRuleAdd").click(function () {
		//设置参数
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.clearingTypeDict = g_clearingTypeDict;
		top.app.info.iframe.params.clearingPeriodDict = g_clearingPeriodDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsCommissionRuleAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/user/scms-commission-rule-edit.html?_pid=" + pid + "&backUrl=/scms/user/scms-commission-rule.html";
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

function scmsCommissionRuleEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.type = 'edit';
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.clearingTypeDict = g_clearingTypeDict;
	top.app.info.iframe.params.clearingPeriodDict = g_clearingPeriodDict;
	top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + url;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/scms/user/scms-commission-rule-edit.html?_pid=" + pid + "&backUrl=/scms/user/scms-commission-rule.html";
	window.location.href = encodeURI(url);
}

function scmsCommissionRuleDel(id, url){
	appTable.delData($table, url, id + "");
}

function formatClearingType(value,row,index){
	var i = g_clearingTypeDict.length;
	while (i--) {
		if(g_clearingTypeDict[i].ID == value){
			return g_clearingTypeDict[i].NAME;
		}
	}
	return "未知";
}
function formatClearingPeriod(value,row,index){
	var i = g_clearingPeriodDict.length;
	while (i--) {
		if(g_clearingPeriodDict[i].ID == value){
			return g_clearingPeriodDict[i].NAME;
		}
	}
	return "未知";
}

