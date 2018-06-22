var g_params = {}, g_backUrl = null;
var g_codeType = "27", g_codeCurNum = "";
var g_punishIdList = "", g_punishCodeList = "";
var g_hearingmeetingIdList = "", g_hearingmeetingCodeList = "";
var g_stoppunishIdList = "", g_stoppunishCodeList = "";
var g_preservationIdList = "", g_preservationCodeList = "";
var g_relieveIdList = "", g_relieveCodeList = "";
var g_otherIdList = "", g_otherCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#tdIllegalContent').text(g_params.row.illegalContent);
	
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
		
		$('#beArray').val(g_params.subRow.summonedInPerson);
		$("#address").val(g_params.subRow.address);
		$("#reason").val(g_params.subRow.refuseAccept);
		$("#memo").val(g_params.subRow.memo);

		g_punishIdList = $.utils.getNotNullVal(g_params.subRow.punishId);
		g_punishCodeList = $.utils.getNotNullVal(g_params.subRow.punishCode);
		$("#punishId").val(g_punishCodeList);

		g_hearingmeetingIdList = $.utils.getNotNullVal(g_params.subRow.hearingmeetingId) + "";
		g_hearingmeetingCodeList = $.utils.getNotNullVal(g_params.subRow.hearingmeetingCode);
		$("#hearingmeetingId").val(g_hearingmeetingCodeList);

		g_stoppunishIdList = $.utils.getNotNullVal(g_params.subRow.stoppunishId);
		g_stoppunishCodeList = $.utils.getNotNullVal(g_params.subRow.stoppunishCode);
		$("#stoppunishId").val(g_stoppunishCodeList);

		g_preservationIdList = $.utils.getNotNullVal(g_params.subRow.preservationId);
		g_preservationCodeList = $.utils.getNotNullVal(g_params.subRow.preservationCode);
		$("#preservationId").val(g_preservationCodeList);

		g_relieveIdList = $.utils.getNotNullVal(g_params.subRow.relieveId);
		g_relieveCodeList = $.utils.getNotNullVal(g_params.subRow.relieveCode)
		$("#relieveId").val(g_relieveCodeList);

		g_otherIdList = $.utils.getNotNullVal(g_params.subRow.otherId);
		g_otherCodeList = $.utils.getNotNullVal(g_params.subRow.otherCode);
		$("#otherId").val(g_otherCodeList);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdBeArray').text($.utils.getNotNullVal(g_params.subRow.summonedInPerson));
		$('#tdAddress').text($.utils.getNotNullVal(g_params.subRow.address));
		$('#tdReason').text($.utils.getNotNullVal(g_params.subRow.refuseAccept));
		$('#tdMemo').text($.utils.getNotNullVal(g_params.subRow.memo));
		
		$('#tdPunishId').text($.utils.getNotNullVal(g_params.subRow.punishCode));
		$('#tdHearingmeetingId').text($.utils.getNotNullVal(g_params.subRow.hearingmeetingCode));
		$('#tdStoppunishId').text($.utils.getNotNullVal(g_params.subRow.stoppunishCode));
		$('#tdPreservationId').text($.utils.getNotNullVal(g_params.subRow.preservationCode));
		$('#tdRelieveId').text($.utils.getNotNullVal(g_params.subRow.relieveCode));
		$('#tdOtherId').text($.utils.getNotNullVal(g_params.subRow.otherCode));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/delivery-evidence-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/delivery-evidence-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
    });

	//选择需要关联的文书
	$("#punishId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_punishIdList;
		params.relevanceCodeList = g_punishCodeList;
		top.app.layer.editLayer('选择需要关联的行政处罚告知书', ['700px', '550px'], '/rales/ael/case/select/punish-notice-sel.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_punishIdList = retParams[0].relevanceIdList;
			g_punishCodeList = retParams[0].relevanceCodeList;
			$("#punishId").val(retParams[0].relevanceCodeList);
		});
    });

	//选择需要关联的文书
	$("#hearingmeetingId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_hearingmeetingIdList;
		params.relevanceCodeList = g_hearingmeetingCodeList;
		top.app.layer.editLayer('选择需要关联的行政处罚听证告知书', ['700px', '550px'], '/rales/ael/case/select/punish-hearing-notice-sel.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_hearingmeetingIdList = retParams[0].relevanceIdList;
			g_hearingmeetingCodeList = retParams[0].relevanceCodeList;
			$("#hearingmeetingId").val(retParams[0].relevanceCodeList);
		});
    });

	//选择需要关联的文书
	$("#stoppunishId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_stoppunishIdList;
		params.relevanceCodeList = g_stoppunishCodeList;
		top.app.layer.editLayer('选择需要关联的行政处罚决定书', ['700px', '550px'], '/rales/ael/case/select/punish-decision-sel.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_stoppunishIdList = retParams[0].relevanceIdList;
			g_stoppunishCodeList = retParams[0].relevanceCodeList;
			$("#stoppunishId").val(retParams[0].relevanceCodeList);
		});
    });

	//选择需要关联的文书
	$("#preservationId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_preservationIdList;
		params.relevanceCodeList = g_preservationCodeList;
		top.app.layer.editLayer('选择需要关联的证据保全决定书', ['700px', '550px'], '/rales/ael/case/select/evidence-preserve-decision-sel.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_preservationIdList = retParams[0].relevanceIdList;
			g_preservationCodeList = retParams[0].relevanceCodeList;
			$("#preservationId").val(retParams[0].relevanceCodeList);
		});
    });

	//选择需要关联的文书
	$("#relieveId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_relieveIdList;
		params.relevanceCodeList = g_relieveCodeList;
		top.app.layer.editLayer('选择需要关联的解除行政强制措施决定书', ['700px', '550px'], '/rales/ael/case/select/remove-evidence-preserve-decision-sel.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_relieveIdList = retParams[0].relevanceIdList;
			g_relieveCodeList = retParams[0].relevanceCodeList;
			$("#relieveId").val(retParams[0].relevanceCodeList);
		});
    });

	//选择需要关联的文书
	$("#otherId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_otherIdList;
		params.relevanceCodeList = g_otherCodeList;
		top.app.layer.editLayer('选择需要关联的其他文书', ['700px', '550px'], '/rales/ael/case/case-writ-list.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_otherIdList = retParams[0].relevanceIdList;
			g_otherCodeList = retParams[0].relevanceCodeList;
			$("#otherId").val(retParams[0].relevanceCodeList);
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
	if(g_params.type == 1 || g_params.type == 2){
		data.punishCode = $('#punishId').val();
		data.hearingmeetingCode = $('#hearingmeetingId').val();
		data.stoppunishCode = $('#stoppunishId').val();
		data.preservationCode = $('#preservationId').val();
		data.relieveCode = $('#relieveId').val();
		data.otherCode = $('#otherId').val();
		data.beArray = $('#beArray').val();
		data.address = $('#address').val();
		data.reason = $('#reason').val();
		data.memo = $('#memo').val();
	}else{
		data.punishCode = $('#tdPunishId').text();
		data.hearingmeetingCode = $('#tdHearingmeetingId').text();
		data.stoppunishCode = $('#tdStoppunishId').text();
		data.preservationCode = $('#tdPreservationId').text();
		data.relieveCode = $('#tdRelieveId').text();
		data.otherCode = $('#tdOtherId').text();
		data.beArray = $('#tdBeArray').text();
		data.address = $('#tdAddress').text();
		data.reason = $('#tdReason').text();
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
    		beArray: {required: true},
    		address: {required: true},
    		reason: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editReceipt?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addReceipt?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();	

	submitData["summonedInPerson"] = $('#beArray').val();
	submitData["address"] = $("#address").val();
	submitData["refuseAccept"] = $("#reason").val();
	submitData["memo"] = $("#memo").val();
	
	submitData["punishId"] = g_punishIdList;
	submitData["punishCode"] = g_punishCodeList;
	submitData["hearingmeetingId"] = g_hearingmeetingIdList;
	submitData["hearingmeetingCode"] = g_hearingmeetingCodeList;
	submitData["stoppunishId"] = g_stoppunishIdList;
	submitData["stoppunishCode"] = g_stoppunishCodeList;
	submitData["preservationId"] = g_preservationIdList;
	submitData["preservationCode"] = g_preservationCodeList;
	submitData["relieveId"] = g_relieveIdList;
	submitData["relieveCode"] = g_relieveCodeList;
	submitData["otherId"] = g_otherIdList;
	submitData["otherCode"] = g_otherCodeList;
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
