var g_params = {},
	g_iframeIndex = null,
	g_filePath = null,
	g_comboxOrganizerTree = null;
$(function() {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function() {
		parent.layer.close(g_iframeIndex);
	});
	$('#areaProvince').selectpicker({
		width: '177px'
	});
	$('#areaCity').selectpicker({
		width: '177px'
	});
	$('#areaDistrict').selectpicker({
		width: '177px'
	});
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value) {
	g_params = value;
	initComboBoxList();
	initDistrict();
	//初始化界面
	initView();
}

/**
 * 初始化省市区
 */
function initDistrict() {
	if(g_params.type == "edit") {
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_params.rows.areaCode);
	} else {
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), null);
	}
}

/**
 * 初始化界面
 */
function initView() {
	top.app.addComboBoxOption($("#type"), g_params.typeDict);

	$('#birthday').datepicker({
		language: 'zh-CN',
		todayBtn: "linked",
		keyboardNavigation: false,
		forceParse: false,
		autoclose: true
	});
	//判断是新增还是修改
	if(g_params.type == "edit") {

		$("#userId").val(g_params.rows.USER_ID);
		$("#memberId").val(g_params.rows.MEMBER_ID);
		$("#type").val(g_params.rows.TYPE);
		$("#describeContent").val(g_params.rows.DESCRIBE_CONTENT);
		//alert(g_params.rows.MEMBER_ID);

	}

	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 初始化下拉选择列表(租户和组织)
 */
function initComboBoxList() {

	//获取用户列表
	$.ajax({
		url: top.app.conf.url.api.system.user.getUserKeyVal,
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken()
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0) {
					top.app.addComboBoxOption($("#userId"), data.RetData);
					//刷新数据，否则下拉框显示不出内容
					if(g_params.type == "edit") {
						$("#userId").val(g_params.rows.USER_ID);
					}
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});

	//获取会员列表
	$.ajax({
		url: top.app.conf.url.api.cdms.member.member.getMemberKeyVal,
		method: 'GET',
		data: {
			access_token: top.app.cookies.getCookiesToken()
		},
		success: function(data) {
			if(top.app.message.code.success == data.RetCode) {
				if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0) {
					top.app.addComboBoxOption($("#memberId"), data.RetData);
					//刷新数据，否则下拉框显示不出内容
					if(g_params.type == "edit") {
						$("#memberId").val(g_params.rows.MEMBER_ID);

					}
					$('.selectpicker').selectpicker('refresh');
				}
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}

/**
 * 表单验证
 */
function formValidate() {
	$("#divEditForm").validate({
		rules: {

		},
		messages: {

		},
		//重写showErrors
		showErrors: function(errorMap, errorList) {
			$.each(errorList, function(i, v) {
				//在此处用了layer的方法
				layer.tips(v.message, v.element, {
					time: 2000
				});
				return false;
			});
		},
		//失去焦点时不验证
		onfocusout: false,
		submitHandler: function() {
			//提交内容
			submitAction();
		}
	});
}

/**
 * 提交数据
 */
function submitAction() {
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined) {
		submitData['id'] = g_params.rows.ID;

	}
	submitData["userId"] = $("#userId").val();
	submitData["memberId"] = $("#memberId").val();
	submitData["type"] = $("#type").val();
	submitData["describeContent"] = $("#describeContent").val();

	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
		method: 'POST',
		data: JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data) {
			//alert(data);
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode) {
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
				top.app.message.alert("数据保存成功！");
				parent.layer.close(g_iframeIndex);
			} else {
				top.app.message.error(data.RetMsg);
			}
		}
	});
}