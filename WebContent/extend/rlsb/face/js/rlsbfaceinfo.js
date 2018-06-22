var $table = $('#tableList'), g_operRights = [];
var g_sexDict = null;
var g_credentialsTypeDict = null;

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
	//初始化
	$("[data-fancybox]").fancybox({});
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	g_credentialsTypeDict = top.app.getDictDataByDictTypeValue('SYS_CREDENTIALS_TYPE');
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	top.app.addComboBoxOption($("#searchSex"), g_sexDict, true);
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
			name: $("#searchName").val(),
			sex: $("#searchSex").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/extend/rlsb/face/getList",   		//请求后台的URL（*）
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
		$("#searchName").val("");
		$("#searchSex").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#rlsbFaceInfoAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.sexDict = g_sexDict;
		params.credentialsTypeDict = g_credentialsTypeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#rlsbFaceInfoAdd").data('action-url');
		top.app.layer.editLayer('新增数据分析', ['710px', '400px'], '/extend/rlsb/face/rlsbfaceinfo-edit.html', params, function(){
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

function rlsbFaceInfoEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.type = 'edit';
	params.rows = row;
	params.sexDict = g_sexDict;
	params.credentialsTypeDict = g_credentialsTypeDict;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('编辑数据分析', ['710px', '400px'], '/extend/rlsb/face/rlsbfaceinfo-edit.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function rlsbFaceInfoDel(id, url){
	appTable.delData($table, url, id + "");
}

function rlsbFaceCheckPhoto(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.rows = row;
	top.app.layer.editLayerWidthMax('显示图片', ['710px', '500px'], '/extend/rlsb/face/rlsbfaceinfo-view.html', params, function(){});
}

function rlsbFaceTack(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置传送对象
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.row = row;
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "/extend/rlsb/face/track-info.html?_pid=" + pid + "&backUrl=/extend/rlsb/face/rlsbfaceinfo.html";
	window.location.href = encodeURI(url);
}


function formatSex(value,row,index){
	var i = g_sexDict.length;
	while (i--) {
		if(g_sexDict[i].ID == value){
			return g_sexDict[i].NAME;
		}
	}
	return "未知";
}
function formatCredentialsType(value,row,index){
	var i = g_credentialsTypeDict.length;
	while (i--) {
		if(g_credentialsTypeDict[i].ID == value){
			return g_credentialsTypeDict[i].NAME;
		}
	}
	return "未知";
}


