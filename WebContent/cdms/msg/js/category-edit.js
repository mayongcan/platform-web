var g_params = {}, g_iframeIndex = null, g_comboBoxTree = null, g_filePath = null;
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
		$('#catName').val(g_params.node.text);
		$('#keywords').val(g_params.node.original.attributes.keywords);
		$('#catDesc').val(g_params.node.original.attributes.catDesc);
		$('#dispOrder').val(g_params.node.original.attributes.dispOrder);
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片"});
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
        	catName: {required: true},
        	dispOrder: {required: true, digits:true}
        },
        messages: {
        	catName: {required: "请输入分类名称"},
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
		submitData['catId'] = g_params.node.id;
	}
	submitData["catName"] = $.trim($("#catName").val());
	submitData["parentId"] = g_comboBoxTree.getNodeId();
	submitData["keywords"] = $.trim($("#keywords").val());
	submitData["catDesc"] = $.trim($("#catDesc").val());
	submitData["dispOrder"] = $("#dispOrder").val();
	if(g_filePath != null && g_filePath != undefined)
		submitData["photo"] = g_filePath;
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
	if($("#photo")[0].files[0] == null || $("#photo")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		if(g_params.type == "edit"){
			//启动加载层
			top.app.message.loading();
   			submitAction();
			return;
		}else{
			top.app.message.alert("请选择要上传的文件！");
			return;
		}
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#photo")[0].files[0], function(data){
		g_filePath = data;
		//提交数据
		submitAction();
	});
}