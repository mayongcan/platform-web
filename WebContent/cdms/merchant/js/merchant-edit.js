var g_params = {}, g_comboBoxTree = null, 
	g_avatarImgPath = null, g_officeImg = null, g_logoPath = null, g_certificateImgsPath = null;
$(function () {
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "merchant.html?_pid=" + pid;
    });
	$("#layerOk").click(function () {
		$("form").submit();
    });
	g_params = top.app.info.iframe.params;
	initTree();
	initDistrict();
	initView()
});

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
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#industryId') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.api.cdms.merchant.industry.getIndustryTree,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken()
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
					setTimeout(function () {
						if(g_params.type == "edit" && g_params.rows.industryId != null && g_params.rows.industryId != undefined)
							g_comboBoxTree.setValueById(g_params.rows.industryId);
				    }, 300);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	}, '100%');
}

/**
 * 初始化界面
 */
function initView(){
	addComboBox();
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#prtnName').val(g_params.rows.prtnName);
		$('#prtnType').val(g_params.rows.prtnType);
		$('#summary').val(g_params.rows.summary);
		$('#summary').val(g_params.rows.summary);
		$('#area').val(g_params.rows.area);
		$('#respMan').val(g_params.rows.respMan);
		$('#manSex').val(g_params.rows.manSex);
		$('#credentialsType').val(g_params.rows.credentialsType);
		$('#credentialsNum').val(g_params.rows.credentialsNum);
		$('#website').val(g_params.rows.website);
		$('#accountWx').val(g_params.rows.accountWx);
		$('#accountQq').val(g_params.rows.accountQq);
		$('#address').val(g_params.rows.address);
		$('#zipCode').val(g_params.rows.zipCode);
		$('#telNbr').val(g_params.rows.telNbr);
		$('#mobNbr1').val(g_params.rows.mobNbr1);
		$('#mobNbr2').val(g_params.rows.mobNbr2);
		$('#scale').val(g_params.rows.scale);
		$('#artiPerson').val(g_params.rows.artiPerson);
		$('#regCapital').val(g_params.rows.regCapital);
		$('#busiLice').val(g_params.rows.busiLice);
		$('#reveNbr').val(g_params.rows.reveNbr);
		$('#mgrNbr').val(g_params.rows.mgrNbr);
		$('#signIntention').val(g_params.rows.signIntention);
		$('#memo').val(g_params.rows.memo);
		$('#businessScope').val(g_params.rows.businessScope);
		$('#position').val(g_params.rows.position);
		$('#cooperationTypes').val(g_params.rows.cooperationTypes);
		$('#credit').val(g_params.rows.credit);
		$('#certificate').val(g_params.rows.certificate);
		$('#bizStartTime').val(g_params.rows.bizStartTime);
		$('#ourMan').val(g_params.rows.ourMan);
		$('#ourPhone').val(g_params.rows.ourPhone);
		$('#qualitySum').val(g_params.rows.qualitySum);
		$('#qualityCount').val(g_params.rows.qualityCount);
		$('#serviceSum').val(g_params.rows.serviceSum);
		$('#serviceCount').val(g_params.rows.serviceCount);
		$('#creditMark').val(g_params.rows.creditMark);
		$('#commentCount').val(g_params.rows.commentCount);
		$('#scoreCount').val(g_params.rows.scoreCount);
		$('#stat').val(g_params.rows.stat);
		$('#ourShow').val(g_params.rows.ourShow);
		$('#isShow').val(g_params.rows.isShow);
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
 * 动态添加下拉选择框
 */
function addComboBox(){
	top.app.addComboBoxOption($("#prtnType"), g_params.typeDict);
	top.app.addComboBoxOption($("#manSex"), g_params.sexDict);
	top.app.addComboBoxOption($("#credentialsType"), g_params.credentialsTypeDict);
	top.app.addComboBoxOption($("#signIntention"), g_params.signDict);
	top.app.addComboBoxOption($("#stat"), g_params.statDict);
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	prtnName: {required: true},
        	zipCode:{isZipCode: true},
        	telNbr:{isMobile: true},
        	mobNbr1:{isMobile: true},
        	mobNbr2:{isMobile: true}
        },
        messages: {
        	prtnName: {required: "请输入商家名称"}
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
		submitData['prtnId'] = g_params.rows.prtnId;
	submitData["industryId"] = g_comboBoxTree.getNodeId();
	submitData["prtnName"] = $.trim($("#prtnName").val());
	submitData["prtnType"] = $("#prtnType").val();
	submitData["summary"] = $.trim($("#summary").val());
	submitData["area"] = $("#area").val();
	submitData["respMan"] = $("#respMan").val();
	submitData["manSex"] = $("#manSex").val();
	submitData["credentialsType"] = $("#credentialsType").val();
	submitData["credentialsNum"] = $("#credentialsNum").val();
	submitData["website"] = $("#website").val();
	submitData["accountWx"] = $("#accountWx").val();
	submitData["accountQq"] = $("#accountQq").val();
	submitData["address"] = $("#address").val();
	submitData["zipCode"] = $("#zipCode").val();
	submitData["telNbr"] = $("#telNbr").val();
	submitData["mobNbr1"] = $("#mobNbr1").val();
	submitData["mobNbr2"] = $("#mobNbr2").val();
	submitData["scale"] = $("#scale").val();
	submitData["artiPerson"] = $("#artiPerson").val();
	submitData["regCapital"] = $("#regCapital").val();
	submitData["busiLice"] = $("#busiLice").val();
	submitData["reveNbr"] = $("#reveNbr").val();
	submitData["mgrNbr"] = $("#mgrNbr").val();
	submitData["signIntention"] = $("#signIntention").val();
	submitData["memo"] = $("#memo").val();
	submitData["businessScope"] = $("#businessScope").val();
	submitData["position"] = $("#position").val();
	submitData["cooperationTypes"] = $("#cooperationTypes").val();
	submitData["credit"] = $("#credit").val();
	submitData["certificate"] = $("#certificate").val();
	submitData["bizStartTime"] = $("#bizStartTime").val();
	submitData["ourMan"] = $("#ourMan").val();
	submitData["ourPhone"] = $("#ourPhone").val();
	submitData["qualitySum"] = $("#qualitySum").val();
	submitData["qualityCount"] = $("#qualityCount").val();
	submitData["serviceSum"] = $("#serviceSum").val();
	submitData["serviceCount"] = $("#serviceCount").val();
	submitData["creditMark"] = $("#creditMark").val();
	submitData["commentCount"] = $("#commentCount").val();
	submitData["scoreCount"] = $("#scoreCount").val();
	submitData["stat"] = $("#stat").val();
	submitData["ourShow"] = $("#ourShow").val();
	submitData["isShow"] = $("#isShow").val();
	
	if(g_avatarImgPath != null && g_avatarImgPath != undefined)
		submitData["avatarImg"] = g_avatarImgPath;
	if(g_officeImg != null && g_officeImg != undefined)
		submitData["officeImg"] = g_officeImg;
	if(g_logoPath != null && g_logoPath != undefined)
		submitData["logo"] = g_logoPath;
	if(g_certificateImgsPath != null && g_certificateImgsPath != undefined)
		submitData["certificateImgs"] = g_certificateImgsPath;

	//设置区域内容
	if($("#areaDistrict").val() != null && $("#areaDistrict").val() != undefined && $("#areaDistrict").val() != '')
		submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val() + "," + $("#areaDistrict").val();
	else submitData["areaCode"] = $("#areaProvince").val() + "," + $("#areaCity").val();
	if($("#areaDistrict").find("option:selected").text() != null && $("#areaDistrict").find("option:selected").text() != undefined && $("#areaDistrict").find("option:selected").text() != '')
		submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text() + "-" + $("#areaDistrict").find("option:selected").text();
	else submitData["areaName"] = $("#areaProvince").find("option:selected").text() + "-" + $("#areaCity").find("option:selected").text();
	
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.alert("数据保存成功！");

	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href= "merchant.html?_pid=" + pid;
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
	if(!g_comboBoxTree.isSelectNode()){
		top.app.message.alert("请选择行业类型！");
		return;
	}
	var hasAvatarImg = true, hasOfficeImg = true, hasLogoImg = true, hasCertificateImgsImg = true;
	var finishAvatarImg = 0, finishOfficeImg = 0, finishLogoImg = 0, finishCertificateImgsImg = 0;
	if($("#avatarImg")[0].files[0] == null || $("#avatarImg")[0].files[0] == undefined){
		hasAvatarImg = false;
		finishAvatarImg = 1;
	}
	if($("#officeImg")[0].files[0] == null || $("#officeImg")[0].files[0] == undefined){
		hasOfficeImg = false;
		finishOfficeImg = 1;
	}
	if($("#logo")[0].files[0] == null || $("#logo")[0].files[0] == undefined){
		hasLogoImg = false;
		finishLogoImg = 1;
	}
	if($("#certificateImgs")[0].files[0] == null || $("#certificateImgs")[0].files[0] == undefined){
		hasCertificateImgsImg = false;
		finishCertificateImgsImg = 1;
	}
	//上传图片到资源服务器
	if(hasAvatarImg){
		top.app.uploadImage($("#avatarImg")[0].files[0], function(data){
			g_avatarImgPath = data;
			finishAvatarImg = 1;
		});
	}
	if(hasOfficeImg){
		top.app.uploadMultiImage($("#officeImg")[0].files, function(data){
			g_officeImg = data;
			finishOfficeImg = 1;
		});
	}
	if(hasLogoImg){
		top.app.uploadImage($("#logo")[0].files[0], function(data){
			g_logoPath = data;
			finishLogoImg = 1;
		});
	}
	if(hasCertificateImgsImg){
		top.app.uploadImage($("#certificateImgs")[0].files[0], function(data){
			g_certificateImgsPath = data;
			finishCertificateImgsImg = 1;
		});
	}
	top.app.message.loading();
	//使用定时器判断是否已上传结束
	$('#onTime').timer({
	    duration: '1s',
	    callback: function() {
	    	if(finishAvatarImg == 1 && finishOfficeImg == 1 && finishLogoImg == 1 && finishCertificateImgsImg == 1){
	    		$("#onTime").timer('pause');
	    		submitAction();
	    	}
	    },
	    repeat: true //重复调用
	});
	
}