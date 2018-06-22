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
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}


//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#caseName').text(g_params.data.caseName);
	$('#illegalContent').text(g_params.data.illegalContent);
	$('#tdBePunishUser').text(g_params.data.tdBePunishUser);
	$('#tdHandleOrg').text(g_params.data.tdHandleOrg);
	$('#tdHandleUser').text(g_params.data.tdHandleUser);
	$('#caseBeginDate').text(g_params.data.caseBeginDate);
	$('#caseEndDate').text(g_params.data.caseEndDate);
	$('#caseBeginVolumeDate').text(g_params.data.caseBeginVolumeDate);
	$('#caseVolumeUser').text(g_params.data.caseVolumeUser);
	$('#caseTestVolumeDate').text(g_params.data.caseTestVolumeDate);
	$('#caseTestVolumeUser').text(g_params.data.caseTestVolumeUser);
	$('#caseSaveVolumeDate').text(g_params.data.caseSaveVolumeDate);
	$('#caseSaveVolumeNum').text(g_params.data.caseSaveVolumeNum);
	$('#caseSaveLimitDate').text(g_params.data.caseSaveLimitDate);
	$('#fileNum').text(g_params.data.totalNum);
	$('#pageNum').text(g_params.data.totalPage);
}