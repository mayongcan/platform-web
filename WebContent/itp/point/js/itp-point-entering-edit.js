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
		width: '550px'
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
	$('#divPayDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	//获取积分源列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/point/getPointKeyVal",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0) {
					top.app.addComboBoxOption($("#pointId"), data.RetData, true);
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});

	//获取列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/merchants/getMerchantsKeyVal",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			tenantsId: top.app.info.userInfo.tenantsId,
			userType: '2',
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0) {
					top.app.addComboBoxOption($("#merchantsId"), data.RetData, true);
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#pointId').val(g_params.rows.pointId);
		$('#merchantsId').val(g_params.rows.merchantsId);
		$('#payAmount').val(g_params.rows.payAmount);
		$('#payDate').val(g_params.rows.payDate);
		
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
        	payAmount: {required: true, money: true},
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
		
	submitData["pointId"] = $("#pointId").val();
	submitData["merchantsId"] = $("#merchantsId").val();
	submitData["payAmount"] = $("#payAmount").val();
	submitData["payDate"] = $("#payDate").val();
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


