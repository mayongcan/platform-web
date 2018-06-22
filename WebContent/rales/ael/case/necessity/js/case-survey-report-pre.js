var g_params = {}, g_iframeIndex = null;
var g_caseSourceDict = "";
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
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
	height = ($('#tdCaseProcessContent').height() < 80) ? 130 : ($('#tdCaseProcessContent').height() + 70);
	$('#tdCaseProcess').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	height = ($('#tdLeaderSuggestContent').height() < 80) ? 130 : ($('#tdLeaderSuggestContent').height() + 40);
	$('#tdLeaderSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	$('#tdSuggestContent').text($.utils.getNotNullVal(g_params.registerRow.advice));
	
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.data.illegalContent));
	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.parties));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.certificateNo));
	$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.data.company));
	$('#tdPartiesContacts').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdPartiesAddress').text($.utils.getNotNullVal(g_params.data.address));
	$('#tdCaseProcessContent').text($.utils.getNotNullVal(g_params.data.investigativeProcedure));
	$('#tdMemo').text($.utils.getNotNullVal(g_params.data.memo));
	
	//获取材料清单列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getReportMaterialList",
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		reportId: g_params.data.id,
	   		registerId: g_params.data.registerId,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			var html = "";
	   			$('#tableMaterialsList').empty();
	   			var length = (data.rows.length < 3) ? 3 : data.rows.length;
	   			for(var i = 0; i < length; i++){
	   				var borderBottom = "";
	   				if(i == length - 1) borderBottom = "border-bottom-width:0px;"
	   				if(data.rows[i] == null || data.rows == undefined){
	   					html += '<tr>' + 
									'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">　</td>' + 
									'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">　</td>' + 
									'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">　</td>' + 
								'</tr>';
	   				}else{
		   				html += '<tr>' + 
									'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">' + 
										data.rows[i].certificateName + 
									'</td>' + 
									'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">' + 
										data.rows[i].grade + 
									'</td>' + 
									'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">' + 
										data.rows[i].totalCnt + 
									'</td>' + 
								'</tr>';
	   				}
	   			}
	   			$('#tableMaterialsList').append(html);
	   		}
	   	}
	});
}
