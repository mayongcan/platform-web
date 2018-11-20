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
	//公民选择
	$('input[type=checkbox][id=personType1]').change(function() { 
		$("#personType1").attr("checked",true);
		$("#personType2").attr("checked",false);
	});
	$('input[type=checkbox][id=personType2]').change(function() { 
		$("#personType2").attr("checked",true);
		$("#personType1").attr("checked",false);
	});
	
	setData();
	var height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	height = ($('#tdLawSuggestContent').height() < 80) ? 130 : ($('#tdLawSuggestContent').height() + 70);
	$('#tdLawSuggest').height(height);
	height = ($('#tdUnitSuggestContent').height() < 80) ? 130 : ($('#tdUnitSuggestContent').height() + 70);
	$('#tdUnitSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	if(g_params.data.personType == '1') {
		$("#personType1").attr("checked",true);
		$('#trPersonType2_1').css('display', 'none');
		$('#trPersonType2_2').css('display', 'none');
	}
	else if(g_params.data.personType == '2') {
		$("#personType2").attr("checked",true);
		$('#trPersonType1_1').css('display', 'none');
		$('#trPersonType1_2').css('display', 'none');
	}
	//获取字典
	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	if($.utils.isNull(g_params.taskSourceDict)) g_params.taskSourceDict = top.app.getDictDataByDictTypeValue('AEL_TASK_SOURCE');
	if($.utils.isNull(g_params.checkRegisterAdviceDict)) g_params.checkRegisterAdviceDict = top.app.getDictDataByDictTypeValue('AEL_CHECK_REGISTER_ADVICE');

	if(g_params.data.personType == '1') $("#personType1").attr("checked",true);
	else if(g_params.data.personType == '2') $("#personType2").attr("checked",true);

	$('#tdTaskSource').text(top.app.getDictName(g_params.data.taskSource, g_params.taskSourceDict));

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesAge').text($.utils.getNotNullVal(g_params.data.partiesAge));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.data.companyPhone));
	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1));
	$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.data.lawUserCardNo2));
	$('#tdCheckContent').text($.utils.getNotNullVal(g_params.data.checkContent));
	$('#tdCheckDate').text($.utils.getNotNullVal(g_params.data.checkDate));
	$('#tdMainCheckDetail').text($.utils.getNotNullVal(g_params.data.mainCheckDetail));

//	$('#divCheckUserAdvice').text(top.app.getCheckBoxButtonVal(g_params.data.checkUserAdvice, g_params.checkRegisterAdviceDict));
	//承办人意见，显示历史处理意见
	if(g_params.data.isNormalCase == '1')
		getHistoryAuditListPreview(g_params.data.registerId, "10");
	else 
		getHistoryAuditListPreview(g_params.data.registerId, "11");
}
