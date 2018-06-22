var $table = $('#tableList'), g_typeDict = [];

$(function () {
	//初始化权限
	appTable.addFuncButton($("#tableToolbar"));
	//获取字典类型的字典数据
	initComboBox();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});


/**
 * 添加字典类型搜索框
 */
function initComboBox(){
	g_typeDict = top.app.getDictDataByDictTypeValue('CDMS_RUM_SALES_CHECK_TYPE');
	top.app.addComboBoxOption($("#searchType"), g_typeDict, true);
}

/**
 * 初始化列表信息
 */
function initTable(){
	//搜索参数
	var searchParams = function (params) {
        var param = {
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
        url: top.app.conf.url.api.cdms.staff.saleslog.getSaleslogList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        },
        onDblClickRow: function(row, $el){
    		confInfo(row);
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
	
}

/**
 * 格式化字典类型
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