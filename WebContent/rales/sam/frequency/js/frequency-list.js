var $table = $('#tableList');
var g_typeDict = null;
var g_coverageAreaDict = null;
var g_networkDict = null;

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
	g_typeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_SPECTRALANALYSIS_TYPE');
	g_coverageAreaDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_AREATYPE');
	g_networkDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_FREQUENCYTYPE');
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	top.app.addComboBoxOption($("#searchType"), g_typeDict, true);
	top.app.addComboBoxOption($("#searchCoverageArea"), g_coverageAreaDict, true);
	top.app.addComboBoxOption($("#searchNetwork"), g_networkDict, true);
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
			type: $("#searchType").val(),
			coverageArea: $("#searchCoverageArea").val(),
			network: $("#searchNetwork").val(),
			address: $("#searchAddress").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSpectralanalysisList",   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'id',
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//初始化Table相关信息
	appTable.initTable($table);
	
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchType").val("");
		$("#searchCoverageArea").val("");
		$("#searchNetwork").val("");
		$("#searchAddress").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
}
function formatOperate(value, row, index){
	return '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="operateButtonEdit(' + row.id + ')">' + 
				'<i class="glyphicon glyphicon-cog" aria-hidden="true"></i> 查询' + 
		   '</button>';
}

function operateButtonEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	top.app.info.iframe.params.typeDict = g_typeDict;
	top.app.info.iframe.params.coverageAreaDict = g_coverageAreaDict;
	top.app.info.iframe.params.networkDict = g_networkDict;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/rales/sam/frequency/frequency-detail.html?_pid=" + pid + "&backUrl=/rales/sam/frequency/frequency-list.html";
	window.location.href = encodeURI(url);
}

function formatType(value,row,index){
	var i = g_typeDict.length;
	while (i--) {
		if(g_typeDict[i].ID == value){
			return g_typeDict[i].NAME;
		}
	}
	return "未知";
}
function formatCoverageArea(value,row,index){
	var i = g_coverageAreaDict.length;
	while (i--) {
		if(g_coverageAreaDict[i].ID == value){
			return g_coverageAreaDict[i].NAME;
		}
	}
	return "未知";
}
function formatNetwork(value,row,index){
	var i = g_networkDict.length;
	while (i--) {
		if(g_networkDict[i].ID == value){
			return g_networkDict[i].NAME;
		}
	}
	return "未知";
}

