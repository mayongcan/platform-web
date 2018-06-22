var g_params = null, g_backUrl = "";
var g_imagePath = null, g_customerBalance = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
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
	var width = ($(window).width() - 250) / 3;
	$('#areaProvince').selectpicker({
		width: width + 'px'
	});
	$('#areaCity').selectpicker({
		width: width + 'px'
	});
	$('#areaDistrict').selectpicker({
		width: width + 'px'
	});
	if(g_params.type == 'edit')
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_params.row.areaCode, true);
	else
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), "20", true);
}

function initView(){
	//客户类型
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerTypeList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#typeId').empty();
					for(var i = 0; i < data.rows.length; i++){
						$('#typeId').append('<option value="' + data.rows[i].id + '">' + data.rows[i].typeName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
	//客户等级
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerLevelList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#levelId').empty();
					for(var i = 0; i < data.rows.length; i++){
						$('#levelId').append('<option value="' + data.rows[i].id + '">' + data.rows[i].levelName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });

	//格式化金额输入框
	g_customerBalance = new Cleave('#customerBalance', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
}

function initData(){
	if(g_params.type == 'edit'){
		$('#customerName').val(g_params.row.customerName);
		$("#customerPhone").val(g_params.row.customerPhone);
		$("#typeId").val(g_params.row.typeId);
		$("#levelId").val(g_params.row.levelId);
		$("#customerBalance").val(g_params.row.customerBalance);
		$("#customerEmail").val(g_params.row.customerEmail);
		$("#customerZip").val(g_params.row.customerZip);
		$("#customerAddr").val(g_params.row.customerAddr);
		$("#customerMemo").val(g_params.row.customerMemo);

		$('#customerPhoto').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#customerPhoto').prettyFile({text:"请选择图片"});
		//如果是编辑，则不能修改客户余额
		$('#trCustomerBalance').css('display', '');
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	customerName: {required: true},
        	customerPhone: {required: true, isMobile: true},
        	customerEmail: {email:true},
        	customerZip: {isZipCode:true},
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
        	ajaxUploadImage()
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
	var merchantsId = scms.getUserMerchantsId()
	if($.utils.isEmpty(merchantsId)){
		top.app.message.noticeError("您没有绑定商户，不能进行当前操作！");
		return;
	}
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.row.id;
	else{
		submitData["customerBalance"] = g_customerBalance.getRawValue();
	}

	submitData["merchantsId"] = merchantsId;
	submitData["customerName"] = $('#customerName').val();
	submitData["customerPhone"] = $("#customerPhone").val();
	submitData["typeId"] = $("#typeId").val();
	submitData["levelId"] = $("#levelId").val();
	submitData["customerEmail"] = $("#customerEmail").val();
	submitData["customerZip"] = $("#customerZip").val();
	submitData["customerAddr"] = $("#customerAddr").val();
	submitData["customerMemo"] = $("#customerMemo").val();
	
	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();

	if(g_imagePath != null && g_imagePath != undefined)
		submitData["customerPhoto"] = g_imagePath;
	
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


function ajaxUploadImage(){
	if($("#customerPhoto")[0].files[0] == null || $("#customerPhoto")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#customerPhoto")[0].files[0], function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}