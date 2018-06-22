var g_params = {}, g_backUrl = null, g_dataInfo = [], g_type = 1;
var g_codeType = "10", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	g_type = g_params.type;
	initView();
});

function initView(){
	//$('#divDeadlineDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divOccurrenceDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	if(g_params.row != null && g_params.row != undefined && g_params.row.id != null && g_params.row.id != undefined){
		g_dataInfo = rales.getOrderCorrect(g_params.row.id);
		$('#tdCaseParties').text(g_params.row.rapParties);
		$('#tdIllegalContent').text(g_params.row.rapIllegalContent);
	}
	//如果发现内容为空，则设置为新增
	if($.utils.isEmpty(g_dataInfo.code)) g_type = 1;
	
	//1新增 2编辑 3查看
	if(g_type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');

		//获取执法人员姓名
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/case/getInquiryRecordList",
		    method: 'GET',
		    async: false,
		   	timeout:5000,
		   	data:{
		   		access_token: top.app.cookies.getCookiesToken(),
		   		registerId: g_params.row.id
		   	},
		   	success: function(data){
		   		if(top.app.message.code.success == data.RetCode){
		   			if(!$.utils.isNull(data.rows) && data.rows.length > 0){
		   				$('#lawExecutor1').val(data.rows[0].investigationBy);
		   				$('#lawExecutor2').val(data.rows[0].investigationBy);
		   			}
		   		}
		   	}
		});
	}else if(g_type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#content-right').remove();

		$('#occurrenceDate').val($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
		$('#address').val(g_params.row.address);
		$('#lawExecutor1').val(g_dataInfo.lawPersonOne);
		$('#lawExecutor2').val(g_dataInfo.lawPersonTwo);
		
		$('#rules').val(g_dataInfo.otherGist);
		$("#caseRulesCountry").val(g_dataInfo.caseRulesCountry);
		$("#caseRulesProvince").val(g_dataInfo.caseRulesProvince);
//		$("#deadlineDate").val($.date.dateFormat(g_dataInfo.rectifyDate, "yyyy-MM-dd"));
		$("#deadlineDate").val(g_dataInfo.rectifyDate);
		$("#contacterAddress").val(g_dataInfo.lawAddress);
		$("#contacterPhone").val(g_dataInfo.lawPhone);
		fileupload.initFileEditSelector('files', g_dataInfo.files);
	}else if(g_type == 3){
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');

		$('#tdOccurrenceDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
		$('#tdAddress').text(g_params.row.address);
		$('#tdLawExecutor1').text($.utils.getNotNullVal(g_dataInfo.lawPersonOne));
		$('#tdLawExecutor2').text($.utils.getNotNullVal(g_dataInfo.lawPersonTwo));
		
		$('#tdRules').text($.utils.getNotNullVal(g_dataInfo.otherGist));
		$('#tdCaseRulesCountry').text($.utils.getNotNullVal(g_dataInfo.caseRulesCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_dataInfo.caseRulesProvince));
//		$('#tdDeadlineDate').text($.date.dateFormat(g_dataInfo.rectifyDate, "yyyy-MM-dd"));
		$('#tdDeadlineDate').text($.utils.getNotNullVal(g_dataInfo.rectifyDate));
		$('#tdContacterAddress').text($.utils.getNotNullVal(g_dataInfo.lawAddress));
		$('#tdContacterPhone').text($.utils.getNotNullVal(g_dataInfo.lawPhone));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_dataInfo.files);
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
		if(g_params.row == null || g_params.row == undefined || g_params.row.id == null || g_params.row.id == undefined){
   			top.app.message.notice("请先保存现场检查记录表！");
   			return;
		}
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
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
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
	if(g_type == 1 || g_type == 2){
		data.date = $('#occurrenceDate').val();
		data.address = $('#address').val();
		data.lawExecutor1 = $('#lawExecutor1').val();
		data.lawExecutor2 = $('#lawExecutor2').val();
		data.rules = $('#rules').val();
		data.caseRulesCountry = $('#caseRulesCountry').val();
		data.caseRulesProvince = $('#caseRulesProvince').val();
		data.deadlineDate = $('#deadlineDate').val();
		data.contacterAddress = $('#contacterAddress').val();
		data.contacterPhone = $('#contacterPhone').val();
	}else{
		data.date = $('#tdOccurrenceDate').text();
		data.address = $('#tdAddress').text();
		data.lawExecutor1 = $('#tdLawExecutor1').text();
		data.lawExecutor2 = $('#tdLawExecutor2').text();
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
    		contacterPhone: {required: true},
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
	if(g_type == 2){
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editOrderCorrect?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_dataInfo.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addOrderCorrect?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["parties"] = $('#tdCaseParties').text();
	
	submitData["lawPersonOne"] = $('#lawExecutor1').val();
	submitData["lawPersonTwo"] = $('#lawExecutor2').val();
	submitData["occurrenceDate"] = $('#occurrenceDate').val();
	submitData["address"] = $('#address').val();
	submitData["isUpdateAddress"] = "1";

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
				parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}