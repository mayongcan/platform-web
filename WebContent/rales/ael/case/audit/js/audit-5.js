var g_params = {}, g_backUrl = null, g_counterpartType = "8", g_filingId = "";
var g_auditStatusDict1 = [], g_auditStatusDict2 = [], g_auditStatusDict3 = [], g_auditStatusDict4 = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	//获取历史审批意见
	getResultList();
	initView();
	initData();
	
	//设置右侧的高度和左侧一致
	$("#content-right").height($("#content-left").height());
});

function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseSuggestList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
		    		access_token: top.app.cookies.getCookiesToken(),
		    		registerId: g_params.row.id,
		    		counterpartType: g_counterpartType,
				page: 0,
				size:50
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
			    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
			    			g_dataList = data.rows;
			    			$('#resultList').empty();
			    			for(var i = 0; i < data.rows.length; i++){
			    				var html = '<tr>' + 
											'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createUserName) + '</td>' + 
											'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].result) + '</td>' + 
											'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate) + '</td>' + 
										'</tr>';
			    				$('#resultList').append(html);
			    			}
			    		}
			    		//设置右侧的高度和左侧一致
			    		$("#content-right").height($("#content-left").height());
		   		}
			}
		});
	}
}

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
			//单位领导审批同意的日期为结案日期
			if($("#auditStatus").val() == '10') {
				submitData["filingId"] = g_filingId;
				submitData["filingDateType"] = "2";
			}
		}else if(g_params.row.activityName == '法规处审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
		}else if(g_params.row.activityName == '委领导审批'){
			submitData["auditStatus"] = $("#auditStatus").val();
			if($("#auditStatus").val() == '10')
				submitData["flowProgress"] = '6';
		}else{
			//设置进入子流程的时候，设置流程启动人
			submitData["setApplyUser"] = "1";
		}

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
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });
}
function initData(){
	var filingInfo = rales.getCaseFilingInfo(g_params.row.id);
	g_filingId = filingInfo.id;
	$('#tdIllegalContent').text(filingInfo.illegalContent);
	$('#tdCaseBeginDate').text(filingInfo.filingDate);
	$('#tdCaseEndDate').text(filingInfo.endDate);
	
	$.ajax({
		url: top.app.conf.url.apigateway + '/api/rales/ael/case/getCaseClosedList',
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: g_params.row.id
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				if(data.rows != null && data.rows != undefined && data.rows.length > 0){
					g_filingId = data.rows[0].id;
					$('#tableTitleMark').text(data.rows[0].code);
					$('#tdProcessAndResult').text(data.rows[0].punishments);
					$('#tdExecuteResult').text(data.rows[0].executiveCondition);
					$('#tdCloseSuggest').text(data.rows[0].closeSuggest);
					rales.initFilesList(data.rows[0].files);
					rales.initCodeRelevance(data.rows[0].relevanceId);
				}
	   		}
        }
	});
	
	//判断当前任务节点名称
	if(g_params.row.activityName == '部门领导审批'){
		g_auditStatusDict1 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_1');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict1);
	}else if(g_params.row.activityName == '单位领导审批'){
		g_auditStatusDict2 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_2');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict2);
		$('#trNeedLawOfficeAudit').css('display', '');
	}else if(g_params.row.activityName == '法规处审批'){
		g_auditStatusDict3 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_3');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict3);
	}else if(g_params.row.activityName == '委领导审批'){
		g_auditStatusDict4 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_4');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict4);
	}else{
		$('#trAuditStatus').css('display', 'none');
	}
}