var $table = $('#tableList'), g_flowProgressDict = [], g_caseSourceDict = [], g_caseTypeDict = [];

$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	g_flowProgressDict = top.app.getDictDataByDictTypeValue('AEL_CASE_FLOW_PROCEDURE');
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CLUE');
	g_caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
	top.app.addComboBoxOption($("#searchFlowProgress"), g_flowProgressDict, true);
	//获取权限菜单
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
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
						"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
					 "</button>";
	}
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
            code: $('#searchCode').val(),
            caseCode: $('#searchCaseCode').val(),
//            flowProgress: $('#searchFlowProgress').val(),
            lastHandlerUserName: $('#searchLastHandlerUserName').val(),
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseUnRecordList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
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
		$("#searchCode").val("");
		$("#searchCaseCode").val("");
//		$("#searchFlowProgress").val("");
		$("#searchLastHandlerUserName").val("");
		$("#searchLastHandleTimeBegin").val("");
		$("#searchLastHandleTimeEnd").val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}

function tableFormatFlowProgress(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return appTable.tableFormatDictValue(g_flowProgressDict, value);
	else{
		if(row.subFlowProgress == '6') return "案件移送审批流程(立案)";
		else if(row.subFlowProgress == '7') return "案件移送审批流程(调查报告)";
		else if(row.subFlowProgress == '8') return "不予行政处罚决定审批流程";
		else if(row.subFlowProgress == '10') return "行政检查登记流程";
		else if(row.subFlowProgress == '11') return "行政检查登记流程";
		else if(row.subFlowProgress == '12') return "先行登记保存证据审批流程";
		else if(row.subFlowProgress == '13') return "先行登记保存证据审批流程";
		else if(row.subFlowProgress == '14') return "行政强制措施及相关事项内部审批";
		else if(row.subFlowProgress == '15') return "行政强制措施及相关事项内部审批";
		else if(row.subFlowProgress == '16') return "行政处罚决定法制审核流程";
		else if(row.subFlowProgress == '17') return "听证审批流程";
		else if(row.subFlowProgress == '18') return "行政处罚没收财物处理审批";
		else if(row.subFlowProgress == '19') return "行政处罚延期（分期）缴纳罚款审批";
		else if(row.subFlowProgress == '20') return "行政强制执行及相关事项内部审批";		
		else if(row.subFlowProgress == '21') return "销案审批流程";	
		else if(row.subFlowProgress == '22') return "内部呈批流程";	
	}
}

function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + row.id + ')">' + 
				'查看' + 
			'</button>';
}

function btnEventDetail(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.isFinish = true;
	top.app.info.iframe.params.flowProgressDict = g_flowProgressDict;
	top.app.info.iframe.params.caseSourceDict = g_caseSourceDict;
	top.app.info.iframe.params.caseTypeDict = g_caseTypeDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/case-detail.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-unrecord.html";
	window.location.href = encodeURI(url);
}