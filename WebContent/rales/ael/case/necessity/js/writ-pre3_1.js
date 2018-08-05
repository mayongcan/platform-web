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
	var height = ($('#tdInquiryDescContent').height() < 80) ? 130 : ($('#tdInquiryDescContent').height() + 70);
	$('#tdInquiryDesc').height(height);
	height = ($('#tdUserSuggestContent').height() < 80) ? 130 : ($('#tdUserSuggestContent').height() + 70);
	$('#tdUserSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
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

	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
	$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.data.partiesUnit));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdInquiryDescContent').text($.utils.getNotNullVal(g_params.data.inquiryDesc));
	$('#tdMemo').text($.utils.getNotNullVal(g_params.data.memo));
	
	$('#tableContentList').empty();
	if(typeof g_params.data.list !== 'object') g_params.data.list = eval("(" + g_params.data.list + ")");
	for(var i = 0; i < g_params.data.list.length; i++){
		$('#tableContentList').append('<tr>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].name + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].grade + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].totalCnt + 
										'</td>' + 
									'</tr>')
	}
}
