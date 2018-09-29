var g_nextStatus = 0;
var g_modeDict = [];
var g_dataObj = {};
var g_map = null, g_searchVal = "", g_isMapClick = false, g_mapGeoc = null;
var g_netSvnDict = [], g_netStDict = [];
var g_freqPoint = "";
var g_isLoadFreq = false;

$(function () {
	top.app.message.loading();
	initDict();
	initView();
	g_map = rales.createMap("map-container");//创建地图 
	g_mapGeoc = new BMap.Geocoder();  
	addMapSearch();
	top.app.message.loadingClose();
});

function initDict(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getNetStDict",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				g_netStDict = data.RetData;
//				top.app.addComboBoxOption($("#telMode"), g_netStDict, false);
//				$('.selectpicker').selectpicker('refresh');
	   		}
		}
	});
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getNetSvnDict",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   	},
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				g_netSvnDict = data.RetData;
				top.app.addComboBoxOption($("#sysType"), g_netSvnDict, false);
				$('.selectpicker').selectpicker('refresh');
				var tmpList = [];
				for(var i = 0; i < g_netStDict.length; i++){
					if(g_netStDict[i].ID.indexOf($("#sysType").val()) != -1){
						tmpList.push(g_netStDict[i]);
					}
				}
				top.app.addComboBoxOption($("#telMode"), tmpList, false);
				$('.selectpicker').selectpicker('refresh');
	   		}
		}
	});
	$('#sysType').on('changed.bs.select',
		function(e) {
			var tmpList = [];
			for(var i = 0; i < g_netStDict.length; i++){
				if(g_netStDict[i].ID.indexOf($("#sysType").val()) != -1){
					tmpList.push(g_netStDict[i]);
				}
			}
			top.app.addComboBoxOption($("#telMode"), tmpList, false);
			$('.selectpicker').selectpicker('refresh');
		}
	);
}

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
		$('#divButton').css('display', '');
	}else if(g_nextStatus == 1){
		$("#freqBegin1").val($("#freqBegin").val());
		$("#freqEnd1").val($("#freqEnd").val());
		
		$('#boxTitle2').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', '');
		$('#boxContent3').css('display', 'none');
		$('#boxContent4').css('display', 'none');
		$('#divButton').css('display', '');
	}else if(g_nextStatus == 2){
		$('#boxTitle3').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', 'none');
		$('#boxContent3').css('display', '');
		$('#boxContent4').css('display', 'none');
		$('#divButton').css('display', '');
	}else if(g_nextStatus == 3){
		$("#receivingThreshold1").val($("#receivingThreshold").val());
		$("#recHeight1").val($("#recHeight").val());
		
		$('#boxTitle4').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', 'none');
		$('#boxContent3').css('display', 'none');
		$('#boxContent4').css('display', '');
	}else if(g_nextStatus == 4){
		$("#receivingThreshold1").val($("#receivingThreshold").val());
		$("#recHeight1").val($("#recHeight").val());
		
		$('#boxTitle4').addClass('activiteBox');
		$('#boxContent1').css('display', 'none');
		$('#boxContent2').css('display', 'none');
		$('#boxContent3').css('display', 'none');
		$('#boxContent4').css('display', '');
		$('#divButton').css('display', 'none');
		$('#divButtonPdf').css('display', '');
	}
}


function initView(){
	g_modeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_SPREAD_MODE');
	top.app.addComboBoxOption($("#spreadMode"), g_modeDict);
	$('.selectpicker').selectpicker('refresh');
	//提交
	$("#btnOK").click(function () {
		//切换状态
		if(g_nextStatus == 0) {
			submitAction1();
		}
		else if(g_nextStatus == 1) {
			if(!g_isLoadFreq){
				g_isLoadFreq = true;
				submitAction2();
			}
			else{
				//弹出窗口 设置参数
				var params = {};
				params.id = g_dataObj.id;
				top.app.layer.editLayer('频率指配', ['900px', '550px'], '/rales/sam/frequency/frequency-assign-box.html', params, function(retParams){
					if(retParams == null || retParams == undefined && retParams.length > 0) {
						top.app.message.alert("获取返回内容失败！");
						return;
					}
					g_freqPoint = retParams[0].freqPoint;
					g_nextStatus = 2;
		   			//重新加载数据
		   			loadView();
				});
			}
		}
		else if(g_nextStatus == 2) {
			submitAction3();
		}
		else if(g_nextStatus == 3) {
			submitAction4();
		}
    });
	$("#btnPdf1").click(function () {
		window.open(top.app.conf.url.res.url + g_dataObj.pdfPath1);
    });
	$("#btnPdf2").click(function () {
		window.open(top.app.conf.url.res.url + g_dataObj.pdfPath2);
    });
	$("#btnPdf3").click(function () {
		window.open(top.app.conf.url.res.url + g_dataObj.pdfPath3);
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
	top.app.message.loading(0);
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
	submitData["antGain"] = $("#antGain").val();
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
	top.app.message.loading(0);
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
	submitData["freqPoint"] = g_freqPoint;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/nextSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_dataObj = data.RetData
				//弹出窗口 设置参数
				var params = {};
				params.id = g_dataObj.id;
				top.app.layer.editLayer('频率指配', ['900px', '550px'], '/rales/sam/frequency/frequency-assign-box.html', params, function(retParams){
					if(retParams == null || retParams == undefined && retParams.length > 0) {
						top.app.message.notice("获取返回内容失败！");
						return;
					}
					g_freqPoint = retParams[0].freqPoint;
					g_nextStatus = 2;
		   			//重新加载数据
		   			loadView();
				});
				
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
	top.app.message.loading(0);
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_dataObj.id;
	submitData["recHeight"] = $("#recHeight").val();
	submitData["cpmRadius"] = $("#cpmRadius").val();
	submitData["nextStatus"] = g_nextStatus;
	submitData["freqPoint"] = g_freqPoint;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/nextSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_dataObj = data.RetData
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
	top.app.message.loading(0);
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_dataObj.id;
	submitData["receivingThreshold"] = $("#receivingThreshold1").val();
	submitData["recHeight"] = $("#recHeight1").val();
	submitData["nextStatus"] = g_nextStatus;
	submitData["freqPoint"] = g_freqPoint;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/nextSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_dataObj = data.RetData
				g_nextStatus = 4;
	   			//重新加载数据
	   			loadView();
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