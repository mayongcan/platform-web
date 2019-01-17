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

	$('#tdWritCode').text(g_params.data.tableTitleMark);
	
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.stopDate);
	$('#tdWritCode').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdWritCode1').text($.utils.getNotNullVal(g_params.data.writCode));
	$('#tdObjList').text($.utils.getNotNullVal(g_params.data.objList));
	$('#tdMeasureType').text($.utils.getNotNullVal(g_params.data.measureType));
	if(g_params.data.checkType == '1') $('#tdCheckType').text("检测");
	else if(g_params.data.checkType == '2') $('#tdCheckType').text("检验");
	else if(g_params.data.checkType == '3') $('#tdCheckType').text("检疫");
	else if(g_params.data.checkType == '4') $('#tdCheckType').text("技术鉴定");
	else $('#tdCheckType').text("");
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.beginDate);
	rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.endDate);
	rales.setDateInfo($('#dataYear3'), $('#dataMonth3'), $('#dataDay3'), g_params.data.deadlineDate);
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
	
	
}
