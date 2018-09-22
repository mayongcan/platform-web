var $table1 = $('#tableList1'), $table2 = $('#tableList2'), $table3 = $('#tableList3'), $table4 = $('#tableList4');
var g_flowProgressDict = [], g_caseSourceDict = [], g_caseTypeDict = [], g_typeDict = [], g_sourceDict = [], g_sexDict = [];

$(function () {
	g_flowProgressDict = top.app.getDictDataByDictTypeValue('AEL_CASE_FLOW_PROCEDURE');
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CLUE');
	g_caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
	g_typeDict = top.app.getDictDataByDictTypeValue('RALES_CRL_TYPE');
	g_sourceDict = top.app.getDictDataByDictTypeValue('RALES_CRL_SOURCE');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	//初始化列表信息
	initTable1();
	initTable2();
	initTable3();
	initTable4();
});

function initTable1(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
        };
        return param;
    };
    //初始化列表
    $table1.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseTodoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 350,
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table1, row, $el);
        }
    });
}


function serialNumberTable1(value,row,index){
    return appTable.tableFormatSerialNumber($table1, index);
}

function tableFormatFlowProgress1(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return appTable.tableFormatDictValue(g_flowProgressDict, value);
	else{
		if(row.subFlowProgress == '6') return "案件移送审批流程(立案)";
		else if(row.subFlowProgress == '7') return "案件移送审批流程(调查报告)";
		else if(row.subFlowProgress == '8') return "不予行政处罚决定审批流程";
		else if(row.subFlowProgress == '10') return "行政检查登记流程";
		else if(row.subFlowProgress == '11') return "行政检查登记流程";
		else if(row.subFlowProgress == '12') return "先行登记保存证据审批流程";
		else if(row.subFlowProgress == '13') return "先行登记保存证据审批流程";
		else if(row.subFlowProgress == '14') return "行政强制措施及相关事项内部审批";
		else if(row.subFlowProgress == '15') return "行政强制措施及相关事项内部审批";
		else if(row.subFlowProgress == '16') return "行政处罚决定法制审核流程";
		else if(row.subFlowProgress == '17') return "听证审批流程";
		else if(row.subFlowProgress == '18') return "行政处罚没收财物处理审批";
		else if(row.subFlowProgress == '19') return "行政处罚延期（分期）缴纳罚款审批";
		else if(row.subFlowProgress == '20') return "行政强制执行及相关事项内部审批";		
		else if(row.subFlowProgress == '21') return "销案审批流程";	
		else if(row.subFlowProgress == '22') return "内部呈批流程";	
	}
}

function tableFormatHandleUserName1(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return row.lastHandleUserName;
	else{
		return row.otherFlowParams.lastHandleUserName;
	}
}

function tableFormatHandleTime1(value, row) {
	if($.utils.isEmpty(row.subFlowProgress))
		return $.date.dateFormat(row.lastHandleTime, "yyyy-MM-dd");
	else{
		return $.date.dateFormat(row.otherFlowParams.lastHandleTime, "yyyy-MM-dd");
	}
}

function formatOperate1(value, row, index){
	if(row.flowProgress == '0'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit1(' + row.id + ')">' + 
					'编辑' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail1(' + row.id + ')">' + 
					'查看' + 
				'</button>';
	}
}

function btnEventDetail1(id){
	var row = $table1.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.isFinish = false;
	top.app.info.iframe.params.flowProgressDict = g_flowProgressDict;
	top.app.info.iframe.params.caseSourceDict = g_caseSourceDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/case-detail.html?_pid=" + pid + "&backUrl=/rales/ael/todo-list.html";
	window.location.href = encodeURI(url);
}

function btnEventEdit1(id){
	var row = $table1.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.flowProgressDict = g_flowProgressDict;
	top.app.info.iframe.params.caseSourceDict = g_caseSourceDict;
	top.app.info.iframe.params.caseTypeDict = g_caseTypeDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/case/case-edit.html?_pid=" + pid + "&backUrl=/rales/ael/todo-list.html";
	window.location.href = encodeURI(url);
}





function initTable2(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
        };
        return param;
    };
    //初始化列表
	$table2.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/force/getTodoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 350,
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table2, row, $el);
        }
    });
}

function serialNumberTable2(value,row,index){
    return appTable.tableFormatSerialNumber($table2, index);
}

function formatProgress2(value,row,index){
	if($.utils.isEmpty(value)) return "待提交";
	else return value;
}

function formatCaseCode2(value,row,index){
	if($.utils.isNull(row.otherFlowParams)) return ""
	else return row.otherFlowParams.code;
}

function formatCaseType2(value,row,index){
	if(row.isNormalCase == '2' || row.isNormalCase == '3') return "行政强制";
	else if(row.isNormalCase == '6' || row.isNormalCase == '7') return "先行登记保存";
	else return "";
}

function formatOperate2(value, row, index){
	if(row.activityName == '先行登记保存草稿' || row.activityName == '重新编辑' || row.activityName == '行政强制措施草稿'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit2(' + row.id + ')">' + 
					'编辑' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventAudit2(' + row.id + ')">' + 
					'查看' + 
				'</button>';
	}
}

function btnEventEdit2(id){
	var row = $table2.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.isEdit = true;
	top.app.info.iframe.params.row = row;;
	top.app.info.iframe.params.backUrl = "/rales/ael/todo-list.html";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "";
	if(row.isNormalCase == '2' || row.isNormalCase == '3')  url = "/rales/ael/force/audit-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	else if(row.isNormalCase == '6' || row.isNormalCase == '7') url = "/rales/ael/force/register-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	window.location.href = encodeURI(url);
}

function btnEventAudit2(id){
	var row = $table2.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};

//	if(row.activityName == '先行登记保存草稿' || row.activityName == '行政强制措施草稿' || 
//			row.activityName == '重新编辑' || row.activityName == '第二承办人审批'){
//		top.app.info.iframe.params.isEdit = true;
//	}
	top.app.info.iframe.params.isEdit = true;
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.backUrl = "/rales/ael/todo-list.html";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "";
	if(row.isNormalCase == '2' || row.isNormalCase == '3')  url = "/rales/ael/force/audit-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	else if(row.isNormalCase == '6' || row.isNormalCase == '7') url = "/rales/ael/force/register-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	window.location.href = encodeURI(url);
}






function initTable3(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
        };
        return param;
    };
    //初始化列表
	$table3.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/routine/getTodoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height:350,
        onClickRow: function(row, $el){
	        	appTable.setRowClickStatus($table3, row, $el);
        }
    });
}

function serialNumberTable3(value,row,index){
    return appTable.tableFormatSerialNumber($table3, index);
}

function formatProgress3(value,row,index){
	if($.utils.isEmpty(value)) return "待提交";
	else return value;
}

function formatCaseCode3(value,row,index){
	if($.utils.isNull(row.otherFlowParams)) return ""
	else return row.otherFlowParams.code;
}

function formatOperate3(value, row, index){
	if(row.activityName == '行政检查草稿' || row.activityName == '行政检查编辑'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit3(' + row.id + ')">' + 
					'编辑' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventAudit3(' + row.id + ')">' + 
					'查看' + 
				'</button>';
	}
}

function btnEventEdit3(id){
	var row = $table3.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.isEdit = true;
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.backUrl = "/rales/ael/todo-list.html";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/routine/routine-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	window.location.href = encodeURI(url);
}

function btnEventAudit3(id){
	var row = $table3.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
//	if(row.activityName == '行政检查编辑' || row.activityName == '行政检查草稿' ||  row.activityName == '第二承办人审批'){
//		top.app.info.iframe.params.isEdit = true;
//	}
	top.app.info.iframe.params.isEdit = true;
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.backUrl = "/rales/ael/todo-list.html";
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/routine/routine-detail.html?_pid=" + pid + "&backUrl=" + top.app.info.iframe.params.backUrl;
	window.location.href = encodeURI(url);
}




function initTable4(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            isNormalCase: '1',
        };
        return param;
    };
    //初始化列表
	$table4.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/getTodoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 350,
        onClickRow: function(row, $el){
	        	appTable.setRowClickStatus($table4, row, $el);
        }
    });
}

function serialNumberTable4(value,row,index){
    return appTable.tableFormatSerialNumber($table4, index);
}

function tableFormatType4(value, row) {
	return appTable.tableFormatDictValue(g_typeDict, value);
}

function formatOperate4(value, row, index){
	if(row.activityId == 'backToEditTask'){
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit4(' + row.id + ')">' + 
					'重新编辑' + 
				'</button>' +
				'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventSubmit4(' + row.id + ')">' + 
					'提交审批' + 
				'</button>';
	}else{
		return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventHandle4(' + row.id + ')">' + 
					'办理' + 
				'</button>';
	}
}

function btnEventEdit4(id){
	var row = $table4.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.typeDict = g_typeDict;
	top.app.info.iframe.params.sourceDict = g_sourceDict;
	top.app.info.iframe.params.sexDict = g_sexDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/clr/complaint/complaint-edit.html?_pid=" + pid + "&backUrl=/rales/ael/todo-list.html";
	window.location.href = encodeURI(url);
}

function btnEventSubmit4(id){
	var row = $table4.bootstrapTable("getRowByUniqueId", id);
	top.app.message.confirm("确定要提交审批？", function(){
		top.app.message.loading();
		var submitData = {};
		submitData["taskId"] = row.taskId;
		submitData["processInstanceId"] = row.processInstanceId;
		submitData["processDefinitionId"] = row.processDefinitionId;
		submitData["complaintId"] = row.id;
		//提交审批
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/complaintFlowNext?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data:JSON.stringify(submitData),
			contentType: "application/json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
		   			top.app.message.notice("数据提交成功！");
		   			$table4.bootstrapTable('refresh');
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
	});
}

function btnEventHandle4(id){
	var row = $table4.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.typeDict = g_typeDict;
	top.app.info.iframe.params.sourceDict = g_sourceDict;
	top.app.info.iframe.params.sexDict = g_sexDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/clr/complaint/complaint-handle.html?_pid=" + pid + "&backUrl=/rales/ael/todo-list.html";
	window.location.href = encodeURI(url);
}