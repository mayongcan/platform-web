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

	$('#tdCaseCode').text($.utils.getNotNullVal(g_params.registerRow.caseCode));
	$('#tdCaseParties').text($.utils.getNotNullVal(g_params.registerRow.parties));
	$('#tdSuggestContent').text($.utils.getNotNullVal(g_params.registerRow.advice));
	
	$('#tdCaseDate').text($.date.dateFormat(g_params.data.filingDate, "yyyy-MM-dd"));
	$('#tdIntroduction').text($.utils.getNotNullVal(g_params.data.introduction));	
}
