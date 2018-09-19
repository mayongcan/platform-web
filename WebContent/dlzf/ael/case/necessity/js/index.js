var g_wizardIndex = 0, g_dataListArray = [];
var isBackWizard = false;		//判断是否为后退查看(退后查看不能进行编辑)
$(function () {
	//获取流程进度
	g_wizardIndex = parseInt(parent.g_params.row.flowProgress) - 1;
	initWizard();
	initButton();
	initData();
	setTimeout(function () {
		$("#smartwizard").smartWizard("_fixHeight");
		setTimeout(function () {
			//重新计算当前页面的高度，用于iframe
	        parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
	    }, 10);
    }, 1000);
	
	//判断是否完结,如果是，则移除所有新建文书的按钮
	if(parent.g_params.isFinish){
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				if(document.getElementById("btnNewDoc" + i + "-" + j)){
					$('#btnNewDoc' + i + "-" + j).remove();
				}
			}
		}
	}
});

/**
 * 初始化向导
 */
function initWizard(){
	$('#smartwizard').smartWizard({ 
         selected: g_wizardIndex, 
         theme: 'arrows',
         transitionEffect:'fade',
         showStepURLhash: true,
         toolbarSettings: {showNextButton: false, showPreviousButton: false },
         anchorSettings: {enableAnchorOnDoneStep: true},
     });
	$("#smartwizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection, stepPosition) {
		reloadData(stepNumber);
     }); 
}

function reloadData(stepNumber){
	if((parseInt(parent.g_params.row.flowProgress) - 1) == stepNumber) isBackWizard = false;
	else isBackWizard = true;
	//获取流程进度
	g_wizardIndex = stepNumber;
	initButton();
	initData();
	setTimeout(function () {
		$("#smartwizard").smartWizard("_fixHeight");
		setTimeout(function () {
			//重新计算当前页面的高度，用于iframe
	        parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
	    }, 10);
    }, 1000);
	
	//判断是否完结,如果是，则移除所有新建文书的按钮
	if(parent.g_params.isFinish){
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				if(document.getElementById("btnNewDoc" + i + "-" + j)){
					$('#btnNewDoc' + i + "-" + j).remove();
				}
			}
		}
	}
}

function initButton(){
	for(var i = 0; i < 100; i++){
		for(var j = 0; j < 100; j++){
			//初始化点击事件
			$("#btnNewDoc" + i + "-" + j).attr("index", i);
			$("#btnNewDoc" + i + "-" + j).attr("subIndex", j);
			$("#btnNewDoc" + i + "-" + j).on('click', function () {
				btnEventNew($(this).attr('index'), $(this).attr('subIndex'));
		    });
			//初始化启动流程或者提交流程
			$("#btnSubmitAudit" + i + "-" + j).attr("index", i);
			$("#btnSubmitAudit" + i + "-" + j).attr("subIndex", j);
			$("#btnSubmitAudit" + i + "-" + j).on('click', function () {
				btnSubmitAudit($(this).attr('index'), $(this).attr('subIndex'));
		    });
		}
	}
}

function initData(){
	if(g_wizardIndex == 0){
		$('#tableList1-1').empty();
		var editButton = "";
		if(!isBackWizard && parent.g_isEdit == 1 && !parent.g_params.isFinish){
			editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(1, 1, ' + parent.g_params.row.id + ')" style="padding: 4px 15px;">' +  
							'编 辑' + 
						 '</button>'; 
		}
		var html = '<tr>' + 
						'<td class="reference-td" style="border-left-width: 0px;">1</td>' + 
						'<td class="reference-td">' + parent.g_params.row.code + '</td>' + 
						'<td class="reference-td">' + parent.g_params.row.lastHandleUserName + '</td>' + 
						'<td class="reference-td">' + $.date.dateFormat(parent.g_params.row.lastHandleTime, "yyyy-MM-dd") + '</td>' + 
						'<td class="reference-td">' + top.app.getDictName(parent.g_params.row.flowProgress, parent.g_params.flowProgressDict) + '</td>' + 
						'<td class="reference-td" style="border-right-width: 0px;">' + 
							'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(1, 1, ' + parent.g_params.row.id + ')" style="padding: 4px 15px;">' +  
								'查 看' + 
							'</button>' + 
							editButton + 
						'</td>' + 
					'</tr>';
		$('#tableList1-1').append(html);
	}else if(g_wizardIndex == 1){
		addList('tableList2-1', 'tableCnt2-1', '/api/rales/ael/writ/getWritList', 2, 1, rales.writNecessity2_1, '', true);
		addList('tableList2-2', 'tableCnt2-2', '/api/rales/ael/writ/getWritList', 2, 2, rales.writNecessity2_2, '', true);
		addFlowList('tableList2-3', 'tableCnt2-3', '/api/rales/ael/writ/getWritList', 2, 3, rales.writNecessity2_3, '', true);
		addList('tableList2-4', 'tableCnt2-4', '/api/rales/ael/writ/getWritList', 2, 4, rales.writNecessity2_4, '', true);
		addList('tableList2-5', 'tableCnt2-5', '/api/rales/ael/writ/getWritList', 2, 5, rales.writNecessity2_5, '', true);
		addList('tableList2-6', 'tableCnt2-6', '/api/rales/ael/writ/getWritList', 2, 6, rales.writNecessity2_6, '', true);
		addList('tableList2-7', 'tableCnt2-7', '/api/rales/ael/writ/getWritList', 2, 7, rales.writNecessity2_7, '', true);
		addList('tableList2-8', 'tableCnt2-8', '/api/rales/ael/writ/getWritList', 2, 8, rales.writNecessity2_8, '', true);
	}else if(g_wizardIndex == 2){
		addList('tableList3-1', 'tableCnt3-1', '/api/rales/ael/writ/getWritList', 3, 1, rales.writNecessity3_1, '', true);
		addList('tableList3-2', 'tableCnt3-2', '/api/rales/ael/writ/getWritList', 3, 2, rales.writNecessity3_2, '', true);
		addList('tableList3-3', 'tableCnt3-3', '/api/rales/ael/writ/getWritList', 3, 3, rales.writNecessity3_3, '', true);
		addFlowList('tableList3-4', 'tableCnt3-4', '/api/rales/ael/writ/getWritList', 3, 4, rales.writNecessity3_4, '', true);
		addList('tableList3-5', 'tableCnt3-5', '/api/rales/ael/writ/getWritList', 3, 5, rales.writNecessity3_5, '', true);
		addList('tableList3-6', 'tableCnt3-6', '/api/rales/ael/writ/getWritList', 3, 6, rales.writNecessity3_6, '', true);
		addList('tableList3-7', 'tableCnt3-7', '/api/rales/ael/writ/getWritList', 3, 7, rales.writNecessity3_7, '', true);
		addList('tableList3-8', 'tableCnt3-8', '/api/rales/ael/writ/getWritList', 3, 8, rales.writNecessity3_8, '', true);
		addList('tableList3-9', 'tableCnt3-9', '/api/rales/ael/writ/getWritList', 3, 9, rales.writNecessity3_9, '', true);
	}else if(g_wizardIndex == 3){
		addList('tableList4-1', 'tableCnt4-1', '/api/rales/ael/writ/getWritList', 4, 1, rales.writNecessity4_1, '', true);
		addList('tableList4-2', 'tableCnt4-2', '/api/rales/ael/writ/getWritList', 4, 2, rales.writNecessity4_2, '', true);
		addFlowList('tableList4-3', 'tableCnt4-3', '/api/rales/ael/writ/getWritList', 4, 3, rales.writNecessity4_3, '', true);
		addList('tableList4-4', 'tableCnt4-4', '/api/rales/ael/writ/getWritList', 4, 4, rales.writNecessity4_4, '', true);
	}else if(g_wizardIndex == 4){
		//结案报告
		addList('tableList5-1', 'tableCnt5-1', '/api/rales/ael/writ/getWritList', 5, 1, rales.writNecessity5_1, '', true);
	}else if(g_wizardIndex == 5){
		addList('tableList6-1', 'tableCnt6-1', '/api/rales/ael/writ/getWritList', 6, 1, rales.writNecessity6_1, '', true, "案卷封面");
		addList('tableList6-2', 'tableCnt6-2', '/api/rales/ael/writ/getWritList', 6, 2, rales.writNecessity6_2, '', true, "案卷目录");
	}
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
	   		registerId: parent.g_params.row.id,
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
					if(!isBackWizard && addEditBtn && parent.g_isEdit == 1 && !parent.g_params.isFinish){
						editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'编 辑' + 
									 '</button>' + 
									 '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDel(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'删 除' + 
									 '</button>'; 
					}
					html += '<tr>' + 
								'<td class="reference-td" style="border-left-width: 0px;">' + (i+1) + '</td>' + 
								'<td class="reference-td">' + ($.utils.isEmpty(data.rows[i].code) ? codeDefault : data.rows[i].code) + '</td>' + 
								'<td class="reference-td">' + parent.g_params.row.lastHandleUserName + '</td>' + 
								'<td class="reference-td">' + $.date.dateFormat(parent.g_params.row.lastHandleTime, "yyyy-MM-dd") + '</td>' + 
								'<td class="reference-td">' + top.app.getDictName(parent.g_params.row.flowProgress, parent.g_params.flowProgressDict) + '</td>' + 
								'<td class="reference-td" style="border-right-width: 0px;">' + 
									'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'查 看' + 
									'</button>' + 
									editButton + 
								'</td>' + 
							'</tr>';
				}
				$('#' + tableListId).append(html);
				
				//判断是否继续显示新建文书按钮
				if(subIndex == 1){
					if(getTableCnt(index, subIndex) == 1){
						$('#btnNewDoc' + index + '-' + subIndex).remove();
					}
				}
				//只能新建一份行政处罚案卷目录
				if(index == 6 && subIndex == 2){
					if(getTableCnt(index, subIndex) == 1){
						$('#btnNewDoc' + index + '-' + subIndex).remove();
					}
				}
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
	   		registerId: parent.g_params.row.id,
	   		writType: writType,
	   		subType: subType,
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				var flowProgress = "";
				if(index == 2 && subIndex == 3) flowProgress = "案件移送审批流程(立案)";
				if(index == 3 && subIndex == 4) flowProgress = "案件移送审批流程(调查报告)";
				if(index == 4 && subIndex == 3) flowProgress = "不予行政处罚决定审批流程";
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
					if(parent.g_params.row.activityName == '案件移送(立案)编辑' && index == 2 && subIndex == 3)  addEditBtn = true;
					if(parent.g_params.row.activityName == '案件移送(调查报告)编辑' && index == 3 && subIndex == 4)  addEditBtn = true;
					if(parent.g_params.row.activityName == '不予行政处罚决定审批编辑' && index == 4 && subIndex == 3)  addEditBtn = true;
					var editButton = "";
					if(addEditBtn && !parent.g_params.isFinish){
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
	top.app.info.iframe.params = parent.g_params;
	top.app.info.iframe.params.navIndex = 2;
	top.app.info.iframe.params.type = 1;	//1新增 2编辑 3查看
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/necessity/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	parent.location.href = encodeURI(url);
}

//查询
function btnEventDetail(index, subIndex, id){
	//设置传送对象
	top.app.info.iframe.params = parent.g_params;
	top.app.info.iframe.params.navIndex = 2;
	top.app.info.iframe.params.type = 3;	//1新增 2编辑 3查看
	top.app.info.iframe.params.id = id;
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/necessity/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	parent.location.href = encodeURI(url);
}

//编辑
function btnEventEdit(index, subIndex, id){
	//设置传送对象
	top.app.info.iframe.params = parent.g_params;
	top.app.info.iframe.params.navIndex = 2;
	top.app.info.iframe.params.type = 2;
	top.app.info.iframe.params.id = id;
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/necessity/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	parent.location.href = encodeURI(url);
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
					reloadData(g_wizardIndex);
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

//获取表单文书数量
function getTableCnt(index, subIndex){
	let retVal = $('#tableCnt' + index + '-' + subIndex).text();
	if($.utils.isEmpty(retVal)) return 0;
	if(isNaN(retVal)) return 0;
	else return retVal;
}


//启动流程或提交审核
function btnSubmitAudit(index, subIndex){
	top.app.message.confirm("确定要提交审批？", function(){
		var submitData = {}, url = "";
		if(index == 2 && subIndex == 3) {
			url = "/api/rales/ael/case/startCaseTransferFlow1";
			submitData["subFlowProgress"] = "6";
		}
		if(index == 3 && subIndex == 4) {
			url = "/api/rales/ael/case/startCaseTransferFlow2";
			submitData["subFlowProgress"] = "7";
		}
		if(index == 4 && subIndex == 3) {
			url = "/api/rales/ael/case/startNotPunishFlow";
			submitData["subFlowProgress"] = "8";
		}
		if($.utils.isEmpty(parent.g_params.row.associateExecutor)){
			top.app.message.notice("请填写案件第二承办人！");
			return;
		}
		
		//传送案件的流程实例ID
		submitData["caseProcessInstanceId"] = parent.g_params.row.processInstanceId;
		
		submitData["registerId"] = parent.g_params.row.id;
		if(top.app.info.userInfo.userId == parent.g_params.row.associateExecutor)
			submitData["associateExecutor"] = parent.g_params.row.createBy;
		else
			submitData["associateExecutor"] = parent.g_params.row.associateExecutor;

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
		   			parent.location.href = "/rales/ael/case/case-todo.html?_pid=" + pid;
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
	});
}