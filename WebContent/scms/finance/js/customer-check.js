var $table = $('#tableList'), g_selectData = null, g_dateFormatBegin, g_dateFormatEnd;

$(function () {
	top.app.message.loading();
	//实现日期联动
	$.date.initSearchDate('divBeginTime', 'divEndTime', 'YYYY-MM-DD HH:mm:ss');
	g_dateFormatEnd = $.date.dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss");
	g_dateFormatBegin = $.date.dateFormat($.date.dateAdd('m', -1, g_dateFormatEnd), "YYYY-MM-DD HH:mm:ss");
	$('#searchBeginTime').val(g_dateFormatBegin);
	$('#searchEndTime').val(g_dateFormatEnd);
	//初始化界面
	initView();
	top.app.message.loadingClose();
});

/**
 * 初始化界面
 */
function initView(){
	//输入商品货号后，自动补全
	$.typeahead({
	    input: '#searchNameAndPhone',
	    minLength: 1,
	    order: "asc",
	    dynamic: true,
	    delay: 500,
	    backdrop: {
	        "background-color": "#fff"
	    },
	    template: function (query, item) {
	    	var firstImg = '<i class="fa fa-file-image-o" aria-hidden="true" style="width: 26px;height: 26px;font-size: 26px;"></i>';
	    	if(!$.utils.isEmpty(item.customerPhoto)){
	    		var imageList = item.customerPhoto.split(',');
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
		            	'<div style="margin-right:15px;font-size:14px;font-weight: bold;">客户名称：{{customerName}}</div>' + 
		            	'<div class="searchResult">手机号码：{{customerPhone}}</div>' + 
		            '</div>' +
		            '<div style="clear:both"></div>';
	    },
	    emptyTemplate: "没有找到关键字为 {{query}} 的内容",
	    source: {
	    	showGoodsList: {
	    		display: ["customerName", "customerPhone"],
	            ajax: function (query) {
	                return {
	                    type: "GET",
	                    url: top.app.conf.url.apigateway + "/api/scms/customer/getCustomerInfoList",
	                    path: "rows",		//用于返回数据的路径，比如ajax的callback返回data的格式为data.rows数组，则path需要配置rows，如果返回的是data.alldata.rows则需要配置为alldata.rows
	                    data: {
	            		    access_token: top.app.cookies.getCookiesToken(),
	            		    nameAndPhone: $.trim($('#searchNameAndPhone').val())
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
	        	g_selectData = item;
	        },
	        onClickAfter: function (node, a, item, event) {
	        	$('#searchNameAndPhone').val(item.customerName);
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

	//搜索点击事件
	$("#btnSearch").click(function () {
		if(g_selectData == null){
			top.app.message.notice("请选择需要对账的客户！");
			return;
		}
		top.app.message.loading();
		loadAllInfo();
		top.app.message.loadingClose();
    });
	$("#btnReset").click(function () {
		g_selectData = null;
		$('#searchNameAndPhone').val("");
		$('#divDetailForm').css('display', 'none');
		$('#searchBeginTime').val(g_dateFormatBegin);
		$('#searchEndTime').val(g_dateFormatEnd);
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

function loadAllInfo(){
	$('#divDetailForm').css('display', '');
	loadBaseInfo();
	loadSaleInfo();
	loadReturnInfo();
	loadReceiptInfo();
}

function loadBaseInfo(){
	$('#formTitle').text("客户对账单-" + ($('#searchCheckType').val() == '1' ? "订单概况" : '订单明细'));
	$('#customerName').text("客户名称：" + g_selectData.customerName);
	$('#customerBalance').text("客户余额：" + accounting.formatMoney(g_selectData.customerBalance, "¥"));
	$('#customerPhone').text("手机号码：" + g_selectData.customerPhone);
	$('#beginTime').text("统计时间：" + $('#searchBeginTime').val() + " ");
	$('#endTime').text(" 至 " + $('#searchEndTime').val());
	if($('#searchCheckType').val() == '1' ){
		$('#trSaleInfoHeader1').css('display', '');
		$('#trSaleInfoHeader2').css('display', 'none');
		$('#trReturnInfoHeader1').css('display', '');
		$('#trReturnInfoHeader2').css('display', 'none');
		$('#trReceiptInfoHeader1').css('display', '');
		$('#trReceiptInfoHeader2').css('display', 'none');
	}else{
		$('#trSaleInfoHeader1').css('display', 'none');
		$('#trSaleInfoHeader2').css('display', '');
		$('#trReturnInfoHeader1').css('display', 'none');
		$('#trReturnInfoHeader2').css('display', '');
		$('#trReceiptInfoHeader1').css('display', 'none');
		$('#trReceiptInfoHeader2').css('display', '');
	}
}

//销售明细
function loadSaleInfo(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/getOrderInfoList",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	page: 0,
	    	size: 500,
			merchantsId: scms.getUserMerchantsId(),
			createDateBegin: $('#searchBeginTime').val(),
			createDateEnd: $('#searchEndTime').val(),
			orderTypeList: 'lsd,pfd,ysd',
			orderCustomerType: '1',
			customerId: g_selectData.id,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			setList(data, $('#tbodySaleInfo'), $('#saleTotal'), $('#saleUnPay'), $('#saleSmallChange'));
	   		}
	   	}
	});
}

//退货明细
function loadReturnInfo(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/getOrderInfoList",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	page: 0,
	    	size: 500,
			merchantsId: scms.getUserMerchantsId(),
			createDateBegin: $('#searchBeginTime').val(),
			createDateEnd: $('#searchEndTime').val(),
			orderTypeList: 'thd',
			orderCustomerType: '1',
			customerId: g_selectData.id,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			setList(data, $('#tbodyReturnInfo'), $('#returnTotal'), $('#returnUnPay'), $('#returnSmallChange'));
	   		}
	   	}
	});
}

//付款明细
function loadReceiptInfo(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/scms/order/getOrderSydList",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	page: 0,
	    	size: 500,
			merchantsId: scms.getUserMerchantsId(),
			createDateBegin: $('#searchBeginTime').val(),
			createDateEnd: $('#searchEndTime').val(),
			orderTypeList: 'syd',
			orderCustomerType: '1',
			customerId: g_selectData.id,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
   				var total = 0;
   				$('#tbodyReceiptInfo').empty();
	   			if(data.rows != null && data.rows != undefined && data.rows.length > 0){
	   				for(var i = 0; i < data.rows.length; i++){
	   					total += data.rows[i].totalAmount;
	   					if($('#searchCheckType').val() == '1' ){
	   						$('#tbodyReceiptInfo').append('<tr>' + 
														'<td class="reference-td">' + data.rows[i].createDate + '</td>' + 
														'<td class="reference-td">' + data.rows[i].orderNum + '</td>' +
														'<td class="reference-td">' + accounting.formatMoney(data.rows[i].totalAmount, "¥") + '</td>' +
														'<td class="reference-td">' + accounting.formatMoney(data.rows[i].totalAmount, "¥") + '</td>' +
													'</tr>'
	   						);
	   					}else{
	   						var orderPayList = scms.getOrderPayList(data.rows[i].id);
	   						var html = '<tr>' + 
											'<td class="reference-td" rowspan="' + orderPayList.length + '">' + data.rows[i].createDate + '</td>' + 
											'<td class="reference-td" rowspan="' + orderPayList.length + '">' + data.rows[i].orderNum + '</td>';
	   						for(var j = 0; j < orderPayList.length; j++){
	   							if(j != 0) html += '<tr>';
	   							html += '<td class="reference-td">' + orderPayList[j].payTypeName + '</td>' +
	   									'<td class="reference-td">' + accounting.formatMoney(orderPayList[j].payAmount, "¥") + '</td>' +
										'<td class="reference-td">' + accounting.formatMoney(data.rows[i].totalAmount, "¥") + '</td>' +
									'</tr>'
	   						}
	   						$('#tbodyReceiptInfo').append(html);
	   					}
	   				}
	   			}
   				//合计
				if($('#searchCheckType').val() == '1' ){
					$('#tbodyReceiptInfo').append('<tr>' + 
													'<td class="reference-td">合计</td>' + 
													'<td class="reference-td"></td>' +
													'<td class="reference-td">' + accounting.formatMoney(total, "¥") + '</td>' +
													'<td class="reference-td">' + accounting.formatMoney(total, "¥") + '</td>' +
												'</tr>'
					);
				}else{
					$('#tbodyReceiptInfo').append('<tr>' + 
													'<td class="reference-td">合计</td>' + 
													'<td class="reference-td"></td>' +
													'<td class="reference-td"></td>' +
													'<td class="reference-td">' + accounting.formatMoney(total, "¥") + '</td>' +
													'<td class="reference-td">' + accounting.formatMoney(total, "¥") + '</td>' +
												'</tr>'
					);
				}
				//写入汇总
				$('#receiptTotal').text("合计：" + accounting.formatMoney(total, "¥"));
	   		}
	   	}
	});
}

function setList(data, listObj, totalObj, unPayObj, smallChangeObj){
	var total = 0, totalUnPay = 0, smallChange = 0, totalNum = 0;
	listObj.empty();
	if(data.rows != null && data.rows != undefined && data.rows.length > 0){
		for(var i = 0; i < data.rows.length; i++){
			total += data.rows[i].totalAmount;
			totalUnPay += data.rows[i].totalUnPay;
			smallChange += data.rows[i].smallChange;
			totalNum += data.rows[i].totalNum;
			if($('#searchCheckType').val() == '1' ){
				listObj.append('<tr>' + 
											'<td class="reference-td">' + data.rows[i].createDate + '</td>' + 
											'<td class="reference-td">' + data.rows[i].orderNum + '</td>' +
											'<td class="reference-td">' + data.rows[i].totalNum + '</td>' +
											'<td class="reference-td">' + accounting.formatMoney(data.rows[i].totalAmount, "¥") + '</td>' +
											'<td class="reference-td">' + accounting.formatMoney(data.rows[i].totalUnPay, "¥") + '</td>' +
											'<td class="reference-td">' + accounting.formatMoney(data.rows[i].smallChange, "¥") + '</td>' +
											'<td class="reference-td">' + accounting.formatMoney((data.rows[i].totalAmount + data.rows[i].smallChange), "¥") + '</td>' +
										'</tr>'
			);
			}else{
				//获取商品明细
				var goodsList = scms.getOrderGoodsByOrderId(data.rows[i].id);
				var goodsTmpDetailList = [], rowsFirst = 0, rowsSecond = 0;
				for(var j = 0; j < goodsList.length; j++){
					var tmpList = scms.getOrderGoodsDetailByDetailId(goodsList[j].id);
					goodsTmpDetailList.push(tmpList);
					rowsFirst += tmpList.length;
				}
				var html = '<tr>' + 
							'<td class="reference-td" rowspan="' + rowsFirst + '">' + data.rows[i].createDate + '</td>' + 
							'<td class="reference-td" rowspan="' + rowsFirst + '">' + data.rows[i].orderNum + '</td>';
					
				for(var j = 0; j < goodsList.length; j++){
					var goodsDetailList = goodsTmpDetailList[j];
					if(j == 0){
						html += '<td class="reference-td" rowspan="' + goodsDetailList.length + '">' + goodsList[j].goodsName + '</td>' + 
								'<td class="reference-td" rowspan="' + goodsDetailList.length + '">' + goodsList[j].goodsSerialNum + '</td>';
						for(var k = 0; k < goodsDetailList.length; k++){
							if(k == 0){
								html += '<td class="reference-td">' + goodsDetailList[k].goodsColorName + '</td>' +
									'<td class="reference-td">' + goodsDetailList[k].goodsTextureName + '</td>' +
									'<td class="reference-td">' + goodsDetailList[k].goodsSizeName + '</td>' +
									'<td class="reference-td">' + goodsDetailList[k].goodsOrderNum + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney(goodsDetailList[k].goodsOrderPrice, "¥") + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney(goodsDetailList[k].goodsOrderPrice * scms.getDicount(goodsDetailList[k].goodsDiscount), "¥") + '</td>' +
									'<td class="reference-td" rowspan="' + rowsFirst + '">' + accounting.formatMoney(data.rows[i].smallChange, "¥") + '</td>' +
									'<td class="reference-td" rowspan="' + rowsFirst + '">' + accounting.formatMoney((data.rows[i].totalAmount + data.rows[i].smallChange), "¥") + '</td>' +
								'</tr>';
							}else{
								html += '<tr>' + 
											'<td class="reference-td">' + goodsDetailList[k].goodsColorName + '</td>' +
										'<td class="reference-td">' + goodsDetailList[k].goodsTextureName + '</td>' +
										'<td class="reference-td">' + goodsDetailList[k].goodsSizeName + '</td>' +
										'<td class="reference-td">' + goodsDetailList[k].goodsOrderNum + '</td>' +
										'<td class="reference-td">' + accounting.formatMoney(goodsDetailList[k].goodsOrderPrice, "¥") + '</td>' +
										'<td class="reference-td">' + accounting.formatMoney(goodsDetailList[k].goodsOrderPrice * scms.getDicount(goodsDetailList[k].goodsDiscount), "¥") + '</td>' +
									'</tr>';
							}
						}
					}else{
						html = '<tr><td class="reference-td" rowspan="' + goodsDetailList.length + '">' + goodsList[j].goodsName + '</td>';
						html += '<td class="reference-td" rowspan="' + goodsDetailList.length + '">' + goodsList[j].goodsSerialNum + '</td>';
						for(var k = 0; k < goodsDetailList.length; k++){
							if(k != 0) html += '<tr>';
							html += '<td class="reference-td">' + goodsDetailList[k].goodsColorName + '</td>' +
								'<td class="reference-td">' + goodsDetailList[k].goodsTextureName + '</td>' +
								'<td class="reference-td">' + goodsDetailList[k].goodsSizeName + '</td>' +
								'<td class="reference-td">' + goodsDetailList[k].goodsOrderNum + '</td>' +
								'<td class="reference-td">' + accounting.formatMoney(goodsDetailList[k].goodsOrderPrice, "¥") + '</td>' +
								'<td class="reference-td">' + accounting.formatMoney(goodsDetailList[k].goodsOrderPrice * scms.getDicount(goodsDetailList[k].goodsDiscount), "¥") + '</td>' +
							'</tr>';
						}
					}
				listObj.append(html);
				}
			}
		}
	}
	//合计
	if($('#searchCheckType').val() == '1' ){
		listObj.append('<tr>' + 
									'<td class="reference-td">合计</td>' + 
									'<td class="reference-td"></td>' +
									'<td class="reference-td">' + totalNum + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney(total, "¥") + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney(totalUnPay, "¥") + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney(smallChange, "¥") + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney((total + smallChange), "¥") + '</td>' +
								'</tr>');
	}else{
		listObj.append('<tr>' + 
									'<td class="reference-td">合计</td>' + 
									'<td class="reference-td"></td>' +
									'<td class="reference-td"></td>' +
									'<td class="reference-td"></td>' +
									'<td class="reference-td"></td>' +
									'<td class="reference-td"></td>' +
									'<td class="reference-td"></td>' +
									'<td class="reference-td">' + totalNum + '</td>' +
									'<td class="reference-td"></td>' +
									'<td class="reference-td">' + accounting.formatMoney(total + smallChange, "¥") + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney(smallChange, "¥") + '</td>' +
									'<td class="reference-td">' + accounting.formatMoney((total + smallChange), "¥") + '</td>' +
								'</tr>');
	}
			
	//写入汇总
	totalObj.text("合计：" + accounting.formatMoney(total + smallChange, "¥"));
	unPayObj.text("未支付金额：" + accounting.formatMoney(totalUnPay, "¥"));
	smallChangeObj.text("抹零金额：" + accounting.formatMoney(smallChange, "¥"));
}
