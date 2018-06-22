var g_merchantsInfo = null;

$(function () {
	top.app.message.loading();
	//获取商户信息
	g_merchantsInfo = scms.getMerchantsInfo();
	initDistrict();
	initData();
	initView();
	formValidate();
	top.app.message.loadingClose();
});

/**
 * 初始化省市区
 */
function initDistrict(){
	var width = ($(window).width() - 260) / 3;
	$('#areaProvince').selectpicker({
		width: width + 'px'
	});
	$('#areaCity').selectpicker({
		width: width + 'px'
	});
	$('#areaDistrict').selectpicker({
		width: width + 'px'
	});
	top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_merchantsInfo.areaCode, true);
}

function initView(){
	$('#divStartDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
}

function initData(){
	$('#merchantsName').val(g_merchantsInfo.merchantsName);
	$("#bussScope").val(g_merchantsInfo.bussScope);
	$("#startDate").val(g_merchantsInfo.startDate);
	$("#phone").val(g_merchantsInfo.phone);
	$("#addr").val(g_merchantsInfo.addr);
	$("#merchantsMemo").val(g_merchantsInfo.merchantsMemo);
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	merchantsName: {required: true},
        	phone: {required: true, isMobile: true},
        	addr: {required: true},
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
 * @returns
 */
function submitAction(){
	if($('#areaDistrict').val() == ''){
		top.app.message.notice("请选择所属区域！");
		return;
	}
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_merchantsInfo.id;
	submitData["merchantsName"] = $('#merchantsName').val();
	submitData["bussScope"] = $("#bussScope").val();
	submitData["startDate"] = $("#startDate").val();
	submitData["phone"] = $("#phone").val();
	submitData["addr"] = $("#addr").val();
	submitData["merchantsMemo"] = $("#merchantsMemo").val();
	
	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();
	
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/editMerchantsInfo?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			//更新缓存
	   			top.app.info.extraInfo.merchantsInfo.merchantsName = submitData.merchantsName;
	   			top.app.info.extraInfo.merchantsInfo.bussScope = submitData.bussScope;
	   			top.app.info.extraInfo.merchantsInfo.startDate = submitData.startDate;
	   			top.app.info.extraInfo.merchantsInfo.phone = submitData.phone;
	   			top.app.info.extraInfo.merchantsInfo.addr = submitData.addr;
	   			top.app.info.extraInfo.merchantsInfo.merchantsMemo = submitData.merchantsMemo;
	   			top.app.info.extraInfo.merchantsInfo.areaCode = submitData.areaCode;
	   			top.app.info.extraInfo.merchantsInfo.areaName = submitData.areaName;
	   			//刷新当前页面
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = "my-merchants-info?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
