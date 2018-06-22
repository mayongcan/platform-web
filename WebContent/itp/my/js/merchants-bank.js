var $table = $('#tableList'), g_operRights = [], g_backUrl = "";
var g_cardTypeDict = null;

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
	g_cardTypeDict = top.app.getDictDataByDictTypeValue('ITP_SHOP_BANK_CAR_TYPE');
	top.app.addComboBoxOption($("#searchCardType"), g_cardTypeDict, true);
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
            bankName: $("#searchBankName").val(),
            bankCode: $("#searchBankCode").val(),
            cardType: $("#searchCardType").val(),
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/itp/merchants/getMerchantsBankList",   		//请求后台的URL（*）
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
		$("#searchBankName").val("");
		$("#searchBankCode").val("");
		$("#searchCardType").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpMyMerchantsBankAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.merchantsId = itp.getUserMerchantsId();
		params.cardTypeDict = g_cardTypeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#itpMyMerchantsBankAdd").data('action-url');
		top.app.layer.editLayer('新增商家提现银行卡信息', ['710px', '360px'], '/itp/merchants/itp-merchants-bank-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	// 返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = "itp-merchants-info.html?_pid=" + pid;
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

function itpMyMerchantsBankEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.type = 'edit';
	params.rows = row;
	params.merchantsId = itp.getUserMerchantsId();
	params.cardTypeDict = g_cardTypeDict;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('编辑商家提现银行卡信息', ['710px', '360px'], '/itp/merchants/itp-merchants-bank-edit.html', params, function(){
			//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function itpMyMerchantsBankDel(id, url){
	appTable.delData($table, url, id + "");
}

function formatCardType(value,row,index){
	return appTable.tableFormatDictValue(g_cardTypeDict, value);
}

