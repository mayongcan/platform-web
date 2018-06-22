var g_params = {}, g_backUrl = null;
var g_codeType = "9", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	initView();
});

function initView(){
	$('#divCheckDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
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
		$('#tableTitleMark').text(g_params.row.rapCode);
		$('#content-right').remove();

		$('#illegalContent').val(g_params.row.rapIllegalContent);
		$('#caseParties').val(g_params.row.rapParties);
		$('#partiesCertificateNo').val(g_params.row.rapCertificateNo);
		$('#partiesCompany').val(g_params.row.rapCompany);
		$('#partiesContacts').val(g_params.row.rapLegalRepresentative);
		$('#partiesAddress').val(g_params.row.rapAddress);
		$('#caseZip').val(g_params.row.rapZip);
		$('#casePhone').val(g_params.row.rapPhone);
		$("input[name=radioIsLegal][value=" + g_params.row.rapIsLegal + "]").attr("checked",true);
		
		$('#checkOrg').val(g_params.row.rapOrgine);
		$("#checkDate").val($.date.dateFormat(g_params.row.rapCheckDate, "yyyy-MM-dd"));
		$("#checkRecord").val(g_params.row.rapOrganizerRec);
		$("#checkResult").val(g_params.row.rapCheckResult);
		$("#partiesOpinions").val(g_params.row.rapPartiesOpinions);
		fileupload.initFileEditSelector('files', g_params.row.rapFiles);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.row.rapCode);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');

		$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.row.rapIllegalContent));
		$('#tdCaseParties').text($.utils.getNotNullVal(g_params.row.rapParties));
		$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.row.rapCertificateNo));
		$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.row.rapCompany));
		$('#tdPartiesContacts').text($.utils.getNotNullVal(g_params.row.rapLegalRepresentative));
		$('#tdPartiesAddress').text($.utils.getNotNullVal(g_params.row.rapAddress));
		$('#tdCaseZip').text($.utils.getNotNullVal(g_params.row.rapZip));
		$('#tdCasePhone').text($.utils.getNotNullVal(g_params.row.rapPhone));

		var rapIsLegal = "是";
		if(g_params.row.rapIsLegal == '0') rapIsLegal = "否";
		$('#tdIslegal').text(rapIsLegal);
		
		$('#tdCheckOrg').text($.utils.getNotNullVal(g_params.row.rapOrgine));
		$("#tdCheckDate").text($.date.dateFormat(g_params.row.rapCheckDate, "yyyy-MM-dd"));
		$('#tdCheckRecord').text($.utils.getNotNullVal(g_params.row.rapOrganizerRec));
		$('#tdCheckResult').text($.utils.getNotNullVal(g_params.row.rapCheckResult));
		$('#tdPartiesOpinions').text($.utils.getNotNullVal(g_params.row.rapPartiesOpinions));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.row.rapFiles);
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
	if(g_params.type == 1 || g_params.type == 2){
		data.illegalContent = $('#illegalContent').val();
		data.partiesName = $('#caseParties').val();
		data.partiesCertificateNo = $('#partiesCertificateNo').val();
		data.partiesCompany = $('#partiesCompany').val();
		data.partiesContacts = $('#partiesContacts').val();
		data.partiesAddress = $('#partiesAddress').val();
		data.caseZip = $('#caseZip').val();
		data.casePhone = $('#casePhone').val();
		
		data.checkOrg = $('#checkOrg').val();
		data.checkDate = $('#checkDate').val();
		data.checkRecord = $('#checkRecord').val();
		data.checkResult = $('#checkResult').val();
		data.partiesOpinions = $('#partiesOpinions').val();
	}else{
		data.illegalContent = $('#tdIllegalContent').text();
		data.partiesName = $('#tdCaseParties').text();
		data.partiesCertificateNo = $('#tdPartiesCertificateNo').text();
		data.partiesCompany = $('#tdPartiesCompany').text();
		data.partiesContacts = $('#tdPartiesContacts').text();
		data.partiesAddress = $('#tdPartiesAddress').text();
		data.caseZip = $('#tdCaseZip').text();
		data.casePhone = $('#tdCasePhone').text();
		
		data.checkOrg = $('#tdCheckOrg').text();
		data.checkDate = $('#tdCheckDate').text();
		data.checkRecord = $('#tdCheckRecord').text();
		data.checkResult = $('#tdCheckResult').text();
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
        	illegalContent: {required: true},
        	name: {required: true},
        	certificateNo: {required: true},
        	company: {required: true},
        	legalRepresentative: {required: true},
        	address: {required: true},
        	zip: {required: true},
        	phone: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/routine/editRoutineInfo?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.row.rapId;
		submitData["registerId"] = g_params.row.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/routine/addRoutineInfo?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#illegalContent').val();
	submitData["name"] = $('#caseParties').val();
	submitData["certificateNo"] = $('#partiesCertificateNo').val();
	submitData["company"] = $('#partiesCompany').val();
	submitData["legalRepresentative"] = $('#partiesContacts').val();
	submitData["address"] = $('#partiesAddress').val();
	submitData["zip"] = $('#caseZip').val();
	submitData["phone"] = $('#casePhone').val();
	
	submitData["isLegal"] =  $('#tdIslegal input:radio:checked').val();

	submitData["orgine"] = $('#checkOrg').val();
	submitData["checkDate"] = $("#checkDate").val();
	submitData["organizerRec"] = $("#checkRecord").val();
	submitData["checkResult"] = $("#checkResult").val();
	submitData["partiesOpinions"] = $("#partiesOpinions").val();
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();
	
	//填入案件登记相关信息
	submitData["defendantName"] =$('#caseParties').val();
	submitData["address"] = $('#partiesAddress').val();
	submitData["checkDate"] = $("#checkDate").val();
	submitData["clueSummary"] = $("#checkRecord").val();
	
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
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}