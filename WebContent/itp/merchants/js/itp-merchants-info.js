var $table = $('#tableList'), g_operRights = [];

$(function () {
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
		if(g_operRights[i].dispPosition == '1' && g_operRights[i].funcFlag.indexOf("itpMerchantsInfo") != -1){
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
			status: $("#searchStatus").val(),
			merchantsName: $("#searchMerchantsName").val(),
			phone: $("#searchPhone").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/merchants/getMerchantsInfoList",   		//请求后台的URL（*）
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
		$("#searchStatus").val("");
		$("#searchMerchantsName").val("");
		$("#searchPhone").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpMerchantsInfoAdd").click(function () {
		//设置参数
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpMerchantsInfoAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/itp-merchants-info-edit.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpMerchantsInfoUser").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/merchants-user-list.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpMerchantsInfoShop").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/itp-shop-info.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpMerchantsInfoBank").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/itp-merchants-bank.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpMerchantsInfoBind").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/merchants-point-source-bind.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpMerchantsInfoBuis").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/itp-merchants-busi.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpMerchantsInfoLog").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/merchants-modify-log.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
		window.location.href = encodeURI(url);
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	if($.utils.isEmpty(row.status)) row.status = '1';
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2' && g_operRights[i].funcFlag.indexOf("itpMerchantsInfo") != -1){
			if(row.status == '1' && g_operRights[i].funcFlag == 'itpMerchantsInfoUnblock') continue;
			if(row.status == '2' && g_operRights[i].funcFlag == 'itpMerchantsInfoBlock') continue;
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function itpMerchantsInfoEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.type = 'edit';
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + url;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/itp/merchants/itp-merchants-info-edit.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-merchants-info.html";
	window.location.href = encodeURI(url);
}

function itpMerchantsInfoBlock(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.rows = row;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('设置禁用', ['710px', '300px'], '/itp/merchants/itp-merchants-status.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function itpMerchantsInfoUnblock(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.rows = row;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('设置解禁', ['710px', '300px'], '/itp/merchants/itp-merchants-status.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function itpMerchantsInfoDel(id, url){
	appTable.delData($table, url, id + "");
}

function formatStatus(value, row, index){
	if(value == '1') return '<font color="green">正常</font>';
	else return '<font color="red">禁用</font>';
}

function formatType(value, row, index){
	if(value == '00') return '公司商户';
	else return '个体商户';
}

//格式化图片
function formatLogo(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else {
		var tmpImage = top.app.conf.url.res.url + value;
		return '<a href="' + tmpImage + '" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">显示图片</a>'
	}
}

//格式化图片
function formatImage(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else {
		var imageArray = value.split(',');
		var html = "";
		for(var i = 0; i < imageArray.length; i++){
			if($.utils.isEmpty(imageArray[i])) continue;
			var tmpImage = top.app.conf.url.res.url + imageArray[i]
			html += '<a href="' + tmpImage + '" style="margin-right:10px;" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">图片' + (i + 1) +'</a>'
		}
		return html;
	}
}

