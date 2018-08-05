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
	$('#tdAdminDecision').text($.utils.getNotNullVal(g_params.data.adminDecision));
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.decisionDate);
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.arrayDate);
	$('#tdDeadline').text($.utils.getNotNullVal(g_params.data.deadline));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));
	$('#tdLastDay').text($.utils.getNotNullVal(g_params.data.lastDay));
	if(g_params.data.executeType == "1") $('#tdExecuteType').text("依法行政强制执行");
	else if(g_params.data.executeType == "2") $('#tdExecuteType').text("申请人民法院强制执行");
	else $('#tdExecuteType').text("");
	$("input[type='radio'][name=executeType][value=" + g_params.data.executeType + "]").attr("checked",true);
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
}
