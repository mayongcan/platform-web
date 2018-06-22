var g_typeDict = [], g_sourceDict = [], g_sexDict = [];
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";

$(function () {
	top.app.message.loading();
	//初始化字典
	initDict();
	initView();
	formValidate();
	top.app.message.loadingClose();
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
	g_typeDict = top.app.getDictDataByDictTypeValue('RALES_CRL_TYPE');
	g_sourceDict = top.app.getDictDataByDictTypeValue('RALES_CRL_SOURCE');
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
}

function initView(){
	$('#divCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	top.app.addRadioButton($("#divType"), g_typeDict, 'radioType', "1");
	top.app.addRadioButton($("#divSource"), g_sourceDict, 'radioSource', "1");
	top.app.addRadioButton($("#divSex"), g_sexDict, 'radioSex', "3");

	fileupload.initFileNewSelector('files');
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = "complaint-new.html?_pid=" + pid;
    });

	//选择接待员
	$("#sendBy").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择接待员', ['900px', '550px'], '/rales/clr/complaint/complaint-receptionist.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#sendBy").val(retParams[0].userNameList);
		});
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	name: {required: true},
        	certificateNo: {required: true, isIdCardNo: true},
        	content: {required: true},
        	phone: {isMobile: true},
        	age:  {digits:true},
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
        	fileupload.uploadAction(null, false, true, "-1", function(){submitAction();});
        }
    });
}

/**
 * 提交数据
 * @returns
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	submitData["type"] = $('#divType input:radio:checked').val();
	submitData["source"] = $('#divSource input:radio:checked').val();
	submitData["sex"] = $('#divSex input:radio:checked').val();
	submitData["name"] = $('#name').val();
	submitData["certificateNo"] = $("#certificateNo").val();
	submitData["age"] = $("#age").val();
	submitData["company"] = $("#company").val();
	submitData["address"] = $("#address").val();
	submitData["phone"] = $("#phone").val();
	submitData["checkDate"] = $("#checkDate").val();
	submitData["sendBy"] = g_userIdList;
	submitData["sendByName"] = g_userNameList;
	submitData["content"] = $("#content").val();

	submitData["isLeaderKnow"] = $('#divIsLeaderKnow input:radio:checked').val();

	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();
	
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/startFlow?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = "complaint-new.html?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}