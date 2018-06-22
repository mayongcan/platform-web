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
	g_bankCodeDict = top.app.getDictDataByDictTypeValue('ITP_BANK_CODE');
	//初始化界面
	initDistrict();
	initView();
}

/**
 * 初始化省市区
 */
function initDistrict(){
	var width = 185;
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
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_params.rows.areaCode, true);
	else
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), "20", true);
}

/**
 * 初始化界面
 */
function initView(){
	top.app.addComboBoxOption($("#bankCode"), g_bankCodeDict);
	top.app.addComboBoxOption($("#certCode"), g_params.certCodeDict);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#name').val(g_params.rows.name);
		$('#mobileNo').val(g_params.rows.mobileNo);
		$('#bankCode').val(g_params.rows.bankCode);
		$('#bankaccProp').val(g_params.rows.bankaccProp);
		$('#bankaccountNo').val(g_params.rows.bankaccountNo);
		$('#bankaccountType1').val(g_params.rows.bankaccountType);
		$('#bankaccountType2').val(g_params.rows.bankaccountType);
		$('#certCode').val(g_params.rows.certCode);
		$('#certNo').val(g_params.rows.certNo);
		$('#bankBranchName').val(g_params.rows.bankBranchName);
		$('#defaultAcc').val(g_params.rows.defaultAcc);
	}else{
	}
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');

	// 权限类型下拉框变更事件
	$('#bankaccProp').on('changed.bs.select',
		function(e) {
			if ($('#bankaccProp').val() == '0') {
				$('#divBankaccountType1').css("display", "");
				$('#divBankaccountType2').css("display", "none");
			} else if ($('#bankaccProp').val() == '1') {
				$('#divBankaccountType1').css("display", "none");
				$('#divBankaccountType2').css("display", "");
			}
		}
	);
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	name: {required: true},
        	mobileNo: {required: true, isMobile: true},
        	bankaccountNo: {required: true},
        	certNo: {required: true},
        	bankBranchName: {required: true},
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
	if($('#areaDistrict').val() == ''){
		top.app.message.notice("请选择银行卡所属区域！");
		return;
	}
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
		
	submitData["merchantsId"] = g_params.merchantsId;
	submitData["infMerchantsId"] = g_params.infMerchantsId;
	submitData["name"] = $("#name").val();
	submitData["mobileNo"] = $("#mobileNo").val();
	submitData["bankCode"] = $("#bankCode").val();
	submitData["bankaccProp"] = $("#bankaccProp").val();
	submitData["bankaccountNo"] = $("#bankaccountNo").val();
	if($("#bankaccProp").val() == '0') submitData["bankaccountType"] = "1";
	else submitData["bankaccountType"] = $("#bankaccountType2").val();
	submitData["certCode"] = $("#certCode").val();
	submitData["certNo"] = $("#certNo").val();
	submitData["bankBranchName"] = $("#bankBranchName").val();
	submitData["defaultAcc"] = $("#defaultAcc").val();

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


