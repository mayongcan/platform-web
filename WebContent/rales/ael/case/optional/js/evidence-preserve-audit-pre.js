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

	var height = ($('#tdCaseDescContent').height() < 80) ? 150 : $('#tdCaseDescContent').height();
	$('#tdCaseDesc').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 150 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	height = ($('#tdLeaderSuggestContent').height() < 80) ? 150 : ($('#tdLeaderSuggestContent').height() + 40);
	$('#tdLeaderSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	if($.utils.isNull(g_params.loadData)){
		$('#tdCaseParties').text(g_params.data.caseParties);
		$('#tdCaseNo').text(g_params.data.caseNo);
		$('#tdCaseDate').text(g_params.data.caseDate);
		$('#tdCaseDescContent').text(g_params.data.caseDesc);
		$('#tdSuggestContent').text(g_params.data.suggest);
	}else{
		$('#tdCaseParties').text(g_params.data.parties);
		$('#tdCaseNo').text(g_params.registerRow.caseCode);
		$('#tdCaseDate').text(g_params.data.filingDate);
		$('#tdCaseDescContent').text(g_params.data.introduction);
		$('#tdSuggestContent').text(g_params.registerRow.advice);
	}
}
