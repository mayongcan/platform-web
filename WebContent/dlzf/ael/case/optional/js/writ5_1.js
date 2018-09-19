var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional5_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$.date.initSearchDate('divCheckDateBegin', 'divCheckDateEnd', "YYYY-MM-DD");
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

		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");

			$('#illegalAction').val(g_params.subRow.content.illegalAction);
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#checkDateBegin').val(g_params.subRow.content.checkDateBegin);
			$('#checkDateEnd').val(g_params.subRow.content.checkDateEnd);
			$('#checkAddr').val(g_params.subRow.content.checkAddr);
			$('#reason').val(g_params.subRow.content.reason);
			$('#handleUser').val(g_params.subRow.content.handleUser);
			$('#handleUserJob').val(g_params.subRow.content.handleUserJob);
			$('#recordUser').val(g_params.subRow.content.recordUser);
			$('#recordUserJob').val(g_params.subRow.content.recordUserJob);
			$('#joinUser').val(g_params.subRow.content.joinUser);
			$('#curUser').val(g_params.subRow.content.curUser);
			$('#caseDetail').val(g_params.subRow.content.caseDetail);
			$('#hearDetail').val(g_params.subRow.content.hearDetail);
			$('#advice').val(g_params.subRow.content.advice);
			$('#result').val(g_params.subRow.content.result);
		}
		//显示文书列表
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

		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");

			$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.subRow.content.illegalAction));
			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.subRow.content.checkDateBegin));
			$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.subRow.content.checkDateEnd));
			$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.subRow.content.checkAddr));
			$('#tdReason').text($.utils.getNotNullVal(g_params.subRow.content.reason));
			$('#tdHandleUser').text($.utils.getNotNullVal(g_params.subRow.content.handleUser));
			$('#tdHandleUserJob').text($.utils.getNotNullVal(g_params.subRow.content.handleUserJob));
			$('#tdRecordUser').text($.utils.getNotNullVal(g_params.subRow.content.recordUser));
			$('#tdRecordUserJob').text($.utils.getNotNullVal(g_params.subRow.content.recordUserJob));
			$('#tdJoinUser').text($.utils.getNotNullVal(g_params.subRow.content.joinUser));
			$('#tdCurUser').text($.utils.getNotNullVal(g_params.subRow.content.curUser));
			$('#tdCaseDetail').text($.utils.getNotNullVal(g_params.subRow.content.caseDetail));
			$('#tdHearDetail').text($.utils.getNotNullVal(g_params.subRow.content.hearDetail));
			$('#tdAdvice').text($.utils.getNotNullVal(g_params.subRow.content.advice));
			$('#tdResult').text($.utils.getNotNullVal(g_params.subRow.content.result));
		}

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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre5_1.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre5_1.html', params, function(){});
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
	if(g_params.type == 1 || g_params.type == 2){	
		data.illegalAction = $('#illegalAction').val();
		data.partiesName = $('#partiesName').val();
		data.checkDateBegin = $('#checkDateBegin').val();
		data.checkDateEnd = $('#checkDateEnd').val();
		data.checkAddr = $('#checkAddr').val();
		data.reason = $('#reason').val();
		data.handleUser = $('#handleUser').val();
		data.handleUserJob = $('#handleUserJob').val();
		data.recordUser = $('#recordUser').val();
		data.recordUserJob = $('#recordUserJob').val();
		data.joinUser = $('#joinUser').val();
		data.curUser = $('#curUser').val();
		data.caseDetail = $('#caseDetail').val();
		data.hearDetail = $('#hearDetail').val();
		data.advice = $('#advice').val();
		data.result = $('#result').val();
	}else{
		data = $.extend(data, g_params.subRow.content);
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
//        	illegalAction: {required: true},
//        	partiesName: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/writ/editWrit?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/writ/addWrit?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["writType"] = g_codeType;
	submitData["subType"] = "";
	submitData["content"] = JSON.stringify(getTableParams());
	submitData["relevanceId"] = g_relevanceIdList;
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