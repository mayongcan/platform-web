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
	//立案审批表
	$("#btnNewDoc2-1").click(function () {
		btnEventNew(2, 1);
    });
	//立案通知书
	$("#btnNewDoc2-2").click(function () {
		btnEventNew(2, 2);
    });
	//立案移送通知书
	$("#btnNewDoc2-3").click(function () {
		btnEventNew(2, 3);
    });
	//案件调查报告
	$("#btnNewDoc3-1").click(function () {
		btnEventNew(3, 1);
    });
	//行政处罚告知书
	$("#btnNewDoc3-2").click(function () {
		btnEventNew(3, 2);
    });
	//行政处罚听证告知书
	$("#btnNewDoc3-3").click(function () {
		btnEventNew(3, 3);
    });
	//行政处罚审批表
	$("#btnNewDoc4-1").click(function () {
		btnEventNew(4, 1);
    });
	//当场行政处罚决定书
	$("#btnNewDoc4-2").click(function () {
		btnEventNew(4, 2);
    });
	//行政处罚决定书
	$("#btnNewDoc4-3").click(function () {
		btnEventNew(4, 3);
    });
	//结案报告
	$("#btnNewDoc5-1").click(function () {
		btnEventNew(5, 1);
    });
	//行政执法案卷
	$("#btnNewDoc6-1").click(function () {
		btnEventNew(6, 1);
    });
	// 案卷目录
	$("#btnNewDoc6-2").click(function () {
		if(parseInt($('#tableCnt6-2').text()) == 1){
   			top.app.message.notice("案卷目录只能创建一份！");
   			return;
		}
		btnEventNew(6, 2);
    });
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
		//立案审批表列表
		addList('tableList2-1', 'tableCnt2-1', '/api/rales/ael/case/getCaseFilingList', 2, 1, true);
		//立案通知书列表
		addList('tableList2-2', 'tableCnt2-2','/api/rales/ael/case/getCaseFilingNoticeList', 2, 2, true);
		//案件移送通知书列表
		addList('tableList2-3', 'tableCnt2-3','/api/rales/ael/case/getCaseTranserNoticeList', 2, 3, true);
	}else if(g_wizardIndex == 2){
		//案件调查报告
		addList('tableList3-1', 'tableCnt3-1', '/api/rales/ael/case/getCaseReportList', 3, 1, true);
		//行政处罚告知书
		addList('tableList3-2', 'tableCnt3-2','/api/rales/ael/case/getPunishNoticeList', 3, 2, true);
		//行政处罚听证告知书
		addList('tableList3-3', 'tableCnt3-3','/api/rales/ael/case/getPunishNoticeList', 3, 3, true);
	}else if(g_wizardIndex == 3){
		//行政处罚审批表
		addList('tableList4-1', 'tableCnt4-1', '/api/rales/ael/case/getPunishAuditList', 4, 1, true);
		//当场行政处罚决定书
		addList('tableList4-2', 'tableCnt4-2','/api/rales/ael/case/getCurPunishDecisionList', 4, 2, true);
		//行政处罚决定书
		addList('tableList4-3', 'tableCnt4-3','/api/rales/ael/case/getPunishDecisionList', 4, 3, true);
	}else if(g_wizardIndex == 4){
		//结案报告
		addList('tableList5-1', 'tableCnt5-1', '/api/rales/ael/case/getCaseClosedList', 5, 1, true);
	}else if(g_wizardIndex == 5){
		//行政执法案卷
		addList('tableList6-1', 'tableCnt6-1', '/api/rales/ael/case/getCaseVolumeList', 6, 1, true);
		//案卷目录
		addList('tableList6-2', 'tableCnt6-2', '/api/rales/ael/case/getCaseCatalogList', 6, 2, true, "案卷目录");
	}
}

//添加列表内容
function addList(tableListId, tableCntId, url, index, subIndex, addEditBtn, codeDefault){
	$('#' + tableListId).empty();
	var html = "";
	var tableType = "";
	if(index == 3 && subIndex == 2) tableType = "1";
	if(index == 3 && subIndex == 3) tableType = "2";
	$.ajax({
		url: top.app.conf.url.apigateway + url,
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: parent.g_params.row.id,
	   		tableType: tableType
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
				//只能新建一份立案通知书
				if(index == 2 && subIndex == 2){
					if(getTableCnt(index, subIndex) == 1){
						$('#btnNewDoc' + index + '-' + subIndex).remove();
					}
				}
				//只能新建一份行政处罚告知书
				if(index == 3 && subIndex == 2){
					if(getTableCnt(index, subIndex) == 1){
						$('#btnNewDoc' + index + '-' + subIndex).remove();
					}
				}
				//只能新建一份行政处罚听证告知书
				if(index == 3 && subIndex == 3){
					if(getTableCnt(index, subIndex) == 1){
						$('#btnNewDoc' + index + '-' + subIndex).remove();
					}
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
	parent.location.href = encodeURI(getShowOrEditUrl(index, subIndex));
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
	parent.location.href = encodeURI(getShowOrEditUrl(index, subIndex));
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
	parent.location.href = encodeURI(getShowOrEditUrl(index, subIndex));
}

function getShowOrEditUrl(index, subIndex){
	var url = "";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	if(index == 1 && subIndex == 1){
		url = "/rales/ael/case/necessity/case-register.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 1){
		url = "/rales/ael/case/necessity/put-on-record-audit.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 2){
		url = "/rales/ael/case/necessity/put-on-record-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 2 && subIndex == 3){
		url = "/rales/ael/case/necessity/case-tran-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 3 && subIndex == 1){
		url = "/rales/ael/case/necessity/case-survey-report.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 3 && subIndex == 2){
		url = "/rales/ael/case/necessity/punish-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 3 && subIndex == 3){
		url = "/rales/ael/case/necessity/punish-hearing-notice.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 4 && subIndex == 1){
		url = "/rales/ael/case/necessity/punish-audit.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 4 && subIndex == 2){
		url = "/rales/ael/case/necessity/cur-punish-decision.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 4 && subIndex == 3){
		url = "/rales/ael/case/necessity/punish-decision.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 5 && subIndex == 1){
		url = "/rales/ael/case/necessity/case-end-report.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 1){
		url = "/rales/ael/case/necessity/case-volume.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	}else if(index == 6 && subIndex == 2){
		url = "/rales/ael/case/necessity/case-catalog.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
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

//获取表单文书数量
function getTableCnt(index, subIndex){
	let retVal = $('#tableCnt' + index + '-' + subIndex).text();
	if($.utils.isEmpty(retVal)) return 0;
	if(isNaN(retVal)) return 0;
	else return retVal;
}