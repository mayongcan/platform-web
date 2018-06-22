var $table = $('#tableList'), g_operRights = [];

$(function () {
    //初始化权限
    initFunc();
    //初始化列表信息
    initTable();
    //初始化权限功能按钮点击事件
    initFuncBtnEvent();
});

function getUrlParms(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

/**
 * 初始化权限
 */
function initFunc(){
    g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
    $("#tableToolbar").empty();
    var htmlTable = "";
    var length = g_operRights.length;
    // for (var i = 0; i < length; i++) {
    //     //显示在列表上方的权限菜单
    //     if(g_operRights[i].dispPosition == '1' && g_operRights[i].funcFlag.indexOf("siteMgr") == -1){
    //         htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" +
    //             "<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName +
    //             "</button>";
    //     }
    // }
    htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarBack'>" +
        "<i class='glyphicon glyphicon-arrow-left' aria-hidden='true'></i> 返回" +
        "</button>"
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
            id: getUrlParms("id"),
        };
        return param;
    };
    //初始化列表
    $table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/extend/mas/sign/getSignList",   		//请求后台的URL（*）
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
        $('.selectpicker').selectpicker('refresh');
        $table.bootstrapTable('refresh');
    });
    //搜索点击事件
    $("#btnSearch").click(function () {
        $table.bootstrapTable('refresh');
    });
    $("#btnReset").click(function () {
        $("#searchConfName").val("");
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
    $("#masGenQrCode").click(function () {
        //设置参数
        var params = {};
        params.operUrl = top.app.conf.url.apigateway + $("#masGenQrCode").data('action-url');
        top.app.layer.editLayer('生成二维码', ['710px', '450px'], '/extend/mas/conf/conf-edit.html', params, function(){
            //重新加载列表
            $table.bootstrapTable('refresh');
        });
    });
    // 返回数据类型页面
    $("#toolbarBack").click(function () {
        var pid = $.utils.getUrlParam(window.location.search,"_pid");
        window.location.href= "conf.html?_pid=" + pid;
    });
}

//格式化列表右侧的操作按钮
function formatOperate(value, row, index){
    //根据权限是否显示操作菜单
    var length = g_operRights.length;
    var operateBtn = "";
    for (var i = 0; i < length; i++) {
        if(g_operRights[i].dispPosition == '2' && g_operRights[i].funcFlag.indexOf("siteMgr") == -1){
            operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' +
                '<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName +
                '</button>';
        }
    }
    return operateBtn;
}

function masShowQrCode(id, url){
//	var row = $table.bootstrapTable("getRowByUniqueId", id);
    var params = {};
    params.operUrl = top.app.conf.url.apigateway + url;
    params.id = id;
    top.app.layer.editLayer('二维码显示', ['710px', '450px'], '/extend/mas/conf/conf-QRCode.html', params, function(){
        //重新加载列表
        $table.bootstrapTable('refresh');
    });
}

function masConfEnd(id, url){
    var row = $table.bootstrapTable("getRowByUniqueId", id);
}

function masConfSiteView(id, url){
    var row = $table.bootstrapTable("getRowByUniqueId", id);
}


