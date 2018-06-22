//业务模块全局配置
var itp = {}

/**###########################################################################
 * 地图相关 begin
 * ###########################################################################*/
//创建地图函数：  
itp.createMap = function(divMapContainer, defSize, defLocation){  
	var map = new BMap.Map(divMapContainer); 
	if($.utils.isEmpty(defLocation)) defLocation = '广州';
	if($.utils.isEmpty(defSize)) defSize = 12;
	map.centerAndZoom(defLocation, defSize);
	return map;
}

// 地图事件设置函数：
itp.setMapEvent = function(map) {
	map.enableDragging();// 启用地图拖拽事件，默认启用(可不写)
	// map.enableScrollWheelZoom();//启用地图滚轮放大缩小
	map.enableDoubleClickZoom();// 启用鼠标双击放大，默认启用(可不写)
	map.enableKeyboard();// 启用键盘上下左右键移动地图
}  

//添加地图控件
itp.addMapControl = function(map) {
	//向地图中添加缩放控件  
	var ctrlNav = new BMap.NavigationControl({
		anchor : BMAP_ANCHOR_TOP_LEFT,
		type : BMAP_NAVIGATION_CONTROL_LARGE
	});
	map.addControl(ctrlNav);
	//向地图中添加缩略图控件  
	var ctrlOve = new BMap.OverviewMapControl({
		anchor : BMAP_ANCHOR_BOTTOM_RIGHT,
		isOpen : 1
	});
	map.addControl(ctrlOve);
	//向地图中添加比例尺控件  
	var ctrlSca = new BMap.ScaleControl({
		anchor : BMAP_ANCHOR_BOTTOM_LEFT
	});
	map.addControl(ctrlSca);
	//添加带有定位的导航控件
	var navigationControl = new BMap.NavigationControl({
		// 靠左上角位置
		anchor : BMAP_ANCHOR_TOP_LEFT,
		// LARGE类型
		type : BMAP_NAVIGATION_CONTROL_LARGE,
		// 启用显示定位
		enableGeolocation : true
	});
	map.addControl(navigationControl);
	//添加定位控件
	var geolocationControl = new BMap.GeolocationControl();
	geolocationControl.addEventListener("locationSuccess", function(e) {
		// 定位成功事件
		var address = '';
		address += e.addressComponent.province;
		address += e.addressComponent.city;
		address += e.addressComponent.district;
		address += e.addressComponent.street;
		address += e.addressComponent.streetNumber;
		top.app.message.notice("当前定位地址为：" + address);
	});
	geolocationControl.addEventListener("locationError", function(e) {
		top.app.message.notice("定位失败：" + e.message);
	});
	map.addControl(geolocationControl);
}
/**###########################################################################
 * 地图相关 end
 * ###########################################################################*/


/**###########################################################################
 * table 图片预览相关 begin
 * ###########################################################################*/
itp.onMouseOverImage = function(event, image){
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

itp.onMouseOutImage = function(){
	$("#tooltip").remove();
}
/**###########################################################################
 * table 图片预览相关 end
 * ###########################################################################*/

//获取用户所属的商家ID
itp.getUserMerchantsId = function(){
	if(top.app.hasRole('系统管理员')) return '';
	else{
		if($.utils.isNull(top.app.info.extraInfo) || $.utils.isNull(top.app.info.extraInfo.merchantsId)){
			var merchantsId = "";
			$.ajax({
				url: top.app.conf.url.apigateway + "/api/itp/merchants/getUserMerchantsId",
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

//获取折扣后的结果
itp.getDicount = function(val){
	var discount = $.trim(val);
	if(discount != "" && !isNaN(discount)) discount = parseInt(discount);
	if(discount == 0) discount = 1;
	else if(discount < 10) discount = discount / 10;
	else discount = discount / 100;
	return discount;
}

/**
 * 获取分店下拉内容
 */
itp.getShopPullDown = function(divObj, merchantsId, isAll){
	//获取分店下拉列表
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/merchants/getShopKeyVal",
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
itp.getVenderPullDown = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/base/getVenderInfoList",
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

/**
 * 获取运输方式
 */
itp.getTransportList = function(divObj, merchantsId, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/itp/base/getTransportInfoList",
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
