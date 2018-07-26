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
        	submitAction();
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	if($("#filesPath")[0].files[0] == null || $("#filesPath")[0].files[0] == undefined){
		top.app.message.alert("请选择需要上传的监测站数据！");
		return;
	}
	// 启动加载层
	top.app.message.loading(60000);
	var formData = new FormData();
	formData.append("file",	$("#filesPath")[0].files[0]);
	$.ajax({  
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken() + "&id=" + g_params.row.id,
        type: 'POST',  
        data: formData,  
        // 告诉jQuery不要去处理发送的数据
        processData : false, 
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        success : function(data) { 
   			top.app.message.loadingClose();
   			if(top.app.message.code.success == data.RetCode){
   				// 关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.notice("监测站数据上传成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.noticeError(data.RetMsg);
	   		}
        },  
        error : function(responseStr) { 
   			top.app.message.loadingClose();
   			top.app.message.noticeError("监测站数据上传失败，请稍后重试！");
        }  
    }); 
}