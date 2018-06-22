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
	$('#illegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		$('#discussDate').text(g_params.data.discussDate);
		$('#discussAddress').text(g_params.data.discussAddress);
		$('#compere').text(g_params.data.compere);
		$('#recorder').text(g_params.data.recorder);
		$('#joiner').text(g_params.data.joiner);
		$('#discussInfo').text(g_params.data.discussInfo);
		$('#discussResult').text(g_params.data.discussResult);
	}else{
		$('#discussDate').text(g_params.data.discussDate);
		$('#discussAddress').text(g_params.data.discussAddress);
		$('#compere').text(g_params.data.compereBy);
		$('#recorder').text(g_params.data.recordBy);
		$('#joiner').text(g_params.data.joinBy);
		$('#discussInfo').text(g_params.data.situation);
		$('#discussResult').text(g_params.data.conclusion);
	}
}
