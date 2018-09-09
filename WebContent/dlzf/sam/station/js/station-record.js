var $table = $('#tableList');

$(function () {
	//初始化字典
	initDict();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	var datetime = new Date();
	var searchYearDict = [], curYear = parseInt(datetime.getFullYear()), html = "";
	//年度
	$('#searchYear').empty();
	html += "<option value=''>全部</option>";
	for(var i = curYear; i >= curYear - 10; i--){
		html += "<option value='" + i + "'>" + i + "</option>";
	}
	$('#searchYear').append(html);
	
	//最近年审年度
	html = ""
	$('#searchLastYear').empty();
	html += "<option value=''>全部</option>";
	for(var i = curYear; i >= curYear - 10; i--){
		html += "<option value='" + i + "'>" + i + "</option>";
	}
	$('#searchLastYear').append(html);
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 初始化权限
 */
function initFunc(){
	var g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
						"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
					 "</button>";
	}
	//添加默认权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            statOrg: $("#searchOrgName").val(),
			statName: $("#searchStatName").val(),
			status: $("#searchStatus").val(),
			year: $("#searchYear").val(),
			begin: $("#searchBegin").val(),
			end: $("#searchEnd").val(),
			lastYear: $("#searchLastYear").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getStationRecordList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        		appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchOrgName").val("");
		$("#searchStatName").val("");
		$("#searchStatus").val("");
		$("#searchYear").val("");
		$("#searchBegin").val("");
		$("#searchEnd").val("");
		$("#searchLastYear").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}


function tableFormatStatus(value, row) {
	if(value == '1') return '已年审';
	else return '未年审';
}
