//库存工具信息
var g_shopList = [];
var g_selectColor = [], g_selectSize = [], g_selectTexture = [];
var g_goodsInventoryDataList = [];

//获取店铺列表
function getShopList(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getShopKeyVal",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			merchantsId: scms.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0) {
					g_shopList = data.RetData;
				}
			}
		}
	});
}

//初始化商品颜色列表
function initGoodsColor(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getColorInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: scms.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#tdGoodsColor').empty();
					var html = "";
					for(var i = 0; i < data.rows.length; i++){
						html += '<button id="btnColor' + data.rows[i].id + '" type="button" class="btn btn-white btn-table-opreate" onclick="selectColor(\'' + data.rows[i].id + '\', \'' + data.rows[i].colorName + '\')">' + 
									data.rows[i].colorName + 
								'</button>';
					}
					$('#tdGoodsColor').append(html);
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

//颜色选择事件
function selectColor(id, name){
	if($('#btnColor' + id).hasClass('btn-info')){
		$('#btnColor' + id).removeClass('btn-info');
		$('#btnColor' + id).addClass('btn-white');
		for(var i = 0; i < g_selectColor.length; i++){
			if(g_selectColor[i].id == id){
				g_selectColor.splice(i, 1);
				break;
			}
		}
	}else{
		$('#btnColor' + id).addClass('btn-info');
		$('#btnColor' + id).removeClass('btn-white');
		var obj = new Object();
		obj.id = id;
		obj.name = name;
		g_selectColor.push(obj);
	}
	//进行排序
	g_selectColor = g_selectColor.sort($.utils.objArrayCompare("id"));
	//加载初始化库存输入内容
	loadGenInventoryInfo();
}

//初始化商品尺寸列表
function initGoodsSize(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getSizeInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: scms.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#tdGoodsSize').empty();
					var html = "";
					for(var i = 0; i < data.rows.length; i++){
						html += '<button id="btnSize' + data.rows[i].id + '" type="button" class="btn btn-white btn-table-opreate" onclick="selectSize(\'' + data.rows[i].id + '\', \'' + data.rows[i].sizeName + '\')">' + 
									data.rows[i].sizeName + 
								'</button>';
					}
					$('#tdGoodsSize').append(html);
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

//尺寸选择事件
function selectSize(id, name){
	if($('#btnSize' + id).hasClass('btn-info')){
		$('#btnSize' + id).removeClass('btn-info');
		$('#btnSize' + id).addClass('btn-white');
		for(var i = 0; i < g_selectSize.length; i++){
			if(g_selectSize[i].id == id){
				g_selectSize.splice(i, 1);
				break;
			}
		}
	}else{
		$('#btnSize' + id).addClass('btn-info');
		$('#btnSize' + id).removeClass('btn-white');
		var obj = new Object();
		obj.id = id;
		obj.name = name;
		g_selectSize.push(obj);
	}
	//进行排序
	g_selectSize = g_selectSize.sort($.utils.objArrayCompare("id"));
	//加载初始化库存输入内容
	loadGenInventoryInfo();
}

//初始化材质选择列表
function initGoodsTexture(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getTextureInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: scms.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					$('#tdGoodsTexture').empty();
					var html = "";
					for(var i = 0; i < data.rows.length; i++){
						html += '<button id="btnTexture' + data.rows[i].id + '" type="button" class="btn btn-white btn-table-opreate" onclick="selectTexture(\'' + data.rows[i].id + '\', \'' + data.rows[i].textureName + '\')">' + 
									data.rows[i].textureName + 
								'</button>';
					}
					$('#tdGoodsTexture').append(html);
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

//材质选择事件
function selectTexture(id, name){
	if($('#btnTexture' + id).hasClass('btn-info')){
		$('#btnTexture' + id).removeClass('btn-info');
		$('#btnTexture' + id).addClass('btn-white');
		for(var i = 0; i < g_selectTexture.length; i++){
			if(g_selectTexture[i].id == id){
				g_selectTexture.splice(i, 1);
				break;
			}
		}
	}else{
		$('#btnTexture' + id).addClass('btn-info');
		$('#btnTexture' + id).removeClass('btn-white');
		var obj = new Object();
		obj.id = id;
		obj.name = name;
		g_selectTexture.push(obj);
	}
	//进行排序
	g_selectTexture = g_selectTexture.sort($.utils.objArrayCompare("id"));
	//加载初始化库存输入内容
	loadGenInventoryInfo();
}

//加载商品库存列表
function loadGoodsInventoryDataList(goodsId){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInventoryList",
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			goodsId: goodsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				g_goodsInventoryDataList = data.rows;
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

function getGoodsInventoryDataList(goodsId){
	var goodsInventoryDataList = [];
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInventoryList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			goodsId: goodsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				goodsInventoryDataList = data.rows;
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
	return goodsInventoryDataList;
}