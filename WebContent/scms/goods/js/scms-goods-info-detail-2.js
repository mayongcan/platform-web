var $table = $('#tableList'), g_params = null, g_backUrl = "", g_tableHeight = 0;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = parent.g_params;
	parent.document.getElementById('sub-iframe').style.height = '0px';
	g_tableHeight = $.utils.calcPageHeight(parent.document);
	getStatisticsGoodsInventory();
	//初始化列表信息
	initTable();

	setTimeout(function () {
		//重新计算当前页面的高度，用于iframe
        parent.document.getElementById('sub-iframe').style.height = g_tableHeight + 'px';
    }, 300);
});

function getStatisticsGoodsInventory(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getStatisticsGoodsInventory",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	goodsId: g_params.row.id
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				var totalShop = data.rows.length, totalInventoryNum = 0, totalPurchasePrice = 0, purchasePrice = 0;
	   				$('#shopList').empty();
	   				for(var i = 0; i < data.rows.length; i++){
	   					totalInventoryNum += data.rows[i].totalInventoryNum;
	   					purchasePrice = data.rows[i].purchasePrice;
	   					$('#shopList').append('<div style="padding-right:30px;padding-top:8px;float:left;min-width: 180px">' +
						   			       			'<div style="font-size:12px">' + data.rows[i].shopName +'</div>' +
						   			       			'<div>' + 
						   			       				'库存：<span style="color:#65a9e8;font-size:20px;margin-right:10px;">' + data.rows[i].totalInventoryNum + '</span>' + 
						   			       				'成本：<span style="color:#65a9e8;font-size:20px;margin-right:10px;">' + accounting.formatMoney(data.rows[i].totalInventoryNum * purchasePrice, "¥") + '</span>' + 
						   			       			'</div>' +
						   			       		'</div>'
	   						);
	   				}
	   				totalPurchasePrice = totalInventoryNum * purchasePrice;
	   				$('#totalShop').text(totalShop);
	   				$('#totalInventory').text(totalInventoryNum);
	   				$('#totalPurchasePrice').text(accounting.formatMoney(totalPurchasePrice, "¥"));
	   			}
	   		}
	   	}
	});
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
            goodsId: g_params.row.id
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInventoryList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        height: g_tableHeight,
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	appTable.searchPannelHeight = 80;
	//初始化Table相关信息
	appTable.initTable($table);
}


