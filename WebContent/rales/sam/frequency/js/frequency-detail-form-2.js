var g_map1 = null, g_map3 = null, g_firstLoad = true;
var g_retData = null, g_singleFrequency = "1";
var g_knowData = [{statName:'维多利广场站', appCode:'T44063202020020', statAddr:'广州市天河区体育西路101号', freqLc:'418.1250Mhz', statLg: '113.32732', statLa:'23.140782'},
	{statName:'三新大厦台站', appCode:'T250620141252', statAddr:'三新大厦黄埔大道西33号', freqLc:'418.4875MHz', statLg: '113.324924', statLa:'23.134553'},
	{statName:'方圆大厦台站', appCode:'T440620161089', statAddr:'广州市天河区体育东路28号', freqLc:'419.0000MHz', statLg: '113.335171', statLa:'23.135262'},
	{statName:'创展中心台站', appCode:'T440620153521', statAddr:'天河区体育东路108号', freqLc:'418.4875MHz', statLg: '113.336417', statLa:'23.137719'},
	{statName:'正佳广场台站', appCode:'T440620152342', statAddr:'广州市天河区天河路228号', freqLc:'418.4875MHz', statLg: '113.333474', statLa:'23.138659'}];
var g_unKnowData = [{freqLc:'418.1250Mhz', freqNum: 'Us-12', num: '1', sub: [{name:'维多利广场站', serviceRadius:'3', statLg: '113.32732', statLa:'23.140782'}]},
	{freqLc:'418.4875MHz', freqNum: 'Us-12', num: '2', sub: [{name:'三新大厦台站', serviceRadius:'3', statLg: '113.324924', statLa:'23.134553'}, {name:'方圆大厦台站', serviceRadius:'2', statLg: '113.335171', statLa:'23.135262'}]},
	{freqLc:'419.0000MHz', freqNum: 'Us-12', num: '2', sub: [{name:'创展中心台站', serviceRadius:'3', statLg: '113.336417', statLa:'23.137719'}, {name:'正佳广场台站', serviceRadius:'2', statLg: '113.333474', statLa:'23.138659'}]}];
$(function () {
	top.app.message.loading();
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
	//获取请求数据
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getStationAnalysisList",
	    method: 'GET',
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	analysisType: g_params.row.analysisType,
	    	network: g_params.row.network,
	    	coverageArea: g_params.row.coverageArea,
	    	centerFrequency: g_params.row.centerFrequency,
	    	mobileStation: g_params.row.mobileStation,
	    	baseStation: g_params.row.baseStation,
	    	statLg: g_params.row.longitude,
	    	statLa: g_params.row.latitude,
	    	serviceRadius: g_params.row.serviceRadius,
	   	},
	   	success: function(data){
	   		top.app.message.loadingClose();
	   		if(top.app.message.code.success == data.RetCode){
	   			g_retData = data.RetData;
	   			g_knowData = g_retData.stationList
	   			g_unKnowData = g_retData.unAssignList;
	   			g_singleFrequency = g_retData.singleFrequency;
	   			//初始化第一个tab
	   			loadMap1();
	   			loadDate1();
	   			loadDate2();
	   			//重新计算当前页面的高度，用于iframe
		    	if($('#divLeftBody1').height() >= 500) $('#Section1').css("height", $('#divLeftBody1').height() + 'px');
	   		    parent.document.getElementById('case-iframe').style.height = '0px';
	   		    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
	   		}
	   	}
	});
//	//初始化第一个tab
//	loadMap1();
//	loadDate1();
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
		html = '<div style="margin-top:15px;position: relative;display:flex;">' + 
		   			'<img src="/rales/img/icon-red-location.png" style="width:40px;height:40px;float:left">' + 
					'<div style="position: absolute;color:#fff;left: 15px;top: 5px;font-size: 15px;font-weight: bold;">' + (i+1) + '</div>' + 
					'<div style="float:left;margin-left:5px;line-height:25px;flex:1">' + 
						'<div style="color:red">' + g_knowData[i].statName + '</div>' + 
						'<div>' + g_knowData[i].appCode + '</div>' + 
						'<div>' + g_knowData[i].statAddr + '</div>' + 
						'<div style="color:#408ebc">' + ($.utils.isNull(g_knowData[i].freqLc) ? '' : g_knowData[i].freqLc) + 'MHz</div>' + 
					'</div>' + 
				'</div>' + 
				'<div style="clear:both;"></div>';
		$('#divInfoList1').append(html);
		//添加地图标注
		var point = new BMap.Point(g_knowData[i].statLg, g_knowData[i].statLa);
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

function loadDate2(){
	//添加列表内容
	$('#resultList').empty();
	if(g_singleFrequency == '1'){
		$('#resultList').append('<tr>' +
									'<td class="reference-td" style="width:50%">' +
									   	'频率编号' +
									'</td>' +
									'<td class="reference-td" style="width:50%">' +
									   	'中心频率' +
									'</td>' +
								'</tr>'); 
	}else{
		$('#resultList').append('<tr>' +
				'<td class="reference-td" style="width:33%">' +
				   	'频率编号' +
				'</td>' +
				'<td class="reference-td" style="width:33%">' +
				   	'移动台发射频率' +
				'</td>' +
				'<td class="reference-td" style="width:33%">' +
				   	'基地台发射频率' +
				'</td>' +
			'</tr>'); 
	}
	var html = "";
	for(var i = 0; i < g_unKnowData.length; i++ ){
		if(g_singleFrequency == '1'){
			html += '<tr>' +
						'<td class="reference-td">' + g_unKnowData[i].frequencyCode + '</td>' +
						'<td class="reference-td">' + g_unKnowData[i].centerFrequency + 'Mhz</td>' +
					'</tr>';
		}else{
			html += '<tr>' +
						'<td class="reference-td">' + g_unKnowData[i].frequencyCode + '</td>' +
						'<td class="reference-td">' + g_unKnowData[i].mobileStation + 'Mhz</td>' +
						'<td class="reference-td">' + g_unKnowData[i].baseStation + 'Mhz</td>' +
					'</tr>';
		}
	}
	$('#resultList').append(html); 
}

function loadDate3(){
	//添加列表内容
	$('#stationNum3').text(g_knowData.length);
	$('#divInfoList3').empty();
	var html = "";
	for(var i = 0; i < g_knowData.length; i++ ){
		html = '<div style="margin-top:15px;">' + 
		   			'<div onclick="addMarkToMap(' + i + ')" style="cursor:pointer;float:left;width: 34px;height: 34px;background: #2dc0fb;-moz-border-radius: 17px;-webkit-border-radius: 17px;border-radius: 17x;line-height: 34px;text-align: center;color: #fff;font-size: 16px;font-weight: bold;">' + (i + 1) + '</div>' + 
		   			'<div style="float:left;line-height:25px;width:80%">' + 
		   				'<div style="margin-left:15px"><span style="color:#408ebc;margin-right:30px;">' + ($.utils.isNull(g_knowData[i].freqLc) ? '' : g_knowData[i].freqLc) + 'Mhz</span><span>' + g_knowData[i].frequencyCode + '</span></div>' + 
		   				'<div style="margin-left:15px">共 <span style="color:red;">' + 1 + '</span> 个台站</div>';
//		for(var j = 0; j < g_knowData[i].sub.length; j++ ){
//			html += '<div style="position: relative;">' + 
//			   			'<img src="/rales/img/icon-red-location.png" style="width:30px;height:30px;float:left">' + 
//			   			'<div style="position: absolute;color:#fff;left: 11px;top: -1px;font-size: 12px;font-weight: bold;">' + (j + 1) + '</div>' + 
//			   			'<div><span style="color:red;margin-right:30px;">' + g_knowData[i].sub[j].name + '</span>服务半径：<span>' + g_knowData[i].sub[j].serviceRadius + '</span>km</div>' + 
//					'</div>' + 
//					'<div style="clear:both"></div>';
//		}
		html += '<div style="position: relative;">' + 
					'<img src="/rales/img/icon-red-location.png" style="width:30px;height:30px;float:left">' + 
					'<div style="position: absolute;color:#fff;left: 11px;top: -1px;font-size: 12px;font-weight: bold;">1</div>' + 
					'<div><span style="color:red;margin-right:30px;">' + g_knowData[i].statName + '</span>服务半径：<span>' + g_knowData[i].stServR + '</span>km</div>' + 
				'</div>' + 
				'<div style="clear:both"></div>';
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
		var point = new BMap.Point(g_unKnowData[index].sub[i].statLg, g_unKnowData[index].sub[i].statLa);
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

function exportWord(){
//	var rules = "", ss = document.styleSheets;
//	for (var i = 0; i < ss.length; ++i) {
//	    for (var x = 0; x < ss[i].cssRules.length; ++x) {
//	        rules += ss[i].cssRules[x].cssText;
//	    }
//	}
//	$("#content-left").wordExport("台站数据分析", rules);
}