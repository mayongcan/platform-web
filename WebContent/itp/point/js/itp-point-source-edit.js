var g_params = null, g_backUrl = "";
var g_imagePath = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initData();
	initView();
	formValidate();
	top.app.message.loadingClose();
});

function initView(){
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

function initData(){
	if(g_params.type == 'edit'){
		$('#name').val(g_params.rows.name);
		$('#apiUrl').val(g_params.rows.apiUrl);
		$('#ratio').val(g_params.rows.ratio);
		$('#contact').val(g_params.rows.contact);
		$('#phone').val(g_params.rows.phone);
		$('#address').val(g_params.rows.address);
		$('#company').val(g_params.rows.company);
		$('#bankName').val(g_params.rows.bankName);
		$('#account').val(g_params.rows.account);
		$('#taxpayerId').val(g_params.rows.taxpayerId);
		$('#companyAddress').val(g_params.rows.companyAddress);
		$('#companyPhone').val(g_params.rows.companyPhone);
		
		$('#logo').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#logo').prettyFile({text:"请选择图片"});
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	name: {required: true},
        	ratio: {required: true, number: true},
        	contact: {required: true},
        	phone: {required: true, isMobile: true},
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
        	ajaxUploadImage();
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
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
	else{
		//新增时，设置为正常状态
		submitData["isEnable"] = "1";
	}
	submitData["name"] = $("#name").val();
	submitData["apiUrl"] = $("#apiUrl").val();
	submitData["ratio"] = $("#ratio").val();
	submitData["contact"] = $("#contact").val();
	submitData["phone"] = $("#phone").val();
	submitData["address"] = $("#address").val();
	submitData["company"] = $("#company").val();
	submitData["bankName"] = $("#bankName").val();
	submitData["account"] = $("#account").val();
	submitData["taxpayerId"] = $("#taxpayerId").val();
	submitData["companyAddress"] = $("#companyAddress").val();
	submitData["companyPhone"] = $("#companyPhone").val();
	
	if(g_imagePath != null && g_imagePath != undefined)
		submitData["logo"] = g_imagePath;
	
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

function ajaxUploadImage(){
	if($("#logo")[0].files[0] == null || $("#logo")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		if(g_params.type == "edit"){
   			submitAction();
			return;
		}else{
			top.app.message.notice("请上传积分源图标！");
			return;
		}
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#logo")[0].files[0], function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}