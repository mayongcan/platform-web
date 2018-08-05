var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional7_4, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	$.date.initSearchDate('divCheckDateBegin', 'divCheckDateEnd', "YYYY-MM-DD HH:mm");
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict);
	top.app.addComboBoxOption($("#delegateSex"), g_sexDict);
	
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
			$('#checkDateBegin').val(g_params.subRow.content.checkDateBegin);
			$('#checkDateEnd').val(g_params.subRow.content.checkDateEnd);
			$('#checkAddr').val(g_params.subRow.content.checkAddr);
			$('#hearingType').val(g_params.subRow.content.hearingType);
			$('#mainUser1').val(g_params.subRow.content.mainUser1);
			$('#mainUserJob1').val(g_params.subRow.content.mainUserJob1);
			$('#mainUser2').val(g_params.subRow.content.mainUser2);
			$('#mainUserJob2').val(g_params.subRow.content.mainUserJob2);
			$('#mainUser3').val(g_params.subRow.content.mainUser3);
			$('#mainUserJob3').val(g_params.subRow.content.mainUserJob3);
			$('#mainUser4').val(g_params.subRow.content.mainUser4);
			$('#mainUserJob4').val(g_params.subRow.content.mainUserJob4);
			$('#mainUser5').val(g_params.subRow.content.mainUser5);
			$('#mainUserJob5').val(g_params.subRow.content.mainUserJob5);
			
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesUnit').val(g_params.subRow.content.partiesUnit);
			$('#partiesJob').val(g_params.subRow.content.partiesJob);
			$('#partiesIdCard').val(g_params.subRow.content.partiesIdCard);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesZip').val(g_params.subRow.content.partiesZip);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#delegateName').val(g_params.subRow.content.delegateName);
			$('#delegateSex').val(g_params.subRow.content.delegateSex);
			$('#delegateIdCard').val(g_params.subRow.content.delegateIdCard);
			$('#delegateWork').val(g_params.subRow.content.delegateWork);
			$('#delegateJob').val(g_params.subRow.content.delegateJob);
			$('#delegatePhone').val(g_params.subRow.content.delegatePhone);
			$('#otherJoin').val(g_params.subRow.content.otherJoin);
			
			$('#hearingRequest').val(g_params.subRow.content.hearingRequest);
			$('#advice').val(g_params.subRow.content.advice);
			$('#content').val(g_params.subRow.content.content);
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
			$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.subRow.content.checkDateBegin));
			$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.subRow.content.checkDateEnd));
			$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.subRow.content.checkAddr));
			$('#tdHearingType').text($.utils.getNotNullVal(g_params.subRow.content.hearingType));
			$('#tdMainUser1').text($.utils.getNotNullVal(g_params.subRow.content.mainUser1));
			$('#tdMainUserJob1').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob1));
			$('#tdMainUser2').text($.utils.getNotNullVal(g_params.subRow.content.mainUser2));
			$('#tdMainUserJob2').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob2));
			$('#tdMainUser3').text($.utils.getNotNullVal(g_params.subRow.content.mainUser3));
			$('#tdMainUserJob3').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob3));
			$('#tdMainUser4').text($.utils.getNotNullVal(g_params.subRow.content.mainUser4));
			$('#tdMainUserJob4').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob4));
			$('#tdMainUser5').text($.utils.getNotNullVal(g_params.subRow.content.mainUser5));
			$('#tdMainUserJob5').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob5));
			
			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.subRow.content.partiesUnit));
			$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.subRow.content.partiesJob));
			$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.subRow.content.partiesIdCard));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.subRow.content.partiesZip));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdDelegateName').text($.utils.getNotNullVal(g_params.subRow.content.delegateName));
			$('#tdDelegateSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.delegateSex, delegateSex)));
			$('#tdDelegateIdCard').text($.utils.getNotNullVal(g_params.subRow.content.delegateIdCard));
			$('#tdDelegateWork').text($.utils.getNotNullVal(g_params.subRow.content.delegateWork));
			$('#tdDelegateJob').text($.utils.getNotNullVal(g_params.subRow.content.delegateJob));
			$('#tdDelegatePhone').text($.utils.getNotNullVal(g_params.subRow.content.delegatePhone));
			$('#tdOtherJoin').text($.utils.getNotNullVal(g_params.subRow.content.otherJoin));
			
			$('#tdHearingRequest').text($.utils.getNotNullVal(g_params.subRow.content.hearingRequest));
			$('#tdAdvice').text($.utils.getNotNullVal(g_params.subRow.content.advice));
			$('#tdContent').text($.utils.getNotNullVal(g_params.subRow.content.content));
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
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre7_4.html', params, function(){});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre7_4.html', params, function(){});
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
		data.checkDateBegin = $('#checkDateBegin').val();
		data.checkDateEnd = $('#checkDateEnd').val();
		data.checkAddr = $('#checkAddr').val();
		data.hearingType = $('#hearingType').val();
		data.mainUser1 = $('#mainUser1').val();
		data.mainUserJob1 = $('#mainUserJob1').val();
		data.mainUser2 = $('#mainUser2').val();
		data.mainUserJob2 = $('#mainUserJob2').val();
		data.mainUser3 = $('#mainUser3').val();
		data.mainUserJob3 = $('#mainUserJob3').val();
		data.mainUser4 = $('#mainUser4').val();
		data.mainUserJob4 = $('#mainUserJob4').val();
		data.mainUser5 = $('#mainUser5').val();
		data.mainUserJob5 = $('#mainUserJob5').val();
		
		data.partiesName = $('#partiesName').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesUnit = $('#partiesUnit').val();
		data.partiesJob = $('#partiesJob').val();
		data.partiesIdCard = $('#partiesIdCard').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesZip = $('#partiesZip').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.delegateName = $('#delegateName').val();
		data.delegateSex = $('#delegateSex').val();
		data.delegateIdCard = $('#delegateIdCard').val();
		data.delegateWork = $('#delegateWork').val();
		data.delegateJob = $('#delegateJob').val();
		data.delegatePhone = $('#delegatePhone').val();
		data.otherJoin = $('#otherJoin').val();
		
		data.hearingRequest = $('#hearingRequest').val();
		data.advice = $('#advice').val();
		data.content = $('#content').val();
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
        	illegalAction: {required: true},
        	checkDateBegin: {required: true},
        	checkDateEnd: {required: true},
        	checkAddr: {required: true},
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