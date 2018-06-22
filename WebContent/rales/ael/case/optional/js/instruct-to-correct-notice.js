var g_params = {}, g_backUrl = null;
var g_codeType = "10", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	//$('#divDeadlineDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#tdCaseParties').text(g_params.row.parties);
	$('#tdIllegalContent').text(g_params.row.illegalContent);
	$('#tdDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#tdAddress').text(g_params.row.address);
	$('#tdLawExecutor1').text(g_params.row.createUserName);
	$('#tdLawExecutor2').text(g_params.row.associateUserName);
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$('#rules').val(g_params.subRow.otherGist);
		$("#caseRulesCountry").val(g_params.subRow.caseRulesCountry);
		$("#caseRulesProvince").val(g_params.subRow.caseRulesProvince);
		//$("#deadlineDate").val($.date.dateFormat(g_params.subRow.rectifyDate, "yyyy-MM-dd"));
		$("#deadlineDate").val(g_params.subRow.rectifyDate);
		$("#contacterAddress").val(g_params.subRow.lawAddress);
		$("#contacterPhone").val(g_params.subRow.lawPhone);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdRules').text($.utils.getNotNullVal(g_params.subRow.otherGist));
		$('#tdCaseRulesCountry').text($.utils.getNotNullVal(g_params.subRow.caseRulesCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_params.subRow.caseRulesProvince));
//		$('#tdDeadlineDate').text($.date.dateFormat(g_params.subRow.rectifyDate, "yyyy-MM-dd"));
		$('#tdDeadlineDate').text($.utils.getNotNullVal(g_params.subRow.rectifyDate));
		$('#tdContacterAddress').text($.utils.getNotNullVal(g_params.subRow.lawAddress));
		$('#tdContacterPhone').text($.utils.getNotNullVal(g_params.subRow.lawPhone));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}

	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/instruct-to-correct-notice-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/instruct-to-correct-notice-pre.html', params, function(){});
		});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/instruct-to-correct-notice-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
    });
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.caseParties = $('#tdCaseParties').text();
	data.illegalContent = $('#tdIllegalContent').text();
	data.date = $('#tdDate').text();
	data.address = $('#tdAddress').text();
	data.lawExecutor1 = $('#tdLawExecutor1').text();
	data.lawExecutor2 = $('#tdLawExecutor2').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.rules = $('#rules').val();
		data.caseRulesCountry = $('#caseRulesCountry').val();
		data.caseRulesProvince = $('#caseRulesProvince').val();
		data.deadlineDate = $('#deadlineDate').val();
		data.contacterAddress = $('#contacterAddress').val();
		data.contacterPhone = $('#contacterPhone').val();
	}else{
		data.rules = $('#tdRules').text();
		data.caseRulesCountry = $('#tdCaseRulesCountry').text();
		data.caseRulesProvince = $('#tdCaseRulesProvince').text();
		data.deadlineDate = $('#tdDeadlineDate').text();
		data.contacterAddress = $('#tdContacterAddress').text();
		data.contacterPhone = $('#tdContacterPhone').text();
	}
	return data;
}


/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		rules: {required: true},
    		caseRulesCountry: {required: true},
    		caseRulesProvince: {required: true},
    		deadlineDate: {required: true, digits:true},
    		contacterAddress: {required: true},
    		contacterPhone: {required: true, isMobile: true},
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
	var url = "";
	if(g_params.type == 2){
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editOrderCorrect?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addOrderCorrect?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["parties"] = $('#tdCaseParties').text();
	submitData["lawPersonOne"] = $('#tdLawExecutor1').text();
	submitData["lawPersonTwo"] = $('#tdLawExecutor2').text();

	submitData["otherGist"] = $('#rules').val();
	submitData["caseRulesCountry"] = $("#caseRulesCountry").val();
	submitData["caseRulesProvince"] = $("#caseRulesProvince").val();
	submitData["rectifyDate"] = $("#deadlineDate").val();
	submitData["lawAddress"] = $("#contacterAddress").val();
	submitData["lawPhone"] = $("#contacterPhone").val();
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();
	
	//异步处理
	$.ajax({
		url: url,
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			//更新缓冲数据
				top.app.info.iframe.params = g_params;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
