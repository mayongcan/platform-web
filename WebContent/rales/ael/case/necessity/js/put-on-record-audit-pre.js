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

	$('#tdCaseSource').text(top.app.getDictName(g_params.registerRow.sourceCase, g_caseSourceDict));
	$('#tdCaseAddress').text(g_params.registerRow.address);
	$('#tdCaseDate').text($.date.dateFormat(g_params.registerRow.occurrenceDate, "yyyy-MM-dd"));
	$('#tdSuggestContent').text(g_params.registerRow.advice);
	$('#tdCaseCode').text($.utils.getNotNullVal(g_params.registerRow.caseCode));
	
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.name));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.certificateNo));
	$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.data.company));
	$('#tdPartiesContacts').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdPartiesAddress').text($.utils.getNotNullVal(g_params.data.address));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.zip));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.phone));
	$('#tdOtherInfo').text($.utils.getNotNullVal(g_params.data.otherCircumstances));
	$('#tdAcceptanceDate').text($.date.dateFormat(g_params.data.acceptanceDate, "yyyy-MM-dd"));
	$('#tdFormDate').text($.date.dateFormat(g_params.data.formDate, "yyyy-MM-dd"));
	$('#tdCaseBasis').text($.utils.getNotNullVal(g_params.data.caseBasis));
	$('#tdCaseDesc').text($.utils.getNotNullVal(g_params.data.introduction));
	$('#tdFilingDate').text($.date.dateFormat(g_params.data.filingDate, "yyyy-MM-dd"));
}
