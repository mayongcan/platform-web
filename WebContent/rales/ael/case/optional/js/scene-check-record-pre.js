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
	if($.utils.isNull(g_params.loadData)){
		$('#tdIllegalContent').text(g_params.data.illegalContent);
		$('#tdPartiesName').text(g_params.data.partiesName);
		$('#tdPartiesCertificateNo').text(g_params.data.partiesCertificateNo);
		$('#tdPartiesCompany').text(g_params.data.partiesCompany);
		$('#tdPartiesContacts').text(g_params.data.partiesContacts);
		$('#tdPartiesAddress').text(g_params.data.partiesAddress);
		$('#tdCaseZip').text(g_params.data.caseZip);
		$('#tdCasePhone').text(g_params.data.casePhone);
		$('#checkOrg').text(g_params.data.checkOrg);
		$('#checkDate').text(g_params.data.checkDate);
		$('#checkRecord').text(g_params.data.checkRecord);
		$('#partiesOpinions').text(g_params.data.partiesOpinions);
	}else{
		$('#tdIllegalContent').text(g_params.data.illegalContent);
		$('#tdPartiesName').text(g_params.data.name);
		$('#tdPartiesCertificateNo').text(g_params.data.certificateNo);
		$('#tdPartiesCompany').text(g_params.data.company);
		$('#tdPartiesContacts').text(g_params.data.legalRepresentative);
		$('#tdPartiesAddress').text(g_params.data.address);
		$('#tdCaseZip').text(g_params.data.zip);
		$('#tdCasePhone').text(g_params.data.phone);
		$('#checkOrg').text(g_params.data.orgine);
		$('#checkDate').text($.date.dateFormat(g_params.data.checkDate, "yyyy-MM-dd"));
		$('#checkRecord').text(g_params.data.organizerRec);
		$('#partiesOpinions').text(g_params.data.partiesOpinions);
	}
}
