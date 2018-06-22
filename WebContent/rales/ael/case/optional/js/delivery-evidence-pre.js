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
	$('#punishCode').text(g_params.data.punishCode);
	$('#hearingmeetingCode').text(g_params.data.hearingmeetingCode);
	$('#stoppunishCode').text(g_params.data.stoppunishCode);
	$('#preservationCode').text(g_params.data.preservationCode);
	$('#relieveCode').text(g_params.data.relieveCode);
	$('#otherCode').text($.utils.isEmpty(g_params.data.otherCode) ? '　' : g_params.data.otherCode);
	if($.utils.isNull(g_params.loadData)){
		$('#tdIllegalContent').text(g_params.data.illegalContent);
		$('#tdReporterName').text(g_params.data.illegalContent);
		$('#tdReporterCompany').text(g_params.data.beArray);
		$('#tdReporterAddress').text(g_params.data.address);
		$('#tdSuggestContent').text(g_params.data.reason);
		$('#tdMemo').text(g_params.data.memo);
	}else{
		$('#tdIllegalContent').text(g_params.registerRow.illegalContent);
		$('#tdReporterName').text(g_params.data.illegalContent);
		$('#tdReporterCompany').text(g_params.data.summonedInPerson);
		$('#tdReporterAddress').text(g_params.data.address);
		$('#tdSuggestContent').text(g_params.data.refuseAccept);
		$('#tdMemo').text(g_params.data.memo);
	}
}
