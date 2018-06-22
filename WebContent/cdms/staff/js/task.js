var $table = $('#tableList'),
	g_statusDict = [], g_operRights = null,
	g_typeDict = [],g_tenantsId = null;

$(function() {
	//获取状态字典
	g_statusDict = top.app.getDictDataByDictTypeValue('CDMS_CUM_TASK_STATUS');
	g_typeDict = top.app.getDictDataByDictTypeValue('CDMS_CUM_TASK_TYPE');
	top.app.addComboBoxOption($("#searchStatus"), g_statusDict, true);

	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化权限
 */
function initFunc() {
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search, "_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for(var i = 0; i < length; i++) {
		if(g_operRights[i].funcFlag.indexOf("task") != -1) {
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag + "' data-action-url='" + g_operRights[i].funcLink + "'>" +
			"<i class=\"" + g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName +
			"</button>";
		} 
	}
	//添加表格的权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable() {
	//搜索参数
	var searchParams = function(params) {
		var param = {
			access_token: top.app.cookies.getCookiesToken(),
			size: params.limit, //页面大小
			page: params.offset / params.limit, //当前页
            searchName: $("#searchName").val(),
            searchStatus: $("#searchStatus").val()
		};
		return param;
	};
	//初始化列表
	$table.bootstrapTable({
		url: top.app.conf.url.api.cdms.staff.task.getList, //请求后台的URL（*）
		queryParams: searchParams, //传递参数（*）
		onClickRow: function(row, $el) {
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
		$("#searchName").val("");
        $("#searchStatus").val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent() {
	//绑定工具条事件
	$("#taskAdd").click(function() {
		//设置参数
		var params = {};
		params.type = 'add';
		params.statusDict = g_statusDict;
		params.typeDict = g_typeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#taskAdd").data('action-url');
		top.app.layer.editLayer('新增任务信息', ['710px', '250px'], '/cdms/staff/task-edit.html', params, function() {
			//重新加载列表
			$table.bootstrapTable('refresh');
		});
	});
	
	$("#taskDiseaseDiagnosis").click(function () {
		//设置参数
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.tenantsId = g_tenantsId;
		params.statusDict = g_statusDict;
		params.typeDict = g_typeDict;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#taskDiseaseDiagnosis").data('action-url');
		top.app.layer.editLayer('编辑任务信息', ['710px', '360px'], '/cdms/member/member-attr-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	
	//编辑
	$("#taskEdit").click(function() {
		//设置参数
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.tenantsId = g_tenantsId;
		params.statusDict = g_statusDict;
		params.typeDict = g_typeDict;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#taskEdit").data('action-url');
		top.app.layer.editLayer('编辑任务信息', ['710px', '250px'], '/cdms/staff/task-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
	});
	$("#taskSug").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		bindSuggesiion(rows[0]);
    });
	$("#taskSaleList").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		bindSaleList(rows[0]);
    });
}

/**
 * 进入用药建议
 */
function bindSuggesiion(rows){
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	
	var url = "task-suggestion.html?_pid=" + pid + "&memberId=" + rows.MEMBER_ID + "&memberName=" + rows.MEMBER_NAME+ "&taskId=" + rows.ID;
	window.location.href = encodeURI(url);
}

/**
 * 销售清单
 */
function bindSaleList(rows){
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	
	var url = "task-drugSales.html?_pid=" + pid + "&userId=" + rows.USER_ID + "&memberId=" + rows.MEMBER_ID + "&memberName=" + rows.MEMBER_NAME+ "&taskId=" + rows.ID;
	window.location.href = encodeURI(url);
}

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatType(value, row) {
	var i = g_typeDict.length;
	while(i--) {
		if(g_typeDict[i].ID == value) {
			return g_typeDict[i].NAME;
		}
	}
	return "未知";
}

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatStatus(value, row) {
	var i = g_statusDict.length;
	while(i--) {
		if(g_statusDict[i].ID == value) {
			return g_statusDict[i].NAME;
		}
	}
	return "未知";
}