var $table = $('#tableList'), $treeView = $('#treeView'), g_allTreeData = null, g_operRights = [];
var g_searchPannelHeight = 0, g_selectNode = null;
var g_goodsYearDict = null;
var g_goodsSeasonDict = null;
var g_buyStatusDict = null;
var g_shelfStatusDict = null;
var g_useStatusDict = null;

$(function () {
	//初始化字典
	initView();
	//初始化权限
	initFunc();
	//初始化树列表
	initTree();
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
	g_searchPannelHeight = $('#searchPannel').outerHeight(true) + 20;
	g_goodsYearDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_YEAR');
	g_goodsSeasonDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_SEASON');
	g_buyStatusDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_BUY_STATUS');
	g_shelfStatusDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_SHELF_STATUS');
	g_useStatusDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_USE_STATUS');
	top.app.addComboBoxOption($("#searchYear"), g_goodsYearDict, true);
	top.app.addComboBoxOption($("#searchSeason"), g_goodsSeasonDict, true);
	top.app.addComboBoxOption($("#searchBuyStatus"), g_buyStatusDict, true);
	top.app.addComboBoxOption($("#searchShelfStatus"), g_shelfStatusDict, true);
	top.app.addComboBoxOption($("#searchUseStatus"), g_useStatusDict, true);
	//获取分店下拉列表
	itp.getVenderPullDown($("#searchVender"), itp.getUserMerchantsId(), true);
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
 * 初始化树列表
 */
function initTree(){
	$treeView.jstree({
		'core': {
			"check_callback": true,
			'data': function (objNode, cb) {
				$.ajax({
				    url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsCategoryTreeList",
				    method: 'GET',
				    data: {
				    	access_token: top.app.cookies.getCookiesToken(),
			            merchantsId: itp.getUserMerchantsId(),
				    },success: function(data){
				    	if(top.app.message.code.success == data.RetCode){
				    		g_allTreeData = data.RetData;
							cb.call(this, data.RetData);
				    	}else{
				    		top.app.message.error(data.RetMsg);
				    	}
					}
				});
			}
		},
		"plugins": ["types"],
		"types": {
			"default": {
				"icon": "fa fa-folder"
			}
		}
    });
	
	$treeView.bind("activate_node.jstree", function (obj, e) {
	    // 获取当前节点
		g_selectNode = e.node;
	    //加载列表
		$table.bootstrapTable('refresh');
	});
	$treeView.bind("refresh.jstree", function (e, data) {
	    // 更新选中节点
		if(g_selectNode != null){
			g_selectNode = $treeView.jstree('get_node', g_selectNode);
		}
		if(e.target.firstChild.firstChild == null) return;
		//展开根节点
		var inst = data.instance;  
	    var rootNode = inst.get_node(e.target.firstChild.firstChild.lastChild); 
	});
	//展开根节点
	$treeView.bind("loaded.jstree", function (e, data) {
		var inst = data.instance;  
	    var rootNode = inst.get_node(e.target.firstChild.firstChild.lastChild); 
	});
	
	$treeView.css("height", appTable.getTableHeight(g_searchPannelHeight, 75));
    $(window).resize(function () {
    	$treeView.css("height", appTable.getTableHeight(g_searchPannelHeight, 75));
    });
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
            merchantsId: itp.getUserMerchantsId(),
            categoryId: (g_selectNode == null ? "" : g_selectNode.id),	
            findChilds: true,
            goodsName: $("#searchGoodsName").val(),
            goodsSerialNum: $("#searchGoodsSerialNum").val(),
			venderId: $("#searchVender").val(),
			goodsYear: $("#searchYear").val(),
			goodsSeason: $("#searchSeason").val(),
			buyStatus: $("#searchBuyStatus").val(),
			shelfStatus: $("#searchShelfStatus").val(),
			useStatus: $("#searchUseStatus").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsInfoList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	appTable.searchPannelHeight = g_searchPannelHeight;
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
        $("#searchGoodsName").val("");
        $("#searchGoodsSerialNum").val("");
		$("#searchVender").val("");
		$("#searchYear").val("");
		$("#searchSeason").val("");
		$("#searchBuyStatus").val("");
		$("#searchShelfStatus").val("");
		$("#searchUseStatus").val("");
		$treeView.jstree("deselect_all");
		g_selectNode = null;
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpGoodsInfoAdd").click(function () {
		if($.utils.isEmpty(itp.getUserMerchantsId())){
			top.app.message.notice("只有商家才能创建商品！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.allTreeData = g_allTreeData;
		top.app.info.iframe.params.goodsYearDict = g_goodsYearDict;
		top.app.info.iframe.params.goodsSeasonDict = g_goodsSeasonDict;
		top.app.info.iframe.params.buyStatusDict = g_buyStatusDict;
		top.app.info.iframe.params.shelfStatusDict = g_shelfStatusDict;
		top.app.info.iframe.params.useStatusDict = g_useStatusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpGoodsInfoAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/goods/itp-goods-info-new.html?_pid=" + pid + "&backUrl=/itp/goods/itp-goods-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpGoodsInfoEdit").click(function () {
		if($.utils.isEmpty(itp.getUserMerchantsId())){
			top.app.message.notice("只有商家才能编辑商品！");
			return;
		}
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'edit';
		top.app.info.iframe.params.row = rows[0];
		top.app.info.iframe.params.allTreeData = g_allTreeData;
		top.app.info.iframe.params.goodsYearDict = g_goodsYearDict;
		top.app.info.iframe.params.goodsSeasonDict = g_goodsSeasonDict;
		top.app.info.iframe.params.buyStatusDict = g_buyStatusDict;
		top.app.info.iframe.params.shelfStatusDict = g_shelfStatusDict;
		top.app.info.iframe.params.useStatusDict = g_useStatusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpGoodsInfoEdit").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/goods/itp-goods-info-edit.html?_pid=" + pid + "&backUrl=/itp/goods/itp-goods-info.html";
		window.location.href = encodeURI(url);
    });
	$("#itpGoodsInfoDel").click(function () {
		if($.utils.isEmpty(itp.getUserMerchantsId())){
			top.app.message.notice("只有商家能删除商品！");
			return;
		}
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		appTable.delData($table, $("#itpGoodsInfoDel").data('action-url'), idsList);
    });
	$("#itpGoodsInfoDetail").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行查看！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		top.app.info.iframe.params.allTreeData = g_allTreeData;
		top.app.info.iframe.params.goodsYearDict = g_goodsYearDict;
		top.app.info.iframe.params.goodsSeasonDict = g_goodsSeasonDict;
		top.app.info.iframe.params.buyStatusDict = g_buyStatusDict;
		top.app.info.iframe.params.shelfStatusDict = g_shelfStatusDict;
		top.app.info.iframe.params.useStatusDict = g_useStatusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpGoodsInfoDetail").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/goods/itp-goods-info-detail.html?_pid=" + pid + "&backUrl=/itp/goods/itp-goods-info.html";
		window.location.href = encodeURI(url);
    });
}

function formatGoodsSeason(value,row,index){
	return appTable.tableFormatDictValue(g_goodsSeasonDict, value);
}
function formatBuyStatus(value,row,index){
	return appTable.tableFormatDictValue(g_buyStatusDict, value);
}
function formatShelfStatus(value,row,index){
	return appTable.tableFormatDictValue(g_shelfStatusDict, value);
}
function formatUseStatus(value,row,index){
	return appTable.tableFormatDictValue(g_useStatusDict, value);
}

