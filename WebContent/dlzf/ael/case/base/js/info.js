$(function () {
	//填充基本信息
	
	$('#caseSource').text(top.app.getDictName(parent.g_params.row.sourceCase, parent.g_params.caseSourceDict));
	if($.utils.isNull(parent.g_params.row.associateUserName))
		$('#defendantName').text(parent.g_params.row.createUserName);	//【承办人】字段，自动获取新建“案件登记表”账号的姓名
	else 
		$('#defendantName').text(parent.g_params.row.createUserName + "、" + parent.g_params.row.associateUserName);	//【承办人】字段，自动获取新建“案件登记表”账号的姓名
	$('#defendantAddress').text(parent.g_params.row.address);
	$('#defendantDate').text($.date.dateFormat(parent.g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#reporterName').text(parent.g_params.row.defendantName);	//自动获取“案件登记表”的【被报告人】的“姓名/单位”字段。

	$('#reporterCertificateNo').text($.utils.getNotNullVal(parent.g_params.row.reporterCertificateNo));
	$('#reporterAddress').text($.utils.getNotNullVal(parent.g_params.row.reporterAddress));
	$('#reporterZip').text(parent.g_params.row.reporterZip);
	$('#reporterPhone').text($.utils.getNotNullVal(parent.g_params.row.reporterPhone));
	$('#clueSummary').text(parent.g_params.row.clueSummary);
	$('#memo').text(parent.g_params.row.memo);
	
	//获取立案审批表文书
	var dataInfo = rales.getWritContent(parent.g_params.row.id, rales.writNecessity2_1, "");
	if(!$.utils.isNull(dataInfo.content)){
		dataInfo.content = eval("(" + dataInfo.content + ")");
		$('#illegalContent').text($.utils.getNotNullVal(dataInfo.content.illegalContent));
	}
});