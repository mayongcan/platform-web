var $table = $('#tableList');

$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
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
            lastHandlerUserName: $('#searchLastHandlerUserName').val(),
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/routine/getFinishList",   		//请求后台的URL（*）
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

function formatProgress(value,row,index){
	if($.utils.isEmpty(value)) return "待提交";
	else return value;
}

function formatCaseCode(value,row,index){
	if($.utils.isNull(row.otherFlowParams)) return ""
	else return row.otherFlowParams.code;
}

function formatOperate(value, row, index){
	if(row.isNormalCase == '5'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + row.id + ')">' + 
					'查看' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + row.id + ')">' + 
					'查看' + 
				'</button>' + 
				'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventRegister(' + row.id + ')">' + 
					'案件快捷登记' + 
				'</button>';
	}
}

function btnEventEdit(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.isEdit = true;
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.backUrl = "/rales/ael/routine/routine-finish.html";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/routine/routine-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	window.location.href = encodeURI(url);
}

function btnEventAudit(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	if(row.activityName == '行政检查编辑' || row.activityName == '行政检查草稿' ||  row.activityName == '第二承办人审批'){
		top.app.info.iframe.params.isEdit = true;
	}
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.backUrl = "/rales/ael/routine/routine-finish.html";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/routine/routine-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	window.location.href = encodeURI(url);
}

function btnEventRegister(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/case-new.html?_pid=" + pid + "&backUrl=/rales/ael/routine/routine-finish.html&oldRegisterId=" + row.id + "&registerType=2";
	window.location.href = encodeURI(url);
}