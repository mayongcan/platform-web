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
	if(g_params.printType == 1){
		$("#printType").html("第一联<br/><br/>交被询问人");
	}else if(g_params.printType == 2){
		$("#printType").html("第二联<br/><br/>存<br/><br/><br/>根");
	}
	if(g_params.inquiryMaterialsTypeDict == null || g_params.inquiryMaterialsTypeDict == undefined)
		g_params.inquiryMaterialsTypeDict = top.app.getDictDataByDictTypeValue('AEL_INQUIRY_MATERIALS_TYPE');
	//添加checkbox
	getMaterialsType();
	
	setData();
	rales.fixALinkWidth();
	//重设右侧高度
	$("#printType").css("marginTop", ($('#boxLeft').height() - $('#printType').height()) / 2);
	
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

function getMaterialsType(){
	$("#divMaterialsType").empty();
	var arrayVal = g_params.data.materialsType.split(',');
	var checkStatus = '';
	var html = "";
	if(arrayVal[0] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;text-indent: 0em;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.inquiryMaterialsTypeDict[0].ID + '" value="" ' + checkStatus + '>　' + g_params.inquiryMaterialsTypeDict[0].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[1] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.inquiryMaterialsTypeDict[1].ID + '" value="" ' + checkStatus + '>　' + g_params.inquiryMaterialsTypeDict[1].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[2] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.inquiryMaterialsTypeDict[2].ID + '" value="" ' + checkStatus + '>　' + g_params.inquiryMaterialsTypeDict[2].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[3] == '1') checkStatus = 'checked';
	html += '<label style="margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.inquiryMaterialsTypeDict[3].ID + '" value="" ' + checkStatus + '>　' +
			'</label>' + 
			'<a class="content-fill-in" style="min-width:560px;text-indent: 0em;"> ' + g_params.data.otherMaterials + ' </a>';
	$("#divMaterialsType").append(html);
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#illegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.deadline);
		$('#address').text(g_params.data.address);
		$('#contacterName').text(g_params.data.contacterName);
		$('#contacterPhone').text(g_params.data.contacterPhone);
	}else{
		$('#caseParties').text(g_params.data.parties);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.endDate);
		$('#address').text(g_params.data.lawAddress);
		$('#contacterName').text(g_params.data.lawContact);
		$('#contacterPhone').text(g_params.data.lawPhone);
	}
}
