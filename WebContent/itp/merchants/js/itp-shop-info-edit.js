var g_params = null, g_backUrl = "";
var g_logoPath = null;
var g_imagePath = null;
var g_lg = "", g_la = "";

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
	$('#divBusinessHoursBegin').datetimepicker({locale: 'zh-CN', format: 'HH:mm', allowInputToggle: true});
	$('#divBusinessHoursEnd').datetimepicker({locale: 'zh-CN', format: 'HH:mm', allowInputToggle: true});

	//选择经纬度
	$("#lgla").click(function () {
		//设置参数
		var params = {};
		params.longitude = g_lg;
		params.latitude = g_la;
		top.app.layer.editLayer('选择经纬度', ['900px', '550px'], '/itp/merchants/shop-lgla-select.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_lg = retParams[0].longitude;
			g_la = retParams[0].latitude;
			$("#lgla").val(g_lg + "," + g_la);
		});
    });
	
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params.parent;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

function initData(){
	if(g_params.type == 'edit'){
		$('#shopName').val(g_params.row.shopName);
		$("#shopPhone").val(g_params.row.shopPhone);
		$("#businessHoursBegin").val(g_params.row.businessHoursBegin);
		$("#businessHoursEnd").val(g_params.row.businessHoursEnd);
		g_lg = ($.utils.isNull(g_params.row.longitude)) ? "" : g_params.row.longitude;
		g_la = ($.utils.isNull(g_params.row.latitude)) ? "" : g_params.row.latitude;
		if(g_lg != '' && g_la != '') $("#lgla").val(g_lg + "," + g_la);
		$("#shopAddr").val(g_params.row.shopAddr);
		$("#shopDesc").val(g_params.row.shopDesc);
		$('#shopLogo').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
		$('#shopImage').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		$('#shopLogo').prettyFile({text:"请选择图片"});
		$('#shopImage').prettyFile({text:"请选择图片"});
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	shopName: {required: true},
//        	shopPhone: {required: true, isPhone: true},
        	businessHourBegin: {required: true},
        	businessHourEnd: {required: true},
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

	submitData["shopName"] = $('#shopName').val();
	submitData["shopPhone"] = $("#shopPhone").val();
	submitData["businessHoursBegin"] = $("#businessHoursBegin").val();
	submitData["businessHoursEnd"] = $("#businessHoursEnd").val();
	submitData["longitude"] = g_lg;
	submitData["latitude"] = g_la;
	submitData["shopAddr"] = $("#shopAddr").val();
	submitData["shopDesc"] = $("#shopDesc").val();
	submitData["merchantsId"] = g_params.merchantsId;
	
	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();

	if(g_logoPath != null && g_logoPath != undefined)
		submitData["shopLogo"] = g_logoPath;

	if(g_imagePath != null && g_imagePath != undefined)
		submitData["shopImage"] = g_imagePath;
	
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
	   			top.app.info.iframe.params = g_params.parent;
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
	if($("#shopLogo")[0].files[0] == null || $("#shopLogo")[0].files[0] == undefined){
		hasLogoImg = false;
		finishLogoImg = 1;
	}
	if($("#shopImage")[0].files[0] == null || $("#shopImage")[0].files[0] == undefined){
		hasImageImg = false;
		finishImageImg = 1;
	}
	//上传图片到资源服务器
	if(hasLogoImg){
		top.app.uploadImage($("#shopLogo")[0].files[0], function(data){
			g_logoPath = data;
			finishLogoImg = 1;
		});
	}
	if(hasImageImg){
		top.app.uploadMultiImage($("#shopImage")[0].files, function(data){
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