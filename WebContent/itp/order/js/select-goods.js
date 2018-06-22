var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
var g_selectGoodsData = null;
var g_extraPriceList = [], g_extraDiscountList = [];
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
	//输入商品货号后，自动补全
	$.typeahead({
	    input: '#searchGoodsSerialNum',
	    minLength: 1,
	    order: "asc",
	    dynamic: true,
	    delay: 500,
	    backdrop: {
	        "background-color": "#fff"
	    },
	    template: function (query, item) {
	    	var firstImg = '<i class="fa fa-file-image-o" aria-hidden="true" style="width: 26px;height: 26px;font-size: 26px;"></i>';
	    	if(!$.utils.isEmpty(item.goodsPhoto)){
	    		var imageList = item.goodsPhoto.split(',');
	    		for(var i = 0;i < imageList.length; i++){
	    			if($.utils.isEmpty(imageList[i])) continue;
	    			else{
	    	    		firstImg = '<img src="' + top.app.conf.url.res.url + imageList[i] + '" style="width:26px; height:26px;">';
	    	    		break;
	    			}
	    		}
	    	}
	    	return '<div style="margin-right:15px;float:left">' +
	    				firstImg +
		            "</div>" +
		            '<div style="float:left">' +
		            	'<div style="margin-right:15px;font-size:14px;font-weight: bold;">商品名称：{{goodsName}}</div>' + 
		            	'<div class="searchResult">商品货号：{{goodsSerialNum}}</div>' + 
		            '</div>' +
		            '<div style="clear:both"></div>';
	    },
	    emptyTemplate: "没有找到关键字为 {{query}} 的内容",
	    source: {
	    	showGoodsList: {
	    		display: "goodsSerialNum",
//	    		data: [{
//	                "id": '',
//	                "goodsName": "",
//	                "goodsSerialNum": "",
//	                "gooodsPhoto": '',
//	            }],
	            ajax: function (query) {
	                return {
	                    type: "GET",
	                    url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsInfoList",
	                    path: "rows",		//用于返回数据的路径，比如ajax的callback返回data的格式为data.rows数组，则path需要配置rows，如果返回的是data.alldata.rows则需要配置为alldata.rows
	                    data: {
	            		    access_token: top.app.cookies.getCookiesToken(),
	    	    			goodsSerialNum: $.trim($('#searchGoodsSerialNum').val())
	                    },
	                    callback: {
	                        done: function (data) {
	                            return data;
	                        }
	                    }
	                }
	            },
	        },
	    },
	    callback: {
	        onClick: function (node, a, item, event) {
	        	g_selectGoodsData = item;
	        	loadAllInfo();
	        },
	        onSendRequest: function (node, query) {
	            console.log('request is sent')
	        },
	        onReceiveRequest: function (node, query) {
	            console.log('request is received')
	        }
	    },
	    debug: true
	});
	
}

function loadAllInfo(){
	//显示销售价格或者进货价格
	if(g_params.orderTypeId == 'lsd' || g_params.orderTypeId == 'pfd' || g_params.orderTypeId == 'ysd' 
		|| g_params.orderTypeId == 'thd' )
		$('#trSalePrice').css('display', '');
	else if(g_params.orderTypeId == 'jhd' || g_params.orderTypeId == 'fcd') 
		$('#trPurchasePrice').css('display', '');
	
	loadSelectGoodsData();
	loadPriceAndDiscussion();
	//加载商品库存列表
	loadGoodsInventoryDataList(g_selectGoodsData.id);
	//显示库存中的商品规格
	if(!$.utils.isEmpty(g_selectGoodsData.colorIdList)){
		var arrayId = g_selectGoodsData.colorIdList.split(",");
		var arrayName = g_selectGoodsData.colorNameList.split(",");
		$('#tdGoodsColor').empty();
		for(var i = 0; i < arrayId.length; i++){
			var html = '<button id="btnColor' + arrayId[i] + '" type="button" class="btn btn-white btn-table-opreate" onclick="selectColor(\'' + arrayId[i] + '\', \'' + arrayName[i] + '\')">' + 
							arrayName[i] + 
						'</button>';
			$('#tdGoodsColor').append(html);
		}
	}
	if(!$.utils.isEmpty(g_selectGoodsData.textureIdList)){
		var arrayId = g_selectGoodsData.textureIdList.split(",");
		var arrayName = g_selectGoodsData.textureNameList.split(",");
		$('#tdGoodsTexture').empty();
		for(var i = 0; i < arrayId.length; i++){
			var html = '<button id="btnTexture' + arrayId[i] + '" type="button" class="btn btn-white btn-table-opreate" onclick="selectTexture(\'' + arrayId[i] + '\', \'' + arrayName[i] + '\')">' + 
							arrayName[i] + 
						'</button>';
			$('#tdGoodsTexture').append(html);
		}
	}
	if(!$.utils.isEmpty(g_selectGoodsData.sizeIdList)){
		var arrayId = g_selectGoodsData.sizeIdList.split(",");
		var arrayName = g_selectGoodsData.sizeNameList.split(",");
		$('#tdGoodsSize').empty();
		for(var i = 0; i < arrayId.length; i++){
			var html = '<button id="btnSize' + arrayId[i] + '" type="button" class="btn btn-white btn-table-opreate" onclick="selectSize(\'' + arrayId[i] + '\', \'' + arrayName[i] + '\')">' + 
							arrayName[i] + 
						'</button>';
			$('#tdGoodsSize').append(html);
		}
	}

	//清空相关信息
	$('#tbodyGenInventory').empty();
	$('#divTotalStat').css('display', 'none');
	g_selectColor = [], g_selectSize = [], g_selectTexture = [];
}

//显示商品数据
function loadSelectGoodsData(){
	$('#divEditForm').css('display', '');
	loadExtraPrice();
	loadExtraDiscount();
	$('#goodsName').text(g_selectGoodsData.goodsName);
	$("#goodsSerialNum").text(g_selectGoodsData.goodsSerialNum);
	$('#categoryId').text(g_selectGoodsData.categoryName)
	$("#venderId").text(g_selectGoodsData.venderName);
	$("#salePrice").val(g_selectGoodsData.salePrice);
	g_salePrice = new Cleave('#salePrice', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
	$("#purchasePrice").val(g_selectGoodsData.purchasePrice);
	g_purchasePrice = new Cleave('#purchasePrice', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
	$("#defDiscount").val(g_selectGoodsData.defDiscount);
	g_defDiscount = new Cleave('#defDiscount', {
	    numeral: true,
	    numeralIntegerScale: 2,
	    numeralDecimalScale: 0
	});
	$("#packingNum").val(g_selectGoodsData.packingNum);
	g_packingNum = new Cleave('#packingNum', {
	    numeral: true,
	    numeralDecimalScale: 0
	});
	$("#goodsYear").text(top.app.getDictName(g_selectGoodsData.goodsYear, g_params.goodsYearDict));
	$("#goodsSeason").text(top.app.getDictName(g_selectGoodsData.goodsSeason, g_params.goodsSeasonDict));
	$("#buyStatus").text(top.app.getDictName(g_selectGoodsData.buyStatus, g_params.buyStatusDict));
	$("#shelfStatus").text(top.app.getDictName(g_selectGoodsData.shelfStatus, g_params.shelfStatusDict));
	$("#useStatus").text(top.app.getDictName(g_selectGoodsData.useStatus, g_params.useStatusDict));
	$("#goodsDesc").text(g_selectGoodsData.goodsDesc);
	
	//显示图片预览
	$('#goodsPhoto').empty();
	if(!$.utils.isEmpty(g_selectGoodsData.goodsPhoto)){
		var goodsPhotoList = g_selectGoodsData.goodsPhoto.split(",");
		for(var i = 0; i < goodsPhotoList.length; i++){
			if($.utils.isEmpty(goodsPhotoList[i])) continue;
			$('#goodsPhoto').append('<div class="file-preview-frame krajee-default file-preview-initial file-sortable kv-preview-thumb">' +
										'<div class="kv-file-content" style="width: 100px;height:100px">' +
											'<img src="' + top.app.conf.url.res.url + goodsPhotoList[i] + '" class="file-preview-image kv-preview-data" style="width: auto; height: auto; max-width: 100%; max-height: 100%;">' +
										'</div>' +
									'</div>');
		}
	} 
}

//加载价格与折扣
function loadPriceAndDiscussion(){
	//选择其他价格按钮
	$('#btnAddMorePrice').click(function () {
		$('#tbodyMorePrice').empty();
		for(var i = 0; i < g_extraPriceList.length; i++){
			addMorePrice(g_extraPriceList[i].extraName, g_extraPriceList[i].extraPrice);
		}
		$('#tableMorePrice').css('display', '');
	});
	
	//选择其他折扣
	$('#btnAddMoreDiscount').click(function () {
		$('#tbodyMoreDiscount').empty();
		for(var i = 0; i < g_extraDiscountList.length; i++){
			addMoreDiscount(g_extraDiscountList[i].extraName, g_extraDiscountList[i].extraDiscount);
		}
		$('#tableMoreDiscount').css('display', '');
	});
}

//额外价格
function loadExtraPrice(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsExtraPriceList",
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken(),
          size: 1000, 
          page: 0,	
			goodsId: g_selectGoodsData.id,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					g_extraPriceList = data.rows;
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

function addMorePrice(extraName, extraPrice){
	var html = '<tr>' +
					'<td class="reference-td">' +
						extraName +
					'</td>' +
					'<td class="reference-td">' +
						extraPrice + 
					'</td>' +
					'<td class="reference-td">' +
					   	'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="selectPrice(' + extraPrice + ')">' +
							'<i class="glyphicon glyphicon-ok" aria-hidden="true"></i> 选择 ' +
					  	'</button>' +
					'</td>' +
				'</tr>';
	$('#tbodyMorePrice').append(html);
}

function selectPrice(extraPrice){
	$('#tableMorePrice').css('display', 'none');
	$('#salePrice').val(extraPrice);
	orderNumInputEvent();
}

//额外折扣
function loadExtraDiscount(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsExtraDiscountList",
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken(),
      size: 1000, 
      page: 0,	
			goodsId: g_selectGoodsData.id,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					g_extraDiscountList = data.rows;
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

function addMoreDiscount(extraName, extraDiscount){
	var html = '<tr>' +
					'<td class="reference-td">' +
						extraName +
					'</td>' +
					'<td class="reference-td">' +
						extraDiscount + 
					'</td>' +
					'<td class="reference-td">' +
					   	'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="selectDiscount(' + extraDiscount + ')">' +
							'<i class="glyphicon glyphicon-ok" aria-hidden="true"></i> 选择 ' +
					  	'</button>' +
					'</td>' +
				'</tr>';
	$('#tbodyMoreDiscount').append(html);
}

function selectDiscount(extraDiscount){
	$('#tableMoreDiscount').css('display', 'none');
	$('#defDiscount').val(extraDiscount);
	orderNumInputEvent();
}

function loadGenInventoryInfo(){
	//动态生成table内容
	$('#tbodyGenInventory').empty();
	if(g_selectColor.length == 0 && g_selectTexture.length == 0 && g_selectSize.length == 0) {
		$('#divTotalStat').css('display', 'none');
		return; 
	}
	$('#divTotalStat').css('display', '');
	$('#divTotalStatNotice').text('');
	if(g_selectColor.length == 0) $('#divTotalStatNotice').text('(请选择商品颜色)');
	else if(g_selectTexture.length == 0) $('#divTotalStatNotice').text('(请选择商品材质)');
	else if(g_selectSize.length == 0) $('#divTotalStatNotice').text('(请选择商品尺寸)');
	//首先生成表格头
	var tableHeader = '<tr>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品颜色</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品材质</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品尺寸</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品库存</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">下单数量</td>' +  
							'<td class="reference-td" style="font-weight:bold;line-height:20px;width: 50px;min-width: 50px !important;">' +
								'<i class="glyphicon glyphicon-plus" style="cursor: pointer;margin-right:10px" onclick="plusNum()"></i>' +
								'<i class="glyphicon glyphicon-minus" style="cursor: pointer;" onclick="minusNum()"></i>' +
							'</td>' + 
						'</tr>';
	$('#tbodyGenInventory').append(tableHeader);
	var tableContent = "", colorRowSpan = 1, textureRowSpan = g_selectSize.length;
	if(g_selectTexture.length == 0 || g_selectSize.length == 0) colorRowSpan = g_selectTexture.length + g_selectSize.length;
	else colorRowSpan = g_selectTexture.length * g_selectSize.length;
	if(colorRowSpan == 0) colorRowSpan = 1;
	if(textureRowSpan == 0) textureRowSpan = 1;
	var colorLength = g_selectColor.length == 0 ? 1 : g_selectColor.length, 
		textureLength = g_selectTexture.length == 0 ? 1 : g_selectTexture.length,
		sizeLength = g_selectSize.length == 0 ? 1 : g_selectSize.length;
	//生成内容,首先获取颜色层
	for(var colorIndex = 0; colorIndex < colorLength; colorIndex++){
		tableContent += '<tr>' + 
							'<td class="reference-td" rowspan="' + colorRowSpan + '" style="line-height:20px;">' + 
								getDataListValue(g_selectColor, colorIndex) + 
							'</td>'; 
		//获取材质层
		for(var textureIndex = 0; textureIndex < textureLength; textureIndex++){
			tableContent += '<td class="reference-td" rowspan="' + textureRowSpan + '" style="line-height:20px;">' + 
								getDataListValue(g_selectTexture, textureIndex) + 
							'</td>'; 
			//获取尺寸层
			for(var sizeIndex = 0; sizeIndex < sizeLength; sizeIndex++){
				var selColorId = getDataListId(g_selectColor, colorIndex), selTextureId = getDataListId(g_selectTexture, textureIndex), selSizeId = getDataListId(g_selectSize, sizeIndex);
				var tmpId = "_" + selColorId + "_" + selTextureId + "_" + selSizeId;
				//显示库存
				var inventoryRet = "", cssMarginBottom = "", goodsBarcode = "";
				if(selColorId != '' && selTextureId != '' && selSizeId != ''){
					for(var shopIndex = 0; shopIndex < g_params.shopList.length; shopIndex++){
//						if(shopIndex == g_params.shopList.length - 1) cssMarginBottom = "";
//						else cssMarginBottom = "margin-bottom:5px;";
						//显示选中的分店库存
						if(g_params.shopId != g_params.shopList[shopIndex].ID) continue;
						for(var inventoryIndex = 0;inventoryIndex < g_goodsInventoryDataList.length; inventoryIndex++){
							if(g_params.shopList[shopIndex].ID == g_goodsInventoryDataList[inventoryIndex].shopId && g_goodsInventoryDataList[inventoryIndex].colorId == selColorId && 
									g_goodsInventoryDataList[inventoryIndex].textureId == selTextureId && g_goodsInventoryDataList[inventoryIndex].inventorySizeId == selSizeId) {
								inventoryRet += '<div class="input-group" style="min-width:120px;' + cssMarginBottom + '">' + 
													'<span class="input-group-addon" style="font-size:12px;">' + g_params.shopList[shopIndex].NAME + '：</span>' + 
													'<input type="text" class="form-control" style="font-size:12px;" value="' + g_goodsInventoryDataList[inventoryIndex].inventoryNum + '" disabled>' +
										        '</div>';
								if(goodsBarcode == "") goodsBarcode = g_goodsInventoryDataList[inventoryIndex].goodsBarcode;
								break;
							}
						}
					}
				}
				//如果为空 ，则显示0
				if(inventoryRet == ''){
					for(var shopIndex = 0; shopIndex < g_params.shopList.length; shopIndex++){
//						if(shopIndex == g_params.shopList.length - 1) cssMarginBottom = "";
//						else cssMarginBottom = "margin-bottom:5px;";
						//显示选中的分店库存
						if(g_params.shopId != g_params.shopList[shopIndex].ID) continue;
						inventoryRet += '<div class="input-group" style="min-width:120px;' + cssMarginBottom + '">' + 
											'<span class="input-group-addon" style="font-size:12px;">' + g_params.shopList[shopIndex].NAME + '：</span>' + 
											'<input type="text" class="form-control" style="font-size:12px;" value="0" disabled>' +
								        '</div>';
					}
				}
				tableContent += '<td class="reference-td" style="line-height:20px;">' + 
									getDataListValue(g_selectSize, sizeIndex) + 
								'</td>' + 
								'<td class="reference-td" style="line-height:20px;">' + 
									inventoryRet + 
								'</td>' + 
								'<td class="reference-td" style="line-height:20px;">' + 
									'<input id="orderNum' + tmpId + '" type="text" class="form-control" value="0" style="font-size:12px;" oninput="orderNumInputEvent()" onporpertychange="orderNumInputEvent()">' +
								'</td>' + 
								'<td class="reference-td" style="font-weight:bold;line-height:20px;width: 50px;min-width: 50px !important;">' +
									'<i class="glyphicon glyphicon-plus" style="cursor: pointer;margin-right:10px" onclick="plusNum(\'' + tmpId + '\')"></i>' +
									'<i class="glyphicon glyphicon-minus" style="cursor: pointer;" onclick="minusNum(\'' + tmpId + '\')"></i>' +
								'</td>' + 
								'<td class="reference-td" style="display:none;" id="goodsBarcode' + tmpId + '">' + 
									goodsBarcode + 
								'</td>' + 
								'<script>new Cleave("#orderNum' + tmpId + '", {numeral: true,numeralThousandsGroupStyle: "none",numeralIntegerScale: 5,numeralDecimalScale: 0});</script> ' +
							'</tr>'; 
			}
		}
	}
	$('#tbodyGenInventory').append(tableContent);
	//重新计算订单数量和金额
	orderNumInputEvent();
}

function getDataListId(data, index, type){
	if($.utils.isNull(data)) return '';
	if($.utils.isNull(data[index])) return '';
	return data[index].id;
}

function getDataListValue(data, index, type){
	if($.utils.isNull(data)) return '';
	if($.utils.isNull(data[index])) return '';
	return data[index].name;
}

//统计商品数量和总金额
function orderNumInputEvent(){
	//使用setTimeout是由于输入框通过cleave.min.js进行了格式化，因此延迟才能获取到正确的值
	setTimeout(function () {
		g_orderTotalPay = 0;
		g_orderTotalSelNum = 0;
		for(var colorIndex = 0; colorIndex < g_selectColor.length; colorIndex++){
			for(var textureIndex = 0; textureIndex < g_selectTexture.length; textureIndex++){
				for(var sizeIndex = 0; sizeIndex< g_selectSize.length; sizeIndex++){
					var tmpId = "_" + g_selectColor[colorIndex].id + "_" + g_selectTexture[textureIndex].id + "_" + g_selectSize[sizeIndex].id;
					if(document.getElementById("orderNum" + tmpId)){
						var trimRet = $.trim($("#orderNum" + tmpId).val());
						if(trimRet != "" && !isNaN(trimRet)) g_orderTotalSelNum += parseInt(trimRet);
					}
				}
			}
		}
		$('#divTotalStatCnt').text(g_orderTotalSelNum);
		//计算总金额：单价 * 折扣 * 数量
		var discount = itp.getDicount($('#defDiscount').val());
		//判断计算总金额类型
		if(g_params.orderTypeId == 'lsd' || g_params.orderTypeId == 'pfd' || g_params.orderTypeId == 'ysd' 
			|| g_params.orderTypeId == 'thd')
			g_orderTotalPay = g_salePrice.getRawValue() * discount * g_orderTotalSelNum;
		else if(g_params.orderTypeId == 'jhd' || g_params.orderTypeId == 'fcd') 
			g_orderTotalPay = g_purchasePrice.getRawValue() * discount * g_orderTotalSelNum;
		$('#divTotalStatPrice').text(accounting.formatMoney(g_orderTotalPay, "¥"));
		//计算总成本：成本价 * 数量
		g_orderTotalCost = g_selectGoodsData.purchasePrice * g_orderTotalSelNum;
	}, 300);
}

//+1操作
function plusNum(index){
	if($.utils.isEmpty(index)){
		//全部+1
		for(var colorIndex = 0; colorIndex < g_selectColor.length; colorIndex++){
			for(var textureIndex = 0; textureIndex < g_selectTexture.length; textureIndex++){
				for(var sizeIndex = 0; sizeIndex< g_selectSize.length; sizeIndex++){
					var tmpId = "_" + g_selectColor[colorIndex].id + "_" + g_selectTexture[textureIndex].id + "_" + g_selectSize[sizeIndex].id;
					if(document.getElementById("orderNum" + tmpId)){
						var trimRet = $.trim($("#orderNum" + tmpId).val());
						if(trimRet != "" && !isNaN(trimRet)) $("#orderNum" + tmpId).val(parseInt(trimRet) + 1);
					}
				}
			}
		}
		orderNumInputEvent();
	}else{
		if(document.getElementById("orderNum" + index)){
			var trimRet = $.trim($("#orderNum" + index).val());
			if(trimRet != "" && !isNaN(trimRet)) {
				$("#orderNum" + index).val(parseInt(trimRet) + 1);
				orderNumInputEvent();
			}
		}
	}
}

//-1操作
function minusNum(index){
	if($.utils.isEmpty(index)){
		//全部-1
		for(var colorIndex = 0; colorIndex < g_selectColor.length; colorIndex++){
			for(var textureIndex = 0; textureIndex < g_selectTexture.length; textureIndex++){
				for(var sizeIndex = 0; sizeIndex< g_selectSize.length; sizeIndex++){
					var tmpId = "_" + g_selectColor[colorIndex].id + "_" + g_selectTexture[textureIndex].id + "_" + g_selectSize[sizeIndex].id;
					if(document.getElementById("orderNum" + tmpId)){
						var trimRet = $.trim($("#orderNum" + tmpId).val());
						if(trimRet != "" && !isNaN(trimRet)) $("#orderNum" + tmpId).val(parseInt(trimRet) - 1);
					}
				}
			}
		}
		orderNumInputEvent();
	}else{
		if(document.getElementById("orderNum" + index)){
			var trimRet = $.trim($("#orderNum" + index).val());
			if(trimRet != "" && !isNaN(trimRet)) {
				$("#orderNum" + index).val(parseInt(trimRet) - 1);
				orderNumInputEvent();
			}
		}
	}
}

//获取选中的列表
function getOrderGoodsList(){
	var dataList = [];
	for(var colorIndex = 0; colorIndex < g_selectColor.length; colorIndex++){
		for(var textureIndex = 0; textureIndex < g_selectTexture.length; textureIndex++){
			for(var sizeIndex = 0; sizeIndex< g_selectSize.length; sizeIndex++){
				var tmpId = "_" + g_selectColor[colorIndex].id + "_" + g_selectTexture[textureIndex].id + "_" + g_selectSize[sizeIndex].id;
				if(document.getElementById("orderNum" + tmpId)){
					var trimRet = $.trim($("#orderNum" + tmpId).val());
					//排除选择数量为0的
					if(trimRet != "" && !isNaN(trimRet) && parseInt(trimRet) != 0) {
						if(parseInt(trimRet) < 0){
							top.app.message.notice("下单数量需为正数！");
							return null;
						}
						var obj = new Object();
						//基本信息
						obj.goodsId = g_selectGoodsData.id;
						obj.goodsName = g_selectGoodsData.goodsName;
						obj.goodsSerialNum = g_selectGoodsData.goodsSerialNum;
						obj.goodsPhoto = g_selectGoodsData.goodsPhoto;
						obj.goodsSalePrice = g_selectGoodsData.salePrice;
						obj.goodsPurchasePrice = g_selectGoodsData.purchasePrice;
						if(g_params.orderTypeId == 'lsd' || g_params.orderTypeId == 'pfd' || g_params.orderTypeId == 'ysd'
							|| g_params.orderTypeId == 'thd' )
							obj.goodsOrderPrice = g_salePrice.getRawValue();
						else if(g_params.orderTypeId == 'jhd' || g_params.orderTypeId == 'fcd')
							obj.goodsOrderPrice = g_purchasePrice.getRawValue();		//如果是进货单，则填写成本价
						
						obj.goodsDiscount = $.trim($('#defDiscount').val());
						if(obj.goodsDiscount == '' || obj.goodsDiscount == '0') obj.goodsDiscount = 100;
						//利润=订单单价*折扣 - 成本
						var discount = itp.getDicount(obj.goodsDiscount);
						obj.goodsDiscountPrice = obj.goodsOrderPrice * discount;	//折后价格
						
						if(g_params.orderTypeId == 'lsd' || g_params.orderTypeId == 'pfd' || g_params.orderTypeId == 'ysd'
							|| g_params.orderTypeId == 'thd')
							obj.goodsOrderProfit = obj.goodsOrderPrice * discount - obj.goodsPurchasePrice;
						else if(g_params.orderTypeId == 'jhd' || g_params.orderTypeId == 'fcd') obj.goodsOrderProfit = 0; 		//如果是进货单，则不设置利润
						
						//商品规格
						obj.goodsOrderNum = parseInt(trimRet);
						obj.goodsColorId = g_selectColor[colorIndex].id;
						obj.goodsColorName = g_selectColor[colorIndex].name;
						obj.goodsSizeId = g_selectSize[sizeIndex].id;
						obj.goodsSizeName = g_selectSize[sizeIndex].name;
						obj.goodsTextureId = g_selectTexture[textureIndex].id ;
						obj.goodsTextureName = g_selectTexture[textureIndex].name ;
						//商品条码
						obj.goodsBarcode = $("#goodsBarcode" + tmpId).text();
						dataList.push(obj);
					}
				}
			}
		}
	}
	return dataList;
}

/**
 * 提交数据
 */
function submitAction(){
	if((g_params.orderTypeId == 'lsd' || g_params.orderTypeId == 'pfd' || g_params.orderTypeId == 'ysd' || g_params.orderTypeId == 'thd') 
			&& $('#salePrice').val() == ''){
		top.app.message.notice("请输入销售价格！");
		return;
	}
	if((g_params.orderTypeId == 'jhd' || g_params.orderTypeId == 'fcd') && $('#purchasePrice').val() == ''){
		top.app.message.notice("请输入进货价格！");
		return;
	}
	if($('#packingNum').val() == ''){
		top.app.message.notice("请输入包装数！");
		return;
	}
	if(g_selectColor.length == 0 || g_selectTexture.length == 0 || g_selectSize.length == 0) {
		top.app.message.notice("请选择需要下单的商品规格！");
		return;
	}
	var goodsDataList = getOrderGoodsList();
	if(goodsDataList == null) return;
	if(goodsDataList.length == 0){
		top.app.message.notice("请输入商品下单数量！");
		return;
	}
	//判断商品是否已被选中
	var hasExist = false;
	for(var i = 0; i < g_params.goodsOrderList.length; i++){
		if(g_params.goodsOrderList[i].goodsId == g_selectGoodsData.id){
			hasExist = true;
			break;
		}
	}
	//如果商品已经在选择列表中，则需要提示是否进行覆盖
	if(hasExist){
		top.app.message.confirm("当前商品已在选择列表，是否需要替换？", function(){
			retParams(goodsDataList);
		});
	}else{
		retParams(goodsDataList);
	}
}

function retParams(goodsDataList){
	var rowObj = [];
	rowObj.goodsId = g_selectGoodsData.id;
	rowObj.goodsName = g_selectGoodsData.goodsName;
	rowObj.goodsSerialNum = g_selectGoodsData.goodsSerialNum;
	rowObj.goodsPhoto = g_selectGoodsData.goodsPhoto;
	rowObj.salePrice = g_selectGoodsData.salePrice;
	rowObj.purchasePrice = g_selectGoodsData.purchasePrice;
	rowObj.packingNum = $('#packingNum').val();
	rowObj.goodsDataList = goodsDataList;
	rowObj.goodsInventoryDataList = g_goodsInventoryDataList;	//返回当前商品的库存列表
	parent.app.layer.retParams = [];
	parent.app.layer.retParams.push(rowObj);

	//关闭页面前设置结果
	parent.app.layer.editLayerRet = true;
	parent.layer.close(g_iframeIndex);
}