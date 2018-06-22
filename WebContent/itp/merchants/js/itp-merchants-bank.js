var $table = $('#tableList'), g_operRights = [], g_backUrl = "";
var g_bankaccountTypeDict = null;
var g_certCodeDict = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
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
	g_bankaccountTypeDict = top.app.getDictDataByDictTypeValue('ITP_SHOP_BANK_CAR_TYPE');
	g_certCodeDict = top.app.getDictDataByDictTypeValue('IPT_CERT_CODE');
	top.app.addComboBoxOption($("#searchCertCode"), g_certCodeDict, true);
	top.app.addComboBoxOption($("#searchBankaccountType"), g_bankaccountTypeDict, true);
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
		if(g_operRights[i].dispPosition == '1' && g_operRights[i].funcFlag.indexOf("itpMerchantsBank") != -1){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
	}
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
			merchantsId: g_params.row.id,
			bankBranchName: $("#searchBankBranchName").val(),
			certCode: $("#searchCertCode").val(),
			bankaccountType: $("#searchBankaccountType").val(),
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
		$("#searchBankBranchName").val("");
		$("#searchCertCode").val("");
		$("#searchBankaccountType").val("");
		$('.selectpicker').selectpicker('refresh');
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#itpMerchantsBankAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.merchantsId = g_params.row.id;
		params.infMerchantsId = g_params.row.infMerchantsId;
		params.certCodeDict = g_certCodeDict;
		params.bankaccountTypeDict = g_bankaccountTypeDict;
		params.operUrl = top.app.conf.url.apigateway + $("#itpMerchantsBankAdd").data('action-url');
		top.app.layer.editLayer('新增商家银行卡信息', ['790px', '460px'], '/itp/merchants/itp-merchants-bank-edit.html', params, function(){
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
		if(g_operRights[i].dispPosition == '2' && g_operRights[i].funcFlag.indexOf("itpMerchantsBank") != -1){
			operateBtn += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="' + g_operRights[i].funcFlag  + '(' + row.id + ', \'' + g_operRights[i].funcLink + '\')">' + 
								'<i class="' + g_operRights[i].funcIcon + '" aria-hidden="true"></i> ' + g_operRights[i].funcName + 
						  '</button>';
		}
	}
	return operateBtn;
}

function itpMerchantsBankEdit(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);
	//设置参数
	var params = {};
	params.type = 'edit';
	params.rows = row;
	params.merchantsId = g_params.row.id;
	params.infMerchantsId = g_params.row.infMerchantsId;
	params.certCodeDict = g_certCodeDict;
	params.bankaccountTypeDict = g_bankaccountTypeDict;
	params.operUrl = top.app.conf.url.apigateway + url;
	top.app.layer.editLayer('编辑商家银行卡信息', ['790px', '460px'], '/itp/merchants/itp-merchants-bank-edit.html', params, function(){
		//重新加载列表
		$table.bootstrapTable('refresh');
	});
}

function itpMerchantsBankDel(id, url){
	var row = $table.bootstrapTable("getRowByUniqueId", id);

	//定义提交数据
	var submitData = {};
	submitData["id"] = id;
	submitData["merchantsId"] = g_params.row.id;
	submitData["infMerchantsId"] = g_params.row.infMerchantsId;
	submitData["bankaccountNo"] = row.bankaccountNo;
	top.app.message.loading();
	
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + url + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//重新加载列表
				$table.bootstrapTable('refresh');
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function formatBankaccountType(value,row,index){
	return appTable.tableFormatDictValue(g_bankaccountTypeDict, value);
}

function formatCertCode(value,row,index){
	return appTable.tableFormatDictValue(g_certCodeDict, value);
}

function formatDefaultAcc(value,row,index){
	if(value == '0') return '<font color="green">否</font>' ;
	else return '<font color="red">是</font>' ;
}

