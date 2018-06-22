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
	if(g_params.printType == 1){
		$("#printType").html("第一联<br/><br/>交当事人");
	}else if(g_params.printType == 2){
		$("#printType").html("第二联<br/><br/>存<br/><br/><br/>根");
	}

	setData();
	rales.fixALinkWidth();
	//重设右侧高度
	$("#printType").css("marginTop", ($('#boxLeft').height() - $('#printType').height()) / 2);
	
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}
//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		$('#caseAddress').text(g_params.data.caseAddress);
		$('#illegalFact').text(g_params.data.illegalFact);
		$('#rules').text(g_params.data.rules);
	}else{
		$('#caseParties').text(g_params.data.parties);
		$('#caseAddress').text(g_params.data.address);
		$('#illegalFact').text(g_params.data.factMalfeasance);
		$('#rules').text(g_params.data.strip);
	}
}
