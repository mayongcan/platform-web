var g_data = null, g_scopeDict = [], g_statTypeDict = [], g_statWorkDict = [];
$(function () {
	initView();
	g_scopeDict = rales.getDictByCode("00022006");
	g_statTypeDict = rales.getDictByCode("00052006");
	g_statWorkDict = rales.getDictByCode("00062006");
	//触发自动查询
	code = $.utils.getUrlParam(window.location.search,"code");
	if(!$.utils.isEmpty(code)){
		$("#searchCode").val(code);
		$('#btnSearch').trigger("click");
	}
});

function initView(){
	//搜索点击事件
	$("#btnSearch").click(function () {
		if($("#searchCode").val() == ''){
			top.app.message.notice("请输入执照编号！");
			return;
		}
		top.app.message.loading();
		initData();
    });
	$("#btnReset").click(function () {
		$("#searchCode").val("");
		$('#divSearchResult').css('display', 'none');
    });
	//年审缴费
	$("#btnOK").click(function () {
		//设置参数
		var params = {};
		params.data = g_data;
		top.app.layer.editLayer('年审/缴费', ['710px', '420px'], '/rales/sam/station/station-pay-edit.html', params, function(){
			
		});
    });
	//进入台站详情
	$('#company').click(function () {
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.data = g_data;
		top.app.info.iframe.params.statTypeDict = g_statTypeDict;
		top.app.info.iframe.params.statWorkDict = g_statWorkDict;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/rales/sam/station/station-detail.html?_pid=" + pid + "&backUrl=/rales/sam/station/station-doc.html";
		window.location.href = encodeURI(url);
    });
}

function initData(){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getStationByLicenseCode",
	    method: 'GET',
	    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		licenseCode: $('#searchCode').val(),
	    },
	    success: function(data){
			top.app.message.loadingClose();
	    		if(top.app.message.code.success == data.RetCode && data.RetData != null && data.RetData != undefined){
	    			g_data = data.RetData;
	    			$('#divSearchResult').css('display', '');
	    			//使用licenseCode生成二维码
	    			$('#qrcode').empty();
	    			$('#qrcode').qrcode({width: 128,height: 128,text: data.RetData.licenseCode});
	    			$('#licenseCode').text(data.RetData.licenseCode);
	    			$('#licenseDateB').text($.date.dateFormat(data.RetData.licenseDateB, "yyyy年MM月dd日"));
	    			$('#licenseDateE').text($.date.dateFormat(data.RetData.licenseDateE, "yyyy年MM月dd日"));
	    			
	    			$('#company').text($.utils.getNotNullVal(data.RetData.orgName));
	    			$('#scope').text(top.app.getDictName(data.RetData.netArea, g_scopeDict));
	    			$('#stationName').text($.utils.getNotNullVal(data.RetData.statName));
	    			$('#stationAddr').text($.utils.getNotNullVal(data.RetData.statAddr));
	    			$('#stationType').text(top.app.getDictName(data.RetData.statType, g_statTypeDict));
	    			$('#startDate').text($.date.dateFormat(data.RetData.statDateStart, "yyyy年MM月dd日"));

	    			$('#freqSend').html("上限：" + $.utils.getNotNullVal(data.RetData.freqEfb) + "MHz<br>下限：" + $.utils.getNotNullVal(data.RetData.freqEfe) + "MHz");
	    			$('#freqReceive').html("上限：" + $.utils.getNotNullVal(data.RetData.freqRfb) + "MHz<br>下限：" + $.utils.getNotNullVal(data.RetData.freqRfe) + "MHz");
	    			$('#freqPow').text($.utils.getNotNullVal(data.RetData.equPow) + "Bm");
	    			$('#freqCode').html($.utils.getNotNullVal(data.RetData.equModel) + "<br>" + $.utils.getNotNullVal(data.RetData.equCode));
	    			
//	    			$('#netCode').text($.utils.getNotNullVal(data.RetData.stENetCode));
//	    			$('#sectionNum').text($.utils.getNotNullVal(data.RetData.stCSum));
//	    			$('#freqCall').text($.utils.getNotNullVal(data.RetData.stCallSign));

//	    			$('#antennaType').text($.utils.getNotNullVal(data.RetData.antModel));
//	    			$('#antennaGain').text($.utils.getNotNullVal(data.RetData.antGain));
//	    			$('#antennaHeight').text($.utils.getNotNullVal(data.RetData.antHight));
	    			
	    			getStationOtherInfo(data.RetData.guid);
	    			getAndFeedInfo(data.RetData.guid);
	   		}else{
				top.app.message.notice("没有查询到执照编号为" + $("#searchCode").val() + "的数据");
	   		}
		},
	});
}


function getStationOtherInfo(guid){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getStationOtherList",
	    method: 'GET',
	    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		guid: guid,
	    },
	    success: function(data){
	    		if(top.app.message.code.success == data.RetCode && data.RetData != null && data.RetData != undefined){
	    			$('#netCode').text($.utils.getNotNullVal(data.RetData.stENetCode));
	    			$('#sectionNum').text($.utils.getNotNullVal(data.RetData.stCSum));
	    			$('#freqCall').text($.utils.getNotNullVal(data.RetData.stCallSign));
	    			
	    			g_data.stENetCode = $.utils.getNotNullVal(data.RetData.stENetCode);
	    			g_data.stCSum = $.utils.getNotNullVal(data.RetData.stCSum);
	    			g_data.stCallSign = $.utils.getNotNullVal(data.RetData.stCallSign);
	   		}
		},
	});
}


function getAndFeedInfo(stationGuid){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/rales/oracleInf/getAndFeedList",
	    method: 'GET',
	    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		stationGuid: stationGuid,
	    },
	    success: function(data){
	    		if(top.app.message.code.success == data.RetCode && data.RetData != null && data.RetData != undefined){
	    			$('#antennaType').text($.utils.getNotNullVal(data.RetData.antModel));
	    			$('#antennaGain').text($.utils.getNotNullVal(data.RetData.antGain));
	    			$('#antennaHeight').text($.utils.getNotNullVal(data.RetData.antHight));
	    			
	    			g_data.antModel = $.utils.getNotNullVal(data.RetData.antModel);
	    			g_data.antGain = $.utils.getNotNullVal(data.RetData.antGain);
	    			g_data.antHight = $.utils.getNotNullVal(data.RetData.antHight);
	   		}
		},
	});
}