var g_params = {}, g_iframeIndex = null;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度为200px
	$('.selectpicker').selectpicker({
		width: '520px'
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
	top.app.addComboBoxOption($("#type"), g_params.contentTypeDict);
	top.app.addComboBoxOption($("#judgeAnswer"), g_params.contentJudgeDict);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#title').val(g_params.rows.title);
		$('#type').val(g_params.rows.type);
		$('#contentScore').val(g_params.rows.contentScore);
		$('#sa').val(g_params.rows.sa);
		$('#sb').val(g_params.rows.sb);
		$('#sc').val(g_params.rows.sc);
		$('#sd').val(g_params.rows.sd);
		$('#se').val(g_params.rows.se);
		$('#sf').val(g_params.rows.sf);
		$('#sg').val(g_params.rows.sg);
		$('#judgeAnswer').val(g_params.rows.judgeAnswer);
		$('#selectAnswer').val(g_params.rows.selectAnswer);
		$('#dispOrder').val(g_params.rows.dispOrder);
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
        	title: {required: true},
        	dispOrder:  {required: true, digits:true}
        },
        messages: {
        	title: {required: "请输入试题内容标题"},
        	dispOrder: {required: "请输入排列顺序", digits: "用户数量必须为0－999999之间的数字"}
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
		submitData['contentId'] = g_params.rows.contentId;
	submitData["questionId"] = g_params.questionId;
	submitData["title"] = $.trim($("#title").val());
	submitData["type"] = $("#type").val();
	submitData["contentScore"] = $.trim($("#contentScore").val());
	submitData["sa"] = $.trim($("#sa").val());
	submitData["sb"] = $.trim($("#sb").val());
	submitData["sc"] = $.trim($("#sc").val());
	submitData["sd"] = $.trim($("#sd").val());
	submitData["se"] = $.trim($("#se").val());
	submitData["sf"] = $.trim($("#sf").val());
	submitData["sg"] = $.trim($("#sg").val());
	submitData["judgeAnswer"] = $.trim($("#judgeAnswer").val());
	submitData["selectAnswer"] = $.trim($("#selectAnswer").val());
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