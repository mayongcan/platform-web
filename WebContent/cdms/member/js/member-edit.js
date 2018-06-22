var g_params = {}, g_iframeIndex = null, g_filePath = null, g_comboxOrganizerTree = null;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
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
function receiveParams(value){
	g_params = value;
	initComboBoxList();
	initDistrict();
	//初始化界面
	initView();
}

/**
 * 初始化省市区
 */
function initDistrict(){
	if(g_params.type == "edit"){
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), g_params.rows.areaCode);
	}else{
		top.app.initDistrict($("#areaProvince"), $("#areaCity"), $("#areaDistrict"), null);
	}
}

/**
 * 初始化界面
 */
function initView(){
	top.app.addComboBoxOption($("#credentialsType"), g_params.credentialsDict);
	top.app.addComboBoxOption($("#sex"), g_params.sexDict);
	top.app.addComboBoxOption($("#status"), g_params.statusDict);
	top.app.addComboBoxOption($("#emphasis"), g_params.emphasis);
	$('#birthday').datepicker({language: 'zh-CN',todayBtn:"linked",keyboardNavigation:false,forceParse:false,autoclose:true});
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#memberName').val(g_params.rows.memberName);
		$('#phone').val(g_params.rows.phone);
		$('#password').val(g_params.rows.password);
		$('#nativePlace').val(g_params.rows.nativePlace);
		$('#credentialsType').val(g_params.rows.credentialsType);
		$('#credentialsNum').val(g_params.rows.credentialsNum);
		$('#sex').val(g_params.rows.sex);
		$('#emphasis').val(g_params.rows.emphasis);
		$('#birthday').val($.date.dateFormat(g_params.rows.birthday, "yyyy-MM-dd"));
		$('#accountWx').val(g_params.rows.accountWx);
		$('#accountQq').val(g_params.rows.accountQq);
		$('#status').val(g_params.rows.status);
		$('#recommendCode').val(g_params.rows.recommendCode);
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片"});
	}
	
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 初始化下拉选择列表(租户和组织)
 */
function initComboBoxList(){
	//获取组织数据
	g_comboxOrganizerTree = AppCombotree.createNew();
	g_comboxOrganizerTree.init($('#organizerBox') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.api.system.organizer.getOrganizerTree,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
		    	tenantsId: g_params.tenantsId
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
					setTimeout(function () {
						if(g_params.type == "edit" && g_params.rows.officeId != null && g_params.rows.officeId != undefined){
							g_comboxOrganizerTree.setValueById(g_params.rows.officeId);
							g_organizerId = g_comboxOrganizerTree.getNodeId();
						}
				    }, 300);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	});
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	memberName: {required: true},
        	phone:{isMobile: true},
        	birthday: {dateISO:true}
        },
        messages: {
        	memberName: {required: "请输入会员名称"},
        	birthday: {dateISO: "请输入不带时间的正确日期格式,如：2017-01-01" }
        },
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
                return false;
            });  
        },
        //失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
            //提交内容
        	ajaxUpload();
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined)
		submitData['memberId'] = g_params.rows.memberId;
	submitData["officeId"] = g_comboxOrganizerTree.getNodeId();
	submitData["memberName"] = $.trim($("#memberName").val());
	submitData["phone"] = $("#phone").val();
	submitData["password"] = $.trim($("#password").val());
	submitData["nativePlace"] = $("#nativePlace").val();
	submitData["credentialsType"] = $("#credentialsType").val();
	submitData["credentialsNum"] = $("#credentialsNum").val();
	submitData["sex"] = $("#sex").val();
	submitData["emphasis"] = $("#emphasis").val();
	submitData["birthday"] = $("#birthday").val();
	submitData["accountWx"] = $("#accountWx").val();
	submitData["accountQq"] = $("#accountQq").val();
	submitData["status"] = $("#status").val();
	submitData["recommendCode"] = $("#recommendCode").val();
	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();
	
	if(g_filePath != null && g_filePath != undefined)
		submitData["avatarImg"] = g_filePath;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.alert("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 提交图片
 */
function ajaxUpload(){
	if(!g_comboxOrganizerTree.isSelectNode()){
		top.app.message.alert("请选择归属组织！");
		return;
	}
	if($("#avatarImg")[0].files[0] == null || $("#avatarImg")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		if(g_params.type == "edit"){
			//启动加载层
			top.app.message.loading();
   			submitAction();
			return;
		}else{
			top.app.message.alert("请选择要上传的文件！");
			return;
		}
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#avatarImg")[0].files[0], function(data){
		g_filePath = data;
		//提交数据
		submitAction();
	});
}