var g_params = {}, g_iframeIndex = null;
var g_imagePath = null

var g_comboBoxTree = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
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
}

/**
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#parentNode') , g_params.allTreeData, '555px');
}

/**
 * 初始化界面
 */
function initView(){//判断是新增还是修改
	if(g_params.type == "edit"){
		g_comboBoxTree.setValue(g_params.parentNode);

		$('#parentId').val(g_params.node.data.parentId == undefined ? "" : g_params.node.data.parentId);
		$('#categoryName').val(g_params.node.data.categoryName == undefined ? "" : g_params.node.data.categoryName);
		$('#categoryNum').val(g_params.node.data.categoryNum == undefined ? "" : g_params.node.data.categoryNum);
		$('#categoryDesc').val(g_params.node.data.categoryDesc == undefined ? "" : g_params.node.data.categoryDesc);
		$('#dispOrder').val(g_params.node.data.dispOrder == undefined ? "" : g_params.node.data.dispOrder);
		$('#createBy').val(g_params.node.data.createBy == undefined ? "" : g_params.node.data.createBy);

		$('#categoryPhoto').prettyFile({text:"请选择图片", placeholder:"若不需要修改，请留空"});
	}else{
		g_comboBoxTree.setValue(g_params.node);
		$('#categoryPhoto').prettyFile({text:"请选择图片"});
	}
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		categoryName: {required: true},
    		categoryNum: {required: true},
    		dispOrder: {number:true},
        },
        messages: {
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
        	ajaxUploadImage();
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
		submitData['id'] = g_params.node.id;
		//判断当前编辑的父ID和ID是否一致
		if(g_params.node.id == g_comboBoxTree.getNodeId()){
			top.app.message.notice("父节点不能与当前节点一致！");
			return;
		}
	}
	
	//添加parentId
	submitData["parentId"] = g_comboBoxTree.getNodeId();
	submitData["categoryName"] = $("#categoryName").val();
	submitData["categoryNum"] = $("#categoryNum").val();
	submitData["categoryDesc"] = $("#categoryDesc").val();
	if(g_imagePath != null && g_imagePath != undefined)
		submitData["categoryPhoto"] = g_imagePath;
	submitData["dispOrder"] = $("#dispOrder").val();

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
	   			top.app.message.notice("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function ajaxUploadImage(){
	if($("#categoryPhoto")[0].files[0] == null || $("#categoryPhoto")[0].files[0] == undefined){
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadMultiImage($("#categoryPhoto")[0].files, function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}
