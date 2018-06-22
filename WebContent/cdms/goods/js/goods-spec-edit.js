var g_params = {}, g_iframeIndex;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度为
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
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#specName').val(g_params.rows.specName);
		$('#marketPrice').val(g_params.rows.marketPrice);
		$('#shopPrice').val(g_params.rows.shopPrice);
		$('#promotePrice').val(g_params.rows.promotePrice);
		$('#commission').val(g_params.rows.commission);
		$('#rabate').val(g_params.rows.rabate);
		$('#goodsNumber').val(g_params.rows.goodsNumber);
		$('#goodsGroupFlag').val(g_params.rows.goodsGroupFlag);
		$('#goodsGroupNum').val(g_params.rows.goodsGroupNum);
		$('#goodsGroupValid').val(g_params.rows.goodsGroupValid);
		$('#specStat').val(g_params.rows.specStat);
		$('#effDate').val(g_params.rows.effDate);
	}
	$('.selectpicker').selectpicker('refresh');
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	specName: {required: true},
        	marketPrice: { required: true, number: true, min: 0.01, minNumber: $("#marketPrice").val() },
        	shopPrice: { required: true, number: true, min: 0.01, minNumber: $("#shopPrice").val() },
        	promotePrice: { required: true, number: true, min: 0.01, minNumber: $("#promotePrice").val() },
        	commission: { required: true, number: true, min: 0.01, minNumber: $("#commission").val() },
        	rabate: { required: true, number: true, min: 0.01, minNumber: $("#rabate").val() },
        	goodsNumber: {  number: true },
        	goodsGroupNum: {  number: true }
        },
        messages: {
        	specName: {required: "请输入商品规格名称"}
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
		submitData['specId'] = g_params.rows.specId;
	submitData["goodsId"] = g_params.goodsId;
	submitData["specName"] = $.trim($("#specName").val());
	submitData["marketPrice"] = $("#marketPrice").val();
	submitData["shopPrice"] = $("#shopPrice").val();
	submitData["promotePrice"] = $("#promotePrice").val();
	submitData["commission"] = $("#commission").val();
	submitData["rabate"] = $("#rabate").val();
	submitData["goodsNumber"] = $("#goodsNumber").val();
	submitData["goodsGroupFlag"] = $("#goodsGroupFlag").val();
	submitData["goodsGroupNum"] = $("#goodsGroupNum").val();
	submitData["goodsGroupValid"] = $("#goodsGroupValid").val();
	submitData["specStat"] = $("#specStat").val();
	submitData["effDate"] = $("#effDate").val();
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