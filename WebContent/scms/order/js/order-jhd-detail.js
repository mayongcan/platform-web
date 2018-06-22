var g_params = {}, g_backUrl = "";
var g_goodsOrderList = [];
var g_customerInfo = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initView();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});

function initView(){
	$('#orderNum').text("【订单编号：" + g_params.row.orderNum + "】");
	$('#totalAmount').text(accounting.formatMoney(g_params.row.totalAmount, "¥"));
	$('#totalUnPay').text(accounting.formatMoney(g_params.row.totalUnPay, "¥"));
	$('#totalGoodsRows').text(g_params.row.totalGoodsRows);
	$('#totalNum').text(g_params.row.totalNum);
	$('#orderType').text("【订单类型：" + g_params.orderTypeName + "】");
	$('#orderStatus').text("【订单状态：" + top.app.getDictName(g_params.row.orderStatus, g_params.orderStatusDict) + "】");
	$('#orderPayStatus').html("【付款状态：<span style='color:#e95879;'>" + top.app.getDictName(g_params.row.orderPayStatus, g_params.orderPayStatusDict) + "</span>】");
	$('#orderSendStatus').html("【发货状态：<span style='color:#e95879;'>" + top.app.getDictName(g_params.row.orderSendStatus, g_params.orderSendStatusDict) + "</span>】");
	$('#orderReceiveStatus').html("【收货状态：<span style='color:#e95879'>" + top.app.getDictName(g_params.row.orderReceiveStatus, g_params.orderReceiveStatusDict) + "</span>】");
	
	//显示收款
	$('#orderPayStatus').click(function () {
		var params = {};
		params.orderInfo = g_params;
		params.customerInfo = g_customerInfo;
		top.app.layer.editLayer('订单付款信息', ['900px', '550px'], '/scms/order/status-change-pay.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			top.app.message.loading();
			//更新参数
			g_params = retParams[0].orderInfo;
			g_customerInfo = retParams[0].customerInfo;
			//更新未支付金额
			$('#totalUnPay').text(accounting.formatMoney(g_params.row.totalUnPay, "¥"));
			$('#orderPayStatus').html("【付款状态：<span style='color:#e95879;'>" + top.app.getDictName(g_params.row.orderPayStatus, g_params.orderPayStatusDict) + "</span>】");
			//更新客户信息
			loadCustomer();
			loadPayList();
			top.app.message.loadingClose();
		});
    });
	//显示发货历史，可以修改发货状态
	$('#orderSendStatus').click(function () {
		var params = {};
		params.orderInfo = g_params;
		top.app.layer.editLayer('订单发货信息', ['900px', '550px'], '/scms/order/status-change-send.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			//更新参数
			g_params = retParams[0].orderInfo;
			//更新发货状态
			$('#orderSendStatus').html("【发货状态：<span style='color:#e95879;'>" + top.app.getDictName(g_params.row.orderSendStatus, g_params.orderSendStatusDict) + "</span>】");
		});
    });
	//显示收货历史，可以修收货状态
	$('#orderReceiveStatus').click(function () {
		var params = {};
		params.orderInfo = g_params;
		top.app.layer.editLayer('订单发货信息', ['900px', '550px'], '/scms/order/status-change-receive.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			//更新参数
			g_params = retParams[0].orderInfo;
			//更新收货状态
			$('#orderReceiveStatus').html("【收货状态：<span style='color:#e95879'>" + top.app.getDictName(g_params.row.orderReceiveStatus, g_params.orderReceiveStatusDict) + "</span>】");
		});
    });
	
	loadCustomer();
	loadPayList();
	
	//加载商品列表
	var goodsList = scms.getOrderGoodsByOrderId(g_params.row.id);
	for(var i = 0; i < goodsList.length; i++){
		var obj = new Object();
		obj.id = goodsList[i].id;
		obj.orderId = goodsList[i].orderId;
		obj.goodsId = goodsList[i].goodsId;
		obj.goodsName = goodsList[i].goodsName;
		obj.goodsSerialNum = goodsList[i].goodsSerialNum;
		obj.goodsPhoto = goodsList[i].goodsPhoto;
		obj.salePrice = goodsList[i].salePrice;
		obj.purchasePrice = goodsList[i].purchasePrice;
		obj.packingNum = goodsList[i].packingNum;
		var goodsDetailList = scms.getOrderGoodsDetailByDetailId(goodsList[i].id);
		var goodsDataList = [];
		for(var j = 0; j < goodsDetailList.length; j++){
			var tmpObj = goodsDetailList[j];
			tmpObj.goodsDiscountPrice = tmpObj.goodsOrderPrice * scms.getDicount(tmpObj.goodsDiscount);
			goodsDataList.push(tmpObj);
		}
		obj.goodsDataList = goodsDataList;
		g_goodsOrderList.push(obj);
	}
	loadGoodsDataList();

	$('#smallChange').text(accounting.formatMoney(g_params.row.smallChange, "¥"));
	//订单其他信息
	$('#createBy').text(g_params.row.createByName);
	$('#createDate').text(g_params.row.createDate);
	$('#sellerBy').text(g_params.row.sellerByName);
	$('#performanceBy').text(g_params.row.performanceByName);
	$('#transportId').text(g_params.row.transportName);
	$('#orderMemo').text(g_params.row.orderMemo);

	//根据订单类型做出相应的变更
	if(g_params.orderTypeId == 'jhd'){
		$('#orderReceiveStatus').css('display', '');
	}else if(g_params.orderTypeId == 'fcd'){
		$('#orderSendStatus').css('display', '');
	}
}

//加载客户信息
function loadCustomer(){
	$('#customerInfo').empty();
	if($.utils.isNull(g_customerInfo))
		g_customerInfo = scms.getSupplierById(g_params.row.customerId);
	$('#customerInfo').append('供货商名称：<span style="margin-right:50px;">' + g_customerInfo.supplierName + '</span>');
	$('#customerInfo').append('供货商负责人：<span style="margin-right:50px;">' + g_customerInfo.supplierAdmin + '</span>');
	$('#customerInfo').append('手机号码：<span style="margin-right:50px;">' + g_customerInfo.supplierPhone + '</span>');
	$('#customerInfo').append('供货商余额：<span style="margin-right:50px;color:#81c41f">' + accounting.formatMoney(g_customerInfo.supplierBalance, "¥") + '</span>');
}

//加载已付款列表
function loadPayList(){
	var orderPayList = scms.getOrderPayList(g_params.row.id);
	$('#orderPayList').empty();
	for(var i = 0; i < orderPayList.length; i++){
		$('#orderPayList').append('<tr>' + 
									'<td class="reference-td" style="width:120px">' + orderPayList[i].payTypeName + '：</td>' + 
									'<td class="reference-td" style="color:#e95879">' + accounting.formatMoney(orderPayList[i].payAmount, "¥") + '</td>' + 
								'</tr>');
	}
}

//加载需要下单的商品列表
function loadGoodsDataList(){
	$('#divGoodsList').empty();
	for(var i = 0;i < g_goodsOrderList.length; i++){
		var html = '<div class="ibox-title" style="border-width: 0px;min-height: 30px;color: #4397e6;">' +
			            '<h5>' + 
			            	g_goodsOrderList[i].goodsName + 
			            	'<span style="color: #555555;font-weight: normal;font-size: 12px;">【商品货号：' + g_goodsOrderList[i].goodsSerialNum + '】</span>' + 
			            	'<span style="color: #555555;font-weight: normal;font-size: 12px;">【包装数：' + g_goodsOrderList[i].packingNum + '】</span>' + 
			            '</h5>' +
			        '</div>' +
			        '<div style="padding-left: 15px;padding-right: 15px;">' +
						'<table class="reference">' +
							'<tbody>' +
								'<tr>' +
									'<td class="reference-td">颜色</td>' +
									'<td class="reference-td">材质</td>' +
									'<td class="reference-td">尺寸</td>' +
									'<td class="reference-td">数量</td>' +
									'<td class="reference-td">进货价</td>' +
									'<td class="reference-td">折扣</td>' +
									'<td class="reference-td">折后价</td>' +
								'</tr>';
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			html += '<tr>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsColorName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsTextureName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsSizeName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsOrderNum + '</td>' +
						'<td class="reference-td">' + accounting.formatMoney(g_goodsOrderList[i].goodsDataList[j].goodsOrderPrice, "¥") + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsDiscount + '</td>' +
						'<td class="reference-td">' + accounting.formatMoney(g_goodsOrderList[i].goodsDataList[j].goodsDiscountPrice, "¥") + '</td>' +						
					'</tr>';
		}
								
		html +=					'</tbody>' +
						'</table>' +
			       '</div>';
      $('#divGoodsList').append(html);
	}
}