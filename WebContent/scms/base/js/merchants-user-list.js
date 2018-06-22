var $table = $('#tableList'), g_operRights = [], g_backUrl = "", g_sexDict = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	//初始化字典
	initDict();
	//初始化搜索面板
	initSearchPanel();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	//搜索面板高度
	appTable.searchPannelHeight = $('#searchPannel').outerHeight(true);
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
		//显示在列表上方的权限菜单
		if(g_operRights[i].dispPosition == '1' && g_operRights[i].funcFlag.indexOf("scmsUser") != -1){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
	}
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarBack'>" + 
					"<i class='glyphicon glyphicon-arrow-left' aria-hidden='true'></i> 返回" +
				 "</button>"
	//添加默认权限
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
			merchantsId: g_params.row.id,
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/user/getMerchantsUserList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'userId',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#scmsUserBind").click(function () {//设置参数
		var params = {};
		params.merchantsId = g_params.row.id;
		params.operUrl = top.app.conf.url.apigateway + $("#scmsUserBind").data('action-url');
		top.app.layer.editLayer('绑定用户', ['710px', '320px'], '/scms/base/merchants-user-list-bind.html', params, function(retParams){
			$table.bootstrapTable('refresh');
		});
    });
	$("#scmsUserUnBind").click(function () {
		var dataRows = appTable.getSelectionRows($table);
		if(dataRows.length == 0 || dataRows.length > 1){
   			top.app.message.notice("请选择不少于一条数据进行操作！");
			return;
		}
		var idList = "";
		for(var i = 0; i < dataRows.length; i++){
			idList += dataRows[i].merchantsUserId + ",";
		}
		if(idList != '') idList = idList.substring(0, idList.length - 1);
		appTable.postData($table, $("#scmsUserUnBind").data('action-url'), idList,
				"确定要解绑当前选中的用户？", "用户解绑成功！");
    });
	$("#scmsUserSetAdmin").click(function () {
		var dataRows = appTable.getSelectionRows($table);
		if(dataRows.length == 0 || dataRows.length > 1){
   			top.app.message.notice("请选择不少于一条数据进行操作！");
			return;
		}
		var idList = "";
		for(var i = 0; i < dataRows.length; i++){
			idList += dataRows[i].merchantsUserId + ",";
		}
		if(idList != '') idList = idList.substring(0, idList.length - 1);
		appTable.postData($table, $("#scmsUserSetAdmin").data('action-url'), idList,
				"确定要设置当前选中的用户为店铺管理员？", "设置成功！");
    });
	$("#scmsUserCancleAdmin").click(function () {
		var dataRows = appTable.getSelectionRows($table);
		if(dataRows.length == 0 || dataRows.length > 1){
   			top.app.message.notice("请选择不少于一条数据进行操作！");
			return;
		}
		var idList = "";
		for(var i = 0; i < dataRows.length; i++){
			idList += dataRows[i].merchantsUserId + ",";
		}
		if(idList != '') idList = idList.substring(0, idList.length - 1);
		appTable.postData($table, $("#scmsUserCancleAdmin").data('action-url'), idList,
				"确定要取消店铺管理员？", "设置成功！");
    });
	// 返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2' && g_operRights[i].funcFlag.indexOf("scmsUser") != -1){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.userId + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function tableFormatIsAdmin(value, row) {
	if(value == '1') return "<span style='color:red'>是</span>";
	else return "否";
}

function tableFormatIsBlock(value, row) {
	if(value == '1') return "<span style='color:red'>是</span>";
	else return "否";
}

function tableFormatSex(value, row) {
	return appTable.tableFormatDictValue(g_sexDict, value);
}
