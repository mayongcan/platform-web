var g_params = null, g_backUrl = "";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = parent.g_params;
	top.app.message.loading();
	loadExtraPrice();
	loadExtraDiscount();
	initData();
	top.app.message.loadingClose();
});

function loadExtraPrice(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsExtraPriceList",
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            size: 1000, 
            page: 0,	
			goodsId: g_params.row.id,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#tbodyMorePrice').empty();
					for(var i = 0; i < data.rows.length; i++){
						addMorePrice(data.rows[i].extraName, data.rows[i].extraPrice);
					}
					if(data.rows.length > 0){
						$('#trExtraPrice').css('display', '');
					}else{
						$('#trExtraPrice').css('display', 'none');
					}
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

function loadExtraDiscount(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsExtraDiscountList",
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            size: 1000, 
            page: 0,	
			goodsId: g_params.row.id,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#tbodyMoreDiscount').empty();
					for(var i = 0; i < data.rows.length; i++){
						addMoreDiscount(data.rows[i].extraName, data.rows[i].extraDiscount);
					}
					if(data.rows.length > 0){
						$('#trExtraDiscount').css('display', '');
					}else{
						$('#trExtraDiscount').css('display', 'none');
					}
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
					accounting.formatMoney(extraPrice, "¥") + 
					'</td>' +
				'</tr>';
	$('#tbodyMorePrice').append(html);
}

function addMoreDiscount(extraName, extraDiscount){
	var html = '<tr>' +
					'<td class="reference-td">' +
						extraName +
					'</td>' +
					'<td class="reference-td">' +
						extraDiscount + 
					'</td>' +
				'</tr>';
	$('#tbodyMoreDiscount').append(html);
}

function initData(){
	$('#goodsName').text(g_params.row.goodsName);
	$("#goodsSerialNum").text(g_params.row.goodsSerialNum);
	$('#categoryId').text(g_params.row.categoryName)
	$("#venderId").text(g_params.row.venderName);
	$("#salePrice").text(accounting.formatMoney(g_params.row.salePrice, "¥"));
	$("#purchasePrice").text(accounting.formatMoney(g_params.row.purchasePrice, "¥"));
	$("#defDiscount").text(g_params.row.defDiscount);
	$("#packingNum").text(g_params.row.packingNum);
	$("#goodsTexture").text(g_params.row.goodsTexture);
	$("#goodsYear").text(top.app.getDictName(g_params.row.goodsYear, g_params.goodsYearDict));
	$("#goodsSeason").text(top.app.getDictName(g_params.row.goodsSeason, g_params.goodsSeasonDict));
	$("#buyStatus").text(top.app.getDictName(g_params.row.buyStatus, g_params.buyStatusDict));
	$("#shelfStatus").text(top.app.getDictName(g_params.row.shelfStatus, g_params.shelfStatusDict));
	$("#useStatus").text(top.app.getDictName(g_params.row.useStatus, g_params.useStatusDict));
	$("#goodsDesc").text(g_params.row.goodsDesc);
	
	//显示图片预览
	if(!$.utils.isEmpty(g_params.row.goodsPhoto)){
		var goodsPhotoList = g_params.row.goodsPhoto.split(",");
		for(var i = 0; i < goodsPhotoList.length; i++){
			if($.utils.isEmpty(goodsPhotoList[i])) continue;
			$('#goodsPhoto').append('<div class="file-preview-frame krajee-default file-preview-initial file-sortable kv-preview-thumb">' +
										'<div class="kv-file-content" style="width: 100px;height:100px">' +
											'<img src="' + top.app.conf.url.res.url + goodsPhotoList[i] + '" class="file-preview-image kv-preview-data" style="width: auto; height: auto; max-width: 100%; max-height: 100%;">' +
										'</div>' +
									'</div>');
		}
	} 
	
	//显示选择的商品规格
	if(!$.utils.isEmpty(g_params.row.colorNameList)){
		var arrayName = g_params.row.colorNameList.split(",");
		$('#tdGoodsColor').empty();
		for(var i = 0; i < arrayName.length; i++){
			$('#tdGoodsColor').append('<button type="button" class="btn btn-info btn-table-opreate" >' + 
											arrayName[i] + 
										'</button>');
		}
	}
	if(!$.utils.isEmpty(g_params.row.sizeNameList)){
		var arrayName = g_params.row.sizeNameList.split(",");
		$('#tdGoodsSize').empty();
		for(var i = 0; i < arrayName.length; i++){
			$('#tdGoodsSize').append('<button type="button" class="btn btn-info btn-table-opreate" >' + 
											arrayName[i] + 
										'</button>');
		}
	}
}
