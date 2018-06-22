var $table = $('#tableList'), g_operRights = null, g_statusDict = [];

$(function () {
	initComboBox();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 添加租户状态搜索框
 */
function initComboBox(){
	g_statusDict = top.app.getDictDataByDictTypeValue('CDMS_CMS_ARTICLE_STATUS');
	top.app.addComboBoxOption($("#searchStatus"), g_statusDict, true);
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
		if(g_operRights[i].funcFlag.indexOf("contentArticleImg") == -1){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
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
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            searchName: $("#searchName").val(),
            searchStatus: $("#searchStatus").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.content.article.getArticleList,   		//请求后台的URL（*）
        queryParams: searchParams,												//传递参数（*）
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        },
        onDblClickRow: function(row, $el){
    		confContentInfo(row);
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
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#contentArticleAdd").click(function () {
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.statDict = g_statusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#contentArticleAdd").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "article-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
    });
	$("#contentArticleEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'edit';
		top.app.info.iframe.params.statDict = g_statusDict;
		top.app.info.iframe.params.rows = rows[0];
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#contentArticleEdit").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "article-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
    });
	$("#contentArticleDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.articleId;
    	});
		appTable.delData($table, $("#contentArticleDel").data('action-url'), idsList);
    });
	$("#contentArticleImage").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		confContentInfo(rows[0]);
    });
}

/**
 * 进入试题内容管理
 */
function confContentInfo(rows){
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "article-image.html?_pid=" + pid + "&articleId=" + rows.articleId + "&title=" + rows.title;
	window.location.href = encodeURI(url);
}

/**
 * 格式化租户状态
 * @param value
 * @param row
 */
function tableFormatStatus(value, row) {
	var i = g_statusDict.length;
	while (i--) {
		if(g_statusDict[i].ID == value){
			return g_statusDict[i].NAME;
		}
	}
	return "未知";
}

function tableFormatIsLive(value, row) {
	if(value == 'Y') return '是';
	else return "否";
}