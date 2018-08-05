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
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.inquiryBeginDate);
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.inquiryEndDate);
	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdContent1').text($.utils.getNotNullVal(g_params.data.content1));
	$('#tdContent2').text($.utils.getNotNullVal(g_params.data.content2));
	$('#tdContent3').text($.utils.getNotNullVal(g_params.data.content3));
}
