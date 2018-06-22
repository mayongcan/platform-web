//业务模块全局配置
var rales = {};

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

rales.previewCodeRelevance = function(registerId, code, tableName, tableId, tableIdVal){
	var url = "";
	if("rales_ael_register" == tableName) {
		url = '/rales/ael/case/necessity/case-register-pre.html';
    }else if("rales_ael_filing" == tableName) {
    		url = '/rales/ael/case/necessity/put-on-record-audit-pre.html';
    }else if("rales_ael_filingnotice" == tableName) {
    		url = '/rales/ael/case/necessity/put-on-record-notice-pre.html';
    }else if("rales_ael_casetransfer" == tableName) {
    		url = '/rales/ael/case/necessity/case-tran-notice-pre.html';
    }else if("rales_ael_report" == tableName) {
		url = '/rales/ael/case/necessity/case-survey-report-pre.html';
    }else if("rales_ael_punish_1" == tableName) {
		url = '/rales/ael/case/necessity/punish-notice-pre.html';
    }else if("rales_ael_punish_2" == tableName) {
		url = '/rales/ael/case/necessity/punish-hearing-notice-pre.html';
    }else if("rales_ael_punishverify" == tableName) {
		url = '/rales/ael/case/necessity/punish-audit-pre.html';
    }else if("rales_ael_spotpunish" == tableName) {
		url = '/rales/ael/case/necessity/cur-punish-decision-pre.html';
    }else if("rales_ael_punishdecision" == tableName) {
		url = '/rales/ael/case/necessity/punish-decision-pre.html';
    }else if("rales_ael_closed" == tableName) {
		url = '/rales/ael/case/necessity/case-end-report-pre.html';
    }else if("rales_ael_volume" == tableName) {
		url = '/rales/ael/case/necessity/case-volume-pre.html';
    }else if("rales_ael_catalog" == tableName) {
		url = '/rales/ael/case/necessity/case-catalog-pre.html';
    }
    //调查取证
    else if("rales_ael_fieldinspection" == tableName) {
		url = '/rales/ael/case/optional/scene-check-record-pre.html';
    }else if("rales_ael_record" == tableName) {
		url = '/rales/ael/case/optional/investigative-record-pre.html';
    }else if("rales_ael_forensicmaterials" == tableName) {
		url = '/rales/ael/case/optional/obtain-evidence-materials-notice-pre.html';
    }else if("rales_ael_inquiry" == tableName) {
		url = '/rales/ael/case/optional/inquiry-notice-pre.html';
    }else if("rales_ael_assistinvestigation" == tableName) {
		url = '/rales/ael/case/optional/case-assist-inquiry-pre.html';
    }else if("rales_ael_ordercorrect" == tableName) {
		url = '/rales/ael/case/optional/instruct-to-correct-notice-pre.html';
    }
    //证据保存
    else if("rales_ael_papersapproval" == tableName) {
		url = '/rales/ael/case/optional/evidence-preserve-audit-pre.html';
    }else if("rales_ael_preservation" == tableName) {
		url = '/rales/ael/case/optional/evidence-preserve-decision-pre.html';
    }else if("rales_ael_entrustment" == tableName) {
		url = '/rales/ael/case/optional/delegation-storage-pre.html';
    }else if("rales_ael_relieve" == tableName) {
		url = '/rales/ael/case/optional/remove-evidence-preserve-decision-pre.html';
    }
    //鉴定检验
    else if("rales_ael_appraisal" == tableName) {
		url = '/rales/ael/case/optional/auth-delegation-pre.html';
    }
    //集体讨论案件记录
    else if("rales_ael_collectiverecord" == tableName) {
		url = '/rales/ael/case/optional/collective-discuss-record-pre.html';
    }
    //陈述申辩
    else if("rales_ael_pleadrecord" == tableName) {
		url = '/rales/ael/case/optional/parties-justify-record-pre.html';
    }
    //听证
    else if("rales_ael_hearing" == tableName) {
		url = '/rales/ael/case/optional/hearing-audit-pre.html';
    }else if("rales_ael_hearingmeeting" == tableName) {
		url = '/rales/ael/case/optional/hearing-notice-pre.html';
    }else if("rales_ael_hearingrecord" == tableName) {
		url = '/rales/ael/case/optional/hearing-record-pre.html';
    }else if("rales_ael_nohearing" == tableName) {
		url = '/rales/ael/case/optional/no-hearing-notice-pre.html';
    }else if("rales_ael_hearingreport" == tableName) {
		url = '/rales/ael/case/optional/hearing-report-pre.html';
    }
    //强制执行
    else if("rales_ael_implement_1" == tableName) {
		url = '/rales/ael/case/optional/perform-application-pre-1.html';
    }else if("rales_ael_implement_2" == tableName) {
		url = '/rales/ael/case/optional/perform-application-pre-2.html';
    }else if("rales_ael_implement_3" == tableName) {
		url = '/rales/ael/case/optional/perform-application-pre-3.html';
    }
    //送达归案
    else if("rales_ael_receipt" == tableName) {
		url = '/rales/ael/case/optional/delivery-evidence-pre.html';
    }
	
	//设置参数
	var params = {};
	params.data = {};
	params.data.tableTitleMark = code;
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseWritDetail",
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		tableName: tableName,
	   		tableIdVal: tableIdVal
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			params.data = data.RetData;
	   			params.data.tableTitleMark = code;
	   			params.registerRow = g_params.row;
	   			params.loadData = "1";
	   			//打开预览页面
	   			top.app.layer.editLayer('预览', ['725px', '600px'], url, params, function(){});
	   		}
	   	}
	});
}

//获取立案审批信息
rales.getCaseFilingInfo = function(registerId){
	return rales.getTableDataInfo(registerId, "CaseFilingInfo");
}

//获取听证通知书
rales.getHearingNoticeInfo = function(registerId){
	return rales.getTableDataInfo(registerId, "HearingNoticeInfo");
}

//获取证据保全措施审批表信息
rales.getEvidencePreserveInfo = function(registerId){
	return rales.getTableDataInfo(registerId, "EvidencePreserveInfo");
}

//获取听证审批信息
rales.getHearingAuditInfo = function(registerId){
	return rales.getTableDataInfo(registerId, "HearingAuditInfo");
}

//获取听证报告书信息
rales.getHearingReportInfo = function(registerId){
	return rales.getTableDataInfo(registerId, "HearingReportInfo");
}

//获取保全决定书信息
rales.getEvidencePreserveDecision = function(registerId){
	return rales.getTableDataInfo(registerId, "EvidencePreserveDecision");
}

//获取委托保管书
rales.getDelegationStorage = function(registerId){
	return rales.getTableDataInfo(registerId, "DelegationStorage");
}

//责令（限期）改正通知书
rales.getOrderCorrect = function(registerId){
	return rales.getTableDataInfo(registerId, "OrderCorrect");
}

//当场行政处罚决定书
rales.getCurPunishDecision = function(registerId){
	return rales.getTableDataInfo(registerId, "CurPunishDecision");
}

//当事人陈述申辩笔录
rales.getPleadRecord= function(registerId){
	return rales.getTableDataInfo(registerId, "PleadRecord");
}

rales.getTableDataInfo = function(registerId, tableName){
	var url = "";
	if(tableName == 'CaseFilingInfo') url = '/api/rales/ael/case/getCaseFilingList';
	else if(tableName == 'HearingNoticeInfo') url = '/api/rales/ael/case/getHearingNoticeList';
	else if(tableName == 'EvidencePreserveInfo') url = '/api/rales/ael/case/getEvidencePreserveList';
	else if(tableName == 'HearingAuditInfo') url = '/api/rales/ael/case/getHearingAuditList';
	else if(tableName == 'HearingReportInfo') url = '/api/rales/ael/case/getHearingReportList';
	else if(tableName == 'EvidencePreserveDecision') url = '/api/rales/ael/case/getEvidencePreserveDecisionList';
	else if(tableName == 'DelegationStorage') url = '/api/rales/ael/case/getDelegationStorageList';
	else if(tableName == 'OrderCorrect') url = '/api/rales/ael/case/getOrderCorrectList';
	else if(tableName == 'CurPunishDecision') url = '/api/rales/ael/case/getCurPunishDecisionList';
	else if(tableName == 'PleadRecord') url = '/api/rales/ael/case/getPleadRecordList';
	var dataInfo = [];
	$.ajax({
		url: top.app.conf.url.apigateway + url,
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		registerId: registerId
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