var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
var g_selectRowsId = null;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	$("#layerOk").click(function () {
		submitAction();
    });
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	//搜索参数
	var searchParams = function (p) {
        var retParam = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: p.limit,   						//页面大小
            page: p.offset / p.limit,  		//当前页
            tenantsId: top.app.info.userInfo.tenantsId,
            //isDept: true,
            organizerId:top.app.info.rootOrganizerId,
            userName: $("#searchUserName").val(),
            findChildUsers: 1,
            roleId: 101,		//过滤执法人员角色
            notInAccount: top.app.info.userInfo.userCode,
        };
        return retParam;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.system.user.getUserList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'userId',
        height: 360,
        onClickRow: function(row, $el){        		
        		appTable.setRowClickStatus($table, row, $el);
        		//不显示多选框，则在这里保存选择的行
        		g_selectRowsId = row;
        }
    });
	//搜索点击事件
	$("#btnSearch").click(function () {
		$table.bootstrapTable('refresh');
    });
	$("#btnReset").click(function () {
		$("#searchUserName").val("");
		$table.bootstrapTable('refresh');
    });
	
}


/**
 * 提交数据
 */
function submitAction(){
	if($.utils.isNull(g_selectRowsId)){
		top.app.message.alert("请选择一个第二承办人！");
		return;
	}
	var rowObj = [];
	rowObj.userIdList = g_selectRowsId.userId;
	rowObj.userCodeList = g_selectRowsId.userCode;
	rowObj.userNameList = g_selectRowsId.userName;
	parent.app.layer.retParams = [];
	parent.app.layer.retParams.push(rowObj);
	

	//关闭页面前设置结果
	parent.app.layer.editLayerRet = true;
	parent.layer.close(g_iframeIndex);
}