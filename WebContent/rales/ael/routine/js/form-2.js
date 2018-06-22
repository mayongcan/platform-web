var $table = $('#tableList'), g_registerId = null;

$(function () {
	g_params = parent.g_params;
	if(g_params.row != null && g_params.row != undefined && g_params.row.id != null && g_params.row.id != undefined)
		g_registerId = g_params.row.id;
	else
		g_registerId = "-1";
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	//获取权限菜单
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化权限
 */
function initFunc(){
	$("#tableToolbar").empty();
	var htmlTable = "";
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='btnNew' data-action-url=''>" + 
					"<i class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></i> 新建调查笔录" + 
				 "</button>";
//	htmlTable += appTable.addDefaultFuncButton();
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
            registerId: g_registerId
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getInquiryRecordList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 480,
        onClickRow: function(row, $el){
	        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	$("#btnNew").click(function () {
		if(g_params.row == null || g_params.row == undefined || g_params.row.id == null || g_params.row.id == undefined){
   			top.app.message.notice("请先保存现场检查记录表！");
   			return;
		}
		top.app.info.iframe.params = g_params;
		top.app.info.iframe.params.subType = 1;	//1新增 2编辑 3查看
		top.app.info.iframe.params.registerRow = g_params.row;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/rales/ael/routine/form-2-sub.html?_pid=" + pid + "&backUrl=/rales/ael/routine/form-2.html";
		parent.location.href = encodeURI(url);
    });
}

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}

function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDetail(' + row.id + ')">' + 
				'查看' + 
			'</button>' + 
			'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + row.id + ')">' + 
				'编辑' + 
			'</button>';
}

function btnEventDetail(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = g_params;
	top.app.info.iframe.params.subType = 3;	//1新增 2编辑 3查看
	top.app.info.iframe.params.subRow = row;
	top.app.info.iframe.params.registerRow = g_params.row;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/routine/form-2-sub.html?_pid=" + pid + "&backUrl=/rales/ael/routine/form-2.html";
	parent.location.href = encodeURI(url);
}

function btnEventEdit(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = g_params;
	top.app.info.iframe.params.subType = 2;	//1新增 2编辑 3查看
	top.app.info.iframe.params.subRow = row;
	top.app.info.iframe.params.registerRow = g_params.row;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/ael/routine/form-2-sub.html?_pid=" + pid + "&backUrl=/rales/ael/routine/form-2.html";
	parent.location.href = encodeURI(url);
}