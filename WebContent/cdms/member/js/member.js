var $table = $('#tableList'),
	g_operRights = null,
	g_emphasis = [],
	g_statusDict = [],
	g_credentialsDict = [],
	g_sexDict = [],
	g_tenantsId = null,
	g_isFirstLoad = true;
var g_comboBoxTree = null;
$(function() {
	//获取权限菜单
	appTable.addFuncButton($("#tableToolbar"));
	//获取状态字典
	g_statusDict = top.app.getDictDataByDictTypeValue('SYS_AUDIT_STATUS');
	g_credentialsDict = top.app.getDictDataByDictTypeValue('SYS_CREDENTIALS_TYPE');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	g_emphasis = top.app.getDictDataByDictTypeValue('CDMS_CUM_EMPHASIS');
	top.app.addComboBoxOption($("#searchStatus"), g_statusDict, true);
	//初始化权限
	initFunc();
	//初始化列表信息
	initTable();
	//初始化权限功能按钮点击事件
	initFuncBtnEvent();
	//初始化下拉选择列表(租户)
	initComboBoxList();
});

/**
 * 初始化权限
 */
function initFunc() {
	g_operRights = top.app.getUserRights($.utils.getUrlParam(window.location.search, "_pid"));
	$("#tableToolbar").empty();
	var htmlTable = "";
	var length = g_operRights.length;
	for(var i = 0; i < length; i++) {
		if(g_operRights[i].funcFlag.indexOf("memberFamily") != -1) {} else if(g_operRights[i].funcFlag.indexOf("memberCase") != -1) {} else {
			htmlTable += "<button type='button' class='btn btn-outline btn-default' id='" + g_operRights[i].funcFlag + "' data-action-url='" + g_operRights[i].funcLink + "'>" +
				"<i class=\"" + g_operRights[i].funcIcon + "\" aria-hidden=\"true\"></i> " + g_operRights[i].funcName +
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
function initTable() {
	//搜索参数
	var searchParams = function(params) {
		var param = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			access_token: top.app.cookies.getCookiesToken(),
			size: params.limit, //页面大小
			page: params.offset / params.limit, //当前页
			organizerId: g_comboBoxTree == null ? null : g_comboBoxTree.getNodeId(),
			searchName: $("#searchName").val(),
			searchStatus: $("#searchStatus").val()
		};
		return param;
	};
	//初始化列表
	$table.bootstrapTable({
		url: top.app.conf.url.api.cdms.member.member.getMemberList, //请求后台的URL（*）
		queryParams: searchParams, //传递参数（*）
		onClickRow: function(row, $el) {
			appTable.setRowClickStatus($table, row, $el);
		}
	});
	//初始化Table相关信息
	appTable.initTable($table);

	//搜索点击事件
	$("#btnSearch").click(function() {
		$table.bootstrapTable('refresh');
	});
	$("#btnReset").click(function() {
		$("#searchName").val("");
		$("#searchStatus").val("");
		$table.bootstrapTable('refresh');
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
	});
}

/**
 * 初始化权限功能点击事件
 */
function initFuncBtnEvent() {
	//绑定工具条事件
	$("#memberAdd").click(function() {
		//设置参数
		var params = {};
		params.type = 'add';
		params.tenantsId = g_tenantsId;
		params.statusDict = g_statusDict;
		params.credentialsDict = g_credentialsDict;
		params.sexDict = g_sexDict;
		params.operUrl = top.app.conf.url.apigateway + $("#memberAdd").data('action-url');
		top.app.layer.editLayer('新增会员信息', ['710px', '550px'], '/cdms/member/member-edit.html', params, function() {
			//重新加载列表
			$table.bootstrapTable('refresh');
		});
	});
	$("#memberEdit").click(function() {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1) {
			top.app.message.alert("请选择一条数据进行编辑！");
			return;
		}
		//设置参数
		var params = {};
		params.type = 'edit';
		params.tenantsId = g_tenantsId;
		params.statusDict = g_statusDict;
		params.credentialsDict = g_credentialsDict;
		params.sexDict = g_sexDict;
		params.emphasis = g_emphasis;
		params.rows = rows[0];
		params.operUrl = top.app.conf.url.apigateway + $("#memberEdit").data('action-url');
		top.app.layer.editLayer('编辑会员信息', ['710px', '550px'], '/cdms/member/member-edit.html', params, function() {
			//重新加载列表
			$table.bootstrapTable('refresh');
		});
	});
	$("#memberDel").click(function() {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0) {
			top.app.message.alert("请选择要删除的数据！");
			return;
		}
		var idsList = "";
		$.each(rows, function(i, rowData) {
			if(idsList != "") idsList = idsList + ",";
			idsList = idsList + rowData.memberId;
		});
		appTable.delData($table, $("#memberDel").data('action-url'), idsList);
	});
	$("#memberMgrFamily").click(function() {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1) {
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		memberMgrFamily(rows[0]);
	});
	$("#memberMgrCase").click(function() {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1) {
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		memberMgrCase(rows[0]);
	});
	$("#memberMgrDevice").click(function() {
		var rows = appTable.getSelectionRows($table);
		if(rows.length == 0 || rows.length > 1) {
			top.app.message.alert("请选择一条数据进行操作！");
			return;
		}
		memberMgrDevice(rows[0]);
	});
}

/**
 * 进入亲情账号
 */
function memberMgrFamily(rows) {
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search, "_pid");
	var url = "member-family.html?_pid=" + pid + "&memberId=" + rows.memberId + "&memberName=" + rows.memberName;
	window.location.href = encodeURI(url);
}

/**
 * 进入病历管理
 */
function memberMgrCase(rows) {
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search, "_pid");
	var url = "member-case.html?_pid=" + pid + "&memberId=" + rows.memberId + "&memberName=" + rows.memberName;
	window.location.href = encodeURI(url);
}

/**
 * 进入测量记录管理
 */
function memberMgrDevice(rows) {
	//设置传送对象
	top.app.info.iframe.operRights = g_operRights;
	var pid = $.utils.getUrlParam(window.location.search, "_pid");
	var url = "member-device.html?_pid=" + pid + "&memberId=" + rows.memberId + "&memberName=" + rows.memberName;
	window.location.href = encodeURI(url);
}

/**
 * 初始化下拉选择列表(租户)
 */
function initComboBoxList() {
	//根租户的管理员才能管理多个租户下的组织
	if(top.app.info.userInfo.isAdmin == 'Y') {
		//设置select的宽度为200px
		$('.selectpicker').selectpicker({
			width: '150px'
		});
		if(top.app.info.tenantsInfo.isRoot == 'Y') {
			$('#divTenantsBox').css('display', 'block');
			//获取数据
			top.app.getTenantsListBox($('#tenantsBox'), function() {
				$('.selectpicker').selectpicker('refresh');
				g_tenantsId = $('#tenantsBox').val();
			});
			//绑定租户下拉框变更事件
			$('#tenantsBox').on('changed.bs.select', function(e) {
				//设置全局的租户ID
				g_tenantsId = $('#tenantsBox').val();
				//刷新树菜单
				g_comboBoxTree.refreshTree(true);
			});
		} else {
			g_tenantsId = top.app.info.tenantsInfo.tenantsId;
		}

		$('#divOrganizerBox').css('display', 'block');
		//获取组织数据
		g_comboBoxTree = AppCombotree.createNew();
		g_comboBoxTree.init($('#organizerBox'), function(objNode, cb) {
			$.ajax({
				url: top.app.conf.url.api.system.organizer.getOrganizerTree,
				method: 'GET',
				data: {
					access_token: top.app.cookies.getCookiesToken(),
					tenantsId: g_tenantsId,
			    	organizerId: (objNode == null) ? null : objNode.id
				},
				success: function(data) {
					if(top.app.message.code.success == data.RetCode) {
						cb.call(this, data.RetData);
						//第一次加载时需要设置组织列表的默认值
						if(g_isFirstLoad) {
							setTimeout(function() {
								g_comboBoxTree.setValueById(top.app.info.organizerInfo.organizerId);
							}, 300);
							g_isFirstLoad = false;
						}
					} else {
						top.app.message.error(data.RetMsg);
					}
				}
			});
		}, '200px');
	}
}

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatSex(value, row) {
	var i = g_sexDict.length;
	while(i--) {
		if(g_sexDict[i].ID == value) {
			return g_sexDict[i].NAME;
		}
	}
	return "未知";
}

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatStatus(value, row) {
	var i = g_statusDict.length;
	while(i--) {
		if(g_statusDict[i].ID == value) {
			return g_statusDict[i].NAME;
		}
	}
	return "未知";
}

/**
 * 格式化状态
 * @param value
 * @param row
 */
function tableFormatemphasis(value, row) {
	if(row.emphasis == 1) {
		return '<font color=red>重要客户</font>';
	} else {
		return '一般客户';
	}

}