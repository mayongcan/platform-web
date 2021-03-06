var g_params = {}, g_backUrl = "";
var g_goodsYearDict = null, g_goodsSeasonDict = null, g_buyStatusDict = null, g_shelfStatusDict = null, g_useStatusDict = null;
var g_customerId = "", g_customerName = "", g_customerBalance = 0;
var g_payTypeRowsList = [], g_payTypeValueList = [];
var g_orderTotalPay = 0, g_orderTotalSelNum = 0, g_orderUnPay = 0, g_orderTotalCost = 0, g_balancePay = 0;
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
	initData();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});

function initView(){
	//初始化订单类型名称
	$('#orderTypeName').text(g_params.orderTypeName);
	//初始化客户选择
	loadCustomer();
	//初始化分店列表
	getShopList();
	top.app.addComboBoxOption($("#shopId"), g_shopList);
	//加载支付信息
	initOrderPayType();
	$('input[type=checkbox][id=checkIsCombinePay]').change(function() {
		loadPayInfo();
    });
	loadPayInfo();
	//加载其他信息
	loadOtherInfo();

	//添加商品按钮
	$("#selectGoodsInfo").click(function () {
		var params = {};
		params.orderTypeId = g_params.orderTypeId;
		params.shopId = getShopId();
		params.goodsOrderList = g_goodsOrderList;
		params.shopList = g_shopList;
		params.goodsYearDict = g_goodsYearDict;
		params.goodsSeasonDict = g_goodsSeasonDict;
		params.buyStatusDict = g_buyStatusDict;
		params.shelfStatusDict = g_shelfStatusDict;
		params.useStatusDict = g_useStatusDict;
		top.app.layer.editLayer('选择商品', ['900px', '550px'], '/itp/order/select-goods.html', params, function(retParams){
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

//初始化数据
function initData(){
	if(g_params.type == 'edit'){
		//加载供货商
		var supplier = itp.getSupplierById(g_params.row.customerId);
		g_customerId = supplier.id; 
		g_customerName = supplier.supplierName;
		g_customerBalance = supplier.supplierBalance;
        $('#orderCustomerId').val(g_customerName);
		$("#customerBalance").text(accounting.formatMoney(g_customerBalance, "¥"));
		
//		//加载分店
//		$("#shopId").val(g_params.row.shopId);

		//编辑状态下不允许修改客户和分店
		$("#tdOrderCustomerId").text(g_customerName);
		$("#tdShopId").text(g_params.row.shopName);
		
		//加载已付款列表
		var orderPayList = itp.getOrderPayList(g_params.row.id);
		for(var i = 0; i < orderPayList.length; i++){
			//保存余额支付的内容
			if( orderPayList[i].payTypeId == 1) g_balancePay = orderPayList[i].payAmount;
			if(document.getElementById("payTypeVal" + orderPayList[i].payTypeId)){
				$('#payTypeVal' + orderPayList[i].payTypeId).val(orderPayList[i].payAmount);
			}
		}
		g_orderTotalPay = g_params.row.totalAmount; 
		g_orderUnPay = g_params.row.totalUnPay;
		$('#smallChange').val(g_params.row.smallChange);
		
		//加载商品列表
		var goodsList = itp.getOrderGoodsByOrderId(g_params.row.id);
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
			var goodsDetailList = itp.getOrderGoodsDetailByDetailId(goodsList[i].id);
			var goodsDataList = [];
			for(var j = 0; j < goodsDetailList.length; j++){
				var tmpObj = goodsDetailList[j];
				tmpObj.goodsDiscountPrice = tmpObj.goodsOrderPrice * itp.getDicount(tmpObj.goodsDiscount);
				goodsDataList.push(tmpObj);
			}
			obj.goodsDataList = goodsDataList;
			obj.goodsInventoryDataList = getGoodsInventoryDataList(goodsList[i].goodsId);
			g_goodsOrderList.push(obj);
		}
		loadGoodsDataList();
		
		//设置其他信息
		$('#transportId').val(g_params.row.transportId);
		$('#orderMemo').val(g_params.row.orderMemo);
		
		//显示订单修改备注
		$('#trModifyMemo').css('display', '');
		
		$('#btnOK').text('修 改');
	}
}

//加载客户选择
function loadCustomer(){
	$('#btnSelectOrderCustomerId').click(function () {//设置参数
		var params = {};
		top.app.layer.editLayer('选择供货商', ['900px', '550px'], '/itp/order/select-supplier.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_customerId = retParams[0].supplierId;
			g_customerName = retParams[0].supplierName;
			g_customerBalance = retParams[0].supplierBalance;
			$("#orderCustomerId").val(g_customerName);
			$("#customerBalance").text(accounting.formatMoney(g_customerBalance, "¥"));
		});
	});
}

//支付类型列表
function initOrderPayType(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/base/getPayInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			merchantsId: itp.getUserMerchantsId(),
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					g_payTypeRowsList = data.rows;
					$('#tbodyOrderPayType').empty();
					var html = "";
					for(var i = 0; i < data.rows.length; i++){
						var disable = '';
						if(data.rows[i].id == 1) disable = 'disabled="disabled"';
						var html = '<tr>' +
										'<td class="reference-td" id="tdPayTypeId' + i + '" style="display:none" >' +
											data.rows[i].id +
										'</td>' +
										'<td class="reference-td" id="tdPayTypeText' + i + '" >' +
											data.rows[i].payName +
										'</td>' +
										'<td class="reference-td">' +
											'<div class="input-group">' + 
												'<span class="input-group-addon">¥</span>' + 
												'<input type="text" id="payTypeVal' + data.rows[i].id + '" name="payTypeVal' + data.rows[i].id + '" class="form-control" placeholder="0.00" oninput="payInputEvent()" onporpertychange="payInputEvent()" ' + disable + '>' +
											'</div>' + 
										'</td>' +
									'</tr>' +
									'<script>g_payTypeValueList[' + i + '] = new Cleave("#payTypeVal' + data.rows[i].id + '", {numeral: true,numeralThousandsGroupStyle: "thousand"});</script> ';
						$('#tbodyOrderPayType').append(html);
					}
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
	g_smallChangeValue = new Cleave("#smallChange", {numeral: true,numeralThousandsGroupStyle: "thousand"});
}

//支付金额变更事件
function payInputEvent(){
	loadPayInfo();		//重新显示结果
}

//加载其他信息
function loadOtherInfo(){
	//显示运输方式
	itp.getTransportList($("#transportId"), itp.getUserMerchantsId(), false);
}

//加载支付信息
function loadPayInfo(){
	//计算需要支付的总额
	g_orderTotalPay = 0;
	g_orderTotalSelNum = 0;
	g_orderTotalCost = 0;
	for(var i = 0;i < g_goodsOrderList.length; i++){
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			g_orderTotalPay += g_goodsOrderList[i].goodsDataList[j].goodsDiscountPrice * g_goodsOrderList[i].goodsDataList[j].goodsOrderNum;
			//计算商品总数
			g_orderTotalSelNum += g_goodsOrderList[i].goodsDataList[j].goodsOrderNum;
			//计算总成本
			g_orderTotalCost += g_goodsOrderList[i].goodsDataList[j].goodsPurchasePrice * g_goodsOrderList[i].goodsDataList[j].goodsOrderNum
		}
	}
	//总金额需要减去抹零的金额(抹零金额不能大于支付总金额)
	if(g_smallChangeValue.getRawValue() > g_orderTotalPay) $('#smallChange').val(g_orderTotalPay);
	g_orderTotalPay = g_orderTotalPay - g_smallChangeValue.getRawValue();
	
	$('#orderTotalPay').text(accounting.formatMoney(g_orderTotalPay, "¥"));
	//设置当前的余额支付值，如果是新建订单，则g_balancePay为0，否则g_balancePay=已支付的值
	$('#payTypeVal1').val(g_balancePay);
	var total = 0;
	//遍历所有已经填写的支付，然后计算未付金额
	for(var i = 0; i < g_payTypeValueList.length; i++){
		var trimRet = $.trim(g_payTypeValueList[i].getRawValue());
		if( trimRet == "") continue;
		if(!isNaN(trimRet)) total += parseInt(trimRet);
	}
	//如果是合并支付，则余额支付那里填写还没有支付的金额，未支付总额变为0
	if($('#checkIsCombinePay').prop('checked')){
		$('#payTypeVal1').val(g_orderTotalPay - total + g_balancePay);
		g_orderUnPay = 0;
	}else{
		g_orderUnPay = g_orderTotalPay - total;
	}
	$('#orderUnPay').text(accounting.formatMoney(g_orderUnPay, "¥"));
	if(g_orderUnPay <= 0 ) $('#orderUnPay').css('color', '#1AB394');
	else $('#orderUnPay').css('color', 'red');
}

//获取支付列表
function getOrderPayObjList(){
	var dataList = [];
	var obj = new Object();
	//遍历所有已经填写的支付，然后计算未付金额
	for(var i = 0; i < g_payTypeValueList.length; i++){
		var trimRet = $.trim(g_payTypeValueList[i].getRawValue());
		if( trimRet == "") continue;
		if(!isNaN(trimRet)) {
			//如果是新增，则不记录值为0的支付
			if(g_params.type == 'add' && parseInt(trimRet) == 0) continue;
			obj = new Object(); 
			obj.payTypeId = g_payTypeRowsList[i].id;
			obj.payTypeName = g_payTypeRowsList[i].payName;
			obj.payAmount = parseInt(trimRet);
			dataList.push(obj);
		}
	}
	return dataList;
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
									'<td class="reference-td">库存</td>' +
									'<td class="reference-td">数量</td>' +
									'<td class="reference-td">进货价</td>' +
									'<td class="reference-td">折扣</td>' +
									'<td class="reference-td">折后价</td>' +
									'<td class="reference-td">操作</td>' +
								'</tr>';
		for(var j = 0; j < g_goodsOrderList[i].goodsDataList.length; j++){
			//计算库存
			var goodsInventoryNum = 0;
			for(var inventoryIndex = 0;inventoryIndex < g_goodsOrderList[i].goodsInventoryDataList.length; inventoryIndex++){
				if(getShopId() == g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].shopId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].colorId == g_goodsOrderList[i].goodsDataList[j].goodsColorId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].textureId == g_goodsOrderList[i].goodsDataList[j].goodsTextureId && 
						g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].inventorySizeId == g_goodsOrderList[i].goodsDataList[j].goodsSizeId) {
					goodsInventoryNum = g_goodsOrderList[i].goodsInventoryDataList[inventoryIndex].inventoryNum;
					break;
				}
			}
			html += '<tr>' +
						'<td class="reference-td">' + getShopName()+ '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsColorName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsTextureName + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsSizeName + '</td>' +
						'<td class="reference-td">' + goodsInventoryNum + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsOrderNum + '</td>' +
						'<td class="reference-td">' + accounting.formatMoney(g_goodsOrderList[i].goodsDataList[j].goodsOrderPrice, "¥") + '</td>' +
						'<td class="reference-td">' + g_goodsOrderList[i].goodsDataList[j].goodsDiscount + '</td>' +
						'<td class="reference-td">' + accounting.formatMoney(g_goodsOrderList[i].goodsDataList[j].goodsDiscountPrice, "¥") + '</td>' +
						'<td class="reference-td">' +
							'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="removeOrderGoods(\'' + g_goodsOrderList[i].goodsId + '\', \'' + g_goodsOrderList[i].goodsDataList[j].goodsColorId + '\', \'' + g_goodsOrderList[i].goodsDataList[j].goodsTextureId + '\', \'' + g_goodsOrderList[i].goodsDataList[j].goodsSizeId + '\')">' + 
								'<i class="glyphicon glyphicon-trash" aria-hidden="true"></i> 移除' + 
						  '</button>'
						'</td>' +
					'</tr>';
		}
								
		html +=					'</tbody>' +
						'</table>' +
			       '</div>';
        $('#divGoodsList').append(html);
	}
	//更新支付信息
	loadPayInfo();
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

/**
 * 提交数据
 * @returns
 */
function submitAction(){
	if($('#orderCustomerId').val() == ''){
		top.app.message.notice("请选择供货商！");
		return;
	}
	if(g_goodsOrderList.length == 0) {
		top.app.message.notice("请选择商品！");
		return;
	}
	if(g_orderUnPay > 0){
		top.app.message.confirm("当前订单未付全款，是否继续？", function(){
			submitData();
		});
	}else{
		submitData();
	}
}

//获取分店ID
function getShopId(){
	if(g_params.type == 'edit') {
		return g_params.row.shopId;
	}else return $('#shopId').val();
}

//获取分店名称
function getShopName(){
	if(g_params.type == 'edit') {
		return g_params.row.shopName;
	}else return $("#shopId").find("option:selected").text();
}

//提交数据
function submitData(){
	//定义提交数据
	var submitData = {};
	if(g_params.type == 'edit') {
		submitData["id"] = g_params.row.id;
		submitData["modifyMemo"] = $('#modifyMemo').val();
	}
	submitData["merchantsId"] = itp.getUserMerchantsId();
	submitData["shopId"] = getShopId();
	submitData["shopName"] = getShopName();
	submitData["orderType"] = g_params.orderTypeId;
	var orderPayStatus = 1;
	if(g_orderUnPay <= 0) orderPayStatus = 3;						//全部付款
	else if(g_orderUnPay == g_orderTotalPay) orderPayStatus = 1;	//未付款
	else orderPayStatus = 2;										//部分付款
	submitData["orderPayStatus"] = orderPayStatus;
	submitData["totalAmount"] = g_orderTotalPay;
	//保存抹零金额
	submitData["smallChange"] = g_smallChangeValue.getRawValue();
	submitData["totalUnPay"] = g_orderUnPay;
	submitData["totalProfit"] = '0'; //g_orderTotalPay - g_orderTotalCost;	//订单总利润,进货单不计算利润
	submitData["totalNum"] = g_orderTotalSelNum;
	
	submitData["customerId"] = g_customerId;
	submitData["customerName"] = g_customerName;
	//如果不是合并支付，则客户余额不变，订单按照实际支付情况显示结果
	if($('#checkIsCombinePay').prop('checked')) {
		if(g_params.orderTypeId == 'jhd'){
			//账户余额=客户余额 + (当前账号需要支付的金额 - 已使用账号支付的金额)此处的进货单和其他零售单不一样，是为供货商增加金额
			submitData["customerBalance"] = g_customerBalance + (g_payTypeValueList[0].getRawValue() - g_balancePay);	
		}else if(g_params.orderTypeId == 'fcd'){
			//账户余额=客户余额 + (已使用账号支付的金额 - 当前账号需要支付的金额)
			submitData["customerBalance"] = g_customerBalance + (g_balancePay -  g_payTypeValueList[0].getRawValue());
		}
		//合并付款，订单未支付的金额变更为0，订单支付状态变更为全部付款
		submitData["orderPayStatus"] = 3;
		submitData["totalUnPay"] = 0;
	}
	
	submitData["transportId"] = $('#transportId').val();
	submitData["transportName"] = $("#transportId").find("option:selected").text();
	submitData["orderMemo"] = $('#orderMemo').val();
	
	//获取支付列表
	submitData["orderPayList"] = JSON.stringify(getOrderPayObjList());
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
		obj.goodsDataList = JSON.stringify(g_goodsOrderList[i].goodsDataList);
		dataList.push(obj);
	}
	submitData["orderGoodsList"] = JSON.stringify(dataList);
	
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
