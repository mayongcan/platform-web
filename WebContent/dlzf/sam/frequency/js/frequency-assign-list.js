var $table = $('#tableList'), g_operRights = [];

$(function () {
	//初始化字典
	initView();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始基础视图
 * @returns
 */
function initView(){
	$.date.initSearchDate('divCreateDateBegin', 'divCreateDateEnd', 'YYYY-MM-DD HH:mm:ss');
}

/**
 * 初始化权限
 */
function initFunc(){
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		//显示在列表上方的权限菜单
		if(g_operRights[i].dispPosition == '1' || g_operRights[i].dispPosition == undefined){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
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
			statName: $("#searchStatName").val(),
			statAddr: $("#searchStatAddr").val(),
			createDateBegin: $("#createDateBegin").val(),
			createDateEnd: $("#createDateEnd").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSimulateList",   		//请求后台的URL（*）
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
		$("#searchStatName").val("");
		$("#searchStatAddr").val("");
		$("#createDateBegin").val("");
		$("#createDateEnd").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}

function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="operateButtonCheck1(' + row.id + ')">' + 
				'频率指配报告' + 
		   '</button>' + 
		   '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="operateButtonCheck2(' + row.id + ')">' + 
				'覆盖分析报告' + 
		   '</button>' + 
		   '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="operateButtonCheck3(' + row.id + ')">' + 
				'干扰分析报告' + 
		  '</button>';
}

function operateButtonCheck1(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	window.open(top.app.conf.url.res.url + row.pdfPath1);
}
function operateButtonCheck2(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	window.open(top.app.conf.url.res.url + row.pdfPath2);
}
function operateButtonCheck3(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	window.open(top.app.conf.url.res.url + row.pdfPath3);
}

