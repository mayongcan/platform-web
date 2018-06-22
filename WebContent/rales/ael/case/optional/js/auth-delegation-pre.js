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
		$("#printType").html("第一联<br/><br/>交受托人");
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
		$('#companyName').text(g_params.data.companyName);
		$('#device').text(g_params.data.device);
		$('#materialsNum').text(g_params.data.materialsNum);
		$('#deviceNum').text(g_params.data.deviceNum);
	}else{
		$('#companyName').text(g_params.data.parties);
		$('#device').text(g_params.data.content);
		$('#materialsNum').text(g_params.data.materialNumber);
		$('#deviceNum').text(g_params.data.equipmentNumber);
	}
}
