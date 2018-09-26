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
	var height = ($('#tdResultContent').height() < 80) ? 130 : ($('#tdResultContent').height() + 70);
	$('#tdResult').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
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
	
	//获取字典
	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	
	$('#tdCaseName').text($.utils.getNotNullVal(g_params.data.caseName));
	$('#tdCaseNo').text($.utils.getNotNullVal(g_params.data.caseNo));
	$('#tdCaseBeginDate').text($.utils.getNotNullVal(g_params.data.caseBeginDate));
	$('#tdPunish').text($.utils.getNotNullVal(g_params.data.punish));
	$('#tdCasePunishDate').text($.utils.getNotNullVal(g_params.data.casePunishDate));
	
	$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.data.partiesCompany));
	$('#tdDelegate').text($.utils.getNotNullVal(g_params.data.delegate));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdBirthDate').text($.utils.getNotNullVal(g_params.data.birthDate));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.partiesZip));
	
	$('#tdResultContent').text($.utils.getNotNullVal(g_params.data.result));
	$('#tdSuggestContent').text($.utils.getNotNullVal(g_params.data.handleDetail));

	//承办人意见，显示历史处理意见
	getHistoryAuditListPreview(g_params.data.registerId, "5");
}
