var $table = $('#tableList'), g_operRights = [], g_dateFormatBegin, g_dateFormatEnd, g_comboBoxTree, g_btnDateIndex = 1;

$(function () {
	//初始化搜索面板
	initSearchPanel();
	//初始化列表信息
	initTable();
	getStatistics();
});

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	//搜索面板高度
	appTable.searchPannelHeight = $('#searchDetailTitle').outerHeight(true) + $('#searchPannel').outerHeight(true) + 30;	
	//bootstrap 折叠事件，替换图标
    $('.collapse-content').on('show.bs.collapse', function (e) {
    	appTable.searchPannelHeight += 150;
    	appTable.resetTableHeightOnLoad($table, appTable.searchPannelHeight);
    })
	$('.collapse-content').on('hide.bs.collapse', function (e) {
		appTable.searchPannelHeight -= 150;
		appTable.resetTableHeightOnLoad($table, appTable.searchPannelHeight);
    })
	//查询
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
		getStatistics();
    });
	//重置
	$("#btnReset").click(function () {
		if(g_btnDateIndex == 1) {
			g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
			g_dateFormatBegin = g_dateFormatEnd
		}else if(g_btnDateIndex == 2) {
			g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
			g_dateFormatBegin = $.date.dateFormat($.date.dateAdd('d', -6, g_dateFormatEnd), "YYYY-MM-DD");
		}else if(g_btnDateIndex == 3) {
			g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
			g_dateFormatBegin = $.date.dateFormat($.date.dateAdd('m', -1, g_dateFormatEnd), "YYYY-MM-DD");
		}else if(g_btnDateIndex == 4) {
			g_dateFormatEnd = $('#searchEndTime').val();
			g_dateFormatBegin = $('#searchBeginTime').val();
		}
		
		$('#searchBeginTime').val(g_dateFormatBegin);
		$('#searchEndTime').val(g_dateFormatEnd);
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
		getStatistics();
    });
	//导出
	$('#btnExport').click(function () {
		appTable.exportTable($table);
    });
	//实现日期联动
	$.date.initSearchDate('divBeginTime', 'divEndTime', 'YYYY-MM-DD');
	g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
	g_dateFormatBegin = g_dateFormatEnd
	$('#searchBeginTime').val(g_dateFormatBegin);
	$('#searchEndTime').val(g_dateFormatEnd);
}

function onSelectDate(index, text){
	g_btnDateIndex = index;
	if($('#btnDate' + index).hasClass('btn-info')) return;
	//移除其他的类
	for(var i = 1; i <= 4; i++){
		if($('#btnDate' + i).hasClass('btn-info')){
			$('#btnDate' + i).removeClass('btn-info');	
			$('#btnDate' + i).addClass('btn-white');
		}
	}
	//当前点击按钮添加类
	$('#btnDate' + index).addClass('btn-info');
	$('#btnDate' + index).removeClass('btn-white');
	//点击其他时，修改
	if(index == 1) {
		g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
		g_dateFormatBegin = g_dateFormatEnd
	}else if(index == 2) {
		g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
		g_dateFormatBegin = $.date.dateFormat($.date.dateAdd('d', -6, g_dateFormatEnd), "YYYY-MM-DD");
	}else if(index == 3) {
		g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD");
		g_dateFormatBegin = $.date.dateFormat($.date.dateAdd('m', -1, g_dateFormatEnd), "YYYY-MM-DD");
	}else if(index == 4) $('#searchDetail').collapse('show');
	$('#searchBeginTime').val(g_dateFormatBegin);
	$('#searchEndTime').val(g_dateFormatEnd);
	//触发加载事件
	$('#btnSearch').trigger("click");
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
            merchantsId: scms.getUserMerchantsId(),
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/report/getAllotReportDestShopList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 获取统计
 * @returns
 */
function getStatistics(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/report/getAllotReportDetailStatistics",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val(),
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				$('#totalGoodsNum').text(data.rows[0].totalGoodsNum);
	   				$('#totalNum').text($.utils.isEmpty(data.rows[0].totalNum) ? 0 : data.rows[0].totalNum);
	   				$('#totalSrcShopNum').text(data.rows[0].totalSrcShopNum);
	   				$('#totalDestShopNum').text(data.rows[0].totalDestShopNum);
	   			}else{
	   				$('#totalGoodsNum').text(0);
	   				$('#totalNum').text(0);
	   				$('#totalSrcShopNum').text(0);
	   				$('#totalDestShopNum').text(0);
	   			}
	   		}
	   	}
	});
}
