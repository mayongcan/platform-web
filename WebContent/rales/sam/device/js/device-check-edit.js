var g_params = {}, g_iframeIndex = null;
var g_filePath = null, g_fileSize = 0;

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
		$('#filesName').val(g_params.rows.filesName);
		$('#filesPath').prettyFile({text:"请选择文件", placeholder:"若不需要修改，请留空"});
	}else{
		$('#filesPath').prettyFile({text:"请选择文件"});
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
        	filesName: {required: true},
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
        	ajaxUploadFile();
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
		
	submitData["filesName"] = $("#filesName").val();
	if(g_filePath != null && g_filePath != undefined)
		submitData["filesPath"] = g_filePath;
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


function ajaxUploadFile(){
	if($("#filesPath")[0].files[0] == null || $("#filesPath")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改,直接进入提交数据
		if(g_params.type == "edit"){
			//启动加载层
			top.app.message.loading();
   			submitAction();
			return;
		}else{
			top.app.message.notice("请选择要上传的对比文件！");
			return;
		}
	}
	//上传到资源服务器
	top.app.uploadFile($("#filesPath")[0].files[0], function(data){
		g_filePath = data;
		g_fileSize = $("#filesPath")[0].files[0].size / 1024;
		g_fileSize = g_fileSize.toFixed(2);
		//提交数据
		submitAction();
	});
}
