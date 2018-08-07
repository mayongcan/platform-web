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
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.decisionDate);
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdPunishMoney').text($.utils.getNotNullVal(g_params.data.punishMoney));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.deadlineDate);
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.stepDate);
	$('#tdStepCnt').text($.utils.getNotNullVal(g_params.data.stepCnt));
	$('#tdEachStep').text($.utils.getNotNullVal(g_params.data.eachStep));
	
	if(g_params.data.checkboxDeadlineDate == '1') {
		$("#checkboxDeadlineDate").attr("checked",true);
		$('#divCheckboxDeadlineDate').css('display', '');
	}
	if(g_params.data.checkboxStepDate == '1') {
		$("#checkboxStepDate").attr("checked",true);
		$('#divCheckboxStepDate').css('display', '');
	}
}
