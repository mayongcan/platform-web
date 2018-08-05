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
	//公民选择
	$('input[type=checkbox][id=personType1]').change(function() { 
		$("#personType1").attr("checked",true);
		$("#personType2").attr("checked",false);
	});
	$('input[type=checkbox][id=personType2]').change(function() { 
		$("#personType2").attr("checked",true);
		$("#personType1").attr("checked",false);
	});
	
	setData();
	var height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
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

	if(g_params.data.personType == '1') $("#personType1").attr("checked",true);
	else if(g_params.data.personType == '2') $("#personType2").attr("checked",true);
	
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesAge').text($.utils.getNotNullVal(g_params.data.partiesAge));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.data.companyPhone));
	
	$('#tdHandleResult').text($.utils.getNotNullVal(g_params.data.handleResult));
	$('#tdHandleOrg').text($.utils.getNotNullVal(g_params.data.handleOrg));
	$('#tdHandleUser').text($.utils.getNotNullVal(g_params.data.handleUser));
	$('#tdRegisterDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.registerDate, "yyyy年MM月dd日")));
	$('#tdCaseEndDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.caseEndDate, "yyyy年MM月dd日")));
	$('#tdArchiveUser').text($.utils.getNotNullVal(g_params.data.archiveUser));
	$('#tdArchiveDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.archiveDate, "yyyy年MM月dd日")));
	$('#tdSaveDeadline').text($.utils.getNotNullVal(g_params.data.saveDeadline));
	$('#tdArchiveCode').text($.utils.getNotNullVal(g_params.data.archiveCode));
	$('#tdArchivePage').text("卷内" + $.utils.getNotNullVal(g_params.data.archivePage) + "页");
}
