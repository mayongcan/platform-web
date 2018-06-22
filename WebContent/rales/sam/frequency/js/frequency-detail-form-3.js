
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
	$('#frequencyScope').text("");
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

function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getMonitoringdetailList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
		    		access_token: top.app.cookies.getCookiesToken(),
		    		spectralanalysisId: g_params.row.id,
				page: 0,
				size:50
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
			    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
			    			$('#resultList').empty();
			    			for(var i = 0; i < data.rows.length; i++){
			    				var img = '<img src="/rales/img/icon-no.png" style="width:20px;height:20px;">';
				    			if(data.rows[i].isUse == '1') img = '<img src="/rales/img/icon-yes.png" style="width:20px;height:20px;">';
			    				var html = '<tr>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].occupy) + '</td>' + 
		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].demageLevel) + '</td>' + 
		    									'<td class="reference-td">' + img + '</td>' + 
		    								'</tr>';
			    				$('#resultList').append(html);
			    			}
			    		}
			    		initCharts(data.rows);
			    	    parent.document.getElementById('case-iframe').style.height = '0px';
			    		//重新计算当前页面的高度，用于iframe
			    	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
		   		}
			}
		});
	}
}


//初始化图
function initCharts(data){
	var charts = echarts.init(document.getElementById('charts'));
	var xAxisData = [], seriesData = [];
	for(var i = 0; i < data.length; i++){
		if(!$.utils.isNull(data[i].frequency)) xAxisData[i] = data[i].frequency;
	}
	//获取数据
	for(var i = 0; i < 2; i++){
		var obj = {}, objData = [];
		if(i == 0) {
			obj.name = '最大电平';
			obj.xAxisIndex = 1;
		}
		else obj.name = '占用度';
		obj.type = 'line';
		obj.smooth = true;
		for(var j = 0; j < xAxisData.length; j++){
			var hasValue = false;
			for(var k = 0; k < data.length; k++){
				if(!$.utils.isNull(data[k].frequency)) {
					if(data[k].frequency == xAxisData[j]){
						if(i == 0) objData.push(data[k].demageLevel);
						else objData.push(data[k].occupy);
						hasValue = true;
						break;
					}
				}
			}
			//如果没有内容，则填入0
			if(!hasValue) objData.push(0);
		}
		obj.data = objData;
		seriesData.push(obj);
	}
	var colors = ['#4e81ba', '#bc4b4c'];
	option = {
		color: colors,
	    tooltip: {
	        trigger: 'none',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
	    legend: {
	    	 	data:['最大电平','占用度'],
	    	 	bottom: 0,
	    },
	    xAxis: [{
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLine: {
	                onZero: false,
	                lineStyle: {
	                    color: colors[0]
	                }
	            },
	            axisPointer: {
	                label: {
	                    formatter: function (params) {
	                        return '最大电平：' + params.seriesData[0].data;
	                    }
	                }
	            },
	            data: xAxisData
	        },
	        {
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLine: {
	                onZero: false,
	                lineStyle: {
	                    color: colors[1]
	                }
	            },
	            axisPointer: {
	                label: {
	                    formatter: function (params) {
	                        return '占用度：' + params.seriesData[0].data;
	                    }
	                }
	            },
	            data: xAxisData
	        }
	    ],
	    yAxis: [{
	            type: 'value'
	        }
	    ],
	    series: seriesData
	};
	// 使用刚指定的配置项和数据显示图表。
	charts.setOption(option);
}