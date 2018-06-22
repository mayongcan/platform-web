var g_params = {}, g_backUrl = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divHearingDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divDeadlineDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	var hearingNoticeInfo = rales.getHearingNoticeInfo(g_params.row.id);
	var filingInfo = rales.getCaseFilingInfo(g_params.row.id);
	$('#tdAddress').text(hearingNoticeInfo.address);
	$('#tdHearingCompere').text(hearingNoticeInfo.name);
	$('#tdCaseInquiry').text(g_params.row.createUserName + "," + g_params.row.associateUserName);
	$('#tdDetail').html("当事人-姓名：" + filingInfo.name + "<br>" + 
			"当事人-姓名：" + filingInfo.name + "<br>" + 
			"当事人-身份证号：" + filingInfo.certificateNo + "<br>" + 
			"当事人-单位：" + filingInfo.company + "<br>" + 
			"当事人-法定代表人：" + filingInfo.legalRepresentative + "<br>" + 
			"当事人-地址：" + filingInfo.address + "<br>" + 
			"当事人-邮政编码：" + filingInfo.zip + "<br>" + 
			"当事人-联系电话：" + filingInfo.phone + "<br>" + 
			"当事人-其他情况：" + filingInfo.otherCircumstances);
	$('#tdIllegalContent').text(g_params.row.illegalContent);


	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
//		//获取最新文书编号
//		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
//		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$('#hearingDate').val($.date.dateFormat(g_params.subRow.recordDate, "yyyy-MM-dd"));
		$("#recorder").val(g_params.subRow.recorder);
		$("#company").val(g_params.subRow.company);
		$("#entrustedAgent1").val(g_params.subRow.agent);
		$("#entrustedJob1").val(g_params.subRow.agentPosition);
		$("#entrustedAgent2").val(g_params.subRow.agentTwo);
		$("#entrustedJob2").val(g_params.subRow.agentTwoPosition);
		$("#hearingContent").val(g_params.subRow.content);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
//		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdHearingDate').text($.date.dateFormat(g_params.subRow.recordDate, "yyyy-MM-dd"));
		$('#tdRecorder').text($.utils.getNotNullVal(g_params.subRow.recorder));
		$('#tdCompany').text($.utils.getNotNullVal(g_params.subRow.company));
		$('#tdEntrustedAgent1').text($.utils.getNotNullVal(g_params.subRow.agent));
		$('#tdEntrustedJob1').text($.utils.getNotNullVal(g_params.subRow.agentPosition));
		$('#tdEntrustedAgent2').text($.utils.getNotNullVal(g_params.subRow.agentTwo));
		$('#tdEntrustedJob2').text($.utils.getNotNullVal(g_params.subRow.agentTwoPosition));
		$('#tdHearingContent').text($.utils.getNotNullVal(g_params.subRow.content));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}
	
	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/hearing-record-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/hearing-record-pre.html', params, function(){});
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
	data.illegalContent = $('#tdIllegalContent').text();
	data.hearingCompere = $('#tdHearingCompere').text();
	data.detail = $('#tdDetail').html();
	data.caseInquiry = $('#tdCaseInquiry').text();
	data.address = $('#tdAddress').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.hearingDate = $('#hearingDate').val();
		data.recorder = $('#recorder').val();
		data.company = $('#company').val();
		data.entrustedAgent1 = $('#entrustedAgent1').val();
		data.entrustedJob1 = $('#entrustedJob1').val();
		data.entrustedAgent2 = $('#entrustedAgent2').val();
		data.entrustedJob2 = $('#entrustedJob2').val();
		data.hearingContent = $('#hearingContent').val();
	}else{
		data.hearingDate = $('#tdHearingDate').text();
		data.recorder = $('#tdRecorder').text();
		data.company = $('#tdCompany').text();
		data.entrustedAgent1 = $('#tdEntrustedAgent1').text();
		data.entrustedJob1 = $('#tdEntrustedJob1').text();
		data.entrustedAgent2 = $('#tdEntrustedAgent2').text();
		data.entrustedJob2 = $('#tdEntrustedJob2').text();
		data.hearingContent = $('#tdHearingContent').text();
	}
	return data;
}


/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		hearingDate: {required: true},
    		recorder: {required: true},
    		company: {required: true},
    		entrustedAgent1: {required: true},
    		entrustedJob1: {required: true},
    		entrustedAgent2: {required: true},
    		entrustedJob2: {required: true},
    		hearingContent: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editHearingRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addHearingRecord?access_token=" + top.app.cookies.getCookiesToken(),
//		submitData["code"] = $('#tableTitleMark').text();
//		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
//	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["address"] = $('#tdAddress').text();
	submitData["compere"] = $('#tdHearingCompere').text();
	submitData["investigator"] = $('#tdCaseInquiry').text();
	submitData["partyBasic"] = $('#tdDetail').html();

	submitData["recordDate"] = $("#hearingDate").val();
	submitData["recorder"] = $("#recorder").val();
	submitData["company"] = $("#company").val();
	submitData["agent"] = $("#entrustedAgent1").val();
	submitData["agentPosition"] = $("#entrustedJob1").val();
	submitData["agentTwo"] = $("#entrustedAgent2").val();
	submitData["agentTwoPosition"] = $("#entrustedJob2").val();
	submitData["content"] = $("#hearingContent").val();
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
