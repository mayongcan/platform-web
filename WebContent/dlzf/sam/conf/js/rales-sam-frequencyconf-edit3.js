var g_params = {}, g_iframeIndex = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '180px'
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
    //var areaTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_AREATYPE');
	top.app.addComboBoxOption($("#areaType"), g_params.areaTypeDict);
    //var regionDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_REGION');
	top.app.addComboBoxOption($("#region"), g_params.regionDict);
    //var gropuDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_GROPU');
	top.app.addComboBoxOption($("#gropu"), g_params.gropuDict);
    //var frequencyTypeDict = top.app.getDictDataByDictTypeValue('RALES_SAM_FREQUENCYCONF_FREQUENCYTYPE');
//	top.app.addComboBoxOption($("#frequencyType"), g_params.frequencyTypeDict);
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#areaType').val(g_params.rows.areaType);
		$('#region').val(g_params.rows.region);
		$('#gropu').val(g_params.rows.gropu);
		$('#frequencyType').val(g_params.rows.frequencyType);
		$('#frequencyCode').val(g_params.rows.frequencyCode);
		$('#centerFrequency').val(g_params.rows.centerFrequency);
		$('#mobileStation').val(g_params.rows.mobileStation);
		$('#baseStation').val(g_params.rows.baseStation);
		$('#memo').val(g_params.rows.memo);
		
	}else{
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
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;
		
	submitData["stationType"] = "3";
	submitData["areaType"] = $("#areaType").val();
	submitData["region"] = $("#region").val();
	submitData["gropu"] = $("#gropu").val();
	submitData["frequencyType"] = $("#frequencyType").val();
	submitData["frequencyCode"] = $("#frequencyCode").val();
	submitData["centerFrequency"] = $("#centerFrequency").val();
	submitData["mobileStation"] = $("#mobileStation").val();
	submitData["baseStation"] = $("#baseStation").val();
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


