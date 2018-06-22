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
	var height = ($('#tdHearingDetailContent').height() < 80) ? 130 : $('#tdHearingDetailContent').height();
	$('#tdHearingDetail').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	height = ($('#tdLeaderSuggestContent').height() < 80) ? 130 : ($('#tdLeaderSuggestContent').height() + 40);
	$('#tdLeaderSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#tdIllegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		$('#tdPartiesName').text(g_params.data.tdPartiesName);		
		$('#tdPartiesCertificateNo').text(g_params.data.tdPartiesCertificateNo);
		$('#tdPartiesCompany').text(g_params.data.tdPartiesCompany);
		$('#tdPartiesContacts').text(g_params.data.tdPartiesContacts);
		$('#tdPartiesAddress').text(g_params.data.tdPartiesAddress);
		$('#tdPartiesZip').text(g_params.data.tdPartiesZip);
		$('#tdPartiesPhone').text(g_params.data.tdPartiesPhone);
		$('#tdHearingDetailContent').text(g_params.data.hearingDetail);
		$('#tdSuggestContent').text(g_params.data.suggest);
		$('#tdMemo').text(g_params.data.memo);
	}else{
		$('#tdPartiesName').text(g_params.data.parties);		
		$('#tdPartiesCertificateNo').text(g_params.data.certificateNo);
		$('#tdPartiesCompany').text(g_params.data.company);
		$('#tdPartiesContacts').text(g_params.data.legalRepresentative);
		$('#tdPartiesAddress').text(g_params.data.address);
		$('#tdPartiesZip').text(g_params.data.zip);
		$('#tdPartiesPhone').text(g_params.data.phone);
		$('#tdHearingDetailContent').text(g_params.data.hearingCondition);
		$('#tdSuggestContent').text(g_params.registerRow.suggest);
		$('#tdMemo').text(g_params.data.memo);
	}
}
