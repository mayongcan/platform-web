var g_params = {}, g_backUrl = null;
var g_codeType = "2", g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_caseSourceDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CASE');
	
	$('#divAcceptanceDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divFormDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date(),});

//	$('#tdCaseSource').text(top.app.getDictName(g_params.row.sourceCase, g_params.caseSourceDict));
	$('#tdCaseAddress').text(g_params.row.address);
	$('#tdCaseDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#handleUser1').text(g_params.row.createUserName);
	$('#tdHandleSuggest1').text(g_params.row.advice);
	$('#handleUser2').text(g_params.row.associateUserName);
	$('#tdHandleSuggest2').text(g_params.row.associateAdvice);

	top.app.addRadioButton($("#divCaseSource"), g_caseSourceDict, 'radioCaseSource', g_params.row.sourceCase);
	$('#partiesName').val(g_params.row.defendantName);
	
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
		
		$('#illegalContent').val(g_params.subRow.illegalContent);
		$("#partiesName").val(g_params.subRow.name);
		$("#partiesCertificateNo").val(g_params.subRow.certificateNo);
		$("#partiesCompany").val(g_params.subRow.company);
		$("#partiesContacts").val(g_params.subRow.legalRepresentative);
		$("#partiesAddress").val(g_params.subRow.address);
		$("#partiesZip").val(g_params.subRow.zip);
		$("#partiesPhone").val(g_params.subRow.phone);
		$("#otherInfo").val(g_params.subRow.otherCircumstances);
		$("#acceptanceDate").val($.date.dateFormat(g_params.subRow.acceptanceDate, "yyyy-MM-dd"));
		$("#formDate").val($.date.dateFormat(g_params.subRow.formDate, "yyyy-MM-dd"));
		$("#caseBasis").val(g_params.subRow.caseBasis);
		$("#caseDesc").val(g_params.subRow.introduction);
		
		g_relevanceIdList = g_params.subRow.relevanceId;
		g_relevanceCodeList = rales.getWritListByRelevanceId(g_params.subRow.relevanceId);
		$("#relevanceId").val(g_relevanceCodeList);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		
		$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.subRow.illegalContent));
		$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.name));
		$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.subRow.certificateNo));
		$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.subRow.company));
		$('#tdPartiesContacts').text($.utils.getNotNullVal(g_params.subRow.legalRepresentative));
		$('#tdPartiesAddress').text($.utils.getNotNullVal(g_params.subRow.address));
		$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.subRow.zip));
		$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.phone));
		$('#tdOtherInfo').text($.utils.getNotNullVal(g_params.subRow.otherCircumstances));
		$('#tdAcceptanceDate').text($.date.dateFormat(g_params.subRow.acceptanceDate, "yyyy-MM-dd"));
		$('#tdFormDate').text($.date.dateFormat(g_params.subRow.formDate, "yyyy-MM-dd"));
		$('#tdCaseBasis').text($.utils.getNotNullVal(g_params.subRow.caseBasis));
		$('#tdCaseDesc').text($.utils.getNotNullVal(g_params.subRow.introduction));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);
	}

	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });

	//选择需要关联的文书
	$("#relevanceId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_relevanceIdList;
		params.relevanceCodeList = g_relevanceCodeList;
		top.app.layer.editLayer('选择需要关联的文书', ['700px', '550px'], '/rales/ael/case/case-writ-list.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_relevanceIdList = retParams[0].relevanceIdList;
			g_relevanceCodeList = retParams[0].relevanceCodeList;
			$("#relevanceId").val(retParams[0].relevanceCodeList);
		});
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	illegalContent: {required: true},
        	partiesName: {required: true},
        	partiesCertificateNo: {required: true, isIdCardNo: true},
        	partiesCompany: {required: true},
        	partiesContacts: {required: true},
        	partiesAddress: {required: true},
        	partiesZip: {isZipCode: true},
        	partiesPhone: {required: true, isMobile: true},
        	otherInfo: {required: true},
        	acceptanceDate: {required: true},
        	caseBasis: {required: true},
        	caseDesc: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCaseFiling?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCaseFiling?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
		//用于更新流程中的案件编号
		submitData["taskId"] = g_params.row.taskId;
		submitData["processInstanceId"] = g_params.row.processInstanceId;
		submitData["processDefinitionId"] = g_params.row.processDefinitionId;
	}
	submitData["registerId"] = g_params.row.id;
	submitData["sourceCase"] = $('#divCaseSource input:radio:checked').val();		//可以修改案件来源
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#illegalContent').val();
	submitData["name"] = $("#partiesName").val();
	submitData["certificateNo"] = $("#partiesCertificateNo").val();
	submitData["company"] = $("#partiesCompany").val();
	submitData["legalRepresentative"] = $("#partiesContacts").val();
	submitData["address"] = $("#partiesAddress").val();
	submitData["zip"] = $("#partiesZip").val();
	submitData["phone"] = $("#partiesPhone").val();
	submitData["otherCircumstances"] = $("#otherInfo").val();
	submitData["acceptanceDate"] = $("#acceptanceDate").val();
	submitData["formDate"] = $("#formDate").val();
	submitData["caseBasis"] = $("#caseBasis").val();
	submitData["introduction"] = $("#caseDesc").val();
	submitData["relevanceId"] = g_relevanceIdList;
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
	   			g_params.row.illegalContent = $('#illegalContent').val();
	   			g_params.row.parties = $('#partiesName').val();
	   			g_params.row.sourceCase = $('#divCaseSource input:radio:checked').val();
				top.app.info.iframe.params = g_params;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
