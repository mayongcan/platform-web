var $table = $('#tableList'), g_flowProgressDict = [], g_caseSourceDict = [];

$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	g_flowProgressDict = top.app.getDictDataByDictTypeValue('AEL_CASE_FLOW_PROCEDURE');
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
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
//	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='caseDetail' data-action-url=''>" + 
//					"<i class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></i> 查询" + 
//				 "</button>";
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
            caseParties: $('#searchCaseParties').val(),
            flowProgress: $('#searchFlowProgress').val(),
            lastHandlerUserName: $('#searchLastHandlerUserName').val(),
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseTodoList",   		//请求后台的URL（*）
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
		$("#searchCaseParties").val("");
		$("#searchFlowProgress").val("");
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
//	$("#caseDetail").click(function () {
//		var rows = appTable.getSelectionRows($table);
//		if(rows.length == 0 || rows.length > 1){
//			top.app.message.alert("请选择一条数据进行查询！");
//			return;
//		}
//		//设置传送对象
//		top.app.info.iframe.params = {};
//		top.app.info.iframe.params.row = rows[0];
//		top.app.info.iframe.params.isFinish = false;
//		top.app.info.iframe.params.flowProgressDict = g_flowProgressDict;
//		top.app.info.iframe.params.caseSourceDict = g_caseSourceDict;
//		var pid = $.utils.getUrlParam(window.location.search,"_pid");
//		var url = "/rales/ael/case/case-detail.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-todo.html";
//		window.location.href = encodeURI(url);
////		window.location.replace(encodeURI(url));
//    });
}

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}

function tableFormatFlowProgress(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return appTable.tableFormatDictValue(g_flowProgressDict, value);
	else{
		if(row.subFlowProgress == '10') return "证据保全措施审批流程";
		else if(row.subFlowProgress == '11') return "听证审批流程";
		else if(row.subFlowProgress == '12') return "听证报告书审批流程";
	}
}

function tableFormatHandleUserName(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return row.lastHandleUserName;
	else{
		return row.otherFlowParams.lastHandleUserName;
	}
}

function tableFormatHandleTime(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return $.date.dateFormat(row.lastHandleTime, "yyyy-MM-dd");
	else{
		return $.date.dateFormat(row.otherFlowParams.lastHandleTime, "yyyy-MM-dd");
	}
}

function formatOperate(value, row, index){
	if(row.flowProgress == '0'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + row.id + ')">' + 
					'编辑' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + row.id + ')">' + 
					'查看' + 
				'</button>';
	}
}

function btnEventDetail(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.isFinish = false;
	top.app.info.iframe.params.flowProgressDict = g_flowProgressDict;
	top.app.info.iframe.params.caseSourceDict = g_caseSourceDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/case-detail.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-todo.html";
	window.location.href = encodeURI(url);
}

function btnEventEdit(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.flowProgressDict = g_flowProgressDict;
	top.app.info.iframe.params.caseSourceDict = g_caseSourceDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/case-edit.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-todo.html";
	window.location.href = encodeURI(url);
}