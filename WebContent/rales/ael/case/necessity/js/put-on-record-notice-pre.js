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
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		$('#illegalContent').text(g_params.data.illegalContent);
		$('#caseClauseCountry').text(g_params.data.caseClauseCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#caseClauseProvince').text(g_params.data.caseClauseProvince);
		$('#lawExecutor1').text(g_params.data.lawExecutor1);
		$('#lawExecutorIdCard1').text(g_params.data.lawExecutorIdCard1);
		$('#lawExecutor2').text(g_params.data.lawExecutor2);
		$('#lawExecutorIdCard2').text(g_params.data.lawExecutorIdCard2);
		$('#lawOfficeAddress').text(g_params.data.lawOfficeAddress);
		$('#contacterName').text(g_params.data.contacterName);
		$('#contacterPhone').text(g_params.data.contacterPhone);
	}else{
		$('#caseParties').text(g_params.data.parties);
		$('#illegalContent').text(g_params.data.illegalContent);
		$('#caseClauseCountry').text(g_params.data.caseClauseCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#caseClauseProvince').text(g_params.data.caseClauseProvince);
		$('#lawExecutor1').text(g_params.data.lawPersonOne);
		$('#lawExecutorIdCard1').text(g_params.data.lawPersonIdone);
		$('#lawExecutor2').text(g_params.data.lawPersonTwo);
		$('#lawExecutorIdCard2').text(g_params.data.lawPersonIdtwo);
		$('#lawOfficeAddress').text(g_params.data.lawAddress);
		$('#contacterName').text(g_params.data.lawContact);
		$('#contacterPhone').text(g_params.data.lawPhone);
	}
}
