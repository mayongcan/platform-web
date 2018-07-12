var g_params = null, g_backUrl = "";
var g_comboBoxTree = null;
var g_morePriceIndex = 0, g_morePrice = [], g_morePriceTotal = 0;
var g_moreDiscountIndex = 0, g_moreDiscount = [], g_moreDiscountTotal = 0;

$(function () {
	//启动验证隐藏字段
	$.validator.setDefaults({ignore: []});
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	getShopList();
	initGoodsColor();
	initGoodsSize();
	initView();
	formValidate();
	top.app.message.loadingClose();
});


function initView(){
	// 创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.isOpenFirst = false;
	g_comboBoxTree.init($('#categoryId'), g_params.allTreeData, '100%');
	scms.getVenderPullDown($("#venderId"), scms.getUserMerchantsId(), true, " ");
	scms.getTexturePullDown($("#goodsTexture"), scms.getUserMerchantsId(), false);
	g_salePrice = new Cleave('#salePrice', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
	g_purchasePrice = new Cleave('#purchasePrice', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
	g_defDiscount = new Cleave('#defDiscount', {
	    numeral: true,
	    numeralIntegerScale: 2,
	    numeralDecimalScale: 0
	});
	g_packingNum = new Cleave('#packingNum', {
	    numeral: true,
	    numeralDecimalScale: 0
	});
	//初始化文件选择器
	fileupload.initFileNewSelector('goodsPhoto');
	top.app.addRadioButton($("#divGoodsYear"), g_params.goodsYearDict, 'radioGoodsYear');
	top.app.addRadioButton($("#divGoodsSeason"), g_params.goodsSeasonDict, 'radioGoodsSeason');
	//系统生成货号
	$('#btnGenGoodsSerialNum').click(function () {
		$("#goodsSerialNum").val("G" + $.date.dateFormat(new Date(), 'yyyyMMddhhmmss'));
    });
	//添加更多价格
	$('#btnAddMorePrice').click(function () {
		var html = '<tr id="trMorePriceSet' + g_morePriceIndex + '">' +
						'<td class="reference-td">' +
							'<input type="text" id="morePriceKey' + g_morePriceIndex + '" name="morePriceKey' + g_morePriceIndex + '" class="form-control">' +
						'</td>' +
						'<td class="reference-td">' +
							'<div class="input-group">' + 
								'<span class="input-group-addon">¥</span>' + 
								'<input type="text" id="morePriceVal' + g_morePriceIndex + '" name="morePriceVal' + g_morePriceIndex + '" class="form-control" placeholder="0.00">' +
							'</div>' + 
						'</td>' +
						'<td class="reference-td">' +
						   	'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="removeMorePrice(' + g_morePriceIndex + ')">' +
								'<i class="glyphicon glyphicon-trash" aria-hidden="true"></i> 删除 ' +
						  	'</button>' +
						'</td>' +
					'</tr>' + 
					'<script>g_morePrice[' + g_morePriceIndex + '] = new Cleave("#morePriceVal' + g_morePriceIndex + '", {numeral: true,numeralThousandsGroupStyle: "thousand"});</script> ';
		$('#tbodyMorePrice').append(html);
		g_morePriceIndex++;
		g_morePriceTotal++;
		judgeDisplayPrice()
    });

	//添加更多折扣
	$('#btnAddMoreDiscount').click(function () {
		var html = '<tr id="trMoreDiscountSet' + g_moreDiscountIndex + '">' +
						'<td class="reference-td">' +
							'<input type="text" id="moreDiscountKey' + g_moreDiscountIndex + '" name="moreDiscountKey' + g_moreDiscountIndex + '" class="form-control">' +
						'</td>' +
						'<td class="reference-td">' +
							'<input type="text" id="moreDiscountVal' + g_moreDiscountIndex + '" name="moreDiscountVal' + g_moreDiscountIndex + '" class="form-control">' + 
						'</td>' +
						'<td class="reference-td">' +
						   	'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="removeMoreDiscount(' + g_moreDiscountIndex + ')">' +
								'<i class="glyphicon glyphicon-trash" aria-hidden="true"></i> 删除 ' +
						  	'</button>' +
						'</td>' +
					'</tr>' + 
					'<script>g_moreDiscount[' + g_moreDiscountIndex + '] = new Cleave("#moreDiscountVal' + g_moreDiscountIndex + '", {numeral: true,numeralIntegerScale: 2, numeralDecimalScale:2});</script> ';
		$('#tbodyMoreDiscount').append(html);
		g_moreDiscountIndex++;
		g_moreDiscountTotal++;
		judgeDisplayDiscount()
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

function removeMorePrice(index){
	g_morePriceTotal--;
	$('#trMorePriceSet' + index).remove();
	judgeDisplayPrice();
}

function judgeDisplayPrice(){
	if(g_morePriceTotal > 0){
		$('#tableMorePrice').css('display', '');
	}else{
		$('#tableMorePrice').css('display', 'none');
	}
}

function removeMoreDiscount(index){
	g_moreDiscountTotal--;
	$('#trMoreDiscountSet' + index).remove();
	judgeDisplayDiscount();
}

function judgeDisplayDiscount(){
	if(g_moreDiscountTotal > 0){
		$('#tableMoreDiscount').css('display', '');
	}else{
		$('#tableMoreDiscount').css('display', 'none');
	}
}

//加载生成库存输入框
function loadGenInventoryInfo(){
	//动态生成table内容
	$('#tbodyGenInventory').empty();
	if(g_selectColor.length == 0 && g_selectSize.length == 0) {
		$('#divTotalStat').css('display', 'none');
		return; 
	}
	$('#divTotalStat').css('display', '');
	$('#divTotalStatNotice').text('');
	if(g_selectColor.length == 0) $('#divTotalStatNotice').text('(请选择商品颜色)');
	else if(g_selectSize.length == 0) $('#divTotalStatNotice').text('(请选择商品尺寸)');
	//首先生成表格头
	var tableHeader = '<tr>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">店铺</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品颜色</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品尺寸</td>' + 
							'<td class="reference-td" style="font-weight:bold;line-height:20px;">商品库存</td>' + 
						'</tr>';
	$('#tbodyGenInventory').append(tableHeader);
	var tableContent = ""; 
	var colorLength = g_selectColor.length == 0 ? 1 : g_selectColor.length, 
		sizeLength = g_selectSize.length == 0 ? 1 : g_selectSize.length;
	var shopRowSpan = 1, colorRowSpan = 1, sizeRowSpan = 1;
	colorRowSpan = sizeRowSpan * sizeLength;
	shopRowSpan = colorRowSpan * colorLength;
	//生成内容
	for(var shopIndex = 0; shopIndex < g_shopList.length; shopIndex++){
		tableContent += '<tr>' + 
							'<td class="reference-td" rowspan="' + shopRowSpan + '" style="line-height:20px;">' + 
								g_shopList[shopIndex].NAME + 
							'</td>'; 
		for(var colorIndex = 0; colorIndex < colorLength; colorIndex++){
			tableContent += '<td class="reference-td" rowspan="' + colorRowSpan + '" style="line-height:20px;">' + 
								getDataListValue(g_selectColor, colorIndex) + 
							'</td>'; 
			//获取尺寸层
			for(var sizeIndex = 0; sizeIndex < sizeLength; sizeIndex++){
				var selColorId = getDataListId(g_selectColor, colorIndex), selSizeId = getDataListId(g_selectSize, sizeIndex);
				var tmpId = "_" + g_shopList[shopIndex].ID + "_" + selColorId + "_" + selSizeId;
				tableContent += '<td class="reference-td" style="line-height:20px;">' + 
									getDataListValue(g_selectSize, sizeIndex) + 
								'</td>' + 
								'<td class="reference-td" style="line-height:20px;">' + 
									'<div class="input-group" style="width:150px;float:left;margin-right:10px">' + 
										'<span class="input-group-addon" style="font-size:12px;">数量</span>' + 
									   	'<input id="num' + tmpId + '" type="text" class="form-control" value="0" style="font-size:12px;">' + 
							        '</div>' + 
							        '<div class="input-group" style="min-width:120px;">' + 
										'<span class="input-group-addon" style="font-size:12px;">条码</span>' + 
									   	'<input id="barcode' + tmpId + '" type="text" class="form-control" style="font-size:12px;">' + 
							        '</div>' + 
								'</td>' + 
								'<script>new Cleave("#num' + tmpId + '", {numeral: true,numeralThousandsGroupStyle: "none",numeralIntegerScale: 5,numeralDecimalScale: 0});</script> ' +
							'</tr>'; 
			}
		}
	}
	$('#tbodyGenInventory').append(tableContent);
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

function getMorePriceDataList(){
	var dataList = [];
	for(var i = 0; i <= g_morePriceIndex; i++){
		var obj = new Object();
		if(document.getElementById("morePriceKey" + i)){
			obj.extraName = $('#morePriceKey' + i).val();
			obj.extraPrice = g_morePrice[i].getRawValue();
			if(obj.extraName == null || obj.extraName == undefined || obj.extraName == '') continue;
			dataList.push(obj);
		}
	}
	return dataList;
}

function getMoreDiscountDataList(){
	var dataList = [];
	for(var i = 0; i <= g_moreDiscountIndex; i++){
		var obj = new Object();
		if(document.getElementById("moreDiscountKey" + i)){
			obj.extraName = $('#moreDiscountKey' + i).val();
			obj.extraDiscount = g_moreDiscount[i].getRawValue();
			if(obj.extraName == null || obj.extraName == undefined || obj.extraName == '') continue;
			dataList.push(obj);
		}
	}
	return dataList;
}

function getGoodsInventoryResult(){
	var dataList = [];
	//获取数量等内容
	for(var shopIndex = 0; shopIndex < g_shopList.length; shopIndex++){
		for(var colorIndex = 0; colorIndex < g_selectColor.length; colorIndex++){
			for(var sizeIndex = 0; sizeIndex< g_selectSize.length; sizeIndex++){
				var tmpId = "_" + g_shopList[shopIndex].ID + "_" + g_selectColor[colorIndex].id + "_" + g_selectSize[sizeIndex].id;
				if(document.getElementById("num" + tmpId)){
					var obj = new Object();
					obj.shopId = g_shopList[shopIndex].ID;
					obj.colorId = g_selectColor[colorIndex].id;
					obj.colorName = g_selectColor[colorIndex].name;
					obj.inventorySizeId = g_selectSize[sizeIndex].id;
					obj.inventorySize = g_selectSize[sizeIndex].name;
					obj.inventoryNum = $('#num' + tmpId).val();
					obj.goodsBarcode = $('#barcode' + tmpId).val();
					dataList.push(obj);
				}
			}
		}
	}
	return dataList;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	goodsName: {required: true},
        	goodsSerialNum: {required: true},
        	salePrice: {required: true},
        	purchasePrice: {required: true},
        },
        messages: {
        },
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
                return false;
            });  
        },
        //失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
        	//上传图片
        	fileupload.uploadAction(function(){
        		var inventoryPass = false;
        		if(g_selectColor.length == 0 && g_selectSize.length == 0) inventoryPass = true;
        		if(g_selectColor.length > 0 && g_selectSize.length > 0) inventoryPass = true;
        		if(!inventoryPass){
        			top.app.message.notice("商品库存中的规格不能留空！");
        			return false;
        		}
        		return true;
        	}, true, true, null, function(){submitAction();});
        }
    });
}

/**
 * 提交数据
 * @returns
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	submitData["merchantsId"] = scms.getUserMerchantsId();
	submitData["categoryId"] = g_comboBoxTree.getNodeId();
	submitData["goodsName"] = $('#goodsName').val();
	submitData["goodsSerialNum"] = $("#goodsSerialNum").val();
	submitData["venderId"] = $("#venderId").val();
	submitData["salePrice"] = $("#salePrice").val();
	submitData["purchasePrice"] = $("#purchasePrice").val();
	submitData["defDiscount"] = $("#defDiscount").val();
	submitData["packingNum"] = $("#packingNum").val();
	submitData["goodsYear"] = $('#divGoodsYear input:radio:checked').val()
	submitData["goodsSeason"] = $('#divGoodsSeason input:radio:checked').val();
	submitData["buyStatus"] = $('#buyStatus').prop('checked') ? '1' : '2';
	submitData["shelfStatus"] = $('#shelfStatus').prop('checked') ? '1' : '2';
	submitData["goodsDesc"] = $("#goodsDesc").val();
	submitData["goodsTexture"] = $("#goodsTexture").val();

	//获取选择的规格列表
	var colorIdList = "", colorNameList = "", sizeIdList = "", sizeNameList = "";
	for(var i = 0;i < g_selectColor.length; i++){
		colorIdList += g_selectColor[i].id + ",";
		colorNameList += g_selectColor[i].name + ",";
	}	
	if(colorIdList != '') colorIdList = colorIdList.substring(0, colorIdList.length - 1);
	if(colorNameList != '') colorNameList = colorNameList.substring(0, colorNameList.length - 1);
	submitData["colorIdList"] = colorIdList;
	submitData["colorNameList"] = colorNameList;
	for(var i = 0;i < g_selectSize.length; i++){
		sizeIdList += g_selectSize[i].id + ",";
		sizeNameList += g_selectSize[i].name + ",";
	}	
	if(sizeIdList != '') sizeIdList = sizeIdList.substring(0, sizeIdList.length - 1);
	if(sizeNameList != '') sizeNameList = sizeNameList.substring(0, sizeNameList.length - 1);
	submitData["sizeIdList"] = sizeIdList;
	submitData["sizeNameList"] = sizeNameList;
	
	//额外价格表json列表
	submitData["extraPriceList"] = JSON.stringify(getMorePriceDataList());
	//额外折扣表json列表
	submitData["extraDiscountList"] = JSON.stringify(getMoreDiscountDataList());
	
	//获取json格式
	submitData["goodsInventoryList"] = JSON.stringify(getGoodsInventoryResult());
	submitData["goodsPhoto"] = fileupload.getUploadFilePath();
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