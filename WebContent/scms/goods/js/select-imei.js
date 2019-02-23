var g_params = {}, g_iframeIndex = null, list = [];

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
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
	
	
	//判断是新增还是修改
	/*if(g_params.type == "edit"){
		$('#goodsImei').val(g_params.rows.goodsImei);
		
	}else{
	}*/
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        },
        messages: {
        	
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
        	submitAction();
        }
    });
}

function getImei(){
	var imeilist = [];
	imeiList = $("#goodsImei").val().split(",");
	return imeiList;
	
}

/**
 * 提交数据
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	/*if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;*/
	list = g_params.val;
	submitData["shopID"] = list[1]; //店铺id
	submitData["colorID"] = list[2];//颜色id
	submitData["sizeID"] = list[3]; //规格id
	alert(g_params.goodsSerialNum);
	submitData["goodsSerialnum"] = g_params.goodsSerialNum;
	submitData["goodsImeiList"] =  $("#goodsImei").val();
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
	   			top.app.message.notice("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


