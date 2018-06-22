var g_params = {}, g_iframeIndex = null;
var g_payTypeRowsList = [], g_payTypeValueList = [];
var g_orderTotalPay = 0, g_orderTotalSelNum = 0, g_orderUnPay = 0, g_orderTotalCost = 0, g_balancePay = 0;
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
	//加载支付信息
	initOrderPayType();
	$('input[type=checkbox][id=checkIsCombinePay]').change(function() {
		loadPayInfo();
    });

	//加载客户
	if(g_params.orderInfo.row.customerId == '-1'){
		$("#divCustomerInfo1").css("display", '');
	}else{
		$("#divCustomerInfo2").css("display", '');
		if(g_params.orderInfo.row.orderType == 'lsd' || g_params.orderInfo.row.orderType == 'pfd' || g_params.orderInfo.row.orderType == 'ysd' 
			|| g_params.orderInfo.row.orderType == 'thd')
			$("#customerBalance").text(accounting.formatMoney(g_params.customerInfo.customerBalance, "¥"));
		else if(g_params.orderInfo.row.orderType == 'jhd' || g_params.orderInfo.row.orderType == 'fcd'){
			$("#customerBalance").text(accounting.formatMoney(g_params.customerInfo.supplierBalance, "¥"));
		}
	}

	//加载已付款列表
	var orderPayList = scms.getOrderPayList(g_params.orderInfo.row.id);
	for(var i = 0; i < orderPayList.length; i++){
		//保存余额支付的内容
		if( orderPayList[i].payTypeId == 1) g_balancePay = orderPayList[i].payAmount;
		if(document.getElementById("payTypeVal" + orderPayList[i].payTypeId)){
			$('#payTypeVal' + orderPayList[i].payTypeId).val(orderPayList[i].payAmount);
		}
	}
	
	loadPayInfo();
	
	//判断订单状态，如果是已完成和已取消，则不能修改状态
	if(g_params.orderInfo.row.orderStatus == '3' || g_params.orderInfo.row.orderStatus == '4')
		$('#divSubmitButton').remove();
}

//支付类型列表
function initOrderPayType(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/base/getPayInfoList",
		method: 'GET',
	    async: false,
	   	timeout:5000,
		data: {
			access_token: top.app.cookies.getCookiesToken(),
			merchantsId: scms.getUserMerchantsId(),
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
}

//支付金额变更事件
function payInputEvent(){
	loadPayInfo();		//重新显示结果
}

//加载支付信息
function loadPayInfo(){
	//计算需要支付的总额
	g_orderTotalPay = g_params.orderInfo.row.totalAmount;
	g_orderUnPay = g_params.orderInfo.row.totalUnPay;
		
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
			obj = new Object(); 
			obj.payTypeId = g_payTypeRowsList[i].id;
			obj.payTypeName = g_payTypeRowsList[i].payName;
			obj.payAmount = parseInt(trimRet);
			dataList.push(obj);
		}
	}
	return dataList;
}

/**
 * 提交数据
 */
function submitAction(){
	if(g_params.orderInfo.row.customerId == '-1' && g_orderUnPay < 0){
		top.app.message.notice("未知客户的支付金额不能超出订单总额！");
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

function submitData(){
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_params.orderInfo.row.id;
	
	var orderPayStatus = 1;
	if(g_orderUnPay <= 0) orderPayStatus = 3;						//全部付款
	else if(g_orderUnPay == g_orderTotalPay) orderPayStatus = 1;	//未付款
	else orderPayStatus = 2;										//部分付款
	submitData["orderPayStatus"] = orderPayStatus;
	submitData["totalUnPay"] = g_orderUnPay;
	//未知客户，填写customerId为-1
	if(g_params.orderInfo.row.customerId != '-1'){
		submitData["customerId"] = g_params.customerInfo.id;
		//计算客户余额，如果是合并支付，则客户余额 = -未支付余额； 
		//如果不是合并支付，则客户余额不变，订单按照实际支付情况显示结果
		if($('#checkIsCombinePay').prop('checked')) {
			//账户余额=客户余额 + (已使用账号支付的金额 - 当前账号需要支付的金额)
			if(g_params.orderInfo.row.orderType == 'lsd' || g_params.orderInfo.row.orderType == 'pfd' || g_params.orderInfo.row.orderType == 'ysd')
				submitData["customerBalance"] = g_params.customerInfo.customerBalance + (g_balancePay -  g_payTypeValueList[0].getRawValue());
			else if(g_params.orderInfo.row.orderType == 'jhd'){
				submitData["customerBalance"] = g_params.customerInfo.supplierBalance + (g_payTypeValueList[0].getRawValue() - g_balancePay);
			}else if(g_params.orderInfo.row.orderType == 'thd'){
				//退货单不修改客户余额，订单完成后统一结算
			}else if(g_params.orderInfo.row.orderType == 'fcd'){
				submitData["customerBalance"] = g_params.customerInfo.supplierBalance + (g_balancePay -  g_payTypeValueList[0].getRawValue());
			}
			//合并付款，订单未支付的金额变更为0，订单支付状态变更为全部付款
			submitData["orderPayStatus"] = 3;
			submitData["totalUnPay"] = 0;
		}
	}
	
	//获取支付列表
	submitData["orderPayList"] = JSON.stringify(getOrderPayObjList());
	
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/editOrderPay?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//数据提交成功后，返回信息
				var rowObj = [];
				g_params.orderInfo.row.totalUnPay = g_orderUnPay;
				g_params.orderInfo.row.orderPayStatus = submitData.orderPayStatus;
				if(g_params.orderInfo.row.customerId != '-1'){
					if(g_params.orderInfo.row.orderType == 'lsd' || g_params.orderInfo.row.orderType == 'pfd' || g_params.orderInfo.row.orderType == 'ysd')
						g_params.customerInfo.customerBalance = g_params.customerInfo.customerBalance + (g_balancePay -  g_payTypeValueList[0].getRawValue());
					else if(g_params.orderInfo.row.orderType == 'jhd'){
						g_params.customerInfo.supplierBalance = g_params.customerInfo.supplierBalance + (g_payTypeValueList[0].getRawValue() - g_balancePay);
					}
					else if(g_params.orderInfo.row.orderType == 'thd'){
						//退货单不修改客户余额，订单完成后统一结算
					}
					else if(g_params.orderInfo.row.orderType == 'fcd'){
						g_params.customerInfo.supplierBalance = g_params.customerInfo.supplierBalance + (g_balancePay -  g_payTypeValueList[0].getRawValue());
					}
				}
				
				rowObj.orderInfo = g_params.orderInfo;
				rowObj.customerInfo = g_params.customerInfo;
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