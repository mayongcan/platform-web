var g_map = null, g_rows = null, g_statTypeDict = [], g_areaTypeDict = [], g_networkDict = [];
var g_searchVal = "", g_isMapClick = false, g_mapGeoc;
var g_filePath = null, g_fileSize = 0;
$(function () {
	top.app.message.loading();
    initView();
	formValidate();
	g_map = rales.createMap("map-container");//创建地图  
	rales.setMapEvent(g_map);//设置地图事件  
	rales.addMapControl(g_map);//向地图添加控件  
	g_mapGeoc = new BMap.Geocoder();  
	addMapSearch();
	addInfo();
	top.app.message.loadingClose();
});

function initView(){
    g_statTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_SPECTRALANALYSIS_TYPE');
    g_areaTypeDict = top.app.getDictDataByDictTypeValue('SAM_FREQUENCYCONF_REGION');
    g_networkDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_FREQUENCYTYPE');
	top.app.addComboBoxOption($("#statType"), g_statTypeDict);
	top.app.addComboBoxOption($("#areaType"), g_areaTypeDict);
	top.app.addComboBoxOption($("#network"), g_networkDict);
	$('.selectpicker').selectpicker('refresh');

	//实现日期联动
	$.date.initSearchDate('divBeginDate', 'divEndDate');
//	$('#divBeginDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});
//	$('#divEndDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, useCurrent: false});

	$("#btnHandle").click(function () {
		$("form").submit();
    });
	//启动地图选点
	$("#btnMapSelect").click(function () {
		if(g_isMapClick) {
			$('#btnMapSelect').text("启动地图选点");
			g_isMapClick = false;
			g_map.removeEventListener("click", getMapClickInfo);
		}else{
			$('#btnMapSelect').text("请在地图上选择位置");
			g_isMapClick = true;
			g_map.addEventListener("click", getMapClickInfo);
		}
    });
	$("#btnStationSelect").click(function () {
		
    });

	// 下拉框变更事件
	$('#statType').on('changed.bs.select',
		function(e) {loadStatTypeDown();}
	);

	// 下拉框变更事件
	$('#network').on('changed.bs.select',
		function(e) {loadNetworkDown();}
	);

	// 下拉框变更事件
	$('#freqType').on('changed.bs.select',
		function(e) {loadFreqTypeDown();}
	);
	
	$('input[type=checkbox][id=showDefaultVal]').change(function() {
		if($('#showDefaultVal').prop('checked')){
			$('#receivingThreshold').val("-107");
			$('#ciThreshold').val("10");
			$('#receivingHeight').val("100");
			$('#freqStep').val("0.0125");
		}
    });
	$('#filesPath').prettyFile({text:"请选择文件"});
}

function loadStatTypeDown(){
	if ($('#statType').val() == '1') {
		$('#divAreaType').css("display", "");
		$('#divNetwork').css("display", "");
		$('#divFreqType').css("display", "none");
		loadNetworkDown();
	} else if($('#statType').val() == '2'){
		$('#divAreaType').css("display", "none");
		$('#divNetwork').css("display", "none");
		$('#divFreqType').css("display", "none");
	}else if($('#statType').val() == '3'){
		$('#divAreaType').css("display", "none");
		$('#divNetwork').css("display", "none");
		$('#divFreqType').css("display", "");
		loadFreqTypeDown();
	}
}

function loadNetworkDown(){
	if ($('#network').val() == '1' || $('#network').val() == '2') {
		$('#divCenterFrequency').css("display", "");
		$('#divMobileFrequency').css("display", "none");
		$('#divBaseFrequency').css("display", "none");
	} else {
		$('#divCenterFrequency').css("display", "none");
		$('#divMobileFrequency').css("display", "");
		$('#divBaseFrequency').css("display", "");
	}
}

function loadFreqTypeDown(){
	if ($('#freqType').val() == '1') {
		$('#divCenterFrequency').css("display", "");
		$('#divMobileFrequency').css("display", "none");
		$('#divBaseFrequency').css("display", "none");
	} else {
		$('#divCenterFrequency').css("display", "none");
		$('#divMobileFrequency').css("display", "");
		$('#divBaseFrequency').css("display", "");
	}
}

function addInfo(){
	//判断是否输入内容
	var add = $.utils.getUrlParam(window.location.search,"add");
	if(!$.utils.isEmpty(add)){
		var row = g_params = top.app.info.iframe.params.row;
		$('#statType').val(row.type);
		$('#areaType').val(row.areaType);
		if(row.type == '1')
			$('#network').val(row.network);
		else if(row.type == '3')
			$('#freqType').val(row.network);
		if(!$.utils.isEmpty(row.centerFrequency)){
			var array = row.centerFrequency.split('-');
			$('#centerFrequency1').val(array[0]);
			$('#centerFrequency2').val(array[1]);
		}
		if(!$.utils.isEmpty(row.mobileStation)){
			var array = row.mobileStation.split('-');
			$('#mobileStation1').val(array[0]);
			$('#mobileStation2').val(array[1]);
		}
		if(!$.utils.isEmpty(row.baseStation)){
			var array = row.baseStation.split('-');
			$('#baseStation1').val(array[0]);
			$('#baseStation2').val(array[1]);
		}
		$('#address').val(row.address);
		$('#longitude').val(row.longitude);
		$('#latitude').val(row.latitude);
		$('#serviceRadius').val(row.serviceRadius);
		$('#recommendNumber').val(row.recommendNumber);
		
		$('#receivingThreshold').val(row.receivingThreshold);
		$('#ciThreshold').val(row.ciThreshold);
		$('#receivingHeight').val(row.receivingHeight);
		$('#freqStep').val(row.freqStep);
		$('#pow').val(row.pow);
		$('#gain').val(row.gain);
		$('#feedLoss').val(row.feedLoss);
		
		setTimeout(function () {
			$('#address').val(row.address);
	    }, 1000);
	}
	
	loadStatTypeDown();
	$('.selectpicker').selectpicker('refresh');
}

//地图点击事件
function getMapClickInfo(e){
	$('#longitude').val(e.point.lng);
	$('#latitude').val(e.point.lat);
	var pt = e.point;
	g_map.clearOverlays(); // 清除地图上所有覆盖物
	//添加坐标点
	g_map.addOverlay(new BMap.Marker(pt));
	//进行地址解析
	g_mapGeoc.getLocation(pt, function(rs){
		var addComp = rs.addressComponents;
		$('#address').val(addComp.province  + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
	});      
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
			g_map.centerAndZoom(pp, 18);
			g_map.addOverlay(new BMap.Marker(pp)); // 添加标注
			//将坐标写入经纬度
			$('#longitude').val(pp.lng);
			$('#latitude').val(pp.lat);
		}
	});
	local.search(g_searchVal);
}
/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	centerFrequency1: {required: true},
        	centerFrequency2: {required: true},
        	mobileStation1: {required: true},
        	mobileStation2: {required: true},
        	baseStation1: {required: true},
        	baseStation2: {required: true},
        	address: {required: true},
        	serviceRadius: {required: true, digits: true},
        	recommendNumber: {required: true, digits: true},
//        	monitoringStation: {required: true},
//        	beginDate: {required: true},
//        	endDate: {required: true},
//        	receivingThreshold: {required: true},
//        	ciThreshold: {required: true},
//        	receivingHeight: {required: true},
//        	pow: {required: true},
//        	gain: {required: true},
//        	feedLoss: {required: true},
        },
        messages: {
        },
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
                return false;
            });  
        },
        //失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
            //先上传文件
        	uploadFile();
        	//submitAction();
        }
    });
}

function submitAction(){
	//提交数据
	var submitData = {};
	submitData["analysisType"] = "1";
	submitData["type"] = $('#statType').val();
	submitData["coverageArea"] = $('#areaType').val();
	if($('#statType').val() == '1'){
		submitData["network"] = $("#network").val();
		if($("#network").val() == '1' || $("#network").val() == '2')
			submitData["centerFrequency"] = $("#centerFrequency1").val() + "-" + $("#centerFrequency2").val();
		else{
			submitData["mobileStation"] = $("#mobileStation1").val() + "-" + $("#mobileStation2").val();
			submitData["baseStation"] = $("#baseStation1").val() + "-" + $("#baseStation2").val();
		}
	}else if($('#statType').val() == '2'){
		submitData["centerFrequency"] = $("#centerFrequency1").val() + "-" + $("#centerFrequency2").val();
	}else if($('#statType').val() == '3'){
		submitData["network"] = $("#freqType").val();
		if($("#freqType").val() == '1')
			submitData["centerFrequency"] = $("#centerFrequency1").val() + "-" + $("#centerFrequency2").val();
		else{
			submitData["mobileStation"] = $("#mobileStation1").val() + "-" + $("#mobileStation2").val();
			submitData["baseStation"] = $("#baseStation1").val() + "-" + $("#baseStation2").val();
		}
	}
	submitData["address"] = $("#address").val();
	submitData["longitude"] = $("#longitude").val();
	submitData["latitude"] = $("#latitude").val();
	submitData["serviceRadius"] = $("#serviceRadius").val();
	submitData["recommendNumber"] = $("#recommendNumber").val();
	submitData["monitoringStation"] = $("#monitoringStation").val();
	submitData["beginDate"] = $("#beginDate").val();
	submitData["endDate"] = $("#endDate").val();
	submitData["receivingThreshold"] = $("#receivingThreshold").val();
	submitData["ciThreshold"] = $("#ciThreshold").val();
	submitData["receivingHeight"] = $("#receivingHeight").val();
	submitData["freqStep"] = $("#freqStep").val();
	submitData["pow"] = $("#pow").val();
	submitData["gain"] = $("#gain").val();
	submitData["feedLoss"] = $("#feedLoss").val();
	//分析文件路径
	submitData["filePath"] = g_filePath;

	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/addSpectralanalysis?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
//	   			top.app.message.notice("操作成功！");
//	   			//页面跳转
//	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
//	   			window.location.href = "frequency.html?_pid=" + pid;
				loadResult(data.RetData);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function uploadFile(){
	if($('#statType').val() == '1'){
		if ($('#network').val() == '1' || $('#network').val() == '2'){
			if($('#centerFrequency1').val() == '' || $('#centerFrequency1').val() == ''){
				top.app.message.notice("请输入中心频率！");
				return;
			}
		}else{
			if($('#mobileStation1').val() == '' || $('#mobileStation2').val() == ''){
				top.app.message.notice("请输入移动台发射频率！");
				return;
			}
			if($('#baseStation1').val() == '' || $('#baseStation2').val() == ''){
				top.app.message.notice("请输入基地台发射频率！");
				return;
			}
		}
	}else if($('#statType').val() == '2'){
		if($('#centerFrequency1').val() == '' || $('#centerFrequency1').val() == ''){
			top.app.message.notice("请输入中心频率！");
			return;
		}
	}else if($('#statType').val() == '3'){
		if ($('#freqType').val() == '1'){
			if($('#centerFrequency1').val() == '' || $('#centerFrequency1').val() == ''){
				top.app.message.notice("请输入中心频率！");
				return;
			}
		}else{
			if($('#mobileStation1').val() == '' || $('#mobileStation2').val() == ''){
				top.app.message.notice("请输入移动台发射频率！");
				return;
			}
			if($('#baseStation1').val() == '' || $('#baseStation2').val() == ''){
				top.app.message.notice("请输入基地台发射频率！");
				return;
			}
		}
	}
	if($('#address').val() == ''){
		top.app.message.notice("请输入地址！");
		return;
	}
	if($('#serviceRadius').val() == ''){
		top.app.message.notice("请输入覆盖半径！");
		return;
	}
	if(parseInt($('#serviceRadius').val()) < 1){
		top.app.message.notice("覆盖半径必须不小于1km！");
		return;
	}
	if($('#recommendNumber').val() == '' || !$.validate.isPositiveInt($('#recommendNumber').val())){
		top.app.message.notice("请输入正确的推荐频点数量！");
		return;
	}
	
	if($("#filesPath")[0].files[0] == null || $("#filesPath")[0].files[0] == undefined){
		submitAction();
		return;
	}
	top.app.message.loading(0);
	var formData = new FormData();
	formData.append("file",	$("#filesPath")[0].files[0]);
	formData.append("modifyName", ""); 
	$.ajax({  
		url: top.app.conf.url.res.uploadFile,
        type: 'POST',  
        data: formData,  
        // 告诉jQuery不要去处理发送的数据
        processData : false, 
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        success : function(data) { 
        	if(top.app.message.code.success == data.RetCode){
        		top.app.message.notice("分析完成！");
        		g_filePath = data.RetData;
        		submitAction();
	   		}else{
	   			top.app.message.loadingClose();
	   			top.app.message.error(data.RetMsg);
	   		}
        },  
        error : function(responseStr) { 
        	top.app.message.loadingClose();
   			top.app.message.error("上传文件失败，请稍后重试！");
        }  
    }); 
}

function loadResult(data){
	$('#divResult').css('display', '');
	$('#btnResult').css('display', '');
	
	//添加列表内容
	$('#resultList').empty();
	if(data.singleFrequency == '1'){
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
	var html = "", length = 3;
	if(length > data.unAssignList.length) length = data.unAssignList.length;
	for(var i = 0; i < length; i++ ){
		if(data.singleFrequency == '1'){
			html += '<tr>' +
						'<td class="reference-td">' + data.unAssignList[i].frequencyCode + '</td>' +
						'<td class="reference-td">' + data.unAssignList[i].centerFrequency + 'Mhz</td>' +
					'</tr>';
		}else{
			html += '<tr>' +
						'<td class="reference-td">' + data.unAssignList[i].frequencyCode + '</td>' +
						'<td class="reference-td">' + data.unAssignList[i].mobileStation + 'Mhz</td>' +
						'<td class="reference-td">' + data.unAssignList[i].baseStation + 'Mhz</td>' +
					'</tr>';
		}
	}
	$('#resultList').append(html); 
	
	//点击事件
	$("#btnResult").click(function () {
		//设置传送对象
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = data.row;
		top.app.info.iframe.params.typeDict = g_statTypeDict;
		top.app.info.iframe.params.coverageAreaDict = g_areaTypeDict;
		top.app.info.iframe.params.networkDict = g_networkDict;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/rales/sam/frequency/frequency-detail.html?_pid=" + pid + "&backUrl=/rales/sam/frequency/frequency.html";
		window.location.href = encodeURI(url);
    });
}