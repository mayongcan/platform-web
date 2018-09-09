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

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.stopDate);
	$('#tdBaseWrit').text($.utils.getNotNullVal(g_params.data.baseWrit));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));
	$('#tdReason').text($.utils.getNotNullVal(g_params.data.reason));
	$('#tdDeadline').text($.utils.getNotNullVal(g_params.data.deadline));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.beginDate);
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.endDate);
}
