var g_params = {}, g_iframeIndex = null;
var g_map = null, g_mapGeoc = null;
var g_longitude = "", g_latitude = "";

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
	g_map = itp.createMap("map-container");//创建地图  
	itp.setMapEvent(g_map);//设置地图事件  
	itp.addMapControl(g_map);//向地图添加控件  
	g_mapGeoc = new BMap.Geocoder();  
	addMapSearch();
	//设置鼠标样式
	g_map.setDefaultCursor("url('bird.cur')");  
	//单击获取点击的经纬度
	g_map.addEventListener("click",function(e){
		g_longitude = e.point.lng;
		g_latitude = e.point.lat;

		g_map.clearOverlays(); // 清除地图上所有覆盖物
		g_map.addOverlay(new BMap.Marker(e.point)); // 添加标注
	});

	//坐标定位
	if(!$.utils.isEmpty(g_params.longitude) && !$.utils.isEmpty(g_params.latitude)){
		var point = new BMap.Point(g_params.longitude,g_params.latitude); 
		g_map.addOverlay(new BMap.Marker(point)); 	//添加标注
		setTimeout(function () {
			g_map.panTo(point);     				//跳转
	    }, 1000);
	}
}


//添加地图模糊搜索
function addMapSearch() {
	var ac = new BMap.Autocomplete({ // 建立一个自动完成的对象
		"input" : "address",
		"location" : g_map
	});
	ac.addEventListener("onhighlight", function(e) { // 鼠标放在下拉列表上的事件
		var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		document.getElementById("searchResultPanel").innerHTML = str;
	});

	ac.addEventListener("onconfirm", function(e) { // 鼠标点击下拉列表后的事件
		var _value = e.item.value;
		g_searchVal = _value.province + _value.city + _value.district + _value.street + _value.business;
		document.getElementById("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + g_searchVal;
		setPlace();
	});
}

function setPlace() {
	g_map.clearOverlays(); // 清除地图上所有覆盖物
	var local = new BMap.LocalSearch(g_map, { // 智能搜索
		onSearchComplete : function() {
			var pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
			g_map.centerAndZoom(pp, 12);
			g_map.addOverlay(new BMap.Marker(pp)); // 添加标注
			//将坐标写入经纬度
			g_longitude = pp.lng;
			g_latitude = pp.lat;
		}
	});
	local.search(g_searchVal);
}

/**
 * 提交数据
 */
function submitAction(){
	if($.utils.isEmpty(g_longitude) || $.utils.isEmpty(g_latitude)){
		top.app.message.notice("请选择经纬度！");
		return;
	}
	var rowObj = [];
	rowObj.longitude = g_longitude;
	rowObj.latitude = g_latitude;
	parent.app.layer.retParams = [];
	parent.app.layer.retParams.push(rowObj);

	//关闭页面前设置结果
	parent.app.layer.editLayerRet = true;
	parent.layer.close(g_iframeIndex);
}