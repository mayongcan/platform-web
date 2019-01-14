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
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.data.illegalRule));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.handleDate);
//	$('#tdHandleDate').text($.utils.getNotNullVal(g_params.data.handleDate));
	$('#tdSaveType').text($.utils.getNotNullVal(g_params.data.saveType));
	$('#tdSaveAddr').text($.utils.getNotNullVal(g_params.data.saveAddr));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.saveDateBegin);
//	$('#tdSaveDateBegin').text($.utils.getNotNullVal(g_params.data.saveDateBegin));
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.saveDateEnd);
//	$('#tdSaveDateEnd').text($.utils.getNotNullVal(g_params.data.saveDateEnd));
	$('#tdReview1').text($.utils.getNotNullVal(g_params.data.review1));
	$('#tdReview2').text($.utils.getNotNullVal(g_params.data.review2));
	$('#tdLawsuit').text($.utils.getNotNullVal(g_params.data.lawsuit));
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
	//1111111111111111111111111111
	$('#tdEnclosure').text($.utils.getNotNullVal(g_params.data.enclosure));
	//1111111111111111111
	if(g_params.data.selectEnclosure == '1') $("#selectEnclosure").css('display', '');
}
