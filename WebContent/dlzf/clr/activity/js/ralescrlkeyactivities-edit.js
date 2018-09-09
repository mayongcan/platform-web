var g_params = {}, g_backUrl = null;
var g_codeType = "3", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
	formValidate();
});

function initView(){
	top.app.addComboBoxOption($("#result"), g_params.resultDict);
	
	//1新增 2编辑 3查看
	if(g_params.type == 'edit'){
		$('#name').val(g_params.rows.name);
		$('#certificateNo').val(g_params.rows.certificateNo);
		$('#company').val(g_params.rows.company);
		$('#legalRepresentative').val(g_params.rows.legalRepresentative);
		$('#address').val(g_params.rows.address);
		$('#zip').val(g_params.rows.zip);
		$('#contactPhone').val(g_params.rows.contactPhone);
		$('#result').val(g_params.rows.result);
		fileupload.initFileEditSelector('files', g_params.rows.files);
	}else{
		fileupload.initFileNewSelector('files');
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
        	name: {required: true},
        	certificateNo: {isIdCardNo: true},
    		company: {required: true},
    		legalRepresentative: {required: true},
    		address: {required: true},
    		zip: {isZipCode: true},
        	contactPhone: {isMobile: true},
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
        	fileupload.uploadAction(null, false, true, "-1", function(){submitAction();});
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
	//如果变更了clientId，则需要传送到后端
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
		
	submitData["name"] = $("#name").val();
	submitData["certificateNo"] = $("#certificateNo").val();
	submitData["company"] = $("#company").val();
	submitData["legalRepresentative"] = $("#legalRepresentative").val();
	submitData["address"] = $("#address").val();
	submitData["zip"] = $("#zip").val();
	submitData["contactPhone"] = $("#contactPhone").val();
	submitData["result"] = $("#result").val();
	submitData["files"] = fileupload.getUploadFilePath();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
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
