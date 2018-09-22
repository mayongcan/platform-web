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
		for(var i = 0; i < 100; i++){
			for(var j = 0; j < 100; j++){
				if(document.getElementById("btnNewDoc" + i + "-" + j)){
					$('#btnNewDoc' + i + "-" + j).remove();
				}
				if(document.getElementById("btnSubmitAudit" + i + "-" + j)){
					$('#btnSubmitAudit' + i + "-" + j).remove();
				}
			}
		}
		$("#btnNewDoc1-2-1").remove();
		$("#btnNewDoc1-2-2").remove();
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
	$("#optionalFlow9").click(function () {
		setTabStatus('9');
    });
	$("#optionalFlow10").click(function () {
		setTabStatus('10');
    });
	$("#optionalFlow11").click(function () {
		setTabStatus('11');
    });
	$("#optionalFlow12").click(function () {
		setTabStatus('12');
    });
	//电力执法系统才有销案模块
	if(top.app.info.tenantsInfo.tenantsName != '电力执法系统'){
		$("#optionalFlow11").remove();
	}
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
		for(var i = 1; i <= 20; i++){
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
	$("#btnNewDoc1-2-1").click(function () {
		//显示日常巡查记录表
		//设置参数
		var params = {};
		params.registerId = parent.g_params.row.id;
		top.app.layer.editLayer('纳入巡查记录', ['900px', '550px'], '/rales/ael/case/optional/routine-list.html', params, function(retParams){
			initData();
		});
    });
	//现场检查记录表
	$("#btnNewDoc1-2-2").click(function () {
		btnEventNew(1, 2);
    });
	
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
	if(g_optionalFlowIndex == '1'){
		addFlowList('tableList1-1', 'tableCnt1-1', '/api/rales/ael/writ/getWritList', 1, 1, rales.writOptional1_1, '', true);
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
	}else if(g_optionalFlowIndex == '2'){
		addFlowList('tableList2-1', 'tableCnt2-1', '/api/rales/ael/writ/getWritList', 2, 1, rales.writOptional2_1, '', true);
		addList('tableList2-2', 'tableCnt2-2', '/api/rales/ael/writ/getWritList', 2, 2, rales.writOptional2_2, '', true);
		addList('tableList2-3', 'tableCnt2-3', '/api/rales/ael/writ/getWritList', 2, 3, rales.writOptional2_3, '', true);
	}else if(g_optionalFlowIndex == '3'){
		addFlowList('tableList3-1', 'tableCnt3-1', '/api/rales/ael/writ/getWritList', 3, 1, rales.writOptional3_1, '', true);
		addList('tableList3-2', 'tableCnt3-2', '/api/rales/ael/writ/getWritList', 3, 2, rales.writOptional3_2, '', true);
		addList('tableList3-3', 'tableCnt3-3', '/api/rales/ael/writ/getWritList', 3, 3, rales.writOptional3_3, '', true);
		addList('tableList3-4', 'tableCnt3-4', '/api/rales/ael/writ/getWritList', 3, 4, rales.writOptional3_4, '', true);
		addList('tableList3-5', 'tableCnt3-5', '/api/rales/ael/writ/getWritList', 3, 5, rales.writOptional3_5, '', true);
		addList('tableList3-6', 'tableCnt3-6', '/api/rales/ael/writ/getWritList', 3, 6, rales.writOptional3_6, '', true);
		addList('tableList3-7', 'tableCnt3-7', '/api/rales/ael/writ/getWritList', 3, 7, rales.writOptional3_7, '', true);
		addList('tableList3-8', 'tableCnt3-8', '/api/rales/ael/writ/getWritList', 3, 8, rales.writOptional3_8, '', true);
		addList('tableList3-9', 'tableCnt3-9', '/api/rales/ael/writ/getWritList', 3, 9, rales.writOptional3_9, '', true);
		addList('tableList3-10', 'tableCnt3-10', '/api/rales/ael/writ/getWritList', 3, 10, rales.writOptional3_10, '', true);
		addList('tableList3-11', 'tableCnt3-11', '/api/rales/ael/writ/getWritList', 3, 11, rales.writOptional3_11, '', true);
		addList('tableList3-12', 'tableCnt3-12', '/api/rales/ael/writ/getWritList', 3, 12, rales.writOptional3_12, '', true);
	}else if(g_optionalFlowIndex == '4'){
		addList('tableList4-1', 'tableCnt4-1', '/api/rales/ael/writ/getWritList', 4, 1, rales.writOptional4_1, '', true);
		addList('tableList4-2', 'tableCnt4-2', '/api/rales/ael/writ/getWritList', 4, 2, rales.writOptional4_2, '', true);
	}else if(g_optionalFlowIndex == '5'){
		addList('tableList5-1', 'tableCnt5-1', '/api/rales/ael/writ/getWritList', 5, 1, rales.writOptional5_1, '', true);
	}else if(g_optionalFlowIndex == '6'){
		addFlowList('tableList6-1', 'tableCnt6-1', '/api/rales/ael/writ/getWritList', 6, 1, rales.writOptional6_1, '', true);
	}else if(g_optionalFlowIndex == '7'){
		addFlowList('tableList7-1', 'tableCnt7-1', '/api/rales/ael/writ/getWritList', 7, 1, rales.writOptional7_1, '', true);
		addList('tableList7-2', 'tableCnt7-2', '/api/rales/ael/writ/getWritList', 7, 2, rales.writOptional7_2, '', true);
		addList('tableList7-3', 'tableCnt7-3', '/api/rales/ael/writ/getWritList', 7, 3, rales.writOptional7_3, '', true);
		addList('tableList7-4', 'tableCnt7-4', '/api/rales/ael/writ/getWritList', 7, 4, rales.writOptional7_4, '', true);
		addList('tableList7-5', 'tableCnt7-5', '/api/rales/ael/writ/getWritList', 7, 5, rales.writOptional7_5, '', true);
	}else if(g_optionalFlowIndex == '8'){
		addList('tableList8-1', 'tableCnt8-1', '/api/rales/ael/writ/getWritList', 8, 1, rales.writOptional8_1, '', true);
	}else if(g_optionalFlowIndex == '9'){
		addFlowList('tableList9-1', 'tableCnt9-1', '/api/rales/ael/writ/getWritList', 9, 1, rales.writOptional9_1, '', true);
		addFlowList('tableList9-2', 'tableCnt9-2', '/api/rales/ael/writ/getWritList', 9, 2, rales.writOptional9_2, '', true);
		addList('tableList9-3', 'tableCnt9-3', '/api/rales/ael/writ/getWritList', 9, 3, rales.writOptional9_3, '', true);
	}else if(g_optionalFlowIndex == '10'){
		addFlowList('tableList10-1', 'tableCnt10-1', '/api/rales/ael/writ/getWritList', 10, 1, rales.writOptional10_1, '', true);
		addList('tableList10-2', 'tableCnt10-2', '/api/rales/ael/writ/getWritList', 10, 2, rales.writOptional10_2, '', true);
		addList('tableList10-3', 'tableCnt10-3', '/api/rales/ael/writ/getWritList', 10, 3, rales.writOptional10_3, '', true);
		addList('tableList10-4', 'tableCnt10-4', '/api/rales/ael/writ/getWritList', 10, 4, rales.writOptional10_4, '', true);
	}else if(g_optionalFlowIndex == '11'){
		addFlowList('tableList11-1', 'tableCnt11-1', '/api/rales/ael/writ/getWritList', 11, 1, rales.writOptional11_1, '', true);
		addList('tableList11-2', 'tableCnt11-2', '/api/rales/ael/writ/getWritList', 11, 2, rales.writOptional11_2, '', true);
	}else if(g_optionalFlowIndex == '12'){
		addFlowList('tableList12-1', 'tableCnt12-1', '/api/rales/ael/writ/getWritList', 12, 1, rales.writOptional12_1, '', true);
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
					if(!parent.g_params.isFinish){
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
				if(index == 1 && subIndex == 1) flowProgress = "行政检查登记流程";
				if(index == 2 && subIndex == 1) flowProgress = "先行登记保存证据审批流程";
				if(index == 3 && subIndex == 1) flowProgress = "行政强制措施及相关事项内部审批流程";
				if(index == 6 && subIndex == 1) flowProgress = "行政处罚决定法制审核流程";
				if(index == 7 && subIndex == 1) flowProgress = "听证审批流程";
				if(index == 9 && subIndex == 1) flowProgress = "行政处罚没收财物处理审批流程";
				if(index == 9 && subIndex == 2) flowProgress = "行政处罚延期（分期）缴纳罚款审批流程";
				if(index == 10 && subIndex == 1) flowProgress = "行政强制执行及相关事项内部审批流程";
				if(index == 11 && subIndex == 1) flowProgress = "销案审批流程";
				if(index == 12 && subIndex == 1) flowProgress = "内部呈批流程";
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
					if(parent.g_params.row.activityName == '行政检查编辑' && index == 1 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '先行登记保存证据审批编辑' && index == 2 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '行政强制措施及相关事项内部审批编辑' && index == 3 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '行政处罚决定法制审核编辑' && index == 6 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '听证审批表编辑' && index == 7 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '行政处罚没收财物处理审批编辑' && index == 9 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '行政处罚延期（分期）缴纳罚款审批编辑' && index == 9 && subIndex == 2)  addEditBtn = true;
					if(parent.g_params.row.activityName == '行政强制执行及相关事项内部审批编辑' && index == 10 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '销案审批编辑' && index == 11 && subIndex == 1)  addEditBtn = true;
					if(parent.g_params.row.activityName == '审批编辑' && index == 12 && subIndex == 1)  addEditBtn = true;
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
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	parent.location.href = encodeURI(url);
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
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
	parent.location.href = encodeURI(url);
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
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/optional/writ" + index + "_" + subIndex + ".html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
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
					initButton();
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
		if(index == 1 && subIndex == 1) {
			url = "/api/rales/ael/case/startAdminCheckFlow1";
			submitData["subFlowProgress"] = "10";
		}
		if(index == 2 && subIndex == 1) {
			url = "/api/rales/ael/case/startFirstRegisterFlow1";
			submitData["subFlowProgress"] = "12";
		}
		if(index == 3 && subIndex == 1) {
			url = "/api/rales/ael/case/startCoerciveMeasuresFlow1";
			submitData["subFlowProgress"] = "14";
		}
		if(index == 6 && subIndex == 1) {
			url = "/api/rales/ael/case/startAdminPunishAuditFlow";
			submitData["subFlowProgress"] = "16";
		}
		if(index == 7 && subIndex == 1) {
			url = "/api/rales/ael/case/startHearingAuditFlow";
			submitData["subFlowProgress"] = "17";
		}
		if(index == 9 && subIndex == 1) {
			url = "/api/rales/ael/case/startAdminPunishHandleFlow";
			submitData["subFlowProgress"] = "18";
		}
		if(index == 9 && subIndex == 2) {
			url = "/api/rales/ael/case/startAdminPunishDeferFlow";
			submitData["subFlowProgress"] = "19";
		}
		if(index == 10 && subIndex == 1) {
			url = "/api/rales/ael/case/startAdminCoerciveExecuteFlow";
			submitData["subFlowProgress"] = "20";
		}
		if(index == 11 && subIndex == 1) {
			url = "/api/rales/ael/case/startCloseCaseFlow";
			submitData["subFlowProgress"] = "21";
		}
		if(index == 12 && subIndex == 1) {
			url = "/api/rales/ael/case/startInteriorAuditFlow";
			submitData["subFlowProgress"] = "22";
		}

		if($.utils.isEmpty(parent.g_params.row.associateExecutor)){
			top.app.message.notice("请填写案件第二承办人！");
			return;
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