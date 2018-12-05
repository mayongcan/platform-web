var $table = $('#tableList'), g_timeScopeType = "0", g_searchBegin = "", g_searchEnd = "", g_searchYear = "";
var g_loadDataRow = [];
var g_caseTypeDict = [];
$(function () {
	g_timeScopeType = parent.$('#divSearchTime input:radio:checked').val();
	g_searchBegin = parent.$('#searchBegin').val();
	g_searchEnd = parent.$('#searchEnd').val();
	g_searchYear = parseInt(parent.$('#searchYear').val());
	g_caseTypeDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_CASE_TYPE');
	//获取权限菜单
	initFunc();
	//初始化列表信息
	initTable();
//	initPieCharts();
//	initBarCharts();
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
            single: true,
            type: g_timeScopeType,
            begin: g_searchBegin,
            end: g_searchEnd,
            year: g_searchYear,
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/statistic/getStatisticPunishList",   		//请求后台的URL（*）
        queryParams: searchParams,		
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
	    	            var footerTd3 = footerTd.eq(3);
	    	            //隐藏其他列
	    	            for(var i = 0; i < 3; i++) {
	    	                footerTd.eq(i).hide();
	    	            }
	    	            footerTd0.attr('colspan', 3).show();
	    	            footerTd3.attr('width', "250px").show();
	    	    	    }
		    }, 300);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table, false);
	$table.on('load-success.bs.table', function (data) {
	    parent.document.getElementById('case-iframe').style.height = '0px';
	    g_loadDataRow = $table.bootstrapTable('getData');
	    if($.utils.isNull(g_loadDataRow) || g_loadDataRow.length == 0){
	    		//移除图表
	    		$('#pieCharts').remove();
	    		$('#barCharts').remove();
	    }else{
		    initPieCharts(g_loadDataRow);
		    initBarCharts(g_loadDataRow);
	    }
		//重新计算当前页面的高度，用于iframe
	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
    });
}

//初始化饼图
function initPieCharts(data){
	var dataName = [], dataValue = [];
	for(var i = 0; i < data.length; i++){
//		if($.utils.isNull(data[i].name)) dataName[i] = "";
//		else dataName[i] = top.app.getDictName(data[i].name, g_caseTypeDict);
		dataName[i] = data[i].name;
		var obj = {};
		obj.name = dataName[i];
		obj.value = data[i].value;
		dataValue.push(obj);
	}
	var pieCharts = echarts.init(document.getElementById('pieCharts'));
	option = {
	    title: {
	        text: '处罚结果',
	        left: 'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        bottom: 0,
	        left: 'center',
	        data: dataName
	    },
	    series : [
	        {
	            name:'处罚结果',
	            type: 'pie',
	            radius : '45%',
	            center: ['40%', '40%'],
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
	var dataName = [], dataValue = [];
	for(var i = 0; i < data.length; i++){
//		if($.utils.isNull(data[i].name)) dataName[i] = "";
//		else dataName[i] = top.app.getDictName(data[i].name, g_caseTypeDict);
		dataName[i] = data[i].name;
		dataValue[i] = data[i].value;
	}
	var barCharts = echarts.init(document.getElementById('barCharts'));
	option = {
	    title: {
	        text: '处罚结果',
	        left: 'center'
	    },
	    color: ['#4973a7'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        left: 100
	    },
	    xAxis : [
	        {
	            name : '处罚结果',
	            nameLocation: 'middle',
	            nameTextStyle:{
	                padding: [12, 0, 0, 0],
	                fontSize: 14,
	                fontWeight: 'bold',
	            },
	            type : 'category',
	            data : dataName,
	            axisTick: {
	                alignWithLabel: true
	            }
	        }
	    ],
	    yAxis : [
	        {
	            name : '次数',
	            nameLocation: 'middle',
	            nameRotate: 360,
	            nameTextStyle:{
	                padding: [0, 15, 0, 0],
	                fontSize: 14,
	                fontWeight: 'bold',
	            },
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'总次数',
	            type:'bar',
	            barWidth: '50%',
	            data: dataValue
	        }
	    ]
	};
 	// 使用刚指定的配置项和数据显示图表。
	barCharts.setOption(option);
}

function serialNumberTable(value,row,index){
	return appTable.tableFormatSerialNumber($table, index);
}

function tableFormatName(value,row,index){
//	return appTable.tableFormatDictValue(g_caseTypeDict, value);
	return value;
}

function tableFormatTimeScope(value, row) {
	if(g_timeScopeType == '1'){
		return $.date.dateFormat(g_searchBegin, "yyyy年MM月dd日") + " - " + $.date.dateFormat(g_searchEnd, "yyyy年MM月dd日");
	}else if(g_timeScopeType == '2'){
		return g_searchYear + "年01月01日 - " + g_searchYear + "年12月31日";
	}else{
		return "全部";
	}
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