var $table1 = $('#tableList1'), $table2 = $('#tableList2'), $table3 = $('#tableList3'), $table4 = $('#tableList4'), $table10 = $('#tableList10');
var g_rows = [];
var g_flowProgressDict = [], g_caseSourceDict = [], g_caseTypeDict = [], g_typeDict = [], g_sourceDict = [], g_sexDict = [], g_loginUrlDict = [];
var g_bindUserRows = [];
$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	g_flowProgressDict = top.app.getDictDataByDictTypeValue('AEL_CASE_FLOW_PROCEDURE');
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
	g_caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
	g_typeDict = top.app.getDictDataByDictTypeValue('RALES_CRL_TYPE');
	g_sourceDict = top.app.getDictDataByDictTypeValue('RALES_CRL_SOURCE');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	g_loginUrlDict = top.app.getDictDataByDictTypeValue('RALES_BING_USER');
	
	//加载绑定的用户账号
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/user/getList",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	userId: top.app.info.userInfo.userId
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			g_bindUserRows = data.rows;
	   		}
	   	}
	});

	// 下拉框变更事件
	$('#searchSystem').on('changed.bs.select',
		function(e) {
			if ($('#searchSystem').val() == '1') {
				$('#searchType').empty();
				$('#searchType').append("<option value='1'>案件管理</option>");
				$('#searchType').append("<option value='2'>日常巡查</option>");
				$('#searchType').append("<option value='3'>行政强制措施</option>");
				$('#searchType').append("<option value='4'>信访投诉</option>");
				$('.selectpicker').selectpicker('refresh');
			} else if ($('#searchSystem').val() == '2') {
				$('#searchType').empty();
				$('#searchType').append("<option value='1'>待办任务</option>");
				$('.selectpicker').selectpicker('refresh');
			}
		}
	);

	//搜索点击事件
	$("#btnSearch").click(function () {
		var url = "";
		var userAccount = getBindUserAccount();
		if($('#searchSystem').val() == '1'){
			if($.utils.isEmpty(userAccount)){
				top.app.message.notice("您还没有绑定无线电执法系统！");
				return;
			}
			$table1.bootstrapTable('destroy');
			$table2.bootstrapTable('destroy');
			$table3.bootstrapTable('destroy');
			$table4.bootstrapTable('destroy');
			$table10.bootstrapTable('destroy');
			if ($('#searchType').val() == '1'){
				$table1.css('display', '');
				$table2.css('display', 'none');
				$table3.css('display', 'none');
				$table4.css('display', 'none');
				$table10.css('display', 'none');
				url = top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseTodoList";
				loadTable1(url, userAccount);
			}else if ($('#searchType').val() == '2'){
				$table1.css('display', 'none');
				$table2.css('display', '');
				$table3.css('display', 'none');
				$table4.css('display', 'none');
				$table10.css('display', 'none');
				url = top.app.conf.url.apigateway + "/api/rales/ael/routine/getTodoList";
				loadTable2(url, userAccount);
			}else if ($('#searchType').val() == '3'){
				$table1.css('display', 'none');
				$table2.css('display', 'none');
				$table3.css('display', '');
				$table4.css('display', 'none');
				$table10.css('display', 'none');
				url = top.app.conf.url.apigateway + "/api/rales/ael/force/getTodoList";
				loadTable3(url, userAccount);
			}else if ($('#searchType').val() == '4'){
				$table1.css('display', 'none');
				$table2.css('display', 'none');
				$table3.css('display', 'none');
				$table4.css('display', '');
				$table10.css('display', 'none');
				url = top.app.conf.url.apigateway + "/api/rales/clr/complaint/getTodoList";
				loadTable4(url, userAccount);
			}
		}else{
			if($.utils.isEmpty(userAccount)){
				top.app.message.notice("您还没有绑定频率指配系统！");
				return;
			}
			$table1.css('display', 'none');
			$table2.css('display', 'none');
			$table3.css('display', 'none');
			$table4.css('display', 'none');
			$table10.css('display', '');
			$table1.bootstrapTable('destroy');
			$table2.bootstrapTable('destroy');
			$table3.bootstrapTable('destroy');
			$table4.bootstrapTable('destroy');
			$table10.bootstrapTable('destroy');
			loadTable10(userAccount);
		}
    });
	$("#btnReset").click(function () {
		$("#searchSystem").val("1");
		$('#searchType').empty();
		$('#searchType').append("<option value='1'>案件管理</option>");
		$('#searchType').append("<option value='2'>日常巡查</option>");
		$('#searchType').append("<option value='3'>行政强制措施</option>");
		$('#searchType').append("<option value='4'>信访投诉</option>");
		$('.selectpicker').selectpicker('refresh');
		$("#searchLastHandleTimeBegin").val("");
		$("#searchLastHandleTimeEnd").val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table1.css('display', '');
		$table2.css('display', 'none');
		$table3.css('display', 'none');
		$table4.css('display', 'none');
		$table10.css('display', 'none');
		$table1.bootstrapTable('destroy');
		$table2.bootstrapTable('destroy');
		$table3.bootstrapTable('destroy');
		$table4.bootstrapTable('destroy');
		$table10.bootstrapTable('destroy');

		var userAccount = getBindUserAccount();
		if($.utils.isEmpty(userAccount)){
			top.app.message.notice("您还没有绑定无线电执法系统！");
		}
		loadTable1(top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseTodoList", userAccount);
    });

	var userAccount = getBindUserAccount();
	if($.utils.isEmpty(userAccount)){
		top.app.message.notice("您还没有绑定无线电执法系统！");
	}
	//先加载默认的数据
	loadTable1(top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseTodoList", userAccount);
});

/**
 * 初始化列表信息
 */
function loadTable1(url, userAccount){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            userAccount: userAccount,
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table1.bootstrapTable({
        url: url,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table1, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table1);
}

/**
 * 初始化列表信息
 */
function loadTable2(url, userAccount){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            userAccount: userAccount,
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table2.bootstrapTable({
        url: url,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table2, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table2);
}

/**
 * 初始化列表信息
 */
function loadTable3(url, userAccount){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            userAccount: userAccount,
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table3.bootstrapTable({
        url: url,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table3, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table3);
}

/**
 * 初始化列表信息
 */
function loadTable4(url, userAccount){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            userAccount: userAccount,
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table4.bootstrapTable({
        url: url,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table4, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table4);
}


/**
 * 初始化列表信息
 */
function loadTable10(userAccount){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            userAccount: userAccount,
            lastHandleTimeBegin: $('#searchLastHandleTimeBegin').val(),
            lastHandleTimeEnd: $('#searchLastHandleTimeEnd').val(),
        };
        return param;
    };
    //初始化列表
	$table10.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/task/getTodoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table10, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table10);
}

function getBindUserAccount(){
	var loginUrl = "";
	for(var i = 0; i < g_loginUrlDict.length; i++){
		if($('#searchSystem').val() == '1' && g_loginUrlDict[i].NAME == '无线电执法'){
			loginUrl = g_loginUrlDict[i].ID;
			break;
		}
		if($('#searchSystem').val() == '2' && g_loginUrlDict[i].NAME == '频率指配系统'){
			loginUrl = g_loginUrlDict[i].ID;
			break;
		}
	}
	var userAccount = "";
	for(var i = 0; i < g_bindUserRows.length; i++){
		if(g_bindUserRows[i].loginUrl == loginUrl){
			userAccount = g_bindUserRows[i].loginUser;
			break;
		}
	}
	return userAccount;
}

function getBindUserLoginUrl(){
	var loginUrl = "";
	for(var i = 0; i < g_loginUrlDict.length; i++){
		if($('#searchSystem').val() == '1' && g_loginUrlDict[i].NAME == '无线电执法'){
			loginUrl = g_loginUrlDict[i].ID;
			break;
		}
		if($('#searchSystem').val() == '2' && g_loginUrlDict[i].NAME == '频率指配系统'){
			loginUrl = g_loginUrlDict[i].ID;
			break;
		}
	}
	return loginUrl;
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

function serialNumberTable4(value,row,index){
    return appTable.tableFormatSerialNumber($table4, index);
}

function tableFormatType4(value, row) {
	return appTable.tableFormatDictValue(g_typeDict, value);
}

function formatOperate1(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventHandle1(' + row.id + ')">' + 
				'办理' + 
			'</button>';
}

function btnEventHandle1(id){
	var row = $table1.bootstrapTable("getRowByUniqueId", id);
	var funcLink = getBindUserLoginUrl();
	var operUrl = funcLink + "?access_token=" + top.app.cookies.getCookiesToken() + "&loginUrl=" + funcLink;
	window.open(operUrl);
}

function tableFormatTimelineStatus(value, row) {
	if($.date.dateDiff('d',new Date(), row.completedDate) >= 2)
		return '<img src="/rales/img/icon_dot_blue.png" style="width:18px;height:18px"/>';
	else
		return '<img src="/rales/img/icon_dot_red.png" style="width:18px;height:18px"/>';
}

function formatOperate10(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventHandle10(' + row.id + ')">' + 
				'办理' + 
			'</button>';
}

function btnEventHandle10(id){
	var funcLink = getBindUserLoginUrl();
	var operUrl = funcLink + "?access_token=" + top.app.cookies.getCookiesToken() + "&loginUrl=" + funcLink;
	window.open(operUrl);
}