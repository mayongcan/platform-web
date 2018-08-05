var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional7_5, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$.date.initSearchDate('divCheckDateBegin', 'divCheckDateEnd', "YYYY-MM-DD HH:mm");
	
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
			$('#lawUser1').val(g_params.subRow.content.lawUser1);
			$('#lawUserCardNo1').val(g_params.subRow.content.lawUserCardNo1);
			$('#lawUser2').val(g_params.subRow.content.lawUser2);
			$('#lawUserCardNo2').val(g_params.subRow.content.lawUserCardNo2);
			$('#hearingOrg').val(g_params.subRow.content.hearingOrg);
			$('#mainUser1').val(g_params.subRow.content.mainUser1);
			$('#mainUserJob1').val(g_params.subRow.content.mainUserJob1);
			$('#mainUser2').val(g_params.subRow.content.mainUser2);
			$('#mainUserJob2').val(g_params.subRow.content.mainUserJob2);
			$('#mainUser3').val(g_params.subRow.content.mainUser3);
			$('#mainUserJob3').val(g_params.subRow.content.mainUserJob3);
			$('#checkDateBegin').val(g_params.subRow.content.checkDateBegin);
			$('#checkDateEnd').val(g_params.subRow.content.checkDateEnd);
			$('#checkAddr').val(g_params.subRow.content.checkAddr);
			
			$('#partiesName1').val(g_params.subRow.content.partiesName1);
			$('#partiesNameJob1').val(g_params.subRow.content.partiesNameJob1);
			$('#partiesName2').val(g_params.subRow.content.partiesName2);
			$('#partiesNameJob2').val(g_params.subRow.content.partiesNameJob2);
			
			$('#baseInfo').val(g_params.subRow.content.baseInfo);
			$('#content').val(g_params.subRow.content.content);
			$('#advice').val(g_params.subRow.content.advice);
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
			$('#tdLawUser1').text($.utils.getNotNullVal(g_params.subRow.content.lawUser1));
			$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.subRow.content.lawUserCardNo1));
			$('#tdLawUser2').text($.utils.getNotNullVal(g_params.subRow.content.lawUser2));
			$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.subRow.content.lawUserCardNo2));
			$('#tdHearingOrg').text($.utils.getNotNullVal(g_params.subRow.content.hearingOrg));
			$('#tdMainUser1').text($.utils.getNotNullVal(g_params.subRow.content.mainUser1));
			$('#tdMainUserJob1').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob1));
			$('#tdMainUser2').text($.utils.getNotNullVal(g_params.subRow.content.mainUser2));
			$('#tdMainUserJob2').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob2));
			$('#tdMainUser3').text($.utils.getNotNullVal(g_params.subRow.content.mainUser3));
			$('#tdMainUserJob3').text($.utils.getNotNullVal(g_params.subRow.content.mainUserJob3));
			$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.subRow.content.checkDateBegin));
			$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.subRow.content.checkDateEnd));
			$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.subRow.content.checkAddr));
			
			$('#tdPartiesName1').text($.utils.getNotNullVal(g_params.subRow.content.partiesName1));
			$('#tdPartiesNameJob1').text($.utils.getNotNullVal(g_params.subRow.content.partiesNameJob1));
			$('#tdPartiesName2').text($.utils.getNotNullVal(g_params.subRow.content.partiesName2));
			$('#tdPartiesNameJob2').text($.utils.getNotNullVal(g_params.subRow.content.partiesNameJob2));
			
			$('#tdBaseInfo').text($.utils.getNotNullVal(g_params.subRow.content.baseInfo));
			$('#tdContent').text($.utils.getNotNullVal(g_params.subRow.content.content));
			$('#tdAdvice').text($.utils.getNotNullVal(g_params.subRow.content.advice));
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre7_5.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre7_5.html', params, function(){});
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
		data.lawUser1 = $('#lawUser1').val();
		data.lawUserCardNo1 = $('#lawUserCardNo1').val();
		data.lawUser2 = $('#lawUser2').val();
		data.lawUserCardNo2 = $('#lawUserCardNo2').val();
		data.hearingOrg = $('#hearingOrg').val();
		data.mainUser1 = $('#mainUser1').val();
		data.mainUserJob1 = $('#mainUserJob1').val();
		data.mainUser2 = $('#mainUser2').val();
		data.mainUserJob2 = $('#mainUserJob2').val();
		data.mainUser3 = $('#mainUser3').val();
		data.mainUserJob3 = $('#mainUserJob3').val();
		data.checkDateBegin = $('#checkDateBegin').val();
		data.checkDateEnd = $('#checkDateEnd').val();
		data.checkAddr = $('#checkAddr').val();
		
		data.partiesName1 = $('#partiesName1').val();
		data.partiesNameJob1 = $('#partiesNameJob1').val();
		data.partiesName2 = $('#partiesName2').val();
		data.partiesNameJob2 = $('#partiesNameJob2').val();
		
		data.baseInfo = $('#baseInfo').val();
		data.content = $('#content').val();
		data.advice = $('#advice').val();
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