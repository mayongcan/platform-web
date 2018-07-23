var $table = $('#tableList'), g_operRights = [], g_sexDict = [];

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
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
}

/**
 * 初始化搜索面板
 * @returns
 */
function initSearchPanel(){
	//搜索面板高度
	appTable.searchPannelHeight = $('#searchPannel').outerHeight(true);
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
		if(g_operRights[i].dispPosition == '1'){
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
            tenantsId: top.app.info.userInfo.tenantsId,
			userType: "2",		//2代表APP端
			userName: $("#searchName").val(),
			status: $("#searchStatus").val(),
			mobile: $("#searchMobile").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.system.user.getUserList,   		//请求后台的URL（*）
        queryParams: searchParams,											//传递参数（*）
        uniqueId: 'userId',
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
		$("#searchStatus").val("");
		$("#searchMobile").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#ItpUserPointSourceBind").click(function () {//设置参数
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/user/user-point-bind-list.html?_pid=" + pid + "&backUrl=/itp/user/user-list.html";
		window.location.href = encodeURI(url);
    });
	$("#itpUserCostLog").click(function () {//设置参数
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/itp/user/user-cost-log.html?_pid=" + pid + "&backUrl=/itp/user/user-list.html";
		window.location.href = encodeURI(url);
    });
}

function tableFormatStatus(value, row) {
	if(value == '0') return "<span style='color:red'>禁用</span>";
	else return "<span style='color:green'>正常</span>";
}

function tableFormatSex(value, row) {
	return appTable.tableFormatDictValue(g_sexDict, value);
}

function tableFormatLocation(value, row) {
	if($.utils.isEmpty(value)) return '';
	else {
		var location = value.split(",");
		if(!$.utils.isEmpty(location[0]) && !$.utils.isEmpty(location[1]))
			return '<span style="color:red;cursor:pointer;" onclick="showLocation(\'' + location[0] + '\',\'' + location[1] + '\')">查看</span>';
		else return "";
	}
}

function showLocation(longitude, latitude){
	//设置参数
	var params = {};
	params.longitude = longitude;
	params.latitude = latitude;
	top.app.layer.editLayer('显示用户定位', ['900px', '550px'], '/itp/user/user-location.html', params, function(retParams){});
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
	//根据权限是否显示操作菜单
	var length = g_operRights.length;
	var operateBtn = "";
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].dispPosition == '2'){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.userId + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function itpUserChangePwd(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.row = row;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('修改用户密码', ['710px', '400px'], '/itp/user/user-list-change-pwd.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function itpDisableUser(id, url){
	appTable.postData($table, url, id + "", "确定要禁用当前用户？", "用户禁用成功！");
}

function itpEnableUser(id, url){
	appTable.postData($table, url, id + "", "确定要解禁当前用户？", "用户解禁成功！");
}