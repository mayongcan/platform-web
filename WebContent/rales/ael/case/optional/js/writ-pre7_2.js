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
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.stopDate);
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdLawInfo').text($.utils.getNotNullVal(g_params.data.lawInfo));
	$('#tdEvidence').text($.utils.getNotNullVal(g_params.data.evidence));
	$('#tdRule1').text($.utils.getNotNullVal(g_params.data.rule1));
	$('#tdRule2').text($.utils.getNotNullVal(g_params.data.rule2));
	$('#tdRule3').text($.utils.getNotNullVal(g_params.data.rule3));
	$('#tdRule4').text($.utils.getNotNullVal(g_params.data.rule4));
	if(g_params.data.lawType == '1') $('#tdLawType').text("轻微");
	else if(g_params.data.lawType == '2') $('#tdLawType').text("一般");
	else if(g_params.data.lawType == '3') $('#tdLawType').text("严重");
	else if(g_params.data.lawType == '4') $('#tdLawType').text("特别严重");
	else $('#tdLawType').text("");
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	$('#tdDeadline').text($.utils.getNotNullVal(g_params.data.deadline));
	$('#tdAddr').text($.utils.getNotNullVal(g_params.data.addr));
	$('#tdContactUser').text($.utils.getNotNullVal(g_params.data.contactUser));
	$('#tdContactPhone').text($.utils.getNotNullVal(g_params.data.contactPhone));
	$('#tdContactAddr').text($.utils.getNotNullVal(g_params.data.contactAddr));
	//1111111111111111111
	if(g_params.data.selectAddr == '1') $("#selectAddr").css('display', '');
	//1111111111111111111
	if(g_params.data.selectLaw == '1') $("#selectLaw").css('display', '');
}
