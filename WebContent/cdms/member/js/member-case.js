var $table = $('#tableList'), g_memberId = null, g_memberName = null;
$(function () {
	g_memberId = $.utils.getUrlParam(window.location.search,"memberId");
	g_memberName = decodeURI($.utils.getUrlParam(window.location.search,"memberName"));
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 会员ID:<span style='color:#1ab394;margin-left:5px;'>" + g_memberId + "</span></span>" +
				"<span style='margin-right:20px'>会员名称:<span style='color:#1ab394;margin-left:5px;'>" + g_memberName + "</span></span>");
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.info.iframe.operRights;
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		if(operRights[i].funcFlag.indexOf("memberCase") != -1){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag  + "' data-action-url='" + operRights[i].funcLink + "'>" + 
							"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
						 "</button>";
		}
	}
	htmlTable += "<button type='button' class='btn btn-outline btn-default' id='toolbarBack'>" + 
					"<i class='glyphicon glyphicon-arrow-left' aria-hidden='true'></i> 返回" +
				 "</button>"
	//添加表格的权限
	htmlTable += appTable.addDefaultFuncButton();
	$("#tableToolbar").append(htmlTable);
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
            memberId: g_memberId
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.member.member.getMemberCaseList,   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//搜索面板高度
	appTable.searchPannelHeight = $('#titleInfo').outerHeight(true) - 10;
	//初始化Table相关信息
	appTable.initTable($table);
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#memberCaseAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.memberId = g_memberId;
		params.operUrl = top.app.conf.url.apigateway + $("#memberCaseAdd").data('action-url');
		top.app.layer.editLayer('添加会员病历', ['710px', '500px'], '/cdms/member/member-case-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	//绑定工具条事件
	$("#memberCaseEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.memberId = g_memberId;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#memberCaseEdit").data('action-url');
		top.app.layer.editLayer('编辑会员病历', ['710px', '500px'], '/cdms/member/member-case-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#memberCaseDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.caseId;
    	});
		appTable.delData($table, $("#memberCaseDel").data('action-url'), idsList);
    });
	//返回数据类型页面
	$("#memberCaseMedication").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行查看！");
			return;
		}
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var url = "member-case-medication.html?_pid=" + pid + "&memberId=" + g_memberId + "&memberName=" + g_memberName
		 	+ "&caseId=" + rows[0].caseId;
		window.location.href = encodeURI(url);
    });
	//返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "member.html?_pid=" + pid;
    });
}