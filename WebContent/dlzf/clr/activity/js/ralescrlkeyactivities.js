var $table = $('#tableList');
var g_resultDict = null, g_operRights = null;

$(function () {
	//初始化字典
	initDict();
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
	g_resultDict = top.app.getDictDataByDictTypeValue('RALES_CRL_KEYACTIVITIES');
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
		if(g_operRights[i].dispPosition == '1'){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
	}
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
			name: $("#searchName").val(),
			certificateNo: $("#searchCertificateNo").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/clr/activity/getList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
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
		$("#searchName").val("");
		$("#searchCertificateNo").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#ralesCrlKeyactivitiesAdd").click(function () {
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.resultDict = g_resultDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#ralesCrlKeyactivitiesAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/rales/clr/activity/ralescrlkeyactivities-edit.html?_pid=" + pid +"&backUrl=/rales/clr/activity/ralescrlkeyactivities.html";
		window.location.href = encodeURI(url);
    });
}

function formatResult(value,row,index){
	var i = g_resultDict.length;
	while (i--) {
		if(g_resultDict[i].ID == value){
			return g_resultDict[i].NAME;
		}
	}
	return "未知";
}

function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2'){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function ralesCrlKeyactivitiesEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.type = 'edit';
	top.app.info.iframe.params.resultDict = g_resultDict;
	top.app.info.iframe.params.rows = row;
	top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + url;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var openUrl = "/rales/clr/activity/ralescrlkeyactivities-edit.html?_pid=" + pid +"&backUrl=/rales/clr/activity/ralescrlkeyactivities.html";
	window.location.href = encodeURI(openUrl);
}

function ralesCrlKeyactivitiesDel(id, url){
	appTable.delData($table, url, id + "");
}

function ralesCrlKeyactivitiesView(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.rows = row;
	params.resultDict = g_resultDict;
	top.app.layer.editLayer('查看重点活动保障', ['710px', '450px'], '/rales/clr/activity/ralescrlkeyactivities-view.html', params, function(){});
}
