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

	$('#tdLawOffice').text($.utils.getNotNullVal(g_params.data.lawOffice));
	$('#tdAdminDecision').text($.utils.getNotNullVal(g_params.data.adminDecision));
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.decisionDate);
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.sendDate);
	$('#tdPushWrit').text($.utils.getNotNullVal(g_params.data.pushWrit));
	rales.setDateInfo($('#dataYear3'), $('#dataMonth3'), $('#dataDay3'), g_params.data.carrayOutDate);
	$('#tdProtocolContent').text($.utils.getNotNullVal(g_params.data.protocolContent));
	
	$('#tdName').text($.utils.getNotNullVal(g_params.data.name));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdAddress').text($.utils.getNotNullVal(g_params.data.address));
	
	$('#tdApplyInfo').text($.utils.getNotNullVal(g_params.data.applyInfo));
	$('#tdHandleContent').text($.utils.getNotNullVal(g_params.data.handleContent));
	$('#tdFileContent').html($.utils.getNotNullVal(g_params.data.fileContent).replace(/\n/g,'<br/>'));
	
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
}
