var $table = $('#tableList'), g_operRights = [];
var g_positionDict = [];

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
	g_positionDict = top.app.getDictDataByDictTypeValue('SCMS_ADVERT_POSITIOIN');
	top.app.addComboBoxOption($("#searchPosition"), g_positionDict, true);
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
            advertName: $("#searchAdvertName").val(),
            position: $("#searchPosition").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/base/getAdvertInfoList",   		//请求后台的URL（*）
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
		$("#searchAdvertName").val("");
        $("#searchPosition").val("");
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#scmsAdvertInfoAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.positionDict = g_positionDict;
		params.operUrl = top.app.conf.url.apigateway + $("#scmsAdvertInfoAdd").data('action-url');
		top.app.layer.editLayer('新增APP广告位', ['710px', '400px'], '/scms/base/scms-advert-info-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	// 排序
	$("#scmsAdvertInfoSaveOrder").click(function () {
		//获取所有项,并根据当前排序设置排序ID
		var dataRows = $table.bootstrapTable('getData');
		if(dataRows.length <= 1){
   			top.app.message.notice("少于或等于一条数据的时候不用排序！");
   			return;
		}
		var list = [];
		for(var i = 0; i < dataRows.length; i++){
			obj = new Object();
			obj.id = dataRows[i].id;
			obj.disOrder = i;
			list.push(obj);
		}
		appTable.postData($table, $("#scmsAdvertInfoSaveOrder").data('action-url'), JSON.stringify(list),
				"确定要保存当前的排序结果？", "数据保存成功！");
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

function scmsAdvertInfoEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.type = 'edit';
	params.rows = row;
	params.positionDict = g_positionDict;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('编辑APP广告位', ['710px', '400px'], '/scms/base/scms-advert-info-edit.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function scmsAdvertInfoDel(id, url){
	appTable.delData($table, url, id + "");
}

function formatPosition(value, row) {
	return appTable.tableFormatDictValue(g_positionDict, value);
}

//格式化图片
function formatImage(value, row, index){
	if($.utils.isEmpty(value)) return "";
	else {
		var tmpImage = top.app.conf.url.res.url + value;
		return '<a href="' + tmpImage + '" target="_blank" onMouseOver="scms.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="scms.onMouseOutImage()" title="">显示图片</a>'
	}
}
