var g_params = {}, g_iframeIndex;

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
	//判断是新增还是修改
	$('#divConsultationDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss', allowInputToggle: true});
	if(g_params.type == "edit"){
		$('#age').val(g_params.rows.age);
		$('#hospital').val(g_params.rows.hospital);
		$('#departments').val(g_params.rows.departments);
		$('#doctor').val(g_params.rows.doctor);
		$('#consultationDate').val(g_params.rows.consultationDate);
		$('#summarize').val(g_params.rows.summarize);
		$('#nowHistory').val(g_params.rows.nowHistory);
		$('#symptom').val(g_params.rows.symptom);
		$('#preHistory').val(g_params.rows.preHistory);
		$('#personHistory').val(g_params.rows.personHistory);
		$('#allergyHistory').val(g_params.rows.allergyHistory);
		$('#familyHistory').val(g_params.rows.familyHistory);
		$('#diagnosis').val(g_params.rows.diagnosis);
		$('#pharmacy').val(g_params.rows.pharmacy);
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	age: {required: true, number: true}
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
        	submitAction();
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
		submitData['caseId'] = g_params.rows.caseId;
	submitData["memberId"] = g_params.memberId;
	submitData["age"] = $("#age").val();
	submitData["hospital"] = $("#hospital").val();
	submitData["departments"] = $("#departments").val();
	submitData["doctor"] = $("#doctor").val();
	submitData["consultationDate"] = $("#consultationDate").val();
	submitData["summarize"] = $("#summarize").val();
	submitData["nowHistory"] = $("#nowHistory").val();
	submitData["symptom"] = $("#symptom").val();
	submitData["preHistory"] = $("#preHistory").val();
	submitData["personHistory"] = $("#personHistory").val();
	submitData["allergyHistory"] = $("#allergyHistory").val();
	submitData["familyHistory"] = $("#familyHistory").val();
	submitData["diagnosis"] = $("#diagnosis").val();
	submitData["pharmacy"] = $("#pharmacy").val();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.alert("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}