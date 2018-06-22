var $table = $('#tableList'), g_goodsTypeDict = [], g_goodsStatDict = [], g_goodsIsNews = [], g_operRights = null;

$(function () {
	//初始化权限
	initFunc();
	//获取字典类型的字典数据
	initComboBox();
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
		if(g_operRights[i].funcFlag.indexOf("goodsSpec") != -1){
			//商品规格权限
		}else if(g_operRights[i].funcFlag.indexOf("goodsPart") != -1){
			//商品配件权限
		}else{
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
				"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
			 "</button>";
		}
	}
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarView'>" + 
					"<i class='glyphicon glyphicon-modal-window' aria-hidden='true'></i> 查看详情" +
				 "</button>" + 
				 "<button type='button' class='btn btn-outline btn-default' id='toolbarSpec'>" + 
					"<i class='glyphicon glyphicon-cog' aria-hidden='true'></i> 商品规格管理" +
				 "</button>" + 
				 "<button type='button' class='btn btn-outline btn-default' id='toolbarPart'>" + 
					"<i class='glyphicon glyphicon-cog' aria-hidden='true'></i> 商品配件管理" +
				 "</button>";
	//添加表格的权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 添加字典类型搜索框
 */
function initComboBox(){
	g_goodsTypeDict = top.app.getDictDataByDictTypeValue('CDMS_GDM_GOODS_TYPE');
	top.app.addComboBoxOption($("#searchType"), g_goodsTypeDict, true);
	
	g_goodsStatDict = top.app.getDictDataByDictTypeValue('CMDS_GDM_GOODS_STAT');
	top.app.addComboBoxOption($("#searchStatus"), g_goodsStatDict, true);
	
	g_goodsIsNews = top.app.getDictDataByDictTypeValue('CDMS_GDM_GOODS_ISNEWS');
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
            searchType: $("#searchType").val(),
            searchStatus: $("#searchStatus").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.goods.goods.getGoodsList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'goodsId',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        },
        onDblClickRow: function(row, $el){
        	confGoodsInfo(row);
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
        $("#searchType").val("");
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
	$("#goodsAdd").click(function () {
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.typeDict = g_goodsTypeDict;
		top.app.info.iframe.params.statDict = g_goodsStatDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#goodsAdd").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "goods-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
    });
	$("#goodsEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'edit';
		top.app.info.iframe.params.typeDict = g_goodsTypeDict;
		top.app.info.iframe.params.statDict = g_goodsStatDict;
		top.app.info.iframe.params.rows = rows[0];
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#goodsEdit").data('action-url');
		
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "goods-edit.html?_pid=" + pid;
		window.location.href = encodeURI(url);
    });
	$("#goodsDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.goodsId;
    	});
		appTable.delData($table, $("#goodsDel").data('action-url'), idsList);
    });
	$("#goodsOnShefl").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要上架的商品！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.goodsId;
    	});
		var operUrl = top.app.conf.url.apigateway + $("#goodsOnShefl").data('action-url');
		top.app.message.confirm("确定要上架当前选中的商品？", function(){
			$.ajax({
				url: operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: idsList,
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
						$table.bootstrapTable('refresh');
			   			top.app.message.alert("商品上架成功！");
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
	$("#goodsOffShelf").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要下架的商品！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.goodsId;
    	});
		var operUrl = top.app.conf.url.apigateway + $("#goodsOffShelf").data('action-url');
		top.app.message.confirm("确定要下架当前选中的商品？", function(){
			$.ajax({
				url: operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: idsList,
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
						$table.bootstrapTable('refresh');
			   			top.app.message.alert("商品下架成功！");
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
	$("#toolbarView").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		confGoodsInfo(rows[0]);
    });
	$("#toolbarSpec").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		confGoodsSpec(rows[0]);
    });
	$("#toolbarPart").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		confGoodsPart(rows[0]);
    });
}

/**
 * 进入商品详情
 */
function confGoodsInfo(rows){
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.typeDict = g_goodsTypeDict;
	top.app.info.iframe.params.statDict = g_goodsStatDict;
	top.app.info.iframe.params.rows = rows;
	
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "goods-info.html?_pid=" + pid;
	window.location.href = encodeURI(url);
}

/**
 * 进入商品规格管理
 */
function confGoodsSpec(rows){
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "goods-spec.html?_pid=" + pid + "&goodsId=" + rows.goodsId + "&goodsName=" + rows.goodsName;
	window.location.href = encodeURI(url);
}

/**
 * 进入商品配件管理
 */
function confGoodsPart(rows){
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "goods-part.html?_pid=" + pid + "&goodsId=" + rows.goodsId + "&goodsName=" + rows.goodsName;
	window.location.href = encodeURI(url);
}

/**
 * 格式化字典类型
 * @param value
 * @param row
 */
function tableFormatType(value, row) {
	var i = g_goodsTypeDict.length;
	while (i--) {
		if(g_goodsTypeDict[i].ID == value){
			return g_goodsTypeDict[i].NAME;
		}
	}
	return "未知";
}
function tableFormatStatus(value, row) {
	var i = g_goodsStatDict.length;
	while (i--) {
		if(g_goodsStatDict[i].ID == value){
			return g_goodsStatDict[i].NAME;
		}
	}
	return "未知";
}

function tableFormatIsNews(value, row) {
	var i = g_goodsIsNews.length;
	while (i--) {
		if(g_goodsIsNews[i].ID == value){
			return g_goodsIsNews[i].NAME;
		}
	}
	return "未知";
}