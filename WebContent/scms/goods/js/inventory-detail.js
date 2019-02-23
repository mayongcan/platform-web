
var $table = $('#tableList'),g_operRights = [], g_selectGoodsData = null, g_params = {};
var g_goodsYearDict = null;
var g_goodsSeasonDict = null;
var g_buyStatusDict = null;
var g_shelfStatusDict = null;
var g_useStatusDict = null;

$(function () {
	g_params = top.app.info.iframe.params;
	g_selectGoodsData = g_params.row
	top.app.message.loading();
	//初始化权限
	initFunc();
	initTable();
	//初始化界面
	initView();
	top.app.message.loadingClose();
});


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
            goodsId: g_selectGoodsData.id
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        //url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInventoryList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        height: 420,
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化界面
 */
function initView(){
	g_goodsYearDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_YEAR');
	g_goodsSeasonDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_SEASON');
	g_buyStatusDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_BUY_STATUS');
	g_shelfStatusDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_SHELF_STATUS');
	g_useStatusDict = top.app.getDictDataByDictTypeValue('SCMS_GOODS_USE_STATUS');
//	//输入商品货号后，自动补全
//	$.typeahead({
//	    input: '#searchGoodsSerialNum',
//	    minLength: 1,
//	    order: "asc",
//	    dynamic: true,
//	    delay: 500,
//	    backdrop: {
//	        "background-color": "#fff"
//	    },
//	    template: function (query, item) {
//	    	var firstImg = '<i class="fa fa-file-image-o" aria-hidden="true" style="width: 26px;height: 26px;font-size: 26px;"></i>';
//	    	if(!$.utils.isEmpty(item.goodsPhoto)){
//	    		var imageList = item.goodsPhoto.split(',');
//	    		for(var i = 0;i < imageList.length; i++){
//	    			if($.utils.isEmpty(imageList[i])) continue;
//	    			else{
//	    	    		firstImg = '<img src="' + top.app.conf.url.res.url + imageList[i] + '" style="width:26px; height:26px;">';
//	    	    		break;
//	    			}
//	    		}
//	    	}
//	    	return '<div style="margin-right:15px;float:left">' +
//	    				firstImg +
//		            "</div>" +
//		            '<div style="float:left">' +
//		            	'<div style="margin-right:15px;font-size:14px;font-weight: bold;">商品名称：{{goodsName}}</div>' + 
//		            	'<div class="searchResult">商品货号：{{goodsSerialNum}}</div>' + 
//		            '</div>' +
//		            '<div style="clear:both"></div>';
//	    },
//	    emptyTemplate: "没有找到关键字为 {{query}} 的内容",
//	    source: {
//	    	showGoodsList: {
//	    		display: "goodsSerialNum",
////	    		data: [{
////	                "id": '',
////	                "goodsName": "",
////	                "goodsSerialNum": "",
////	                "gooodsPhoto": '',
////	            }],
//	            ajax: function (query) {
//	                return {
//	                    type: "GET",
//	                    url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInfoList",
//	                    path: "rows",		//用于返回数据的路径，比如ajax的callback返回data的格式为data.rows数组，则path需要配置rows，如果返回的是data.alldata.rows则需要配置为alldata.rows
//	                    data: {
//	            		    access_token: top.app.cookies.getCookiesToken(),
//	    	    			goodsSerialNum: $.trim($('#searchGoodsSerialNum').val())
//	                    },
//	                    callback: {
//	                        done: function (data) {
//	                            return data;
//	                        }
//	                    }
//	                }
//	            },
//	        },
//	    },
//	    callback: {
//	        onClick: function (node, a, item, event) {
//	        	g_selectGoodsData = item;
//	        	loadAllInfo();
//	        },
//	        onSendRequest: function (node, query) {
//	            console.log('request is sent')
//	        },
//	        onReceiveRequest: function (node, query) {
//	            console.log('request is received')
//	        }
//	    },
//	    debug: true
//	});
	
	//加载数据
	loadAllInfo();
}

function loadAllInfo(){
	loadSelectGoodsData();
	loadExtraPrice();
	loadExtraDiscount();
	getStatisticsGoodsInventory();
	//加载库存列表
    $table.bootstrapTable('refresh', {"url": top.app.conf.url.apigateway + "/api/scms/goods/getGoodsInventoryList"});
}

//显示商品数据
function loadSelectGoodsData(){
	$('#divEditForm').css('display', '');
	$('#goodsName').text(g_selectGoodsData.goodsName);
	$("#goodsSerialNum").text(g_selectGoodsData.goodsSerialNum);
	$('#categoryId').text(g_selectGoodsData.categoryName)
	$("#venderId").text(g_selectGoodsData.venderName);
	$("#salePrice").text(accounting.formatMoney(g_selectGoodsData.salePrice, "¥"));
	$("#purchasePrice").text(accounting.formatMoney(g_selectGoodsData.purchasePrice, "¥"));
	$("#defDiscount").text(g_selectGoodsData.defDiscount);
	$("#packingNum").text(g_selectGoodsData.packingNum);
	$("#goodsYear").text(top.app.getDictName(g_selectGoodsData.goodsYear, g_goodsYearDict));
	$("#goodsSeason").text(top.app.getDictName(g_selectGoodsData.goodsSeason, g_goodsSeasonDict));
	$("#buyStatus").text(top.app.getDictName(g_selectGoodsData.buyStatus, g_buyStatusDict));
	$("#shelfStatus").text(top.app.getDictName(g_selectGoodsData.shelfStatus, g_shelfStatusDict));
	$("#useStatus").text(top.app.getDictName(g_selectGoodsData.useStatus, g_useStatusDict));
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

function loadExtraPrice(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getGoodsExtraPriceList",
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            size: 1000, 
            page: 0,	
	    	goodsId: g_selectGoodsData.id
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
	    	goodsId: g_selectGoodsData.id
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

function getStatisticsGoodsInventory(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/goods/getStatisticsGoodsInventory",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	goodsId: g_selectGoodsData.id
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				var totalShop = data.rows.length, totalInventoryNum = 0, totalPurchasePrice = 0, purchasePrice = 0;
	   				$('#shopList').empty();
	   				for(var i = 0; i < data.rows.length; i++){
	   					totalInventoryNum += data.rows[i].totalInventoryNum;
	   					purchasePrice = data.rows[i].purchasePrice;
	   					$('#shopList').append('<div style="padding-right:30px;padding-top:8px;float:left;min-width: 200px">' +
						   			       			'<div style="font-size:13px">' + data.rows[i].shopName +'</div>' +
						   			       			'<div>' + 
						   			       				'库存：<span style="color:#65a9e8;font-size:13px;margin-right:10px;">' + data.rows[i].totalInventoryNum + '</span>' + 
						   			       				'成本：<span style="color:#65a9e8;font-size:13px;margin-right:10px;">' + accounting.formatMoney(data.rows[i].totalInventoryNum * purchasePrice, "¥") + '</span>' + 
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
