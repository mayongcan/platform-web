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
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.stopDate);
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdReason').text($.utils.getNotNullVal(g_params.data.reason));
	$('#tdRule').text($.utils.getNotNullVal(g_params.data.rule));
	$('#tdMeasureType').text($.utils.getNotNullVal(g_params.data.measureType));
	$('#tdMeasureObj').text($.utils.getNotNullVal(g_params.data.measureObj));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.beginDate);
	$("input[type='radio'][name=relieveType][value=" + g_params.data.relieveType + "]").attr("checked",true);
	$('#tdRelieveName').text($.utils.getNotNullVal(g_params.data.relieveName));
	$('#tdReturnContent1').text($.utils.getNotNullVal(g_params.data.returnContent1));
	$('#tdReturnContent2').text($.utils.getNotNullVal(g_params.data.returnContent2));
	$('#tdReturnContent3').text($.utils.getNotNullVal(g_params.data.returnContent3));
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
	
	if(g_params.data.relieveType == '1') $('#tdRelieveType').text("全部");
	else  $('#tdRelieveType').text("部分");
}
