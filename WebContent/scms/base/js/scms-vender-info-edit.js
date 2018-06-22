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
		$('#venderName').val(g_params.rows.venderName);
		$('#venderDesc').val(g_params.rows.venderDesc);
		$('#venderAddr').val(g_params.rows.venderAddr);
		$('#contactPhone').val(g_params.rows.contactPhone);
		$('#contactName').val(g_params.rows.contactName);
		$('#venderPhoto').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#venderPhoto').prettyFile({text:"请选择图片"});
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
        	venderName: {required: true},
        	contactPhone: {required: true},
        	contactName: {required: true},
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
	//如果变更了clientId，则需要传送到后端
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
	else{
		var merchantsId = scms.getUserMerchantsId();
		if(merchantsId == null || merchantsId == undefined || merchantsId == '' || merchantsId == '-1'){
			submitData["type"] = "1";	
			submitData["merchantsId"] = "";
		}else{
			submitData["type"] = "2";	
			submitData["merchantsId"] = merchantsId;
		}
	}
		
	submitData["venderName"] = $("#venderName").val();
	submitData["contactName"] = $("#contactName").val();
	submitData["contactPhone"] = $("#contactPhone").val();
	submitData["venderAddr"] = $("#venderAddr").val();
	submitData["venderDesc"] = $("#venderDesc").val();

	if(g_imagePath != null && g_imagePath != undefined)
		submitData["venderPhoto"] = g_imagePath;
	else{
		if(g_params.type == "edit") submitData["venderPhoto"] = g_params.rows.venderPhoto;
	}
	
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


/**
 * 提交图片
 */
function ajaxUpload(){
	if($("#venderPhoto")[0].files[0] == null || $("#venderPhoto")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadMultiImage($("#venderPhoto")[0].files, function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}
