var $table = $('#tableList'), g_flowProgressDict = [], g_caseSourceDict = [], g_caseTypeDict = [];

$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	$('#searchRegisterDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});
	$('#searchFilingBeginDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});
	$('#searchFilingEndDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});
	g_flowProgressDict = top.app.getDictDataByDictTypeValue('AEL_CASE_FLOW_PROCEDURE');
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
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
//	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
//	$("#tableToolbar").empty();
	var htmlTable = "";
//	var length = operRights.length;
//	for (var i = 0; i < length; i++) {
//		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
//						"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
//					 "</button>";
//	}
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);

	// 权限类型下拉框变更事件
	$('#searchFlowProgress').on('changed.bs.select',
		function(e) { $table.bootstrapTable('refresh'); }
	);
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
            isNormalCase: '1',
            code: $('#searchCode').val(),
            caseCode: $('#searchCaseCode').val(),
            flowProgress: $('#searchFlowProgress').val(),
            lastHandlerUserName: $('#searchLastHandlerUserName').val(),
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
            parties: $('#searchParties').val(),
            associate: $('#searchAssociate').val(),
            registerDate: $('#searchRegisterDate').val(),
            filingBeginDate: $('#searchFilingBeginDate').val(),
            filingEndDate: $('#searchFilingEndDate').val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseAllList",   		//请求后台的URL（*）
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
		$("#searchFlowProgress").val("");
		$("#searchLastHandlerUserName").val("");
		$("#searchLastHandleTimeBegin").val("");
		$("#searchLastHandleTimeEnd").val("");
		$("#searchParties").val("");
		$("#searchAssociate").val("");
		$("#searchRegisterDate").val("");
		$("#searchFilingBeginDate").val("");
		$("#searchFilingEndDate").val("");
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
	return appTable.tableFormatDictValue(g_flowProgressDict, value);
}

function tableFormatAssociate(value, row) {
	if($.utils.isNull(row.associateUserName)) return row.createUserName;
	else return row.createUserName + "、" + row.associateUserName;
}

function formatOperate(value, row, index){
	if(row.flowProgress != '0'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + row.id + ')">' + 
					'查看' + 
				'</button>';
	}else return "";
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
	var url = "/rales/ael/case/case-detail.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-all.html";
	window.location.href = encodeURI(url);
}