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
	$('#illegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.date);
		$('#address').text(g_params.data.address);
		$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#rules').text(g_params.data.rules);
		$('#deadlineDate').text(g_params.data.deadlineDate);
		$('#lawExecutor1').text(g_params.data.lawExecutor1);
		$('#lawExecutor2').text(g_params.data.lawExecutor2);
		$('#contacterAddress').text(g_params.data.contacterAddress);
		$('#contacterPhone').text(g_params.data.contacterPhone);
	}else{
		$('#address').text(g_params.registerRow.address);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.registerRow.occurrenceDate);
		$('#caseParties').text(g_params.data.parties);
		$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#rules').text(g_params.data.otherGist);
		$('#deadlineDate').text(g_params.data.rectifyDate);
		$('#lawExecutor1').text(g_params.data.lawPersonOne);
		$('#lawExecutor2').text(g_params.data.lawPersonTwo);
		$('#contacterAddress').text(g_params.data.lawAddress);
		$('#contacterPhone').text(g_params.data.lawPhone);
	}
}
