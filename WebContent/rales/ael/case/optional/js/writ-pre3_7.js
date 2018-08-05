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
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.data.illegalRule));
	$('#tdContent').text($.utils.getNotNullVal(g_params.data.content));
	$('#tdMeasureType').text($.utils.getNotNullVal(g_params.data.content));
	$('#tdDeadline').text($.utils.getNotNullVal(g_params.data.deadline));
	$('#tdHandleType').text($.utils.getNotNullVal(g_params.data.handleType));
	$('#tdHandleContent').text($.utils.getNotNullVal(g_params.data.handleContent));
	$('#tdPlaceAddr').text($.utils.getNotNullVal(g_params.data.placeAddr));
	$('#tdReview1').text($.utils.getNotNullVal(g_params.data.review1));
	$('#tdReview2').text($.utils.getNotNullVal(g_params.data.review2));
	$('#tdLawsuit').text($.utils.getNotNullVal(g_params.data.lawsuit));
}
