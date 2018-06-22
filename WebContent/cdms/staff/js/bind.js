var $tableUser = $('#tableListUser'), $tableMember = $('#tableListMember'), $comboxTenants = $('#tenantsBox');
var g_searchPannelHeight = 0, g_selectUserRow = null, g_selectMemberRow = null, g_isFirstLoad = true;
var g_tenantsId = top.app.info.tenantsInfo.tenantsId, g_organizerId = null, g_userId = null;
var g_comboBoxTree = null;
$(function () {
	//初始化权限
	initFunc();
	//初始化列表信息
	initTableUser();
	initTableMember();
	//初始化权限功能按钮点击事件
	initMemberBtnEvent();
	//初始化下拉选择列表(租户和组织)
	initComboBoxList();
});

/**
 * 初始化权限
 */
function initFunc(){
	var operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search,"_pid"));
	$("#tableToolbarUser").empty();
	$("#tableToolbarMember").empty();
	var htmlUser = "", htmlMember = "";
	var length = operRights.length;
	for (var i = 0; i < length; i++) {
		if(operRights[i].funcFlag.indexOf("staffBind") != -1){
			htmlMember += "<button type='button' class='btn btn-outline btn-default' id='" + operRights[i].funcFlag + "' data-action-url='" + operRights[i].funcLink + "'>" + 
							"<i class=\""+ operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + operRights[i].funcName + 
						"</button>";
		}
	}
	//添加树列表的权限
	$("#tableToolbarUser").append(htmlUser);
	$("#tableToolbarMember").append(htmlMember);
}

/**
 * 初始化列表信息
 */
function initTableUser(){
	//搜索参数
	var searchParamsUser = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            tenantsId: g_tenantsId,
            organizerId: g_organizerId
        };
        return param;
    };
    //初始化列表
	$tableUser.bootstrapTable({
		url: top.app.conf.url.api.cdms.staff.bind.getUserList,
        queryParams: searchParamsUser,										//传递参数（*）
        onClickRow: function(row, $el){
        	g_selectUserRow = row;
        	g_userId = row.userId;
        	appTable.setRowClickStatus($tableUser, row, $el);
    	    //加载用户列表
    	    $tableMember.bootstrapTable('refresh', {"url": top.app.conf.url.api.cdms.staff.bind.getMemberUserList});
        }
    });
	//加载数据成功后执行事件
	$tableUser.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($tableUser, g_searchPannelHeight + 39);
		setTimeout(function () {
			appTable.resetTableHeightOnLoad($tableMember, g_searchPannelHeight + 39);
	    }, 300);
    });
	//重置表格高度
	appTable.resetTableHeight($tableUser, g_searchPannelHeight + 39);
	
	//权限--单选多选切换功能
	$("#toolbarMultiCheck").click(function () {
		appTable.multiCheck($tableUser, $("#toolbarMultiCheck i"));
    });
}


/**
 * 初始化列表信息
 */
function initTableMember(){
	//搜索参数
	var searchParamsMember = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
            userId: g_userId,
            isIn: true 
        };
        return param;
    };
    //初始化列表
	$tableMember.bootstrapTable({
        queryParams: searchParamsMember,										//传递参数（*）
        onClickRow: function(row, $el){
        	g_selectMemberRow = row;
        	appTable.setRowClickStatus($tableMember, row, $el);
        }
    });
	//加载数据成功后执行事件
	$tableMember.on('load-success.bs.table', function (data) {
		appTable.resetTableHeightOnLoad($tableMember, g_searchPannelHeight + 39);
    });
	//重置表格高度
	appTable.resetTableHeight($tableMember, g_searchPannelHeight + 39);

	//权限--单选多选切换功能
	$("#toolbarMultiCheck").click(function () {
		appTable.multiCheck($tableMember, $("#toolbarMultiCheck i"));
    });
}

/**
 * 初始化会员权限功能按钮
 */
function initMemberBtnEvent(){
	$("#staffBindAdd").click(function () {
		if(g_selectUserRow == null ){
			top.app.message.alert("请选择一个员工进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.userId = g_userId;
		params.operUrl = top.app.conf.url.apigateway + $("#staffBindAdd").data('action-url');
		top.app.layer.editLayer('绑定会员', ['710px', '500px'], '/cdms/staff/bind-edit.html', params, function(){
   			//重新加载
			$tableMember.bootstrapTable('refresh');
		});
    });
	$("#staffBindDel").click(function () {
		var selectRows = $tableMember.bootstrapTable('getSelections');
		if(selectRows == null || selectRows == undefined || selectRows.length == 0){
			top.app.message.alert("请选择要解绑的会员！");
			return;
		}
		var idsList = "";
		$.each(selectRows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.memberId;
		});
		var operUrl = top.app.conf.url.apigateway + $("#staffBindDel").data('action-url');
		top.app.message.confirm("确定要解绑会员？", function(){
			var submitData = {};
			submitData["userId"] = g_userId;
			submitData["idsList"] = idsList;
			$.ajax({
				url: operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: JSON.stringify(submitData),
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
			   			top.app.message.alert("解绑会员成功！");
			   			//重新加载
						$tableMember.bootstrapTable('refresh');
			   		}else{
			   			top.app.message.error(data.RetMsg);
			   		}
		        }
			});
		});
    });
}

/**
 * 初始化下拉选择列表(租户和组织)
 */
function initComboBoxList(){
	//根租户的管理员才能管理多个租户下的组织
	if(top.app.info.userInfo.isAdmin == 'Y'){
		//设置select的宽度为200px
		$('.selectpicker').selectpicker({
			width: '200px'
		});
		$('#divTenantsBox').css('display', 'block');
		$('#divUserBox').css('top', '63px');
		$('#divMemberBox').css('top', '63px');
		g_searchPannelHeight += 62;
		//重置高度
		appTable.resetTableHeight($tableUser, g_searchPannelHeight + 39);
		appTable.resetTableHeight($tableMember, g_searchPannelHeight + 39);
		
		//如果只是租户管理员，则不能管理所有租户
		if(top.app.info.tenantsInfo.isRoot == 'Y'){
			//获取租户数据
			top.app.getTenantsListBox($comboxTenants, function(){
				$('.selectpicker').selectpicker('refresh');
				g_tenantsId = $comboxTenants.val();
			});
			//绑定租户下拉框变更事件
			$comboxTenants.on('changed.bs.select', function (e) {
				g_tenantsId = $comboxTenants.val();
				//刷新树菜单
				g_comboBoxTree.refreshTree(true, function(){
					//触发重新加载事件
					$("#btnReload").click();
				});
			});
		}else{
			$('#tenantsListDiv').css('display', 'none');
			$('#organizerListTitle').css('display', 'none');
			$('#tenantsListTitle').empty();
			$('#tenantsListTitle').append('<h5>当前正在编辑的组织：</h5>');
			g_tenantsId = top.app.info.tenantsInfo.tenantsId;
		}
		
		//获取组织数据
		g_comboBoxTree = AppCombotree.createNew();
		g_comboBoxTree.init($('#organizerBox') , function (objNode, cb) {
			$.ajax({
			    url: top.app.conf.url.api.system.organizer.getOrganizerTree,
			    method: 'GET',
			    data: {
			    	access_token: top.app.cookies.getCookiesToken(),
			    	tenantsId: g_tenantsId,
			    	organizerId: (objNode == null) ? null : objNode.id
			    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
						cb.call(this, data.RetData);
						//第一次加载时需要设置组织列表的默认值
						if(g_isFirstLoad){
							setTimeout(function () {
								g_comboBoxTree.setValueById(top.app.info.organizerInfo.organizerId);
								g_organizerId = g_comboBoxTree.getNodeId();
						    }, 300);
							g_isFirstLoad = false;
						}
			    	}else{
			    		top.app.message.error(data.RetMsg);
			    	}
				}
			});
		}, '200px');
		//设置点击回调
		g_comboBoxTree.setClickTreeEvent(function(node){
			$("#btnReload").click();
		});
		
		//绑定重新加载事件
		$("#btnReload").click(function () {
			g_organizerId = g_comboBoxTree.getNodeId();
			//刷新角色列表
			$tableUser.bootstrapTable('refresh');
    		//重置变量
    		g_selectUserRow = null;
    		g_selectMemberRow = null;
    		//清空用户表内容
			$tableMember.bootstrapTable('removeAll');
	    });
	}
}
