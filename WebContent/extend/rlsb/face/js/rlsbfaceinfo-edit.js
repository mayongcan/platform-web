var g_params = {}, g_iframeIndex = null, g_filePath = null;

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
	$('#divBirthday').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
    //var sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#sex"), g_params.sexDict);
    //var credentialsTypeDict = top.app.getDictDataByDictTypeValue('SYS_CREDENTIALS_TYPE');
	top.app.addComboBoxOption($("#credentialsType"), g_params.credentialsTypeDict);
	
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#name').val(g_params.rows.name);
		$('#sex').val(g_params.rows.sex);
		$('#credentialsType').val(g_params.rows.credentialsType);
		$('#credentialsNum').val(g_params.rows.credentialsNum);
		$('#birthday').val($.date.dateFormat(g_params.rows.birthday, "yyyy-MM-dd"));
		$('#phone').val(g_params.rows.phone);
	}
	$('input[type="file"]').prettyFile({text:"请选择图片"});
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	credentialsNum: {isIdCardNo: true},
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
	submitData["name"] = $("#name").val();
	submitData["sex"] = $("#sex").val();
	submitData["credentialsType"] = $("#credentialsType").val();
	submitData["credentialsNum"] = $("#credentialsNum").val();
	submitData["birthday"] = $("#birthday").val();
	submitData["phone"] = $("#phone").val();
	if(g_filePath != null && g_filePath != undefined && g_filePath != '')
		submitData["photo"] = g_filePath;
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
	if($("#photo")[0].files[0] == null || $("#photo")[0].files[0] == undefined){
		if(g_params.type == "edit"){
			submitAction();
		}else{
   			top.app.message.notice("请上传人脸图像！");
		}
		return;
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#photo")[0].files[0], function(data){
		g_filePath = data;
		//提交数据
		submitAction();
	});
}
