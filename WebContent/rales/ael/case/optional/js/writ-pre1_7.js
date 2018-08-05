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
	
	$('#tdCreateDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.createDate, "yyyy年MM月dd日HH时mm分")));
	$('#tdSampleAddr').text($.utils.getNotNullVal(g_params.data.sampleAddr));
	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1));
	$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.data.lawUserCardNo2));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdSampleObj').text($.utils.getNotNullVal(g_params.data.sampleObj));
	$('#tdSampleNum').text($.utils.getNotNullVal(g_params.data.sampleNum));
	$('#tdSampleType').text($.utils.getNotNullVal(g_params.data.sampleType));
	$('#tdSampleDetail').text($.utils.getNotNullVal(g_params.data.sampleDetail));
	$('#tdSampleResult').text($.utils.getNotNullVal(g_params.data.sampleResult));
	$('#tdMemo').text($.utils.getNotNullVal(g_params.data.memo));
}
