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
		$('#recordNumber').val(g_params.rows.recordNumber);
		$('#recordStatus').val(g_params.rows.recordStatus);
		$('#installDate').val(g_params.rows.installDate);
		$('#manufacturer').val(g_params.rows.manufacturer);
		$('#leasingCompany').val(g_params.rows.leasingCompany);
		$('#longitude').val(g_params.rows.longitude);
		$('#latitude').val(g_params.rows.latitude);
		$('#maxHeight').val(g_params.rows.maxHeight);
		$('#maxFloor').val(g_params.rows.maxFloor);
		$('#minFloor').val(g_params.rows.minFloor);
		$('#blackBoxNumber').val(g_params.rows.blackBoxNumber);
		$('#isValid').val(g_params.rows.isValid);
		$('#driverId').val(g_params.rows.driverId);
		
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
	submitData["recordNumber"] = $("#recordNumber").val();
	submitData["recordStatus"] = $("#recordStatus").val();
	submitData["installDate"] = $("#installDate").val();
	submitData["manufacturer"] = $("#manufacturer").val();
	submitData["leasingCompany"] = $("#leasingCompany").val();
	submitData["longitude"] = $("#longitude").val();
	submitData["latitude"] = $("#latitude").val();
	submitData["maxHeight"] = $("#maxHeight").val();
	submitData["maxFloor"] = $("#maxFloor").val();
	submitData["minFloor"] = $("#minFloor").val();
	submitData["blackBoxNumber"] = $("#blackBoxNumber").val();
	submitData["isValid"] = $("#isValid").val();
	submitData["driverId"] = $("#driverId").val();
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


