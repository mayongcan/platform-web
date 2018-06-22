var g_map = null, g_rows = null, g_statTypeDict = [], g_areaTypeDict = [], g_networkDict = [];
var g_searchVal = "", g_isMapClick = false, g_mapGeoc = null;
var g_frequencyIndex = 1;
$(function () {
	top.app.message.loading();
    initView();
	formValidate();
	g_map = rales.createMap("map-container");//创建地图  
	rales.setMapEvent(g_map);//设置地图事件  
	rales.addMapControl(g_map);//向地图添加控件  
	g_mapGeoc = new BMap.Geocoder();  
	addMapSearch();
	top.app.message.loadingClose();
});

function initView(){
    g_statTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_SPECTRALANALYSIS_TYPE');
    g_areaTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_AREATYPE');
    g_networkDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_FREQUENCYTYPE');
	top.app.addComboBoxOption($("#statType"), g_statTypeDict);
	top.app.addComboBoxOption($("#areaType"), g_areaTypeDict);
	top.app.addComboBoxOption($("#network"), g_networkDict);

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
	$("#btnAddFrequency").click(function () {
		var html = '<div class="form-group edit-group-style" id="divEachFrequency' + g_frequencyIndex + '">' + 
				    		'<label class="col-sm-2 control-label edit-layer-title"></label>' + 
			            '<input type="text" id="frequency' + g_frequencyIndex + '" name="frequency' + g_frequencyIndex + '" class="form-control m-b edit-layer-input" style="width:115px;">' + 
			            '<label class="control-label page-search-label" style="border: 1px solid #E5E6E7;margin-left: 10px;padding: 5px 5px;">MHz</label>' + 
			            '<button type="button" class="btn btn-outline btn-default" style="margin-left:10px" onclick=removeFrequency(' + g_frequencyIndex + ')>' + 
			            		'<i class="glyphicon glyphicon-minus" aria-hidden="true"></i>' + 
			            	'</button>' + 
			        '</div>';
		$('#divFrequencyList').append(html);
		g_frequencyIndex++;
    });
}

//移除
function removeFrequency(index){
	if(document.getElementById("divEachFrequency" + index)){
		$('#divEachFrequency' + index).remove();
	}
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
        	frequency: {required: true},
        	address: {required: true},
        	serviceRadius: {required: true},
        	recommendNumber: {required: true, digits: true},
        	monitoringStation: {required: true},
        	beginDate: {required: true},
        	endDate: {required: true},
        	receivingThreshold: {required: true},
        	ciThreshold: {required: true},
        	receivingHeight: {required: true},
        	pow: {required: true},
        	gain: {required: true},
        	feedLoss: {required: true},
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
            //提交内容
        		submitAction();
        }
    });
}

function submitAction(){
	if($('#frequency').val() == ''){
		top.app.message.notice("请输入频点！");
		return;
	}
	if($('#address').val() == ''){
		top.app.message.notice("请输入地址！");
		return;
	}
	if($('#serviceRadius').val() == ''){
		top.app.message.notice("请输入服务半径！");
		return;
	}
	if($('#recommendNumber').val() == '' || !$.validate.isPositiveInt($('#recommendNumber').val())){
		top.app.message.notice("请输入正确的推荐频点数量！");
		return;
	}
	if($('#monitoringStation').val() == ''){
		top.app.message.notice("请输入监测站点数据！");
		return;
	}
	if($('#beginDate').val() == ''){
		top.app.message.notice("请输入监测开始时间！");
		return;
	}
	if($('#endDate').val() == ''){
		top.app.message.notice("请输入检测结束时间！");
		return;
	}
	//获取所有频点列表
	var frequencyList = $('#frequency').val() + ",";
	for(var i = 0; i < g_frequencyIndex; i++){
		if(document.getElementById("divEachFrequency" + i) && document.getElementById("frequency" + i)){
			frequencyList += $('#frequency' + i).val() + ",";
		}
	}
	frequencyList = frequencyList.substring(0, frequencyList.length - 1);
	//提交数据
	var submitData = {};
	submitData["type"] = $('#statType').val();
	submitData["coverageArea"] = $('#areaType').val();
	submitData["network"] = $("#network").val();
	submitData["frequency"] = frequencyList;
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
	submitData["pow"] = $("#pow").val();
	submitData["gain"] = $("#gain").val();
	submitData["feedLoss"] = $("#feedLoss").val();

	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/addSpectralanalysis?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("操作成功！");
	   			//页面跳转
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = "frequency.html?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}