var g_params = {}, g_iframeIndex = null;
var g_imagePath = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
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
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#shopName').val(g_params.rows.shopName);
		$('#shopAddr').val(g_params.rows.shopAddr);
		$('#shopDesc').val(g_params.rows.shopDesc);
		$('#shopPhone').val(g_params.rows.shopPhone);
		$('#shopLogo').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#shopLogo').prettyFile({text:"请选择图片"});
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
    		shopName: {required: true},
        	shopPhone: {isMobile: true},
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
        	ajaxUploadImage()
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;

	submitData["merchantsId"] = g_params.merchantsId;
	submitData["shopName"] = $("#shopName").val();
	submitData["shopAddr"] = $("#shopAddr").val();
	submitData["shopDesc"] = $("#shopDesc").val();
	if(g_imagePath != null && g_imagePath != undefined)
		submitData["shopLogo"] = g_imagePath;
	submitData["shopPhone"] = $("#shopPhone").val();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
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
	if($("#shopLogo")[0].files[0] == null || $("#shopLogo")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#shopLogo")[0].files[0], function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}
