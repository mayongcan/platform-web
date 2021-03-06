var g_params = {}, g_backUrl = null, g_counterpartType = "1";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	//获取历史审批意见
	getResultList();
	initView();
	initData();
	initOtherInfo();
});


function initView(){
	//提交
	$("#btnOK").click(function () {
		if($('#result').val() == ''){
   			top.app.message.notice("请填写审批意见！");
			return;
		}
		var submitData = {};
		submitData["taskId"] = g_params.row.taskId;
		submitData["processInstanceId"] = g_params.row.processInstanceId;
		submitData["processDefinitionId"] = g_params.row.processDefinitionId;
		submitData["registerId"] = g_params.row.id;
		submitData["counterpartType"] = g_counterpartType;
		submitData["activityName"] = g_params.row.activityName;
		submitData["result"] = $('#result').val();
		
		if(g_params.row.activityName == '部门领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '单位领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			submitData["needLawOfficeAudit"] = $('#divNeedLawOfficeAudit input:radio:checked').val();
			//案件登记，提前结束流程，更新流程进度]
			if($("#auditStatus").val() == '10'){
				submitData["isRegister"] = '1';
				//如果案件处理程序caseProcedure!=1 则进入结案报告
				if(g_params.row.caseProcedure == '1')
					submitData["flowProgress"] = '2';
				else
					submitData["flowProgress"] = '5';
			}
		}else if(g_params.row.activityName == '法规处领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '委领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			if($("#auditStatus").val() == '10'){
				//如果案件处理程序caseProcedure!=1 则进入结案报告
				if(g_params.row.caseProcedure == '1')
					submitData["flowProgress"] = '2';
				else
					submitData["flowProgress"] = '5';
			}
		}else if(g_params.row.activityName == '法规处指派'){
			if(g_userIdList == '' && $("#auditStatus").val() == '10'){
				top.app.message.notice("请选择指派人员！");
				return;
			}
			submitData["auditStatus"] = $("#auditStatus").val();
			submitData["assignHandleUser"] = g_userIdList;
		}else{
			//设置进入子流程的时候，设置流程启动人
			submitData["setApplyUser"] = "1";
		}
		
		//用于处理非必要流程
		if(!$.utils.isEmpty(g_params.row.subFlowProgress)){
			submitData["subFlowProgress"] = g_params.row.subFlowProgress;
			submitData["otherFlowId"] = g_params.row.otherFlowId;
		}
		//设置案件处理程序默认为1
		submitData["inquiryReportProcedure"] = "1";

		top.app.message.loading();
		//异步处理
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/case/caseAudit?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data:JSON.stringify(submitData),
			contentType: "application/json",
		    dataType: "json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
					//关闭页面前设置结果
					parent.app.layer.editLayerRet = true;
		   			top.app.message.notice("数据提交成功！");
		   			editListWrit(g_params.row.id);
		   			//top.app.info.iframe.params = g_params;
		   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
		   			window.location.href = "/rales/ael/case/case-todo.html?_pid=" + pid;
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
    });
}

function initData(){
	if($.utils.isNull(g_params.caseSourceDict)) g_params.caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
	if($.utils.isNull(g_params.caseTypeDict)) g_params.caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
	
	$('#tableTitleMark').text(g_params.row.code);
	$('#tdCaseSource').text(top.app.getDictName(g_params.row.sourceCase, g_params.caseSourceDict));
	$('#tdReporterName').text(g_params.row.reporterName);
	$('#tdReporterCertificateNo').text(g_params.row.reporterCertificateNo);
	$('#tdReporterCompany').text(g_params.row.reporterCompany);
	$('#tdReportContacts').text(g_params.row.reporterContacts);
	$('#tdReporterAddress').text(g_params.row.reporterAddress);
	$('#tdReporterZip').text(g_params.row.reporterZip);
	$('#tdReporterPhone').text(g_params.row.reporterPhone);
	$('#tdDefendantName').text(g_params.row.defendantName);
	$('#tdDefendantAreaName').text(g_params.row.areaName);
	$('#tdDefendantAddress').text(g_params.row.address);
	$('#tdDefendantDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#tdDefendantCheckDate').text($.date.dateFormat(g_params.row.checkDate, "yyyy-MM-dd"));
	$('#tdClueSummary').text(g_params.row.clueSummary);
	$('#tdCaseVerification').text(g_params.row.caseVerification);
	$('#tdCaseType').text($.utils.getNotNullVal(top.app.getDictName(g_params.row.caseType, g_params.caseTypeDict)));
	
	rales.initFilesList(g_params.row.files);
	rales.initCodeRelevance(g_params.row.relevanceId);
	
}