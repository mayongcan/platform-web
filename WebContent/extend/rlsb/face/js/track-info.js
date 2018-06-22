var $table = $('#tableList'), g_params = null;
$(function () {
	g_params = top.app.info.iframe.params;
	// 初始化权限
	initFunc();
	// 初始化列表信息
	initTable();
	// 初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化权限
 */
function initFunc(){
	$("#tableToolbar").empty();
	var htmlTable = "";
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarMap'>" + 
					"<i class='glyphicon glyphicon-cog' aria-hidden='true'></i> 查看地图" +
				 "</button>"
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarBack'>" + 
					"<i class='glyphicon glyphicon-arrow-left' aria-hidden='true'></i> 返回" +
				 "</button>"
	// 添加表格的权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable(){
	// 搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						// 页面大小
            page: params.offset / params.limit,  		// 当前页
            faceId: g_params.row.id
        };
        return param;
    };
    // 初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/extend/rlsb/face/track/getList",   		// 请求后台的URL（*）
        queryParams: searchParams,										// 传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        		appTable.setRowClickStatus($table, row, $el);
        }
    });
	// 搜索面板高度
	appTable.searchPannelHeight = $('#titleInfo').outerHeight(true) - 10;
	// 初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	// 绑定工具条事件
	$("#toolbarMap").click(function () {
		// 设置参数
		var params = g_params;
		top.app.layer.editLayerWidthMax('查看地图', ['710px', '500px'], '/extend/rlsb/face/track-map.html', params, function(){});
    });
	// 返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "rlsbfaceinfo.html?_pid=" + pid;
    });
}

/**
 * 格式数据共享字段
 * 
 * @param value
 * @param row
 */
function formatType(value, row) {
	if(value == 1){
		return '图片识别';
	}else if(value == 2){
		return '视频采集';
	}else if(value == 3){
		return '批量采集';
	}
}