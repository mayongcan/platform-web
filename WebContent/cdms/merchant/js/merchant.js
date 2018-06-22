var $table = $('#tableList'), 
	g_typeDict = [], g_statDict = [], g_signDict = [], g_sexDict = [], g_credentialsTypeDict = [];

$(function () {
	//重置全局参数
	top.app.info.iframe = {};
	//初始化权限
	initFunc();
	//获取字典类型的字典数据
	initComboBox();
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
	//添加表格的权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 添加字典类型搜索框
 */
function initComboBox(){
	g_typeDict = top.app.getDictDataByDictTypeValue('CDMS_PNM_MERCHANT_TYPE');
	g_statDict = top.app.getDictDataByDictTypeValue('SYS_AUDIT_STATUS');
	g_signDict = top.app.getDictDataByDictTypeValue('CDMS_PNM_MERCHANT_SIGNINTENTION');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	g_credentialsTypeDict = top.app.getDictDataByDictTypeValue('SYS_CREDENTIALS_TYPE');

	top.app.addComboBoxOption($("#searchType"), g_typeDict, true);
	top.app.addComboBoxOption($("#searchStatus"), g_statDict, true);
}

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            searchName: $("#searchName").val(),
            searchType: $("#searchType").val(),
            searchStatus: $("#searchStatus").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.merchant.merchant.getMerchantList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        },
        onDblClickRow: function(row, $el){
    		confInfo(row);
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
        $("#searchType").val("");
        $("#searchStatus").val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#merchantAdd").click(function () {
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.typeDict = g_typeDict;
		top.app.info.iframe.params.statDict = g_statDict;
		top.app.info.iframe.params.signDict = g_signDict;
		top.app.info.iframe.params.sexDict = g_sexDict;
		top.app.info.iframe.params.credentialsTypeDict = g_credentialsTypeDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#merchantAdd").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "merchant-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
    });
	$("#merchantEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'edit';
		top.app.info.iframe.params.typeDict = g_typeDict;
		top.app.info.iframe.params.statDict = g_statDict;
		top.app.info.iframe.params.signDict = g_signDict;
		top.app.info.iframe.params.sexDict = g_sexDict;
		top.app.info.iframe.params.credentialsTypeDict = g_credentialsTypeDict;
		top.app.info.iframe.params.rows = rows[0];
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#merchantEdit").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "merchant-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
    });
	$("#merchantDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.prtnId;
    	});
		appTable.delData($table, $("#merchantDel").data('action-url'), idsList);
    });
	$("#merchantView").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		confInfo(rows[0]);
    });
}

/**
 * 进入商品详情
 */
function confInfo(rows){
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.typeDict = g_typeDict;
	top.app.info.iframe.params.statDict = g_statDict;
	top.app.info.iframe.params.signDict = g_signDict;
	top.app.info.iframe.params.sexDict = g_sexDict;
	top.app.info.iframe.params.credentialsTypeDict = g_credentialsTypeDict;
	top.app.info.iframe.params.rows = rows;
	
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "merchant-info.html?_pid=" + pid;
	window.location.href = encodeURI(url);
}

/**
 * 格式化字典类型
 * @param value
 * @param row
 */
function tableFormatType(value, row) {
	var i = g_typeDict.length;
	while (i--) {
		if(g_typeDict[i].ID == value){
			return g_typeDict[i].NAME;
		}
	}
	return "未知";
}
function tableFormatStatus(value, row) {
	var i = g_statDict.length;
	while (i--) {
		if(g_statDict[i].ID == value){
			return g_statDict[i].NAME;
		}
	}
	return "未知";
}