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
	if(g_params.sexDict == null || g_params.sexDict == undefined) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
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
	$('#illegalContent1').text(g_params.data.illegalContent);
	if($.utils.isNull(g_params.loadData)){
		rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.inquiryBeginDate);
		rales.setDatetimeInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), $('#dataHour2'), $('#dataMinute2'), g_params.data.inquiryEndDate);
		
		$('#inquiryAddress').text(g_params.data.inquiryAddress);
		$('#justifyName').text(g_params.data.justifyName);
		$('#justifySex').text(top.app.getDictName(g_params.data.justifySex, g_params.sexDict));
		$('#justifyIdCard').text(g_params.data.justifyIdCard);
		$('#company').text(g_params.data.company);	
		$('#phone').text(g_params.data.phone);
		
		$('#inquiryUser').text(g_params.data.inquiryUser);
		$('#recorder').text(g_params.data.recorder);
		$('#justifyRecord').text("陈述申辩记录：" + g_params.data.justifyRecord);
	}else{
		rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.beginDate);
		rales.setDatetimeInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), $('#dataHour2'), $('#dataMinute2'), g_params.data.endDate);
		
		$('#inquiryAddress').text(g_params.data.address);
		$('#justifyName').text(g_params.data.claimant);
		$('#justifySex').text(top.app.getDictName(g_params.data.sex, g_params.sexDict));
		$('#justifyIdCard').text(g_params.data.idcard);
		$('#company').text(g_params.data.company);	
		$('#phone').text(g_params.data.phone);
		
		$('#inquiryUser').text(g_params.data.inquirerBy);
		$('#recorder').text(g_params.data.recordBy);
		$('#justifyRecord').text("陈述申辩记录：" + g_params.data.enterContent);
	}
}
