var $table = $('#tableList'), g_operRights = null,g_AwardDict = [];

$(function () {
	g_AwardDict = top.app.getDictDataByDictTypeValue('CDMS_EXM_QUESTION_AWARD');
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
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].funcFlag.indexOf("examQuestion") != -1){
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
            searchName: $("#searchName").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.exam.question.getQuestionList,   		//请求后台的URL（*）
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
	$("#examQuestionAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.awardDict = g_AwardDict;
		params.operRights = g_operRights;
		params.operUrl = top.app.conf.url.apigateway + $("#examQuestionAdd").data('action-url');
		top.app.layer.editLayer('新增试题', ['710px', '420px'], '/cdms/exam/question-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#examQuestionEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.awardDict = g_AwardDict;
		params.operRights = g_operRights;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#examQuestionEdit").data('action-url');
		top.app.layer.editLayer('编辑试题', ['710px', '420px'], '/cdms/exam/question-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#examQuestionDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.questionId;
    	});
		appTable.delData($table, $("#examQuestionDel").data('action-url'), idsList);
    });
	$("#examQuestionContent").click(function () {
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
	var url = "question-content.html?_pid=" + pid + "&questionId=" + rows.questionId + "&title=" + rows.title;
	window.location.href = encodeURI(url);
}
/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormateAward(value, row) {
	var i = g_AwardDict.length;
	while(i--) {
		if(g_AwardDict[i].ID == value) {
			return g_AwardDict[i].NAME;
		}
	}
	return "未知";
}