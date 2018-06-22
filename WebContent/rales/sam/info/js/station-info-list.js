var $table = $('#tableList');
$(function () {
	// 初始化列表信息
	initTable();
});

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
            statName: parent.$('#searchStatName').val(),
            statType: parent.$('#searchStatType').val(),
            statWork: parent.$('#searchStatWork').val(),
            statLg: parent.$('#searchStatLg').val(),
            statLa: parent.$('#searchStatLa').val(),
            radius: parent.$('#searchRadius').val(),
            begin: parent.$('#searchBegin').val(),
            end: parent.$('#searchEnd').val(),
        };
        return param;
    };
    // 初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getStationList",   		// 请求后台的URL（*）
        queryParams: searchParams,										// 传递参数（*）
        uniqueId: 'guid',
        height: 400,
        onClickRow: function(row, $el){
        		appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table, false);
	$table.on('load-success.bs.table', function (data) {
	    parent.document.getElementById('case-iframe').style.height = '0px';
		//重新计算当前页面的高度，用于iframe
	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
    });
}

function tableFormatStatType(value, row) {
	return appTable.tableFormatDictValue(parent.g_statTypeDict, value);
}
function tableFormatStatWork(value, row) {
	return appTable.tableFormatDictValue(parent.g_statWorkDict, value);
}

