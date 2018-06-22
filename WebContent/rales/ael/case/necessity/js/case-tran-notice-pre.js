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
	$('#tableTitleMark1').text(g_params.data.tableTitleMark);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties1').text(g_params.data.caseParties);
		$('#caseParties2').text(g_params.data.caseParties);
		$('#illegalContent1').text(g_params.data.illegalContent);
		$('#illegalContent2').text(g_params.data.illegalContent);
		rales.setDateInfo($('#tranDataYear1'), $('#tranDataMonth1'), $('#tranDataDay1'), g_params.data.tranDate);
		rales.setDateInfo($('#tranDataYear2'), $('#tranDataMonth2'), $('#tranDataDay2'), g_params.data.tranDate);
		$('#acceptMaster').text(g_params.data.acceptMaster);
		$('#operator').text(g_params.data.operator);
		$('#memo').text(g_params.data.memo);
		$('#provision').text(g_params.data.provision);
		$('#materials').text(g_params.data.materials);
	}else{
		$('#caseParties1').text(g_params.data.parties);
		$('#caseParties2').text(g_params.data.parties);
		$('#illegalContent1').text(g_params.data.illegalContent);
		$('#illegalContent2').text(g_params.data.illegalContent);
		rales.setDateInfo($('#tranDataYear1'), $('#tranDataMonth1'), $('#tranDataDay1'), g_params.data.transferDate);
		rales.setDateInfo($('#tranDataYear2'), $('#tranDataMonth2'), $('#tranDataDay2'), g_params.data.transferDate);
		$('#acceptMaster').text(g_params.data.acceptance);
		$('#operator').text(g_params.data.operator);
		$('#memo').text(g_params.data.memo);
		$('#provision').text(g_params.data.legalBasis);
		$('#materials').text(g_params.data.materialsNumber);
	}
}