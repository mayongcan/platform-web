var $table = $('#tableList');

$(function () {
	//初始化字典
	initDict();
	//初始化搜索面板
	initSearchPanel();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	$('#divApprovedDateBegin').datetimepicker({locale: 'zh-CN',format: 'YYYY-MM'});
}

/**
 * 初始化权限
 */
function initFunc(){
	var g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
						"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
					 "</button>";
	}
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='caseDetail' data-action-url=''>" + 
					"<i class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></i> 查看" + 
				 "</button>";
	//添加默认权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
}

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
			deviceId: $("#searchDeviceId").val(),
			code: $("#searchCode").val(),
			model: $("#searchModel").val(),
			name: $("#searchName").val(),
			frequencyRange: $("#searchFrequencyRange").val(),
			transmissionPower: $("#searchTransmissionPower").val(),
			bandwidth: $("#searchBandwidth").val(),
			emissionLimits: $("#searchEmissionLimits").val(),
			vendor: $("#searchVendor").val(),
			approvedDateBegin: $("#approvedDateBegin").val(),
			periodDate: $("#searchPeriodDate").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/device/getDeviceList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        		appTable.setRowClickStatus($table, row, $el);
        },
        onDblClickRow: function(row, $el){
        		btnDetail(row);
	    }
    });
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchDeviceId").val("");
		$("#searchCode").val("");
		$("#searchModel").val("");
		$("#searchName").val("");
		$("#searchFrequencyRange").val("");
		$("#searchTransmissionPower").val("");
		$("#searchBandwidth").val("");
		$("#searchEmissionLimits").val("");
		$("#searchVendor").val("");
		$("#approvedDateBegin").val("");
		$("#searchPeriodDate").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	$("#caseDetail").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行查看！");
			return;
		}
		btnDetail(rows[0]);
    });
}

function btnDetail(row){
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/sam/device/device-detail.html?_pid=" + pid + "&backUrl=/rales/sam/device/device-type.html";
	window.location.href = encodeURI(url);
}


