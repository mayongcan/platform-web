var g_params = {}, g_comboBoxTree = null, g_goodsImgPath = null, g_goodsAlbumPath = null;
$(function () {
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "goods.html?_pid=" + pid;
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
	g_comboBoxTree.init($('#categoryId') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.api.cdms.goods.category.getCategoryTree,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken()
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
					setTimeout(function () {
						if(g_params.type == "edit" && g_params.rows.catId != null && g_params.rows.catId != undefined)
							g_comboBoxTree.setValueById(g_params.rows.catId);
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
	$('#divAutoendDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss', allowInputToggle: true});
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#goodsName').val(g_params.rows.goodsName);
		$('#merchantName').val(g_params.rows.merchantName);
		$('#categoryName').val(g_params.rows.categoryName);
		$('#brandName').val(g_params.rows.brandName);
		$('#goodsType').val(g_params.rows.goodsType);
		$('#longitude').val(g_params.rows.longitude);
		$('#latitude').val(g_params.rows.latitude);
		$('#tel').val(g_params.rows.tel);
		$('#brief').val(g_params.rows.brief);
		$('#goodsDesc').val(g_params.rows.goodsDesc);
		$('#clickCount').val(g_params.rows.clickCount);
		$('#minPrice').val(g_params.rows.minPrice);
		$('#maxCommission').val(g_params.rows.maxCommission);
		$('#maxRabate').val(g_params.rows.maxRabate);
		$('#goodsStat').val(g_params.rows.goodsStat);
		$('#goodsSale').val(g_params.rows.goodsSale);
		$('#goodsParams').val(g_params.rows.goodsParams);
		$('#goodsService').val(g_params.rows.goodsService);
		$('#dispOrder').val(g_params.rows.dispOrder);
		$('#autoendDate').val(g_params.rows.autoendDate);
		$('#createDate').val(g_params.rows.createDate);
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
	top.app.addComboBoxOption($("#goodsType"), g_params.typeDict);
	top.app.addComboBoxOption($("#goodsStat"), g_params.statDict);
	
	//获取商家列表
	$.ajax({
	    url: top.app.conf.url.api.cdms.merchant.merchant.getMerchantKeyVal,
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken()
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0){
	    			top.app.addComboBoxOption($("#merchantName"), data.RetData);
	    			//刷新数据，否则下拉框显示不出内容
	    			$('.selectpicker').selectpicker('refresh');
	    		}
	    	}else{
	    		top.app.message.error(data.RetMsg);
	    	}
		}
	});
	//获取品牌列表
	$.ajax({
	    url: top.app.conf.url.api.cdms.goods.brand.getBrandKeyVal,
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken()
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0){
	    			top.app.addComboBoxOption($("#brandName"), data.RetData);
	    			//刷新数据，否则下拉框显示不出内容
	    			$('.selectpicker').selectpicker('refresh');
	    		}
	    	}else{
	    		top.app.message.error(data.RetMsg);
	    	}
		}
	});
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	goodsName: {required: true},
        	tel:{isMobile: true}
        },
        messages: {
        	goodsName: {required: "请输入商品名称"}
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
		submitData['goodsId'] = g_params.rows.goodsId;
	submitData["catId"] = g_comboBoxTree.getNodeId();
	submitData["goodsName"] = $.trim($("#goodsName").val());
	submitData["prtnId"] = $("#merchantName").val();
	submitData["brandId"] = $("#brandName").val();
	submitData["goodsType"] = $("#goodsType").val();
	submitData["area"] = $("#area").val();
	submitData["longitude"] = $("#longitude").val();
	submitData["latitude"] = $("#latitude").val();
	submitData["tel"] = $("#tel").val();
	submitData["brief"] = $("#brief").val();
	submitData["goodsDesc"] = $("#goodsDesc").val();
	submitData["clickCount"] = $("#clickCount").val();
	submitData["minPrice"] = $("#minPrice").val();
	submitData["maxCommission"] = $("#maxCommission").val();
	submitData["maxRabate"] = $("#maxRabate").val();
	submitData["goodsStat"] = $("#goodsStat").val();
	submitData["goodsSale"] = $("#goodsSale").val();
	submitData["goodsParams"] = $("#goodsParams").val();
	submitData["goodsService"] = $("#goodsService").val();
	submitData["autoendDate"] = $("#autoendDate").val();
	submitData["dispOrder"] = $("#dispOrder").val();
	
	if(g_goodsImgPath != null && g_goodsImgPath != undefined)
		submitData["goodsImg"] = g_goodsImgPath;
	if(g_goodsAlbumPath != null && g_goodsAlbumPath != undefined)
		submitData["goodsAlbum"] = g_goodsAlbumPath;

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
	   			window.location.href= "goods.html?_pid=" + pid;
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
		top.app.message.alert("请选择商品分类！");
		return;
	}
	var hasGoodsImg = true, hasGoodsAlbum = true;
	var finishGoodsImg = 0, finishGoodsAlbum = 0;
	if($("#goodsImg")[0].files[0] == null || $("#goodsImg")[0].files[0] == undefined){
		hasGoodsImg = false;
		finishGoodsImg = 1;
	}
	if($("#goodsAlbum")[0].files[0] == null || $("#goodsAlbum")[0].files[0] == undefined){
		hasGoodsAlbum = false;
		finishGoodsAlbum = 1;
	}
	//上传图片到资源服务器
	if(hasGoodsImg){
		top.app.uploadImage($("#goodsImg")[0].files[0], function(data){
			g_goodsImgPath = data;
			finishGoodsImg = 1;
		});
	}
	if(hasGoodsAlbum){
		top.app.uploadMultiImage($("#goodsAlbum")[0].files, function(data){
			g_goodsAlbumPath = data;
			finishGoodsAlbum = 1;
		});
	}
	top.app.message.loading();
	//使用定时器判断是否已上传结束
	$('#onTime').timer({
	    duration: '1s',
	    callback: function() {
	    	if(finishGoodsImg == 1 && finishGoodsAlbum == 1){
	    		$("#onTime").timer('pause');
	    		submitAction();
	    	}
	    },
	    repeat: true //重复调用
	});
	
}