$(function () {
	//填充基本信息
	$('#illegalContent').text(parent.g_params.row.illegalContent);
	$('#caseSource').text(top.app.getDictName(parent.g_params.row.sourceCase, parent.g_params.caseSourceDict));
	$('#defendantName').text(parent.g_params.row.createUserName + "、" + parent.g_params.row.associateUserName);	//【承办人】字段，自动获取新建“案件登记表”账号的姓名
	$('#defendantAddress').text(parent.g_params.row.address);
	$('#defendantDate').text($.date.dateFormat(parent.g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#reporterName').text(parent.g_params.row.defendantName);	//自动获取“案件登记表”的【被报告人】的“姓名/单位”字段。
	//以下四项是立案审批表的
	var filingInfo = rales.getCaseFilingInfo(parent.g_params.row.id);
	$('#reporterCertificateNo').text(filingInfo.certificateNo);
	$('#reporterAddress').text(filingInfo.address);
	$('#reporterZip').text(filingInfo.zip);
	$('#reporterPhone').text(filingInfo.phone);
	$('#memo').text(parent.g_params.row.memo);
});