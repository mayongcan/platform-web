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

	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	rales.setDatetimeInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), $('#dataHour'), $('#dataMinute'), g_params.data.checkDateBegin);
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.checkDateEnd);
//	$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.data.checkDateBegin));
//	$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.data.checkDateEnd));
	$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.data.checkAddr));
	$('#tdReason').text($.utils.getNotNullVal(g_params.data.reason));
	$('#tdHandleUser').text($.utils.getNotNullVal(g_params.data.handleUser));
	$('#tdHandleUserJob').text($.utils.getNotNullVal(g_params.data.handleUserJob));
	$('#tdRecordUser').text($.utils.getNotNullVal(g_params.data.recordUser));
	$('#tdRecordUserJob').text($.utils.getNotNullVal(g_params.data.recordUserJob));
	$('#tdJoinUser').text($.utils.getNotNullVal(g_params.data.joinUser));
	$('#tdCurUser').text($.utils.getNotNullVal(g_params.data.curUser));
	$('#tdCaseDetail').text($.utils.getNotNullVal(g_params.data.caseDetail));
	$('#tdHearDetail').text($.utils.getNotNullVal(g_params.data.hearDetail));
	$('#tdAdvice').text($.utils.getNotNullVal(g_params.data.advice));
	$('#tdResult').text($.utils.getNotNullVal(g_params.data.result));
}
