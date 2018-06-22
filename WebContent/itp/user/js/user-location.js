var g_params = {}, g_iframeIndex = null;
var g_map = null, g_mapGeoc = null;
var g_longitude = "", g_latitude = "";

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
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
	g_map = itp.createMap("map-container");//创建地图  
	itp.setMapEvent(g_map);//设置地图事件  
	itp.addMapControl(g_map);//向地图添加控件  
	g_mapGeoc = new BMap.Geocoder();  
	//坐标定位
	if(!$.utils.isEmpty(g_params.longitude) && !$.utils.isEmpty(g_params.latitude)){
		var point = new BMap.Point(g_params.longitude,g_params.latitude); 
		g_map.addOverlay(new BMap.Marker(point)); 	//添加标注
		setTimeout(function () {
			g_map.panTo(point);     				//跳转
	    }, 1000);
	}
}
