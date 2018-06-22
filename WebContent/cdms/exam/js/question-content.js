var $table = $('#tableList'), g_questionId = null, g_questionTitle = null, g_contentTypeDict = [], g_contentJudgeDict = [];
$(function () {
	g_questionId = $.utils.getUrlParam(window.location.search,"questionId");
	g_questionTitle = decodeURI($.utils.getUrlParam(window.location.search,"title"));
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 试题ID:<span style='color:#1ab394;margin-left:5px;'>" + g_questionId + "</span></span>" +
				"<span style='margin-right:20px'>试题名称:<span style='color:#1ab394;margin-left:5px;'>" + g_questionTitle + "</span></span>");
	//获取字典值
	g_contentTypeDict = top.app.getDictDataByDictTypeValue('CDMS_EXM_CONTENT_TYPE');
	g_contentJudgeDict = top.app.getDictDataByDictTypeValue('CDMS_EXM_CONTENT_JUDGEANSWER');
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
function initFunc(){
	var operRights = top.app.info.iframe.operRights;
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		if(operRights[i].funcFlag.indexOf("examContent") != -1){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
							"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
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
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            questionId: g_questionId
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.exam.question.getContentList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//搜索面板高度
	appTable.searchPannelHeight = $('#titleInfo').outerHeight(true) - 10;
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#examContentAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.questionId = g_questionId;
		params.contentTypeDict = g_contentTypeDict;
		params.contentJudgeDict = g_contentJudgeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#examContentAdd").data('action-url');
		top.app.layer.editLayer('新增试题内容', ['710px', '550px'], '/cdms/exam/question-content-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#examContentEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.questionId = g_questionId;
		params.contentTypeDict = g_contentTypeDict;
		params.contentJudgeDict = g_contentJudgeDict;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#examContentEdit").data('action-url');
		top.app.layer.editLayer('编辑试题内容', ['710px', '550px'], '/cdms/exam/question-content-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#examContentDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.contentId;
    	});
		appTable.delData($table, $("#examContentDel").data('action-url'), idsList);
    });
	//返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "question.html?_pid=" + pid;
    });
}

/**
 * 格式化
 * @param value
 * @param row
 */
function tableFormatType(value, row) {
	var i = g_contentTypeDict.length;
	while (i--) {
		if(g_contentTypeDict[i].ID == value){
			return g_contentTypeDict[i].NAME;
		}
	}
	return "未知";
}

/**
 * 格式化
 * @param value
 * @param row
 */
function tableFormatJudge(value, row) {
	var i = g_contentJudgeDict.length;
	while (i--) {
		if(g_contentJudgeDict[i].ID == value){
			return g_contentJudgeDict[i].NAME;
		}
	}
	return "未知";
}