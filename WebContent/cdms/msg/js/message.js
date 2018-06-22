var $table = $('#tableList'),
	g_statusDict = [],g_isShopManageDict=[];

$(function() {
	//获取状态字典
	g_statusDict = top.app.getDictDataByDictTypeValue('CDMS_MSG_INFO_STATUS');
	g_isShopManageDict = top.app.getDictDataByDictTypeValue('CDMS_MSG_ISSHOPMANAGE');
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
		if(g_operRights[i].funcFlag.indexOf("memberFamily") != -1) {} else if(g_operRights[i].funcFlag.indexOf("memberCase") != -1) {} else {
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
			sendName: $("#sendName").val(),
			recName: $("#recName").val(),
            searchStatus: $("#searchStatus").val()
		};
		return param;
	};
	//初始化列表
	$table.bootstrapTable({
		url: top.app.conf.url.api.cdms.msg.info.getList, //请求后台的URL（*）
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
		$("#sendName").val("");
		$("#recName").val("");
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
	//添加
	$("#msgInfoAdd").click(function() {
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.statDict = g_statusDict;
		top.app.info.iframe.params.isShopManageDict =g_isShopManageDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#msgInfoAdd").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "message-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
	});
	$("#msgInfoDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.ID;
    	});
		appTable.delData($table, $("#msgInfoDel").data('action-url'), idsList);
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