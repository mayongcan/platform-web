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
	//获取店铺下拉列表
	itp.getShopPullDown($("#searchShopId"), itp.getUserMerchantsId(), true);
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
            merchantsId: itp.getUserMerchantsId(),
			isMerchantsAdmin: '0',
			shopId: $("#searchShopId").val(),
			userCode: $("#searchUserCode").val(),
			userName: $("#searchUserName").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/merchants/getMerchantsUserList",   		//请求后台的URL（*）
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
		$("#searchShopId").val("");
		$("#searchUserCode").val("");
		$("#searchUserName").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpMyStaffAdd").click(function () {//设置参数
		//设置参数
		var params = {};
		params.type = 'add';
		params.isMerchantsAdmin = "0";
		params.merchantsId = itp.getUserMerchantsId();
		params.tenantsId = top.app.info.userInfo.tenantsId;
		params.sexDict = g_sexDict;
		params.operUrl = top.app.conf.url.apigateway + $("#itpMyStaffAdd").data('action-url');
		top.app.layer.editLayer('新增员工', ['710px', '450px'], '/itp/merchants/merchants-user-edit.html', params, function(){
   			//重新加载
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
			if(row.isAdmin == '1' && g_operRights[i].funcFlag == 'itpMyStaffSetShopAdmin') continue;
			if(row.isAdmin == '0' && g_operRights[i].funcFlag == 'itpMyStaffCancelShopAdmin') continue;
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.userId + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function itpMyStaffEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.type = 'edit';
	params.isMerchantsAdmin = "0";
	params.rows = row;
	params.merchantsId = itp.getUserMerchantsId();
	params.tenantsId = top.app.info.userInfo.tenantsId;
	params.sexDict = g_sexDict;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('编辑员工', ['710px', '450px'], '/itp/merchants/merchants-user-edit.html', params, function(){
			//重新加载
		$table.bootstrapTable('refresh');
	});
}

function itpMyStaffSetShopAdmin(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	appTable.postData($table, url, row.merchantsUserId + "", "确定要设置当前选中的用户为店铺管理员？", "设置成功！");
}

function itpMyStaffCancelShopAdmin(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	appTable.postData($table, url, row.merchantsUserId + "", "确定要取消店铺管理员？", "设置成功！");
}

function itpMyStaffDel(id, url){
	appTable.delData($table, url, id + "");
}

function tableFormatIsAdmin(value, row) {
	if(value == '1') return "<span style='color:red'>是</span>";
	else return "否";
}

function tableFormatIsBlock(value, row) {
	if(value == '1') return "<span style='color:red'>是</span>";
	else return "否";
}

function tableFormatSex(value, row) {
	return appTable.tableFormatDictValue(g_sexDict, value);
}
