var g_params = {}, g_backUrl = "";
var g_orderTotalPay = 0, g_balancePay = 0;
var g_payTypeRowsList = [], g_payTypeValueList = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initView();
	top.app.message.loadingClose();
});


function initView(){
	//初始化店铺列表
	getShopList();
	top.app.addComboBoxOption($("#shopId"), g_shopList);
	$('#supplierName').text(g_params.rows.supplierName);
	$('#supplierBalance').text(accounting.formatMoney(g_params.rows.supplierBalance, "¥"));

	//加载支付信息
	initOrderPayType();
	$('input[type=checkbox][id=checkIsCombinePay]').change(function() {
		loadPayInfo();
    });
	loadPayInfo();

	$("#btnOK").click(function () {
		submitAction();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
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
	g_orderTotalPay = 0;
	//遍历所有已经填写的支付，写入总金额
	for(var i = 0; i < g_payTypeValueList.length; i++){
		var trimRet = $.trim(g_payTypeValueList[i].getRawValue());
		if( trimRet == "") continue;
		if(!isNaN(trimRet)) g_orderTotalPay += parseInt(trimRet);
	}
	$('#orderTotalPay').text(accounting.formatMoney(g_orderTotalPay, "¥"));
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
			if(parseInt(trimRet) == 0) continue;
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
 * @returns
 */
function submitAction(){
	if(g_orderTotalPay == 0){
		top.app.message.notice("请填写支付金额！");
		return;
	}
	//定义提交数据
	var submitData = {};
	submitData["merchantsId"] = scms.getUserMerchantsId();
	submitData["shopId"] = $('#shopId').val();
	submitData["shopName"] = $("#shopId").find("option:selected").text();
	submitData["orderType"] = 'syd';
	submitData["orderPayStatus"] = '3';
	submitData["totalAmount"] = g_orderTotalPay;
	submitData["totalUnPay"] = 0;
	submitData["totalProfit"] = 0;
	submitData["totalNum"] = 0;
	submitData["orderCustomerType"] = '2';
	submitData["customerId"] = g_params.rows.id;
	submitData["customerName"] = g_params.rows.supplierName;
	//如果不是合并支付，则客户余额不变，订单按照实际支付情况显示结果
	if($('#checkIsCombinePay').prop('checked')) {
		//账户余额=客户余额 + (已使用账号支付的金额 - 当前账号需要支付的金额)
		submitData["customerBalance"] = g_params.rows.supplierBalance  - g_orderTotalPay;
		//保存在totalUnPay上，用于取消订单的时候进行金额返还
		submitData["totalUnPay"] = g_orderTotalPay;
	}
	submitData["orderMemo"] = $('#orderMemo').val();
	
	//获取支付列表
	submitData["orderPayList"] = JSON.stringify(getOrderPayObjList());
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/addOrderSyd?access_token=" + top.app.cookies.getCookiesToken(),
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

