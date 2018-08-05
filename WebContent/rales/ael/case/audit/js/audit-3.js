var g_params = {}, g_backUrl = null, g_counterpartType = "3";
var g_inquiryReportProcedure = "";
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
			if($("#auditStatus").val() == '10'){
				if(g_inquiryReportProcedure == '1')
					submitData["flowProgress"] = '4';
				else
					submitData["flowProgress"] = '5';
			}
		}else if(g_params.row.activityName == '法规处指派'){
			if(g_userIdList == ''){
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
	var dataInfo = rales.getWritContent(g_params.row.id, rales.writNecessity3_1, "");
	$('#tableTitleMark').text(dataInfo.code);
	
	if(!$.utils.isNull(dataInfo.content)){
		//转换json
		if(typeof dataInfo.content !== 'object') dataInfo.content = eval("(" + dataInfo.content + ")");

		$('#tdIllegalAction').text($.utils.getNotNullVal(dataInfo.content.illegalAction));
		$('#tdPartiesName').text($.utils.getNotNullVal(dataInfo.content.partiesName));
		$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(dataInfo.content.partiesCertificateNo));
		$('#tdPartiesUnit').text($.utils.getNotNullVal(dataInfo.content.partiesUnit));
		$('#tdLegalRepresentative').text($.utils.getNotNullVal(dataInfo.content.legalRepresentative));
		$('#tdPartiesAddr').text($.utils.getNotNullVal(dataInfo.content.partiesAddr));
		$('#tdInquiryDesc').text($.utils.getNotNullVal(dataInfo.content.inquiryDesc));
		$('#tdMemo').text($.utils.getNotNullVal(dataInfo.content.memo));

		//转换json
		if(!$.utils.isEmpty(dataInfo.content .list)){
//			g_dataList = eval("(" + dataInfo.content .list + ")");
			g_dataList = dataInfo.content .list;
			if($.utils.isNull(g_dataList)) g_dataList = [];
			refreshView();
		}	
	}

	rales.initFilesList(dataInfo.files);
	rales.initCodeRelevance(dataInfo.relevanceId);
}

function refreshView(){
	$('#tableContentList').empty();
	for(var i = 0; i < g_dataList.length; i++){
		$('#tableContentList').append('<tr>' + 
										'<td class="reference-td">' + 
										g_dataList[i].name + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].grade + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].totalCnt + 
										'</td>' + 
									'</tr>')
	}
}