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
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.stopDate);
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.hearingDate);
//	$('#tdHearingDate').text($.utils.getNotNullVal(g_params.data.hearingDate));
	$('#tdHearingAddr').text($.utils.getNotNullVal(g_params.data.hearingAddr));
	$('#tdHearingUser1').text($.utils.getNotNullVal(g_params.data.hearingUser1));
	$('#tdHearingUser2').text($.utils.getNotNullVal(g_params.data.hearingUser2));
	$('#tdHearingUser3').text($.utils.getNotNullVal(g_params.data.hearingUser3));
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.stopDate);
	rales.setDateInfo($('#dataYear3'), $('#dataMonth3'), $('#dataDay3'), g_params.data.postponeDate);
//	$('#tdPostponeDate').text($.utils.getNotNullVal(g_params.data.postponeDate));
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
}
