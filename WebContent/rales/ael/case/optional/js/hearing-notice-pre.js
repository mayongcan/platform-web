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
		$("#printType").html("第一联<br/><br/>交听证人");
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
	$('#illegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.hearingDate);
		$('#hearingAddress').text(g_params.data.hearingAddress);
		$('#radioHearingType').text(g_params.data.radioHearingType == '1' ? '公开' : '不公开');
		$('#compereName').text(g_params.data.compereName);
		$('#compereJob').text(g_params.data.compereJob);
		$('#clerkName').text(g_params.data.clerkName);
		$('#deadline').text(g_params.data.deadline);
		$('#address').text(g_params.data.address);
		$('#contacterName').text(g_params.data.contacterName);
		$('#contacterPhone').text(g_params.data.contacterPhone);
	}else{
		$('#caseParties').text(g_params.data.parties);
		rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.hearingDay);
		$('#hearingAddress').text(g_params.data.address);
		$('#radioHearingType').text(g_params.data.type == '1' ? '公开' : '不公开');
		$('#compereName').text(g_params.data.name);
		$('#compereJob').text(g_params.data.position);
		$('#clerkName').text(g_params.data.courtClerkName);
		$('#deadline').text(g_params.data.treatmentDate);
		$('#address').text(g_params.data.lawAddress);
		$('#contacterName').text(g_params.data.lawContact);
		$('#contacterPhone').text(g_params.data.lawPhone);
	}
}
