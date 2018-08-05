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
	rales.setDatetimeInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), $('#dataHour'), $('#dataMinute'), g_params.data.checkDateBegin);
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.checkDateEnd);
	
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
	$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1));
	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.data.lawUserCardNo2));
	$('#tdHearingOrg').text($.utils.getNotNullVal(g_params.data.hearingOrg));
	$('#tdMainUser1').text($.utils.getNotNullVal(g_params.data.mainUser1));
	$('#tdMainUserJob1').text($.utils.getNotNullVal(g_params.data.mainUserJob1));
	$('#tdMainUser2').text($.utils.getNotNullVal(g_params.data.mainUser2));
	$('#tdMainUserJob2').text($.utils.getNotNullVal(g_params.data.mainUserJob2));
	$('#tdMainUser3').text($.utils.getNotNullVal(g_params.data.mainUser3));
	$('#tdMainUserJob3').text($.utils.getNotNullVal(g_params.data.mainUserJob3));
//	$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.data.checkDateBegin));
//	$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.data.checkDateEnd));
	$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.data.checkAddr));
	
	$('#tdPartiesName1').text($.utils.getNotNullVal(g_params.data.partiesName1));
	$('#tdPartiesNameJob1').text($.utils.getNotNullVal(g_params.data.partiesNameJob1));
	$('#tdPartiesName2').text($.utils.getNotNullVal(g_params.data.partiesName2));
	$('#tdPartiesNameJob2').text($.utils.getNotNullVal(g_params.data.partiesNameJob2));
	
	$('#tdBaseInfo').text($.utils.getNotNullVal(g_params.data.baseInfo));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));
	$('#tdAdvice').text($.utils.getNotNullVal(g_params.data.advice));
}
