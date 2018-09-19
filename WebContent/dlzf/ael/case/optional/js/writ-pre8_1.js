var g_params = {}, g_iframeIndex = null;
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

function initView(){
	//移除文书编号
	$('#tableTitleMark').remove();
	
	setData();
	rales.fixALinkWidth();
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdArriveUser').text($.utils.getNotNullVal(g_params.data.arriveUser));
	$('#tdArriveAddr').text($.utils.getNotNullVal(g_params.data.arriveAddr));
	$('#tdArriveRelation').text($.utils.getNotNullVal(g_params.data.arriveRelation));
	$('#tdArriveDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.arriveDate, "yyyy年MM月dd日")));
	$('#tdArriveType').text($.utils.getNotNullVal(g_params.data.arriveType));
	$('#tdRejectReason').text($.utils.getNotNullVal(g_params.data.rejectReason));
	$('#tdArriveMemo').text($.utils.getNotNullVal(g_params.data.arriveMemo));
}
