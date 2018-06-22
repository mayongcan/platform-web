var $table = $('#tableList'),
	g_statusDict = [],
	g_statusTaskDict = [],
	g_statusReBuyDict = [],
	g_tenantsId = null,
	g_isFirstLoad = true,
	g_userId = null,
	g_memberId = null,
	g_taskId = null;

$(function() {
	g_userId = $.utils.getUrlParam(window.location.search, "userId");
	g_memberId = $.utils.getUrlParam(window.location.search, "memberId");
	g_taskId = $.utils.getUrlParam(window.location.search, "taskId");

	//获取状态字典
	g_statusDict = top.app.getDictDataByDictTypeValue('CDMS_CUM_DRUGSALES_SETTLE');
	g_statusTaskDict = top.app.getDictDataByDictTypeValue('CDMS_CUM_DRUGSALES_TASK_STAT');
	g_statusReBuyDict = top.app.getDictDataByDictTypeValue('CDMS_CUM_DRUGSALES_REBUY_STAT');

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
	var g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search, "_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for(var i = 0; i < length; i++) {
		if(g_operRights[i].funcFlag.indexOf("drugSalesList") != -1) {
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag + "' data-action-url='" + g_operRights[i].funcLink + "'>" +
				"<i class=\"" + g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName +
				"</button>";
		}
	}
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarBack'>" +
		"<i class='glyphicon glyphicon-arrow-left' aria-hidden='true'></i> 返回" +
	"</button>"
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
			taskId: g_taskId,
            searchName: $("#searchName").val(),
            searchStatus: $("#searchStatus").val()
		};
		return param;
	};
	//初始化列表
	$table.bootstrapTable({
		url: top.app.conf.url.api.cdms.staff.drugsales.getList, //请求后台的URL（*）
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
	$("#drugSalesListAdd").click(function() {
		//设置参数
		var params = {};
		params.type = 'add';
		params.statusDict = g_statusDict;
		params.statusTaskDict = g_statusTaskDict;
		params.statusReBuyDict = g_statusReBuyDict;
		params.userId = g_userId;
		params.memberId = g_memberId;
		params.taskId = g_taskId;
		params.operUrl = top.app.conf.url.apigateway + $("#drugSalesListAdd").data('action-url');
		top.app.layer.editLayer('新增药品消息清单', ['710px', '500px'], '/cdms/staff/task-drugSales-edit.html', params, function() {
			//重新加载列表
			$table.bootstrapTable('refresh');
		});
	});

	//编辑
	$("#drugSalesListEdit").click(function() {
		//设置参数
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1) {
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.statusDict = g_statusDict;
		params.statusTaskDict = g_statusTaskDict;
		params.statusReBuyDict = g_statusReBuyDict;
		params.userId = g_userId;
		params.memberId = g_memberId;
		params.taskId = g_taskId;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#drugSalesListEdit").data('action-url');
		top.app.layer.editLayer('编辑药品消息清单', ['710px', '500px'], '/cdms/staff/task-drugSales-edit.html', params, function() {
			//重新加载列表
			$table.bootstrapTable('refresh');
		});
	});
	//返回数据类型页面
	$("#toolbarBack").click(function() {
		var pid = $.utils.getUrlParam(window.location.search, "_pid");
		window.location.href = "task.html?_pid=" + pid;
	});
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

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatTaskStatus(value, row) {
	var i = g_statusTaskDict.length;
	while(i--) {
		if(g_statusTaskDict[i].ID == value) {
			return g_statusTaskDict[i].NAME;
		}
	}
	return "未知";
}

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatReBuyStatus(value, row) {
	var i = g_statusReBuyDict.length;
	while(i--) {
		if(g_statusReBuyDict[i].ID == value) {
			return g_statusReBuyDict[i].NAME;
		}
	}
	return "未知";
}