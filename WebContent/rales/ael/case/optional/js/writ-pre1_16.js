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
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	$('#tdCaseNo').text($.utils.getNotNullVal(g_params.data.caseNo));
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdSignUser').text($.utils.getNotNullVal(g_params.data.signUser));
	$('#tdCardType').text($.utils.getNotNullVal(g_params.data.cardType));
	$('#tdCardNo').text($.utils.getNotNullVal(g_params.data.cardNo));
	$('#tdAddress').text($.utils.getNotNullVal(g_params.data.address));
	//$("input[type='radio'][name=receiveType][value=" + g_params.data.receiveType + "]").attr("checked",true);
	if(g_params.data.receiveType == '1') $('#tdReceiveType').text("是");
	else $('#tdReceiveType').text("否");
	$('#phone').text($.utils.getNotNullVal(g_params.data.phone));
	$('#fax').text($.utils.getNotNullVal(g_params.data.fax));
	$('#email').text($.utils.getNotNullVal(g_params.data.email));
	$('#tdPhone').text($.utils.getNotNullVal(g_params.data.phone));
	$('#tdFax').text($.utils.getNotNullVal(g_params.data.fax));
	$('#tdEmail').text($.utils.getNotNullVal(g_params.data.email));
	$('#tdZip').text($.utils.getNotNullVal(g_params.data.zip));
	$('#tdOtherType').text($.utils.getNotNullVal(g_params.data.otherType));
	$('#tdMemo').text($.utils.getNotNullVal(g_params.data.memo));
}
