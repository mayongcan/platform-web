var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	$table.bootstrapTable({
        uniqueId: 'id',
        height: 460,
        onClickRow: function(row, $el){
    		tableSelectRow = row;
    		$tableDatabase.find('.success').removeClass('success');
    		$el.addClass('success');
        }
    });
	var data = {};
	data.rows = g_params.row.pointList;
	data.total = g_params.row.pointList.length;
	$table.bootstrapTable('load', data);
}
