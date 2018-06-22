var g_optionalFlowIndex = '1', g_dataListArray = [];

$(function () {
	//初始化功能按钮点击事件
	initFuncBtnEvent();
	initButton();
	initData();

	//切换选项
	var subIndex = $.utils.getUrlParam(window.location.search,"subIndex");
	if(subIndex != null && subIndex != undefined && $.utils.isInteger(subIndex)){
		setTabStatus(subIndex + '');
	}

	//判断是否完结,如果是，则移除所有新建文书的按钮
	if(parent.g_params.isFinish){
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				if(document.getElementById("btnNewDoc" + i + "-" + j)){
					$('#btnNewDoc' + i + "-" + j).remove();
				}
			}
		}
		$("#btnNewDoc1-1-1").remove();
		$("#btnNewDoc1-1-2").remove();
	}
});

function initFuncBtnEvent(){
	$("#optionalFlow1").click(function () {
		setTabStatus('1');
    });
	$("#optionalFlow2").click(function () {
		setTabStatus('2');
    });
	$("#optionalFlow3").click(function () {
		setTabStatus('3');
    });
	$("#optionalFlow4").click(function () {
		setTabStatus('4');
    });
	$("#optionalFlow5").click(function () {
		setTabStatus('5');
    });
	$("#optionalFlow6").click(function () {
		setTabStatus('6');
    });
	$("#optionalFlow7").click(function () {
		setTabStatus('7');
    });
	$("#optionalFlow8").click(function () {
		setTabStatus('8');
    });
}

/**
 * 切换tab状态
 * @param index
 * @returns
 */
function setTabStatus(index){
	//判断当前状态
	if(g_optionalFlowIndex == index) return;
	else{
		parent.document.getElementById('case-iframe').style.height = '0px';
		
		$("#optionalFlow" + index).addClass('btn-primary');
		$("#optionalFlow" + index).removeClass('btn-outline');
		$("#optionalFlow" + index).removeClass('btn-default');
		//显示内容
		$("#optionalContent" + index).addClass('activity');
		var nIndex = parseInt(index);
		for(var i = 1; i <= 8; i++){
			if(i == nIndex) continue;
			var tmpVal = i + "";
			if(g_optionalFlowIndex == tmpVal){
				$("#optionalFlow" + tmpVal).addClass('btn-outline');
				$("#optionalFlow" + tmpVal).addClass('btn-default');
				$("#optionalFlow" + tmpVal).removeClass('btn-primary');
				
				$("#optionalContent" + tmpVal).removeClass('activity');
			}
		}
		g_optionalFlowIndex = index;
		
		//重新计算当前页面的高度，用于iframe
        parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
		initData();
	}
}

function initButton(){
	//纳入巡查记录
	$("#btnNewDoc1-1-1").click(function () {
		//显示日常巡查记录表
		//设置参数
		var params = {};
		params.registerId = parent.g_params.row.id;
		top.app.layer.editLayer('纳入巡查记录', ['900px', '550px'], '/rales/ael/case/optional/routine-list.html', params, function(retParams){
			initData();
		});
    });
	//现场检查记录表
	$("#btnNewDoc1-1-2").click(function () {
		btnEventNew(1, 1);
    });
	//调查笔录
	$("#btnNewDoc1-2").click(function () {
		btnEventNew(1, 2);
    });
	//调取证据材料通知书
	$("#btnNewDoc1-3").click(function () {
		btnEventNew(1, 3);
    });
	//询问通知书
	$("#btnNewDoc1-4").click(function () {
		btnEventNew(1, 4);
    });
	//案件协助调查函
	$("#btnNewDoc1-5").click(function () {
		btnEventNew(1, 5);
    });
	//责令（限期）改正通知书
	$("#btnNewDoc1-6").click(function () {
		btnEventNew(1, 6);
    });
	//证据保存措施审批表
	$("#btnNewDoc2-1").click(function () {
		btnEventNew(2, 1);
    });
	//案件证据保存决定书
	$("#btnNewDoc2-2").click(function () {
		btnEventNew(2, 2);
    });
	//物品清单
	$("#btnNewDoc2-3").click(function () {
    });
	//委托保管书
	$("#btnNewDoc2-4").click(function () {
		btnEventNew(2, 4);
    });
	//解除证据保存措施决定书
	$("#btnNewDoc2-5").click(function () {
		btnEventNew(2, 5);
    });
	//鉴定（检验）委托书
	$("#btnNewDoc3-1").click(function () {
		btnEventNew(3, 1);
    });
	//集体讨论笔录
	$("#btnNewDoc4-1").click(function () {
		btnEventNew(4, 1);
    });
	//当事人陈述申辩笔录
	$("#btnNewDoc5-1").click(function () {
		btnEventNew(5, 1);
    });
	//听证审批表
	$("#btnNewDoc6-1").click(function () {
		btnEventNew(6, 1);
    });
	//听证会通知书
	$("#btnNewDoc6-2").click(function () {
		btnEventNew(6, 2);
    });
	//听证笔录
	$("#btnNewDoc6-3").click(function () {
		btnEventNew(6, 3);
    });
	//不予听证通知书
	$("#btnNewDoc6-4").click(function () {
		btnEventNew(6, 4);
    });
	//听证报告书
	$("#btnNewDoc6-5").click(function () {
		btnEventNew(6, 5);
    });
	//执行申请书（一）
	$("#btnNewDoc7-1").click(function () {
		btnEventNew(7, 1);
    });
	//执行申请书（二）
	$("#btnNewDoc7-2").click(function () {
		btnEventNew(7, 2);
    });
	//执行申请书（三）
	$("#btnNewDoc7-3").click(function () {
		btnEventNew(7, 3);
    });
	//送达回证
	$("#btnNewDoc8-1").click(function () {
		btnEventNew(8, 1);
    });
	
	//启动流程或者提交流程
	$("#btnSubmitAudit2-1").click(function () {
		btnSubmitAudit(2, 1);
    });
	$("#btnSubmitAudit6-1").click(function () {
		btnSubmitAudit(6, 1);
    });
	$("#btnSubmitAudit6-5").click(function () {
		btnSubmitAudit(6, 5);
    });
}


function initData(){
	if(g_optionalFlowIndex == '1'){
		addList('tableList1-1', 'tableCnt1-1', '/api/rales/ael/case/getSceneCheckRecordList', 1, 1, true);
		addList('tableList1-2', 'tableCnt1-2','/api/rales/ael/case/getInquiryRecordList', 1, 2, true, "调查笔录");
		addList('tableList1-3', 'tableCnt1-3','/api/rales/ael/case/getForensicMaterialsList', 1, 3, true);
		addList('tableList1-4', 'tableCnt1-4','/api/rales/ael/case/getInquiryNoticeList', 1, 4, true);
		addList('tableList1-5', 'tableCnt1-5','/api/rales/ael/case/getAssistInquiryList', 1, 5, true);
		addList('tableList1-6', 'tableCnt1-6','/api/rales/ael/case/getOrderCorrectList', 1, 6, true);
	}else if(g_optionalFlowIndex == '2'){
		addFlowList('tableList2-1', 'tableCnt2-1', '/api/rales/ael/case/getEvidencePreserveList', 2, 1, false);
		addList('tableList2-2', 'tableCnt2-2','/api/rales/ael/case/getEvidencePreserveDecisionList', 2, 2, true);
		//addList('tableList2-3', 'tableCnt2-3','/api/rales/ael/case/getEvidenceGoodsList', 2, 3, true);
		addList('tableList2-4', 'tableCnt2-4','/api/rales/ael/case/getDelegationStorageList', 2, 4, true);
		addList('tableList2-5', 'tableCnt2-5','/api/rales/ael/case/getRemoveEvidencePreserveDecisionList', 2, 5, true);
	}else if(g_optionalFlowIndex == '3'){
		addList('tableList3-1', 'tableCnt3-1', '/api/rales/ael/case/getAuthDelegationList', 3, 1, true);
	}else if(g_optionalFlowIndex == '4'){
		addList('tableList4-1', 'tableCnt4-1', '/api/rales/ael/case/getCollectiveRecordList', 4, 1, true, "集体讨论笔录");
	}else if(g_optionalFlowIndex == '5'){
		addList('tableList5-1', 'tableCnt5-1', '/api/rales/ael/case/getPleadRecordList', 5, 1, true, "当事人陈述和申辩笔录");
	}else if(g_optionalFlowIndex == '6'){
		addFlowList('tableList6-1', 'tableCnt6-1', '/api/rales/ael/case/getHearingAuditList', 6, 1, false);
		addList('tableList6-2', 'tableCnt6-2','/api/rales/ael/case/getHearingNoticeList', 6, 2, true);
		addList('tableList6-3', 'tableCnt6-3','/api/rales/ael/case/getHearingRecordList', 6, 3, true, "听证笔录");
		addList('tableList6-4', 'tableCnt6-4','/api/rales/ael/case/getNoHearingList', 6, 4, true);
		addFlowList('tableList6-5', 'tableCnt6-5','/api/rales/ael/case/getHearingReportList', 6, 5, false);
	}else if(g_optionalFlowIndex == '7'){
		addList('tableList7-1', 'tableCnt7-1', '/api/rales/ael/case/getImplementList', 7, 1, true);
		addList('tableList7-2', 'tableCnt7-2','/api/rales/ael/case/getImplementList', 7, 2, true);
		addList('tableList7-3', 'tableCnt7-3','/api/rales/ael/case/getImplementList', 7, 3, true);
	}else if(g_optionalFlowIndex == '8'){
		addList('tableList8-1', 'tableCnt8-1', '/api/rales/ael/case/getReceiptList', 8, 1, true);
	}
}

//添加列表内容
function addList(tableListId, tableCntId, url, index, subIndex, addEditBtn, codeDefault){
	$('#' + tableListId).empty();
	var html = "";
	var type = "";
	if(index == 7 && subIndex == 1) type = "1";
	if(index == 7 && subIndex == 2) type = "2";
	if(index == 7 && subIndex == 3) type = "3";
	$.ajax({
		url: top.app.conf.url.apigateway + url,
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: parent.g_params.row.id,
	   		type: type
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				g_dataListArray[subIndex] = data.rows;
				var length = data.rows.length;
				$('#' + tableCntId).text(length);
				for(var i = 0; i < length; i++){
					var editButton = "";
					if(!parent.g_params.isFinish){
						editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'编 辑' + 
									 '</button>'; 
					}
					html += '<tr>' + 
								'<td class="reference-td">' + (i+1) + '</td>' + 
								'<td class="reference-td">' + ($.utils.isEmpty(data.rows[i].code) ? codeDefault : data.rows[i].code) + '</td>' + 
								'<td class="reference-td">' + parent.g_params.row.lastHandleUserName + '</td>' + 
								'<td class="reference-td">' + $.date.dateFormat(parent.g_params.row.lastHandleTime, "yyyy-MM-dd") + '</td>' + 
								'<td class="reference-td">' + top.app.getDictName(parent.g_params.row.flowProgress, parent.g_params.flowProgressDict) + '</td>' + 
								'<td class="reference-td">' + 
									'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'查 看' + 
									'</button>' + 
									editButton + 
								'</td>' + 
							'</tr>';
				}
				$('#' + tableListId).append(html);
				//重新计算当前页面的高度，用于iframe
		        parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
	   		}
        }
	});
} 


//添加列表内容
function addFlowList(tableListId, tableCntId, url, index, subIndex, addEditBtn, codeDefault){
	$('#' + tableListId).empty();
	var html = "";
	$.ajax({
		url: top.app.conf.url.apigateway + url,
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: parent.g_params.row.id,
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				var flowProgress = "";
				if(index == 2 && subIndex == 1) flowProgress = "证据保全措施审批流程";
				if(index == 6 && subIndex == 1) flowProgress = "听证审批流程";
				if(index == 6 && subIndex == 5) flowProgress = "听证报告书审批流程";
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
					if(parent.g_params.row.activityName == '决议书编辑' && index == 2 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '听证审批表编辑' && index == 6 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '听证报告书编辑' && index == 6 && subIndex == 5)  addEditBtn = true;
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
				//重新计算当前页面的高度，用于iframe
		        parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
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
	top.app.info.iframe.params = parent.g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 1;	//1新增 2编辑 3查看
	parent.location.href = encodeURI(getShowOrEditUrl(index, subIndex));
}

//查询
function btnEventDetail(index, subIndex, id){
	//设置传送对象
	top.app.info.iframe.params = parent.g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 3;	//1新增 2编辑 3查看
	top.app.info.iframe.params.id = id;
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	parent.location.href = encodeURI(getShowOrEditUrl(index, subIndex));
}

//编辑
function btnEventEdit(index, subIndex, id){
	//设置传送对象
	top.app.info.iframe.params = parent.g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 2;
	top.app.info.iframe.params.id = id;
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	parent.location.href = encodeURI(getShowOrEditUrl(index, subIndex));
}

function getShowOrEditUrl(index, subIndex){
	var url = "";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	if(index == 1 && subIndex == 1){
		url = "/rales/ael/case/optional/scene-check-record.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 1 && subIndex == 2){
		url = "/rales/ael/case/optional/investigative-record.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 1 && subIndex == 3){
		url = "/rales/ael/case/optional/obtain-evidence-materials-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 1 && subIndex == 4){
		url = "/rales/ael/case/optional/inquiry-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 1 && subIndex == 5){
		url = "/rales/ael/case/optional/case-assist-inquiry.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 1 && subIndex == 6){
		url = "/rales/ael/case/optional/instruct-to-correct-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 1){
		url = "/rales/ael/case/optional/evidence-preserve-audit.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 2){
		url = "/rales/ael/case/optional/evidence-preserve-decision.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 3){
		
	}else if(index == 2 && subIndex == 4){
		url = "/rales/ael/case/optional/delegation-storage.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 5){
		url = "/rales/ael/case/optional/remove-evidence-preserve-decision.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 3 && subIndex == 1){
		url = "/rales/ael/case/optional/auth-delegation.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 4 && subIndex == 1){
		url = "/rales/ael/case/optional/collective-discuss-record.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 5 && subIndex == 1){
		url = "/rales/ael/case/optional/parties-justify-record.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 1){
		url = "/rales/ael/case/optional/hearing-audit.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 2){
		url = "/rales/ael/case/optional/hearing-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 3){
		url = "/rales/ael/case/optional/hearing-record.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 4){
		url = "/rales/ael/case/optional/no-hearing-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 5){
		url = "/rales/ael/case/optional/hearing-report.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 7 && subIndex == 1){
		url = "/rales/ael/case/optional/perform-application-1.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 7 && subIndex == 2){
		url = "/rales/ael/case/optional/perform-application-2.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 7 && subIndex == 3){
		url = "/rales/ael/case/optional/perform-application-3.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 8 && subIndex == 1){
		url = "/rales/ael/case/optional/delivery-evidence.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}
	return url;
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
		if(index == 2 && subIndex == 1){
			url = "/api/rales/ael/case/startEvidencePreserveFlow";
			submitData["subFlowProgress"] = "10";
		}else if(index == 6 && subIndex == 1){
			url = "/api/rales/ael/case/startHearingAudit";
			submitData["subFlowProgress"] = "11";
		}else if(index == 6 && subIndex == 5){
			url = "/api/rales/ael/case/startHearingReport";
			submitData["subFlowProgress"] = "12";
		}
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