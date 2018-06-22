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
		if(operRights[i].funcFlag.indexOf("memberFamily") != -1){
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
            memberId: g_memberId,
            isIn: true
        };
        return param;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.api.cdms.member.member.getMemberFamilyList,   		//请求后台的URL（*）
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
	$("#memberFamilyAdd").click(function () {
		//设置参数
		var params = {};
		params.type = 'add';
		params.memberId = g_memberId;
		params.operUrl = top.app.conf.url.apigateway + $("#memberFamilyAdd").data('action-url');
		top.app.layer.editLayer('添加亲情账号', ['710px', '500px'], '/cdms/member/member-family-edit.html', params, function(){
   			//重新加载列表
			$table.bootstrapTable('refresh');
		});
    });
	$("#memberFamilyDel").click(function () {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 ){
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.memberId;
    	});
		//定义提交数据
		var submitData = {};
		submitData["memberId"] = g_memberId;
		submitData["idsList"] = idsList;
		var operUrl = top.app.conf.url.apigateway + $("#memberFamilyDel").data('action-url');
		top.app.message.confirm("确定要删除当前选中的数据？数据删除后将不可恢复！", function(){
			$.ajax({
				url: operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: JSON.stringify(submitData),
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
			   			//重新加载列表
						$table.bootstrapTable('refresh');
			   			top.app.message.alert("数据删除成功！");
			   			appTable.selections = null;
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
	//返回数据类型页面
	$("#toolbarBack").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "member.html?_pid=" + pid;
    });
}