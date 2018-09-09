var $table = $('#tableList'), g_timeScopeType = "0", g_searchBeginMonth = "", g_searchEndMonth = "", g_searchBeginYear = "", g_searchEndYear = "";
var g_loadDataRow = [];
$(function () {
	g_timeScopeType = parent.$('#divSearchTime input:radio:checked').val();
	g_searchBeginMonth = parent.$('#searchBeginMonth').val();
	g_searchEndMonth = parent.$('#searchEndMonth').val();
	g_searchBeginYear = parseInt(parent.$('#searchBeginYear').val());
	g_searchEndYear = parseInt(parent.$('#searchEndYear').val());
	//获取权限菜单
	initFunc();
	//初始化列表信息
	initTable();
//	initCharts();
	//重新计算当前页面的高度，用于iframe
    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
						"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
					 "</button>";
	}
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            type: g_timeScopeType,
            single: false,
            type: g_timeScopeType,
            beginMonth: g_searchBeginMonth,
            endMonth: g_searchEndMonth,
            beginYear: g_searchBeginYear,
            endYear: g_searchEndYear,
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/statistic/getStatisticAreaList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        height: 400,
        onClickRow: function(row, $el){
	        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table, false);
	$table.on('load-success.bs.table', function (data) {
		//重新计算当前页面的高度，用于iframe
	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
    });
	$table.on('load-success.bs.table', function (data) {
	    parent.document.getElementById('case-iframe').style.height = '0px';
	    g_loadDataRow = $table.bootstrapTable('getData');
	    if($.utils.isNull(g_loadDataRow) || g_loadDataRow.length == 0){
	    		//移除图表
	    		$('#charts').remove();
	    }else{
		    initCharts(g_loadDataRow);
	    }
		//重新计算当前页面的高度，用于iframe
	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
    });
}

//初始化图
function initCharts(data){
	var charts = echarts.init(document.getElementById('charts'));
	var labelOption = {
	    normal: {
	        show: true,
	        fontSize: 16,
	        position: 'top',
	        formatter: '{c}',
	        color: '#000',
//	        position: 'insideBottom',
//	        distance: 15,
//	        align: 'left',
//	        verticalAlign: 'middle',
//	        rotate: 90,
//	        formatter: '{c}  {name|{a}}',
//	        rich: {
//	            name: {
//	                textBorderColor: '#fff'
//	            }
//	        }
	    }
	};
	
	var legendArray = [], xAxisData = [], seriesData = [];
	//获取X轴坐标数据
	var nameData = [];
	for(var i = 0; i < data.length; i++){
		if(!$.utils.isNull(data[i].name)) nameData[i] = data[i].name.replace('广东-广州-', '');
	}
	//数组去重
	xAxisData = Array.from(new Set(nameData));
	if(g_timeScopeType == '1'){
		//获取所有月份
		legendArray = $.date.getAllMonthBetween(g_searchBeginMonth, g_searchEndMonth, "月");	
		//获取数据
		for(var i = 0; i < legendArray.length; i++){
			var obj = {}, objData = [];
			obj.name = legendArray[i];
			obj.type = 'bar';
			obj.barGap = 0;
			obj.label = labelOption;
			for(var j = 0; j < xAxisData.length; j++){
				var hasValue = false;
				for(var k = 0; k < data.length; k++){
					if(!$.utils.isNull(data[k].name)) {
						var tmpName = data[k].name.replace('广东-广州-', '');
						var tmpMonth = data[k].checkTimeMonth + "月";
						if(tmpName == xAxisData[j] && tmpMonth == legendArray[i]){
							objData.push(data[k].value);
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
	}else{
		//获取所有年
		legendArray = $.date.getAllYearBetween(g_searchBeginYear + "", g_searchEndYear + "", "年");		
		//获取数据
		for(var i = 0; i < legendArray.length; i++){
			var obj = {}, objData = [];
			obj.name = legendArray[i];
			obj.type = 'bar';
			obj.barGap = 0;
			obj.label = labelOption;
			for(var j = 0; j < xAxisData.length; j++){
				var hasValue = false;
				for(var k = 0; k < data.length; k++){
					if(!$.utils.isNull(data[k].name)) {
						var tmpName = data[k].name.replace('广东-广州-', '');
						var tmpYear = data[k].checkTimeYear + "年";
						if(tmpName == xAxisData[j] && tmpYear == legendArray[i]){
							objData.push(data[k].value);
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
	}
	option = {
	    title: {
	        text: '案发市辖区',
	        left: 'center'
	    },
//	    color: ['#a74848', '#4973a7', '#63a0a7'],
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
	        bottom: 0,
	        right: 70,
//	        data: ['1月', '2月' '3月'],
	        data: legendArray
	    },
	    toolbox: {
	        show: true,
	        orient: 'vertical',
	        left: 'right',
	        top: 'center',
	    },
	    calculable: true,
	    xAxis: [
	        {
	            name : '市辖区',
	            nameLocation: 'middle',
	            nameTextStyle:{
	                padding: [12, 0, 0, 0],
	                fontSize: 14,
	                fontWeight: 'bold',
	            },
	            type: 'category',
	            axisTick: {show: false},
//	            data: ['天河', '花都', '海珠', '番禺', '荔湾']
	            data: xAxisData
	        }
	    ],
	    yAxis: [
	        {
	            name : '数量',
	            nameLocation: 'middle',
	            nameRotate: 360,
	            nameTextStyle:{
	                padding: [0, 15, 0, 0],
	                fontSize: 14,
	                fontWeight: 'bold',
	            },
	            type: 'value'
	        }
	    ],
	    series: seriesData
//	    series: [
//	        {
//	            name: '1月',
//	            type: 'bar',
//	            barGap: 0,
//	            label: labelOption,
//	            data: [10, 12, 14, 8, 16]
//	        },
//	        {
//	            name: '2月',
//	            type: 'bar',
//	            label: labelOption,
//	            data: [5, 3, 8, 12, 14]
//	        },
//	        {
//	            name: '3月',
//	            type: 'bar',
//	            label: labelOption,
//	            data: [7, 17, 10, 15, 12]
//	        }
//	    ]
	};
 	// 使用刚指定的配置项和数据显示图表。
	charts.setOption(option);
}

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}

function tableFormatName(value,row,index){
	if(!$.utils.isNull(value)) return value.replace('广东-广州-', '');
	else return "";
}