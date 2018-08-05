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
	var height = ($('#divCheckUserAdvice').height() < 80) ? 130 : ($('#divCheckUserAdvice').height() + 20);
	$('#tdSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	
	//获取字典
	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	if($.utils.isNull(g_params.taskSourceDict)) g_params.taskSourceDict = top.app.getDictDataByDictTypeValue('AEL_TASK_SOURCE');
	if($.utils.isNull(g_params.checkRegisterAdviceDict)) g_params.checkRegisterAdviceDict = top.app.getDictDataByDictTypeValue('AEL_CHECK_REGISTER_ADVICE');

	if(g_params.data.personType == '1') $("#personType1").attr("checked",true);
	else if(g_params.data.personType == '2') $("#personType2").attr("checked",true);
	
	top.app.addRadioButton($("#divTaskSource"), g_params.taskSourceDict, 'radioTaskSource', g_params.data.taskSource);
	top.app.addCheckBoxButtonLine($("#divCheckUserAdvice"), g_params.checkRegisterAdviceDict, 'checkUserAdvice', g_params.data.checkUserAdvice);

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
}
