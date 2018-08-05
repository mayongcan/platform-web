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
	$('#tdBaseInfo').text($.utils.getNotNullVal(g_params.data.baseInfo));
	$('#tdHearingInfo').text($.utils.getNotNullVal(g_params.data.hearingInfo));
	$('#tdSuggestContent').text($.utils.getNotNullVal(g_params.data.advice));

	
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdCaseBeginDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.caseBeginDate, "yyyy年MM月dd日")));
	$('#tdPunishWritCode').text($.utils.getNotNullVal(g_params.data.punishWritCode));
	$('#tdPunishDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.punishDate, "yyyy年MM月dd日")));
	$('#tdCaseDesc').text($.utils.getNotNullVal(g_params.data.caseDesc));
	$('#tdPunishContent').text($.utils.getNotNullVal(g_params.data.punishContent));
	if(g_params.data.punishDetailCheck1 == '1') {$("#punishDetailCheck1").attr("checked",true); $("#divPunishDetailCheck1").css('display', '');}
	$('#tdPunishDetailContent1').text($.utils.getNotNullVal(g_params.data.punishDetailContent1));
	if(g_params.data.punishDetailCheck2 == '1') {$("#punishDetailCheck2").attr("checked",true); $("#divPunishDetailCheck2").css('display', '');}
	$('#tdPunishDetailContent2').text($.utils.getNotNullVal(g_params.data.punishDetailContent2));
	if(g_params.data.punishDetailCheck3 == '1') {$("#punishDetailCheck3").attr("checked",true); $("#divPunishDetailCheck3").css('display', '');}
	$('#tdPunishDetailContent3').text($.utils.getNotNullVal(g_params.data.punishDetailContent3));
	if(g_params.data.punishDetailCheck4 == '1') {$("#punishDetailCheck4").attr("checked",true); $("#divPunishDetailCheck4").css('display', '');}
	$('#tdPunishDetailContent4').text($.utils.getNotNullVal(g_params.data.punishDetailContent4));
	if(g_params.data.punishCodeCheck1 == '1') {$("#punishCodeCheck1").attr("checked",true); $("#divPunishCodeCheck1").css('display', '');}
	$('#tdPunishCodeContent1').text($.utils.getNotNullVal(g_params.data.punishCodeContent1));
	if(g_params.data.punishCodeCheck2 == '1') {$("#punishCodeCheck2").attr("checked",true); $("#divPunishCodeCheck2").css('display', '');}
	$('#tdPunishCodeContent2').text($.utils.getNotNullVal(g_params.data.punishCodeContent2));
	if(g_params.data.punishCodeCheck3 == '1') {$("#punishCodeCheck3").attr("checked",true); $("#divPunishCodeCheck3").css('display', '');}
	$('#tdPunishCodeContent3').text($.utils.getNotNullVal(g_params.data.punishCodeContent3));
	if(g_params.data.punishCodeCheck4 == '1') {$("#punishCodeCheck4").attr("checked",true); $("#divPunishCodeCheck4").css('display', '');}
	$('#tdPunishCodeContent4').text($.utils.getNotNullVal(g_params.data.punishCodeContent4));
	$('#tdReviewContent').text($.utils.getNotNullVal(g_params.data.reviewContent));
}
