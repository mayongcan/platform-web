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
	var height = ($('#tdCloseSuggestContent').height() < 80) ? 130 : $('#tdCloseSuggestContent').height();
	$('#tdCloseSuggest').height(height);
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

	//获取立案审批信息
	var filingInfo = rales.getCaseFilingInfo(g_params.data.registerId);
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdCaseBeginDate').text($.date.dateFormat(filingInfo.filingDate, "yyyy-MM-dd"));
	$('#tdCaseEndDate').text($.date.dateFormat(filingInfo.endDate, "yyyy-MM-dd"));
	
	$('#tdPunishmentsContent').text($.utils.getNotNullVal(g_params.data.punishments));
	$('#tdExecutiveConditionContent').text($.utils.getNotNullVal(g_params.data.executiveCondition));
	$('#tdCloseSuggestContent').text($.utils.getNotNullVal(g_params.data.closeSuggest));
}
