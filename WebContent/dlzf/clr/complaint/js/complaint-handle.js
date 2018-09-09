var g_params = {}, g_backUrl = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	//获取历史审批意见
	getResultList();
	initView();
	initData();
});

function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/getComplaintSuggestList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		complaintId: g_params.row.id,
				page: 0,
				size:50
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
		    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
		    			g_dataList = data.rows;
		    			$('#resultList').empty();
		    			for(var i = 0; i < data.rows.length; i++){
		    				var fileList = "";
		    				if(!$.utils.isNull(data.rows[i].files)) {
		    					fileList += '<table style="width: 100%;">' + 
												'<tbody>' + 
												'<tr>' + 
													'<td class="reference-td1" style="border-width: 0px;">' + 
														'<select class="selectpicker" id="selectFile' + i + '">';
		    					var arrayFileUrl = [], arrayFileName = [];
		    					arrayFileUrl = data.rows[i].files.split(',');
		    					for(var index = 0; index < arrayFileUrl.length; index++){
		    						arrayFileName[index] = arrayFileUrl[index].substring(arrayFileUrl[index].lastIndexOf("/") + 1);
		    						fileList += "<option value='" + arrayFileUrl[index] + "'>" + arrayFileName[index] + "</option>";
		    					}
			    				fileList +='</select>' + 
													'</td>' + 
													'<td class="reference-td1" style="width:40px;border-width: 0px;">' + 
														'<button type="button" class="btn btn-white" onclick="getFile(' + i +')">查看附件</button>' + 
													'</td>' + 
												'</tr>' + 
											'</tbody>' + 
										'</table>';
		    				}
		    				var html = '<tr>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createUserName) + '</td>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].content) + '</td>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate) + '</td>' +
	    									'<td class="reference-td1">' + 
	    										fileList +
			    							'</td>' + 
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

function getFile(index){
	if(!$.utils.isEmpty($('#selectFile' + index).val()))
		window.open(top.app.conf.url.res.url + $('#selectFile' + index).val());
	else
		top.app.message.notice("当前列表没有附件！");
}

function initView(){
	fileupload.initFileNewSelector('files');
	//提交
	$("#btnOK").click(function () {
		if($('#content').val() == ''){
   			top.app.message.notice("请填写审批意见！");
			return;
		}
        //判断是否上传附件
    	fileupload.uploadAction(null, false, true, "-1", function(){submitAction();});
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });

	//查看附件内容
	$("#btnCheck").click(function () {
		if(!$.utils.isEmpty($('#selectFile').val()))
			window.open(top.app.conf.url.res.url + $('#selectFile').val());
		else
			top.app.message.notice("当前列表没有附件！");
    });
}

function initData(){
	$('#tdType').text(top.app.getDictName(g_params.row.type, g_params.typeDict));
	$('#tdSource').text(top.app.getDictName(g_params.row.source, g_params.sourceDict));
	$('#tdSex').text(top.app.getDictName(g_params.row.sex, g_params.sexDict));
	$('#tdName').text(g_params.row.name);
	$('#tdCertificateNo').text(g_params.row.certificateNo);
	$('#tdAge').text(g_params.row.age);
	$('#tdCompany').text(g_params.row.company);
	$('#tdAddress').text(g_params.row.address);
	$('#tdPhone').text(g_params.row.phone);
	$('#tdSendBy').text(g_params.row.sendByName);
	$('#tdContent').text(g_params.row.content);
	//显示内容
	$('#feedback').text(g_params.row.feedback);
	$('#draftOpinion').text(g_params.row.draftOpinion);
	$('#finalOpinion').text(g_params.row.finalOpinion);
	
	//显示文件列表
	var arrayFileUrl = [], arrayFileName = [];
	if(!$.utils.isNull(g_params.row.files)){
		arrayFileUrl = g_params.row.files.split(',');
		for(var i = 0; i < arrayFileUrl.length; i++){
			arrayFileName[i] = arrayFileUrl[i].substring(arrayFileUrl[i].lastIndexOf("/") + 1);
		}
	}
	$('#selectFile').empty();
	var html = "";
	var length = arrayFileUrl.length;
	for (var i = 0; i < length; i++) {
		html += "<option value='" + arrayFileUrl[i] + "'>" + arrayFileName[i] + "</option>";
	}
	$('#selectFile').append(html);
	
	//判断当前任务节点名称
	if(g_params.row.activityId == 'deputyDirectorAuditTask1'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'10', NAME:'通过'}, {ID:'0', NAME:'回退重新编辑'}]);
	}else if(g_params.row.activityId == 'directorAuditTask1'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'10', NAME:'通过'}, {ID:'0', NAME:'回退重新编辑'}, {ID:'1', NAME:'回退到无线电处副处长处理'}]);
	}else if(g_params.row.activityId == 'deputyChiefAuditTask'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'10', NAME:'通过'}, {ID:'0', NAME:'回退'}]);
//		$('#trFeedback').css('display', '');
//		$('#tdFeedback').text(g_params.row.feedback);
	}else if(g_params.row.activityId == 'deputyDirectorAuditTask2'){
//		$('#trFeedback').css('display', '');
//		$('#tdFeedback').text(g_params.row.feedback);
//		$('#trDraftOpinion').css('display', '');
//		$('#tdDraftOpinion').text(g_params.row.draftOpinion);
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'10', NAME:'通过'}, {ID:'0', NAME:'回退到处理反馈'}, {ID:'1', NAME:'回退到草拟答复意见'}]);
	}else if(g_params.row.activityId == 'directorAuditTask2'){
//		$('#trFeedback').css('display', '');
//		$('#tdFeedback').text(g_params.row.feedback);
//		$('#trDraftOpinion').css('display', '');
//		$('#tdDraftOpinion').text(g_params.row.draftOpinion);
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'10', NAME:'通过'}, {ID:'0', NAME:'回退到处理反馈'}, {ID:'1', NAME:'回退到草拟答复意见'}, {ID:'2', NAME:'回退到无线电处副处长处理'}]);
	}else if(g_params.row.activityId == 'draftReplyTask'){		//草拟审批意见，增加通过和回退
//		$('#trFeedback').css('display', '');
//		$('#tdFeedback').text(g_params.row.feedback);
//		$('#trDraftOpinion').css('display', '');
		$('#tdAuditContent').html('<span class="input-request">＊</span>办理意见');
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'10', NAME:'通过'}, {ID:'0', NAME:'回退'}]);
	}else{
		if(g_params.row.activityId == 'feedbackTask'){
//			$('#trFeedback').css('display', '');
			$('#trAuditContent').remove();		//移除审核意见
		}else if(g_params.row.activityId == 'finalOpinionTask'){
//			$('#trFeedback').css('display', '');
//			$('#tdFeedback').text(g_params.row.feedback);
//			$('#trDraftOpinion').css('display', '');
//			$('#tdDraftOpinion').text(g_params.row.draftOpinion);
			$('#trFinalOpinion').css('display', '');
			$('#tdAuditContent').html('<span class="input-request">＊</span>办理意见');
		}
		if(g_params.row.activityId == 'backToEditTask'){
			$('#tdAuditContent').html('<span class="input-request">＊</span>办理意见');
		}
		$('#trAuditStatus').css('display', 'none');
	}
}

function submitAction(){
	var submitData = {};
	submitData["taskId"] = g_params.row.taskId;
	submitData["processInstanceId"] = g_params.row.processInstanceId;
	submitData["processDefinitionId"] = g_params.row.processDefinitionId;
	submitData["complaintId"] = g_params.row.id;
	submitData["content"] = $('#content').val();

	//判断当前任务节点名称
	if(g_params.row.activityId == 'deputyDirectorAuditTask1' || g_params.row.activityId == 'directorAuditTask1' || g_params.row.activityId == 'deputyChiefAuditTask'
		|| g_params.row.activityId == 'deputyDirectorAuditTask2' || g_params.row.activityId == 'directorAuditTask2' || g_params.row.activityId == 'draftReplyTask'){
		submitData["auditStatus"] = $("#auditStatus").val();
	}else if(g_params.row.activityId == 'feedbackTask'){
//		if($('#feedback').val() == ''){
//   			top.app.message.notice("请填写处理情况反馈内容！");
//			return;
//		}
		submitData["feedback"] = $("#feedback").val();
	}else if(g_params.row.activityId == 'draftReplyTask'){
//		if($('#draftOpinion').val() == ''){
//   			top.app.message.notice("请填写草拟答复意见！");
//			return;
//		}
		submitData["draftOpinion"] = $("#draftOpinion").val();
	}else if(g_params.row.activityId == 'finalOpinionTask'){
		if($('#finalOpinion').val() == ''){
   			top.app.message.notice("请填写登记答复内容！");
			return;
		}
		submitData["finalOpinion"] = $("#finalOpinion").val();
	}
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();

	top.app.message.loading();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/complaintAudit?access_token=" + top.app.cookies.getCookiesToken(),
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
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}