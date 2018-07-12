//业务模块全局配置
var scms = {}

scms.onMouseOverImage = function(event, image){
	var tooltip = "<div id='tooltip'><img src='"+ image +"' style='width:200px;height:200px;'/><\/div>";
	$("body").append(tooltip); //把它追加到文档中       
	$("#tooltip").css({
		"position": "absolute",
	    "top": (event.pageY + 10) + "px",
	    "left":  (event.pageX + 20)  + "px",
	    "width": "204px",
	    "height": "204px",
	    "padding": "2px",
	    "background-color": "#aaa"//"#28b294",//"#e7eaec",
	}).show("slow");   //设置x坐标和y坐标，并且显示
}

scms.onMouseOutImage = function(){
	$("#tooltip").remove();
}

//获取用户所属的商户ID
scms.getUserMerchantsId = function(){
	if(top.app.hasRole('系统管理员')) return '';
	else if(top.app.hasRole('商户')) {
		var info = scms.getMerchantsInfo();
		if(info != null && info != undefined) return info.id;
		else return '-1';
	}else{
		if($.utils.isNull(top.app.info.extraInfo) || $.utils.isNull(top.app.info.extraInfo.merchantsId)){
			var merchantsId = "";
			$.ajax({
				url: top.app.conf.url.apigateway + "/api/scms/user/getUserMerchantsId",
			    method: 'GET',
			    async: false,
			   	timeout:5000,
			   	data:{
			    	access_token: top.app.cookies.getCookiesToken()
			   	},
			   	success: function(data){
			   		if(top.app.message.code.success == data.RetCode){
			   			merchantsId = data.RetData;
			   			top.app.info.extraInfo.merchantsId = merchantsId;
			   		}
			   	}
			});
			if($.utils.isNull(merchantsId) || merchantsId == '' || merchantsId == '-1') merchantsId = '-1';
			return merchantsId;
		}else{
			return top.app.info.extraInfo.merchantsId;
		}
	}
}

//获取用户归属
scms.getMerchantsInfo = function(){
	if(top.app.hasRole('商户')) {
		if($.utils.isNull(top.app.info.extraInfo) || $.utils.isNull(top.app.info.extraInfo.merchantsInfo)){
			$.ajax({
				url: top.app.conf.url.apigateway + "/api/scms/base/getMerchantsInfoList",
			    method: 'GET',
			    async: false,
			   	timeout:5000,
			   	data:{
			    	access_token: top.app.cookies.getCookiesToken(),
			    	userId: top.app.info.userInfo.userId
			   	},
			   	success: function(data){
			   		if(top.app.message.code.success == data.RetCode){
			   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
			   				top.app.info.extraInfo.merchantsInfo = data.rows[0];
			   			}
			   		}
			   	}
			});
			return top.app.info.extraInfo.merchantsInfo;
		}else{
			return top.app.info.extraInfo.merchantsInfo;
		}
	}
}

//获取折扣后的结果
scms.getDicount = function(val){
	var discount = $.trim(val);
	if(discount != "" && !isNaN(discount)) discount = parseInt(discount);
	if(discount == 0) discount = 1;
	else if(discount < 10) discount = discount / 10;
	else discount = discount / 100;
	return discount;
}

/**
 * 获取店铺下拉内容
 */
scms.getShopPullDown = function(divObj, merchantsId, isAll){
	//获取店铺下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getShopKeyVal",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0) {
					top.app.addComboBoxOption(divObj, data.RetData, isAll);
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
}

/**
 * 获取厂家下拉内容
 */
scms.getVenderPullDown = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getVenderInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].venderName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

//颜色下拉
scms.getColorPullDown = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getColorInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].colorName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

//材质下拉
scms.getTexturePullDown = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getTextureInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
          page: 0,
          size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].textureName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

//尺码下拉
scms.getSizePullDown = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getSizeInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
          page: 0,
          size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].sizeName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

/**
 * 获取客户类型
 */
scms.getCustomerType = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerTypeList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].typeName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

/**
 * 获取客户等级
 */
scms.getCustomerLevel = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerLevelList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].levelName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

/**
 * 获取运输方式
 */
scms.getTransportList = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getTransportInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			merchantsId: merchantsId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].id + '">' + data.rows[i].transportName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
			}
		}
	});
}

/**
 * 根据id获取客户
 */
scms.getCustomerById = function(customerId){
	var dataObject = {};
	//获取店铺下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			id: customerId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) dataObject = data.rows[0];
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return dataObject;
}

/**
 * 根据id获取供货商
 */
scms.getSupplierById = function(supplierId){
	var dataObject = {};
	//获取店铺下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/customer/getSupplierInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			id: supplierId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) dataObject = data.rows[0];
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return dataObject;
}


/**
 * 根据订单ID获取订单商品
 */
scms.getOrderGoodsByOrderId = function(orderId){
	return scms.getDataListByOrderId(top.app.conf.url.apigateway + "/api/scms/order/getOrderGoodsList", orderId);
}

/**
 * 获取订单商品详细列表
 */
scms.getOrderGoodsDetailByDetailId = function(detailId, sendStatus, receiveStatus){
	var dataList = [];
	//获取店铺下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/getOrderGoodsDetailList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			detailId: detailId,
			sendStatus: sendStatus,
			receiveStatus: receiveStatus
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				dataList = data.rows;
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return dataList;
}

/**
 * 获取订单商品详细列表
 */
scms.getOrderPayList = function(orderId){
	return scms.getDataListByOrderId(top.app.conf.url.apigateway + "/api/scms/order/getOrderPayList", orderId);
}

/**
 * 获取订单发货记录
 */
scms.getOrderSendLogList = function(orderId){
	return scms.getDataListByOrderId(top.app.conf.url.apigateway + "/api/scms/order/getOrderSendLogList", orderId);
}

/**
 * 获取订单收货记录
 */
scms.getOrderReceiveLogList = function(orderId){
	return scms.getDataListByOrderId(top.app.conf.url.apigateway + "/api/scms/order/getReceiveLogList", orderId);
}

/**
 * 根据调货单的商品列表
 */
scms.getDhdGoodsByOrderId = function(orderId){
	return scms.getDataListByOrderId(top.app.conf.url.apigateway + "/api/scms/order/getInventoryTransferGoodsList", orderId);
}

/**
 * 根据调货单的商品详情列表
 */
scms.getDhdGoodsDetailByOrderId = function(detailId){
	var dataList = [];
	//获取店铺下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/getInventoryTransferGoodsDetailList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			detailId: detailId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				dataList = data.rows;
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return dataList;
}

/**
 * 根据盘点单的商品详情列表
 */
scms.getPddGoodsByOrderId = function(orderId){
	return scms.getDataListByOrderId(top.app.conf.url.apigateway + "/api/scms/order/getInventoryCheckGoodsList", orderId);
}

/**
 * 根据盘点单的商品详情列表
 */
scms.getPddGoodsDetailByOrderId = function(detailId){
	var dataList = [];
	//获取店铺下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/getInventoryCheckGoodsDetailList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			detailId: detailId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				dataList = data.rows;
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return dataList;
}

scms.getDataListByOrderId = function(url, orderId){
	var dataList = [];
	//获取店铺下拉列表
	$.ajax({
		url: url,
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1000,
			orderId: orderId,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				dataList = data.rows;
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return dataList;
}

/**
 * 通过订单号，获取订单
 */
scms.getOrderByOrderNum = function(orderNum, orderType){
	var row = {}, url = "";
	if(orderType == 'lsd' || orderType == 'pfd' || orderType == 'thd' || orderType == 'ysd')
		url = top.app.conf.url.apigateway + "/api/scms/order/getOrderInfoList";
	else if(orderType == 'jhd' || orderType == 'fcd') 
		url = top.app.conf.url.apigateway + "/api/scms/order/getOrderJhdList";
	else if(orderType == 'pdd') 
		url = top.app.conf.url.apigateway + "/api/scms/order/getOrderPddList";
	else if(orderType == 'dhd') 
		url = top.app.conf.url.apigateway + "/api/scms/order/getOrderDhdList";
	else if(orderType == 'syd') 
		url = top.app.conf.url.apigateway + "/api/scms/order/getOrderSydList";
	//获取店铺下拉列表
	$.ajax({
		url: url,
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
            page: 0,
            size: 1,
            orderNum: orderNum,
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				row = data.rows[0];
			} else {
				top.app.message.noticeError(data.RetMsg);
			}
		}
	});
	return row;
}


function tableFormatOrderNum(value,row,index){
	if($.utils.isEmpty(value)) return '';
	else return '<a href="javascript:jumpToDetail(\'' + value +'\', \'' + row.orderType + '\')">' + value +' </a>'
}

function jumpToDetail(orderNum, orderType){
	top.app.message.loading();
	//获取字典
	var g_orderTypeDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_TYPE');
	var g_orderStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_STATUS');
	var g_orderPayStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_PAY_STATUS');
	var g_orderSendStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_SEND_STATUS');
	var g_orderReceiveStatusDict = top.app.getDictDataByDictTypeValue('SCMS_ORDER_RECEIVE_STATUS');
	
	top.app.info.iframe.params = {};
	//获取对应的订单
	top.app.info.iframe.params.row = scms.getOrderByOrderNum(orderNum, orderType);
	top.app.info.iframe.params.orderTypeId = orderType;
	top.app.info.iframe.params.orderTypeName = top.app.getDictName(orderType, g_orderTypeDict);
	top.app.info.iframe.params.orderTypeDict = g_orderTypeDict;
	top.app.info.iframe.params.orderStatusDict = g_orderStatusDict;
	top.app.info.iframe.params.orderPayStatusDict = g_orderPayStatusDict;
	top.app.info.iframe.params.orderSendStatusDict = g_orderSendStatusDict;
	top.app.info.iframe.params.orderReceiveStatusDict = g_orderReceiveStatusDict;
	top.app.message.loadingClose();
	var url = "";
	if(orderType == 'lsd' || orderType == 'pfd' || orderType == 'thd' || orderType == 'ysd')
		url = "/scms/order/order-lsd-detail.html";
	else if(orderType == 'jhd' || orderType == 'fcd') 
		url = "/scms/order/order-jhd-detail.html";
	else if(orderType == 'pdd') 
		url = "/scms/order/order-pdd-detail.html";
	else if(orderType == 'dhd') 
		url = "/scms/order/order-dhd-detail.html";
	else if(orderType == 'syd') 
		url = "/scms/order/order-syd-detail.html";
//	window.location.href = encodeURI(url);
	top.app.openTab(url, orderNum, '订单详情');
}