var $table = $('#tableList'), g_operRights = [];

$(function () {
	//初始化字典
	initView();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始基础视图
 * @returns
 */
function initView(){
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
		if(g_operRights[i].dispPosition == '1' || g_operRights[i].dispPosition == undefined){
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
			isEnable: $("#searchIsEnable").val(),
			isUsable: $("#searchIsUsable").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/point/getPointSourceList",   		//请求后台的URL（*）
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
		$("#searchIsEnable").val("");
		$("#searchIsUsable").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpPointSourceAdd").click(function () {
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpPointSourceAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/point/itp-point-source-edit.html?_pid=" + pid + "&backUrl=/itp/point/itp-point-source.html";
		window.location.href = encodeURI(url);
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2'){
			if(row.isEnable == '1' && g_operRights[i].funcFlag == 'itpPointSouceUnblock') continue;
			if(row.isEnable == '0' && g_operRights[i].funcFlag == 'itpPointSourceBlock') continue;
			if(row.isUsable == '1' && g_operRights[i].funcFlag == 'itpPointSourceUsable') continue;
			if(row.isUsable == '0' && g_operRights[i].funcFlag == 'itpPointSouceUnusable') continue;
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function itpPointSourceEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.type = 'edit';
	top.app.info.iframe.params.rows = row;
	top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + url;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/itp/point/itp-point-source-edit.html?_pid=" + pid + "&backUrl=/itp/point/itp-point-source.html";
	window.location.href = encodeURI(url);
}

function itpPointSourceDel(id, url){
	appTable.delData($table, url, id + "");
}

function itpPointSourceBlock(id, url){
	appTable.postData($table, url, id + '', "确定要禁用当前选中的积分源？", "操作成功！");
}

function itpPointSouceUnblock(id, url){
	appTable.postData($table, url, id + '', "确定要解禁当前选中的积分源？", "操作成功！");
}

function itpPointSouceUnusable(id, url){
	appTable.postData($table, url, id + '', "确定要关闭当前选中的积分源？", "操作成功！");
}

function itpPointSourceUsable(id, url){
	appTable.postData($table, url, id + '', "确定要开通当前选中的积分源？", "操作成功！");
}

function formatIsEnable(value, row, index){
	if(value == '1') return '<font color="green">正常</font>';
	else return '<font color="red">禁用</font>';
}

function formatIsUsable(value, row, index){
	if(value == '1') return '<font color="green">已开通</font>';
	else return '<font color="red">未开通</font>';
}

//格式化图片
function formatImage(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else {
		var tmpImage = top.app.conf.url.res.url + value;
		return '<a href="' + tmpImage + '" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">显示图片</a>'
	}
}

function formatRatio(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else return value + ":1";
}