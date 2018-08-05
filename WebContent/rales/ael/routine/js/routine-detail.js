var g_params = {}, g_backUrl = "", g_btnType = 1, g_dataListArray = [];
$(function () {
//	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	g_backUrl = g_params.backUrl;
	initView();
	initNavButton();
	initData();
});

function initView(){
	//设置顶部显示
	$('#caseRegisterCode').text(g_params.row.otherFlowParams.code);
	$('#flowProgressName').text("行政检查登记流程");
	if(g_params.row.activityName == '行政检查编辑' || g_params.row.activityName == '行政检查草稿'){
		$('#btnAudit').text("提交");
		$('#flowProgressNotice').text("待编辑，请编辑后提交审批！");
		g_btnType = 4;
	}else{
		g_btnType = 1;
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
				$("#btnNewDoc" + i + "-" + j).remove();
			}
		}
	}
}

function initNavButton(){
	//审批按钮点击
	$('#btnAudit').click(function () {
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
		top.app.info.iframe.params = g_params;
		top.app.info.iframe.params.navIndex = 1;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/rales/ael/case/audit/audit-11.html?_pid=" + pid + "&backUrl=" + g_backUrl + "&cancelUrl=/rales/ael/routine/routine-detail.html";
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
						editButton = '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + index + ', ' + subIndex + ', ' + data.rows[i].id + ')" style="padding: 4px 15px;">' +  
										'编 辑' + 
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

//新增
function btnEventNew(index, subIndex){
	//设置传送对象
	top.app.info.iframe.params = g_params;
	top.app.info.iframe.params.navIndex = 3;
	top.app.info.iframe.params.subIndex = index;
	top.app.info.iframe.params.type = 1;	//1新增 2编辑 3查看
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
	top.app.info.iframe.params.subRow = getSubRow(subIndex, id);
	//iframe上层跳转
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/routine/routine-detail.html";
	location.href = encodeURI(url);
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