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

	$('#tdCaseParties').text($.utils.getNotNullVal(g_params.data.caseParties));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.createDate);
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdCaseNo').text($.utils.getNotNullVal(g_params.data.caseNo));
	$("#tdTotalCnt1").text($.utils.getNotNullVal(g_params.data.totalCnt1));
	$("#tdTotalCnt2").text($.utils.getNotNullVal(g_params.data.totalCnt2));
}
