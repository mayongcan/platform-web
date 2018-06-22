var $table = $('#tableList'), g_operRights = [], g_dateFormatBegin, g_dateFormatEnd, g_comboBoxTree, g_btnDateIndex = 1;
var g_orderTypeDict = null;
var g_goodsYearDict = null;
var g_goodsSeasonDict = null;

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
			g_dateFormatBegin = g_dateFormatEnd;
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
		$("#searchGoodsName").val("");
		$("#searchGoodsSerialNum").val("");
		g_comboBoxTree.setValue(null);
		$("#searchVender").val("");
		$("#searchYear").val("");
		$("#searchSeason").val("");
		$("#searchShopId").val("");
		$("#searchOrderNum").val("");
		$("#searchColor").val("");
		$("#searchTexture").val("");
		$("#searchSize").val("");
		$("#searchCustomerName").val("");
		$("#searchOrderType").val("");
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
	g_dateFormatBegin = g_dateFormatEnd;
	$('#searchBeginTime').val(g_dateFormatBegin);
	$('#searchEndTime').val(g_dateFormatEnd);
	
	scms.getShopPullDown($("#searchShopId"), scms.getUserMerchantsId(), true);

	g_orderTypeDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_TYPE');
	g_goodsYearDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_YEAR');
	g_goodsSeasonDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_SEASON');
	top.app.addComboBoxOption($("#searchYear"), g_goodsYearDict, true);
	top.app.addComboBoxOption($("#searchSeason"), g_goodsSeasonDict, true);
	
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#goodsCategory') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsCategoryTreeList",
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
	            merchantsId: scms.getUserMerchantsId(),
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	}, '170px');
	
	//获取厂家下拉列表
	scms.getVenderPullDown($("#searchVender"), scms.getUserMerchantsId(), true);
	scms.getColorPullDown($("#searchColor"), scms.getUserMerchantsId(), true);
	scms.getTexturePullDown($("#searchTexture"), scms.getUserMerchantsId(), true);
	scms.getSizePullDown($("#searchSize"), scms.getUserMerchantsId(), true);
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
            orderTypeList: 'lsd,pfd,ysd,thd',
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val(),
            goodsName: $('#searchGoodsName').val(),
            goodsSerialNum: $('#searchGoodsSerialNum').val(),
            categoryId: g_comboBoxTree.getNodeId(),
            venderId: $("#searchVender").val(),
            goodsYear: $("#searchYear").val(),
            goodsSeason: $("#searchSeason").val(),
            shopId: $("#searchShopId").val(),
            orderNum: $("#searchOrderNum").val(),
            goodsColor: $('#searchColor').val(),
            goodsTexture: $("#searchTexture").val(),
            goodsSize: $("#searchSize").val(),
            customerName: $("#searchCustomerName").val(),
            orderType: $("#searchOrderType").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/report/getSaleReportDetailList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}

function tableFormatOrderType(value,row,index){
	if(value == 'thd')
		return '<font color="red">' + appTable.tableFormatDictValue(g_orderTypeDict, value) + '</font>';
	else return appTable.tableFormatDictValue(g_orderTypeDict, value);
}

function tableFormatDiscountPrice(value,row,index){
	return accounting.formatMoney(row.goodsOrderPrice * scms.getDicount(row.goodsDiscount), "¥");
}

function tableFormatTotalPrice(value,row,index){
	return accounting.formatMoney(row.goodsOrderPrice * row.goodsOrderNum, "¥");
}

function tableFormatDiscountTotalPrice(value,row,index){
	return accounting.formatMoney(row.goodsOrderPrice * scms.getDicount(row.goodsDiscount) * row.goodsOrderNum, "¥");
}

function tableFormatProfit(value,row,index){
	if(row.orderType == 'thd')
		return '<font color="red">' + accounting.formatMoney(-value, "¥") + '</font>';
	else return accounting.formatMoney(value, "¥")
}

function tableFormatTotalProfit(value,row,index){
	var tmp = row.goodsOrderProfit * row.goodsOrderNum;
	if(row.orderType == 'thd')
		return '<font color="red">' + accounting.formatMoney(-tmp, "¥") + '</font>';
	else return accounting.formatMoney(tmp, "¥");
}

function formatGoodsSeason(value,row,index){
	return appTable.tableFormatDictValue(g_goodsSeasonDict, value);
}

/**
 * 获取统计
 * @returns
 */
function getStatistics(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/report/getSaleReportDetailStatistics",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
            orderTypeList: 'lsd,pfd,ysd,thd',
            createDateBegin: $("#searchBeginTime").val(),
            createDateEnd: $("#searchEndTime").val(),
            goodsName: $('#searchGoodsName').val(),
            goodsSerialNum: $('#searchGoodsSerialNum').val(),
            categoryId: g_comboBoxTree.getNodeId(),
            venderId: $("#searchVender").val(),
            goodsYear: $("#searchYear").val(),
            goodsSeason: $("#searchSeason").val(),
            shopId: $("#searchShopId").val(),
            orderNum: $("#searchOrderNum").val(),
            goodsColor: $('#searchColor').val(),
            goodsTexture: $("#searchTexture").val(),
            goodsSize: $("#searchSize").val(),
            customerName: $("#searchCustomerName").val(),
            orderType: $("#searchOrderType").val(),
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				$('#singleNum').text(data.rows[0].singleNum);
	   				$('#totalSale').text(accounting.formatMoney(data.rows[0].totalSale, "¥"));
	   				$('#totalProfit').text(accounting.formatMoney(data.rows[0].totalProfit, "¥"));
	   				if($.utils.isEmpty(data.rows[0].totalSale) || data.rows[0].totalSale == 0) $('#totalProfitPercent').text("0%");
	   				else {
	   					if(data.rows[0].totalProfit < 0)
	   						$('#totalProfitPercent').text('-' + (data.rows[0].totalProfit / data.rows[0].totalSale * 100).toFixed(2) + "%");
	   					else 
	   						$('#totalProfitPercent').text((data.rows[0].totalProfit / data.rows[0].totalSale * 100).toFixed(2) + "%");
	   				}
	   			}
	   		}
	   	}
	});
}
