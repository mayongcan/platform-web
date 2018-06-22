$(function () {
	//返回
	$("#layerCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "goods.html?_pid=" + pid;
    });
	//设置内容
	
	if(top.app.info.iframe.params != null && top.app.info.iframe.params != undefined && 
			top.app.info.iframe.params.rows != null && top.app.info.iframe.params.rows != undefined){
		$('#goodsName').text(top.app.info.iframe.params.rows.goodsName);
		$('#merchantName').text(top.app.info.iframe.params.rows.merchantName);
		$('#catName').text(top.app.info.iframe.params.rows.catName);
		$('#brandName').text(top.app.info.iframe.params.rows.brandName);
		$('#goodsType').text(tableFormatType(top.app.info.iframe.params.rows.goodsType));
		$('#areaName').text(top.app.info.iframe.params.rows.areaName);
		$('#longitude').text(top.app.info.iframe.params.rows.longitude);
		$('#latitude').text(top.app.info.iframe.params.rows.latitude);
		$('#tel').text(top.app.info.iframe.params.rows.tel);
		$('#brief').text(top.app.info.iframe.params.rows.brief);
		$('#goodsDesc').text(top.app.info.iframe.params.rows.goodsDesc);
		showThumbnail($('#goodsImg'), top.app.info.iframe.params.rows.goodsImg, "goodsImg");
		showThumbnail($('#goodsAlbum'), top.app.info.iframe.params.rows.goodsAlbum, "goodsAlbum");
		$('#clickCount').text(top.app.info.iframe.params.rows.clickCount);
		$('#minPrice').text(top.app.info.iframe.params.rows.minPrice);
		$('#maxCommission').text(top.app.info.iframe.params.rows.maxCommission);
		$('#maxRabate').text(top.app.info.iframe.params.rows.maxRabate);
		$('#goodsStat').text(tableFormatStatus(top.app.info.iframe.params.rows.goodsStat));
		$('#goodsSale').text(top.app.info.iframe.params.rows.goodsSale);
		$('#goodsParams').text(top.app.info.iframe.params.rows.goodsParams);
		$('#goodsService').text(top.app.info.iframe.params.rows.goodsService);
		$('#dispOrder').text(top.app.info.iframe.params.rows.dispOrder);
		$('#autoendDate').text(top.app.info.iframe.params.rows.autoendDate);
		$('#createDate').text(top.app.info.iframe.params.rows.createDate);
	}
});


function showThumbnail(divObj, image, name){
	if(divObj == null || divObj == undefined) return;
	if(image != null && image != undefined && image != ''){
		divObj.empty();
		var list = image.split(',');
		for(var i = 0; i < list.length; i++){
			if(list[i] == null || list[i] == undefined || list[i] == '') continue;
			var imgsrc = top.app.conf.url.res.url + list[i];
			divObj.append('<a href="' + imgsrc + '" data-fancybox data-caption="查看图片">\
								<img src="' + imgsrc + '" alt="" id="' + name + 'imgThumbnail' + i + '"/>\
							</a>\
						');
			$('#' + name + 'imgThumbnail' + i).jqthumb();
		}
		//初始化
		$("[data-fancybox]").fancybox({});
	}else{
		divObj.empty();
	}
}

/**
 * 格式化字典类型
 * @param value
 * @param row
 */
function tableFormatType(value) {
	var i = top.app.info.iframe.params.typeDict.length;
	while (i--) {
		if(top.app.info.iframe.params.typeDict[i].ID == value){
			return top.app.info.iframe.params.typeDict[i].NAME;
		}
	}
	return "未知";
}
function tableFormatStatus(value) {
	var i = top.app.info.iframe.params.statDict.length;
	while (i--) {
		if(top.app.info.iframe.params.statDict[i].ID == value){
			return top.app.info.iframe.params.statDict[i].NAME;
		}
	}
	return "未知";
}