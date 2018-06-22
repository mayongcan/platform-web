var $table = $('#tableList'), $treeView = $('#treeView'), g_allTreeData = null, g_operRights = [];
var g_searchPannelHeight = 0, g_selectNode = null;
var g_statusDict = null;

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
	g_statusDict = top.app.getDictDataByDictTypeValue('ITP_CMS_ARTICLE_STATUS');
	top.app.addComboBoxOption($("#searchStatus"), g_statusDict, true);
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
				    url: top.app.conf.url.apigateway + "/api/itp/cms/getCategoryTreeList",
				    method: 'GET',
				    data: {
				    	access_token: top.app.cookies.getCookiesToken(),
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
            categoryId: (g_selectNode == null ? "" : g_selectNode.id),	
            findChilds: true,
            title: $("#searchTitle").val(),
            status: $("#searchStatus").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/cms/getArticleList",   		//请求后台的URL（*）
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
        $("#searchTitle").val("");
        $("#searchStatus").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpCmsArticleAdd").click(function () {
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.allTreeData = g_allTreeData;
		top.app.info.iframe.params.statusDict = g_statusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpCmsArticleAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/cms/itp-cms-article-edit.html?_pid=" + pid + "&backUrl=/itp/cms/itp-cms-article.html";
		window.location.href = encodeURI(url);
    });
	$("#itpCmsArticleEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行编辑！");
			return;
		}
		if(rows[0].status == '2'){
			top.app.message.notice("已发布的资讯不能进行编辑！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'edit';
		top.app.info.iframe.params.rows = rows[0];
		top.app.info.iframe.params.allTreeData = g_allTreeData;
		top.app.info.iframe.params.statusDict = g_statusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpCmsArticleEdit").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/cms/itp-cms-article-edit.html?_pid=" + pid + "&backUrl=/itp/cms/itp-cms-article.html";
		window.location.href = encodeURI(url);
    });
	$("#itpCmsArticlePublish").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		if(rows[0].status == '2'){
			top.app.message.notice("当前资讯已发布！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		appTable.postData($table, $("#itpCmsArticlePublish").data('action-url'), idsList,
				"确定要发布当前的资讯？", "发布成功！");
    });
	$("#itpCmsArticleUnpublish").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行操作！");
			return;
		}
		if(rows[0].status == '1'){
			top.app.message.notice("当前资讯未发布！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		appTable.postData($table, $("#itpCmsArticleUnpublish").data('action-url'), idsList,
				"确定要取消发布当前的资讯？", "取消发布成功！");
    });
	$("#itpCmsArticleDetail").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.notice("请选择一条数据进行编辑！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.rows = rows[0];
		top.app.info.iframe.params.allTreeData = g_allTreeData;
		top.app.info.iframe.params.statusDict = g_statusDict;
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#itpCmsArticleDetail").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/cms/itp-cms-article-detail.html?_pid=" + pid + "&backUrl=/itp/cms/itp-cms-article.html";
		window.location.href = encodeURI(url);
    });
	$("#itpCmsArticleDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.notice("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    	});
		appTable.delData($table, $("#itpCmsArticleDel").data('action-url'), idsList);
    });
}

function formatStatus(value,row,index){
	if(value == '2') return '<font color="green">已发布</font>';
	else return '<font color="red">未发布</font>';
//	return appTable.tableFormatDictValue(g_statusDict, value);
}

//格式化图片
function formatImage(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else {
		var tmpImage = top.app.conf.url.res.url + value;
		return '<a href="' + tmpImage + '" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">显示图片</a>'
	}
}
