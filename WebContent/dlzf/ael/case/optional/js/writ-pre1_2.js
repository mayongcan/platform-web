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

	if(g_params.data.personType == '1') {
		$("#personType1").attr("checked",true);
		$('#divPersonType2').remove();
	}
	else if(g_params.data.personType == '2') {
		$("#personType2").attr("checked",true);
		$('#divPersonType1').remove();
	}
	
	rales.setDatetimeInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), $('#dataHour'), $('#dataMinute'), g_params.data.checkDateBegin);
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.checkDateEnd);
	
//	$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.data.checkDateBegin));
//	$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.data.checkDateEnd));
	$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.data.checkAddr));
	$('#tdCheckContent').text($.utils.getNotNullVal(g_params.data.checkContent));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdCompanyCreditCode').text($.utils.getNotNullVal(g_params.data.companyCreditCode));
	$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.data.companyPhone));
	$('#tdCompanyPrincipal').text($.utils.getNotNullVal(g_params.data.companyPrincipal));
	$('#tdCompanyCurUser').text($.utils.getNotNullVal(g_params.data.companyCurUser));
	$('#tdCompanyIdCard').text($.utils.getNotNullVal(g_params.data.companyIdCard));
	$('#tdCompanyPost').text($.utils.getNotNullVal(g_params.data.companyPost));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.data.partiesJob));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.data.partiesUnit));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.partiesZip));
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
	$('#tdInquiryQuestion').text($.utils.getNotNullVal(g_params.data.inquiryQuestion));
	$('#tdInquiryAnswer').text($.utils.getNotNullVal(g_params.data.inquiryAnswer));
	$('#tdRule1').text($.utils.getNotNullVal(g_params.data.rule1));
	$('#tdRule2').text($.utils.getNotNullVal(g_params.data.rule2));
	$('#tdRule3').text($.utils.getNotNullVal(g_params.data.rule3));
	$('#tdRule4').text($.utils.getNotNullVal(g_params.data.rule4));
	$('#tdRuleAnswer').text($.utils.getNotNullVal(g_params.data.ruleAnswer));
	if(g_params.data.selectUser1 == '1') $("#selectUser1").css('display', '');
	if(g_params.data.selectUser2 == '1') $("#selectUser2").css('display', '');
	
	if($.utils.isEmpty(g_params.data.companyPrincipal)) $('#spanCompanyPrincipal').remove();
	if($.utils.isEmpty(g_params.data.companyCurUser)) $('#spanCompanyCurUser').remove();
	
	if($.utils.isEmpty(g_params.data.rule1)) $('#spanRule1').remove();
	if($.utils.isEmpty(g_params.data.rule2)) $('#spanRule2').remove();
	if($.utils.isEmpty(g_params.data.rule3)) $('#spanRule3').remove();
	if($.utils.isEmpty(g_params.data.rule4)) $('#spanRule4').remove();
	
	if(!$.utils.isEmpty(g_params.data.askList)){
		var askList = eval("(" + g_params.data.askList + ")");
		for(var index = 0; index < askList.length; index++){
			$('#divAakList').append('<div class="box-content">' +
									'问：<span>' + askList[index].inquiryQuestion + '</span>' +
									'</div>' +
									'<div class="box-content">' +
										'答：<span>' + askList[index].inquiryAnswer + '</span>' +
									'</div>')
		}
	}
}
