var g_params = null, g_backUrl = "";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initView();
	formValidate();
	top.app.message.loadingClose();
});


function initView(){
	if(!$.utils.isEmpty(g_params.row.privilegeContent)){
		var jsonData = eval("(" + g_params.row.privilegeContent + ")");
		$("#createColor").prop("checked", jsonData.createColor);
		$("#createTexture").prop("checked", jsonData.createTexture);
		$("#createSize").prop("checked", jsonData.createSize);
		$("#createVender").prop("checked", jsonData.createVender);
	}
	
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
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
 * @returns
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_params.row.merchantsUserId;
	var content = new Object();
	content.createColor = $('#createColor').prop('checked');
	content.createTexture = $('#createTexture').prop('checked');
	content.createSize = $('#createSize').prop('checked');
	content.createVender = $('#createVender').prop('checked');
	submitData["privilegeContent"] = JSON.stringify(content);
	top.app.message.loading();
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
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}