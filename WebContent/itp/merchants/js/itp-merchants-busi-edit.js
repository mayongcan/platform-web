var g_params = {}, g_iframeIndex = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '200px'
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
	top.app.addComboBoxOption($("#cycleValue"), g_params.cycleValueDict);
	top.app.addComboBoxOption($("#busiCode"), g_params.busiCodeDict);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#cycleValue').val(g_params.rows.cycleValue);
		$('#busiCode').val(g_params.rows.busiCode);
		$('#futureRateType').val(g_params.rows.futureRateType);
		$('#futureRateValue').val(g_params.rows.futureRateValue);
		$('#futureMinAmount').val(g_params.rows.futureMinAmount);
		$('#futureMaxAmount').val(g_params.rows.futureMaxAmount);
		$('#attachRateType').val(g_params.rows.attachRateType);
		$('#attachRateValue').val(g_params.rows.attachRateValue);
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
        	futureRateValue: {required: true, number: true, minNumber4: true},
        	futureMinAmount: {required: true, number: true, minNumber: true},
        	futureMaxAmount: {required: true, number: true, minNumber: true},
        	attachRateValue: {required: true, number: true, minNumber4: true},
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

	submitData["merchantsId"] = g_params.merchantsId;
	submitData["infMerchantsId"] = g_params.infMerchantsId;
	submitData["cycleValue"] = $("#cycleValue").val();
	submitData["busiCode"] = $("#busiCode").val();
	submitData["futureRateType"] = $("#futureRateType").val();
	submitData["futureRateValue"] = $("#futureRateValue").val();
	submitData["futureMinAmount"] = $("#futureMinAmount").val();
	submitData["futureMaxAmount"] = $("#futureMaxAmount").val();
	submitData["attachRateType"] = $("#attachRateType").val();
	submitData["attachRateValue"] = $("#attachRateValue").val();
	top.app.message.loading();
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


