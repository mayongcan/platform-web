var $table = $('#tableList'), g_typeDict = [];

$(function () {
	//获取权限菜单
	appTable.addFuncButton($("#tableToolbar"));
	//获取租户状态字典
	initComboBox();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 添加租户状态搜索框
 */
function initComboBox(){
	g_typeDict = top.app.getDictDataByDictTypeValue('CDMS_CUM_DEVICE_TYPE');
	top.app.addComboBoxOption($("#searchType"), g_typeDict, true);
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
            searchName: $("#searchName").val(),
            searchType: $("#searchType").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.member.device.getDeviceList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
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
        $("#searchType").val("");
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
	$("#deviceAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.typeDict = g_typeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#deviceAdd").data('action-url');
		top.app.layer.editLayer('新增设备类型', ['710px', '350px'], '/cdms/member/device-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#deviceEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.typeDict = g_typeDict;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#deviceEdit").data('action-url');
		top.app.layer.editLayer('编辑设备类型', ['710px', '350px'], '/cdms/member/device-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#deviceDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.deviceId;
    	});
		appTable.delData($table, $("#deviceDel").data('action-url'), idsList);
    });
}

/**
 * 格式化租户状态
 * @param value
 * @param row
 */
function tableFormatType(value, row) {
	var i = g_typeDict.length;
	while (i--) {
		if(g_typeDict[i].ID == value){
			return g_typeDict[i].NAME;
		}
	}
	return "未知";
}