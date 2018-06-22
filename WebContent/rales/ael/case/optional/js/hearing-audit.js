var g_params = {}, g_backUrl = null;
var g_codeType = "19", g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	var filingInfo = rales.getCaseFilingInfo(g_params.row.id);
	$('#tdIllegalContent').text(filingInfo.illegalContent);
	$('#tdCaseParties').text(filingInfo.name);
	$('#tdPartiesCertificateNo').text(filingInfo.certificateNo);
	$('#tdPartiesCompany').text(filingInfo.company);
	$('#tdPartiesContacts').text(filingInfo.legalRepresentative);
	$('#tdPartiesAddress').text(filingInfo.address);
	$('#tdPartiesZip').text(filingInfo.zip);
	$('#tdPartiesPhone').text(filingInfo.phone);
	$('#tdSuggest').text(g_params.row.advice);

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
		
		$('#hearingDetail').val(g_params.subRow.hearingCondition);
		$('#memo').val(g_params.subRow.memo);
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
		$('#content-top-print').css('right', '26%');

		$('#tdHearingDetail').text($.utils.getNotNullVal(g_params.subRow.hearingCondition));
		$('#tdMemo').text($.utils.getNotNullVal(g_params.subRow.memo));
		//设置右侧的高度和左侧一致
		if($("#content-left").height() < 500) $("#content-left").height(500);
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/hearing-audit-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/hearing-audit-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
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
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.illegalContent = $('#tdIllegalContent').text();
	data.tdPartiesName = $('#tdCaseParties').text();
	data.tdPartiesCertificateNo = $('#tdPartiesCertificateNo').text();
	data.tdPartiesCompany = $('#tdPartiesCompany').text();
	data.tdPartiesContacts = $('#tdPartiesContacts').text();
	data.tdPartiesAddress = $('#tdPartiesAddress').text();
	data.tdPartiesZip = $('#tdPartiesZip').text();
	data.tdPartiesPhone = $('#tdPartiesPhone').text();
	data.suggest = $('#tdSuggest').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.hearingDetail = $('#hearingDetail').val();
		data.memo = $('#memo').val();
	}else{
		data.hearingDetail = $('#tdHearingDetail').text();
		data.memo = $('#tdMemo').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	hearingDetail: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editHearingAudit?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addHearingAudit?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["parties"] = $("#tdCaseParties").text();
	submitData["certificateNo"] = $("#tdPartiesCertificateNo").text();
	submitData["company"] = $("#tdPartiesCompany").text();
	submitData["legalRepresentative"] = $("#tdPartiesContacts").text();
	submitData["address"] = $("#tdPartiesAddress").text();
	submitData["zip"] = $("#tdPartiesZip").text();
	submitData["phone"] = $("#tdPartiesPhone").text();
	
	submitData["hearingCondition"] = $("#hearingDetail").val();
	submitData["memo"] = $("#memo").val();
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
				top.app.info.iframe.params = g_params;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
