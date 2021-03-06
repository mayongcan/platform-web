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
	$('#divCreateDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#name').val(g_params.rows.name);
		$('#totalCnt').val(g_params.rows.totalCnt);
		$('#level').val(g_params.rows.level);
		$('#grade').val(g_params.rows.grade);
		$('#model').val(g_params.rows.model);
		$('#feature').val(g_params.rows.feature);
		$('#memo').val(g_params.rows.memo);
	}
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	name: {required: true},
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
	var rowObj = {};
	rowObj.name = $("#name").val();
	rowObj.totalCnt = $("#totalCnt").val();
	rowObj.level = $("#level").val();
	rowObj.grade = $("#grade").val();
	rowObj.model = $("#model").val();
	rowObj.feature = $("#feature").val();
	rowObj.memo = $("#memo").val();
	parent.app.layer.retParams = [];
	parent.app.layer.retParams.push(rowObj);

	//关闭页面前设置结果
	parent.app.layer.editLayerRet = true;
	parent.layer.close(g_iframeIndex);
}