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
	var height = ($('#tdBaseContent').height() < 80) ? 130 : ($('#tdBaseContent').height() + 20);
	$('#tdBase').height(height);
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
	
	//获取字典
	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');

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

	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdCaseCode').text($.utils.getNotNullVal(g_params.data.caseCode));
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
	$('#tdBaseContent').text($.utils.getNotNullVal(g_params.data.base));

	if(!$.utils.isEmpty(g_params.data.applyList)){
		var array = g_params.data.applyList.split(',');
		for(var i = 0; i < array.length;i++){
			if(array[i] != '1') $("#apply" + (i + 1)).remove();
		}
	}
}
