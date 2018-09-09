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

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdName').text($.utils.getNotNullVal(g_params.data.name));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdAddress').text($.utils.getNotNullVal(g_params.data.address));

	$('#tdAdminDecision').text($.utils.getNotNullVal(g_params.data.adminDecision));
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.decisionDate);
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.arrayDate);
	$('#tdDeadline').text($.utils.getNotNullVal(g_params.data.deadline));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));

	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.sendDate);
	$('#tdPushWrit').text($.utils.getNotNullVal(g_params.data.pushWrit));
	rales.setDateInfo($('#dataYear3'), $('#dataMonth3'), $('#dataDay3'), g_params.data.carrayOutDate);
	$('#tdBaseRule1').text($.utils.getNotNullVal(g_params.data.baseRule));
	rales.setDateInfo($('#dataYear4'), $('#dataMonth4'), $('#dataDay4'), g_params.data.handleDate);
	$('#tdHandleType').text($.utils.getNotNullVal(g_params.data.handleType));
	$('#tdReview1').text($.utils.getNotNullVal(g_params.data.review1));
	$('#tdReview2').text($.utils.getNotNullVal(g_params.data.review2));
	$('#tdLawsuit').text($.utils.getNotNullVal(g_params.data.lawsuit));
	
	if(g_params.data.caseInfo == '1') $('#tdCaseInfo').text("当事人催告期间有转移、隐匿财物的情况。");
	else $('#tdCaseInfo').remove();
}
