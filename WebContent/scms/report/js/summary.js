var g_turnoverTrendChart, g_turnoverWeekChart;

$(function () {
	getStatistics();
	g_turnoverTrendChart = echarts.init(document.getElementById('turnoverTrendChart'));
	getSummaryChart1("1");
//	g_turnoverWeekChart = echarts.init(document.getElementById('turnoverWeekChart'));
});

/**
 * 获取统计
 * @returns
 */
function getStatistics(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/report/getSummary",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
            orderTypeList:'lsd,pfd,ysd',
            createDateBegin: $.date.dateFormat(new Date(), "YYYY-MM-DD"),
            createDateEnd: $.date.dateFormat(new Date(), "YYYY-MM-DD"),
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				$('#totalOrder').text(data.rows[0].totalOrder);
	   				$('#totalGoodsNum').text($.utils.isEmpty(data.rows[0].totalGoodsNum) ? '0' : data.rows[0].totalGoodsNum);
	   				$('#totalAmount').text($.utils.isEmpty(data.rows[0].totalAmount) ? accounting.formatMoney(0, "¥") : accounting.formatMoney(data.rows[0].totalAmount, "¥"));
	   				$('#totalProfit').text($.utils.isEmpty(data.rows[0].totalProfit) ? accounting.formatMoney(0, "¥") : accounting.formatMoney(data.rows[0].totalProfit, "¥"));
	   			}else{
	   				$('#totalOrder').text(0);
	   				$('#totalGoodsNum').text(0);
	   				$('#totalAmount').text(accounting.formatMoney(0, "¥"));
	   				$('#totalProfit').text(accounting.formatMoney(0, "¥"));
	   			}
	   		}
	   	}
	});
}

function getSummaryChart1(index){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/report/getSummaryChart1",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
            orderTypeList:'lsd,pfd,ysd',
            searchType: index,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				loadTrendChart(data.rows[0]);
	   			}
	   		}
	   	}
	});
}

function onSelectDate(index, btnVal, text){
	if($('#' + btnVal + index).hasClass('btn-info')) return;
	//移除其他的类
	for(var i = 1; i <= 4; i++){
		if($('#' + btnVal + i).hasClass('btn-info')){
			$('#' + btnVal + i).removeClass('btn-info');	
			$('#' + btnVal + i).addClass('btn-white');
		}
	}
	//当前点击按钮添加类
	$('#' + btnVal + index).addClass('btn-info');
	$('#' + btnVal + index).removeClass('btn-white');
	//点击其他时，修改
	if(index == 1) {
		if(btnVal == 'btnDateTrend')
			getSummaryChart1("1");
	}else if(index == 2) {
		if(btnVal == 'btnDateTrend')
			getSummaryChart1("2");
	}
}

function loadTrendChart(data){
	var totalTitle = data.totalTitle.split(',');
	var totalAmount = data.totalAmount.split(',');
	var totalProfit = data.totalProfit.split(',');
	option = {
		color:['#c23d3f', '#30b8e3'], 
	    title: {
	        text: ''
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['销售总额','销售利润']
	    },
	    grid: {
	        left: '5%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: totalTitle,
	        axisLabel: {
                show: true,
                interval:0,	//横轴信息全部显示  
                rotate:30,	//度角倾斜显示  
            }
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [
	        {
	            name:'销售总额',
	            type:'line',
	            data: totalAmount,
	        },
	        {
	            name:'销售利润',
	            type:'line',
	            data: totalProfit,
	        },
	    ]
	};
 	// 使用刚指定的配置项和数据显示图表。
	g_turnoverTrendChart.setOption(option);
}