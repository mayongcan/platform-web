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
	$('#address').text(g_params.data.address);
	$('#illegalContent').text(g_params.data.illegalContent);
	$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
	$('#caseClauseCountry').text(g_params.data.caseClauseCountry);
	$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
	$('#caseClauseProvince').text(g_params.data.caseClauseProvince);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.date);
		$('#rules').text(g_params.data.rules);
		$('#detainDay').text(g_params.data.detainDay);
		rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.detainBegin);
		rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.detainEnd);

		$('#closeUpDay').text(g_params.data.closeUpDay);
		rales.setDateInfo($('#dataYear3'), $('#dataMonth3'), $('#dataDay3'), g_params.data.closeUpBegin);
		rales.setDateInfo($('#dataYear4'), $('#dataMonth4'), $('#dataDay4'), g_params.data.closeUpEnd);

		$('#saveDay').text(g_params.data.saveDay);
		rales.setDateInfo($('#dataYear5'), $('#dataMonth5'), $('#dataDay5'), g_params.data.saveBegin);
		rales.setDateInfo($('#dataYear6'), $('#dataMonth6'), $('#dataDay6'), g_params.data.saveEnd);
		
		$('#saveAddress').text(g_params.data.saveAddress);
	}else{
		$('#caseParties').text(g_params.data.parties);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.occurrenceDate);
		$('#rules').text(g_params.data.content);
		$('#detainDay').text(g_params.data.detainNumber);
		rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.detainBeginDate);
		rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.detainEndDate);

		$('#closeUpDay').text(g_params.data.sealNumber);
		rales.setDateInfo($('#dataYear3'), $('#dataMonth3'), $('#dataDay3'), g_params.data.sealBeginDate);
		rales.setDateInfo($('#dataYear4'), $('#dataMonth4'), $('#dataDay4'), g_params.data.sealEndDate);

		$('#saveDay').text(g_params.data.saveNumber);
		rales.setDateInfo($('#dataYear5'), $('#dataMonth5'), $('#dataDay5'), g_params.data.saveBeginDate);
		rales.setDateInfo($('#dataYear6'), $('#dataMonth6'), $('#dataDay6'), g_params.data.saveEndDate);
		
		$('#saveAddress').text(g_params.data.saveAddress);
	}
}
