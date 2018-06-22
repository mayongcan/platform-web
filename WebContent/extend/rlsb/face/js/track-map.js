var g_map = null, g_rows = null, g_params = null;
$(function () {
	top.app.message.loading();
	g_map = createMap("map-container");//创建地图  
	setMapEvent(g_map);//设置地图事件  
	addMapControl(g_map);//向地图添加控件  
    
});

/**
 * 获取从父窗口传送过来的值
 * 
 * @param value
 */
function receiveParams(value) {
	g_params = value;

    setTimeout(function () {
    		initData();
    }, 1000);
}

function initData(){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/extend/rlsb/face/track/getList",
	    method: 'GET',
	    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
            size: 50,   								// 页面大小
            page: 0,  								// 当前页
            faceId: g_params.row.id
	    },
	    success: function(data){
			top.app.message.loadingClose();
	    		if(top.app.message.code.success == data.RetCode){
	    			g_rows = data.rows;
    				var icon = new BMap.Icon("/extend/img/icon-red-location-min.png", new BMap.Size(24, 24))  
	    			//获取经纬度并显示在地图上
	    			for(var i = 0; i < g_rows.length; i++){
	    				var point = new BMap.Point(g_rows[i].createLg, g_rows[i].createLa); 
	    				if(i == 0){
	    					//定位到第一个点上
	    					g_map.panTo(point);
	    				}
	    				var marker = new BMap.Marker(point,{icon: icon}); 
	    				if(!$.utils.isNull(g_rows[i].createDate)) {
	    					var labelLeft = g_rows[i].createDate.length;
		    				var label = new BMap.Label(g_rows[i].createDate, {offset: new BMap.Size(-(labelLeft * 3.2), -40), position: point});  
		    	          	label.setStyle({  
		    	          		 color : "#fff",
		    	          		 backgroundColor:'red',
		    	          		 borderRadius:'5px',
		    	          		 padding: '0px 5px',
			    	    			 fontSize : "12px",
			    	    			 height : "20px",
			    	    			 lineHeight : "20px",
			    	    			 cursor:"pointer",
		    	          	});  
		    				g_map.addOverlay(label);   
	    				}
	    				g_map.addOverlay(marker); 
	    				//添加点击事件
	    				(function(){  
                        var index = i;  
                        var _marker = marker;  
                        var _label = label;  
                        _marker.addEventListener("click",function(){  
                        		getInfo(index);  
                        });  
                        _label.addEventListener("click",function(){  
	                    		getInfo(index);  
	                    });  
                    })()  
	    			}
	   		}
		},
	});
}


function getInfo(index){  
	
}  



/**###########################################################################
 * 地图相关
 * ###########################################################################
 */
//创建地图函数：  
createMap = function(divMapContainer, defSize, defLocation){  
	var map = new BMap.Map(divMapContainer); 
	if($.utils.isEmpty(defLocation)) defLocation = '广州';
	if($.utils.isEmpty(defSize)) defSize = 12;
	map.centerAndZoom(defLocation, defSize);
	return map;
}

// 地图事件设置函数：
setMapEvent = function(map) {
	map.enableDragging();// 启用地图拖拽事件，默认启用(可不写)
	// map.enableScrollWheelZoom();//启用地图滚轮放大缩小
	map.enableDoubleClickZoom();// 启用鼠标双击放大，默认启用(可不写)
	map.enableKeyboard();// 启用键盘上下左右键移动地图
}  

//添加地图控件
addMapControl = function(map) {
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