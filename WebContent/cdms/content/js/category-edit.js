var g_params = {}, g_iframeIndex = null, g_comboBoxTree = null, g_comboxOrganizerTree = null, g_filePath = null;
var g_tenantsId = top.app.info.tenantsInfo.tenantsId, g_organizerId = null, g_isFirstLoad = true, $comboxTenants = $('#tenantsBox');

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度为200px
	$('.selectpicker').selectpicker({
		width: '200px'
	});
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化树
	initTree();
	//初始化界面
	initView();
	//初始化下拉选择列表(租户和组织)
	initComboBoxList();
}

/**
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#parentCatId') , g_params.allTreeData, '200px');
}

/**
 * 初始化界面
 */
function initView(){//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#name').val(g_params.node.text);
		$('#nameEn').val(g_params.node.original.attributes.nameEn == undefined ? "" : g_params.node.original.attributes.nameEn);
		$('#officeId').val(g_params.node.original.attributes.officeId == undefined ? "" : g_params.node.original.attributes.officeId);
		$('#module').val(g_params.node.original.attributes.module == undefined ? "" : g_params.node.original.attributes.module);
		$('#href').val(g_params.node.original.attributes.href == undefined ? "" : g_params.node.original.attributes.href);
		$('#target').val(g_params.node.original.attributes.target == undefined ? "" : g_params.node.original.attributes.target);
		$('#categoryDesc').val(g_params.node.original.attributes.categoryDesc == undefined ? "" : g_params.node.original.attributes.categoryDesc);
		$('#keywords').val(g_params.node.original.attributes.keywords == undefined ? "" : g_params.node.original.attributes.keywords);
		$('#dispOrder').val(g_params.node.original.attributes.dispOrder == undefined ? "" : g_params.node.original.attributes.dispOrder);
		$('#inMenu').val(g_params.node.original.attributes.inMemu == undefined ? "" : g_params.node.original.attributes.inMenu);
		$('#inList').val(g_params.node.original.attributes.inList == undefined ? "" : g_params.node.original.attributes.inList);
		$('#showMode').val(g_params.node.original.attributes.showMode == undefined ? "" : g_params.node.original.attributes.showMode);
		$('#allowComment').val(g_params.node.original.attributes.allowComment == undefined ? "" : g_params.node.original.attributes.allowComment);
		$('#isAudit').val(g_params.node.original.attributes.isAudit == undefined ? "" : g_params.node.original.attributes.isAudit);
		$('#customListView').val(g_params.node.original.attributes.customListView == undefined ? "" : g_params.node.original.attributes.customListView);
		$('#customContentView').val(g_params.node.original.attributes.customContentView == undefined ? "" : g_params.node.original.attributes.customContentView);
		$('#viewConfig').val(g_params.node.original.attributes.viewConfig == undefined ? "" : g_params.node.original.attributes.viewConfig);
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		//g_comboBoxTree.setValue(g_params.node);
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片"});
	}
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 初始化下拉选择列表(租户和组织)
 */
function initComboBoxList(){
	//获取组织数据
	g_comboxOrganizerTree = AppCombotree.createNew();
	g_comboxOrganizerTree.init($('#organizerBox') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.api.system.organizer.getOrganizerTree,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
		    	tenantsId: g_params.tenantsId
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
					setTimeout(function () {
						if(g_params.type == "edit" && g_params.node.original.attributes.officeId != null && g_params.node.original.attributes.officeId != undefined){
							g_comboxOrganizerTree.setValueById(g_params.node.original.attributes.officeId);
							g_organizerId = g_comboxOrganizerTree.getNodeId();
						}
				    }, 300);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	}, '200px');
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	name: {required: true},
        	dispOrder: {required: true, digits:true}
        },
        messages: {
        	name: {required: "请输入栏目名称"},
        	dispOrder: {required: "请输入显示次序", digits: "显示次序必须为0－999999之间的数字" }
        },
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
                return false;
            });  
        },
        //失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
            //提交内容
        	ajaxUpload();
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.node != null && g_params.node != undefined && g_params.type == "edit"){
		submitData['categoryId'] = g_params.node.id;
	}
	submitData["name"] = $.trim($("#name").val());
	submitData["parentId"] = g_comboBoxTree.getNodeId();
	submitData["officeId"] = g_comboxOrganizerTree.getNodeId();
	submitData["nameEn"] = $.trim($("#nameEn").val());
	submitData["module"] = $("#module").val();
	submitData["href"] = $("#href").val();
	submitData["target"] = $("#target").val();
	submitData["categoryDesc"] = $("#categoryDesc").val();
	submitData["keywords"] = $("#keywords").val();
	submitData["dispOrder"] = $("#dispOrder").val();
	submitData["inMenu"] = $("#inMenu").val();
	submitData["inList"] = $("#inList").val();
	submitData["showMode"] = $("#showMode").val();
	submitData["allowComment"] = $("#allowComment").val();
	submitData["isAudit"] = $("#isAudit").val();
	submitData["customListView"] = $("#customListView").val();
	submitData["customContentView"] = $("#customContentView").val();
	submitData["viewConfig"] = $("#viewConfig").val();
	if(g_filePath != null && g_filePath != undefined)
		submitData["image"] = g_filePath;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.alert("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 提交图片
 */
function ajaxUpload(){
	if(g_params.node != null && g_params.node != undefined && g_params.type == "edit"){
		//判断当前编辑的父ID和ID是否一致
		if(g_params.node.id == g_comboBoxTree.getNodeId()){
			top.app.message.alert("父节点不能与当前节点一致！");
			return;
		}
	}
	if(!g_comboxOrganizerTree.isSelectNode()){
		top.app.message.alert("请选择归属组织！");
		return;
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#image")[0].files[0], function(data){
		g_filePath = data;
		//提交数据
		submitAction();
	});
}