var g_params = {}, g_backUrl = null;
var g_codeType = rales.writNecessity5_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict);
	//公民选择
	$('input[type=checkbox][id=personType1]').change(function() { 
		$("#personType1").attr("checked",true);
		$("#personType2").attr("checked",false);
	});
	$('input[type=checkbox][id=personType2]').change(function() { 
		$("#personType2").attr("checked",true);
		$("#personType1").attr("checked",false);
	});
	$('#divCaseBeginDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	$('#divPunishDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	
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
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesAge').val(g_params.subRow.content.partiesAge);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesCertificateNo').val(g_params.subRow.content.partiesCertificateNo);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#companyName').val(g_params.subRow.content.companyName);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#companyAddr').val(g_params.subRow.content.companyAddr);
			$('#companyPhone').val(g_params.subRow.content.companyPhone);
			
			$('#illegalContent').val(g_params.subRow.content.illegalContent);
			$('#caseBeginDate').val(g_params.subRow.content.caseBeginDate);
			$('#punishWritCode').val(g_params.subRow.content.punishWritCode);
			$('#punishDate').val(g_params.subRow.content.punishDate);
			$('#caseDesc').val(g_params.subRow.content.caseDesc);
			$('#punishContent').val(g_params.subRow.content.punishContent);
			if(g_params.subRow.content.punishDetailCheck1 == '1') $("#punishDetailCheck1").attr("checked",true);
			$('#punishDetailContent1').val(g_params.subRow.content.punishDetailContent1);
			if(g_params.subRow.content.punishDetailCheck2 == '1') $("#punishDetailCheck2").attr("checked",true);
			$('#punishDetailContent2').val(g_params.subRow.content.punishDetailContent2);
			if(g_params.subRow.content.punishDetailCheck3 == '1') $("#punishDetailCheck3").attr("checked",true);
			$('#punishDetailContent3').val(g_params.subRow.content.punishDetailContent3);
			if(g_params.subRow.content.punishDetailCheck4 == '1') $("#punishDetailCheck4").attr("checked",true);
			$('#punishDetailContent4').val(g_params.subRow.content.punishDetailContent4);
			if(g_params.subRow.content.punishCodeCheck1 == '1') $("#punishCodeCheck1").attr("checked",true);
			$('#punishCodeContent1').val(g_params.subRow.content.punishCodeContent1);
			if(g_params.subRow.content.punishCodeCheck2 == '1') $("#punishCodeCheck2").attr("checked",true);
			$('#punishCodeContent2').val(g_params.subRow.content.punishCodeContent2);
			if(g_params.subRow.content.punishCodeCheck3 == '1') $("#punishCodeCheck3").attr("checked",true);
			$('#punishCodeContent3').val(g_params.subRow.content.punishCodeContent3);
			if(g_params.subRow.content.punishCodeCheck4 == '1') $("#punishCodeCheck4").attr("checked",true);
			$('#punishCodeContent4').val(g_params.subRow.content.punishCodeContent4);
			$('#reviewContent').val(g_params.subRow.content.reviewContent);
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
			if(g_params.subRow.content.personType == '1') $("#personType1").attr("checked",true);
			else $("#personType2").attr("checked",true);

			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesAge').text($.utils.getNotNullVal(g_params.subRow.content.partiesAge));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.subRow.content.partiesCertificateNo));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdCompanyName').text($.utils.getNotNullVal(g_params.subRow.content.companyName));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.subRow.content.companyAddr));
			$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.subRow.content.companyPhone));
			
			$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.subRow.content.illegalContent));
			$('#tdCaseBeginDate').text($.utils.getNotNullVal(g_params.subRow.content.caseBeginDate));
			$('#tdPunishWritCode').text($.utils.getNotNullVal(g_params.subRow.content.punishWritCode));
			$('#tdPunishDate').text($.utils.getNotNullVal(g_params.subRow.content.punishDate));
			$('#tdCaseDesc').text($.utils.getNotNullVal(g_params.subRow.content.caseDesc));
			$('#tdPunishContent').text($.utils.getNotNullVal(g_params.subRow.content.punishContent));
			if(g_params.subRow.content.punishDetailCheck1 == '1') $("#punishDetailCheck1").attr("checked",true);
			$('#tdPunishDetailContent1').text($.utils.getNotNullVal(g_params.subRow.content.punishDetailContent1));
			if(g_params.subRow.content.punishDetailCheck2 == '1') $("#punishDetailCheck2").attr("checked",true);
			$('#tdPunishDetailContent2').text($.utils.getNotNullVal(g_params.subRow.content.punishDetailContent2));
			if(g_params.subRow.content.punishDetailCheck3 == '1') $("#punishDetailCheck3").attr("checked",true);
			$('#tdPunishDetailContent3').text($.utils.getNotNullVal(g_params.subRow.content.punishDetailContent3));
			if(g_params.subRow.content.punishDetailCheck4 == '1') $("#punishDetailCheck4").attr("checked",true);
			$('#tdPunishDetailContent4').text($.utils.getNotNullVal(g_params.subRow.content.punishDetailContent4));
			if(g_params.subRow.content.punishCodeCheck1 == '1') $("#punishCodeCheck1").attr("checked",true);
			$('#tdPunishCodeContent1').text($.utils.getNotNullVal(g_params.subRow.content.punishCodeContent1));
			if(g_params.subRow.content.punishCodeCheck2 == '1') $("#punishCodeCheck2").attr("checked",true);
			$('#tdPunishCodeContent2').text($.utils.getNotNullVal(g_params.subRow.content.punishCodeContent2));
			if(g_params.subRow.content.punishCodeCheck3 == '1') $("#punishCodeCheck3").attr("checked",true);
			$('#tdPunishCodeContent3').text($.utils.getNotNullVal(g_params.subRow.content.punishCodeContent3));
			if(g_params.subRow.content.punishCodeCheck4 == '1') $("#punishCodeCheck4").attr("checked",true);
			$('#tdPunishCodeContent4').text($.utils.getNotNullVal(g_params.subRow.content.punishCodeContent4));
			$('#tdReviewContent').text($.utils.getNotNullVal(g_params.subRow.content.reviewContent));
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre5_1.html', params, function(){});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre5_1.html', params, function(){});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
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
	var personType = '0'
	if($('#personType1').prop('checked')) personType = '1';
	if($('#personType2').prop('checked')) personType = '2';
	data.personType = personType;
	if(g_params.type == 1 || g_params.type == 2){
		data.partiesName = $('#partiesName').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesAge = $('#partiesAge').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesCertificateNo = $('#partiesCertificateNo').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.companyName = $('#companyName').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.companyAddr = $('#companyAddr').val();
		data.companyPhone = $('#companyPhone').val();
		
		data.illegalContent = $('#illegalContent').val();
		data.caseBeginDate = $('#caseBeginDate').val();
		data.punishWritCode = $('#punishWritCode').val();
		data.punishDate = $('#punishDate').val();
		data.caseDesc = $('#caseDesc').val();
		data.punishContent = $('#punishContent').val();
		
		if($('#punishDetailCheck1').prop('checked'))  data.punishDetailCheck1 = "1";
		else data.punishDetailCheck1 = "0";
		if($('#punishDetailCheck2').prop('checked'))  data.punishDetailCheck2 = "1";
		else data.punishDetailCheck2 = "0";
		if($('#punishDetailCheck3').prop('checked'))  data.punishDetailCheck3 = "1";
		else data.punishDetailCheck3 = "0";
		if($('#punishDetailCheck14').prop('checked'))  data.punishDetailCheck4 = "1";
		else data.punishDetailCheck4 = "0";
		data.punishDetailContent1 = $('#punishDetailContent1').val();
		data.punishDetailContent2 = $('#punishDetailContent2').val();
		data.punishDetailContent3 = $('#punishDetailContent3').val();
		data.punishDetailContent4 = $('#punishDetailContent4').val();

		if($('#punishCodeCheck1').prop('checked'))  data.punishCodeCheck1 = "1";
		else data.punishCodeCheck1 = "0";
		if($('#punishCodeCheck2').prop('checked'))  data.punishCodeCheck2 = "1";
		else data.punishCodeCheck2 = "0";
		if($('#punishCodeCheck3').prop('checked'))  data.punishCodeCheck3 = "1";
		else data.punishCodeCheck3 = "0";
		if($('#punishCodeCheck14').prop('checked'))  data.punishCodeCheck4 = "1";
		else data.punishCodeCheck4 = "0";
		data.punishCodeContent1 = $('#punishCodeContent1').val();
		data.punishCodeContent2 = $('#punishCodeContent2').val();
		data.punishCodeContent3 = $('#punishCodeContent3').val();
		data.punishCodeContent4 = $('#punishCodeContent4').val();
		
		data.reviewContent = $('#reviewContent').val();
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
	var personType = '0'
	if($('#personType1').prop('checked')) personType = '1';
	if($('#personType2').prop('checked')) personType = '2';
	if(personType == '0'){
		top.app.message.notice("请选择公民或法人、其他组织！");
		return;
	}
	if(personType == '1' && $('#partiesName').val() == ''){
		top.app.message.notice("请输入公民姓名！");
		return;
	}
	if(personType == '2' && $('#companyName').val() == ''){
		top.app.message.notice("请输入组织名称！");
		return;
	}
	
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
