var g_params = null, g_backUrl = "", g_oldRegisterId = "", g_registerType = "";
var g_filePath = null, g_fileSize = 0;
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_caseSourceDict = "", g_caseProcedureDict = "", g_caseTypeDict = "";
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
var g_codeType = "1", g_codeCurNum = "";
var g_saveType = 1;		//1草稿 2提交

$(function () {
	//用于案件登记
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_oldRegisterId = $.utils.getUrlParam(window.location.search, "oldRegisterId");
	g_registerType = $.utils.getUrlParam(window.location.search, "registerType");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	//初始化字典
	initDict();
	initDistrict();
	initView();
	formValidate();
	top.app.message.loadingClose();
	
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
	g_caseProcedureDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_PROCEDURE');
	g_caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
}

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
	top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), '20,321', true);
	$('#areaProvince').prop('disabled', true);
	$('#areaCity').prop('disabled', true);
}

function initView(){
	//显示文书编号
	g_codeCurNum = rales.showCodeCurNum(g_codeType);
	
	$('#divDefendantDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divDefendantCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	top.app.addRadioButton($("#divCaseSource"), g_caseSourceDict, 'radioCaseSource');
	//top.app.addCheckBoxButton($("#divCaseSource"), g_caseSourceDict, 'checkboxCaseSource');
	top.app.addComboBoxOption($("#caseProcedure"), g_caseProcedureDict);
	top.app.addComboBoxOption($("#caseType"), g_caseTypeDict);
	
	//初始化文件选择器
	fileupload.initFileNewSelector('files');
	
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
	
	//选择第二承办人
	$("#undertaker").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择第二承办人', ['900px', '550px'], '/rales/ael/case/case-new-undertaker.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#undertaker").val(retParams[0].userNameList);
		});
    });

	//选择需要关联的文书
	$("#relevanceId").click(function () {
//		//设置参数
//		var params = {};
//		params.relevanceIdList = g_relevanceIdList;
//		params.relevanceCodeList = g_relevanceCodeList;
//		top.app.layer.editLayer('选择需要关联的日常巡查文书', ['700px', '550px'], '/rales/ael/case/case-routine-list.html', params, function(retParams){
//			if(retParams == null || retParams == undefined && retParams.length > 0) {
//				top.app.message.alert("获取返回内容失败！");
//				return;
//			}
//			g_relevanceIdList = retParams[0].relevanceIdList;
//			g_relevanceCodeList = retParams[0].relevanceCodeList;
//			$("#relevanceId").val(retParams[0].relevanceCodeList);
//		});
		//设置参数
		var params = {};
		params.registerId = g_oldRegisterId;
		params.relevanceIdList = g_relevanceIdList;
		params.relevanceCodeList = g_relevanceCodeList;
		top.app.layer.editLayer('选择需要关联的文书', ['700px', '550px'], '/rales/ael/case/case-writ-list.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_relevanceIdList = retParams[0].relevanceIdList;
			g_relevanceCodeList = retParams[0].relevanceCodeList;
			$("#relevanceId").val(retParams[0].relevanceCodeList);
		});
    });

	//保存为草稿
	$("#btnSaveAsDraft").click(function () {
		g_saveType = 1;
		$("form").submit();
    });
	//提交
	$("#btnOK").click(function () {
		g_saveType = 2;
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		if($.utils.isEmpty(g_oldRegisterId)) {
			if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.reportRow)){
				window.location.href = g_backUrl + "?_pid=" + pid;
			}else
				window.location.href = "case-new.html?_pid=" + pid;
		}else{
   			window.location.href = g_backUrl + "?_pid=" + pid;
		}
    });
	
	//填写日常巡查的快捷登记
	if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.routineRow)){
		$("#defendantName").val(g_params.routineRow.defendantName);
		$("#defendantAddress").val(g_params.routineRow.address);
		$("#defendantDate").val($.date.dateFormat(g_params.routineRow.checkDate, "yyyy-MM-dd"));
		$("#clueSummary").val(g_params.routineRow.clueSummary);
	}
	
	//填写微信案件登记的快捷登记
	if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.reportRow)){
//		$("#defendantName").val(g_params.reportRow.name);
		$("#reporterName").val(g_params.reportRow.name);
		$("#reporterContacts").val(g_params.reportRow.name);
		$("#reporterPhone").val(g_params.reportRow.contactPhone);
		$("#defendantAddress").val(g_params.reportRow.address);
		$("#defendantDate").val($.date.dateFormat(g_params.reportRow.reportDate, "yyyy-MM-dd"));
		$("#clueSummary").val(g_params.reportRow.content);
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
//        	reporterName: {required: true},
//        	reporterCertificateNo: {isIdCardNo: true},
//        	reporterCompany: {required: true},
        	reporterContacts: {required: true},
        	reporterZip: {isZipCode: true},
        	reporterPhone: {required: true, isMobile: true},
        	reporterAddress: {required: true},
//        	defendantName: {required: true},
//        	address: {required: true},
//        	occurrenceDate: {required: true},
//        	checkDate: {required: true},
        	clueSummary: {required: true},
        	caseVerification: {required: true},
        	advice: {required: true},
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
        	fileupload.uploadAction(null, false, true, "-1", function(){submitAction();});
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
//	if($.utils.isEmpty(g_userIdList)){
//		top.app.message.notice("请选择第二承办人！");
//		return;
//	}
//	if(g_userIdList == top.app.info.userInfo.userId){
//		top.app.message.notice("不能选择自己作为第二承办人！");
//		return;
//	}
	//定义提交数据
	var submitData = {};
	submitData["codeType"] = g_codeType;
	submitData["code"] = $('#tableTitleMark').text();
	submitData["codeCurNum"] = g_codeCurNum;
	submitData["isNormalCase"] = "1";
	submitData["sourceCase"] = $('#divCaseSource input:radio:checked').val();
	submitData["reporterName"] = $('#reporterName').val();
	submitData["reporterCertificateNo"] = $("#reporterCertificateNo").val();
	submitData["reporterCompany"] = $("#reporterCompany").val();
	submitData["reporterContacts"] = $("#reporterContacts").val();
	submitData["reporterZip"] = $("#reporterZip").val();
	submitData["reporterPhone"] = $("#reporterPhone").val();
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
	submitData["caseType"] = $("#caseType").val();
	submitData["associateExecutor"] = g_userIdList;
	submitData["relevanceId"] = g_relevanceIdList;
	submitData["relevanceName"] = g_relevanceCodeList;
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();
	
	//如果保存为草稿，流程进度为0（编辑）
	if(g_saveType == 1)submitData["flowProgress"] = "0";
	else submitData["flowProgress"] = "1";
	
	//判断是否是案件登记
	if(!$.utils.isEmpty(g_oldRegisterId)) {
		submitData["oldRegisterId"] = g_oldRegisterId;
		submitData["registerType"] = g_registerType;
	}

	//微信案件登记标识
	if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.reportRow)){
		submitData["webReportId"] = g_params.reportRow.id;
	}
	
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
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/startCaseFlow?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			if($.utils.isEmpty(g_oldRegisterId)) {
	   				if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.reportRow)){
	   					window.location.href = g_backUrl + "?_pid=" + pid;
	   				}else
	   					window.location.href = "case-new.html?_pid=" + pid;
	   			}else{
		   			window.location.href = g_backUrl + "?_pid=" + pid;
	   			}
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}