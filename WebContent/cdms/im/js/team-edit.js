var g_params = {}, g_iframeIndex = null;
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
	if(g_params.type == "edit"){
		$('#teamName').val(g_params.rows.teamName);
		$('#intro').val(g_params.rows.intro);
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	teamName: {required: true}
        },
        messages: {
        	teamName: {required: "请输入群名称"},
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
	if(g_params.rows != null && g_params.rows != undefined){
		submitData['id'] = g_params.rows.id;
		submitData['teamId'] = g_params.rows.teamId;
	}
	submitData["teamName"] = $.trim($("#teamName").val());
	submitData["intro"] = $("#intro").val();
	
	if(g_params.type == "edit"){
		//更新
		imUtils.updateTeam(g_params.rows.teamId, $.trim($("#teamName").val()), $("#intro").val(), function(data){
			updateData(submitData);
		},function(){
			top.app.message.error("更新群失败");
		})
	}else{
		//创建
		imUtils.createTeam($.trim($("#teamName").val()), $("#intro").val(), function(data){
			submitData["teamId"] = data.tid;
			updateData(submitData);
		},function(){
			top.app.message.error("创建群失败");
		})
	}
}

function updateData(submitData){
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
