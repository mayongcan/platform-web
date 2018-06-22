var g_params = {}, g_iframeIndex = null;
var g_goodsOrderList = [];

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	$("#layerOk").click(function () {
		submitAction();
    });
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	if(g_params.orderInfo.row.orderReceiveStatus == '3'){
		$('#divGoodsList').text('当前订单的商品已全部收货！');
		$('#divSubmitButton').remove();
		$('#tdReceiveMemo').remove();
	}else{
		//加载商品列表
		var goodsList = itp.getOrderGoodsByOrderId(g_params.orderInfo.row.id);
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
			var goodsDetailList = itp.getOrderGoodsDetailByDetailId(goodsList[i].id, "", "0");	//获取未收货的
			var goodsDataList = [];
			for(var j = 0; j < goodsDetailList.length; j++){
				var tmpObj = goodsDetailList[j];
				tmpObj.goodsDiscountPrice = tmpObj.goodsOrderPrice * itp.getDicount(tmpObj.goodsDiscount);
				goodsDataList.push(tmpObj);
			}
			obj.goodsDataList = goodsDataList;
			g_goodsOrderList.push(obj);
		}
		loadGoodsDataList();
	}
	
	//加载发货记录列表
	var receiveList = itp.getOrderReceiveLogList(g_params.orderInfo.row.id);
	$('#tbodyOrderReceiveRecord').empty();
	for(var i = 0; i < receiveList.length; i++){
		$('#tbodyOrderReceiveRecord').append('<tr>' + 
												'<td class="reference-td">' + receiveList[i].receiveByName + '</td>' + 
												'<td class="reference-td">' + receiveList[i].receiveDate + '</td>' + 
												'<td class="reference-td">' + receiveList[i].receiveMemo + '</td>' + 
											'</tr>');
	}
	
	//判断订单状态，如果是已完成和已取消，则不能修改状态
	if(g_params.orderInfo.row.orderStatus == '3' || g_params.orderInfo.row.orderStatus == '4'){
		$('#divSubmitButton').remove();
		$('#tdReceiveMemo').remove();
	}
}

function loadGoodsDataList(){
	$('#divGoodsList').empty();
	for(var i = 0;i < g_goodsOrderList.length; i++){
		if(g_goodsOrderList[i].goodsDataList.length == 0) continue;
		var html = '<div class="ibox-title" style="border-width: 0px;min-height: 30px;color: #4397e6;">' +
			            '<h5>' + 
			            	g_goodsOrderList[i].goodsName + 
			            	'<span style="color: #555555;font-weight: normal;font-size: 12px;">【商品货号：' + g_goodsOrderList[i].goodsSerialNum + '】</span>' + 
			            '</h5>' +
			        '</div>' +
			        '<div style="padding-left: 15px;padding-right: 15px;overflow:auto;width: 800px;padding-bottom: 10px;">' +
						'<table class="reference">' +
							'<tbody>' +
								'<tr>' +
									'<td class="reference-td" style="width:30px;">' + 
										'<label style="line-height: 3px;">' + 
			                                '<input type="checkbox" id="checkAll" value="" onclick="checkAll(' + i + ')" > ' + 
			                            '</label>' + 
									'</td>' +
									'<td class="reference-td">分店</td>' +
									'<td class="reference-td">颜色</td>' +
									'<td class="reference-td">材质</td>' +
									'<td class="reference-td">尺寸</td>' +
									'<td class="reference-td">数量</td>' +
									'<td class="reference-td">单价</td>' +
									'<td class="reference-td">折扣</td>' +
									'<td class="reference-td">折后价</td>' +
								'</tr>';
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			html += '<tr>' +
						'<td class="reference-td">' + 
							'<label style="line-height: 3px;">' + 
				                '<input type="checkbox" id="checkSingle_' + i + '_' + j + '" value="' + g_goodsOrderList[i].goodsDataList[j].id + '" > ' + 
				            '</label>' + 
						'</td>' +
						'<td class="reference-td">' + g_params.orderInfo.row.shopName + '</td>' +
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

function checkAll(index){
	for(var i = 0;i < g_goodsOrderList.length; i++){
		if(i != index) continue;
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			$('#checkSingle_' + i + '_' + j).prop("checked", $('#checkAll').prop('checked'));
		}
	}
}

function getCheckIdList(){
	var idList = '';
	for(var i = 0;i < g_goodsOrderList.length; i++){
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			if($('#checkSingle_' + i + '_' + j).prop('checked')){
				idList += g_goodsOrderList[i].goodsDataList[j].id + ',';
			}
		}
	}
	return idList;
}

/**
 * 提交数据
 */
function submitAction(){
	var idList = getCheckIdList();
	if(idList == ''){
		top.app.message.notice("请选择需要收货的商品！");
		return;
	}
	if($('#receiveMemo').val() == ''){
		top.app.message.notice("请填写备注！");
		return;
	}
	//定义提交数据
	var submitData = {};
	submitData["orderId"] = g_params.orderInfo.row.id;
	submitData["orderReceiveStatus"] = $('#divOrderReceiveStatus input:radio:checked').val();
	submitData["receiveMemo"] = $('#receiveMemo').val();
	//获取收货列表
	submitData["idList"] = idList;
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/order/addOrderReceiveLog?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//数据提交成功后，返回信息
				var rowObj = [];
				g_params.orderInfo.row.orderReceiveStatus = data.RetData;
				rowObj.orderInfo = g_params.orderInfo;
				parent.app.layer.retParams = [];
				parent.app.layer.retParams.push(rowObj);

				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
				parent.layer.close(g_iframeIndex);
				
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
