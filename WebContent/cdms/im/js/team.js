var $table = $('#tableList'), g_operRights = null;

$(function () {
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
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for (var i = 0; i < length; i++) {
		if(g_operRights[i].funcFlag.indexOf("imTeam") != -1){
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag  + "' data-action-url='" + g_operRights[i].funcLink + "'>" + 
							"<i class=\""+ g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName + 
						 "</button>";
		}
	}
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
            searchName: $("#searchName").val()
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.im.getTeamList,   						//请求后台的URL（*）
        queryParams: searchParams,												//传递参数（*）
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
		$table.bootstrapTable('refresh');
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#imTeamAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.operUrl = top.app.conf.url.apigateway + $("#imTeamAdd").data('action-url');
		top.app.layer.editLayer('新增群信息', ['710px', '250px'], '/cdms/im/team-edit.html', params, function(){
   			//重新加载
			$table.bootstrapTable('refresh');
		});
    });
	$("#imTeamEdit").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#imTeamEdit").data('action-url');
		top.app.layer.editLayer('编辑群信息', ['710px', '250px'], '/cdms/im/team-edit.html', params, function(){
   			//重新加载
			$table.bootstrapTable('refresh');
		});
    });
	$("#imTeamDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var operUrl = top.app.conf.url.apigateway + $("#imTeamDel").data('action-url');
		top.app.message.confirm("确定要删除当前选中的数据？数据删除后将不可恢复！", function(){
			var idsList = "";
			$.each(rows, function(i, rowData) {
				if(idsList != "") idsList = idsList + ",";
				idsList = idsList + rowData.id;
				//删除组
				imUtils.delTeam(rowData.teamId);
	    	});
			$.ajax({
				url: operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: idsList,
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
			   			//重新加载列表
						$table.bootstrapTable('refresh');
			   			top.app.message.alert("数据删除成功！");
			   			$table.selections = null;
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
	$("#imTeamMember").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1){
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		confMemberInfo(rows[0]);
    });
}


/**
 * 进入详情
 */
function confMemberInfo(rows){
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	top.app.info.iframe.params = {};
	top.app.info.iframe.params.rows = rows;
	
	var pid = $.utils.getUrlParam(window.location.search,"_pid");
	var url = "member-info.html?_pid=" + pid;
	window.location.href = encodeURI(url);
}
