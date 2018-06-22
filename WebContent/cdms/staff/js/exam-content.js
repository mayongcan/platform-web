var $table = $('#tableList'), g_questionId = null, g_questionTitle = null, g_contentTypeDict = [];
$(function () {
	g_questionId = $.utils.getUrlParam(window.location.search,"questionId");
	g_questionTitle = decodeURI($.utils.getUrlParam(window.location.search,"questionTitle"));
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 标识:<span style='color:#1ab394;margin-left:5px;'>" + g_questionId + "</span></span>" +
				"<span style='margin-right:20px'>试题名称:<span style='color:#1ab394;margin-left:5px;'>" + g_questionTitle + "</span></span>");
	//获取字典值
	g_contentTypeDict = top.app.getDictDataByDictTypeValue('CDMS_EXM_CONTENT_TYPE');
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
	$("#tableToolbar").empty();
	var htmlTable = "";
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
        url: top.app.conf.url.api.cdms.staff.exam.getContentList,   		//请求后台的URL（*）
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
	//返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "exam.html?_pid=" + pid;
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