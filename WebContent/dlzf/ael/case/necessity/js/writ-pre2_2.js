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
	if(g_params.printType == 1){
		$("#printType").html("第一联<br/><br/>交当事人");
	}else if(g_params.printType == 2){
		$("#printType").html("第二联<br/><br/>存<br/><br/><br/>根");
	}
	setData();
	rales.fixALinkWidth();
	//重设右侧高度
	$("#printType").css("marginTop", ($('#boxLeft').height() - $('#printType').height()) / 2);	
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	$('#caseParties').text($.utils.getNotNullVal(g_params.data.caseParties));
	$('#illegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#caseClauseCountry').text($.utils.getNotNullVal(g_params.data.caseClauseCountry));
	$('#caseRulesProvince').text($.utils.getNotNullVal(g_params.data.caseRulesProvince));
	$('#caseClauseProvince').text($.utils.getNotNullVal(g_params.data.caseClauseProvince));
	$('#lawExecutor1').text($.utils.getNotNullVal(g_params.data.lawExecutor1));
	$('#lawExecutorIdCard1').text($.utils.getNotNullVal(g_params.data.lawExecutorIdCard1));
	$('#lawExecutor2').text($.utils.getNotNullVal(g_params.data.lawExecutor2));
	$('#lawExecutorIdCard2').text($.utils.getNotNullVal(g_params.data.lawExecutorIdCard2));
	//执法机关单位和申请地址栏 一致
	$('#applyAddress').text($.utils.getNotNullVal(g_params.data.lawOfficeAddress));
	$('#lawOfficeAddress').text($.utils.getNotNullVal(g_params.data.lawOfficeAddress));
	$('#contacterName').text($.utils.getNotNullVal(g_params.data.contacterName));
	$('#contacterPhone').text($.utils.getNotNullVal(g_params.data.contacterPhone));	
	//1111111111111111111
	$('#caseClause').text($.utils.getNotNullVal(g_params.data.caseClause));
}
