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
	rales.fixALinkWidth();
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
	
	rales.setDatetimeInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), $('#dataHour'), $('#dataMinute'), g_params.data.checkDateBegin);
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.checkDateEnd);
	
//	$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.data.checkDateBegin));
//	$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.data.checkDateEnd));
	$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.data.checkAddr));
	$('#tdType').text($.utils.getNotNullVal(g_params.data.type));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdCompanyCreditCode').text($.utils.getNotNullVal(g_params.data.companyCreditCode));
	$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.data.companyPhone));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.data.partiesJob));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.data.partiesUnit));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.partiesZip));

	$('#tdWitnessName').text($.utils.getNotNullVal(g_params.data.witnessName));
	$('#tdWitnessSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.witnessSex, g_params.sexDict)));
	$('#tdWitnessJob').text($.utils.getNotNullVal(g_params.data.witnessJob));
	$('#tdWitnessIdCard').text($.utils.getNotNullVal(g_params.data.witnessIdCard));
	$('#tdWitnessUnit').text($.utils.getNotNullVal(g_params.data.witnessUnit));
	$('#tdWitnessPhone').text($.utils.getNotNullVal(g_params.data.witnessPhone));
	$('#tdWitnessAddr').text($.utils.getNotNullVal(g_params.data.witnessAddr));
	$('#tdWitnessZip').text($.utils.getNotNullVal(g_params.data.witnessZip));
	
	$('#tdLawOffice').text($.utils.getNotNullVal(g_params.data.lawOffice));
	$('#tdLawUser').text($.utils.getNotNullVal(g_params.data.lawUser1) + "、" + $.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdLawUserCardNo').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1) + "、" + $.utils.getNotNullVal(g_params.data.lawUserCardNo2));
//	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
//	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
//	$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1));
//	$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.data.lawUserCardNo2));
	$('#tdNoticeUser').text($.utils.getNotNullVal(g_params.data.noticeUser));
	$('#tdNoticeAnswer').text($.utils.getNotNullVal(g_params.data.noticeAnswer));
	$('#tdCheckDetail').text($.utils.getNotNullVal(g_params.data.checkDetail));
	$('#tdAskInfo').text($.utils.getNotNullVal(g_params.data.askInfo));
	$('#tdHandleInfo').text($.utils.getNotNullVal(g_params.data.handleInfo));
	if(g_params.data.selectUser1 == '1') $("#selectUser1").css('display', '');
	if(g_params.data.selectUser2 == '1') $("#selectUser2").css('display', '');
}
