var g_map1 = null, g_map3 = null, g_firstLoad = true;; 
var g_knowData = [{name:'维多利广场站', tel:'T44063202020020', addr:'广州市天河区体育西路101号', freq:'418.1250Mhz', lg: '113.32732', la:'23.140782'},
	{name:'三新大厦台站', tel:'T250620141252', addr:'三新大厦黄埔大道西33号', freq:'418.4875MHz', lg: '113.324924', la:'23.134553'},
	{name:'方圆大厦台站', tel:'T440620161089', addr:'广州市天河区体育东路28号', freq:'419.0000MHz', lg: '113.335171', la:'23.135262'},
	{name:'创展中心台站', tel:'T440620153521', addr:'天河区体育东路108号', freq:'418.4875MHz', lg: '113.336417', la:'23.137719'},
	{name:'正佳广场台站', tel:'T440620152342', addr:'广州市天河区天河路228号', freq:'418.4875MHz', lg: '113.333474', la:'23.138659'}];
var g_unKnowData = [{freq:'418.1250Mhz', freqNum: 'Us-12', num: '1', sub: [{name:'维多利广场站', serviceRadius:'3', lg: '113.32732', la:'23.140782'}]},
	{freq:'418.4875MHz', freqNum: 'Us-12', num: '2', sub: [{name:'三新大厦台站', serviceRadius:'3', lg: '113.324924', la:'23.134553'}, {name:'方圆大厦台站', serviceRadius:'2', lg: '113.335171', la:'23.135262'}]},
	{freq:'419.0000MHz', freqNum: 'Us-12', num: '2', sub: [{name:'创展中心台站', serviceRadius:'3', lg: '113.336417', la:'23.137719'}, {name:'正佳广场台站', serviceRadius:'2', lg: '113.333474', la:'23.138659'}]}];
$(function () {
	g_params = parent.g_params;
	initView();
	if($('#divLeftBody1').height() >= 500) $('#Section1').css("height", $('#divLeftBody1').height() + 'px');
});

function initView(){
	//捕获tab切换事件
	$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
	    if($(this).text() == '已占用频率' && g_firstLoad){
	    		loadMap3();
		    	loadDate3();
		    	if($('#divLeftBody3').height() >= 500) $('#Section3').css("height", $('#divLeftBody3').height() + 'px');
		    	g_firstLoad = false;
	    }
		//重新计算当前页面的高度，用于iframe
	    parent.document.getElementById('case-iframe').style.height = '0px';
	    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
	});
	//初始化第一个tab
	loadMap1();
	loadDate1();
}

function loadMap1(){
	var stationPoint = new BMap.Point(g_params.row.longitude, g_params.row.latitude);
	g_map1 = rales.createMap("map-container-1", 15, stationPoint);//创建地图  
	rales.setMapEvent(g_map1);//设置地图事件  
	rales.addMapControl(g_map1);//向地图添加控件  
	//加载站点位置
	var stationIcon = new BMap.Icon("/rales/img/icon-station-min-30.png", new BMap.Size(30, 30));
	var stationMarker = new BMap.Marker(stationPoint, {icon: stationIcon}); 
	g_map1.addOverlay(stationMarker); 
}

function loadMap3(){
	var stationPoint = new BMap.Point(g_params.row.longitude, g_params.row.latitude);
	g_map3 = rales.createMap("map-container-3", 15, stationPoint);//创建地图  
	rales.setMapEvent(g_map3);//设置地图事件  
	rales.addMapControl(g_map3);//向地图添加控件  
	//加载站点位置
	var stationIcon = new BMap.Icon("/rales/img/icon-station-min-30.png", new BMap.Size(30, 30));
	var stationMarker = new BMap.Marker(stationPoint, {icon: stationIcon}); 
	g_map3.addOverlay(stationMarker); 
}

function loadDate1(){
	//添加列表内容
	$('#stationNum1').text(g_knowData.length);
	var icon = new BMap.Icon("/rales/img/icon-red-location-min.png", new BMap.Size(40, 40));
	$('#divInfoList1').empty();
	var html = "";
	for(var i = 0; i < g_knowData.length; i++ ){
		html = '<div style="margin-top:15px;position: relative;">' + 
		   			'<img src="/rales/img/icon-red-location.png" style="width:40px;height:40px;float:left">' + 
					'<div style="position: absolute;color:#fff;left: 15px;top: 5px;font-size: 15px;font-weight: bold;">' + (i+1) + '</div>' + 
					'<div style="float:left;margin-left:5px;line-height:25px;">' + 
						'<div style="color:red">' + g_knowData[i].name + '</div>' + 
						'<div>' + g_knowData[i].tel + '</div>' + 
						'<div>' + g_knowData[i].addr + '</div>' + 
						'<div style="color:#408ebc">' + g_knowData[i].freq + '</div>' + 
					'</div>' + 
				'</div>' + 
				'<div style="clear:both;"></div>';
		$('#divInfoList1').append(html);
		//添加地图标注
		var point = new BMap.Point(g_knowData[i].lg, g_knowData[i].la);
		var marker = new BMap.Marker(point,{icon: icon}); 
		g_map1.addOverlay(marker); 
		//加上标签
		var label = new BMap.Label((i + 1), {offset: new BMap.Size(-10, -15), position: point}); 
		label.setStyle({
			borderWidth: '0px',
			color : "#fff",
			backgroundColor : "transparent",
			padding : '0px 5px',
			fontSize : "14px",
			height : "20px",
			lineHeight : "20px",
		});  
      	g_map1.addOverlay(label);  
	}
}


function loadDate3(){
	//添加列表内容
	$('#stationNum3').text(g_unKnowData.length);
	$('#divInfoList3').empty();
	var html = "";
	for(var i = 0; i < g_unKnowData.length; i++ ){
		html = '<div style="margin-top:15px;">' + 
		   			'<div onclick="addMarkToMap(' + i + ')" style="cursor:pointer;float:left;width: 34px;height: 34px;background: #2dc0fb;-moz-border-radius: 17px;-webkit-border-radius: 17px;border-radius: 17x;line-height: 34px;text-align: center;color: #fff;font-size: 16px;font-weight: bold;">' + (i + 1) + '</div>' + 
		   			'<div style="float:left;line-height:25px;width:80%">' + 
		   				'<div style="margin-left:15px"><span style="color:#408ebc;margin-right:30px;">' + g_unKnowData[i].freq + '</span><span>' + g_unKnowData[i].freqNum + '</span></div>' + 
		   				'<div style="margin-left:15px">共 <span style="color:red;">' + g_unKnowData[i].num + '</span> 个台站</div>';
		for(var j = 0; j < g_unKnowData[i].sub.length; j++ ){
			html += '<div style="position: relative;">' + 
			   			'<img src="/rales/img/icon-red-location.png" style="width:30px;height:30px;float:left">' + 
			   			'<div style="position: absolute;color:#fff;left: 11px;top: -1px;font-size: 12px;font-weight: bold;">' + (j + 1) + '</div>' + 
			   			'<div><span style="color:red;margin-right:30px;">' + g_unKnowData[i].sub[j].name + '</span>服务半径：<span>' + g_unKnowData[i].sub[j].serviceRadius + '</span>km</div>' + 
					'</div>' + 
					'<div style="clear:both"></div>';
		}
		html +=    	'</div>' + 
		   		'</div>' + 
				'<div style="clear:both;"></div>';
		$('#divInfoList3').append(html);
	}
}

//点击后添加标注到地图
function addMarkToMap(index){
	g_map3.clearOverlays(); // 清除地图上所有覆盖物
	//添加站点
	var stationPoint = new BMap.Point(g_params.row.longitude, g_params.row.latitude);
	var stationIcon = new BMap.Icon("/rales/img/icon-station-min-30.png", new BMap.Size(30, 30));
	var stationMarker = new BMap.Marker(stationPoint, {icon: stationIcon}); 
	g_map3.addOverlay(stationMarker); 
	//添加列表
	var icon = new BMap.Icon("/rales/img/icon-red-location-min.png", new BMap.Size(40, 40));
	for(var i = 0; i < g_unKnowData[index].sub.length; i++ ){
		//添加地图标注
		var point = new BMap.Point(g_unKnowData[index].sub[i].lg, g_unKnowData[index].sub[i].la);
		var marker = new BMap.Marker(point,{icon: icon}); 
		g_map3.addOverlay(marker); 
		//加上标签
		var label = new BMap.Label((i + 1), {offset: new BMap.Size(-10, -15), position: point}); 
		label.setStyle({
			borderWidth: '0px',
			color : "#fff",
			backgroundColor : "transparent",
			padding : '0px 5px',
			fontSize : "14px",
			height : "20px",
			lineHeight : "20px",
		});  
		g_map3.addOverlay(label);  
	}
}