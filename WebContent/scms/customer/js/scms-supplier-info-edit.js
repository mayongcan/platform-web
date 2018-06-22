var g_params = null, g_backUrl = "";
var g_imagePath = null, g_supplierBalance = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initDistrict();
	initView();
	initData();
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
	g_supplierBalance = new Cleave('#supplierBalance', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
}

function initData(){
	if(g_params.type == 'edit'){
		$('#supplierName').val(g_params.row.supplierName);
		$("#supplierAdmin").val(g_params.row.supplierAdmin);
		$("#supplierPhone").val(g_params.row.supplierPhone);
		$("#supplierBalance").val(g_params.row.supplierBalance);
		$("#supplierEmail").val(g_params.row.supplierEmail);
		$("#supplierZip").val(g_params.row.supplierZip);
		$("#supplierAddr").val(g_params.row.supplierAddr);
		$("#webSite").val(g_params.row.webSite);
		$("#bankName1").val(g_params.row.bankName1);
		$("#bankCard1").val(g_params.row.bankCard1);
		$("#bankName2").val(g_params.row.bankName2);
		$("#bankCard2").val(g_params.row.bankCard2);
		$("#supplierMemo").val(g_params.row.supplierMemo);

		$('#supplierPhoto').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#supplierPhoto').prettyFile({text:"请选择图片"});
		//如果是编辑，则不能修改客户余额
		$('#trSupplierBalance').css('display', '');
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	supplierName: {required: true},
        	supplierAdmin: {required: true},
        	supplierPhone: {required: true, isMobile: true},
        	supplierEmail: {email:true},
        	supplierZip: {isZipCode:true},
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
		submitData["supplierBalance"] = g_supplierBalance.getRawValue();
	}

	submitData["merchantsId"] = merchantsId;
	submitData["supplierName"] = $('#supplierName').val();
	submitData["supplierAdmin"] = $('#supplierAdmin').val();
	submitData["supplierPhone"] = $("#supplierPhone").val();
	submitData["supplierEmail"] = $("#supplierEmail").val();
	submitData["supplierZip"] = $("#supplierZip").val();
	submitData["supplierAddr"] = $("#supplierAddr").val();
	submitData["supplierMemo"] = $("#supplierMemo").val();
	submitData["webSite"] = $("#webSite").val();
	submitData["bankName1"] = $("#bankName1").val();
	submitData["bankCard1"] = $("#bankCard1").val();
	submitData["bankName2"] = $("#bankName2").val();
	submitData["bankCard2"] = $("#bankCard2").val();
	
	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();

	if(g_imagePath != null && g_imagePath != undefined)
		submitData["supplierPhoto"] = g_imagePath;
	
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
	if($("#supplierPhoto")[0].files[0] == null || $("#supplierPhoto")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#supplierPhoto")[0].files[0], function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}