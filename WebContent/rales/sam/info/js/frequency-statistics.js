var $table = $('#tableList'), g_loadDataRow = null;
var g_stationTypeDict = [{ID:'1', NAME: '广播电台'}, {ID:'2', NAME: '高频电台'}, {ID:'3', NAME: '微波接力站'}, {ID:'4', NAME: '蜂窝移动通信系统'},
	{ID:'5', NAME: '卫星地球站'}, {ID:'6', NAME: '业余电台'}, {ID:'7', NAME: '甚高频、特高频站台'}, {ID:'8', NAME: '集群'}, {ID:'9', NAME: '其他电台'}];
$(function () {
	initView();
	//获取权限菜单
	initFunc();
	//初始化列表信息
	initTable();
	
	initPieCharts();
	initBarCharts();
	initLineCharts();
});

function initView(){
	top.app.addCheckBoxButton($('#divCheckboxStationType'), g_stationTypeDict, 'checkboxStationType');
	$('#stationTypeCheckAll').change(function(){
		if($(this).prop('checked')){
			top.app.setCheckBoxButton($('#divCheckboxStationType'), g_stationTypeDict, 'checkboxStationType', true);
		}else{
			top.app.setCheckBoxButton($('#divCheckboxStationType'), g_stationTypeDict, 'checkboxStationType', false);
		}
	});
	//搜索点击事件
	$("#btnSearch").click(function () {
		
    });
	$("#btnReset").click(function () {
		$('#searchFrequencyBegin').val('');
		$('#searchFrequencyEnd').val('');
		$('#stationTypeCheckAll').prop('checked', false);
		top.app.setCheckBoxButton($('#divCheckboxStationType'), g_stationTypeDict, 'checkboxStationType', false);
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

function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            frequencyBegin: $('#searchFrequencyBegin').val(),
            frequencyEnd: $('#searchFrequencyEnd').val(),
            stationType: top.app.getCheckBoxButton($('#divCheckboxStationType'), g_stationTypeDict, 'checkboxStationType'),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
		url: top.app.conf.url.apigateway + "/api/rales/sam/info/getFrequencyStatisticList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        height: 400,
        onClickRow: function(row, $el){
	        	appTable.setRowClickStatus($table, row, $el);
        },
        onPostBody:function () {
	    		setTimeout(function () {
	    	    	    if($.utils.isNull(g_loadDataRow) || g_loadDataRow.length == 0){
	    	    	    		$('.fixed-table-footer').remove();
	    	    	    }else{
	    	    	    		//合并页脚
	    	        		var footerTbody = $('.fixed-table-footer table tbody');
	    	            var footerTr = footerTbody.find('>tr');
	    	            var footerTd = footerTr.find('>td');
	    	            var footerTd0 = footerTd.eq(0);
	    	            //隐藏其他列
	    	            for(var i = 0; i < 2; i++) {
	    	                footerTd.eq(i).hide();
	    	            }
	    	            footerTd0.attr('colspan', 2).show();
	    	            footerTd.eq(2).attr('width', "150px").show();
	    	            footerTd.eq(3).attr('width', "150px").show();
	    	            footerTd.eq(4).attr('width', "150px").show();
	    	            footerTd.eq(5).attr('width', "150px").show();
	    	    	    }
		    }, 300);
	    }
    });
	//初始化Table相关信息
	appTable.initTable($table, false);
	$table.on('load-success.bs.table', function (data) {
	    g_loadDataRow = $table.bootstrapTable('getData');
	    if($.utils.isNull(g_loadDataRow) || g_loadDataRow.length == 0){
	    		//移除图表
	    		$('#charts').remove();
	    }else{
//		    initCharts(g_loadDataRow);
	    }
    });
}

//初始化饼图
function initPieCharts(data){
	var pieCharts = echarts.init(document.getElementById('pieCharts'));
	option = {
	    title: {
	        text: '市内各频段使用数量统计图',
	        left: 'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        bottom: 10,
	        left: 'center',
	        data: ['100-200MHz', '200-300MHz','300-400MHz','400-500MHz']
//	        data: dataName
	    },
	    series : [
	        {
	            name:'市内各频段使用数量统计图',
	            type: 'pie',
	            radius : '45%',
	            center: ['50%', '50%'],
	            selectedMode: 'single',label: {
	                normal: {
	                    formatter: "{b}：{d}%",
	                    color: '#000'
	                }
	            },
	            data:[
	                {value:12,name: '100-200MHz'},
	                {value:19, name: '200-300MHz'},
	                {value:24, name: '300-400MHz'},
	                {value:25, name: '400-500MHz'},
	            ],
//	            data: dataValue,
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
	option = {
	    title: {
	        text: '市内各频段不同调制方式统计图',
	        left: 'center'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
	    		data: ['100-200MHz', '200-300MHz','300-400MHz'],
	        bottom: 0,
	    },
	    toolbox: {
	        show: true,
	        feature: {
	            saveAsImage: {}
	        }
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
	        data: ['广播电台', '高频电台', '微波接力站'],
	    },
	    series: [
	        {
	            name: '100-200MHz',
	            type: 'bar',
	            label: seriesLabel,
	            data: [165, 170, 30],
	        },
	        {
	            name: '200-300MHz',
	            type: 'bar',
	            label: seriesLabel,
	            data: [150, 105, 110]
	        },
	        {
	            name: '300-400MHz',
	            type: 'bar',
	            label: seriesLabel,
	            data: [220, 82, 63]
	        }
	    ]
	};
	// 使用刚指定的配置项和数据显示图表。
	barCharts.setOption(option);
}

//初始化线图
function initLineCharts(data){
	var lineCharts = echarts.init(document.getElementById('lineCharts'));
	option = {
	    title: {
	        text: '市内不同调制方式频段数量统计图',
	        left: 'center'
	    },
	    xAxis: {
	        type: 'category',
	        data: ['幅移键控', '相移键控', '正交频分复用调制']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [{
	        data: [60, 40, 80],
	        type: 'line'
	    }]
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