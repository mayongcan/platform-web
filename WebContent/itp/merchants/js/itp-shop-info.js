var $table = $('#tableList'), g_operRights = [], g_backUrl = "";

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
		if(g_operRights[i].dispPosition == '1' && g_operRights[i].funcFlag.indexOf("itpShopInfo") != -1){
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
			shopName: $("#searchShopName").val(),
			shopPhone: $("#searchShopPhone").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/merchants/getShopInfoList",   		//请求后台的URL（*）
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
		$("#searchShopName").val("");
		$("#searchShopPhone").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpShopInfoAdd").click(function () {
		//设置参数
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.parent = g_params;
		top.app.info.iframe.params.merchantsId = g_params.row.id;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpShopInfoAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/merchants/itp-shop-info-edit.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-shop-info.html";
		window.location.href = encodeURI(url);
    });
	// 返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = "itp-merchants-info.html?_pid=" + pid;
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2' && g_operRights[i].funcFlag.indexOf("itpShopInfo") != -1){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function itpShopInfoEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.type = 'edit';
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.parent = g_params;
	top.app.info.iframe.params.merchantsId = g_params.row.id;
	top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + url;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/itp/merchants/itp-shop-info-edit.html?_pid=" + pid + "&backUrl=/itp/merchants/itp-shop-info.html";
	window.location.href = encodeURI(url);
}

function itpShopInfoDel(id, url){
	appTable.delData($table, url, id + "");
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

//格式化图片
function formatScanCode(value, row, index){
	var tmpImage = top.app.conf.url.res.url + value;
	return '<a href="#" onclick="showScanCode(\'' + row.id + '\')" title="">显示</a>'
}

function showScanCode(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//生成二维码字符串格式：merchantsId + shopId
	var code = {};
	code.merchantsId = row.merchantsId;
	code.shopId = row.id;
	//设置参数
	var params = {};
	params.code = JSON.stringify(code);
	top.app.layer.editLayer('分店二维码', ['710px', '500px'], '/itp/merchants/shop-qr-code.html', params, function(){});
}
