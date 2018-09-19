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
	//移除文书编号
	$('#tableTitleMark').remove();
	
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

	$('#tdMakeDesc').text($.utils.getNotNullVal(g_params.data.makeDesc));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdMakeAddr').text($.utils.getNotNullVal(g_params.data.makeAddr));
	$('#tdMakeDate').text($.utils.getNotNullVal($.date.dateFormat(g_params.data.makeDate, "yyyy年MM月dd日HH时mm分")));
	$('#tdMakeContent').text($.utils.getNotNullVal(g_params.data.makeContent));
	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1));
	$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.data.lawUserCardNo2));
}
