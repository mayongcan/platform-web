var $table = $('#tableList'), g_loadDataRow = null;
var g_statTypeDict = [];
$(function () {
	initView();
	//获取权限菜单
	initFunc();
	//初始化列表信息
//	initTable();
});

function initView(){
	g_statTypeDict = rales.getDictByCode("00052006");
	top.app.addComboBoxOption($("#searchStatType"), g_statTypeDict, false);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		if($.utils.isEmpty($.trim($("#searchFrequency").val()))){
   			top.app.message.notice("请输入发射频率！");
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
		$('#searchFrequency').val("");
		$('#searchStatType').val("");
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
            frequency: $('#searchFrequency').val(),
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
		title: '发射频率',
		field:"frequency",
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
        url: top.app.conf.url.apigateway + "/api/rales/sam/info/getFrequencyStatisticList",   		//请求后台的URL（*）
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
	var dataName = [], dataValue = [];
	for(var i = 0; i < data.length; i++){
		dataName.push(data[i].frequency);
		dataValue.push({value:data[i].totalCnt, name: data[i].frequency});
	}
	option = {
	    title: {
	        text: '各频段使用数量统计图',
	        left: 'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        bottom: 10,
	        left: 'center',
	        data: dataName
	    },
	    series : [
	        {
	            name:'各频段使用数量统计图',
	            type: 'pie',
	            radius : '45%',
	            center: ['50%', '50%'],
	            selectedMode: 'single',label: {
	                normal: {
	                    formatter: "{b}：{d}%",
	                    color: '#000'
	                }
	            },
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
	var dataXName = [], dataYName = [];
	for(var i = 0; i < data.length; i++){
		dataXName.push(data[i].frequency);
	}
	var tmpData = $.trim($("#searchStatType").val()).split(',');
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
            name: data[i].frequency,
            type: 'bar',
            label: seriesLabel,
            data: seriesData,
        });
	}
	option = {
	    title: {
	        text: '各频段不同类别台站数量统计图',
	        left: 'center'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
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
	        data: dataYName,
	    },
	    series: dataValue,
	};
	// 使用刚指定的配置项和数据显示图表。
	barCharts.setOption(option);
}

//初始化线图
function initLineCharts(data){
	var lineCharts = echarts.init(document.getElementById('lineCharts'));

	//初始化数据
	var dataXName = [], dataYName = [];
	for(var i = 0; i < data.length; i++){
		dataXName.push(data[i].frequency);
	}
	var tmpData = $.trim($("#searchStatType").val()).split(',');
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
            name: data[i].frequency,
            type:'line',
            stack: '总量',
            data: seriesData,
        });
	}
	
	option = {
	    title: {
	        text: '各频段不同类别台站数量统计图',
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