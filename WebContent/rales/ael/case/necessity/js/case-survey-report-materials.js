var $table = $('#tableList'), g_params = {}, g_iframeIndex = null;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '225px'
	});
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//获取权限菜单
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
}

/**
 * 初始化权限
 */
function initFunc(){
	$("#tableToolbar").empty();
	var htmlTable = "";
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='newEvent' data-action-url=''>" + 
					"<i class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></i> 新建" + 
				 "</button>";
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='editEvent' data-action-url=''>" + 
					"<i class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></i> 编辑" + 
				 "</button>";
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='delEvent' data-action-url=''>" + 
					"<i class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></i> 删除" + 
				 "</button>";
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
            registerId: g_params.registerId,
            reportId: g_params.reportId
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
	        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getReportMaterialList",   		//请求后台的URL（*）
	        queryParams: searchParams,										//传递参数（*）
	        uniqueId: 'id',
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
	$("#newEvent").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.registerId = g_params.registerId;
		params.reportId = g_params.reportId;
		params.operUrl = top.app.conf.url.apigateway + "/api/rales/ael/case/addReportMaterial";
		top.app.layer.editLayer('新增材料', ['710px', '350px'], '/rales/ael/case/necessity/case-survey-report-materials-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#editEvent").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.registerId = g_params.registerId;
		params.reportId = g_params.reportId;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + "/api/rales/ael/case/editReportMaterial";
		top.app.layer.editLayer('编辑材料', ['710px', '350px'], '/rales/ael/case/necessity/case-survey-report-materials-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#delEvent").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.id;
    		});
		appTable.delData($table, "/api/rales/ael/case/delReportMaterial", idsList);
    });
}

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}