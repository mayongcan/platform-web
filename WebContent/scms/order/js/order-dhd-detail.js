var g_params = {}, g_backUrl = "";
var g_goodsOrderList = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initView();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});

function initView(){
	$('#orderNum').text(g_params.row.orderNum);
	$('#orderStatus').text(g_params.row.orderStatus == '1' ? '已完成' : '已撤销');
	$('#srcShopId').text(g_params.row.srcShopName);
	$('#destShopId').text(g_params.row.destShopName);
	$('#createByName').text(g_params.row.createByName);
	$('#createDate').text(g_params.row.createDate);
	$('#memo').text(g_params.row.memo);
	
	//加载商品列表
	var goodsList = scms.getDhdGoodsByOrderId(g_params.row.id);
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
		obj.goodsDataList = scms.getDhdGoodsDetailByOrderId(goodsList[i].id);
		g_goodsOrderList.push(obj);
	}
	loadGoodsDataList();
}

//加载需要下单的商品列表
function loadGoodsDataList(){
	$('#divGoodsList').empty();
	for(var i = 0;i < g_goodsOrderList.length; i++){
		var html = '<div class="ibox-title" style="border-width: 0px;min-height: 30px;color: #4397e6;">' +
			            '<h5>' + 
			            	g_goodsOrderList[i].goodsName + 
			            	'<span style="color: #555555;font-weight: normal;font-size: 12px;">【商品货号：' + g_goodsOrderList[i].goodsSerialNum + '】</span>' + 
			            '</h5>' +
			        '</div>' +
			        '<div style="padding-left: 15px;padding-right: 15px;">' +
						'<table class="reference">' +
							'<tbody>' +
								'<tr>' +
									'<td class="reference-td">颜色</td>' +
									'<td class="reference-td">尺寸</td>' +
									'<td class="reference-td">调拨数量</td>' +
								'</tr>';
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			html += '<tr>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsColorName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsSizeName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsOrderNum + '</td>' +					
					'</tr>';
		}
								
		html +=					'</tbody>' +
						'</table>' +
			       '</div>';
      $('#divGoodsList').append(html);
	}
}