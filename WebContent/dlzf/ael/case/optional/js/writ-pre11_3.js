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

	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesAge').text($.utils.getNotNullVal(g_params.data.partiesAge));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));

	$('#tdPartiesName1').text($.utils.getNotNullVal(g_params.data.partiesName1));
	$('#tdPartiesSex1').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex1, g_params.sexDict)));
	$('#tdPartiesAge1').text($.utils.getNotNullVal(g_params.data.partiesAge1));
	$('#tdPartiesAddr1').text($.utils.getNotNullVal(g_params.data.partiesAddr1));
	$('#tdPartiesCertificateNo1').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo1));

	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdProtocol').text($.utils.getNotNullVal(g_params.data.protocol));
	$('#tdPrincipal').text($.utils.getNotNullVal(g_params.data.principal));
	$('#tdHandler').text($.utils.getNotNullVal(g_params.data.handler));
}
