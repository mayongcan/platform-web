var g_params = {}, g_iframeIndex = null;
var g_caseSourceDict = "";
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
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
	var height = ($('#tdClueSummaryContent').height() < 80) ? 130 : $('#tdClueSummaryContent').height();
	$('#tdClueSummary').height(height);
	height = ($('#tdCaseVerificationContent').height() < 80) ? 130 : ($('#tdCaseVerificationContent').height() + 70);
	$('#tdCaseVerification').height(height);
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
	top.app.addRadioButton($("#divCaseSource"), g_caseSourceDict, 'radioCaseSource', g_params.data.sourceCase);

	$('#tdReporterName').text($.utils.getNotNullVal(g_params.data.reporterName));
	$('#tdReporterCertificateNo').text($.utils.getNotNullVal(g_params.data.reporterCertificateNo));
	$('#tdReporterCompany').text($.utils.getNotNullVal(g_params.data.reporterCompany));
	$('#tdReporterContacts').text($.utils.getNotNullVal(g_params.data.reporterContacts));
	$('#tdReporterAddress').text($.utils.getNotNullVal(g_params.data.reporterAddress));
	$('#tdReporterZip').text($.utils.getNotNullVal(g_params.data.reporterZip));
	$('#tdReporterPhone').text($.utils.getNotNullVal(g_params.data.reporterPhone));
	$('#tdDefendantName').text($.utils.getNotNullVal(g_params.data.defendantName));
	$('#tdAreaName').text($.utils.getNotNullVal(g_params.data.areaName));
	$('#tdDefendantAddress').text($.utils.getNotNullVal(g_params.data.address));
	$('#tdDefendantDate').text($.date.dateFormat(g_params.data.occurrenceDate, "yyyy-MM-dd"));
	$('#tdDefendantCheckDate').text($.date.dateFormat(g_params.data.checkDate, "yyyy-MM-dd"));
	$('#tdClueSummaryContent').text($.utils.getNotNullVal(g_params.data.clueSummary));
	$('#tdCaseVerificationContent').text($.utils.getNotNullVal(g_params.data.caseVerification));
	$('#tdSuggestContent').text($.utils.getNotNullVal(g_params.data.advice));
	$('#tdMemo').text($.utils.getNotNullVal(g_params.data.memo));
}
