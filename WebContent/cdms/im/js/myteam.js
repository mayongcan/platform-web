var $table = $('#tableList'), g_operRights = null;

$(function () {
	//初始化列表信息
	initTable();
	//加载数据
	imUtils.getUserTeamList(function(data){
		var tmpData = new Object();
//		tmpData.rows = data.infos;
		tmpData.data = data.infos;
		tmpData.total = data.count;
		$table.bootstrapTable('load', tmpData);
		appTable.resetTableHeightOnLoad($table, g_searchPannelHeight);
	});
});

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        queryParams: searchParams,												//传递参数（*）
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}
