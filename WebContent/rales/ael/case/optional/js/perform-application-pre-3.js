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
		$("#printType").html("第一联<br/><br/>交人民法院");
	}else if(g_params.printType == 2){
		$("#printType").html("第二联<br/><br/>存<br/><br/><br/>根");
	}
	
	setData();
	rales.fixALinkWidth();
	//重设右侧高度
	$("#printType").css("marginTop", ($('#boxLeft').height() - $('#printType').height()) / 2);
	
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#illegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		$('#applyUser').text(g_params.data.applyUser);
		$('#address').text(g_params.data.address);
		$('#legal').text(g_params.data.legal);
		$('#job').text(g_params.data.job);
		$('#phone').text(g_params.data.phone);
		$('#beApplyUser').text(g_params.data.beApplyUser);
		$('#beApplyAddress').text(g_params.data.beApplyAddress);
		$('#beApplyLegal').text(g_params.data.beApplyLegal);
		$('#beApplyJob').text(g_params.data.beApplyJob);
		$('#beApplyPhone').text(g_params.data.beApplyPhone);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.desArrayDate);
		$('#ruleRows').text(g_params.data.ruleRows);
		$('#ruleWord').text(g_params.data.ruleWord);
		$('#ruleMark').text(g_params.data.ruleMark);
		$('#courtName').text(g_params.data.courtName);
	}else{
		$('#applyUser').text(g_params.data.proposer);
		$('#address').text(g_params.data.address);
		$('#legal').text(g_params.data.representative);
		$('#job').text(g_params.data.position);
		$('#phone').text(g_params.data.phone);
		$('#beApplyUser').text(g_params.data.respondent);
		$('#beApplyAddress').text(g_params.data.respondentAddress);
		$('#beApplyLegal').text(g_params.data.respondentLegalAddress);
		$('#beApplyJob').text(g_params.data.respondentLegal);
		$('#beApplyPhone').text(g_params.data.respondentPhone);
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.arrivalDate);
		$('#ruleRows').text(g_params.data.strip);
		$('#ruleWord').text(g_params.data.item);
		$('#ruleMark').text(g_params.data.mark);
		$('#courtName').text(g_params.data.courtname);
	}
}
