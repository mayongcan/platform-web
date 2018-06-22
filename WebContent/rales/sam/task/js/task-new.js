var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
$(function () {
	initView();
	formValidate();
	$('.selectpicker').selectpicker({width:'100%'});
});


function initView(){
	fileupload.initFileNewSelector('files');
	$('#divCompletedDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = "task-new.html?_pid=" + pid;
    });
	
	//选择接收人
	$("#receiveBy").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList + "";
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择接收人', ['900px', '550px'], '/rales/sam/task/task-user.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#receiveBy").val(retParams[0].userNameList);
		});
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	title: {required: true},
        	completedDate: {required: true},
        	content: {required: true},
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
        	fileupload.uploadAction(function(){
        		if(g_userIdList == ''){
        			top.app.message.notice("请选择任务接收人!");
        			return false;
        		}
        		if(g_userIdList == top.app.info.userInfo.userId){
        			top.app.message.notice("任务接收人不能选择自己!");
        			return false;
        		}
        		return true;
        	}, false, true, "-1", function(){submitAction();});
        }
    });
}

function submitAction(){
	//提交数据
	var submitData = {};
	submitData["title"] = $('#title').val();
	submitData["receiveBy"] = g_userIdList;
	submitData["completedDate"] = $('#completedDate').val();
	submitData["content"] = $("#content").val();
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();

	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/task/startFlow?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("新建任务成功！");
	   			//页面跳转
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = "task-new.html?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}