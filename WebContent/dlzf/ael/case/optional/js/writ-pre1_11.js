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
	else $("#personType2").attr("checked",true);

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdCompanyJob').text($.utils.getNotNullVal(g_params.data.companyJob));
	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdIllegalReason').text($.utils.getNotNullVal(g_params.data.illegalReason));
	$('#tdCompanyCode').text($.utils.getNotNullVal(g_params.data.companyCode));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.illegalDate);
//	$('#tdIllegalDate').text($.utils.getNotNullVal(g_params.data.illegalDate));
	$('#tdIllegalAddr').text($.utils.getNotNullVal(g_params.data.illegalAddr));
	$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.data.illegalRule));
	if(g_params.data.defendType == '1') $('#tdDefendType').text("并听取了你（单位）的陈述申辩");
	else $('#tdDefendType').text("对此，你（单位）未作陈述申辩");
	$("input[type='radio'][name=defendType][value=" + g_params.data.defendType + "]").attr("checked",true);
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	if(g_params.data.punishType1 == '1') $("#punishType1").attr("checked",true);
	if(g_params.data.punishType2 == '1') $("#punishType2").attr("checked",true);
	
	$('#punishMoney1').text($.utils.getNotNullVal(g_params.data.punishMoney1));
	$('#punishMoney2').text($.utils.getNotNullVal(g_params.data.punishMoney2));
	$('#punishMoney3').text($.utils.getNotNullVal(g_params.data.punishMoney3));
	$('#punishMoney4').text($.utils.getNotNullVal(g_params.data.punishMoney4));
	$('#tdPunishMoneyAll').text($.utils.getNotNullVal(g_params.data.punishMoneyAll));

	if(g_params.data.punishMoneyType1 == '1') $("#punishMoneyType1").attr("checked",true);
	if(g_params.data.punishMoneyType2 == '1') $("#punishMoneyType2").attr("checked",true);
	$('#tdBankName').text($.utils.getNotNullVal(g_params.data.bankName));
	$('#tdBankCode').text($.utils.getNotNullVal(g_params.data.bankCode));
	$('#tdBankUserName').text($.utils.getNotNullVal(g_params.data.bankUserName));
	$('#tdReview1').text($.utils.getNotNullVal(g_params.data.review1));
	$('#tdReview2').text($.utils.getNotNullVal(g_params.data.review2));
	$('#tdLawsuit').text($.utils.getNotNullVal(g_params.data.lawsuit));
}
