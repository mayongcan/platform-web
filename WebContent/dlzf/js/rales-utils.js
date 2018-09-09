//业务模块全局配置
var rales = {};

//文书对应值(必要文书)
rales.writNecessity2_1 = "2";
rales.writNecessity2_2 = "3";
rales.writNecessity2_3 = "4";
rales.writNecessity2_4 = "5";
rales.writNecessity2_5 = "6";
rales.writNecessity2_6 = "7";
rales.writNecessity2_7 = "8";
rales.writNecessity2_8 = "9";
rales.writNecessity3_1 = "10";
rales.writNecessity3_2 = "11";
rales.writNecessity3_3 = "12";
rales.writNecessity3_4 = "13";
rales.writNecessity3_5 = "14";
rales.writNecessity3_6 = "15";
rales.writNecessity3_7 = "16";
rales.writNecessity3_8 = "17";
rales.writNecessity3_9 = "18";
rales.writNecessity4_1 = "19";
rales.writNecessity4_2 = "20";
rales.writNecessity4_3 = "21";
rales.writNecessity4_4 = "22";
rales.writNecessity5_1 = "23";
rales.writNecessity6_1 = "24";
rales.writNecessity6_2 = "25";

//文书对应值(非必要文书)
rales.writOptional1_1 = "101";
rales.writOptional1_2 = "102";
rales.writOptional1_3 = "103";
rales.writOptional1_4 = "104";
rales.writOptional1_5 = "105";
rales.writOptional1_6 = "106";
rales.writOptional1_7 = "107";
rales.writOptional1_8 = "108";
rales.writOptional1_9 = "109";
rales.writOptional1_10 = "110";
rales.writOptional1_11 = "111";
rales.writOptional1_12 = "112";
rales.writOptional1_13 = "113";
rales.writOptional1_14 = "114";
rales.writOptional1_15 = "115";
rales.writOptional1_16 = "116";
rales.writOptional1_17 = "117";
rales.writOptional1_18 = "118";
rales.writOptional2_1 = "201";
rales.writOptional2_2 = "202";
rales.writOptional2_3 = "203";
rales.writOptional3_1 = "301";
rales.writOptional3_2 = "302";
rales.writOptional3_3 = "303";
rales.writOptional3_4 = "304";
rales.writOptional3_5 = "305";
rales.writOptional3_6 = "306";
rales.writOptional3_7 = "307";
rales.writOptional3_8 = "308";
rales.writOptional3_9 = "309";
rales.writOptional3_10 = "310";
rales.writOptional3_11 = "311";
rales.writOptional3_12 = "312";
rales.writOptional4_1 = "401";
rales.writOptional4_2 = "402";
rales.writOptional5_1 = "501";
rales.writOptional6_1 = "601";
rales.writOptional7_1 = "701";
rales.writOptional7_2 = "702";
rales.writOptional7_3 = "703";
rales.writOptional7_4 = "704";
rales.writOptional7_5 = "705";
rales.writOptional8_1 = "801";
rales.writOptional9_1 = "901";
rales.writOptional9_2 = "902";
rales.writOptional9_3 = "903";
rales.writOptional10_1 = "1001";
rales.writOptional10_2 = "1002";
rales.writOptional10_3 = "1003";
rales.writOptional10_4 = "1004";
rales.writOptional11_1 = "1101";
rales.writOptional11_2 = "1102";

rales.getDictByCode = function(dictTypeValue){
	var dictData = [];
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getDictList",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
		    	access_token: top.app.cookies.getCookiesToken(),
		    	codeDataType: dictTypeValue
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			dictData = data.RetData;
	   		}
	   	}
	});
	if(dictData == undefined) dictData = [];
	return dictData;
}

/**
 * 获取执法人员下拉
 */
rales.getLawUserKeyVal = function(divObj, isAll, defVal){
	$.ajax({
		url: top.app.conf.url.api.system.user.getUserList,
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
            size: 500,   						//页面大小
            page: 0,  		//当前页
            tenantsId: top.app.info.userInfo.tenantsId,
            organizerId:top.app.info.rootOrganizerId,
            findChildUsers: 1,
            roleId: 101,		//过滤执法人员角色
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				if(data.rows != null && data.rows != undefined && data.rows.length > 0) {
					if(defVal == null || defVal == undefined || defVal == '') defVal = '全部';
					divObj.empty();
					if(isAll) divObj.append('<option value="">' + defVal + '</option>');
					for(var i = 0; i < data.rows.length; i++){
						divObj.append('<option value="' + data.rows[i].userName + '">' + data.rows[i].userName + '</option>');
					}
					$('.selectpicker').selectpicker('refresh');
				}
	   		}
      }
	});
}

rales.removeDictByName = function(dict, name){
	var length = dict.length, index = -1;
	for (var i = 0; i < length; i++) {
		if(dict[i].NAME == name){
			index = i;
			break;
		}
	}
	if(index != -1) dict.splice(index, 1);
	return dict;
}

/**
 * 打印官方文书
 */
rales.printOfficeFile = function(printObj, closeIndex){
	printObj.print({
		noPrintSelector: ".no-print",
		title: "　",
		deferred: $.Deferred().done(function(){
			parent.layer.close(closeIndex);
		})
	});
}

/**
 * 设置预览文书时的span下划线宽度
 */
rales.fixALinkWidth = function(){
	var oSpan = document.getElementsByTagName("a");
    for(var i = 0,len = oSpan.length; i<len; i++){
        if(oSpan[i].style.minWidth){
        		var minWidth = oSpan[i].style.minWidth.replace('px', '');
        		if($.utils.isInteger(minWidth) && oSpan[i].offsetWidth < parseInt(minWidth)){
                oSpan[i].style.display = "inline-block";
                oSpan[i].style.height = "22px";
        		}
        }
    }
}

/**
 * 设置日期信息
 */
rales.setDateInfo = function(yearObj, monthObj, dayObj, val){
	if(val == null || val == undefined) return;
	var date = $.date.stringToDate(val);
	if(isNaN(date.getFullYear()) || isNaN(date.getMonth()) || isNaN(date.getDate())) return;
	yearObj.text(date.getFullYear());
	monthObj.text(date.getMonth() + 1);
	dayObj.text(date.getDate());
}

/**
 * 设置日期信息
 */
rales.setDatetimeInfo = function(yearObj, monthObj, dayObj, hourObj, minuteObj, val){
	var date = $.date.stringToDate(val);
	if(isNaN(date.getFullYear()) || isNaN(date.getMonth()) || isNaN(date.getDate())) return;
	yearObj.text(date.getFullYear());
	monthObj.text(date.getMonth() + 1);
	dayObj.text(date.getDate());
	hourObj.text(date.getHours());
	minuteObj.text(date.getMinutes());
}

/**
 * 获取文书编号
 */
rales.getCodeCurNum = function(type){
	var curNum = "";
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCodeCurNum",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		type: type
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			curNum = data.RetData;
	   		}
	   	}
	});
	return curNum;
}

//显示文书编号
rales.showCodeCurNum = function(type){
	$('#tableTitleMarkYear').text($.date.getNowYear());
	var codeCurNum = rales.getCodeCurNum(type);
	$('#tableTitleMarkNum').text(codeCurNum);
	return codeCurNum;
}

/**
 * 获取案件编号
 */
rales.getCaseCodeCurNum = function(){
	var curNum = "";
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseCodeCurNum",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			curNum = data.RetData;
	   		}
	   	}
	});
	return curNum;
}


/**
 * 获取案件编号
 */
rales.getWritListByRelevanceId = function(relevanceId){
	if($.utils.isEmpty(relevanceId)) return "";
	var codeList = "";
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseCodeRelevanceList",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		relevanceId:relevanceId
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			for(var i = 0; i < data.rows.length; i++){
	   				codeList += data.rows[i].code + ','; 
	   			}
	   		}
	   	}
	});
	if(!$.utils.isEmpty(codeList)) codeList = codeList.substring(0, codeList.length - 1);
	return codeList;
}

//初始化文件列表
rales.initFilesList = function(files){
	$('#files-list-content').empty();
	if($.utils.isEmpty(files)) return;
	var arrayFileUrl = [], arrayFileName = [];
	arrayFileUrl = files.split(',');
	for(var i = 0; i < arrayFileUrl.length; i++){
		arrayFileName[i] = arrayFileUrl[i].substring(arrayFileUrl[i].lastIndexOf("/") + 1);
	}
	var html = "";
	var length = arrayFileUrl.length;
	for (var i = 0; i < length; i++) {
		html += '<div>' + 
					'<a href="' + top.app.conf.url.res.url + arrayFileUrl[i] + '" target="_blank" style="text-decoration: underline;word-break:break-all;" >' + arrayFileName[i] + '</a>' + 
				'</div>';
	}
	$('#files-list-content').append(html);
}

//初始化关联文书列表
rales.initCodeRelevance = function(relevanceId){
	$('#relevance-list-content').empty();
	if($.utils.isEmpty(relevanceId)) return;
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseCodeRelevanceList",
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		relevanceId:relevanceId
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			var html = "";
	   			for(var i = 0; i < data.rows.length; i++){
	   				html += '<div>' + 
	   							'<span target="_blank" style="cursor: pointer;" onclick="rales.previewCodeRelevance(\'' + data.rows[i].registerId + '\', \'' + data.rows[i].code + '\', \'' + data.rows[i].tableName + '\', \'' + data.rows[i].tableId + '\', \'' + data.rows[i].tableIdVal + '\')" >' + data.rows[i].code + '</span>' + 
	   						'</div>';
	   			}
	   			$('#relevance-list-content').append(html);
	   		}
	   	}
	});
}

/**
 * 获取文书内容
 */
rales.getWritContent = function(registerId, writType, subType){
	var dataInfo = [];
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/writ/getWritList",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: registerId,
	   		writType: writType,
	   		subType: subType,
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				if(data.rows != null && data.rows != undefined && data.rows.length > 0){
					dataInfo = data.rows[0];
				}
	   		}
      }
	});
	return dataInfo;
}

rales.previewCodeRelevance = function(registerId, code, tableName, tableId, tableIdVal){
	//设置参数
	var params = {};
	params.data = {};
	params.data.tableTitleMark = code;
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/writ/getWritList",
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		id: tableIdVal
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			if(!$.utils.isNull(data.rows) && data.rows.length > 0){
		   			params.registerRow = g_params.row;
//		   			params.data.tableTitleMark = code;
		   			params.data = eval("(" + data.rows[0].content + ")");
//		   			params.loadData = "1";
		   			//打开预览页面
		   			top.app.layer.editLayer('预览', ['725px', '600px'], rales.getWritPreviewUrl(data.rows[0].writType), params, function(){});
	   			}
	   		}
	   	}
	});
}

/**
 * 获取文书预览url
 */
rales.getWritPreviewUrl = function(writType){
	if(writType == rales.writNecessity1_1){return '/rales/ael/case/necessity/writ-pre1_1.html';}
	else if(writType == rales.writNecessity2_1){return '/rales/ael/case/necessity/writ-pre2_1.html';}
	else if(writType == rales.writNecessity2_2){return '/rales/ael/case/necessity/writ-pre2_2.html';}
	else if(writType == rales.writNecessity2_3){return '/rales/ael/case/necessity/writ-pre2_3.html';}
	else if(writType == rales.writNecessity2_4){return '/rales/ael/case/necessity/writ-pre2_4.html';}
	else if(writType == rales.writNecessity2_5){return '/rales/ael/case/necessity/writ-pre2_5.html';}
	else if(writType == rales.writNecessity2_6){return '/rales/ael/case/necessity/writ-pre2_6.html';}
	else if(writType == rales.writNecessity2_7){return '/rales/ael/case/necessity/writ-pre2_7.html';}
	else if(writType == rales.writNecessity2_8){return '/rales/ael/case/necessity/writ-pre2_8.html';}
	else if(writType == rales.writNecessity3_1){return '/rales/ael/case/necessity/writ-pre3_1.html';}
	else if(writType == rales.writNecessity3_2){return '/rales/ael/case/necessity/writ-pre3_2.html';}
	else if(writType == rales.writNecessity3_3){return '/rales/ael/case/necessity/writ-pre3_3.html';}
	else if(writType == rales.writNecessity3_4){return '/rales/ael/case/necessity/writ-pre3_4.html';}
	else if(writType == rales.writNecessity3_5){return '/rales/ael/case/necessity/writ-pre3_5.html';}
	else if(writType == rales.writNecessity3_6){return '/rales/ael/case/necessity/writ-pre3_6.html';}
	else if(writType == rales.writNecessity3_7){return '/rales/ael/case/necessity/writ-pre3_7.html';}
	else if(writType == rales.writNecessity3_8){return '/rales/ael/case/necessity/writ-pre3_8.html';}
	else if(writType == rales.writNecessity3_9){return '/rales/ael/case/necessity/writ-pre3_9.html';}
	else if(writType == rales.writNecessity4_1){return '/rales/ael/case/necessity/writ-pre4_1.html';}
	else if(writType == rales.writNecessity4_2){return '/rales/ael/case/necessity/writ-pre4_2.html';}
	else if(writType == rales.writNecessity4_3){return '/rales/ael/case/necessity/writ-pre4_3.html';}
	else if(writType == rales.writNecessity4_4){return '/rales/ael/case/necessity/writ-pre4_4.html';}
	else if(writType == rales.writNecessity4_1){return '/rales/ael/case/necessity/writ-pre5_1.html';}
	else if(writType == rales.writNecessity5_1){return '/rales/ael/case/necessity/writ-pre6_1.html';}
	else if(writType == rales.writNecessity6_2){return '/rales/ael/case/necessity/writ-pre6_2.html';}
	else if(writType == rales.writOptional1_1){return '/rales/ael/case/optional/writ-pre1_1.html';}
	else if(writType == rales.writOptional1_2){return '/rales/ael/case/optional/writ-pre1_2.html';}
	else if(writType == rales.writOptional1_3){return '/rales/ael/case/optional/writ-pre1_3.html';}
	else if(writType == rales.writOptional1_4){return '/rales/ael/case/optional/writ-pre1_4.html';}
	else if(writType == rales.writOptional1_5){return '/rales/ael/case/optional/writ-pre1_5.html';}
	else if(writType == rales.writOptional1_6){return '/rales/ael/case/optional/writ-pre1_6.html';}
	else if(writType == rales.writOptional1_7){return '/rales/ael/case/optional/writ-pre1_7.html';}
	else if(writType == rales.writOptional1_8){return '/rales/ael/case/optional/writ-pre1_8.html';}
	else if(writType == rales.writOptional1_9){return '/rales/ael/case/optional/writ-pre1_9.html';}
	else if(writType == rales.writOptional1_10){return '/rales/ael/case/optional/writ-pre1_10.html';}
	else if(writType == rales.writOptional1_11){return '/rales/ael/case/optional/writ-pre1_11.html';}
	else if(writType == rales.writOptional1_12){return '/rales/ael/case/optional/writ-pre1_12.html';}
	else if(writType == rales.writOptional1_13){return '/rales/ael/case/optional/writ-pre1_13.html';}
	else if(writType == rales.writOptional1_14){return '/rales/ael/case/optional/writ-pre1_14.html';}
	else if(writType == rales.writOptional1_15){return '/rales/ael/case/optional/writ-pre1_15.html';}
	else if(writType == rales.writOptional1_16){return '/rales/ael/case/optional/writ-pre1_16.html';}
	else if(writType == rales.writOptional2_1){return '/rales/ael/case/optional/writ-pre2_1.html';}
	else if(writType == rales.writOptional2_2){return '/rales/ael/case/optional/writ-pre2_2.html';}
	else if(writType == rales.writOptional2_3){return '/rales/ael/case/optional/writ-pre2_3.html';}
	else if(writType == rales.writOptional3_1){return '/rales/ael/case/optional/writ-pre3_1.html';}
	else if(writType == rales.writOptional3_2){return '/rales/ael/case/optional/writ-pre3_2.html';}
	else if(writType == rales.writOptional3_3){return '/rales/ael/case/optional/writ-pre3_3.html';}
	else if(writType == rales.writOptional3_4){return '/rales/ael/case/optional/writ-pre3_4.html';}
	else if(writType == rales.writOptional3_5){return '/rales/ael/case/optional/writ-pre3_5.html';}
	else if(writType == rales.writOptional3_6){return '/rales/ael/case/optional/writ-pre3_6.html';}
	else if(writType == rales.writOptional3_7){return '/rales/ael/case/optional/writ-pre3_7.html';}
	else if(writType == rales.writOptional3_8){return '/rales/ael/case/optional/writ-pre3_8.html';}
	else if(writType == rales.writOptional3_9){return '/rales/ael/case/optional/writ-pre3_9.html';}
	else if(writType == rales.writOptional3_10){return '/rales/ael/case/optional/writ-pre3_10.html';}
	else if(writType == rales.writOptional3_11){return '/rales/ael/case/optional/writ-pre3_11.html';}
	else if(writType == rales.writOptional3_12){return '/rales/ael/case/optional/writ-pre3_12.html';}
	else if(writType == rales.writOptional4_1){return '/rales/ael/case/optional/writ-pre4_1.html';}
	else if(writType == rales.writOptional4_2){return '/rales/ael/case/optional/writ-pre4_2.html';}
	else if(writType == rales.writOptional5_1){return '/rales/ael/case/optional/writ-pre5_1.html';}
	else if(writType == rales.writOptional6_1){return '/rales/ael/case/optional/writ-pre6_1.html';}
	else if(writType == rales.writOptional7_1){return '/rales/ael/case/optional/writ-pre7_1.html';}
	else if(writType == rales.writOptional7_2){return '/rales/ael/case/optional/writ-pre7_2.html';}
	else if(writType == rales.writOptional7_3){return '/rales/ael/case/optional/writ-pre7_3.html';}
	else if(writType == rales.writOptional7_4){return '/rales/ael/case/optional/writ-pre7_4.html';}
	else if(writType == rales.writOptional7_5){return '/rales/ael/case/optional/writ-pre7_5.html';}
	else if(writType == rales.writOptional8_1){return '/rales/ael/case/optional/writ-pre8_1.html';}
	else if(writType == rales.writOptional9_1){return '/rales/ael/case/optional/writ-pre9_1.html';}
	else if(writType == rales.writOptional9_2){return '/rales/ael/case/optional/writ-pre9_2.html';}
	else if(writType == rales.writOptional9_3){return '/rales/ael/case/optional/writ-pre9_3.html';}
	else if(writType == rales.writOptional10_1){return '/rales/ael/case/optional/writ-pre10_1.html';}
	else if(writType == rales.writOptional10_2){return '/rales/ael/case/optional/writ-pre10_2.html';}
	else if(writType == rales.writOptional10_3){return '/rales/ael/case/optional/writ-pre10_3.html';}
	else if(writType == rales.writOptional10_4){return '/rales/ael/case/optional/writ-pre10_4.html';}
	else if(writType == rales.writOptional11_1){return '/rales/ael/case/optional/writ-pre11_1.html';}
	else if(writType == rales.writOptional11_2){return '/rales/ael/case/optional/writ-pre11_2.html';}
}

/**###########################################################################
 * 地图相关
 * ###########################################################################
 */
//创建地图函数：  
rales.createMap = function(divMapContainer, defSize, defLocation){  
	var map = new BMap.Map(divMapContainer); 
	if($.utils.isEmpty(defLocation)) defLocation = '广州';
	if($.utils.isEmpty(defSize)) defSize = 12;
	map.centerAndZoom(defLocation, defSize);
	return map;
}

// 地图事件设置函数：
rales.setMapEvent = function(map) {
	map.enableDragging();// 启用地图拖拽事件，默认启用(可不写)
	// map.enableScrollWheelZoom();//启用地图滚轮放大缩小
	map.enableDoubleClickZoom();// 启用鼠标双击放大，默认启用(可不写)
	map.enableKeyboard();// 启用键盘上下左右键移动地图
}  

//添加地图控件
rales.addMapControl = function(map) {
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