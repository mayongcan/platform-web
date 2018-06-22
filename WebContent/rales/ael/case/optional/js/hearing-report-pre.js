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
	var height = ($('#tdHearingDetailContent').height() < 80) ? 130 : $('#tdHearingDetailContent').height() + 70;
	$('#tdHearingDetail').height(height);
	height = ($('#tdHearingConclusionContent').height() < 80) ? 130 : ($('#tdHearingConclusionContent').height() + 70);
	$('tdHearingConclusion').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);	
	$('#tdIllegalContent').text(g_params.data.illegalContent);
	$('#tdMemo').text("备注：" + g_params.data.memo);
	if($.utils.isNull(g_params.loadData)){
		$('#tdHearingCompere').text(g_params.data.tdHearingCompere);
		$('#tdRecorder').text(g_params.data.tdRecorder);
		$('#tdDate').text(g_params.data.tdDate);
		$('#tdAddress').text(g_params.data.tdAddress);
		$('#tdHearingDetailContent').text(g_params.data.hearingDetail);
		$('#tdHearingConclusionContent').text(g_params.data.hearingConclusion);
		$('#tdSuggestContent').text(g_params.data.suggest);
	}else{
		$('#tdHearingCompere').text(g_params.data.compere);
		$('#tdRecorder').text(g_params.data.recorder);
		$('#tdDate').text(g_params.data.recordDate);
		$('#tdAddress').text(g_params.data.address);
		$('#tdHearingDetailContent').text(g_params.data.baseInfo);
		$('#tdHearingConclusionContent').text(g_params.data.conclusion);
		$('#tdSuggestContent').text(g_params.data.approvalOpinion);
	}
}
