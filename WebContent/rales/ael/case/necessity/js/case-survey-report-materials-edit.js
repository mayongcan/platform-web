var g_params = {}, g_iframeIndex = null;
var g_filePath = null, g_fileSize = 0;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '225px'
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
		$('#certificateName').val(g_params.rows.certificateName);
		$('#grade').val(g_params.rows.grade);
		$('#totalCnt').val(g_params.rows.totalCnt);
	}

	$('input[type="file"]').prettyFile({
		text : "请选择文件"
	});
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	certificateName: {required: true},
        	grade: {required: true},
        	totalCnt: {required: true},
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
            //提交内容
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
	if(g_params.rows != null && g_params.rows != undefined)
		submitData['id'] = g_params.rows.id;
	submitData["certificateName"] = $.trim($("#certificateName").val());
	submitData["grade"] = $("#grade").val();
	submitData["totalCnt"] = $.trim($("#totalCnt").val());
	submitData["reportId"] = g_params.reportId;
	submitData["registerId"] = g_params.registerId;
	//已上传的附件路径
	if(g_filePath != null && g_filePath != undefined)
		submitData["files"] = g_filePath;
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
		//启动加载层
		top.app.message.loading();
		submitAction();
		return;
	}
	//上传到资源服务器
	top.app.uploadMultiFile($("#files")[0].files, function(data){
		g_filePath = data;
		g_fileSize = $("#files")[0].files[0].size / 1024;
		g_fileSize = g_fileSize.toFixed(2);
		//提交数据
		submitAction();
	}, "-1");
}
