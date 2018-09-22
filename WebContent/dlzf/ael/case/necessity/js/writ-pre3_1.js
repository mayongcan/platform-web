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
	rales.fixALinkWidth();
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

	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	
	$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.data.illegalAction));

	if(g_params.data.personType == '1') {
		$("#tdContent").append("<div class='box-content'>姓名：" + $.utils.getNotNullVal(g_params.data.partiesName) + "</div>");
		$("#tdContent").append("<div class='box-content'>性别：" + $.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)) + "</div>");
		$("#tdContent").append("<div class='box-content'>民族：" + $.utils.getNotNullVal(g_params.data.partiesNation) + "</div>");
		$("#tdContent").append("<div class='box-content'>住址：" + $.utils.getNotNullVal(g_params.data.partiesAddr) + "</div>");
		$("#tdContent").append("<div class='box-content'>身份证号码：" + $.utils.getNotNullVal(g_params.data.partiesCertificateNo) + "</div>");
		$("#tdContent").append("<div class='box-content'>文化程度：" + $.utils.getNotNullVal(g_params.data.partiesEdu) + "</div>");
		$("#tdContent").append("<div class='box-content'>联系电话：" + $.utils.getNotNullVal(g_params.data.partiesPhone) + "</div>");
	}
	else if(g_params.data.personType == '2') {
		$("#tdContent").append("<div class='box-content'>名称：" + $.utils.getNotNullVal(g_params.data.companyName) + "</div>");
		$("#tdContent").append("<div class='box-content'>营业执照号码：" + $.utils.getNotNullVal(g_params.data.licCode) + "</div>");
		$("#tdContent").append("<div class='box-content'>地址：" + $.utils.getNotNullVal(g_params.data.companyAddr) + "</div>");
		$("#tdContent").append("<div class='box-content'>法定代表人：" + $.utils.getNotNullVal(g_params.data.legalRepresentative) + "</div>");
		$("#tdContent").append("<div class='box-content'>联系人姓名：" + $.utils.getNotNullVal(g_params.data.companyContactName) + "</div>");
		$("#tdContent").append("<div class='box-content'>联系电话：" + $.utils.getNotNullVal(g_params.data.companyContactPhone) + "</div>");
	}
	
	$('#tdInquiryDesc').text($.utils.getNotNullVal(g_params.data.inquiryDesc));
	$('#tdInquiryResult').text($.utils.getNotNullVal(g_params.data.inquiryResult));
	$('#tdHandleResult1').text($.utils.getNotNullVal(g_params.data.handleResult1));
	$('#tdHandleResult2').text($.utils.getNotNullVal(g_params.data.handleResult2));
	$('#tdEvidence1').text($.utils.getNotNullVal(g_params.data.evidence1));
	$('#tdEvidence2').text($.utils.getNotNullVal(g_params.data.evidence2));
	$('#tdEvidence3').text($.utils.getNotNullVal(g_params.data.evidence3));
	$('#tdEvidence4').text($.utils.getNotNullVal(g_params.data.evidence4));
	$('#tdEvidence10').text($.utils.getNotNullVal(g_params.data.evidence10));
	$('#tdEvidence11').text($.utils.getNotNullVal(g_params.data.evidence11));
	$('#tdEvidence12').text($.utils.getNotNullVal(g_params.data.evidence12));
	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser1));
	
	
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
