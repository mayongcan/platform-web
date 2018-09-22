var g_params = {}, g_backUrl = null;
var g_caseSourceDict = "", g_caseProcedureDict = "", g_caseTypeDict = "", g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
	rales.initFilesList(g_params.row.files);
	rales.initCodeRelevance(g_params.row.relevanceId);
});

/**
 * 初始化省市区
 */
function initDistrict(){
	$('#areaProvince').selectpicker({
		width: '192px'
	});
	$('#areaCity').selectpicker({
		width: '192px'
	});
	$('#areaDistrict').selectpicker({
		width: '192px'
	});
	top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_params.row.areaCode, false);
	$('#areaProvince').prop('disabled', true);
	$('#areaCity').prop('disabled', true);
}

function initView(){
	$('#tableTitleMark').text(g_params.row.code);
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CLUE');
	g_caseProcedureDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_PROCEDURE');
	g_caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	if(g_params.type == 2){
		initDistrict();
		$('#divDefendantDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
		$('#divDefendantCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
		top.app.addRadioButton($("#divCaseSource"), g_caseSourceDict, 'radioCaseSource', g_params.row.sourceCase);
		top.app.addComboBoxOption($("#caseProcedure"), g_caseProcedureDict);
		top.app.addComboBoxOption($("#caseType"), g_caseTypeDict);
		top.app.addComboBoxOption($("#reporterSex"), g_sexDict);
		
		$('#divAcceptanceDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
		$('#divFormDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date(),});
		//增加表单验证
		formValidate();

		// 不予立案
		$('#caseProcedure').on('changed.bs.select',
			function(e) {
				if ($('#caseProcedure').val() == '3') {
					$('#trNotPutOn').css("display", "");
				} else{
					$('#trNotPutOn').css("display", "none");
				}
			}
		);
		
		$('#reporterName').val(g_params.row.reporterName);
		$("#reporterCertificateNo").val(g_params.row.reporterCertificateNo);
		$("#reporterCompany").val(g_params.row.reporterCompany);
		$("#reporterContacts").val(g_params.row.reporterContacts);
		$("#reporterZip").val(g_params.row.reporterZip);
		$("#reporterPhone").val(g_params.row.reporterPhone);
		$("#reporterSex").val(g_params.row.defendantName);
		$("#reporterAge").val(g_params.row.reporterSex);
		$("#reporterAddress").val(g_params.row.reporterAge);
		$("#defendantName").val(g_params.row.defendantName);
		$("#defendantAddress").val(g_params.row.address);
		$("#defendantDate").val($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
		$("#defendantCheckDate").val($.date.dateFormat(g_params.row.checkDate, "yyyy-MM-dd"));
		$("#clueSummary").val(g_params.row.clueSummary);
		$("#caseVerification").val(g_params.row.caseVerification);
		$("#advice").val(g_params.row.advice);
		$("#memo").val(g_params.row.memo);
		$("#caseProcedure").val(g_params.row.caseProcedure);
		$("#notPutOn").val(g_params.row.notPutOn);
		$('#tdUndertaker').text($.utils.getNotNullVal(g_params.row.associateUserName));
		$("#caseType").val(g_params.row.caseType);
		$("#illegalAction").val(g_params.row.illegalAction);
	}else{
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#tdCaseSource').text(top.app.getDictName(g_params.row.sourceCase, g_caseSourceDict));
		$('#tdReporterName').text($.utils.getNotNullVal(g_params.row.reporterName));
		$('#tdReporterCertificateNo').text($.utils.getNotNullVal(g_params.row.reporterCertificateNo));
		$('#tdReporterCompany').text($.utils.getNotNullVal(g_params.row.reporterCompany));
		$('#tdReporterContacts').text($.utils.getNotNullVal(g_params.row.reporterContacts));
		$('#tdReporterAddress').text($.utils.getNotNullVal(g_params.row.reporterAddress));
		$('#tdReporterZip').text($.utils.getNotNullVal(g_params.row.reporterZip));
		$('#tdReporterSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.row.reporterSex, g_sexDict)));
		$('#tdReporterAge').text($.utils.getNotNullVal(g_params.row.reporterAge));
		$('#tdReporterPhone').text($.utils.getNotNullVal(g_params.row.reporterPhone));
		$('#tdDefendantName').text($.utils.getNotNullVal(g_params.row.defendantName));
		$('#tdAreaName').text($.utils.getNotNullVal(g_params.row.areaName));
		$('#tdDefendantAddress').text($.utils.getNotNullVal(g_params.row.address));
		$('#tdDefendantDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
		$('#tdDefendantCheckDate').text($.date.dateFormat(g_params.row.checkDate, "yyyy-MM-dd"));
		$('#tdCaseProcedure').text(top.app.getDictName(g_params.row.caseProcedure, g_caseProcedureDict));
		$('#tdNotPutOn').text($.utils.getNotNullVal(g_params.row.notPutOn));
		$('#tdUndertaker').text($.utils.getNotNullVal(g_params.row.associateUserName));
		$('#tdClueSummary').text($.utils.getNotNullVal(g_params.row.clueSummary));
		$('#tdCaseVerification').text($.utils.getNotNullVal(g_params.row.caseVerification));
		$('#tdAdvice').text($.utils.getNotNullVal(g_params.row.advice));
		$('#tdMemo').text($.utils.getNotNullVal(g_params.row.memo));
		$('#tdCaseType').text($.utils.getNotNullVal(top.app.getDictName(g_params.row.caseType, g_caseTypeDict)));
		$("#tdIllegalAction").text($.utils.getNotNullVal(g_params.row.illegalAction));
		$('#tdMemo').text($.utils.getNotNullVal(g_params.row.memo));
		$('#tdAdvice').text($.utils.getNotNullVal(g_params.row.advice));
		
		if($('#caseProcedure').val() == '3') $('#trNotPutOn').remove();
		
		//显示历史处理意见
		$('#trHistoryAuditList').css('display', '');
		getHistoryAuditList(g_params.row.id, "1");
	}

	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
////        	reporterName: {required: true},
////        	reporterCertificateNo: {isIdCardNo: true},
////        	reporterCompany: {required: true},
//        	reporterContacts: {required: true},
////        	reporterZip: {isZipCode: true},
////        	reporterPhone: {required: true, isMobile: true},
//        	reporterAddress: {required: true},
////        	defendantName: {required: true},
////        	address: {required: true},
////        	occurrenceDate: {required: true},
////        	checkDate: {required: true},
//        	clueSummary: {required: true},
//        	caseVerification: {required: true},
//        	advice: {required: true},
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
	if($('#divCaseSource input:radio:checked').val() == undefined){
		top.app.message.notice("请选择案件来源！");
		return;
	}
	if($('#areaDistrict').val() == ''){
		top.app.message.notice("请选择案发市辖区！");
		return;
	}
	if ($('#caseProcedure').val() == '3' && $("#notPutOn").val() == '') {
		top.app.message.notice("请输入不予立案原因！");
		return;
	} 
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_params.row.id;
	submitData["sourceCase"] = $('#divCaseSource input:radio:checked').val();
	submitData["reporterName"] = $('#reporterName').val();
	submitData["reporterCertificateNo"] = $("#reporterCertificateNo").val();
	submitData["reporterCompany"] = $("#reporterCompany").val();
	submitData["reporterContacts"] = $("#reporterContacts").val();
	submitData["reporterZip"] = $("#reporterZip").val();
	submitData["reporterPhone"] = $("#reporterPhone").val();
	submitData["reporterSex"] = $("#reporterSex").val();
	submitData["reporterAge"] = $("#reporterAge").val();
	submitData["reporterAddress"] = $("#reporterAddress").val();
	submitData["defendantName"] = $("#defendantName").val();
	submitData["address"] = $("#defendantAddress").val();
	submitData["occurrenceDate"] = $("#defendantDate").val();
	submitData["checkDate"] = $("#defendantCheckDate").val();
	submitData["clueSummary"] = $("#clueSummary").val();
	submitData["caseVerification"] = $("#caseVerification").val();
	submitData["advice"] = $("#advice").val();
	submitData["memo"] = $("#memo").val();
	submitData["caseProcedure"] = $("#caseProcedure").val();
	submitData["notPutOn"] = $("#notPutOn").val();
	submitData["illegalAction"] = $("#illegalAction").val();
	
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
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/editCase?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			//更新缓冲数据
	   			g_params.row.sourceCase = $('#divCaseSource input:radio:checked').val();
	   			g_params.row.reporterName = $('#reporterName').val();
	   			g_params.row.reporterCertificateNo = $("#reporterCertificateNo").val();
	   			g_params.row.reporterCompany = $("#reporterCompany").val();
	   			g_params.row.reporterContacts = $("#reporterContacts").val();
	   			g_params.row.reporterZip = $("#reporterZip").val();
	   			g_params.row.reporterPhone = $("#reporterPhone").val();
	   			g_params.row.reporterAddress = $("#reporterAddress").val();
	   			g_params.row.defendantName = $("#defendantName").val();
	   			g_params.row.address = $("#defendantAddress").val();
	   			g_params.row.occurrenceDate = $("#defendantDate").val();
	   			g_params.row.checkDate = $("#defendantCheckDate").val();
	   			g_params.row.clueSummary = $("#clueSummary").val();
	   			g_params.row.caseVerification = $("#caseVerification").val();
	   			g_params.row.advice = $("#advice").val();
	   			g_params.row.memo = $("#memo").val();
	   			g_params.row.caseProcedure = $("#caseProcedure").val();
	   			g_params.row.notPutOn = $("#notPutOn").val();
				top.app.info.iframe.params = g_params;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
