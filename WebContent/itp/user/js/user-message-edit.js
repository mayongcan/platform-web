var g_params = {}, g_comboBoxTree = null, g_imagePath = null, g_filePath = null; 
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
$(function () {
	formValidate();
	//取消按钮
	$("#btnBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "user-message.html?_pid=" + pid;
    });
	$("#btnSave").click(function () {
		$("form").submit();
    });
	g_params = top.app.info.iframe.params;
	initView();
});

/**
 * 初始化界面
 */
function initView(){
	top.app.addComboBoxOption($("#msgType"), g_params.msgType);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#msgTitle').val(g_params.rows.msgTitle);
		$('#msgType').val(g_params.rows.msgType);
		$('#msgContent').val(g_params.rows.msgContent);
		g_userIdList = g_params.rows.userIdList;
		g_userCodeList = g_params.rows.userCodeList;
		g_userNameList = g_params.rows.userNameList;
		$("#msgUser").val(g_userNameList);
	}else{
	}

	if($('#msgType').val() == '1'){
		$('#divReceiver').css("display", "none");
	}else{
		$('#divReceiver').css("display", "");
	}
	
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
	
	//权限类型下拉框变更事件
	$('#msgType').on('changed.bs.select', function (e) {
		if($('#msgType').val() == '1'){
			$('#divReceiver').css("display", "none");
		}else{
			$('#divReceiver').css("display", "");
		}
	});
	
	//选择消息接收人
	$("#msgUser").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择消息接收人', ['900px', '550px'], '/itp/user/user-message-select.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#msgUser").val(retParams[0].userNameList);
		});
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	msgTitle: {required: true},
        	msgContent: {required: true}
        },
        messages: {
        	msgTitle: {required: "请输入消息标题"}
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
	if($("#msgType").val() == '3' && g_userIdList == ''){
		top.app.message.alert("请选择接收消息的用户！");
		return ;
	}
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined)
		submitData['msgId'] = g_params.rows.msgId;
	submitData["msgTitle"] = $("#msgTitle").val();
	submitData["msgType"] = $("#msgType").val();
	submitData["msgContent"] = $("#msgContent").val();
	submitData["userIdList"] = g_userIdList;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href= "user-message.html?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
