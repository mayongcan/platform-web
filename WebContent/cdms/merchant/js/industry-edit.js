var g_params = {}, g_iframeIndex = null, g_comboBoxTree = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select
	$('.selectpicker').selectpicker({
		width: '530px'
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
	g_comboBoxTree.init($('#parentId') , g_params.allTreeData, '530px');
}

/**
 * 初始化界面
 */
function initView(){//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#industryName').val(g_params.node.text);
		//g_comboBoxTree.setValue(g_params.parentNode);
		$('#memo').val(g_params.node.original.attributes.memo);
		$('#dispOrder').val(g_params.node.original.attributes.dispOrder);
	}else{
		//g_comboBoxTree.setValue(g_params.node);
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
        	industryName: {required: true},
        	dispOrder: {required: true, digits:true}
        },
        messages: {
        	industryName: {required: "请输入行业名称"},
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
        	submitAction();
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
		submitData['industryId'] = g_params.node.id;
		//判断当前编辑的父ID和ID是否一致
		if(g_params.node.id == g_comboBoxTree.getNodeId()){
			top.app.message.alert("父节点不能与当前节点一致！");
			return;
		}
	}
	submitData["industryName"] = $.trim($("#industryName").val());
	submitData["parentId"] = g_comboBoxTree.getNodeId();
	submitData["memo"] = $.trim($("#memo").val());
	submitData["dispOrder"] = $("#dispOrder").val();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
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