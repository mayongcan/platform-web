var $tableSphygmometer = $('#tableListSphygmometer'), $tableBlood = $('#tableListBlood'),$tableLung = $('#tableListLung'),$tableStep = $('#tableListStep'),
	g_searchPannelHeight = 0, g_memberId = null, g_memberName = null;
$(function () {
	g_memberId = $.utils.getUrlParam(window.location.search,"memberId");
	g_memberName = decodeURI($.utils.getUrlParam(window.location.search,"memberName"));
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 会员ID:<span style='color:#1ab394;margin-left:5px;'>" + g_memberId + "</span></span>" +
				"<span style='margin-right:20px'>会员名称:<span style='color:#1ab394;margin-left:5px;'>" + g_memberName + "</span></span>");
	//搜索面板高度
	g_searchPannelHeight = $('#titleInfo').outerHeight(true) + $('#searchPannel').outerHeight(true);
	//初始化列表信息
	initTableSphygmometer();
	initTableBlood();
	initTableLung();
	initTableStep();

	//搜索点击事件
	$("#btnSearch").click(function () {
		loadData();
    });
	$("#btnBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "member.html?_pid=" + pid;
    });
	loadData();
});

/**
 * 初始化列表信息
 */
function initTableSphygmometer(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            memberId: g_memberId
        };
        return param;
    };
    //初始化列表
	$tableSphygmometer.bootstrapTable({
        queryParams: searchParams										//传递参数（*）
    });
	//加载数据成功后执行事件
	$tableSphygmometer.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($tableSphygmometer, g_searchPannelHeight + 5);
    });
	//重置表格高度
	appTable.resetTableHeight($tableSphygmometer, g_searchPannelHeight + 5);
}

/**
 * 初始化列表信息
 */
function initTableBlood(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            memberId: g_memberId
        };
        return param;
    };
    //初始化列表
    $tableBlood.bootstrapTable({
        queryParams: searchParams										//传递参数（*）
    });
	//加载数据成功后执行事件
    $tableBlood.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($tableBlood, g_searchPannelHeight + 5);
    });
	//重置表格高度
	appTable.resetTableHeight($tableBlood, g_searchPannelHeight + 5);
}

/**
 * 初始化列表信息
 */
function initTableLung(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            memberId: g_memberId
        };
        return param;
    };
    //初始化列表
    $tableLung.bootstrapTable({
        queryParams: searchParams										//传递参数（*）
    });
	//加载数据成功后执行事件
    $tableLung.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($tableLung, g_searchPannelHeight + 5);
    });
	//重置表格高度
	appTable.resetTableHeight($tableLung, g_searchPannelHeight + 5);
}

/**
 * 初始化列表信息
 */
function initTableStep(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            memberId: g_memberId
        };
        return param;
    };
    //初始化列表
    $tableStep.bootstrapTable({
        queryParams: searchParams										//传递参数（*）
    });
	//加载数据成功后执行事件
    $tableStep.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($tableStep, g_searchPannelHeight + 5);
    });
	//重置表格高度
	appTable.resetTableHeight($tableStep, g_searchPannelHeight + 5);
}

/**
 * 加载数据
 */
function loadData(){
	if($('#searchType').val() == '1'){//加载用户列表
		$tableSphygmometer.bootstrapTable('refresh', {"url": top.app.conf.url.api.cdms.member.member.getDeviceSphygmometerList});
		$('#divSphygmometer').css('display','block');
		$('#divBlood').css('display','none');
		$('#divLung').css('display','none');
		$('#divStep').css('display','none');
	}else if($('#searchType').val() == '2'){
		$tableBlood.bootstrapTable('refresh', {"url": top.app.conf.url.api.cdms.member.member.getDeviceBloodList});
		$('#divSphygmometer').css('display','none');
		$('#divBlood').css('display','block');
		$('#divLung').css('display','none');
		$('#divStep').css('display','none');
	}else if($('#searchType').val() == '3'){
		$tableLung.bootstrapTable('refresh', {"url": top.app.conf.url.api.cdms.member.member.getDeviceLungList});
		$('#divSphygmometer').css('display','none');
		$('#divBlood').css('display','none');
		$('#divLung').css('display','block');
		$('#divStep').css('display','none');
	}else if($('#searchType').val() == '4'){
		$tableStep.bootstrapTable('refresh', {"url": top.app.conf.url.api.cdms.member.member.getDeviceStepList});
		$('#divSphygmometer').css('display','none');
		$('#divBlood').css('display','none');
		$('#divLung').css('display','none');
		$('#divStep').css('display','block');
	}
}