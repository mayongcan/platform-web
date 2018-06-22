var $table = $('#tableList');

$(function () {
	$('#divCreateDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});
	$('#divCompletedDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});
	//获取权限菜单
//	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();

	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '180px'
	});
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
						"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
					 "</button>";
	}
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
            title: $("#searchTitle").val(),
            createDate: $("#searchCreateDate").val(),
            createUser: $("#searchSendBy").val(),
            completedDate: $("#searchCompletedDate").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/task/getHandleList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
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
		$("#searchTitle").val("");
		$("#searchCreateDate").val("");
		$("#searchSendBy").val("");
		$("#searchCompletedDate").val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}

function tableFormatTimelineStatus(value, row) {
	if($.date.dateDiff('d', row.completedDate, new Date()) >= 1)
		return '<img src="/rales/img/icon_dot_red.png" style="width:18px;height:18px"/>';
	else
		return '<img src="/rales/img/icon_dot_blue.png" style="width:18px;height:18px"/>';
}

function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventView(' + row.id + ')">' + 
				'查看' + 
			'</button>';
}

function btnEventView(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/sam/task/task-view.html?_pid=" + pid + "&backUrl=/rales/sam/task/task-handle-list.html";
	window.location.href = encodeURI(url);
}