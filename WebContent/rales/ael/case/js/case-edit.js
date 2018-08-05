var g_params = null, g_backUrl = "";
var g_filePath = null, g_fileSize = 0;
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_caseSourceDict = "", g_caseProcedureDict = "";
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
var g_saveType = 1;		//1草稿 2提交

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
	g_caseProcedureDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_PROCEDURE');
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
	$('#areaProvince').selectpicker({
		width: '192px'
	});
	$('#areaCity').selectpicker({
		width: '192px'
	});
	$('#areaDistrict').selectpicker({
		width: '192px'
	});
	top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_params.row.areaCode, true);
	$('#areaProvince').prop('disabled', true);
	$('#areaCity').prop('disabled', true);
}

function initView(){
	$('#divDefendantDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divDefendantCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	top.app.addRadioButton($("#divCaseSource"), g_caseSourceDict, 'radioCaseSource');
	top.app.addComboBoxOption($("#caseProcedure"), g_caseProcedureDict);
	
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
		//设置参数
		var params = {};
		params.relevanceIdList = g_relevanceIdList;
		params.relevanceCodeList = g_relevanceCodeList;
		top.app.layer.editLayer('选择需要关联的日常巡查文书', ['700px', '550px'], '/rales/ael/case/case-routine-list.html', params, function(retParams){
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
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

function initData(){
	$('#tableTitleMark').text(g_params.row.code);
	$('#divDefendantDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divDefendantCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	top.app.addRadioButton($("#divCaseSource"), g_caseSourceDict, 'radioCaseSource', g_params.row.sourceCase);
	top.app.addComboBoxOption($("#caseProcedure"), g_caseProcedureDict);

	g_relevanceIdList = g_params.row.relevanceId;
	g_relevanceCodeList = g_params.row.relevanceName;
	$("#relevanceId").val(g_relevanceCodeList);
	//初始化文件选择器
	fileupload.initFileEditSelector('files', g_params.row.files);
	
	$('#divAcceptanceDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divFormDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date(),});
	$('#reporterName').val(g_params.row.reporterName);
	$("#reporterCertificateNo").val(g_params.row.reporterCertificateNo);
	$("#reporterCompany").val(g_params.row.reporterCompany);
	$("#reporterContacts").val(g_params.row.reporterContacts);
	$("#reporterZip").val(g_params.row.reporterZip);
	$("#reporterPhone").val(g_params.row.reporterPhone);
	$("#reporterAddress").val(g_params.row.reporterAddress);
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

	g_userIdList = g_params.row.associateExecutor;
	g_userNameList = g_params.row.associateUserName;
	$("#undertaker").val(g_userNameList);
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	reporterName: {required: true},
        	reporterCertificateNo: {required: true, isIdCardNo: true},
        	reporterCompany: {required: true},
        	reporterContacts: {required: true},
        	reporterZip: {isZipCode: true},
        	reporterPhone: {required: true, isMobile: true},
        	reporterAddress: {required: true},
        	defendantName: {required: true},
        	address: {required: true},
        	occurrenceDate: {required: true},
        	checkDate: {required: true},
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
	submitData["id"] = g_params.row.id;
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
	submitData["associateExecutor"] = g_userIdList;
	submitData["relevanceId"] = g_relevanceIdList;
	submitData["relevanceName"] = g_relevanceCodeList;
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();
	
	//如果保存为草稿，流程进度为0（编辑）
	if(g_saveType == 1)submitData["flowProgress"] = "0";
	else submitData["flowProgress"] = "1";
	
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
			if(top.app.message.code.success == data.RetCode){
				//判断是不是提交
				if(g_saveType == 2){
					submitAudit();
				}else{
					top.app.message.loadingClose();
		   			top.app.message.notice("数据保存成功！");
		   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
		   			window.location.href = g_backUrl + "?_pid=" + pid;
				}
	   		}else{
				top.app.message.loadingClose();
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

//提交审批
function submitAudit(){
	var submitData = {};
	submitData["taskId"] = g_params.row.taskId;
	submitData["processInstanceId"] = g_params.row.processInstanceId;
	submitData["processDefinitionId"] = g_params.row.processDefinitionId;
	submitData["registerId"] = g_params.row.id;
	//提交审批
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/caseFlowNext?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据提交成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}