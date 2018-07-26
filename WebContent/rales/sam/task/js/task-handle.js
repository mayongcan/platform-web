var g_params = {}, g_backUrl = null;
var g_dataList = null;
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
			    				var html = '<tr>' + 
											'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].suggestUserName)  + '</td>' + 
											'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].content)  + '</td>' + 
											'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate)  + '</td>' + 
		    									//'<td class="reference-td1">' + files + '</td>' +
		    									'<td class="reference-td1">' + 
		    										'<button type="button" class="btn btn-outline btn-default btn-table-opreate"  onclick="btnEventLook(' + i + ')">查看附件</button>' + 
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

function btnEventLook(index){
	var params = {};
	if(!$.utils.isEmpty(g_dataList[index].files))
		window.open(top.app.conf.url.res.url + g_dataList[index].files);
	else
		top.app.message.notice("当前审批意见没有附件！");	
}

function initView(){
	if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.row)){
		$('#tdTitle').text(g_params.row.title);
		$('#tdContent').text(g_params.row.content);
		$('#tdSendByName').text(g_params.row.sendByName);
		$('#tdCompletedDate').text($.date.dateFormat(g_params.row.completedDate, "yyyy-MM-dd"));
		$('#tdCreateDate').text($.date.dateFormat(g_params.row.createDate, "yyyy-MM-dd"));
		$('#handleOrg').val(g_params.row.handleOrg);

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
			top.app.message.notice("汇报内容不能为空!");
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
		top.app.addComboBoxOption($("#isImportant"), [{ID:'1', NAME:'是'}, {ID:'0', NAME:'否'}]);
		$('#trIsHandle').css('display', '');
		$('#trIsImportant').css('display', '');
		$('#trAuditStatus').css('display', 'none');
	}else if(g_params.row.activityId == 'auditTask'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'1', NAME:'通过'}, {ID:'0', NAME:'回退'}]);
		$('#trAuditStatus').css('display', '');
		$('#trIsHandle').css('display', 'none');
		$('#trIsImportant').css('display', 'none');
	}else if(g_params.row.activityId == 'isFinish'){
		top.app.addComboBoxOption($("#auditStatus"), [{ID:'1', NAME:'通过'}, {ID:'0', NAME:'回退'}]);
		$('#trAuditStatus').css('display', '');
		$('#trIsHandle').css('display', 'none');
		$('#trIsImportant').css('display', 'none');
	}
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
		submitData["isImportant"] = $("#isImportant").val();
		submitData["handleOrg"] = $('#handleOrg').val();
		submitData["handleUserId"] = top.app.info.userInfo.userId;
		submitData["handleUserName"] = top.app.info.userInfo.userName;
		if($.utils.isEmpty($('#handleOrg').val())){
			top.app.message.notice("请填写经办部门！");
			return;
		}
	}else if(g_params.row.activityId == 'auditTask'){
		submitData["auditStatus"] = $("#auditStatus").val();
	}else if(g_params.row.activityId == 'isFinish'){
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
