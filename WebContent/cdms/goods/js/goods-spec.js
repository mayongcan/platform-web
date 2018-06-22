var $table = $('#tableList'), g_goodsId = null, g_goodsName = null;
$(function () {
	g_goodsId = $.utils.getUrlParam(window.location.search,"goodsId");
	g_goodsName = decodeURI($.utils.getUrlParam(window.location.search,"goodsName"));
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 商品ID:<span style='color:#1ab394;margin-left:5px;'>" + g_goodsId + "</span></span>" +
				"<span style='margin-right:20px'>商品名称:<span style='color:#1ab394;margin-left:5px;'>" + g_goodsName + "</span></span>");
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
		if(operRights[i].funcFlag.indexOf("goodsSpec") != -1){
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
            goodsId: g_goodsId
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.goods.goods.getGoodsSpecList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'specId',
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
	$("#goodsSpecAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.goodsId = g_goodsId;
		params.operUrl = top.app.conf.url.apigateway + $("#goodsSpecAdd").data('action-url');
		top.app.layer.editLayer('新增商品规格', ['710px', '460px'], '/cdms/goods/goods-spec-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#goodsSpecEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.goodsId = g_goodsId;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#goodsSpecEdit").data('action-url');
		top.app.layer.editLayer('编辑商品规格', ['710px', '460px'], '/cdms/goods/goods-spec-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#goodsSpecDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.specId;
    	});
		appTable.delData($table, $("#goodsSpecDel").data('action-url'), idsList);
    });
	//返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "goods.html?_pid=" + pid;
    });
}

/**
 * 格式数据共享字段
 * @param value
 * @param row
 */
function tableFormatFlag(value, row) {
	if(row.goodsGroupFlag == '0'){
		return '否';
	}else{
		return '是';
	}
}