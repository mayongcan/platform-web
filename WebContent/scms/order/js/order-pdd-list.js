var $table = $('#tableList'), g_operRights = [];

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
	//获取店铺下拉列表
	scms.getShopPullDown($("#searchShopId"), scms.getUserMerchantsId(), true);
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
			merchantsId: scms.getUserMerchantsId(),
			shopId: $("#searchShopId").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/order/getOrderPddList",   		//请求后台的URL（*）
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
		$("#searchShopId").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#scmsOrderPddAdd").click(function () {
		//进入创建订单页面
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.type = 'add';
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsOrderPddAdd").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/order/order-pdd-new.html?_pid=" + pid + "&backUrl=/scms/order/order-pdd-list.html";
		window.location.href = encodeURI(url);
    });
	$("#scmsOrderPddDetail").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行查看！");
			return;
		}
		//进入创建订单页面
		top.app.info.iframe.params = {};
		top.app.info.iframe.params.row = rows[0];
		top.app.info.iframe.params.operUrl = top.app.conf.url.apigateway + $("#scmsOrderPddDetail").data('action-url');
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "/scms/order/order-pdd-detail.html?_pid=" + pid + "&backUrl=/scms/order/order-pdd-list.html";
		window.location.href = encodeURI(url);
    });
}
