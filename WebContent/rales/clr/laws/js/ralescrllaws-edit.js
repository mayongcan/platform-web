var g_params = {}, g_iframeIndex = null;
var g_filePath = null, g_fileSize = 0, g_fileNum = 0;

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
	$('#files').prettyFile({text:"请选择文件"});
	
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#name').val(g_params.rows.name);
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
    		name: {required: true},
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
	//如果变更了clientId，则需要传送到后端
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
		
	submitData["name"] = $("#name").val();
	if(g_filePath != null && g_filePath != undefined){
		submitData["files"] = g_filePath;
		if(g_params.type == "edit")
			submitData["num"] = g_params.rows.num + g_fileNum;
		else 
			submitData["num"] = g_fileNum;
		
		submitData["size"] = g_fileSize;
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

function ajaxUploadFile(){
	if($("#files")[0].files[0] == null || $("#files")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改,直接进入提交数据
		if(g_params.type == "edit"){
			//启动加载层
			top.app.message.loading();
   			submitAction();
			return;
		}else{
			top.app.message.notice("请选择要上传的文件！");
			return;
		}
	}
	//上传到资源服务器
	top.app.uploadMultiFile($("#files")[0].files, function(filePath, fileSize, fileNum){
		g_filePath = filePath;
		g_fileSize = fileSize / 1024;
		g_fileSize = g_fileSize.toFixed(0)
		g_fileNum = fileNum;
		//提交数据
		submitAction();
	}, "-1");
}