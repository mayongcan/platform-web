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

	rales.setDatetimeInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), $('#dataHour'), $('#dataMinute'), g_params.data.checkDateBegin);
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.checkDateEnd);
	

	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.data.checkAddr));
	$('#tdHearingType').text($.utils.getNotNullVal(g_params.data.hearingType));
	$('#tdMainUser1').text($.utils.getNotNullVal(g_params.data.mainUser1));
	$('#tdMainUserJob1').text($.utils.getNotNullVal(g_params.data.mainUserJob1));
	$('#tdMainUser2').text($.utils.getNotNullVal(g_params.data.mainUser2));
	$('#tdMainUserJob2').text($.utils.getNotNullVal(g_params.data.mainUserJob2));
	$('#tdMainUser3').text($.utils.getNotNullVal(g_params.data.mainUser3));
	$('#tdMainUserJob3').text($.utils.getNotNullVal(g_params.data.mainUserJob3));
	$('#tdMainUser4').text($.utils.getNotNullVal(g_params.data.mainUser4));
	$('#tdMainUserJob4').text($.utils.getNotNullVal(g_params.data.mainUserJob4));
	$('#tdMainUser5').text($.utils.getNotNullVal(g_params.data.mainUser5));
	$('#tdMainUserJob5').text($.utils.getNotNullVal(g_params.data.mainUserJob5));
	
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.data.partiesUnit));
	$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.data.partiesJob));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.partiesZip));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdDelegateName').text($.utils.getNotNullVal(g_params.data.delegateName));
	$('#tdDelegateSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.delegateSex, g_params.sexDict)));
	$('#tdDelegateIdCard').text($.utils.getNotNullVal(g_params.data.delegateIdCard));
	$('#tdDelegateWork').text($.utils.getNotNullVal(g_params.data.delegateWork));
	$('#tdDelegateJob').text($.utils.getNotNullVal(g_params.data.delegateJob));
	$('#tdDelegatePhone').text($.utils.getNotNullVal(g_params.data.delegatePhone));
	$('#tdOtherJoin').text($.utils.getNotNullVal(g_params.data.otherJoin));
	
	$('#tdHearingRequest').text($.utils.getNotNullVal(g_params.data.hearingRequest));
	$('#tdAdvice').text($.utils.getNotNullVal(g_params.data.advice));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));
}
