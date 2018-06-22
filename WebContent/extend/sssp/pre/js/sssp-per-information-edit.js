var g_params = {}, g_iframeIndex = null;

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
	if(g_params.type == "edit"){
		$('#name').val(g_params.rows.name);
		$('#sex').val(g_params.rows.sex);
		$('#age').val(g_params.rows.age);
		$('#mobile').val(g_params.rows.mobile);
		$('#realNameCard').val(g_params.rows.realNameCard);
		$('#belongProject').val(g_params.rows.belongProject);
		$('#belongMan').val(g_params.rows.belongMan);
		$('#workType').val(g_params.rows.workType);
		$('#isValid').val(g_params.rows.isValid);
		$('#days').val(g_params.rows.days);
		$('#hours').val(g_params.rows.hours);
		$('#area').val(g_params.rows.area);
		$('#teachLevel').val(g_params.rows.teachLevel);
		$('#isProjectMan').val(g_params.rows.isProjectMan);
		$('#birthday').val(g_params.rows.birthday);
		$('#origin').val(g_params.rows.origin);
		$('#validDate').val(g_params.rows.validDate);
		$('#homeAddress').val(g_params.rows.homeAddress);
		$('#isTeamLeader').val(g_params.rows.isTeamLeader);
		$('#laborSubcontractors').val(g_params.rows.laborSubcontractors);
		$('#emergencyContact').val(g_params.rows.emergencyContact);
		$('#emergencyPhone').val(g_params.rows.emergencyPhone);
		$('#dormitoryNumber').val(g_params.rows.dormitoryNumber);
		$('#bedNumber').val(g_params.rows.bedNumber);
		$('#cardNumber').val(g_params.rows.cardNumber);
		$('#securityStatus').val(g_params.rows.securityStatus);
		$('#configureType').val(g_params.rows.configureType);
		$('#operateType').val(g_params.rows.operateType);
		$('#role').val(g_params.rows.role);
		
	}else{
	}
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
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
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
		
	submitData["name"] = $("#name").val();
	submitData["sex"] = $("#sex").val();
	submitData["age"] = $("#age").val();
	submitData["mobile"] = $("#mobile").val();
	submitData["realNameCard"] = $("#realNameCard").val();
	submitData["belongProject"] = $("#belongProject").val();
	submitData["belongMan"] = $("#belongMan").val();
	submitData["workType"] = $("#workType").val();
	submitData["isValid"] = $("#isValid").val();
	submitData["days"] = $("#days").val();
	submitData["hours"] = $("#hours").val();
	submitData["area"] = $("#area").val();
	submitData["teachLevel"] = $("#teachLevel").val();
	submitData["isProjectMan"] = $("#isProjectMan").val();
	submitData["birthday"] = $("#birthday").val();
	submitData["origin"] = $("#origin").val();
	submitData["validDate"] = $("#validDate").val();
	submitData["homeAddress"] = $("#homeAddress").val();
	submitData["isTeamLeader"] = $("#isTeamLeader").val();
	submitData["laborSubcontractors"] = $("#laborSubcontractors").val();
	submitData["emergencyContact"] = $("#emergencyContact").val();
	submitData["emergencyPhone"] = $("#emergencyPhone").val();
	submitData["dormitoryNumber"] = $("#dormitoryNumber").val();
	submitData["bedNumber"] = $("#bedNumber").val();
	submitData["cardNumber"] = $("#cardNumber").val();
	submitData["securityStatus"] = $("#securityStatus").val();
	submitData["configureType"] = $("#configureType").val();
	submitData["operateType"] = $("#operateType").val();
	submitData["role"] = $("#role").val();
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


