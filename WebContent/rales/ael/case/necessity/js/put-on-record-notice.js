var g_params = {}, g_backUrl = null;
var g_codeType = "3", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#tdCaseParties').text($.utils.getNotNullVal(g_params.row.parties));
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.row.illegalContent));
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		$("#lawExecutor1").val(g_params.row.createUserName);
		$("#lawExecutor2").val(g_params.row.associateUserName);
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$('#caseClauseCountry').val(g_params.subRow.caseClauseCountry);
		$("#caseRulesProvince").val(g_params.subRow.caseRulesProvince);
		$("#caseClauseProvince").val(g_params.subRow.caseClauseProvince);
		$("#lawExecutor1").val(g_params.subRow.lawPersonOne);
		$("#lawExecutorIdCard1").val(g_params.subRow.lawPersonIdone);
		$("#lawExecutor2").val(g_params.subRow.lawPersonTwo);
		$("#lawExecutorIdCard2").val(g_params.subRow.lawPersonIdtwo);
		$("#lawOfficeAddress").val(g_params.subRow.lawAddress);
		$("#contacterName").val(g_params.subRow.lawContact);
		$("#contacterPhone").val(g_params.subRow.lawPhone);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdCaseClauseCountry').text($.utils.getNotNullVal(g_params.subRow.caseClauseCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_params.subRow.caseRulesProvince));
		$('#tdCaseClauseProvince').text($.utils.getNotNullVal(g_params.subRow.caseClauseProvince));
		$('#tdLawExecutor1').text($.utils.getNotNullVal(g_params.subRow.lawPersonOne));
		$('#tdLawExecutorIdCard1').text($.utils.getNotNullVal(g_params.subRow.lawPersonIdone));
		$('#tdLawExecutor2').text($.utils.getNotNullVal(g_params.subRow.lawPersonTwo));
		$('#tdLawExecutorIdCard2').text($.utils.getNotNullVal(g_params.subRow.lawPersonIdtwo));
		$('#tdLawOfficeAddress').text($.utils.getNotNullVal(g_params.subRow.lawAddress));
		$('#tdContacterName').text($.utils.getNotNullVal(g_params.subRow.lawContact));
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
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/put-on-record-notice-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/put-on-record-notice-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/put-on-record-notice-pre.html', params, function(){});		
		//window.open("/rales/ael/case/necessity/put-on-record-notice-pre.html", "_blank");
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		caseClauseCountry: {required: true},
    		caseRulesProvince: {required: true},
    		caseClauseProvince: {required: true},
    		lawExecutor1: {required: true},
    		lawExecutorIdCard1: {required: true},
    		lawExecutor2: {required: true},
    		lawExecutorIdCard2: {required: true},
    		lawOfficeAddress: {required: true},
    		contacterName: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCaseFilingNotice?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCaseFilingNotice?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["parties"] = $.utils.getNotNullVal(g_params.row.parties);
	submitData["illegalContent"] = $.utils.getNotNullVal(g_params.row.illegalContent);
	submitData["caseClauseCountry"] = $('#caseClauseCountry').val();
	submitData["caseRulesProvince"] = $("#caseRulesProvince").val();
	submitData["caseClauseProvince"] = $("#caseClauseProvince").val();
	submitData["lawPersonOne"] = $("#lawExecutor1").val();
	submitData["lawPersonIdone"] = $("#lawExecutorIdCard1").val();
	submitData["lawPersonTwo"] = $("#lawExecutor2").val();
	submitData["lawPersonIdtwo"] = $("#lawExecutorIdCard2").val();
	submitData["lawAddress"] = $("#lawOfficeAddress").val();
	submitData["lawContact"] = $("#contacterName").val();
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
				top.app.info.iframe.params = g_params;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
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
	if(g_params.type == 1 || g_params.type == 2){
		data.caseClauseCountry = $('#caseClauseCountry').val();
		data.caseRulesProvince = $('#caseRulesProvince').val();
		data.caseClauseProvince = $('#caseClauseProvince').val();
		data.lawExecutor1 = $('#lawExecutor1').val();
		data.lawExecutorIdCard1 = $('#lawExecutorIdCard1').val();
		data.lawExecutor2 = $('#lawExecutor2').val();
		data.lawExecutorIdCard2 = $('#lawExecutorIdCard2').val();
		data.lawOfficeAddress = $('#lawOfficeAddress').val();
		data.contacterName = $('#contacterName').val();
		data.contacterPhone = $('#contacterPhone').val();
	}else{
		data.caseClauseCountry = $('#tdCaseClauseCountry').text();
		data.caseRulesProvince = $('#tdCaseRulesProvince').text();
		data.caseClauseProvince = $('#tdCaseClauseProvince').text();
		data.lawExecutor1 = $('#tdLawExecutor1').text();
		data.lawExecutorIdCard1 = $('#tdLawExecutorIdCard1').text();
		data.lawExecutor2 = $('#tdLawExecutor2').text();
		data.lawExecutorIdCard2 = $('#tdLawExecutorIdCard2').text();
		data.lawOfficeAddress = $('#tdLawOfficeAddress').text();
		data.contacterName = $('#tdContacterName').text();
		data.contacterPhone = $('#tdContacterPhone').text();
	}
	return data;
}

