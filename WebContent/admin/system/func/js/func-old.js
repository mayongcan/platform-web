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
				    url: top.app.conf.url.api.system.func.getFuncTree,
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
		"plugins": ["types"],
		"types": {
			"default": {
				"icon": "fa fa-folder"
			}
		}
    });
	
	$treeView.bind("loaded.jstree", function (e, data) {
		var inst = data.instance;  
	    var rootNode = inst.get_node(e.target.firstChild.firstChild.lastChild); 
	    $treeView.jstree('open_node', rootNode);
	});
	
	$treeView.bind("activate_node.jstree", function (obj, e) {
	    // 获取当前节点
		g_selectNode = e.node;
		showInfo();
	});
	$treeView.bind("refresh.jstree", function () {
	    // 跟新选中节点
		if(g_selectNode != null){
			g_selectNode = $treeView.jstree('get_node', g_selectNode);
			showInfo();
		}
	});
	
	$treeView.css("height", getHeight(g_toolBarPanelHeight));
	$('#divInfo').css("height", getHeight(g_toolBarPanelHeight - 39));
    $(window).resize(function () {
	    	$treeView.css("height", getHeight(g_toolBarPanelHeight));
	    	$('#divInfo').css("height", getHeight(g_toolBarPanelHeight - 39));
    });
}

/**
 * 初始化组织权限功能按钮
 */
function initFuncBtnEvent(){
	$("#funcAdd").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择要新增节点的父节点！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'add';
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#funcAdd").data('action-url');
		top.app.layer.editLayer('新增权限', ['710px', '510px'], '/admin/system/func/func-edit.html', params, function(){
   			//重新加载
			$treeView.jstree(true).refresh();
		});
    });
	$("#funcEdit").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择需要编辑的节点！");
			return;
		}
		if(getSelNodeParent() == null){
			top.app.message.alert("无法编辑权限根节点！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#funcEdit").data('action-url');
		top.app.layer.editLayer('编辑权限', ['710px', '510px'], '/admin/system/func/func-edit.html', params, function(){
   			//重新加载列表
			$treeView.jstree(true).refresh();
		});
    });
	$("#funcDel").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择要删除的节点！");
			return;
		}
		if(getSelNodeParent() == null){
			top.app.message.alert("无法删除权限根节点！");
			return;
		}
		if(g_selectNode.data.isBase == 'Y'){
			top.app.message.alert("不能删除基础权限模块！");
			return;
		}
		var operUrl = top.app.conf.url.apigateway + $("#funcDel").data('action-url');
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
			   			top.app.message.alert("数据删除成功！");
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
	$("#funcExport").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择需要导出的节点！");
			return;
		}
		var operUrl = top.app.conf.url.apigateway + $("#funcExport").data('action-url');
		operUrl = operUrl + "?access_token=" + top.app.cookies.getCookiesToken() + "&funcId=" + g_selectNode.id;
		window.open(operUrl);
    });
	$("#funcImport").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择需要导入位置的节点！");
			return;
		}
		//设置参数
		var params = {};
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#funcImport").data('action-url');
		top.app.layer.editLayer('导入权限菜单', ['710px', '470px'], '/admin/system/func/func-import.html', params, function(){
   			//重新加载列表
			$treeView.jstree(true).refresh();
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

/**
 * 显示详细内容
 */
function showInfo(){
	if(g_selectNode != null){
		$('#tdFuncName').text(g_selectNode.text);
		var parentNode = getSelNodeParent();
		if(parentNode == null) $('#tdParentFuncId').text("");
		else $('#tdParentFuncId').text(parentNode.text);
		if(g_selectNode.data != null && g_selectNode.data != undefined){
			if(g_selectNode.data.funcType == '100200')
				$('#tdFuncType').text("文件夹");
			else if(g_selectNode.data.funcType == '100300')
				$('#tdFuncType').text("菜单");
			else if(g_selectNode.data.funcType == '100400')
				$('#tdFuncType').text("权限");
			var dispPosition = "列表上方";
			if(g_selectNode.data.dispPosition == '2') dispPosition = "列表右侧";
			$('#tdFuncIcon').text($.utils.getNotNullVal(g_selectNode.data.funcIcon));
			$('#tdFuncLink').text($.utils.getNotNullVal(g_selectNode.data.funcLink));
			$('#tdFuncFlag').text($.utils.getNotNullVal(g_selectNode.data.funcFlag));
			$('#tdDispPosition').text(dispPosition);
			$('#tdDispOrder').text($.utils.getNotNullVal(g_selectNode.data.dispOrder));
			$('#tdIsBase').text($.utils.getNotNullVal(g_selectNode.data.isBase));
			$('#tdIsShow').text($.utils.getNotNullVal(g_selectNode.data.isShow));
			$('#tdIsBlank').text($.utils.getNotNullVal(g_selectNode.data.isBlank));
			$('#tdFuncDesc').text($.utils.getNotNullVal(g_selectNode.data.funcDesc));
		}
	}
}