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
	if($.utils.isNull(g_params.loadData)){
		rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.investigativeBegin);
		rales.setDatetimeInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), $('#dataHour2'), $('#dataMinute2'), g_params.data.investigativeEnd);
		
		$('#investigativeAddress').text(g_params.data.investigativeAddress);
		$('#investigativeUser').text(g_params.data.investigativeUser);
		$('#recordUser').text(g_params.data.recordUser);
		$('#beInvestigativeName').text(g_params.data.beInvestigativeName);
		$('#beInvestigativeSex').text(top.app.getDictName(g_params.data.beInvestigativeSex, g_params.sexDict));	
		$('#beInvestigativeIdCard').text(g_params.data.beInvestigativeIdCard);
		$('#beInvestigativeCompany').text(g_params.data.beInvestigativeCompany);
		$('#contacterPhone').text(g_params.data.contacterPhone);
		
		$('#answerAndQuestion').empty();
		var html = "";
		for(var i = 0; i < g_params.data.questionCnt; i++){
			html += '<div class="box-content-noindent">' + 
						'问：<a class="content-fill-in" style="min-width:610px;">' + g_params.data.question[i] + '</a>' + 
					'</div>' + 
					'<div class="box-content-noindent">' + 
						'答：<a class="content-fill-in" style="min-width:610px;">' + g_params.data.answer[i] + '</a>' + 
					'</div>';
		}
		$('#answerAndQuestion').append(html);
	}else{
		rales.setDatetimeInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), $('#dataHour1'), $('#dataMinute1'), g_params.data.beginDate);
		rales.setDatetimeInfo($('#dataYear2'), $('#dataMonth2'), $('#dataDay2'), $('#dataHour2'), $('#dataMinute2'), g_params.data.endDate);
		
		$('#investigativeAddress').text(g_params.data.address);
		$('#investigativeUser').text(g_params.data.investigationBy);
		$('#recordUser').text(g_params.data.recordBy);
		$('#beInvestigativeName').text(g_params.data.investigatorName);
		$('#beInvestigativeSex').text(top.app.getDictName(g_params.data.investigatorSex, g_params.sexDict));	
		$('#beInvestigativeIdCard').text(g_params.data.investigatorIdcard);
		$('#beInvestigativeCompany').text(g_params.data.company);
		$('#contacterPhone').text(g_params.data.phone);
	}
}