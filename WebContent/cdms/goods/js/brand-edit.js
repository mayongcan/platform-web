var g_params = {}, g_iframeIndex = null, g_comboBoxTree = null, g_filePath = null;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度为200px
	$('.selectpicker').selectpicker({
		width: '200px'
	});
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	initTree();
	//初始化界面
	initView();
}

/**
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#catId') , function (objNode, cb) {
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
	}, '200px');
}

/**
 * 初始化界面
 */
function initView(){
	//判断是新增还是修改
	if(g_params.type == "edit"){
		alert(g_params.rows.brandName);
		alert(g_params.rows.brandClass);
		$('#brandName').val(g_params.rows.brandName);
		$('#brandInitial').val(g_params.rows.brandInitial);
		$('#brandClass').val(g_params.rows.brandClass);
		$('#brandRecommend').val(g_params.rows.brandRecommend);
		$('#showType').val(g_params.rows.showType);
		$('#dispOrder').val(g_params.rows.dispOrder);
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
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	brandName: {required: true},
        	dispOrder: {required: true, digits:true}
        },
        messages: {
        	brandName: {required: "请输入品牌名称"},
        	dispOrder: {required: "请输入排列顺序", digits: "显示次序必须为0－999999之间的数字" }
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
	if(!g_comboBoxTree.isSelectNode()){
		top.app.message.alert("请选择商品分类！");
		return;
	}
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined)
		submitData['brandId'] = g_params.rows.brandId;
	submitData["catId"] = g_comboBoxTree.getNodeId();
	submitData["brandName"] = $.trim($("#brandName").val());
	submitData["brandInitial"] = $.trim($("#brandInitial").val());
	submitData["brandClass"] = $.trim($("#brandClass").val());
	submitData["brandRecommend"] = $.trim($("#brandRecommend").val());
	submitData["showType"] = $.trim($("showType").val());
	submitData["dispOrder"] = $("#dispOrder").val();
	if(g_filePath != null && g_filePath != undefined)
		submitData["brandPic"] = g_filePath;
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
	if($("#photo")[0].files[0] == null || $("#photo")[0].files[0] == undefined){
		//启动加载层
		top.app.message.loading();
		submitAction();
		return;
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#photo")[0].files[0], function(data){
		g_filePath = data;
		//提交数据
		submitAction();
	});
}