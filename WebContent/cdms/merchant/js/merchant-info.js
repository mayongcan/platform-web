$(function () {
	//返回
	$("#layerCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "merchant.html?_pid=" + pid;
    });
	//设置内容
	
	if(top.app.info.iframe.params != null && top.app.info.iframe.params != undefined && 
			top.app.info.iframe.params.rows != null && top.app.info.iframe.params.rows != undefined){
		$('#prtnName').text(top.app.info.iframe.params.rows.prtnName);
		$('#industryName').text(top.app.info.iframe.params.rows.industryName);
		$('#prtnType').text(tableFormatType(top.app.info.iframe.params.rows.prtnType));
		$('#summary').text(top.app.info.iframe.params.rows.summary);
		$('#areaName').text(top.app.info.iframe.params.rows.areaName);
		$('#respMan').text(top.app.info.iframe.params.rows.respMan);
		$('#manSex').text(tableFormatSexDict(top.app.info.iframe.params.rows.manSex));
		$('#credentialsType').text(tableFormatCredentialsTypeDict(top.app.info.iframe.params.rows.credentialsType));
		$('#credentialsNum').text(top.app.info.iframe.params.rows.credentialsNum);
		showThumbnail($('#avatarImg'), top.app.info.iframe.params.rows.avatarImg, "avatarImg");
		showThumbnail($('#officeImg'), top.app.info.iframe.params.rows.officeImg, "officeImg");
		$('#website').text(top.app.info.iframe.params.rows.website);
		$('#accountWx').text(top.app.info.iframe.params.rows.accountWx);
		$('#accountQq').text(top.app.info.iframe.params.rows.accountQq);
		$('#address').text(top.app.info.iframe.params.rows.address);
		$('#zipCode').text(top.app.info.iframe.params.rows.zipCode);
		$('#telNbr').text(top.app.info.iframe.params.rows.telNbr);
		$('#mobNbr1').text(top.app.info.iframe.params.rows.mobNbr1);
		$('#mobNbr2').text(top.app.info.iframe.params.rows.mobNbr2);
		$('#scale').text(top.app.info.iframe.params.rows.scale);
		$('#artiPerson').text(top.app.info.iframe.params.rows.artiPerson);
		$('#regCapital').text(top.app.info.iframe.params.rows.regCapital);
		$('#busiLice').text(top.app.info.iframe.params.rows.busiLice);
		$('#reveNbr').text(top.app.info.iframe.params.rows.reveNbr);
		$('#mgrNbr').text(top.app.info.iframe.params.rows.mgrNbr);
		$('#signIntention').text(tableFormatSignDict(top.app.info.iframe.params.rows.signIntention));
		$('#memo').text(top.app.info.iframe.params.rows.memo);
		$('#businessScope').text(top.app.info.iframe.params.rows.businessScope);
		showThumbnail($('#logo'), top.app.info.iframe.params.rows.logo, "logo");
		$('#position').text(top.app.info.iframe.params.rows.position);
		$('#cooperationTypes').text(top.app.info.iframe.params.rows.cooperationTypes);
		$('#credit').text(top.app.info.iframe.params.rows.credit);
		$('#certificate').text(top.app.info.iframe.params.rows.certificate);
		showThumbnail($('#certificateImgs'), top.app.info.iframe.params.rows.certificateImgs, "certificateImgs");
		$('#bizStartTime').text(top.app.info.iframe.params.rows.bizStartTime);
		$('#ourMan').text(top.app.info.iframe.params.rows.ourMan);
		$('#ourPhone').text(top.app.info.iframe.params.rows.ourPhone);
		$('#qualitySum').text(top.app.info.iframe.params.rows.qualitySum);
		$('#qualityCount').text(top.app.info.iframe.params.rows.qualityCount);
		$('#serviceSum').text(top.app.info.iframe.params.rows.serviceSum);
		$('#serviceCount').text(top.app.info.iframe.params.rows.serviceCount);
		$('#creditMark').text(top.app.info.iframe.params.rows.creditMark);
		$('#commentCount').text(top.app.info.iframe.params.rows.commentCount);
		$('#scoreCount').text(top.app.info.iframe.params.rows.scoreCount);
		$('#stat').text(tableFormatStatus(top.app.info.iframe.params.rows.stat));
		$('#ourShow').text(top.app.info.iframe.params.rows.ourShow);
		$('#isShow').text(top.app.info.iframe.params.rows.isShow);
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
function tableFormatSignDict(value) {
	var i = top.app.info.iframe.params.signDict.length;
	while (i--) {
		if(top.app.info.iframe.params.signDict[i].ID == value){
			return top.app.info.iframe.params.signDict[i].NAME;
		}
	}
	return "未知";
}
function tableFormatSexDict(value) {
	var i = top.app.info.iframe.params.sexDict.length;
	while (i--) {
		if(top.app.info.iframe.params.sexDict[i].ID == value){
			return top.app.info.iframe.params.sexDict[i].NAME;
		}
	}
	return "未知";
}
function tableFormatCredentialsTypeDict(value) {
	var i = top.app.info.iframe.params.credentialsTypeDict.length;
	while (i--) {
		if(top.app.info.iframe.params.credentialsTypeDict[i].ID == value){
			return top.app.info.iframe.params.credentialsTypeDict[i].NAME;
		}
	}
	return "未知";
}