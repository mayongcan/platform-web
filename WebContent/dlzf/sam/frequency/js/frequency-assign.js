var g_nextStatus = 0;
var g_modeDict = [];
var g_dataObj = null;
var g_map = null, g_searchVal = "", g_isMapClick = false, g_mapGeoc = null;;

$(function () {
	top.app.message.loading(); 
	initView();
	g_map = rales.createMap("map-container");//创建地图 
	g_mapGeoc = new BMap.Geocoder();  
	addMapSearch();
	top.app.message.loadingClose();
});

function loadView(){
	$('#boxTitle1').removeClass('activiteBox');
	$('#boxTitle2').removeClass('activiteBox');
	$('#boxTitle3').removeClass('activiteBox');
	$('#boxTitle4').removeClass('activiteBox');
	if(g_nextStatus == 0){
		$('#boxTitle1').addClass('activiteBox');
		$('#boxContent1').css('display', '');
		$('#boxContent2').css('display', 'none');
		$('#boxContent3').css('display', 'none');
		$('#boxContent4').css('display', 'none');
	}else if(g_nextStatus == 1){
		$("#freqBegin1").val($("#freqBegin").val());
		$("#freqEnd1").val($("#freqEnd").val());
		
		$('#boxTitle2').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', '');
		$('#boxContent3').css('display', 'none');
		$('#boxContent4').css('display', 'none');
	}else if(g_nextStatus == 2){
		$('#boxTitle3').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', 'none');
		$('#boxContent3').css('display', '');
		$('#boxContent4').css('display', 'none');
	}else if(g_nextStatus == 3){
		$("#receivingThreshold1").val($("#receivingThreshold").val());
		$("#recHeight1").val($("#recHeight").val());
		
		$('#boxTitle4').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', 'none');
		$('#boxContent3').css('display', 'none');
		$('#boxContent4').css('display', '');
	}
}


function initView(){
	g_modeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_SPREAD_MODE');
	top.app.addComboBoxOption($("#spreadMode"), g_modeDict);
	//提交
	$("#btnOK").click(function () {
		//切换状态
		if(g_nextStatus == 0) {
			submitAction1();
		}
		else if(g_nextStatus == 1) {
			submitAction2();
		}
		else if(g_nextStatus == 2) {
			submitAction3();
		}
		else if(g_nextStatus == 3) {
			submitAction4();
		}
    });
}

/**
 * 提交数据
 * @returns
 */
function submitAction1(){
	if($('#statName').val() == '') {
		top.app.message.notice("请输入台站名称！");
		return;
	}
	top.app.message.loading();
	//定义提交数据
	var submitData = {};
	submitData["statName"] = $("#statName").val();
	submitData["statAddr"] = $("#statAddr").val();
	submitData["statHeight"] = $("#statHeight").val();
	submitData["sysType"] = $("#sysType").val();
	submitData["telMode"] = $("#telMode").val();
	submitData["longitude"] = $("#longitude").val();
	submitData["latitude"] = $("#latitude").val();
	submitData["freqBegin"] = $("#freqBegin").val();
	submitData["freqEnd"] = $("#freqEnd").val();
	submitData["workType"] = $('#divWorkType input:radio:checked').val();
	submitData["pow"] = $("#pow").val();
	submitData["recStatus"] = $("#recStatus").val();
	submitData["antennaHeight"] = $("#antennaHeight").val();
	submitData["antennaMode"] = $("#antennaMode").val();
	submitData["antennaAngle"] = $("#antennaAngle").val();
	submitData["diAngle"] = $("#diAngle").val();
	submitData["memo"] = $("#memo").val();
	submitData["nextStatus"] = g_nextStatus;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/addSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_nextStatus = 1;
				g_dataObj = data.RetData
	   			//重新加载数据
	   			loadView();
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 提交数据
 * @returns
 */
function submitAction2(){
	top.app.message.loading();
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_dataObj.id;
	submitData["receivingThreshold"] = $("#receivingThreshold").val();
	submitData["ciThreshold"] = $("#ciThreshold").val();
	submitData["freqBegin"] = $("#freqBegin1").val();
	submitData["freqEnd"] = $("#freqEnd1").val();
	submitData["freqStep"] = $("#freqStep").val();
	submitData["senderHeight"] = $("#senderHeight").val();
	submitData["recStspreadModeatus"] = $("#spreadMode").val();
	submitData["nextStatus"] = g_nextStatus;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/nextSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_nextStatus = 2;
	   			//重新加载数据
	   			loadView();
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 提交数据
 * @returns
 */
function submitAction3(){
	top.app.message.loading();
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_dataObj.id;
	submitData["recHeight"] = $("#recHeight").val();
	submitData["cpmRadius"] = $("#cpmRadius").val();
	submitData["nextStatus"] = g_nextStatus;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/nextSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_nextStatus = 3;
	   			//重新加载数据
	   			loadView();
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


/**
 * 提交数据
 * @returns
 */
function submitAction4(){
	top.app.message.loading();
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_dataObj.id;
	submitData["receivingThreshold"] = $("#receivingThreshold1").val();
	submitData["recHeight"] = $("#recHeight1").val();
	submitData["nextStatus"] = g_nextStatus;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/nextSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


//添加地图模糊搜索
function addMapSearch() {
	var ac = new BMap.Autocomplete({ // 建立一个自动完成的对象
		"input" : "statAddr",
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