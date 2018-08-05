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
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdRule1').text($.utils.getNotNullVal(g_params.data.rule1));
	$('#tdRule2').text($.utils.getNotNullVal(g_params.data.rule2));
	$('#tdRule3').text($.utils.getNotNullVal(g_params.data.rule3));
	$('#tdRule4').text($.utils.getNotNullVal(g_params.data.rule4));
	$('#tdRuleEvidence').text($.utils.getNotNullVal(g_params.data.ruleEvidence));
	$('#tdRule5').text($.utils.getNotNullVal(g_params.data.rule5));
	$('#tdRule6').text($.utils.getNotNullVal(g_params.data.rule6));
	$('#tdRule7').text($.utils.getNotNullVal(g_params.data.rule7));
	$('#tdRule8').text($.utils.getNotNullVal(g_params.data.rule8));
	if(g_params.data.stopAction1 == '1') $("#stopAction1").attr("checked",true);
	if(g_params.data.stopAction2 == '1') $("#stopAction2").attr("checked",true);
	if(g_params.data.stopAction3 == '1') $("#stopAction3").attr("checked",true);
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.stopDate);
//	$('#tdStopDate').text($.utils.getNotNullVal(g_params.data.stopDate));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.handleDate);
//	$('#tdHandleDate').text($.utils.getNotNullVal(g_params.data.handleDate));
	$('#tdOrg').text($.utils.getNotNullVal(g_params.data.org));
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.changeDate);
//	$('#tdChangeDate').text($.utils.getNotNullVal(g_params.data.changeDate));
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
}
