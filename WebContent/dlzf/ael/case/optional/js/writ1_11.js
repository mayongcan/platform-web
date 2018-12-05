var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional1_11, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divIllegalDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict, true, ' ');;
//	//公民选择
//	$('input[type=checkbox][id=personType1]').change(function() { 
//		$("#personType1").attr("checked",true);
//		$("#personType2").attr("checked",false);
//	});
//	$('input[type=checkbox][id=personType2]').change(function() { 
//		$("#personType2").attr("checked",true);
//		$("#personType1").attr("checked",false);
//	});
	
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

			if(g_params.subRow.content.personType == '1') $("#personType1").attr("checked",true);
			else $("#personType2").attr("checked",true);

			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#partiesPrincipal').val(g_params.subRow.content.partiesPrincipal);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
//			$('#partiesSex').val(g_params.subRow.content.partiesSex);
//			$('#partiesCertificateNo').val(g_params.subRow.content.partiesCertificateNo);
//			$('#companyName').val(g_params.subRow.content.companyName);
//			$('#companyJob').val(g_params.subRow.content.companyJob);
//			$('#companyAddr').val(g_params.subRow.content.companyAddr);
//			$('#companyCode').val(g_params.subRow.content.companyCode);
			$('#illegalDate').val(g_params.subRow.content.illegalDate);
			$('#illegalAddr').val(g_params.subRow.content.illegalAddr);
			$('#illegalReason').val(g_params.subRow.content.illegalReason);
			$('#illegalRule').val(g_params.subRow.content.illegalRule);
			$("input[type='radio'][name=defendType][value=" + g_params.subRow.content.defendType + "]").attr("checked",true);
			$('#baseRule').val(g_params.subRow.content.baseRule);
			if(g_params.subRow.content.punishType1 == '1') $("#punishType1").attr("checked",true);
			if(g_params.subRow.content.punishType2 == '1') $("#punishType2").attr("checked",true);
			
			$('#punishMoney1').val(g_params.subRow.content.punishMoney1);
			$('#punishMoney2').val(g_params.subRow.content.punishMoney2);
			$('#punishMoney3').val(g_params.subRow.content.punishMoney3);
			$('#punishMoney4').val(g_params.subRow.content.punishMoney4);
			$('#punishMoneyAll').val(g_params.subRow.content.punishMoneyAll);
			$('#punishGetType').val(g_params.subRow.content.punishGetType);

			if(g_params.subRow.content.punishMoneyType1 == '1') $("#punishMoneyType1").attr("checked",true);
			if(g_params.subRow.content.punishMoneyType2 == '1') $("#punishMoneyType2").attr("checked",true);
			$('#bankName').val(g_params.subRow.content.bankName);
			$('#bankCode').val(g_params.subRow.content.bankCode);
			$('#bankUserName').val(g_params.subRow.content.bankUserName);
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

//			if(g_params.subRow.content.personType == '1') $("#personType1").attr("checked",true);
//			else $("#personType2").attr("checked",true);

			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdPartiesPrincipal').val($.utils.getNotNullVal(g_params.subRow.content.partiesPrincipal));
			$('#tdPartiesPhone').val($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdPartiesAddr').val($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
//			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
//			$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.subRow.content.partiesCertificateNo));
//			$('#tdCompanyName').text($.utils.getNotNullVal(g_params.subRow.content.companyName));
//			$('#tdCompanyJob').text($.utils.getNotNullVal(g_params.subRow.content.companyJob));
//			$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.subRow.content.companyAddr));
//			$('#tdCompanyCode').text($.utils.getNotNullVal(g_params.subRow.content.companyCode));
			$('#tdIllegalDate').text($.utils.getNotNullVal(g_params.subRow.content.illegalDate));
			$('#tdIllegalAddr').text($.utils.getNotNullVal(g_params.subRow.content.illegalAddr));
			$('#tdIllegalReason').text($.utils.getNotNullVal(g_params.subRow.content.illegalReason));
			$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.subRow.content.illegalRule));
			$("input[type='radio'][name=defendType][value=" + g_params.subRow.content.defendType + "]").attr("checked",true);
			$('#tdBaseRule').text($.utils.getNotNullVal(g_params.subRow.content.baseRule));
			if(g_params.subRow.content.punishType1 == '1') $("#punishType1").attr("checked",true);
			if(g_params.subRow.content.punishType2 == '1') $("#punishType2").attr("checked",true);
			
			$('#tdPunishMoney').text($.utils.getNotNullVal(g_params.subRow.content.punishMoney1) + "千" + 
					$.utils.getNotNullVal(g_params.subRow.content.punishMoney2) + "百" + 
					$.utils.getNotNullVal(g_params.subRow.content.punishMoney3) + "拾" + 
					$.utils.getNotNullVal(g_params.subRow.content.punishMoney4) + "元");
//			$('#tdPunishMoney1').text($.utils.getNotNullVal(g_params.subRow.content.punishMoney1));
//			$('#tdPunishMoney2').text($.utils.getNotNullVal(g_params.subRow.content.punishMoney2));
//			$('#tdPunishMoney3').text($.utils.getNotNullVal(g_params.subRow.content.punishMoney3));
//			$('#tdPunishMoney4').text($.utils.getNotNullVal(g_params.subRow.content.punishMoney4));
			$('#tdPunishMoneyAll').text($.utils.getNotNullVal(g_params.subRow.content.punishMoneyAll));
			$('#tdPunishGetType').text($.utils.getNotNullVal(g_params.subRow.content.punishGetType));

			if(g_params.subRow.content.punishMoneyType1 == '1') $("#punishMoneyType1").attr("checked",true);
			if(g_params.subRow.content.punishMoneyType2 == '1') $("#punishMoneyType2").attr("checked",true);
			$('#tdBankName').text($.utils.getNotNullVal(g_params.subRow.content.bankName));
			$('#tdBankCode').text($.utils.getNotNullVal(g_params.subRow.content.bankCode));
			$('#tdBankUserName').text($.utils.getNotNullVal(g_params.subRow.content.bankUserName));
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
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_11.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_11.html', params, function(){});
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
	
//	var personType = '0'
//	if($('#personType1').prop('checked')) personType = '1';
//	if($('#personType2').prop('checked')) personType = '2';
//	data.personType = personType;
	
	data.defendType = $('#tdDefendType input:radio:checked').val();

	var punishType1 = '0', punishType2 = '0';
	if($('#punishType1').prop('checked')) punishType1 = '1';
	if($('#punishType2').prop('checked')) punishType2 = '1';
	data.punishType1 = punishType1;
	data.punishType2 = punishType2;

	var punishMoneyType1 = '0', punishMoneyType2 = '0';
	if($('#punishMoneyType1').prop('checked')) punishMoneyType1 = '1';
	if($('#punishMoneyType2').prop('checked')) punishMoneyType2 = '1';
	data.punishMoneyType1 = punishMoneyType1;
	data.punishMoneyType2 = punishMoneyType2;
	if(g_params.type == 1 || g_params.type == 2){	
		data.partiesName = $('#partiesName').val();
		data.partiesPrincipal = $('#partiesPrincipal').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.partiesAddr = $('#partiesAddr').val();
//		data.partiesSex = $('#partiesSex').val();
//		data.partiesCertificateNo = $('#partiesCertificateNo').val();
//		data.companyName = $('#companyName').val();
//		data.companyJob = $('#companyJob').val();
//		data.companyAddr = $('#companyAddr').val();
//		data.companyCode = $('#companyCode').val();
		data.ruleEvidence = $('#ruleEvidence').val();
		data.illegalDate = $('#illegalDate').val();
		data.illegalAddr = $('#illegalAddr').val();
		data.illegalReason = $('#illegalReason').val();
		data.illegalRule = $('#illegalRule').val();
		data.baseRule = $('#baseRule').val();
		data.punishMoney1 = $('#punishMoney1').val();
		data.punishMoney2 = $('#punishMoney2').val();
		data.punishMoney3 = $('#punishMoney3').val();
		data.punishMoney4 = $('#punishMoney4').val();
		data.punishMoneyAll = $('#punishMoneyAll').val();
		data.punishGetType = $('#punishGetType').val();
		data.bankName = $('#bankName').val();
		data.bankCode = $('#bankCode').val();
		data.bankUserName = $('#bankUserName').val();
		data.review1 = $('#review1').val();
		data.review2 = $('#review2').val();
		data.lawsuit = $('#lawsuit').val();
	}else{
		data = $.extend(data, g_params.subRow.content);
	}
	if(g_params.subRow && g_params.subRow.content){
		data.punishTypeOld1 = g_params.subRow.content.punishType1;
		data.punishTypeOld2 = g_params.subRow.content.punishType2;
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
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