var g_params = {}, g_backUrl = null;
var g_dataList = null;
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	getResultList();
	initView();
	$('.selectpicker').selectpicker({width:'100%'});
});

//处理结果详情
function getResultList(){
	if(!$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/sam/task/getTaskSuggestList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
		    		taskinfoId: g_params.row.id,
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
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].suggestUserName) + '</td>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].content) + '</td>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate) + '</td>' +
	    									'<td class="reference-td1">' + 
	    										fileList +
			    							'</td>' + 
	    								'</tr>';
		    				$('#resultList').append(html);
		    			}
		    		}
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
	if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.row)){
		$('#tdTitle').text(g_params.row.title);
		$('#tdContent').text(g_params.row.content);
		$('#tdSendByName').text(g_params.row.sendByName);
		$('#tdCompletedDate').text($.date.dateFormat(g_params.row.completedDate, "yyyy-MM-dd"));
		$('#tdCreateDate').text($.date.dateFormat(g_params.row.createDate, "yyyy-MM-dd"));
		$('#handleOrg').text(g_params.row.handleOrg);

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

		fileupload.initFileEditSelector('auditFiles', g_params.row.files);
	}else{
		fileupload.initFileNewSelector('auditFiles');
	}

	//查看附件内容
	$("#btnCheck").click(function () {
		if(!$.utils.isEmpty($('#selectFile').val()))
			window.open(top.app.conf.url.res.url + $('#selectFile').val());
		else
			top.app.message.notice("当前列表没有附件！");
    });
	
	$("#btnHandle").click(function () {
		if($('#suggest').val() == ''){
			top.app.message.notice("办理意见不能为空!");
			return;
		}
    	fileupload.uploadAction(null, false, true, "-1", function(){submitAction();});
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });

	//判断当前任务节点名称
	if(g_params.row.activityId == 'handleTask'){
		top.app.addComboBoxOption($("#isAssign"), [{ID:'1', NAME:'是'}, {ID:'0', NAME:'否'}]);
		$('#trIsHandle').css('display', '');
		$('#trIsAssign').css('display', '');
		$('#trAssignHandleUser').css('display', '');
		$('#trAuditStatus').css('display', 'none');
	}else if(g_params.row.activityId == 'assignTask'){
		$('#trIsHandle').css('display', '');
		$('#trIsAssign').css('display', 'none');
		$('#trAssignHandleUser').css('display', 'none');
		$('#trAuditStatus').css('display', 'none');
	}else if(g_params.row.activityId == 'auditTask'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'1', NAME:'通过'}, {ID:'0', NAME:'回退'}]);
		$('#trIsHandle').css('display', '');
		$('#trIsAssign').css('display', 'none');
		$('#trAssignHandleUser').css('display', 'none');
		$('#trAuditStatus').css('display', '');
	}else if(g_params.row.activityId == 'deptAuditTask'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'1', NAME:'通过'}, {ID:'0', NAME:'回退'}]);
		$('#trIsHandle').css('display', '');
		$('#trIsAssign').css('display', 'none');
		$('#trAssignHandleUser').css('display', 'none');
		$('#trAuditStatus').css('display', '');
	}
	$('.selectpicker').selectpicker('refresh');

	//选择指派人
	$("#assignHandleUser").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择指派人', ['900px', '550px'], '/rales/sam/task/task-user.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#assignHandleUser").val(retParams[0].userNameList);
		});
    });
}

function submitAction(){
	//提交数据
	var submitData = {};
	submitData["taskId"] = g_params.row.taskId;
	submitData["processInstanceId"] = g_params.row.processInstanceId;
	submitData["processDefinitionId"] = g_params.row.processDefinitionId;
	submitData["taskinfoId"] = g_params.row.id;
	submitData["content"] = $('#suggest').val();
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();

	//判断当前任务节点名称
	if(g_params.row.activityId == 'handleTask'){
		if($("#isAssign").val() == '1' && $('#assignHandleUser').val() == ''){
			top.app.message.notice("请选择指派人员！");
			return;
		}
		if(g_userIdList == top.app.info.userInfo.userId){
			top.app.message.notice("任务不能指派给自己！");
			return;
		}
		submitData["isAssign"] = $("#isAssign").val();
//		submitData["assignHandleUser"] = $('#assignHandleUser').val();
		submitData["assignHandleUser"] = g_userIdList;
		submitData["handleUserId"] = top.app.info.userInfo.userId;
		submitData["handleUserName"] = top.app.info.userInfo.userName;
	}else if(g_params.row.activityId == 'assignTask'){
	}else if(g_params.row.activityId == 'auditTask'){
		submitData["auditStatus"] = $("#auditStatus").val();
	}else if(g_params.row.activityId == 'deptAuditTask'){
		submitData["auditStatus"] = $("#auditStatus").val();
	}

	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/task/taskAudit?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("处理成功！");
	   			//页面跳转
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
