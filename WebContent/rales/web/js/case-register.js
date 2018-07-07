
$(function () {
	formValidate();
	//初始化界面
	initView();
});

/**
 * 初始化界面
 */
function initView(){
	$('#divReportDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss', allowInputToggle: true, defaultDate: new Date()});
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	name: {required: true},
        	contactPhone: {required: true, isMobile: true},
        	content: {required: true},
        	address: {required: true},
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
	top.app.message.loading();
	//定义提交数据
	var submitData = {};
	submitData["name"] = $("#name").val();
	submitData["contactPhone"] = $("#contactPhone").val();
	submitData["content"] = $("#content").val();
	submitData["address"] = $("#address").val();
	submitData["reportDate"] = $("#reportDate").val();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/web/addWebReport?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				top.app.message.alertEvent("数据提交成功！", function(){
					window.location.reload();
				});
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


