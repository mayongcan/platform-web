var $table = $('#tableList');
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
				size:5000
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
//			    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
//			    			$('#resultList').empty();
//			    			for(var i = 0; i < data.rows.length; i++){
//			    				var img = '<img src="/rales/img/icon-no.png" style="width:20px;height:20px;">';
//				    			if(data.rows[i].isUse == '1') img = '<img src="/rales/img/icon-yes.png" style="width:20px;height:20px;">';
//			    				var html = '<tr>' + 
//		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
//		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].occupy) + '</td>' + 
//		    									'<td class="reference-td">' + $.utils.getNotNullVal(data.rows[i].demageLevel) + '</td>' + 
//		    									'<td class="reference-td">' + img + '</td>' + 
//		    								'</tr>';
//			    				$('#resultList').append(html);
//			    			}
//			    		}
			    		initCharts(data.rows);
			    	    parent.document.getElementById('case-iframe').style.height = '0px';
			    		//重新计算当前页面的高度，用于iframe
			    	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
		   		}
			}
		});
	}
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
        },success: function(data){
            for(var i = 0; i < data.RetData.dataList.length; i++){
                var html = '<tr>' +
                    '<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].frequency) + '</td>' +
                    '<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].occupy) + '</td>' +
                    '<td class="reference-td">' + $.utils.getNotNullVal(data.RetData.dataList[i].demageLevel) + '</td>' +
                    '<td class="reference-td"><img src="/rales/img/icon-yes.png" style="width:20px;height:20px;"></td>' +
                    '</tr>';
                $('#resultList').append(html);
            }
        }
    });
	// //搜索参数
	// var searchParams = function (params) {
    //     var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
    //         access_token: top.app.cookies.getCookiesToken(),
    //         type:g_params.row.type,
    //         spectralanalysisId: g_params.row.id,
    //         analysisType: g_params.row.analysisType,
    //         network: g_params.row.network,
    //         coverageArea: g_params.row.coverageArea,
    //         centerFrequency: g_params.row.centerFrequency,
    //         mobileStation: g_params.row.mobileStation,
    //         baseStation: g_params.row.baseStation,
    //         statLg: g_params.row.longitude,
    //         statLa: g_params.row.latitude,
    //         serviceRadius: g_params.row.serviceRadius,
    //     };
    //     return param;
    // };
    // //初始化列表
	// $table.bootstrapTable({
    //     url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSumList",   		//请求后台的URL（*）
    //     queryParams: searchParams,											//传递参数（*）
    //     uniqueId: 'id',
    //     height:400,
    //     onClickRow: function(row, $el){
    //     	appTable.setRowClickStatus($table, row, $el);
    //     }
    // });
	//初始化Table相关信息
//	appTable.initTable($table);
}

function formatIsUse(value,row,index){
	// if(value == '1') return '<img src="/rales/img/icon-yes.png" style="width:20px;height:20px;">';
	// else return '<img src="/rales/img/icon-no.png" style="width:20px;height:20px;">';
    return '<img src="/rales/img/icon-yes.png" style="width:20px;height:20px;">';
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

function exportWord(){
	var rules = 'table{border-collapse:collapse;margin:0 auto;text-align:center;width: 100%;}table td,table th{border:1px solid #cad9ea;color:#666;height:30px}table thead th{background-color:#F1F1F1;min-width:400px}table tr{background:#fff}';
	var ss = document.styleSheets;
	for (var i = 0; i < ss.length; ++i) {
	    for (var x = 0; x < ss[i].cssRules.length; ++x) {
	        rules += ss[i].cssRules[x].cssText;
	    }
	}
	
	//先clone来避免影响页面显示
	var clone = $("#content-left").clone();
	
	//隐藏
	clone.find(".fixed-table-pagination").remove();
	clone.find(".fixed-table-toolbar").remove();
	clone.find(".fixed-table-footer").remove();
	clone.find(".fixed-table-header").remove();
	
	//找到所有echarts图表容器
	var charts = clone.find(".chart");
	//隐藏无需导出的dom
	clone.find(".input_div").hide();
	//简单控制流程
	var flag = charts.length;
	for(var i = 0; i < charts.length; i++) {
	    //获取echarts对象
	    var curEchart = echarts.getInstanceByDom(charts[i]);
	    if(curEchart) {
	        //将图表替换为图片
	        var base = curEchart.getConnectedDataURL();
	        var img = $('<img style="" src="' + base + '"/>');
	        $(charts[i]).html(img);
	        flag--;
	    } else {
	        flag--;
	    }
	}
	var interval = setInterval(function() {
	    if(!flag) {
	        clearInterval(interval);
	        //导出word
	        clone.wordExport("监测系统分析报告", rules, 20);
	    }
	}, 200);
}