var $table = $('#tableList'), g_searchPannelHeight = 0, g_rows;
$(function () {
	g_rows = top.app.info.iframe.params.rows;
	$("#showInfoMsg").empty();
	$("#showInfoMsg").append("<span style='margin-right:20px;margin-left:10px;'>-- 群组ID:<span style='color:#1ab394;margin-left:5px;'>" + g_rows.teamId + "</span></span>" +
				"<span style='margin-right:20px'>群组名称:<span style='color:#1ab394;margin-left:5px;'>" + g_rows.teamName + "</span></span>");
	//搜索面板高度
	g_searchPannelHeight = $('#titleInfo').outerHeight(true);
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
	//加载数据
	loadData();
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
		if(operRights[i].funcFlag.indexOf("imMember") != -1){
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
    //初始化列表
	$table.bootstrapTable({
        onClickRow: function(row, $el){
        	appTable.setRowClickStatus($table, row, $el);
        }
    });
	//加载数据成功后执行事件
	$table.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($table, g_searchPannelHeight - 20);
    });
	//重置表格高度
	appTable.resetTableHeight($table, g_searchPannelHeight - 20);

	//权限--导出功能
	$("#toolbarExport").click(function () {
		appTable.exportTable($table);
    });
	//权限--单选多选切换功能
	$("#toolbarMultiCheck").click(function () {
		appTable.multiCheck($table, $("#toolbarMultiCheck i"));
    });
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent(){
	//绑定工具条事件
	$("#imMemberAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.rows = g_rows;
		top.app.layer.editLayer('新增成员', ['710px', '500px'], '/cdms/im/member-edit.html', params, function(){
   			//重新加载列表
			loadData();
		});
    });
	$("#imMemberDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var operUrl = top.app.conf.url.apigateway + $("#imTeamDel").data('action-url');
		top.app.message.confirm("确定要删除当前选中的数据？数据删除后将不可恢复！", function(){
			var idsList = "";
			$.each(rows, function(i, rowData) {
				//删除组
				imUtils.kickToTeam(g_rows.teamId, rowData.userCode);
	    	});
   			//重新加载列表
			loadData();
   			top.app.message.alert("数据删除成功！");
		});
    });
	//返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "team.html?_pid=" + pid;
    });
}

function loadData(){
	imUtils.queryTeam(g_rows.teamId, function(data){
		var tmpData = new Object();
		
		var array = [];
		var obj = new Object();
		obj.userCode = data.tinfos[0].owner;
		array.push(obj);
		//添加成员
		for(i = 0; i < data.tinfos[0].members.length;i++){
			obj = new Object();
			obj.userCode = data.tinfos[0].members[i];
			array.push(obj);
		}
//		tmpData.rows = array;
		tmpData.data = array;
		tmpData.total = array.length;
		$table.bootstrapTable('load', tmpData);
		appTable.resetTableHeightOnLoad($table, g_searchPannelHeight);
	});
}