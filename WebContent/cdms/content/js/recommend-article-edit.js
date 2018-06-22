var g_params = {}, g_iframeIndex;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度为200px
	$('.selectpicker').selectpicker({
		width: '542px'
	});
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	//获取文章列表
	$.ajax({
	    url: top.app.conf.url.api.cdms.content.article.getArticleKeyVal,
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken()
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0){
	    			top.app.addComboBoxOption($("#articleId"), data.RetData);
	    			//刷新数据，否则下拉框显示不出内容
	    			$('.selectpicker').selectpicker('refresh');
	    		}
	    	}else{
	    		top.app.message.error(data.RetMsg);
	    	}
		}
	});
	
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#articleId').val(g_params.rows.articleId);
		$('#dispOrder').val(g_params.rows.dispOrder);
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	dispOrder: {required: true, digits:true}
        },
        messages: {
        	dispOrder: {required: "请输入显示次序", digits: "显示次序必须为0－999999之间的数字" }
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
        	submitAction();
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
		submitData['id'] = g_params.rows.id;
	submitData["positionId"] = g_params.positionId;
	submitData["articleId"] = $("#articleId").val();
	submitData["dispOrder"] = $("#dispOrder").val();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
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