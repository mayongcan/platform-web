var $table = $('#tableList'), g_loadDataRow = null;
var g_statTypeDict = [], g_statAreaCodeDict = [];
$(function () {
	initView();
	//获取权限菜单
	initFunc();
	//初始化列表信息
//	initTable();
});

function initView(){
	g_statAreaCodeDict = rales.getDictByCode("00032006");
	top.app.addComboBoxOption($("#searchStatAreaCode"), g_statAreaCodeDict, false);
	g_statTypeDict = rales.getDictByCode("00052006");
	top.app.addComboBoxOption($("#searchStatType"), g_statTypeDict, false);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		if($.utils.isEmpty($.trim($("#searchStatAreaCode").val()))){
   			top.app.message.notice("请选择需要统计的所在地！");
   			return;
		}
		if($.utils.isEmpty($.trim($("#searchStatType").val()))){
   			top.app.message.notice("请选择需要统计的台站类型！");
   			return;
		}
		$('#tableList').css('display', '');
		$('#chats').css('display', '');
		$table.bootstrapTable('destroy');
		loadTable();
//		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$('#tableList').css('display', 'none');
		$('#chats').css('display', 'none');
		$('#searchStatType').val("");
		$('#searchStatAreaCode').val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('destroy');
//		$table.bootstrapTable('refresh');
    });
}

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

function loadTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            areaCode: $.trim($("#searchStatAreaCode").val()),
            stationType: $.trim($("#searchStatType").val()),
        };
        return param;
    };
    var columnsArray = [];
    columnsArray.push({
		field:"tableMulti",
		formatter:"appTable.tableFormatCheckbox",
		checkbox: true,
		visible: false,
    });
    columnsArray.push({
		title: '序号',
		field:"serialNumber",
		align: 'center',
		formatter:"serialNumberTable",
		width: '100px',
    });
    columnsArray.push({
		title: '所在地',
		field:"areaCode",
		formatter:"tableFormatAreaCode",
    });
    if($("#searchStatType").val() != ''){
        var type = $.trim($("#searchStatType").val()).split(',');
        for(var i = 0; i < type.length; i++){
            columnsArray.push({
        		title: top.app.getDictName(type[i], g_statTypeDict),
        		field: type[i],
            });
        }
    }
    columnsArray.push({
		title: '台站总数',
		field:"totalCnt",
    });
    
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/info/getStationStatisticList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        height: 400,
        onClickRow: function(row, $el){
	        appTable.setRowClickStatus($table, row, $el);
        },
        columns: columnsArray,
    });
	//初始化Table相关信息
	appTable.initTable($table, false);
	$table.on('load-success.bs.table', function (data) {
	    g_loadDataRow = $table.bootstrapTable('getData');
	    if($.utils.isNull(g_loadDataRow) || g_loadDataRow.length == 0){
	    	//移除图表
	    	$('#chats').css('display', 'none');
	    }else{
	    	$('#chats').css('display', '');
		    initCharts(g_loadDataRow);
	    }
    });
}

function initCharts(loadData){
	initPieCharts(loadData);
	initBarCharts(loadData);
	initLineCharts(loadData);
}

//初始化饼图
function initPieCharts(data){
	var pieCharts = echarts.init(document.getElementById('pieCharts'));
	//初始化数据
	var tmpData = $.trim($("#searchStatAreaCode").val()).split(',');
	var dataName = [];
	for(var i = 0; i < tmpData.length; i++){
		dataName.push(top.app.getDictName(tmpData[i], g_statAreaCodeDict));
	}
	var dataValue = [];
	for(var i = 0; i < data.length; i++){
		dataValue.push({value:data[i].totalCnt, name: top.app.getDictName(data[i].areaCode, g_statAreaCodeDict)});
	}
	option = {
	    title: {
	        text: '各行政区台站统计图',
	        left: 'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        bottom: 10,
	        left: 'center',
//	        data: ['天河', '花都','海珠','番禺','荔湾']
	        data: dataName
	    },
	    series : [
	        {
	            name:'各行政区台站统计图',
	            type: 'pie',
	            radius : '45%',
	            center: ['50%', '50%'],
	            selectedMode: 'single',label: {
	                normal: {
	                    formatter: "{b}：{d}%",
	                    color: '#000'
	                }
	            },
//	            data:[
//	                {value:12,name: '天河'},
//	                {value:19, name: '花都'},
//	                {value:24, name: '海珠'},
//	                {value:25, name: '番禺'},
//	                {value:15, name: '荔湾'}
//	            ],
	            data: dataValue,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	// 使用刚指定的配置项和数据显示图表。
	pieCharts.setOption(option);
}

//初始化柱状图
function initBarCharts(data){
	var barCharts = echarts.init(document.getElementById('barCharts'));
	var seriesLabel = {
	    normal: {
	        show: true,
	        textBorderColor: '#333',
	        textBorderWidth: 2
	    }
	}
	//初始化数据
	var tmpData = $.trim($("#searchStatAreaCode").val()).split(',');
	var dataXName = [];
	for(var i = 0; i < tmpData.length; i++){
		dataXName.push(top.app.getDictName(tmpData[i], g_statAreaCodeDict));
	}
	tmpData = $.trim($("#searchStatType").val()).split(',');
	var dataYName = [];
	for(var i = 0; i < tmpData.length; i++){
		dataYName.push(top.app.getDictName(tmpData[i], g_statTypeDict));
	}
	var dataValue = [];
	for(var i = 0; i < data.length; i++){
		var seriesData = [];
		for(var j = 0; j < tmpData.length; j++){
			seriesData.push(data[i][tmpData[j]]);
		}
		dataValue.push({
            name: top.app.getDictName(data[i].areaCode, g_statAreaCodeDict),
            type: 'bar',
            label: seriesLabel,
            data: seriesData,
        });
	}
	option = {
	    title: {
	        text: '各行政区不同类别台站数量统计图',
	        left: 'center'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
//	        data: ['海珠', '越秀', '天河'],
	    	data: dataXName,
	        bottom: 0,
	    },
	    grid: {
	        left: 150
	    },
	    xAxis: {
	        type: 'value',
	        axisLabel: {
	            formatter: '{value}'
	        }
	    },
	    yAxis: {
	        type: 'category',
	        inverse: true,
//	        data: ['广播电台', '高频电台', '微波接力站'],
	        data: dataYName,
	    },
//	    series: [
//	        {
//	            name: '海珠',
//	            type: 'bar',
//	            label: seriesLabel,
//	            data: [165, 170, 30],
//	        },
//	        {
//	            name: '越秀',
//	            type: 'bar',
//	            label: seriesLabel,
//	            data: [150, 105, 110]
//	        },
//	        {
//	            name: '天河',
//	            type: 'bar',
//	            label: seriesLabel,
//	            data: [220, 82, 63]
//	        }
//	    ]
	    series: dataValue,
	};
	// 使用刚指定的配置项和数据显示图表。
	barCharts.setOption(option);
}

//初始化线图
function initLineCharts(data){
	var lineCharts = echarts.init(document.getElementById('lineCharts'));

	//初始化数据
	var tmpData = $.trim($("#searchStatAreaCode").val()).split(',');
	var dataXName = [];
	for(var i = 0; i < tmpData.length; i++){
		dataXName.push(top.app.getDictName(tmpData[i], g_statAreaCodeDict));
	}
	tmpData = $.trim($("#searchStatType").val()).split(',');
	var dataYName = [];
	for(var i = 0; i < tmpData.length; i++){
		dataYName.push(top.app.getDictName(tmpData[i], g_statTypeDict));
	}
	var dataValue = [];
	for(var i = 0; i < data.length; i++){
		var seriesData = [];
		for(var j = 0; j < tmpData.length; j++){
			seriesData.push(data[i][tmpData[j]]);
		}
		dataValue.push({
            name: top.app.getDictName(data[i].areaCode, g_statAreaCodeDict),
            type:'line',
            stack: '总量',
            data: seriesData,
        });
	}
	
	option = {
	    title: {
	        text: '市内不同类别台站数量统计图',
		    left: 'center',
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data: dataXName,
	        top: 30
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: dataYName
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: dataValue
	};
	// 使用刚指定的配置项和数据显示图表。
	lineCharts.setOption(option);
}

function serialNumberTable(value,row,index){
	return appTable.tableFormatSerialNumber($table, index);
}

function tableFormatAreaCode(value,row,index){
	return appTable.tableFormatDictValue(g_statAreaCodeDict, value);
}
//格式化统计-文字
function tableFormatTotalText(data){
	return '总数';
}
//格式化统计-数值
function tableFormatTotalValue(data){
	field = this.field;
  return data.reduce(function(sum, row) { 
      return sum + (+row[field]);
  }, 0);
}