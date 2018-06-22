var $table = $('#tableList'), g_operRights = [], g_dateFormatBegin, g_dateFormatEnd;

$(function () {
	//初始化搜索面板
	initSearchPanel();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	getAllGoodsInventoryStatistics();
});

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	//搜索面板高度
	appTable.searchPannelHeight = $('#searchPannel').outerHeight(true);
}

/**
 * 初始化权限
 */
function initFunc(){
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		//显示在列表上方的权限菜单
		if(g_operRights[i].dispPosition == '1'){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
	}
	//添加默认权限
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
            merchantsId: scms.getUserMerchantsId(),
            goodsName: $("#searchGoodsName").val(),
            goodsSerialNum: $("#searchGoodsSerialNum").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInfoList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	appTable.searchPannelHeight = $('#searchPannel').outerHeight(true) + 60;
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
		getAllGoodsInventoryStatistics();
    });
	$("#btnReset").click(function () {
        $("#searchGoodsName").val("");
        $("#searchGoodsSerialNum").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
		getAllGoodsInventoryStatistics();
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="detailActoin(' + row.id + ')">' + 
				'<i class="glyphicon glyphicon-info-sign" aria-hidden="true"></i> 详情' +
		  '</button>'
}

function detailActoin(id){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/scms/goods/Inventory-detail.html?_pid=" + pid;
	window.location.href = encodeURI(url);
}

/**
 * 获取统计
 * @returns
 */
function getAllGoodsInventoryStatistics(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getAllGoodsInventoryStatistics",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
            merchantsId: scms.getUserMerchantsId(),
            goodsName: $("#searchGoodsName").val(),
            goodsSerialNum: $("#searchGoodsSerialNum").val(),
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				$('#totalGoods').text(data.rows[0].totalGoods);
	   				$('#totalGoodsInventory').text(data.rows[0].totalGoodsInventory);
	   				$('#totalPurchase').text(accounting.formatMoney(data.rows[0].totalPurchase, "¥"));
	   			}else{
	   				$('#totalGoods').text(0);
	   				$('#totalGoodsInventory').text(0);
	   				$('#totalPurchase').text(accounting.formatMoney(0, "¥"));
	   			}
	   		}
	   	}
	});
}
