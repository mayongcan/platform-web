var g_params = {}, g_iframeIndex = null;
var g_filePath = null, g_fileSize = 0;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '225px'
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
	if(g_params.type == "edit"){
		$('#orderCode').val(g_params.rows.orderCode);
		$('#owner').val(g_params.rows.owner);
		$('#name').val(g_params.rows.name);
		$('#grade').val(g_params.rows.grade);
		$('#serialNo').val(g_params.rows.serialNo);
		$('#feature').val(g_params.rows.feature);
		$('#totalCnt').val(g_params.rows.totalCnt);
		$('#unit').val(g_params.rows.unit);
		$('#memo').val(g_params.rows.memo);
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	orderCode: {required: true},
        	owner: {required: true},
        	name: {required: true},
        	grade: {required: true},
        	serialNo: {required: true},
        	feature: {required: true},
        	totalCnt: {required: true},
        	unit: {required: true},
        	memo: {required: true},
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
	submitData["preservationId"] = g_params.preservationId;
	submitData["registerId"] = g_params.registerId;

	submitData["orderCode"] = $.trim($("#orderCode").val());
	submitData["owner"] = $("#owner").val();
	submitData["name"] = $("#name").val();
	submitData["grade"] = $("#grade").val();
	submitData["serialNo"] = $("#serialNo").val();
	submitData["feature"] = $("#feature").val();
	submitData["totalCnt"] = $("#totalCnt").val();
	submitData["unit"] = $("#unit").val();
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