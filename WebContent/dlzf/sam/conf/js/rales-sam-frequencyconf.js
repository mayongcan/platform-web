var $table = $('#tableList'), g_operRights = [];
var g_areaTypeDict = null;
var g_regionDict = null;
var g_gropuDict = null;
var g_frequencyTypeDict = null;

$(function () {
	//初始化字典
	initView();
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始基础视图
 * @returns
 */
function initView(){
	g_areaTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_AREATYPE');
	g_regionDict = top.app.getDictDataByDictTypeValue('SAM_FREQUENCYCONF_REGION');
	g_gropuDict = top.app.getDictDataByDictTypeValue('SAM_FREQUENCYCONF_GROPU');
	g_frequencyTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_FREQUENCYTYPE');
	top.app.addComboBoxOption($("#searchAreaType"), g_areaTypeDict, true);
	top.app.addComboBoxOption($("#searchRegion"), g_regionDict, true);
	top.app.addComboBoxOption($("#searchGropu"), g_gropuDict, true);
	top.app.addComboBoxOption($("#searchFrequencyType"), g_frequencyTypeDict, true);
}

/**
 * 初始化权限
 */
function initFunc(){
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		//显示在列表上方的权限菜单
		if(g_operRights[i].dispPosition == '1' || g_operRights[i].dispPosition == undefined){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
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
            stationType: '1',
			areaType: $("#searchAreaType").val(),
			region: $("#searchRegion").val(),
			gropu: $("#searchGropu").val(),
			frequencyType: $("#searchFrequencyType").val(),
			frequencyCode: $("#searchFrequencyCode").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/sam/conf/getConfList",   		//请求后台的URL（*）
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
		$("#searchAreaType").val("");
		$("#searchRegion").val("");
		$("#searchGropu").val("");
		$("#searchFrequencyType").val("");
		$("#searchFrequencyCode").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#ralesSamFrequencyconfAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.areaTypeDict = g_areaTypeDict;
		params.regionDict = g_regionDict;
		params.gropuDict = g_gropuDict;
		params.frequencyTypeDict = g_frequencyTypeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#ralesSamFrequencyconfAdd").data('action-url');
		top.app.layer.editLayer('新增', ['710px', '460px'], '/rales/sam/conf/rales-sam-frequencyconf-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2'){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function ralesSamFrequencyconfEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.type = 'edit';
	params.rows = row;
	params.areaTypeDict = g_areaTypeDict;
	params.regionDict = g_regionDict;
	params.gropuDict = g_gropuDict;
	params.frequencyTypeDict = g_frequencyTypeDict;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('编辑', ['710px', '460px'], '/rales/sam/conf/rales-sam-frequencyconf-edit.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function ralesSamFrequencyconfDel(id, url){
	appTable.delData($table, url, id + "");
}

function formatAreaType(value,row,index){
	return appTable.tableFormatDictValue(g_areaTypeDict, value);
}
function formatRegion(value,row,index){
	return appTable.tableFormatDictValue(g_regionDict, value);
}
function formatGropu(value,row,index){
	return appTable.tableFormatDictValue(g_gropuDict, value);
}
function formatFrequencyType(value,row,index){
	return appTable.tableFormatDictValue(g_frequencyTypeDict, value);
}

