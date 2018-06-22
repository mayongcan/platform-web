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
		$('#time').val(g_params.rows.time);
		$('#alarmType').val(g_params.rows.alarmType);
		$('#liftingWeight').val(g_params.rows.liftingWeight);
		$('#safeLiftingWeight').val(g_params.rows.safeLiftingWeight);
		$('#torquePercentage').val(g_params.rows.torquePercentage);
		$('#windSpeed').val(g_params.rows.windSpeed);
		$('#amplitude').val(g_params.rows.amplitude);
		$('#rotation').val(g_params.rows.rotation);
		$('#height').val(g_params.rows.height);
		$('#tiltX').val(g_params.rows.tiltX);
		$('#tiltY').val(g_params.rows.tiltY);
		$('#magnification').val(g_params.rows.magnification);
		$('#violationType').val(g_params.rows.violationType);
		$('#towerCraneId').val(g_params.rows.towerCraneId);
		$('#floor').val(g_params.rows.floor);
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
		
	submitData["time"] = $("#time").val();
	submitData["alarmType"] = $("#alarmType").val();
	submitData["liftingWeight"] = $("#liftingWeight").val();
	submitData["safeLiftingWeight"] = $("#safeLiftingWeight").val();
	submitData["torquePercentage"] = $("#torquePercentage").val();
	submitData["windSpeed"] = $("#windSpeed").val();
	submitData["amplitude"] = $("#amplitude").val();
	submitData["rotation"] = $("#rotation").val();
	submitData["height"] = $("#height").val();
	submitData["tiltX"] = $("#tiltX").val();
	submitData["tiltY"] = $("#tiltY").val();
	submitData["magnification"] = $("#magnification").val();
	submitData["violationType"] = $("#violationType").val();
	submitData["towerCraneId"] = $("#towerCraneId").val();
	submitData["floor"] = $("#floor").val();
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


