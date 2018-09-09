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

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdCaseName').text($.utils.getNotNullVal(g_params.data.caseName));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.inquiryDate1);
//	$('#tdInquiryDate1').text($.utils.getNotNullVal(g_params.data.inquiryDate1));
	$('#tdInquiryAddr').text($.utils.getNotNullVal(g_params.data.inquiryAddr));
	rales.setDateInfo($('#dataYear1'), $('#dataMonth1'), $('#dataDay1'), g_params.data.inquiryDate2);
//	$('#tdInquiryDate2').text($.utils.getNotNullVal(g_params.data.inquiryDate2));
	if(!$.utils.isEmpty(g_params.data.dataList)){
		var array = g_params.data.dataList.split(',');
		for(var i = 0; i < array.length; i++){
			if($.utils.isEmpty(array[i])) continue;
			$('#dataList').append(
				'<div class="box-content">' + 
					(i + 1) + '、' + array[i] + 
				'</div>'
			);
		}
	}
}
