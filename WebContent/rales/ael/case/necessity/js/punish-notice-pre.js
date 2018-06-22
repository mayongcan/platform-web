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
	if(g_params.opearTypeDict == null || g_params.opearTypeDict == undefined) 
		g_params.opearTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_TYPE');
	if(g_params.implementTypeDict == null || g_params.implementTypeDict == undefined) 
		g_params.implementTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_IMPLTYPE');
	
	//添加checkbox
	getOpearType();
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

function getOpearType(){
	$("#divOpearType").empty();
	var html = "";
	var length = g_params.opearTypeDict.length;
	var arrayVal = g_params.data.type.split(',');
	for (var i = 0; i < length; i++) {
		var checkStatus = '';
		if(arrayVal[i] == '1') checkStatus = 'checked';
		if(i == length - 1){
			var otherObtainEvidence = "";
			if(arrayVal[i] == '1') otherObtainEvidence = g_params.data.otherExplain;
			html += '<br/><label style="margin-right:0px;margin-bottom:0px;font-weight: normal;margin-left:26px;">' +
				      	'<input type="checkbox" id="checkboxOpearType' + g_params.opearTypeDict[i].ID + '" value="" ' + checkStatus + '> ' + g_params.opearTypeDict[i].NAME +
				    '</label>' + 
				    '（<a class="content-fill-in" style="min-width:200px;text-indent: 0em;"> ' + otherObtainEvidence + ' </a>）等取证工作。';
		}else{
			html += '<label style="margin-right:20px;margin-bottom:0px;font-weight: normal;">' +
				      	'<input type="checkbox" id="checkboxOpearType' + g_params.opearTypeDict[i].ID + '" value="" ' + checkStatus + '> ' + g_params.opearTypeDict[i].NAME +
				    '</label>';
		}
	}
	$("#divOpearType").append(html);
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
		$('#illegalContent').text(g_params.data.illegalContent);
		$('#caseAddress').text(g_params.data.caseAddress);
		rales.setDateInfo($('#tranDataYear'), $('#tranDataMonth'), $('#tranDataDay'), g_params.data.caseDate);
		$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#lawExecutor1').text(g_params.data.lawExecutor1);
		$('#lawExecutor2').text(g_params.data.lawExecutor2);	
		$('#rules').text(g_params.data.rules);	
		$('#address').text(g_params.data.address);
		$('#contacterName').text(g_params.data.contacterName);
		$('#contacterPhone').text(g_params.data.contacterPhone);
	}else{
		$('#caseParties').text(g_params.registerRow.parties);
		$('#illegalContent').text(g_params.registerRow.illegalContent);
		$('#caseAddress').text(g_params.registerRow.address);
		rales.setDateInfo($('#tranDataYear'), $('#tranDataMonth'), $('#tranDataDay'), g_params.registerRow.occurrenceDate);
		$('#lawExecutor1').text(g_params.registerRow.createUserName);
		$('#lawExecutor2').text(g_params.registerRow.associateUserName);	

		$('#caseRulesCountry').text(g_params.data.caseRulesCountry);
		$('#caseRulesProvince').text(g_params.data.caseRulesProvince);
		$('#rules').text(g_params.data.strip);	
		$('#address').text(g_params.data.lawAddress);
		$('#contacterName').text(g_params.data.lawContact);
		$('#contacterPhone').text(g_params.data.lawPhone);
	}
}
