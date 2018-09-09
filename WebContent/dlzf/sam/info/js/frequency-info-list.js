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
            freqNum: parent.$('#searchFreqNum').val(),
            freqMod: parent.$('#searchFreqMod').val(),
            freqEfb: parent.$('#searchFreqEfb').val(),
            freqEfe: parent.$('#searchFreqEfe').val(),
            freqRfb: parent.$('#searchFreqRfb').val(),
            freqRfe: parent.$('#searchFreqRfe').val(),
            statOrg: parent.$('#searchStatOrg').val(),
            statName: parent.$('#searchStatName').val(),
            statWork: parent.$('#searchStatWork').val(),
            radius: parent.$('#searchRadius').val(),
            statLg: parent.$('#searchStatLg').val(),
            statLa: parent.$('#searchStatLa').val(),
        };
        return param;
    };
    // 初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getFreqList",   		// 请求后台的URL（*）
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
function tableFormatSend(value, row) {
	if($.utils.isEmpty(row.freqEfb) && $.utils.isEmpty(row.freqEfb)) return "";
	else if($.utils.isEmpty(row.freqEfb)) return $.utils.getNotNullVal(row.freqEfe) + "MHz";
	else if($.utils.isEmpty(row.freqEfb)) return $.utils.getNotNullVal(row.freqEfb) + "MHz";
	else return $.utils.getNotNullVal(row.freqEfb) + "-" + $.utils.getNotNullVal(row.freqEfe) + "MHz";
}
function tableFormatReceive(value, row) {
	if($.utils.isEmpty(row.freqRfb) && $.utils.isEmpty(row.freqRfe)) return "";
	else if($.utils.isEmpty(row.freqRfb)) return $.utils.getNotNullVal(row.freqRfe) + "MHz";
	else if($.utils.isEmpty(row.freqRfe)) return $.utils.getNotNullVal(row.freqRfb) + "MHz";
	else return $.utils.getNotNullVal(row.freqRfb) + "-" + $.utils.getNotNullVal(row.freqRfe) + "MHz";
}

function tableFormatFreqMod(value, row) {
	return appTable.tableFormatDictValue(parent.g_freqModDict, value);
}
function tableFormatStatType(value, row) {
	return appTable.tableFormatDictValue(parent.g_statTypeDict, value);
}
function tableFormatStatWork(value, row) {
	return appTable.tableFormatDictValue(parent.g_statWorkDict, value);
}