var g_params = {}, g_backUrl = null;
var g_codeType = rales.writNecessity4_2, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divInquiryBeginDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
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
			
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#name').val(g_params.subRow.content.name);
			$('#partiesIdCard').val(g_params.subRow.content.partiesIdCard);
			$('#companyName').val(g_params.subRow.content.companyName);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#address').val(g_params.subRow.content.address);
			
			$('#inquiryBeginDate').val(g_params.subRow.content.inquiryBeginDate);
			$('#illegalContent').val(g_params.subRow.content.illegalContent);
			$('#illegalInfo').val(g_params.subRow.content.illegalInfo);
			$('#illegalEvidence').val(g_params.subRow.content.illegalEvidence);
			$('#illegalRule').val(g_params.subRow.content.illegalRule);
			$('#illegalStandard').val(g_params.subRow.content.illegalStandard);
			$("input[type='radio'][name=lawType][value=" + g_params.subRow.content.lawType + "]").attr("checked",true);
			$('#baseRule').val(g_params.subRow.content.baseRule);
			$('#punish1').val(g_params.subRow.content.punish1);
			$('#punish2').val(g_params.subRow.content.punish2);
			$('#bankCode').val(g_params.subRow.content.bankCode);
			$('#review1').val(g_params.subRow.content.review1);
			$('#review2').val(g_params.subRow.content.review2);
			$('#lawsuit').val(g_params.subRow.content.lawsuit);
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

			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdName').text($.utils.getNotNullVal(g_params.subRow.content.name));
			$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.subRow.content.partiesIdCard));
			$('#tdCompanyName').text($.utils.getNotNullVal(g_params.subRow.content.companyName));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdAddress').text($.utils.getNotNullVal(g_params.subRow.content.address));
			
			$('#tdInquiryBeginDate').text($.utils.getNotNullVal(g_params.subRow.content.inquiryBeginDate));
			$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.subRow.content.illegalContent));
			$('#tdIllegalInfo').text($.utils.getNotNullVal(g_params.subRow.content.illegalInfo));
			$('#tdIllegalEvidence').text($.utils.getNotNullVal(g_params.subRow.content.illegalEvidence));
			$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.subRow.content.illegalRule));
			$('#tdIllegalStandard').text($.utils.getNotNullVal(g_params.subRow.content.illegalStandard));
			$("input[type='radio'][name=lawType][value=" + g_params.subRow.content.lawType + "]").attr("checked",true);
			$('#tdBaseRule').text($.utils.getNotNullVal(g_params.subRow.content.baseRule));
			$('#tdPunish1').text($.utils.getNotNullVal(g_params.subRow.content.punish1));
			$('#tdPunish2').text($.utils.getNotNullVal(g_params.subRow.content.punish2));
			$('#tdBankCode').text($.utils.getNotNullVal(g_params.subRow.content.bankCode));
			$('#tdReview1').text($.utils.getNotNullVal(g_params.subRow.content.review1));
			$('#tdReview2').text($.utils.getNotNullVal(g_params.subRow.content.review2));
			$('#tdLawsuit').text($.utils.getNotNullVal(g_params.subRow.content.lawsuit));
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pr4_2.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre4_2.html', params, function(){});
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
		data.partiesName = $('#partiesName').val();
		data.name = $('#name').val();
		data.partiesIdCard = $('#partiesIdCard').val();
		data.companyName = $('#companyName').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.address = $('#address').val();
		
		data.inquiryBeginDate = $('#inquiryBeginDate').val();
		data.illegalContent = $('#illegalContent').val();
		data.illegalInfo = $('#illegalInfo').val();
		data.illegalEvidence = $('#illegalEvidence').val();
		data.illegalRule = $('#illegalRule').val();
		data.illegalStandard = $('#illegalStandard').val();
		data.lawType = $('#tdLawType input:radio:checked').val();
		data.baseRule = $('#baseRule').val();
		data.punish1 = $('#punish1').val();
		data.punish2 = $('#punish2').val();
		data.bankCode = $('#bankCode').val();
		data.review1 = $('#review1').val();
		data.review2 = $('#review2').val();
		data.lawsuit = $('#lawsuit').val();
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
        	partiesName: {required: true},
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