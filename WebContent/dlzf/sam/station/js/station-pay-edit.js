var g_params = {}, g_iframeIndex = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('#auditYear').selectpicker({
		width: '510px'
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
	var datetime = new Date();
	var searchYearDict = [], curYear = parseInt(datetime.getFullYear()), html = "";
	$('#auditYear').empty();
	for(var i = curYear; i >= curYear - 10; i--){
		html += "<option value='" + i + "'>" + i + "年度</option>";
	}
	$('#auditYear').append(html);
	$('.selectpicker').selectpicker('refresh');
	
	$("input[name='radioIsExempted']").bind("click",function(){  
		if($('#divRadioIsExempted input:radio:checked').val() == '0'){
			$("#divIsPay").css('display', '');
		}else{
			$("#divIsPay").css('display', 'none');
		}
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
 */
function submitAction(){
	top.app.message.loading(0);
	//定义提交数据
	var submitData = {};
	submitData["unitId"] = g_params.data.orgGuid;
	submitData["name"] = g_params.data.orgName;
	submitData["statId"] = g_params.data.guid;
	submitData["statName"] = g_params.data.statName;
	submitData["auditYear"] = $("#auditYear").val();
	submitData["pay"] = $("#pay").val();
	submitData["memo"] = $("#memo").val();
	submitData["isExempted"] = $('#divRadioIsExempted input:radio:checked').val();
	submitData["isPay"] = $('#divRadioIsPay input:radio:checked').val();
	//设台单位下的所有都年审
	if(g_params.addAll){
		submitData["addAll"] = "1";
	}
		
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/station/addStationPay?access_token=" + top.app.cookies.getCookiesToken(),
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


