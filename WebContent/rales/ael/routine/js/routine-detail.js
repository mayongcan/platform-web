var g_params = {}, g_backUrl = "", g_btnType = 1, g_dataListArray = [];
var g_rows = [];
var newData = {};
$(function () {
//	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	g_backUrl = g_params.backUrl;
	initView();
	initNavButton();
	initData();
	if(!g_params.isEdit){
		$('#auditNoticeTip').remove();
	}
	//判断是否移除审批
	if(g_params.removeAuditNotice) $('#auditNoticeTip').remove();
});

function initView(){
	//设置顶部显示
	if(g_params.row.subFlowProgress == '23'){
		$('#caseRegisterCode').text(g_params.row.otherFlowParams.code);
		$('#flowProgressName').text("日常巡查-内部呈批流程");
		if(g_params.row.activityName == '审批编辑' ){
			$('#btnAudit').text("重新提交");
			$('#flowProgressNotice').text("待编辑，请重新编辑后提交审批！");
			g_btnType = 4;
		}else{
			g_btnType = 1;
		}
	}else{
		$('#caseRegisterCode').text(g_params.row.otherFlowParams.code);
		$('#flowProgressName').text("行政检查登记流程");
		if(g_params.row.activityName == '行政检查编辑' || g_params.row.activityName == '行政检查草稿'){
			$('#btnAudit').text("提交");
			$('#flowProgressNotice').text("待编辑，请编辑后提交审批！");
			g_btnType = 4;
		}else{
			g_btnType = 1;
		}
	}

	//初始化按钮
	for(var i = 0; i < 100; i++){
		for(var j = 0; j < 100; j++){
			//初始化点击事件
			$("#btnNewDoc" + i + "-" + j).attr("index", i);
			$("#btnNewDoc" + i + "-" + j).attr("subIndex", j);
			$("#btnNewDoc" + i + "-" + j).on('click', function () {
				btnEventNew($(this).attr('index'), $(this).attr('subIndex'));
		    });
			if(!g_params.isEdit){
				if(g_params.isFinish && i == 1 && j == 17){
					continue;
				}else if(g_params.isFinish && i == 1 && j == 18){
					continue;
				}
				$("#btnNewDoc" + i + "-" + j).remove();
			}

			//初始化启动流程或者提交流程
			$("#btnSubmitAudit" + i + "-" + j).attr("index", i);
			$("#btnSubmitAudit" + i + "-" + j).attr("subIndex", j);
			$("#btnSubmitAudit" + i + "-" + j).on('click', function () {
				btnSubmitAudit($(this).attr('index'), $(this).attr('subIndex'));
		    });
		}
	}
}

function initNavButton(){
	//审批按钮点击
	var index = g_params.index;
	$('#btnAudit').click(function () {
		top.app.message.loading();
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/routine/getTodoList?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'GET',
			data:JSON.stringify(),
			contentType: "application/json",
			async: false,
		    dataType: "json",
			success: function(data){
				top.app.message.loadingClose();
				newData = data.rows;
	        }
		});
//		if(g_btnType == 1){
//			//根据必要流程的状态，进入不同的审批页面
//			top.app.info.iframe.params = g_params;
//			top.app.info.iframe.params.navIndex = 1;
//			var pid = $.utils.getUrlParam(window.location.search,"_pid");
//			var url = "/rales/ael/case/audit/audit-11.html?_pid=" + pid + "&backUrl=" + g_backUrl + "&cancelUrl=/rales/ael/routine/routine-detail.html";
//			window.location.href = encodeURI(url);
//		}else if(g_btnType == 4){
//			submitAudit();
//		}
		//根据必要流程的状态，进入不同的审批页面
//		top.app.info.iframe.params = g_params;
		top.app.info.iframe.params.isEdit = true;
		top.app.info.iframe.params.row = newData[index];
		top.app.info.iframe.params.navIndex = 1;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/rales/ael/case/audit/audit-11.html?_pid=" + pid + "&backUrl=" + g_backUrl + "&cancelUrl=/rales/ael/routine/routine-detail.html";
		if(g_params.row.subFlowProgress == '23')
			url = "/rales/ael/case/audit/audit-23.html?_pid=" + pid + "&backUrl=" + g_backUrl + "&cancelUrl=/rales/ael/routine/routine-detail.html";
		window.location.href = encodeURI(url);
    });
}

//提交审批
function submitAudit(){
	var notice = "确定要提交审批？";
	top.app.message.confirm(notice, function(){
		top.app.message.loading();
		var submitData = {};
		submitData["taskId"] = g_params.row.taskId;
		submitData["processInstanceId"] = g_params.row.processInstanceId;
		submitData["processDefinitionId"] = g_params.row.processDefinitionId;
		submitData["registerId"] = g_params.row.id;
		//用于处理非必要流程
		if(!$.utils.isEmpty(g_params.row.subFlowProgress)){
			submitData["subFlowProgress"] = g_params.row.subFlowProgress;
			submitData["otherFlowId"] = g_params.row.otherFlowId;
		}
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
	});
}


function initData(){
	addList('tableList1-1', 'tableCnt1-1', '/api/rales/ael/writ/getWritList', 1, 1, rales.writOptional1_1, '', true);
	addList('tableList1-2', 'tableCnt1-2', '/api/rales/ael/writ/getWritList', 1, 2, rales.writOptional1_2, '', true);
	addList('tableList1-3', 'tableCnt1-3', '/api/rales/ael/writ/getWritList', 1, 3, rales.writOptional1_3, '', true);
	addList('tableList1-4', 'tableCnt1-4', '/api/rales/ael/writ/getWritList', 1, 4, rales.writOptional1_4, '', true);
	addList('tableList1-5', 'tableCnt1-5', '/api/rales/ael/writ/getWritList', 1, 5, rales.writOptional1_5, '', true);
	addList('tableList1-6', 'tableCnt1-6', '/api/rales/ael/writ/getWritList', 1, 6, rales.writOptional1_6, '', true);
	addList('tableList1-7', 'tableCnt1-7', '/api/rales/ael/writ/getWritList', 1, 7, rales.writOptional1_7, '', true);
	addList('tableList1-8', 'tableCnt1-8', '/api/rales/ael/writ/getWritList', 1, 8, rales.writOptional1_8, '', true);
	addList('tableList1-9', 'tableCnt1-9', '/api/rales/ael/writ/getWritList', 1, 9, rales.writOptional1_9, '', true);
	addList('tableList1-10', 'tableCnt1-10', '/api/rales/ael/writ/getWritList', 1, 10, rales.writOptional1_10, '', true);
	addList('tableList1-11', 'tableCnt1-11', '/api/rales/ael/writ/getWritList', 1, 11, rales.writOptional1_11, '', true);
	addList('tableList1-12', 'tableCnt1-12', '/api/rales/ael/writ/getWritList', 1, 12, rales.writOptional1_12, '', true);
	addList('tableList1-13', 'tableCnt1-13', '/api/rales/ael/writ/getWritList', 1, 13, rales.writOptional1_13, '', true);
	addList('tableList1-14', 'tableCnt1-14', '/api/rales/ael/writ/getWritList', 1, 14, rales.writOptional1_14, '', true);
	addList('tableList1-15', 'tableCnt1-15', '/api/rales/ael/writ/getWritList', 1, 15, rales.writOptional1_15, '', true);
	addList('tableList1-16', 'tableCnt1-16', '/api/rales/ael/writ/getWritList', 1, 16, rales.writOptional1_16, '', true);
	addList('tableList1-17', 'tableCnt1-17', '/api/rales/ael/writ/getWritList', 1, 17, rales.writOptional1_17, '', true, "行政检查案卷封面");
	addList('tableList1-18', 'tableCnt1-18', '/api/rales/ael/writ/getWritList', 1, 18, rales.writOptional1_18, '', true, "行政检查案卷目录");
	addFlowList('tableList1-19', 'tableCnt1-19', '/api/rales/ael/writ/getWritList', 1, 19, rales.writOptional1_19, '', true);
}

//添加列表内容
function addList(tableListId, tableCntId, url, index, subIndex, writType, subType, addEditBtn, codeDefault){
	$('#' + tableListId).empty();
	var html = "";
	$.ajax({
		url: top.app.conf.url.apigateway + url,
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: g_params.row.id,
	   		writType: writType,
	   		subType: subType,
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				g_dataListArray[subIndex] = data.rows;
				var length = data.rows.length;
				$('#' + tableCntId).text(length);
				for(var i = 0; i < length; i++){
					var editButton = "";
					if(g_params.isEdit){
						if(g_params.removeAuditEdit && index == 1 && subIndex == 1){
							//移除审批表的编辑
						}else{
							editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
											'编 辑' + 
										 '</button>' + 
										 '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDel(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
											'删 除' + 
										 '</button>'; 
						}
					}
					//办结案件，可以编辑封面和目录
					if(g_params.isFinish && index == 1 && subIndex == 17){
						editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'编 辑' + 
									 '</button>' + 
									 '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDel(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'删 除' + 
									 '</button>'; 
					}
					if(g_params.isFinish && index == 1 && subIndex == 18){
						editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'编 辑' + 
									 '</button>' + 
									 '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDel(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'删 除' + 
									 '</button>'; 
					}
					html += '<tr>' + 
								'<td class="reference-td">' + (i+1) + '</td>' + 
								'<td class="reference-td">' + ($.utils.isEmpty(data.rows[i].code) ? codeDefault : data.rows[i].code) + '</td>' + 
								'<td class="reference-td">' + $.utils.getNotNullVal(g_params.row.lastHandleUserName) + '</td>' + 
								'<td class="reference-td">' + $.date.dateFormat(g_params.row.lastHandleTime, "yyyy-MM-dd") + '</td>' + 
								'<td class="reference-td">' + g_params.row.activityName + '</td>' + 
								'<td class="reference-td">' + 
									'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'查 看' + 
									'</button>' + 
									editButton + 
								'</td>' + 
							'</tr>';
				}
				$('#' + tableListId).append(html);
	   		}
        }
	});
} 


//添加列表内容
function addFlowList(tableListId, tableCntId, url, index, subIndex, writType, subType, addEditBtn, codeDefault){
	$('#' + tableListId).empty();
	var html = "";
	$.ajax({
		url: top.app.conf.url.apigateway + url,
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: g_params.row.id,
	   		writType: writType,
	   		subType: subType,
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				var flowProgress = "";
				if(index == 1 && subIndex == 19) flowProgress = "内部呈批流程";
				g_dataListArray[subIndex] = data.rows;
				var length = data.rows.length;
				$('#' + tableCntId).text(length);
				var removeAuditButton = true;
				for(var i = 0; i < length; i++){
					//流程未启动或退回重新编辑的时候，可以显示编辑按钮
					if($.utils.isEmpty(data.rows[i].lastHandleTime)) {
						addEditBtn = true;
						removeAuditButton = false;
						flowProgress = "";
					}
					//判断是否启动编辑
					if(g_params.row.activityName == '审批编辑' && index == 1 && subIndex == 19)  addEditBtn = true;
					var editButton = "";
					if(addEditBtn && !g_params.isFinish ){
						editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'编 辑' + 
									 '</button>'; 
					}
					html += '<tr>' + 
								'<td class="reference-td">' + (i+1) + '</td>' + 
								'<td class="reference-td">' + ($.utils.isEmpty(data.rows[i].code) ? codeDefault : data.rows[i].code) + '</td>' + 
								'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].lastHandleUserName) + '</td>' + 
								'<td class="reference-td">' + $.date.dateFormat(data.rows[i].lastHandleTime, "yyyy-MM-dd") + '</td>' + 
								'<td class="reference-td">' + flowProgress + '</td>' + 
								'<td class="reference-td">' + 
									'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'查 看' + 
									'</button>' + 
									editButton + 
								'</td>' + 
							'</tr>';
				}
				$('#' + tableListId).append(html);
		        if(length == 1) {
	        		$('#btnNewDoc' + index + '-' + subIndex).remove();
	        		if(removeAuditButton) $('#btnSubmitAudit' + index + '-' + subIndex).remove();
		        }
				else {
					$('#btnSubmitAudit' + index + '-' + subIndex).remove();
				}
	   		}
    }
	});
} 

//新增
function btnEventNew(index, subIndex){
	//设置传送对象
	top.app.info.iframe.params = g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 1;	//1新增 2编辑 3查看
	top.app.info.iframe.params.caseIsNormalCase = "1";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/routine/routine-detail.html";
	location.href = encodeURI(url);
}

//查询
function btnEventDetail(index, subIndex, id){
	//设置传送对象
	top.app.info.iframe.params = g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 3;	//1新增 2编辑 3查看
	top.app.info.iframe.params.id = id;
	top.app.info.iframe.params.caseIsNormalCase = "1";
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/routine/routine-detail.html";
	location.href = encodeURI(url);
}

//编辑
function btnEventEdit(index, subIndex, id){
	//设置传送对象
	top.app.info.iframe.params = g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 2;
	top.app.info.iframe.params.id = id;
	top.app.info.iframe.params.caseIsNormalCase = "1";
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/routine/routine-detail.html";
	location.href = encodeURI(url);
}

//删除
function btnEventDel(index, subIndex, id){
	top.app.message.confirm("确定删除文书？", function(){
		var subRow = getSubRow(subIndex, id);
		top.app.message.loading();
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/writ/delWrit?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data: subRow.id + "",
			contentType: "application/json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
		   			//重新加载列表
					initData();
		   			top.app.message.notice("文书删除成功！");
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
	});
}

function getSubRow(subIndex, id){
	if(g_dataListArray[subIndex] != null && g_dataListArray[subIndex] != undefined){
		var length = g_dataListArray[subIndex].length;
		for(var i = 0; i < length; i++){
			if(id == g_dataListArray[subIndex][i].id){
				return g_dataListArray[subIndex][i];
			}
		}
	}
	return null;
}

//启动流程或提交审核
function btnSubmitAudit(index, subIndex){
	top.app.message.confirm("确定要提交审批？", function(){
		var submitData = {}, url = "";
		if(index == 1 && subIndex == 19) {
			url = "/api/rales/ael/case/startRoutineInteriorAuditFlow";
			submitData["subFlowProgress"] = "23";
		}
		submitData["registerId"] = g_params.row.id;
		if(top.app.info.userInfo.userId == g_params.row.associateExecutor)
			submitData["associateExecutor"] = g_params.row.createBy;
		else
			submitData["associateExecutor"] = g_params.row.associateExecutor;

		//填入当前行的ID和文书
		if(g_dataListArray[subIndex].length > 0){
			submitData["id"] = g_dataListArray[subIndex][0].id;
			submitData["otherFlowCode"] = g_dataListArray[subIndex][0].code;
		}
		
		top.app.message.loading();
		//异步处理
		$.ajax({
			url: top.app.conf.url.apigateway + url + "?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data:JSON.stringify(submitData),
			contentType: "application/json",
		    dataType: "json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
		   			top.app.message.notice("数据提交成功！");
		   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
		   			location.href = "/rales/ael/routine/routine-todo.html?_pid=" + pid;
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
	});
}