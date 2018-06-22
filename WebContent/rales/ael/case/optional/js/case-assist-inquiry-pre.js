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
		$("#printType").html("第一联<br/><br/>交协助单位");
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
		$('#companyName').text(g_params.data.companyName);
		$('#assistInquiry').text(g_params.data.assistInquiry);
		$('#contacterName').text(g_params.data.contacterName);
		$('#contacterPhone').text(g_params.data.contacterPhone);
	}else{
		$('#companyName').text(g_params.data.parties);
		$('#assistInquiry').text(g_params.data.surveyContent);
		$('#contacterName').text(g_params.data.contact);
		$('#contacterPhone').text(g_params.data.phone);
	}
}
