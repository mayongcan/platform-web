var g_params = null, g_backUrl = "";
var g_imagePath = null;
var g_comboBoxTree = null;
var g_selectColor = [], g_selectSize = [], g_selectTexture = [];
var g_morePriceIndex = 0, g_morePrice = [], g_morePriceTotal = 0;
var g_moreDiscountIndex = 0, g_moreDiscount = [], g_moreDiscountTotal = 0;
var g_goodsPhotoList = [];

$(function () {
	//启动验证隐藏字段
	$.validator.setDefaults({ignore: []});
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initGoodsColor();
	initGoodsSize();
	initGoodsTexture();
	loadExtraPrice();
	loadExtraDiscount();
	initView();
	initData();
	formValidate();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});

function loadExtraPrice(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsExtraPriceList",
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
					judgeDisplayPrice();
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

function loadExtraDiscount(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/goods/getGoodsExtraDiscountList",
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
					judgeDisplayDiscount();
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

function initView(){
	// 创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.isOpenFirst = false;
	g_comboBoxTree.init($('#categoryId'), g_params.allTreeData, '100%');
	itp.getVenderPullDown($("#venderId"), itp.getUserMerchantsId(), true, " ");
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
	top.app.addRadioButton($("#divGoodsYear"), g_params.goodsYearDict, 'radioGoodsYear');
	top.app.addRadioButton($("#divGoodsSeason"), g_params.goodsSeasonDict, 'radioGoodsSeason');
	//添加更多价格
	$('#btnAddMorePrice').click(function () {
		addMorePrice("", "");
		judgeDisplayPrice();
    });
	//添加更多折扣
	$('#btnAddMoreDiscount').click(function () {
		addMoreDiscount("", "");
		judgeDisplayDiscount();
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

function addMorePrice(extraName, extraPrice){
	var html = '<tr id="trMorePriceSet' + g_morePriceIndex + '">' +
					'<td class="reference-td">' +
						'<input type="text" id="morePriceKey' + g_morePriceIndex + '" name="morePriceKey' + g_morePriceIndex + '" class="form-control" value="' + extraName + '">' +
					'</td>' +
					'<td class="reference-td">' +
						'<div class="input-group">' + 
							'<span class="input-group-addon">¥</span>' + 
							'<input type="text" id="morePriceVal' + g_morePriceIndex + '" name="morePriceVal' + g_morePriceIndex + '" class="form-control" value="' + extraPrice + '" placeholder="0.00">' +
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

function addMoreDiscount(extraName, extraDiscount){
	var html = '<tr id="trMoreDiscountSet' + g_moreDiscountIndex + '">' +
					'<td class="reference-td">' +
						'<input type="text" id="moreDiscountKey' + g_moreDiscountIndex + '" name="moreDiscountKey' + g_moreDiscountIndex + '" class="form-control" value="' + extraName + '">' +
					'</td>' +
					'<td class="reference-td">' +
						'<input type="text" id="moreDiscountVal' + g_moreDiscountIndex + '" name="moreDiscountVal' + g_moreDiscountIndex + '" class="form-control" value="' + extraDiscount + '">' +
					'</td>' +
					'<td class="reference-td">' +
					   	'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="removeMoreDiscount(' + g_moreDiscountIndex + ')">' +
							'<i class="glyphicon glyphicon-trash" aria-hidden="true"></i> 删除 ' +
					  	'</button>' +
					'</td>' +
				'</tr>' + 
				'<script>g_moreDiscount[' + g_moreDiscountIndex + '] = new Cleave("#moreDiscountVal' + g_moreDiscountIndex + '", {numeral: true,numeral: true,numeralIntegerScale: 2, numeralDecimalScale:2});</script> ';
	$('#tbodyMoreDiscount').append(html);
	g_moreDiscountIndex++;
	g_moreDiscountTotal++;
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

//空函数，选择规格是不进行操作
function loadGenInventoryInfo(){
	
}

function initData(){
	g_comboBoxTree.setValueById(g_params.row.categoryId, 300);
	$('#goodsName').val(g_params.row.goodsName);
	$("#goodsSerialNum").val(g_params.row.goodsSerialNum);
	$("#venderId").val(g_params.row.venderId);
	$("#salePrice").val(g_params.row.salePrice);
	$("#purchasePrice").val(g_params.row.purchasePrice);
	$("#defDiscount").val(g_params.row.defDiscount);
	$("#packingNum").val(g_params.row.packingNum);
	top.app.addRadioButton($("#divGoodsYear"), g_params.goodsYearDict, 'radioGoodsYear', g_params.row.goodsYear);
	top.app.addRadioButton($("#divGoodsSeason"), g_params.goodsSeasonDict, 'radioGoodsSeason', g_params.row.goodsSeason);
	var stat = false;
	if(g_params.row.buyStatus == '1') stat = true;
	$('#buyStatus').prop("checked", stat);
	stat = false;
	if(g_params.row.shelfStatus == '1') stat = true;
	$('#shelfStatus').prop("checked", stat);
	$("#goodsDesc").val(g_params.row.goodsDesc);
	
	var previewImg = [], previewConfig = [];
	if(!$.utils.isEmpty(g_params.row.goodsPhoto)){
		g_goodsPhotoList = g_params.row.goodsPhoto.split(",");
		for(var i = 0; i < g_goodsPhotoList.length; i++){
			if($.utils.isEmpty(g_goodsPhotoList[i])) continue;
			previewImg.push(top.app.conf.url.res.url + g_goodsPhotoList[i]);
			var conf = {};
			conf.key = g_goodsPhotoList[i];
			previewConfig.push(conf);
		}
	} 
	
	//初始化图片选择器
	$("#goodsPhoto").fileinput({
        showUpload: false,
        dropZoneEnabled: false,
        msgPlaceholder: '若不需要修改，请留空...',
        initialPreview: previewImg,
        initialPreviewConfig: previewConfig, 
        initialPreviewAsData: true,
        deleteLocal: true,			//自定义参数，是否进行本地删除
        overwriteInitial: false,
        fileActionSettings:{
        	showUpload: false,
        },
		uploadUrl: top.app.conf.url.res.url,			//需要这个参数，才能显示删除按钮
        language: 'zh',
        maxFileCount: 10,
    });
	//删除单个图片事件
	$('#goodsPhoto').on('filedeleted', function(event, key, jqXHR, data) {
	    for(var i = 0; i < g_goodsPhotoList.length; i++){
	    	if(g_goodsPhotoList[i] == key){
		    	g_goodsPhotoList.splice(i, 1);
		    	break;
	    	}
	    }
	});
    //清理所有图片事件
	$('#goodsPhoto').on('filecleared', function(event) {
		g_goodsPhotoList = [];
	});
	
	//显示选择的商品规格
	if(!$.utils.isEmpty(g_params.row.colorIdList)){
		var arrayId = g_params.row.colorIdList.split(",");
		var arrayName = g_params.row.colorNameList.split(",");
		for(var i = 0; i < arrayId.length; i++){
			selectColor(arrayId[i], arrayName[i]);
		}
	}
	if(!$.utils.isEmpty(g_params.row.textureIdList)){
		var arrayId = g_params.row.textureIdList.split(",");
		var arrayName = g_params.row.textureNameList.split(",");
		for(var i = 0; i < arrayId.length; i++){
			selectTexture(arrayId[i], arrayName[i]);
		}
	}
	if(!$.utils.isEmpty(g_params.row.sizeIdList)){
		var arrayId = g_params.row.sizeIdList.split(",");
		var arrayName = g_params.row.sizeNameList.split(",");
		for(var i = 0; i < arrayId.length; i++){
			selectSize(arrayId[i], arrayName[i]);
		}
	}
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
        	ajaxUploadImage();
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
	if(g_params.type == "edit")
		submitData["id"] = g_params.row.id;

	submitData["merchantsId"] = itp.getUserMerchantsId();
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
	submitData["modifyMemo"] = $("#modifyMemo").val();
	//进行排序
	g_selectColor = g_selectColor.sort($.utils.objArrayCompare("id"));
	g_selectTexture = g_selectTexture.sort($.utils.objArrayCompare("id"));
	g_selectSize = g_selectSize.sort($.utils.objArrayCompare("id"));

	//获取选择的规格列表
	var colorIdList = "", colorNameList = "", sizeIdList = "", sizeNameList = "", textureIdList = "", textureNameList = "";
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
	for(var i = 0;i < g_selectTexture.length; i++){
		textureIdList += g_selectTexture[i].id + ",";
		textureNameList += g_selectTexture[i].name + ",";
	}	
	if(textureIdList != '') textureIdList = textureIdList.substring(0, textureIdList.length - 1);
	if(textureNameList != '') textureNameList = textureNameList.substring(0, textureNameList.length - 1);
	submitData["textureIdList"] = textureIdList;
	submitData["textureNameList"] = textureNameList;
	if(colorIdList != g_params.row.colorIdList || sizeIdList != g_params.row.sizeIdList || textureIdList != g_params.row.textureIdList){
		submitData["inventoryIsChange"] = "change";
	}

	//额外价格表json列表
	submitData["extraPriceList"] = JSON.stringify(getMorePriceDataList());
	submitData["extraDiscountList"] = JSON.stringify(getMoreDiscountDataList());
	
	//转换图片列表
	var imageList = "";
	for(var i = 0; i < g_goodsPhotoList.length; i++){
		imageList += g_goodsPhotoList[i] + ",";
	}
	if(imageList != "") imageList = imageList.substring(0, imageList.length - 1);
	submitData["goodsPhoto"] = imageList;	
	if(g_imagePath != null && g_imagePath != undefined)
		submitData["goodsPhoto"] = imageList + "," + g_imagePath;
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

function ajaxUploadImage(){
	var inventoryPass = false;
	if(g_selectColor.length == 0 && g_selectTexture.length == 0 && g_selectSize.length == 0) inventoryPass = true;
	if(g_selectColor.length > 0 && g_selectTexture.length > 0 && g_selectSize.length > 0) inventoryPass = true;
	if(!inventoryPass){
		top.app.message.notice("商品库存中的规格不能留空！");
		return ;
	}
	if($("#goodsPhoto")[0].files[0] == null || $("#goodsPhoto")[0].files[0] == undefined){
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadMultiImage($("#goodsPhoto")[0].files, function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}
