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
	//获取字典
	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');

	rales.setDatetimeInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), $('#dataHour'), $('#dataMinute'), g_params.data.checkDateBegin);
	rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.checkDateEnd);
	
//	$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.data.checkDateBegin));
//	$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.data.checkDateEnd));
	$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.data.checkAddr));
	$('#tdAskUser1').text($.utils.getNotNullVal(g_params.data.askUser1));
	$('#tdAskUser2').text($.utils.getNotNullVal(g_params.data.askUser2));
	$('#tdAskUserCardNo1').text($.utils.getNotNullVal(g_params.data.askUserCardNo1));
	$('#tdAskUserCardNo2').text($.utils.getNotNullVal(g_params.data.askUserCardNo2));
	$('#tdRecordUser').text($.utils.getNotNullVal(g_params.data.recordUser));
	
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.data.partiesIdCard));
	$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.data.partiesUnit));
	$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.data.partiesJob));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.data.partiesZip));
	$("input[type='radio'][name=relationship][value=" + g_params.data.relationship + "]").attr("checked",true);
	if(g_params.data.relationship == '1') $('#tdRelationship').text("当事人");
	else if(g_params.data.relationship == '2') $('#tdRelationship').text("法人代表");
	else if(g_params.data.relationship == '3') $('#tdRelationship').text("现场负责人");
	else if(g_params.data.relationship == '4') {
		$('#tdRelationship').text("其他：");
		$('#tdOther').text($.utils.getNotNullVal(g_params.data.other));
	}
	
	
	$('#tdLawOffice').text($.utils.getNotNullVal(g_params.data.lawOffice));
	$('#tdLawUser').text($.utils.getNotNullVal(g_params.data.lawUser1) + "、" + $.utils.getNotNullVal(g_params.data.lawUser2));
	$('#tdLawUserCardNo').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1) + "、" + $.utils.getNotNullVal(g_params.data.lawUserCardNo2));
//	$('#tdLawUser1').text($.utils.getNotNullVal(g_params.data.lawUser1));
//	$('#tdLawUser2').text($.utils.getNotNullVal(g_params.data.lawUser2));
//	$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.data.lawUserCardNo1));
//	$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.data.lawUserCardNo2));
	$('#tdNoticeUser').text($.utils.getNotNullVal(g_params.data.noticeUser));
	if(g_params.data.noticeAnswer == '1')
		$('#tdNoticeAnswer').text($.utils.getNotNullVal("是"));
	else
		$('#tdNoticeAnswer').text($.utils.getNotNullVal("否"));
	
	$('#tdInquiryQuestion').text($.utils.getNotNullVal(g_params.data.inquiryQuestion));
	$('#tdInquiryAnswer').text($.utils.getNotNullVal(g_params.data.inquiryAnswer));

	$('#tdDefendQuestion').text($.utils.getNotNullVal(g_params.data.defendQuestion));
	$('#tdDefendAnswer').text($.utils.getNotNullVal(g_params.data.defendAnswer));

	$('#tdAddrQuestion').text($.utils.getNotNullVal(g_params.data.addrQuestion));
	$('#tdAddrAnswer').text($.utils.getNotNullVal(g_params.data.addrAnswer));
	$('#tdOtherName').text($.utils.getNotNullVal(g_params.data.OtherName));
	$('#tdOtherNameAndJob').text($.utils.getNotNullVal(g_params.data.OtherUnit)+" "+$.utils.getNotNullVal(g_params.data.OtherJob));
	$('#tdCaseReason').text($.utils.getNotNullVal(g_params.data.CaseReason));
	if(!$.utils.isEmpty(g_params.data.askList1)){
		var askList1 = eval("(" + g_params.data.askList1 + ")");
		for(var index = 0; index < askList1.length; index++){
			$('#divAakList1').append('<div class="box-content">' +
									'问：<span>' + askList1[index].inquiryQuestion + '</span>' +
									'</div>' +
									'<div class="box-content">' +
										'答：<span>' + askList1[index].inquiryAnswer + '</span>' +
									'</div>')
		}
	}

	if(!$.utils.isEmpty(g_params.data.askList2)){
		var askList2 = eval("(" + g_params.data.askList2 + ")");
		for(var index = 0; index < askList2.length; index++){
			$('#divAakList2').append('<div class="box-content">' +
									'问：<span>' + askList2[index].inquiryQuestion + '</span>' +
									'</div>' +
									'<div class="box-content">' +
										'答：<span>' + askList2[index].inquiryAnswer + '</span>' +
									'</div>')
		}
	}

	if(!$.utils.isEmpty(g_params.data.askList3)){
		var askList3 = eval("(" + g_params.data.askList3 + ")");
		for(var index = 0; index < askList3.length; index++){
			$('#divAakList3').append('<div class="box-content">' +
									'问：<span>' + askList3[index].inquiryQuestion + '</span>' +
									'</div>' +
									'<div class="box-content">' +
										'答：<span>' + askList3[index].inquiryAnswer + '</span>' +
									'</div>')
		}
	}
}
