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
	var height = ($('#tdHearingDetailContent').height() < 80) ? 130 : $('#tdHearingDetailContent').height();
	$('#tdHearingDetail').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	height = ($('#tdLeaderSuggestContent').height() < 80) ? 130 : ($('#tdLeaderSuggestContent').height() + 40);
	$('#tdLeaderSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdCaseParties').text($.utils.getNotNullVal(g_params.data.caseParties));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
	$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.data.partiesCompany));
	$('#tdPartiesContacts').text($.utils.getNotNullVal(g_params.data.partiesContacts));
	$('#tdPartiesAddress').text($.utils.getNotNullVal(g_params.data.partiesAddress));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.partiesZip));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdHearingDetail').text($.utils.getNotNullVal(g_params.data.hearingDetail));
	$('#tdMemo').text($.utils.getNotNullVal(g_params.data.memo));
	$('#tdSuggestContent').text($.utils.getNotNullVal(g_params.data.suggest));
	
}
