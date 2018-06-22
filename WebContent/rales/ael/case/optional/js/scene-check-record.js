var g_params = {}, g_backUrl = null;
var g_codeType = "9", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});

	//获取立案审批信息
	var filingInfo = rales.getCaseFilingInfo(g_params.row.id);
	$('#tdIllegalContent').text(filingInfo.illegalContent);
	$('#tdPartiesCertificateNo').text(filingInfo.certificateNo);
	$('#tdPartiesCompany').text(filingInfo.company);
	$('#tdPartiesContacts').text(filingInfo.legalRepresentative);
	$('#tdPartiesAddress').text(filingInfo.address);
	$('#tdCaseZip').text(filingInfo.zip);
	$('#tdCasePhone').text(filingInfo.phone);
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		$('#caseParties').val(filingInfo.name);
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();

		$('#caseParties').val(g_params.subRow.name);
		$('#checkOrg').val(g_params.subRow.orgine);
		$("#checkDate").val($.date.dateFormat(g_params.subRow.checkDate, "yyyy-MM-dd"));
		$("#checkRecord").val(g_params.subRow.organizerRec);
		$("#partiesOpinions").val(g_params.subRow.partiesOpinions);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdCheckOrg').text($.utils.getNotNullVal(g_params.subRow.orgine));
		$("#tdCheckDate").text($.date.dateFormat(g_params.subRow.checkDate, "yyyy-MM-dd"));
		$('#tdCheckRecord').text($.utils.getNotNullVal(g_params.subRow.organizerRec));
		$('#tdPartiesOpinions').text($.utils.getNotNullVal(g_params.subRow.partiesOpinions));
		$('#tdCaseParties').text($.utils.getNotNullVal(g_params.subRow.name));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}
	
	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/scene-check-record-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/scene-check-record-pre.html', params, function(){});
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
//	data.partiesName = $('#tdCaseParties').text();
	data.partiesName = $('#caseParties').val();
	data.partiesCertificateNo = $('#tdPartiesCertificateNo').text();
	data.partiesCompany = $('#tdPartiesCompany').text();
	data.partiesContacts = $('#tdPartiesContacts').text();
	data.partiesAddress = $('#tdPartiesAddress').text();
	data.caseZip = $('#tdCaseZip').text();
	data.casePhone = $('#tdCasePhone').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.checkOrg = $('#checkOrg').val();
		data.checkDate = $('#checkDate').val();
		data.checkRecord = $('#checkRecord').val();
		data.partiesOpinions = $('#partiesOpinions').val();
	}else{
		data.checkOrg = $('#tdCheckOrg').text();
		data.checkDate = $('#tdCheckDate').text();
		data.checkRecord = $('#tdCheckRecord').text();
		data.partiesOpinions = $('#tdPartiesOpinions').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	checkOrg: {required: true},
        	checkRecord: {required: true},
        	partiesOpinions: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editSceneCheckRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addSceneCheckRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
//	submitData["name"] = $('#tdCaseParties').text();
	submitData["name"] = $('#caseParties').val();
	submitData["certificateNo"] = $('#tdPartiesCertificateNo').text();
	submitData["company"] = $('#tdPartiesCompany').text();
	submitData["legalRepresentative"] = $('#tdPartiesContacts').text();
	submitData["address"] = $('#tdPartiesAddress').text();
	submitData["zip"] = $('#tdCaseZip').text();
	submitData["phone"] = $('#tdCasePhone').text();

	submitData["orgine"] = $('#checkOrg').val();
	submitData["checkDate"] = $("#checkDate").val();
	submitData["organizerRec"] = $("#checkRecord").val();
	submitData["partiesOpinions"] = $("#partiesOpinions").val();
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