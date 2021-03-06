var g_taskId = null, g_processDefinitionId = null, g_processInstanceId = null, g_starter = null, g_backUrl = null, g_submitUrl = null, 
	$tableWorkflow = $('#tableWorkflowList'), g_dealwithData = {};

var g_timeLineData = [];

$(function () {
	// 初始化tab
	$('.tab-group').tabify();
	g_taskId = decodeURI($.utils.getUrlParam(window.location.search,"taskId"));
	g_processDefinitionId = decodeURI($.utils.getUrlParam(window.location.search,"processDefinitionId"));
	g_processInstanceId = decodeURI($.utils.getUrlParam(window.location.search,"processInstanceId"));
	//g_starter = decodeURI($.utils.getUrlParam(window.location.search,"starter"));
	g_starter = $.utils.getNotNullVal(decodeURI($.utils.getUrlParam(window.location.search,"starterUserName")));
	activityName = decodeURI($.utils.getUrlParam(window.location.search,"activityName"));
	g_backUrl = decodeURI($.utils.getUrlParam(window.location.search,"backUrl"));
	g_submitUrl = decodeURI($.utils.getUrlParam(window.location.search,"submitUrl"));
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 当前任务节点:<span style='color:#1ab394;margin-left:5px;'>" + activityName + "</span></span>");
	// 初始化办理任务
	initDealwith();
	// 初始化启动表单
	initForm();
	// 初始化流程图
	initWorkflow();
	// 初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

function initDealwith(){
	// 获取任务历史
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/workflow/getHistoryTaskList",
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken(),
	    	size: -1,
	    	processInstanceId: g_processInstanceId
	    },
	    success : function(data) { 
        	if(top.app.message.code.success == data.RetCode){
        		g_timeLineData = [];
        		for(var i = 0; i < data.rows.length; i++){
        			var tmpData = {};
        			tmpData["title"] = data.rows[i].processName;
        			if(data.rows[i].actType == "startEvent") tmpData["操作人"] = g_starter;
        			//else tmpData["操作人"] = data.rows[i].assignee;
        			else tmpData["操作人"] = $.utils.getNotNullVal(data.rows[i].assigneeUserName);
        			tmpData["开始时间"] = data.rows[i].startTime;
        			tmpData["结束时间"] = data.rows[i].endTime;
        			g_timeLineData.push(tmpData);
        		}
        		$(".timeline").timeline(g_timeLineData);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
	// 获取历史和变量
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/workflow/getHistoryTaskVariablesList",
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken(),
	    	processInstanceId: g_processInstanceId,
	    	processDefinitionId: g_processDefinitionId
	    },
	    success : function(data) { 
        	if(top.app.message.code.success == data.RetCode){
        		var listCount = 0;
        		$("#tableAdvice").empty();
        		var html = '<tbody>' + 
								'<tr><th style="width:150px;">任务节点</th><th style="width:150px;">审核人</th><th style="width:140px;">审核时间</th><th colspan="2">审核内容</th></tr>"';
        		for(var i = 0; i < data.rows.length; i++){
        			if(data.rows[i].taskId == g_taskId) continue;
        			var rowspan = 1;
        			if(data.rows[i].variables != null && data.rows[i].variables !=undefined && data.rows[i].variables.length > 0){
        				rowspan = data.rows[i].variables.length;
        				for(var j = 0; j < data.rows[i].variables.length; j++){
        					if(j == 0){
        						html += '<tr>' +
				    						'<td rowspan="' + rowspan + '">' + data.rows[i].name + '</td>' + 
				    						//'<td rowspan="' + rowspan + '">' + data.rows[i].assignee + '</td>' +
				    						'<td rowspan="' + rowspan + '">' + $.utils.getNotNullVal(data.rows[i].assigneeUserName) + '</td>' +
				    						'<td rowspan="' + rowspan + '">' + data.rows[i].time + '</td>' + 
				    						'<td style="width:140px;">' + data.rows[i].variables[j].name + '：</td>' + 
				    						'<td style="color:red;">' + data.rows[i].variables[j].value + '</td>' + 
				    					'</tr>';
        					}else{
        						html += '<tr>' +
				    						'<td style="width:140px;">' + data.rows[i].variables[j].name + '：</td>' + 
				    						'<td style="color:red;">' + data.rows[i].variables[j].value + '</td>' + 
				    					'</tr>';
        					}
                		}
        			}else{
            			html += '<tr>' +
            						'<td>' + data.rows[i].name + '</td>' + 
            						//'<td>' + data.rows[i].assignee + '</td>' +
            						'<td>' + $.utils.getNotNullVal(data.rows[i].assigneeUserName) + '</td>' +
            						'<td>' + data.rows[i].time + '</td>' + 
            						'<td></td>' + 
            						'<td></td>' +
			    				'</tr>';
        			}
        			listCount++;
        		}
        		html += '</tbody>';
        		if(listCount > 0) $("#tableAdvice").append(html); 
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
	// 获取办理表单
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/workflow/getWorkflowTaskFrom",
	    method: 'GET',
	    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		processInstanceId: g_processInstanceId,
	    		taskId: g_taskId
	    },
	    success : function(data) { 
	        	if(top.app.message.code.success == data.RetCode){
	        		if(data.formType == '1')
	        			addDivContent(data.RetData);
	        		else 
	        			addPageContent(data.RetData);
	        		g_dealwithData = data;
	        		// 设置select的宽度为
	        		$('.selectpicker').selectpicker({
	        			width: '540px'
	        		});
	
	        		formValidate();
	        		// 将验证写入控件中
	        		$.metadata.setType("attr", "validate"); 
		   	}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 初始化启动表单
 */
function initForm(){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/workflow/getWorkflowStartFromAndValue",
	    method: 'GET',
	    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
		    	processInstanceId: g_processInstanceId,
		    	processDefinitionId: g_processDefinitionId
	    },
	    success : function(data) { 
	        	if(top.app.message.code.success == data.RetCode){
	        		if(data.RetData == null || data.RetData == undefined || data.RetData.length == 0 || data.RetData == ''){
	        			// 表单数据为空
	        			$("#divInfo").empty();
	        			$("#divInfo").append("当前流程无启动表单数据"); 
	        		}else{
	        			$("#tableContent").empty();
	        			var htmlTable = '<tbody><tr><th style="width:140px;">表单名称</th><th>内容</th></tr>';
	        			for(var i = 0; i < data.RetData.length; i++){
	        				htmlTable += '<tr><td>' + data.RetData[i].name + '</td><td id="' + data.RetData[i].id + '">' + data.RetData[i].value + '</td></tr>';
	        			}
	        			htmlTable += "</tbody>";
	        			$("#tableContent").append(htmlTable); 
	        		}
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function initWorkflow(){
	$('#iframeWorkflow').attr('src', "/admin/workflow/diagram-viewer/index.html?processDefinitionId=" + g_processDefinitionId + "&processInstanceId=" + g_processInstanceId);
	initWorkflowTable();
}


/**
 * 初始化列表信息
 */
function initWorkflowTable(){
	// 搜索参数
	var searchParams = function (params) {
        var param = {   // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						// 页面大小
            page: params.offset / params.limit,  		// 当前页
		    	processInstanceId: g_processInstanceId,
		    	processDefinitionId: g_processDefinitionId
        };
        return param;
    };
    // 初始化列表
    $tableWorkflow.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/workflow/getHistoryTaskList",   		// 请求后台的URL（*）
        queryParams: searchParams,	
        height: 300,									// 传递参数（*）
        onClickRow: function(row, $el){
        		$tableWorkflow.find('.success').removeClass('success');
        		$el.addClass('success');
        }
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	// 返回数据类型页面
	$("#layerBtnBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= g_backUrl + "?_pid=" + pid;
    });
}

/**
 * 动态添加控件
 */
function addDivContent(data){
	$("#divEditFromContent").empty();
	var htmlTable = "";
	for(var i = 0; i < data.length; i++){
		var isRequest = "";
		if(data[i].isRequest) isRequest = "required";
		var isWritable = "";
		if(!data[i].isWritable) isWritable = "readonly";
		if(data[i].type == 'date'){
			htmlTable += '<div class="form-group edit-group-style">' + 
							'<label class="col-sm-2 control-label edit-layer-title">' + data[i].name + '</label>' + 
							'<div class="input-group date edit-layer-input" id="div' + data[i].id + '" style="width:540px;">' + 
			            		'<input type="text" class="form-control" id="' + data[i].id + '" value="' + data[i].value + '" ' + isRequest + ' ' + isWritable + '/>' + 
			            		'<span class="input-group-addon">' + 
			                		'<span class="glyphicon glyphicon-calendar"></span>' + 
			            		'</span>' + 
			            	'</div>' + 
						 '</div>';
		}else if(data[i].type == 'boolean'){
			htmlTable += '<div class="form-group edit-group-style">' + 
							'<label class="col-sm-2 control-label edit-layer-title">' + data[i].name + '</label>' + 
							'<select class="selectpicker" id="' + data[i].id + '">' + 
			         			'<option value="1">是</option>' + 
								'<option value="0">否</option>' + 
			         		'</select>' + 
						 '</div>';
		}else if(data[i].type == 'enum'){
			htmlTable += '<div class="form-group edit-group-style">' + 
							'<label class="col-sm-2 control-label edit-layer-title">' + data[i].name + '</label>' + 
							'<select class="selectpicker" id="' + data[i].id + '">'; 
			for(var key in data[i].enumData) {
				htmlTable += '<option value="' + key + '">' + data[i].enumData[key] + '</option>'; 
			}
			htmlTable += '</select>' + '</div>';
		}else if(data[i].type == 'long'){
			htmlTable += '<div class="form-group edit-group-style">' + 
							'<label class="col-sm-2 control-label edit-layer-title">' + data[i].name + '</label>' + 
							'<input type="text" id="' + data[i].id + '" name="' + data[i].id + '" value="' + data[i].value + '" class="form-control m-b edit-layer-input digits" style="width:540px" ' + isRequest + ' ' + isWritable + '>' + 
						 '</div>';
		}else{
			htmlTable += '<div class="form-group edit-group-style">' + 
							'<label class="col-sm-2 control-label edit-layer-title">' + data[i].name + '</label>' + 
							'<input type="text" id="' + data[i].id + '" name="' + data[i].id + '" value="' + data[i].value + '" class="form-control m-b edit-layer-input" style="width:540px" ' + isRequest + ' ' + isWritable + '>' + 
						 '</div>';
		}
	}
	$("#divEditFromContent").append(htmlTable); 
	// 设置下拉框值
	for(var i = 0; i < data.length; i++){
		if(data[i].value == '') continue;
		if(data[i].type == 'enum'){
			$('#' + data[i].id).val(value);
		}
	}
}

/**
 * 输出整个页面(表单在后台配置的字符串)
 */
function addPageContent(data){
	$("#divEditFromContent").empty();
	$("#divEditFromContent").append(data); 
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        // 重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                // 在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
                return false;
            });  
        },
        // 失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
            // 提交内容
        		submitAction();
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	// 定义提交数据
	var submitData = {};
	submitData["taskId"] = g_taskId;
	submitData["processInstanceId"] = g_processInstanceId;
	submitData["processDefinitionId"] = g_processDefinitionId;
	if(g_dealwithData.formType == '1'){
		for(var i = 0; i < g_dealwithData.RetData.length; i++){
			submitData[g_dealwithData.RetData[i].id] = $("#" + g_dealwithData.RetData[i].id).val();
		}
	}
	else{
		for(var i = 0; i < g_dealwithData.idList.length; i++){
			submitData[g_dealwithData.idList[i]] = $("#" + g_dealwithData.idList[i]).val();
		}
	} 
	// 异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + g_submitUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("任务办理成功！");
	   			$("#layerBtnBack").click();
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function serialNumberTable(value,row,index){
    var pageNumber = $tableWorkflow.bootstrapTable('getOptions').pageNumber;
    var pageSize = $tableWorkflow.bootstrapTable('getOptions').pageSize;
    return (pageNumber-1) * pageSize+index+1;
}

function formatAssignee(value,row,index){
	if(row.actType == 'startEvent'){
		return g_starter;
	}else 
		return value;
}