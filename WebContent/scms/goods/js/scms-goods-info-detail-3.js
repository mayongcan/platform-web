var $table = $('#tableList'), g_params = null, g_backUrl = "", g_tableHeight = 0;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = parent.g_params;
	parent.document.getElementById('sub-iframe').style.height = '0px';
	g_tableHeight = $.utils.calcPageHeight(parent.document) - 120;
	//初始化列表信息
	initTable();

	setTimeout(function () {
		//重新计算当前页面的高度，用于iframe
        parent.document.getElementById('sub-iframe').style.height = g_tableHeight + 'px';
    }, 500);
});

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
            goodsId: g_params.row.id
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsModifyLogList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        height: g_tableHeight,
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}
