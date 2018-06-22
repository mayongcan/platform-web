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
		$("#printType").html("第一联<br/><br/>交当事人");
	}else if(g_params.printType == 2){
		$("#printType").html("第二联<br/><br/>存<br/><br/><br/>根");
	}

	if(g_params.actionTypeDict == null || g_params.actionTypeDict == undefined) 
		g_params.actionTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_ACTION_TYPE');
	if(g_params.implementTypeDict == null || g_params.implementTypeDict == undefined) 
		g_params.implementTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_IMPLTYPE');
	
	//添加checkbox
	getActionType();
	getImplementType();

	setData();
	rales.fixALinkWidth();
	//重设右侧高度
	$("#printType").css("marginTop", ($('#boxLeft').height() - $('#printType').height()) / 2);
	
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

function getActionType(){
	$("#divActionType").empty();
	var arrayVal = g_params.data.actionType.split(',');
	var checkStatus = '';
	var html = "";
	if(arrayVal[0] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;text-indent: 0em;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.actionTypeDict[0].ID + '" value="" ' + checkStatus + '>　' + g_params.actionTypeDict[0].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[1] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.actionTypeDict[1].ID + '" value="" ' + checkStatus + '>　' + g_params.actionTypeDict[1].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[2] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.actionTypeDict[2].ID + '" value="" ' + checkStatus + '>　' + g_params.actionTypeDict[2].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[3] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.actionTypeDict[3].ID + '" value="" ' + checkStatus + '>　' + g_params.actionTypeDict[3].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[4] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.actionTypeDict[4].ID + '" value="" ' + checkStatus + '>　' + g_params.actionTypeDict[4].NAME +
			'</label><br/>';
	checkStatus = '';
	if(arrayVal[5] == '1') checkStatus = 'checked';
	html += '<label style="margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxActionType' + g_params.actionTypeDict[5].ID + '" value="" ' + checkStatus + '>　' +
			'</label>' + 
			'<a class="content-fill-in" style="min-width:520px;text-indent: 0em;"> ' + g_params.data.otherMemo + '　</a>';
	$("#divActionType").append(html);
}

function getImplementType(){
	$("#divImplementType").empty();
	var arrayVal = g_params.data.implType.split(',');
	var checkStatus = '';
	var html = "";
	if(arrayVal[0] == '1') checkStatus = 'checked';
	html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxImplementType' + g_params.implementTypeDict[0].ID + '" value="" ' + checkStatus + '> ' + g_params.implementTypeDict[0].NAME +
			'</label>';
	checkStatus = '';
	if(arrayVal[1] == '1') checkStatus = 'checked';
	html += '<label style="margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxImplementType' + g_params.implementTypeDict[1].ID + '" value="" ' + checkStatus + '> ' + g_params.implementTypeDict[1].NAME +
			'</label>' + 
			'<a class="content-fill-in"> ' + g_params.data.confiscateEquipmentNum + ' </a>台';
	checkStatus = '';
	if(arrayVal[2] == '1') checkStatus = 'checked';
	html += '<label style="margin-left:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxImplementType' + g_params.implementTypeDict[2].ID + '" value="" ' + checkStatus + '> ' + g_params.implementTypeDict[2].NAME +
			'</label>' + 
			'<a class="content-fill-in"> ' + g_params.data.confiscateIllegality + ' </a>元';
	checkStatus = '';
	if(arrayVal[3] == '1') checkStatus = 'checked';
	html += '<label style="margin-left:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxImplementType' + g_params.implementTypeDict[3].ID + '" value="" ' + checkStatus + '> ' + g_params.implementTypeDict[3].NAME +
			'</label>' + 
			'<a class="content-fill-in"> ' + g_params.data.fine + ' </a>元';
	checkStatus = '';
	if(arrayVal[4] == '1') checkStatus = 'checked';
	html += '<label style="margin-left:20px;margin-bottom:0px;font-weight: normal;">' +
			  	'<input type="checkbox" id="checkboxImplementType' + g_params.implementTypeDict[4].ID + '" value="" ' + checkStatus + '> ' + g_params.implementTypeDict[4].NAME +
			'</label>' + 
			'<a class="content-fill-in"> ' + g_params.data.revokeNum + ' </a>张的处罚。';
	$("#divImplementType").append(html);	
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	if($.utils.isNull(g_params.loadData)){
		$('#caseParties').text(g_params.data.caseParties);
		$('#caseAddress').text(g_params.data.caseAddress);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.caseDate);
		$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#violateRules').text(g_params.data.violateRules);
		$('#rules').text(g_params.data.rules);

		rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.performDate);
		rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.punishDate);
		$('#punishAddress').text(g_params.data.punishAddress);
		$('#officeAddress').text(g_params.data.officeAddress);
		$('#officePhone').text(g_params.data.officePhone);
	}else{
		$('#caseParties').text(g_params.data.parties);
		$('#caseAddress').text(g_params.data.address);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.recordDate);
		$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#violateRules').text(g_params.data.otherGist);
		$('#rules').text(g_params.data.orderGdStrip);

		rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.carryDate);
		rales.setDateInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), g_params.data.endDate);
		$('#punishAddress').text(g_params.data.fineAddress);
		$('#officeAddress').text(g_params.data.businessAddress);
		$('#officePhone').text(g_params.data.businessPhone);
	}
}