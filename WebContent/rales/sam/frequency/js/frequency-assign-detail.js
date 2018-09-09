var g_params = null;

$(function () {
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	//初始化字典
	initDict();
	initView();
	top.app.message.loadingClose();
	
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
}


function initView(){
	$('#statName').text(g_params.row.statName);
	$('#statAddr').text(g_params.row.statAddr);
	$('#statHeight').text(g_params.row.statHeight);
	$('#sysType').text(g_params.row.sysType);
	$('#telMode').text(g_params.row.telMode);
	$('#longitude').text(g_params.row.longitude);
	$('#latitude').text(g_params.row.latitude);
	$('#freqBegin').text(g_params.row.freqBegin);
	$('#freqEnd').text(g_params.row.freqEnd);
	$('#freqStep').text(g_params.row.freqStep);
	$('#receivingThreshold').text(g_params.row.receivingThreshold);
	$('#ciThreshold').text(g_params.row.ciThreshold);
	if(g_params.row.workType == '1') $('#workType').text("发射接收");
	if(g_params.row.workType == '2') $('#workType').text("发射");
	if(g_params.row.workType == '3') $('#workType').text("接收");
	$('#pow').text(g_params.row.pow);
	$('#recStatus').text(g_params.row.recStatus);
	$('#antennaHeight').text(g_params.row.antennaHeight);
	$('#antennaMode').text(g_params.row.antennaMode);
	$('#antennaAngle').text(g_params.row.antennaAngle);
	$('#diAngle').text(g_params.row.diAngle);
	$('#memo').text(g_params.row.memo);
	
	loadResultData();
}

function loadResultData(){
	$('#tableResult1').css('display', '');
	$('#tableResult2').css('display', '');
	$('#btnDetail').css('display', '');

	$("#btnDetail").click(function () {
		window.open(top.app.conf.url.res.url + "2_" + g_params.row.id + "_" + g_params.row.freqBegin + "-" + g_params.row.freqEnd + ".pdf");
    });
	
	$.ajax({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSimulateEmcList",   		//请求后台的URL（*）
	    method: 'GET',
	    data: {
    		access_token: top.app.cookies.getCookiesToken(),
    		simulateId: g_params.row.id,
			page: 0,
			size:50
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
	    			$('#resultList1').empty();
	    			for(var i = 0; i < data.rows.length; i++){
	    				var html = '<tr>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].occupyCount) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].maxPower) + '</td>' +
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].maxPowerName) + '</td>' +
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].quality) + '</td>' +
    								'</tr>';
	    				$('#resultList1').append(html);
	    			}
	    			
	    			$('#resultList2').empty();
	    			for(var i = 0; i < data.rows.length; i++){
	    				var img = '<img src="/rales/img/icon-no.png" style="width:20px;height:20px;">';
		    			if(data.rows[i].isUse == '1') img = '<img src="/rales/img/icon-yes.png" style="width:20px;height:20px;">';
	    				var html = '<tr>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].quality) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + img + '</td>' + 
    								'</tr>';
	    				$('#resultList2').append(html);
	    			}
	    		}
	   		}
		}
	});
}