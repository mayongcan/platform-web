var g_params = {}, g_iframeIndex = null, g_comboBoxTree = null;
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度为200px
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
	initTree();
	//初始化界面
	initView();
}

/**
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#catId') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.api.cdms.exam.category.getCategoryTree,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken()
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
					setTimeout(function () {
						if(g_params.type == "edit" && g_params.rows.catId != null && g_params.rows.catId != undefined)
							g_comboBoxTree.setValueById(g_params.rows.catId);
				    }, 300);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	}, '200px');
}

/**
 * 初始化界面
 */
function initView(){
	//判断是新增还是修改
	top.app.addComboBoxOption($("#award"), g_params.awardDict);
	if(g_params.type == "edit"){
		$('#title').val(g_params.rows.title);
		$('#cnum').val(g_params.rows.cnum);
		$('#jnum').val(g_params.rows.jnum);
		$('#mnum').val(g_params.rows.mnum);
		$('#testTime').val(g_params.rows.testTime);
		$('#score').val(g_params.rows.score);
		$('#award').val(g_params.rows.award);
		$('#examLimitTimes').val(g_params.rows.examLimitTimes);
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
        	cnum: {required: true, digits:true},
        	jnum: {required: true, digits:true},
        	mnum: {required: true, digits:true},
        	testTime: {required: true, digits:true},
        	score: {required: true, digits:true}
        },
        messages: {
        	title: {required: "请输入试题名称"}
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
	if(!g_comboBoxTree.isSelectNode()){
		top.app.message.alert("请选择试题分类！");
		return;
	}
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined)
		submitData['questionId'] = g_params.rows.questionId;
	submitData["catId"] = g_comboBoxTree.getNodeId();
	submitData["title"] = $.trim($("#title").val());
	submitData["cnum"] = $("#cnum").val();
	submitData["award"] = $("#award").val();
	submitData["examLimitTimes"] = $("#examLimitTimes").val();
	submitData["jnum"] = $("#jnum").val();
	submitData["mnum"] = $("#mnum").val();
	submitData["testTime"] = $("#testTime").val();
	submitData["score"] = $("#score").val();
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