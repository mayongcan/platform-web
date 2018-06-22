var g_params = {}, g_iframeIndex = null, g_expensesNum = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '555px'
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
	scms.getShopPullDown($("#shopId"), scms.getUserMerchantsId(), false);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#expensesName').val(g_params.rows.expensesName);
		$('#expensesNum').val(g_params.rows.expensesNum);
		$('#incomeType').val(g_params.rows.incomeType);
		$('#shopId').val(g_params.rows.shopId);
		$('#memo').val(g_params.rows.memo);
	}
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
	
	//格式化金额输入框
	g_expensesNum = new Cleave('#expensesNum', {
	    numeral: true,
	    numeralThousandsGroupStyle: 'thousand'
	});
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	expensesName: {required: true},
        	expensesNum: {required: true, money: true},
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

/**
 * 提交数据
 */
function submitAction(){
	var merchantsId = scms.getUserMerchantsId()
	if($.utils.isEmpty(merchantsId)){
		top.app.message.noticeError("您没有绑定商户，不能进行当前操作！");
		return;
	}
	//定义提交数据
	var submitData = {};
	//如果变更了clientId，则需要传送到后端
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;

	submitData["merchantsId"] = merchantsId;
	submitData["shopId"] = $("#shopId").val();
	submitData["incomeType"] = $("#incomeType").val();
	submitData["expensesName"] = $("#expensesName").val();
	submitData["expensesNum"] = g_expensesNum.getRawValue();
	submitData["memo"] = $("#memo").val();
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


