
$(function () {
	g_params = parent.g_params;
	initView();
	//获取分析结论
	getResultList();
});

function initView(){
	$('#tableInfo').empty();
	if(g_params.row.type == '1'){
		$('#tableInfo').append('<tr>' +
									'<td class="reference-td" style="width:120px;">' +
								   	'台站类别' +
								'</td>' +
								'<td class="reference-td" id="type" style="width: 38%"></td>' +
								'<td class="reference-td" style="width:120px;">' +
								   	'覆盖区域' +
								'</td>' +
								'<td class="reference-td" id="coverageArea"></td>' +
							'</tr>' +
							'<tr>' +
								'<td class="reference-td">' +
								   	'组网形式' +
								'</td>' +
								'<td class="reference-td" id="network"></td>' +
								'<td class="reference-td">' +
								   	'频率范围' +
								'</td>' +
								'<td class="reference-td" id="frequencyScope"></td>' +
							'</tr>');
	}else if(g_params.row.type == '2'){
		$('#tableInfo').append('<tr>' +
				'<td class="reference-td" style="width:120px;">' +
			   	'台站类别' +
			'</td>' +
			'<td class="reference-td" id="type" style="width: 38%"></td>' +
			'<td class="reference-td">' +
			   	'频率范围' +
			'</td>' +
			'<td class="reference-td" id="frequencyScope"></td>' +
		'</tr>');
	}else if(g_params.row.type == '3'){
		var network = "";
		if(g_params.row.network == 1) network = "单频";
		if(g_params.row.network == 2) network = "双频";
		$('#tableInfo').append('<tr>' +
				'<td class="reference-td" style="width:120px;">' +
			   	'台站类别' +
			'</td>' +
			'<td class="reference-td" id="type" style="width: 38%"></td>' +
			'<td class="reference-td">' +
			   	'单双频' +
			'</td>' +
			'<td class="reference-td">' + network +'</td>' +
		'</tr>' +
		'<tr>' +
			'<td class="reference-td">' +
			   	'频率范围' +
			'</td>' +
			'<td class="reference-td" id="frequencyScope" colspan="3"></td>' +
		'</tr>');
	}
	
	$('#type').text(top.app.getDictName(g_params.row.type, g_params.typeDict));
	$('#coverageArea').text(top.app.getDictName(g_params.row.coverageArea, g_params.coverageAreaDict));
	$('#network').text(top.app.getDictName(g_params.row.network, g_params.networkDict));
	if($.utils.isEmpty(g_params.row.centerFrequency))
		$('#frequencyScope').html("移动台发射频率:" + g_params.row.mobileStation + "MHz<br/>" + "基地台发射频率:" + g_params.row.baseStation + "MHz");
	else
		$('#frequencyScope').text(g_params.row.centerFrequency + "MHz");
	$('#lgla').text("东经" + g_params.row.longitude + ",　北纬" + g_params.row.latitude);
	$('#serviceRadius').text(g_params.row.serviceRadius + "km");
	$('#address').text(g_params.row.address);
	

	$('#monitoringStation').text(g_params.row.monitoringStation);
	$('#monitorDate').text($.date.dateFormat(g_params.row.beginDate, "yyyy-MM-dd") + "　到　" + $.date.dateFormat(g_params.row.endDate, "yyyy-MM-dd"));
	
	$('#receivingThreshold').text(g_params.row.receivingThreshold);
	$('#ciThreshold').text(g_params.row.ciThreshold);
	$('#receivingHeight').text(g_params.row.receivingHeight);
	$('#pow').text(g_params.row.pow);
	$('#gain').text(g_params.row.gain);
	$('#feedLoss').text(g_params.row.feedLoss);
	$('#freqStep').text(g_params.row.freqStep);
}

function exportWord(){
	var rules = "", ss = document.styleSheets;
	for (var i = 0; i < ss.length; ++i) {
	    for (var x = 0; x < ss[i].cssRules.length; ++x) {
	        rules += ss[i].cssRules[x].cssText;
	    }
	}
	$("#content-left").wordExport("综合报告", rules);
}

function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSumList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		type:g_params.row.type,
	    		spectralanalysisId: g_params.row.id,
		    	analysisType: g_params.row.analysisType,
		    	network: g_params.row.network,
		    	coverageArea: g_params.row.coverageArea,
		    	centerFrequency: g_params.row.centerFrequency,
		    	mobileStation: g_params.row.mobileStation,
		    	baseStation: g_params.row.baseStation,
		    	statLg: g_params.row.longitude,
		    	statLa: g_params.row.latitude,
		    	serviceRadius: g_params.row.serviceRadius,
		    	recommendNumber: g_params.row.recommendNumber,
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
			    		if(data.RetData.type == 1){
			    			//基本分析
			    			$('#resultList').empty();
			    			if(data.RetData.singleFrequency == '1'){
			    				$('#resultList').append('<tr>' +
			    											'<td class="reference-td" style="width:50%">' +
			    											   	'频率编号' +
			    											'</td>' +
			    											'<td class="reference-td" style="width:50%">' +
			    											   	'中心频率' +
			    											'</td>' +
			    										'</tr>'); 
			    			}else{
			    				$('#resultList').append('<tr>' +
			    						'<td class="reference-td" style="width:33%">' +
			    						   	'频率编号' +
			    						'</td>' +
			    						'<td class="reference-td" style="width:33%">' +
			    						   	'移动台发射频率' +
			    						'</td>' +
			    						'<td class="reference-td" style="width:33%">' +
			    						   	'基地台发射频率' +
			    						'</td>' +
			    					'</tr>'); 
			    			}
			    			var html = "", length = parseInt(g_params.row.recommendNumber);
			    			if(length > data.RetData.unAssignList.length) length = data.RetData.unAssignList.length;
			    			for(var i = 0; i < length; i++ ){
			    				if(data.RetData.singleFrequency == '1'){
			    					html += '<tr>' +
			    								'<td class="reference-td">' + data.RetData.unAssignList[i].frequencyCode + '</td>' +
			    								'<td class="reference-td">' + data.RetData.unAssignList[i].centerFrequency + 'Mhz</td>' +
			    							'</tr>';
			    				}else{
			    					html += '<tr>' +
			    								'<td class="reference-td">' + data.RetData.unAssignList[i].frequencyCode + '</td>' +
			    								'<td class="reference-td">' + data.RetData.unAssignList[i].mobileStation + 'Mhz</td>' +
			    								'<td class="reference-td">' + data.RetData.unAssignList[i].baseStation + 'Mhz</td>' +
			    							'</tr>';
			    				}
			    			}
			    			$('#resultList').append(html); 
			    		}else{
			    			$('#resultList').empty();
			    			$('#resultList').append('<tr>' + 
														'<td class="reference-td" style="width:25%">' + 
														   	'频率（MHz）' + 
														'</td>' + 
														'<td class="reference-td" style="width:25%">' + 
														   	'占用度（%）' + 
														'</td>' + 
														'<td class="reference-td" style="width:25%">' + 
														   	'最大电平（dBμV）' + 
														'</td>' + 
														'<td class="reference-td" style="width:25%">' + 
														   	'信道质量' + 
														'</td>' + 
													'</tr>');
				    		if(!$.utils.isNull(data.RetData.dataList) && data.RetData.dataList.length > 0){
				    			for(var i = 0; i < data.RetData.dataList.length; i++){
				    				var html = '<tr>' + 
			    									'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].frequency) + '</td>' + 
			    									'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].occupy) + '</td>' + 
			    									'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].demageLevel) + '</td>' + 
			    									'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].quality) + '</td>' + 
			    								'</tr>';
				    				$('#resultList').append(html);
				    			}
				    		}
			    		}
			    	    parent.document.getElementById('case-iframe').style.height = '0px';
			    		//重新计算当前页面的高度，用于iframe
			    	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
		   		}
			}
		});
	}
}
