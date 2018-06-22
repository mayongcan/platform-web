var g_params = {}, g_backUrl = "";
var g_orderTotalSelNum = 0;
var g_goodsYearDict = null, g_goodsSeasonDict = null, g_buyStatusDict = null, g_shelfStatusDict = null, g_useStatusDict = null;
var g_goodsOrderList = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	//初始化字典
	g_goodsYearDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_YEAR');
	g_goodsSeasonDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_SEASON');
	g_buyStatusDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_BUY_STATUS');
	g_shelfStatusDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_SHELF_STATUS');
	g_useStatusDict = top.app.getDictDataByDictTypeValue('ITP_GOODS_USE_STATUS');
	initView();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});


function initView(){
	//初始化分店列表
	getShopList();
	top.app.addComboBoxOption($("#shopId"), g_shopList);

	//添加商品按钮
	$("#selectGoodsInfo").click(function () {
		var params = {};
		params.orderTypeId = "pdd";
		params.shopId = $("#shopId").val();
		params.goodsOrderList = g_goodsOrderList;
		params.shopList = g_shopList;
		params.goodsYearDict = g_goodsYearDict;
		params.goodsSeasonDict = g_goodsSeasonDict;
		params.buyStatusDict = g_buyStatusDict;
		params.shelfStatusDict = g_shelfStatusDict;
		params.useStatusDict = g_useStatusDict;
		top.app.layer.editLayer('选择商品', ['900px', '550px'], '/itp/order/select-goods-simple.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			//判断商品是否已经被选中
			var hasExist = false;
			for(var i = 0; i < g_goodsOrderList.length; i++){
				if(g_goodsOrderList[i].goodsId == retParams[0].goodsId){
					//直接替换数据
					g_goodsOrderList[i] = retParams[0];
					hasExist = true;
					break;
				}
			}
			if(!hasExist) g_goodsOrderList.push(retParams[0]);
			//加载商品列表
			loadGoodsDataList();
		});
    });
	// 切换调出分店后更新界面库存
	$('#shopId').on('changed.bs.select',
		function(e) {
			loadGoodsDataList();
		}
	);

	$("#btnOK").click(function () {
		submitAction();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

//加载需要下单的商品列表
function loadGoodsDataList(){
	g_orderTotalSelNum = 0;
	$('#divGoodsList').empty();
	for(var i = 0;i < g_goodsOrderList.length; i++){
		var html = '<div class="ibox-title" style="border-width: 0px;min-height: 30px;color: #4397e6;">' +
			            '<h5>' + 
			            	g_goodsOrderList[i].goodsName + 
			            	'<span style="color: #555555;font-weight: normal;font-size: 12px;">【商品货号：' + g_goodsOrderList[i].goodsSerialNum + '】</span>' + 
			            '</h5>' +
						'<div class="ibox-tools" style="margin-right: 10px;">' +
							'<a href="#" onclick="delSelectGoodsInfo(\'' + g_goodsOrderList[i].goodsId + '\')"> ' +
								'<i class="glyphicon glyphicon-trash"></i>' +
							'</a>' +
						'</div>' +
			        '</div>' +
			        '<div style="padding-left: 15px;padding-right: 15px;">' +
						'<table class="reference">' +
							'<tbody>' +
								'<tr>' +
									'<td class="reference-td">分店</td>' +
									'<td class="reference-td">颜色</td>' +
									'<td class="reference-td">材质</td>' +
									'<td class="reference-td">尺寸</td>' +
									'<td class="reference-td">盘点前数量</td>' +
									'<td class="reference-td">调盘后数量</td>' +
									'<td class="reference-td">操作</td>' +
								'</tr>';
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			//计算库存
			var goodsInventoryNum = 0;
			for(var inventoryIndex = 0;inventoryIndex < g_goodsOrderList[i].goodsInventoryDataList.length; inventoryIndex++){
				if($("#shopId").val() == g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].shopId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].colorId == g_goodsOrderList[i].goodsDataList[j].goodsColorId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].textureId == g_goodsOrderList[i].goodsDataList[j].goodsTextureId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].inventorySizeId == g_goodsOrderList[i].goodsDataList[j].goodsSizeId) {
					goodsInventoryNum = g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].inventoryNum;
					break;
				}
			}
			html += '<tr>' +
						'<td class="reference-td">' + $("#shopId").find("option:selected").text() + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsColorName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsTextureName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsSizeName + '</td>' +
						'<td class="reference-td">' + goodsInventoryNum + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsOrderNum + '</td>' +
						'<td class="reference-td">' +
							'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="removeOrderGoods(\'' + g_goodsOrderList[i].goodsId + '\', \'' + g_goodsOrderList[i].goodsDataList[j].goodsColorId + '\', \'' + g_goodsOrderList[i].goodsDataList[j].goodsTextureId + '\', \'' + g_goodsOrderList[i].goodsDataList[j].goodsSizeId + '\')">' + 
								'<i class="glyphicon glyphicon-trash" aria-hidden="true"></i> 移除' + 
						  '</button>'
						'</td>' +
					'</tr>';
			//计算商品盘点的总数量
			var total = g_goodsOrderList[i].goodsDataList[j].goodsOrderNum - goodsInventoryNum;
			if(total < 0) total = -total;
			g_orderTotalSelNum += total;
		}
								
		html +=					'</tbody>' +
						'</table>' +
			       '</div>';
    $('#divGoodsList').append(html);
	}
}

//移除选中的商品
function delSelectGoodsInfo(goodsId){
	for(var i = 0;i < g_goodsOrderList.length; i++){
		if(g_goodsOrderList[i].goodsId == goodsId){
			g_goodsOrderList.splice(i, 1);
			break;
		}
	}
	loadGoodsDataList();
}

//移除商品条目
function removeOrderGoods(goodsId, colorId, textureId, sizeId){
	for(var i = 0;i < g_goodsOrderList.length; i++){
		if(g_goodsOrderList[i].goodsId != goodsId) continue;
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			if(g_goodsOrderList[i].goodsDataList[j].goodsColorId == colorId && g_goodsOrderList[i].goodsDataList[j].goodsTextureId == textureId && g_goodsOrderList[i].goodsDataList[j].goodsSizeId == sizeId){
				g_goodsOrderList[i].goodsDataList.splice(j, 1);
				break;
			}
		}
	}
	//判断是否有一个商品列表被全部移除,如果是，则移除整条商品
	for(var i = 0;i < g_goodsOrderList.length; i++){
		if(g_goodsOrderList[i].goodsDataList.length == 0){
			g_goodsOrderList.splice(i, 1);
			break;
		}
	}
	loadGoodsDataList();
}

function getOrderGoodsList(){
	//获取订单关联的商品，双层属性的对象需要做处理
	var dataList = [];
	for(var i = 0;i < g_goodsOrderList.length; i++){
		var obj = new Object();
		obj.goodsId = g_goodsOrderList[i].goodsId;
		obj.goodsName = g_goodsOrderList[i].goodsName;
		obj.goodsSerialNum = g_goodsOrderList[i].goodsSerialNum;
		obj.goodsPhoto = g_goodsOrderList[i].goodsPhoto;
		obj.salePrice = g_goodsOrderList[i].salePrice;
		obj.purchasePrice = g_goodsOrderList[i].purchasePrice;
		obj.packingNum = g_goodsOrderList[i].packingNum;
		var tmpDataList = [];
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			var tmpDataObj = g_goodsOrderList[i].goodsDataList[j];
			//增加盘点前后的数量
			var goodsInventoryNum = 0;
			for(var inventoryIndex = 0;inventoryIndex < g_goodsOrderList[i].goodsInventoryDataList.length; inventoryIndex++){
				if($("#shopId").val() == g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].shopId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].colorId == g_goodsOrderList[i].goodsDataList[j].goodsColorId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].textureId == g_goodsOrderList[i].goodsDataList[j].goodsTextureId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].inventorySizeId == g_goodsOrderList[i].goodsDataList[j].goodsSizeId) {
					goodsInventoryNum = g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].inventoryNum;
					break;
				}
			}
			tmpDataObj.goodsBeforeNum = goodsInventoryNum;
			tmpDataObj.goodsAfterNum = g_goodsOrderList[i].goodsDataList[j].goodsOrderNum;
			tmpDataObj.profitLoss = (g_goodsOrderList[i].goodsDataList[j].goodsOrderNum - goodsInventoryNum) * g_goodsOrderList[i].goodsDataList[j].goodsPurchasePrice;
			tmpDataList.push(tmpDataObj);
		}
		obj.goodsDataList = JSON.stringify(tmpDataList);
		dataList.push(obj);
	}
	return dataList;
}

/**
 * 提交数据
 * @returns
 */
function submitAction(){
	if(g_goodsOrderList.length == 0) {
		top.app.message.notice("请选择需要盘点的商品！");
		return;
	}
	//定义提交数据
	var submitData = {};
	submitData["merchantsId"] = itp.getUserMerchantsId();
	submitData["shopId"] = $('#shopId').val();
	submitData["shopName"] = $("#shopId").find("option:selected").text();
	submitData["memo"] = $('#memo').val();
	submitData["totalNum"] = g_orderTotalSelNum;
	submitData["orderGoodsList"] = JSON.stringify(getOrderGoodsList());
	
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

