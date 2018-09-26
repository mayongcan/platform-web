var g_params = {}, g_backUrl = null, g_counterpartType = "4";
//var g_auditStatusDict1 = [], g_auditStatusDict2 = [], g_auditStatusDict3 = [], g_auditStatusDict4 = [];

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
		submitData["result"] = $('#result').val();
		
		if(g_params.row.activityName == '部门领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '单位领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			submitData["needLawOfficeAudit"] = $('#divNeedLawOfficeAudit input:radio:checked').val();
			submitData["isRegister"] = '0';
		}else if(g_params.row.activityName == '法规处领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '委领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			if($("#auditStatus").val() == '10')
				submitData["flowProgress"] = '5';
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
	var dataInfo = rales.getWritContent(g_params.row.id, rales.writNecessity4_1, "");
	$('#tableTitleMark').text(dataInfo.code);
	if(!$.utils.isNull(dataInfo.content)){
		var g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
		//转换json
		dataInfo.content  = eval("(" + dataInfo.content  + ")");
		if(dataInfo.content .personType == '1') $("#personType1").attr("checked",true);
		else $("#personType2").attr("checked",true);

		$('#tdPartiesName').text($.utils.getNotNullVal(dataInfo.content .partiesName));
		$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(dataInfo.content .partiesSex, g_sexDict)));
		$('#tdPartiesAge').text($.utils.getNotNullVal(dataInfo.content .partiesAge));
		$('#tdPartiesAddr').text($.utils.getNotNullVal(dataInfo.content .partiesAddr));
		$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(dataInfo.content .partiesCertificateNo));
		$('#tdPartiesPhone').text($.utils.getNotNullVal(dataInfo.content .partiesPhone));
		$('#tdCompanyName').text($.utils.getNotNullVal(dataInfo.content .companyName));
		$('#tdLegalRepresentative').text($.utils.getNotNullVal(dataInfo.content .legalRepresentative));
		$('#tdCompanyAddr').text($.utils.getNotNullVal(dataInfo.content .companyAddr));
		$('#tdCompanyPhone').text($.utils.getNotNullVal(dataInfo.content .companyPhone));
		$('#tdBaseInfo').text($.utils.getNotNullVal(dataInfo.content .baseInfo));
		$('#tdHearingInfo').text($.utils.getNotNullVal(dataInfo.content .hearingInfo));
		$('#tdAdvice').text($.utils.getNotNullVal(dataInfo.content .advice));
	}

	rales.initFilesList(dataInfo.files);
	rales.initCodeRelevance(dataInfo.relevanceId);
}