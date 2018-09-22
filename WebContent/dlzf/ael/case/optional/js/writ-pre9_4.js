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
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.sendDate);
	$('#tdCode1').text($.utils.getNotNullVal(g_params.data.code1));
	$('#tdCode2').text($.utils.getNotNullVal(g_params.data.code2));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.receiveDate);
}
