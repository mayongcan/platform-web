
$(function () {
	g_params = parent.g_params;
	initView();
	//获取分析结论
	getResultList();
});

function initView(){
	$('#type').text(top.app.getDictName(g_params.row.type, g_params.typeDict));
	$('#coverageArea').text(top.app.getDictName(g_params.row.coverageArea, g_params.coverageAreaDict));
	$('#network').text(top.app.getDictName(g_params.row.network, g_params.networkDict));
	if($.utils.isEmpty(g_params.row.centerFrequency))
		$('#frequencyScope').text(g_params.row.mobileStation + "MHz");
	else
		$('#frequencyScope').text(g_params.row.centerFrequency);
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
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
			    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
			    			$('#resultList').empty();
			    			for(var i = 0; i < data.rows.length; i++){
			    				var html = '<tr>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].occupy) + '</td>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].demageLevel) + '</td>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].quality) + '</td>' + 
		    								'</tr>';
			    				$('#resultList').append(html);
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
