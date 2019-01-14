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

function setPunishData(){
	var arr = new Array();
	arr = g_params.data.array;
	//alert(arr.length);
		 
	for(var i = 0;i<=arr.length-1;i++){
		var j = 2;
		var html = "<div class='box-content'>"
			 + "<a class='content-fill-in' style='min-width:100px;' id='tdPunish"+j+"'>　</a>"
			 + "</div>"
		$("#pc").after(html);		
		$('#tdPunish'+j).text(arr[i]);
		j++;
	}	 
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdName').text($.utils.getNotNullVal(g_params.data.name));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdAddress').text($.utils.getNotNullVal(g_params.data.address));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.inquiryBeginDate);

	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdIllegalInfo').text($.utils.getNotNullVal(g_params.data.illegalInfo));
	$('#tdIllegalEvidence').text($.utils.getNotNullVal(g_params.data.illegalEvidence));
	$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.data.illegalRule));
	$('#tdIllegalStandard').text($.utils.getNotNullVal(g_params.data.illegalStandard));

	if(g_params.data.lawType == '1') $('#tdLawType').text("轻微");
	else if(g_params.data.lawType == '2') $('#tdLawType').text("一般");
	else if(g_params.data.lawType == '3') $('#tdLawType').text("严重");
	else if(g_params.data.lawType == '4') $('#tdLawType').text("特别严重");
	else $('#tdLawType').text("");
	
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	$('#tdPunish1').text($.utils.getNotNullVal(g_params.data.punish1));
	//$('#tdPunish2').text($.utils.getNotNullVal(g_params.data.punish2));
	$('#tdBankCode').text($.utils.getNotNullVal(g_params.data.bankCode));
	$('#tdReview1').text($.utils.getNotNullVal(g_params.data.review1));
	$('#tdReview2').text($.utils.getNotNullVal(g_params.data.review2));
	$('#tdLawsuit').text($.utils.getNotNullVal(g_params.data.lawsuit));	
	setPunishData();
	
}
