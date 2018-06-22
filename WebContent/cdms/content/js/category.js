var $treeView = $('#treeView'), g_toolBarPanelHeight = 0, g_selectNode = null, g_allTreeData = null, g_tenantsId = null;
$(function () {
	//初始化权限
	initFunc();
	//初始化树列表
	initTree();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
	//初始化下拉选择列表(租户)
	initComboBoxList();
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	//现获取原来的html
	var oldHtml = $("#treeToolbar").html();
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
	$("#treeToolbar").append(oldHtml);
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
				    url: top.app.conf.url.api.cdms.content.category.getCategoryTree,
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
	    //隐藏虚拟节点
	    if(rootNode.id == '-1') $treeView.jstree('hide_node', rootNode);
	    else $treeView.jstree('open_node', rootNode);
	});
	
	$treeView.bind("activate_node.jstree", function (obj, e) {
	    // 获取当前节点
		g_selectNode = e.node;
		showInfo();
	});
	$treeView.bind("refresh.jstree", function (e, data) {
	    // 更新选中节点
		if(g_selectNode != null){
			g_selectNode = $treeView.jstree('get_node', g_selectNode);
			showInfo();
		}
	    //隐藏虚拟节点
		var inst = data.instance;  
	    var rootNode = inst.get_node(e.target.firstChild.firstChild.lastChild); 
	    if(rootNode.id == '-1') $treeView.jstree('hide_node', rootNode);
	});
	$treeView.css("min-height", $('#divInfo').outerHeight(true) - 129);
	$('#divInfo').css("min-height", getHeight(g_toolBarPanelHeight - 39));
    $(window).resize(function () {
    	$treeView.css("min-height", $('#divInfo').outerHeight(true) - 129);
    	$('#divInfo').css("min-height", getHeight(g_toolBarPanelHeight - 39));
    });
}

/**
 * 初始化组织权限功能按钮
 */
function initFuncBtnEvent(){
	$("#contentCategoryAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.tenantsId = g_tenantsId;
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#contentCategoryAdd").data('action-url');
		top.app.layer.editLayer('新增文章分类', ['750px', '500px'], '/cdms/content/category-edit.html', params, function(){
   			//重新加载
			$treeView.jstree(true).refresh();
		});
    });
	$("#contentCategoryEdit").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择需要编辑的节点！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.tenantsId = g_tenantsId;
		params.node = g_selectNode;
		params.parentNode = getSelNodeParent();
		params.allTreeData = g_allTreeData;
		params.operUrl = top.app.conf.url.apigateway + $("#contentCategoryEdit").data('action-url');
		top.app.layer.editLayer('编辑文章分类', ['750px', '500px'], '/cdms/content/category-edit.html', params, function(){
   			//重新加载列表
			$treeView.jstree(true).refresh();
		});
    });
	$("#contentCategoryDel").click(function () {
		if(g_selectNode == null ){
			top.app.message.alert("请选择要删除的节点！");
			return;
		}
		var operUrl = top.app.conf.url.apigateway + $("#contentCategoryDel").data('action-url');
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
}

/**
 * 初始化下拉选择列表(租户)
 */
function initComboBoxList(){
	//根租户的管理员才能管理多个租户下的组织
	if(top.app.info.userInfo.isAdmin == 'Y' && top.app.info.tenantsInfo.isRoot == 'Y'){
		//设置select的宽度为200px
		$('.selectpicker').selectpicker({
			width: '200px'
		});
		$('#divTenantsBox').css('display', 'block');
		//获取数据
		top.app.getTenantsListBox($('#tenantsBox'), function(){
			$('.selectpicker').selectpicker('refresh');
		});
		//绑定租户下拉框变更事件
		$('#tenantsBox').on('changed.bs.select', function (e) {
			//设置全局的租户ID
			g_tenantsId = $('#tenantsBox').val();
		});
	}
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
		$('#tdName').text(g_selectNode.text);
		var parentNode = getSelNodeParent();
		if(parentNode == null) $('#tdParentId').text("");
		else $('#tdParentId').text(parentNode.text);
		if(g_selectNode.original != null && g_selectNode.original != undefined && 
				g_selectNode.original.attributes != null && g_selectNode.original.attributes != undefined){
			$('#tdNameEn').text(g_selectNode.original.attributes.nameEn == undefined ? "" : g_selectNode.original.attributes.nameEn);
			$('#tdOfficeId').text(g_selectNode.original.attributes.officeId == undefined ? "" : g_selectNode.original.attributes.officeId);
			$('#tdModule').text(g_selectNode.original.attributes.module == undefined ? "" : g_selectNode.original.attributes.module);
			showThumbnail($('#tdImage'), g_selectNode.original.attributes.image, "image");
			$('#tbHref').text(g_selectNode.original.attributes.href == undefined ? "" : g_selectNode.original.attributes.href);
			$('#tbTarget').text(g_selectNode.original.attributes.target == undefined ? "" : g_selectNode.original.attributes.target);
			$('#tdCategoryDesc').text(g_selectNode.original.attributes.categoryDesc == undefined ? "" : g_selectNode.original.attributes.categoryDesc);
			$('#tdKeywords').text(g_selectNode.original.attributes.keywords == undefined ? "" : g_selectNode.original.attributes.keywords);
			$('#tdDispOrder').text(g_selectNode.original.attributes.dispOrder == undefined ? "" : g_selectNode.original.attributes.dispOrder);
			getYesOrNo($('#tdInMenu'), g_selectNode.original.attributes.inMenu);
			getYesOrNo($('#tdInList'), g_selectNode.original.attributes.inList);
			$('#tdShowMode').text(g_selectNode.original.attributes.showMode == undefined ? "" : g_selectNode.original.attributes.showMode);
			getYesOrNo($('#tdAllowComment'), g_selectNode.original.attributes.allowComment);
			getYesOrNo($('#tdIsAudit'), g_selectNode.original.attributes.isAudit);
			$('#tdCustomListView').text(g_selectNode.original.attributes.customListView == undefined ? "" : g_selectNode.original.attributes.customListView);
			$('#tdCustomContentView').text(g_selectNode.original.attributes.customContentView == undefined ? "" : g_selectNode.original.attributes.customContentView);
			$('#tdViewConfig').text(g_selectNode.original.attributes.viewConfig == undefined ? "" : g_selectNode.original.attributes.viewConfig);
		}
	}
}

function showThumbnail(divObj, image, name){
	if(divObj == null || divObj == undefined) return;
	if(image != null && image != undefined && image != ''){
		divObj.empty();
		var list = image.split(',');
		for(var i = 0; i < list.length; i++){
			if(list[i] == null || list[i] == undefined || list[i] == '') continue;
			var imgsrc = top.app.conf.url.res.url + list[i];
			divObj.append('<a href="' + imgsrc + '" data-fancybox data-caption="查看图片">\
								<img src="' + imgsrc + '" alt="" id="' + name + 'imgThumbnail' + i + '"/>\
							</a>\
						');
			$('#' + name + 'imgThumbnail' + i).jqthumb();
		}
		//初始化
		$("[data-fancybox]").fancybox({});
	}else{
		divObj.empty();
	}
}

function getYesOrNo(divObj, value){
	if(value != null && value != undefined && value != ''){
		if(value == '0') divObj.text('否');
		else if(value == '1') divObj.text('是');
		else divObj.text('');
	}else{
		divObj.text('');
	}
}