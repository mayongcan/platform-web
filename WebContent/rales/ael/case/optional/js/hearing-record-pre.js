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

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#illegalContent').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.hearingDate);
		$('#address').text(g_params.data.address);
		$('#hearingCompere').text(g_params.data.hearingCompere);
		$('#recorder').text(g_params.data.recorder);
		$('#caseInquiry').text(g_params.data.caseInquiry);
		$('#company').text(g_params.data.company);
		$('#detail').text(g_params.data.detail.replace(/<br>/g, "　"));
		$('#entrustedAgent1').text(g_params.data.entrustedAgent1);
		$('#entrustedJob1').text(g_params.data.entrustedJob1);
		$('#entrustedAgent2').text(g_params.data.entrustedAgent2);
		$('#entrustedJob2').text(g_params.data.entrustedJob2);
		$('#hearingContent').text(g_params.data.hearingContent);
	}else{
		rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.hearingDate);
		$('#address').text(g_params.data.address);
		$('#hearingCompere').text(g_params.data.compere);
		$('#recorder').text(g_params.data.recorder);
		$('#caseInquiry').text(g_params.data.investigator);
		$('#company').text(g_params.data.company);
		$('#detail').text(g_params.data.partyBasic.replace(/<br>/g, "　"));
		$('#entrustedAgent1').text(g_params.data.agent);
		$('#entrustedJob1').text(g_params.data.agentPosition);
		$('#entrustedAgent2').text(g_params.data.agentTwo);
		$('#entrustedJob2').text(g_params.data.agentTwoPosition);
		$('#hearingContent').text(g_params.data.content);
	}
}
