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
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value) {
	g_params = value;
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView() {
	top.app.addComboBoxOption($("#SETTLE_STAT"), g_params.statusDict);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#DRUG_ID').val(g_params.rows.DRUG_ID);
		$('#DRUG_NAME').val(g_params.rows.DRUG_NAME);
		$('#CAT_NAME').val(g_params.rows.CAT_NAME);
		$('#SALES_PRICE').val(g_params.rows.SALES_PRICE);
		$('#COST_PRICE').val(g_params.rows.COST_PRICE);
		$('#METHOD').val(g_params.rows.METHOD);
		$('#DOSAGE').val(g_params.rows.DOSAGE);
		$('#UNITS').val(g_params.rows.UNITS);
		$('#FREQUENCY').val(g_params.rows.FREQUENCY);
		$('#DAY').val(g_params.rows.DAY);
		$('#NUM').val(g_params.rows.NUM);
		$('#DESCRIBE_CONTENT').val(g_params.rows.DESCRIBE_CONTENT);
		$('#SUGGEST').val(g_params.rows.SUGGEST);
		$('#SOURCE').val(g_params.rows.SOURCE);
		$('#COMMISSION_RATE').val(g_params.rows.COMMISSION_RATE);
		$('#COMMISSION').val(g_params.rows.COMMISSION);
		$('#SETTLE_STAT').val(g_params.rows.SETTLE_STAT);
		$('#REBUY_STAT').val(g_params.rows.REBUY_STAT);
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
function formValidate() {
	$("#divEditForm").validate({
		rules: {
			DRUG_ID: {required: true},
			DRUG_NAME: {required: true},
			DOSAGE: {digits:true},
			UNITS: {digits:true},
			FREQUENCY: {digits:true},
			DAY: {digits:true},
			NUM: {digits:true},
			COMMISSION: { number: true, min: 0.01, minNumber: $("#marketPrice").val() }
		},
		messages: {
			DRUG_ID: {required: "请输入药品编号"},
			DRUG_NAME: {required: "请输入药品名称"},
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
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined){
		submitData['salesId'] = g_params.rows.SALES_ID;
	}
	submitData["userId"] = g_params.userId;
	submitData["memberId"] = g_params.memberId;
	submitData["taskId"] = g_params.taskId;

	submitData["drugId"] = $("#DRUG_ID").val();
	submitData["drugName"] = $("#DRUG_NAME").val();
	submitData["catName"] = $("#CAT_NAME").val();
	submitData["salesPrice"] = $("#SALES_PRICE").val();
	submitData["costPrice"] = $("#COST_PRICE").val();
	submitData["method"] = $("#METHOD").val();
	submitData["dosage"] = $("#DOSAGE").val();
	submitData["units"] = $("#UNITS").val();
	submitData["frequency"] = $("#FREQUENCY").val();
	submitData["day"] = $("#DAY").val();
	submitData["num"] = $("#NUM").val();
	submitData["describeContent"] = $("#DESCRIBE_CONTENT").val();
	submitData["suggest"] = $("#SUGGEST").val();
	submitData["source"] = $("#SOURCE").val();
	submitData["commissionRate"] = $("#COMMISSION_RATE").val();
	submitData["commission"] = $("#COMMISSION").val();
	submitData["settleStat"] = $("#SETTLE_STAT").val();
	submitData["rebuyStat"] = $("#REBUY_STAT").val();
	if(g_filePath != null && g_filePath != undefined)
		submitData["images"] = g_filePath;
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

/**
 * 提交图片
 */
function ajaxUpload(){
	if($("#images")[0].files[0] == null || $("#images")[0].files[0] == undefined){
		//如果是编辑内容，可以不修改图片,直接进入提交数据
		if(g_params.type == "edit"){
   			submitAction();
			return;
		}else{
			//top.app.message.alert("请选择要上传的文件！");
			submitAction();
			return;
		}
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#images")[0].files[0], function(data){
		g_filePath = data;
		//提交数据
		submitAction();
	});
}