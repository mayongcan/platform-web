var g_params = null, g_backUrl = "";
var g_logoPath = null;
var g_imagePath = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	g_bankCodeDict = top.app.getDictDataByDictTypeValue('ITP_BANK_CODE');
	g_categoryDict = top.app.getDictDataByDictTypeValue('ITP_MERCHANTS_CATEGORY');
	initDistrict();
	initData();
	initView();
	formValidate();
	top.app.message.loadingClose();
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
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
	top.app.addComboBoxOption($("#bankCode"), g_bankCodeDict);
	top.app.addComboBoxOption($("#categoryId"), g_categoryDict);
	$('#divStartDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

function initData(){
	if(g_params.type == 'edit'){
		$('#merchantsName').val(g_params.row.merchantsName);
		$('#shortName').val(g_params.row.shortName);
		$("#phone").val(g_params.row.phone);
		$("#addr").val(g_params.row.addr);
		$("#categoryId").val(g_params.row.categoryId);
		$("#orgCode").val(g_params.row.orgCode);
		$("input[name=radioMerchantsType][value=" + g_params.row.merchantsType + "]").attr("checked",true);
		$("#corpmanName").val(g_params.row.corpmanName);
		$("#corpmanId").val(g_params.row.corpmanId);
		$("#corpmanPhone").val(g_params.row.corpmanPhone);
		$("#corpmanMobile").val(g_params.row.corpmanMobile);
		$("#corpmanEmail").val(g_params.row.corpmanEmail);
		$("#bankCode").val(g_params.row.bankCode);
//		$("#bankName").val(g_params.row.bankName);
		$("#bankaccountNo").val(g_params.row.bankaccountNo);
		$("#bankaccountName").val(g_params.row.bankaccountName);
		$("input[name=radioAutoCus][value=" + g_params.row.autoCus + "]").attr("checked",true);
		
		$("#startDate").val(g_params.row.startDate);
		$("#merchantsMemo").val(g_params.row.merchantsMemo);
		$('#merchantsLogo').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
		$('#merchantsImage').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#merchantsLogo').prettyFile({text:"请选择图片"});
		$('#merchantsImage').prettyFile({text:"请选择图片"});
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	merchantsName: {required: true},
        	shortName: {required: true, maxlength: 20},
//        	phone: {required: true, isPhone: true},
        	addr: {required: true},
        	corpmanName: {required: true},
        	corpmanId: {required: true},
        	corpmanPhone: {required: true, isPhone: true},
        	corpmanMobile: {required: true, isMobile: true},
        	corpmanEmail: {required: true},
//        	bankName: {required: true},
        	bankaccountNo: {required: true},
        	bankaccountName: {required: true},
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
        	ajaxUpload();
        }
    });
}

/**
 * 提交数据
 * @returns
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.row.id;
		
	submitData["merchantsName"] = $('#merchantsName').val();
	submitData["shortName"] = $("#shortName").val();
	submitData["phone"] = $("#phone").val();
	submitData["addr"] = $("#addr").val();
	submitData["orgCode"] = $("#orgCode").val();
	submitData["merchantsType"] = $('#divMerchantsType input:radio:checked').val();
	submitData["categoryId"] = $("#categoryId").val();
	submitData["categoryName"] = $("#categoryId").find("option:selected").text();
	submitData["corpmanName"] = $("#corpmanName").val();
	submitData["corpmanId"] = $("#corpmanId").val();
	submitData["corpmanPhone"] = $("#corpmanPhone").val();
	submitData["corpmanMobile"] = $("#corpmanMobile").val();
	submitData["corpmanEmail"] = $("#corpmanEmail").val();
	submitData["bankCode"] = $("#bankCode").val();
	submitData["bankName"] = $("#bankCode").find("option:selected").text(); //$("#bankName").val();
	submitData["bankaccountNo"] = $("#bankaccountNo").val();
	submitData["bankaccountName"] = $("#bankaccountName").val();
	submitData["autoCus"] = $('#divAutoCus input:radio:checked').val();
	
	submitData["startDate"] = $("#startDate").val();
	submitData["merchantsMemo"] = $("#merchantsMemo").val();
	
	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();

	if(g_logoPath != null && g_logoPath != undefined)
		submitData["merchantsLogo"] = g_logoPath;

	if(g_imagePath != null && g_imagePath != undefined)
		submitData["merchantsImage"] = g_imagePath;
	
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

/**
 * 上传图片
 * @returns
 */
function ajaxUpload(){
	var hasLogoImg = true, hasImageImg = true;
	var finishLogoImg = 0, finishImageImg = 0;
	if($("#merchantsLogo")[0].files[0] == null || $("#merchantsLogo")[0].files[0] == undefined){
		hasLogoImg = false;
		finishLogoImg = 1;
	}
	if($("#merchantsImage")[0].files[0] == null || $("#merchantsImage")[0].files[0] == undefined){
		hasImageImg = false;
		finishImageImg = 1;
	}
	//上传图片到资源服务器
	if(hasLogoImg){
		top.app.uploadImage($("#merchantsLogo")[0].files[0], function(data){
			g_logoPath = data;
			finishLogoImg = 1;
		});
	}
	if(hasImageImg){
		top.app.uploadMultiImage($("#merchantsImage")[0].files, function(data){
			g_imagePath = data;
			finishImageImg = 1;
		});
	}
	top.app.message.loading();
	//使用定时器判断是否已上传结束
	$('#onTime').timer({
	    duration: '1s',
	    callback: function() {
	    	if(finishLogoImg == 1 && finishImageImg == 1){
	    		$("#onTime").timer('pause');
	    		submitAction();
	    	}
	    },
	    repeat: true //重复调用
	});
	
}