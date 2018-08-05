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
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdTranReason').text($.utils.getNotNullVal(g_params.data.tranReason));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.createDate);
	$('#tdBeTranName').text($.utils.getNotNullVal(g_params.data.beTranName));
	$('#tdBeTranName1').text($.utils.getNotNullVal(g_params.data.beTranName));
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdMeasureType').text($.utils.getNotNullVal(g_params.data.measureType));
	$("#tdMeasureObj").text($.utils.getNotNullVal(g_params.data.measureObj));
	$("#tdContacterName").text($.utils.getNotNullVal(g_params.data.contacterName));
	$("#tdContacterPhone").text($.utils.getNotNullVal(g_params.data.contacterPhone));
	$("#tdLawOfficeAddress").text($.utils.getNotNullVal(g_params.data.lawOfficeAddress));
}
