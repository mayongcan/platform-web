var g_params = {}, g_backUrl = null, g_counterpartType = "5";
//var g_auditStatusDict1 = [], g_auditStatusDict2 = [], g_auditStatusDict3 = [], g_auditStatusDict4 = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	//获取历史处理意见
	getResultList();
	initView();
	initData();
	initOtherInfo();
});


function initView(){
	//提交
	$("#btnOK").click(function () {
		if($('#result').val() == ''){
   			top.app.message.notice("请填写处理意见！");
			return;
		}
		var submitData = {};
		submitData["taskId"] = g_params.row.taskId;
		submitData["processInstanceId"] = g_params.row.processInstanceId;
		submitData["processDefinitionId"] = g_params.row.processDefinitionId;
		submitData["registerId"] = g_params.row.id;
		submitData["counterpartType"] = g_counterpartType;
		submitData["result"] = $('#result').val();
		
		submitData["jumpStatus"] = $("#jumpStatus").val();
		if(g_params.row.activityName == '法制审核员审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '部门领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '单位领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			submitData["needLawOfficeAudit"] = $('#divNeedLawOfficeAudit input:radio:checked').val();
			submitData["isRegister"] = '0';
			//单位领导审批同意的日期为结案日期
			if($("#auditStatus").val() == '10') {
				submitData["filingDateType"] = "2";
			}
		}else if(g_params.row.activityName == '法规处领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '委领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			if($("#auditStatus").val() == '10')
				submitData["flowProgress"] = '6';
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
	var dataInfo = rales.getWritContent(g_params.row.id, rales.writNecessity5_1, "");
	$('#tableTitleMark').text(dataInfo.code);
	if(!$.utils.isNull(dataInfo.content)){
		var g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
		//转换json
		if(typeof dataInfo.content !== 'object') dataInfo.content = eval("(" + dataInfo.content + ")");
		
		$('#tdCaseName').text($.utils.getNotNullVal(dataInfo.content.caseName));
		$('#tdCaseNo').text($.utils.getNotNullVal(dataInfo.content.caseNo));
		$('#tdCaseBeginDate').text($.utils.getNotNullVal(dataInfo.content.caseBeginDate));
		$('#tdPunish').text($.utils.getNotNullVal(dataInfo.content.punish));
		$('#tdCasePunishDate').text($.utils.getNotNullVal(dataInfo.content.casePunishDate));
		
		$('#tdPartiesCompany').text($.utils.getNotNullVal(dataInfo.content.partiesCompany));
		$('#tdDelegate').text($.utils.getNotNullVal(dataInfo.content.delegate));
		$('#tdPartiesName').text($.utils.getNotNullVal(dataInfo.content.partiesName));
		$('#tdBirthDate').text($.utils.getNotNullVal(dataInfo.content.birthDate));
		$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(dataInfo.content.partiesSex, g_params.sexDict)));
		$('#tdPartiesAddr').text($.utils.getNotNullVal(dataInfo.content.partiesAddr));
		$('#tdPartiesPhone').text($.utils.getNotNullVal(dataInfo.content.partiesPhone));
		$('#tdPartiesZip').text($.utils.getNotNullVal(dataInfo.content.partiesZip));
		
		$('#tdResult').text($.utils.getNotNullVal(dataInfo.content.result));
		$('#tdHandleDetail').text($.utils.getNotNullVal(dataInfo.content.handleDetail));
	}

	rales.initFilesList(dataInfo.files);
	rales.initCodeRelevance(dataInfo.relevanceId);
	
}