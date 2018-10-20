var g_map = null, g_rows = null;
$(function () {
	top.app.message.loading();
	g_map = rales.createMap("map-container");//创建地图  
	rales.setMapEvent(g_map);//设置地图事件  
	rales.addMapControl(g_map);//向地图添加控件  
    
    setTimeout(function () {
    		initData();
    }, 1000);
//	initData();
//    //加载结束后，启动初始化数据
//	g_map.addEventListener("tilesloaded",function(e){
//		initData();
//	});
	//重新计算当前页面的高度，用于iframe
    parent.document.getElementById('case-iframe').style.height = $.utils.calcPageHeight(document) + 'px';
});

function initData(){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getStationList",
	    method: 'GET',
	    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
            size: 15,   								// 页面大小
            page: 0,  								// 当前页
            statName: parent.$('#searchStatName').val(),
            statType: parent.$('#searchStatType').val(),
            statWork: parent.$('#searchStatWork').val(),
            statLg: parent.$('#searchStatLg').val(),
            statLa: parent.$('#searchStatLa').val(),
            radius: parent.$('#searchRadius').val(),
            begin: parent.$('#searchBegin').val(),
            end: parent.$('#searchEnd').val(),
            statOrg: parent.$('#searchStatOrg').val(),
	    },
	    success: function(data){
			top.app.message.loadingClose();
	    		if(top.app.message.code.success == data.RetCode){
	    			g_rows = data.rows;
    				var icon = new BMap.Icon("/rales/img/icon-station-min.png", new BMap.Size(24, 24))  
	    			//获取经纬度并显示在地图上
	    			for(var i = 0; i < g_rows.length; i++){
	    				var point = new BMap.Point(g_rows[i].statLg, g_rows[i].statLa); 
	    				if(i == 0){
	    					//定位到第一个点上
	    					g_map.panTo(point);
	    				}
	    				var marker = new BMap.Marker(point,{icon: icon}); 
	    				if(!$.utils.isNull(g_rows[i].statName)) {
	    					var labelLeft = g_rows[i].statName.length;
		    				var label = new BMap.Label(g_rows[i].statName, {offset: new BMap.Size(-(labelLeft * 5.2), -40), position: point}); 
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
	//清空
	$('#orgName').text("");
	$('#statName').text("");
	$('#licenseCode').text("");
	$('#statWork').text("");
	$('#statLg').text("");
	$('#statLa').text("");
	$('#radius').text("");
	$('#sysType').text("");
	$('#technology').text("");
	//赋值
	$('#orgName').text($.utils.getNotNullVal(g_rows[index].orgName));
	$('#statName').text($.utils.getNotNullVal(g_rows[index].statName));
	$('#licenseCode').text($.utils.getNotNullVal(g_rows[index].licenseCode));
	$('#statWork').text(top.app.getDictName(g_rows[index].statType, parent.g_statWorkDict));
//	$('#statLg').text($.utils.getNotNullVal(g_rows[index].statLg));
//	$('#statLa').text($.utils.getNotNullVal(g_rows[index].statLa));
	$('#statLg').text($.utils.getNotNullVal(g_rows[index].gpsLg));
	$('#statLa').text($.utils.getNotNullVal(g_rows[index].gpsLa));
	$('#radius').text($.utils.getNotNullVal(g_rows[index].stServR));
	$('#sysType').text($.utils.getNotNullVal(g_rows[index].netSvn));
	$('#technology').text(top.app.getDictName(g_rows[index].netTs, parent.g_netTsDict));
}  