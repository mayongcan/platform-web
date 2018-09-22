var g_params = {}, g_iframeIndex = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	top.app.message.loading();
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	loadResultData();
}

function loadResultData(data){
	$('#tableResult1').css('display', '');
	$('#tableResult2').css('display', '');
	$('#btnDetail').css('display', '');

	$("#btnDetail").click(function () {
		window.open(top.app.conf.url.res.url + "2_" + data.id + "_" + data.freqBegin + "-" + data.freqEnd + ".pdf");
    });
	
	$.ajax({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSimulateEmcList",   		//请求后台的URL（*）
	    method: 'GET',
	    data: {
    		access_token: top.app.cookies.getCookiesToken(),
    		simulateId: data.id,
			page: 0,
			size:50
	    },success: function(data){
	    	top.app.message.loadingClose();
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
