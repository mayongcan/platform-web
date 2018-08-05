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
	var height = ($('#tdAdviceContent').height() < 80) ? 130 : ($('#tdAdviceContent').height() + 20);
	$('#tdAdvice').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	height = ($('#tdLawSuggestContent').height() < 80) ? 130 : ($('#tdLawSuggestContent').height() + 70);
	$('#tdLawSuggest').height(height);
	height = ($('#tdUnitSuggestContent').height() < 80) ? 130 : ($('#tdUnitSuggestContent').height() + 70);
	$('#tdUnitSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdPunishWrit').text($.utils.getNotNullVal(g_params.data.punishWrit));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPunish').text($.utils.getNotNullVal(g_params.data.punish));
	$('#tdReason').text($.utils.getNotNullVal(g_params.data.reason));
	$('#tdAdviceContent').text($.utils.getNotNullVal(g_params.data.advice));
	
}
