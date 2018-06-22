var $treeView = $('#treeView'), g_toolBarPanelHeight = 0, g_selectNode = null, g_allTreeData = null;
$(function () {
	//初始化权限
	initFunc();
	//初始化树列表
	initTree();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#treeToolbar").empty();
	var htmlTree = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTree += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag + "' data-action-url='" + operRights[i].funcLink + "'>" + 
						"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
					"</button>";

	}
	//添加树列表的权限
	$("#treeToolbar").append(htmlTree);
	g_toolBarPanelHeight = $('#treeToolbar').outerHeight(true) + 55;
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
				    	access_token: top.app.cookies.getCookiesToken()
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
		"plugins": ["types", "grid"],
		"types": {
			"default": {
				"icon": "fa fa-folder"
			}
		},
		grid: {
			columns: [
					{header: "栏目名称",title:"_DATA_", minWidth: 300,},
					{header: "栏目图片", value: "image", title:"image", headerClass: 'jstree-grid-header-middle', value: function(treeList){
						if($.utils.isNull(treeList.data)) return "";
						if($.utils.isEmpty(treeList.data.image)) return "";
						else {
							var imageArray = treeList.data.image.split(',');
							var html = "";
							for(var i = 0; i < imageArray.length; i++){
								var tmpImage = top.app.conf.url.res.url + imageArray[i]
								html += '<a href="' + tmpImage + '" style="margin-right:10px;" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">图片' + (i + 1) +'</a>'
							}
							return html;
						}
					}},
					{header: "描述", value: "categoryDesc", title:"categoryDesc", headerClass: 'jstree-grid-header-middle'},
					{header: "关键字", value: "keywords", title:"keywords", headerClass: 'jstree-grid-header-middle'},
					{header: "排序", value: "dispOrder", title:"dispOrder", headerClass: 'jstree-grid-header-middle'},
					{header: "创建者", value: "createByName", title:"createBy", headerClass: 'jstree-grid-header-middle'},
					{header: "创建日期", value: "createDate", title:"createDate", headerClass: 'jstree-grid-header-middle', value: function(treeList){
						if($.utils.isNull(treeList.data)) return "";
						return $.date.dateFormat(treeList.data.createDate, "yyyy-MM-dd");
					}},
					{header: "更新者", value: "modifyByName", title:"modifyBy", headerClass: 'jstree-grid-header-middle'},
					{header: "更新时间", value: "modifyDate", title:"modifyDate", headerClass: 'jstree-grid-header-middle', value: function(treeList){
						if($.utils.isNull(treeList.data)) return "";
						return $.date.dateFormat(treeList.data.modifyDate, "yyyy-MM-dd");
					}},
			],
			resizable:true,
			height: getHeight(g_toolBarPanelHeight),
		}
    });
	
	$treeView.bind("loaded.jstree", function (e, data) {
		var inst = data.instance;  
	    var rootNode = inst.get_node(e.target.firstChild.firstChild.lastChild); 
	    //隐藏虚拟节点
	    if(rootNode.id == '-1') $treeView.jstree('hide_node', rootNode);
	    else $treeView.jstree('open_node', rootNode);
	});
	
	$treeView.bind("activate_node.jstree", function (obj, e) {
	    // 获取当前节点
		g_selectNode = e.node;
	});
	$treeView.bind("refresh.jstree", function (e, data) {
		// 更新选中节点
		if(g_selectNode != null){
			g_selectNode = $treeView.jstree('get_node', g_selectNode);
		}
	    //隐藏虚拟节点
		var inst = data.instance;  
	    var rootNode = inst.get_node(e.target.firstChild.firstChild.lastChild); 
	    if(rootNode.id == '-1') $treeView.jstree('hide_node', rootNode);
	});
}

/**
 * 初始化功能按钮
 */
function initFuncBtnEvent(){
	$("#itpCmsCategoryAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#itpCmsCategoryAdd").data('action-url');
		top.app.layer.editLayer('新增文章分类', ['710px', '520px'], '/itp/cms/itp-cms-category-edit.html', params, function(){
   			//重新加载
			$treeView.jstree(true).refresh();
		});
    });
	$("#itpCmsCategoryEdit").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择需要编辑的节点！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#itpCmsCategoryEdit").data('action-url');
		top.app.layer.editLayer('编辑文章分类', ['710px', '520px'], '/itp/cms/itp-cms-category-edit.html', params, function(){
   			//重新加载列表
			$treeView.jstree(true).refresh();
		});
    });
	$("#itpCmsCategoryDel").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择要删除的节点！");
			return;
		}
		var operUrl = top.app.conf.url.apigateway + $("#itpCmsCategoryDel").data('action-url');
		var idsList = g_selectNode.id;
		top.app.message.confirm("确定要删除当前选中的数据？数据删除后将不可恢复！", function(){
			$.ajax({
				url: operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: idsList,
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
			   			//重新加载列表
						$treeView.jstree(true).refresh();
			   			top.app.message.notice("数据删除成功！");
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
}

/**
 * 获取当前选中节点的父节点信息
 * @returns
 */
function getSelNodeParent(){
	if(g_selectNode == null){
		return null;
	}else{
		var nodeId = $treeView.jstree('get_parent', g_selectNode);
		if(nodeId == '#') return null;
		else return $treeView.jstree('get_node', nodeId);
	}
}

/**
 * 获取动态高度
 * @param pannelHeight
 * @param paginationHeight
 * @returns {Number}
 */
function getHeight(pannelHeight, paginationHeight) {
	if(pannelHeight == null || pannelHeight == undefined || !$.isNumeric (pannelHeight)) 
		pannelHeight = 0;
	if(paginationHeight == null || paginationHeight == undefined || !$.isNumeric (paginationHeight)) 
		paginationHeight = 0;
    return $(window).height() - pannelHeight - paginationHeight - 26;
}
