var $table = $('#tableList'), g_typeDict = [], g_sourceDict = [], g_sexDict = [];

$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	g_typeDict = top.app.getDictDataByDictTypeValue('RALES_CRL_TYPE');
	g_sourceDict = top.app.getDictDataByDictTypeValue('RALES_CRL_SOURCE');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#searchComplaintType"), g_typeDict, true);
	//获取权限菜单
//	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();

	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '180px'
	});
	//待办列表刷新
	$("li a.index-menu-item:contains('待办')",parent.document).click(function(){
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
	 });
	$("div a.index-tab-menu-item:contains('待办')",parent.document).click(function(){
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
	 });
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
            isNormalCase: '1',
            complaintUser: $('#searchComplaintUser').val(),
            complaintType: $('#searchComplaintType').val(),
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/getTodoList",   		//请求后台的URL（*）
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
		$("#searchComplaintType").val("");
		$("#searchComplaintUser").val("");
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

function tableFormatType(value, row) {
	return appTable.tableFormatDictValue(g_typeDict, value);
}

function formatOperate(value, row, index){
	if(row.activityId == 'backToEditTask'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + row.id + ')">' + 
					'重新编辑' + 
				'</button>' +
				'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventSubmit(' + row.id + ')">' + 
					'提交审批' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventHandle(' + row.id + ')">' + 
					'办理' + 
				'</button>';
	}
}

function btnEventEdit(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.typeDict = g_typeDict;
	top.app.info.iframe.params.sourceDict = g_sourceDict;
	top.app.info.iframe.params.sexDict = g_sexDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/clr/complaint/complaint-edit.html?_pid=" + pid + "&backUrl=/rales/clr/complaint/complaint-todo-list.html";
	window.location.href = encodeURI(url);
}

function btnEventSubmit(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	top.app.message.confirm("确定要提交审批？", function(){
		top.app.message.loading();
		var submitData = {};
		submitData["taskId"] = row.taskId;
		submitData["processInstanceId"] = row.processInstanceId;
		submitData["processDefinitionId"] = row.processDefinitionId;
		submitData["complaintId"] = row.id;
		//提交审批
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/complaintFlowNext?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data:JSON.stringify(submitData),
			contentType: "application/json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
		   			top.app.message.notice("数据提交成功！");
		   			$table.bootstrapTable('refresh');
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
	});
}

function btnEventHandle(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.typeDict = g_typeDict;
	top.app.info.iframe.params.sourceDict = g_sourceDict;
	top.app.info.iframe.params.sexDict = g_sexDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/clr/complaint/complaint-handle.html?_pid=" + pid + "&backUrl=/rales/clr/complaint/complaint-todo-list.html";
	window.location.href = encodeURI(url);
}