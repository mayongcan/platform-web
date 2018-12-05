var g_params = {}, g_backUrl = null;
var g_codeType = rales.writNecessity2_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_caseSourceDict = "", g_sexDict = "";
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict, true, ' ');;
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
		
		var caseSourceDict = top.app.getDictDataByDictTypeValue('AEL_REGISTER_SOURCE_CLUE');
		//关联内容
		$('#caseSource').val(top.app.getDictName(g_params.row.sourceCase, caseSourceDict));
		$('#caseAddr').val(g_params.row.defendantAddress);
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();

		g_userIdList = g_params.row.associateExecutor;
		g_userNameList = g_params.row.associateUserName;
		if(g_params.row.activityName == "初步审批") $("#trUndertaker").remove();
		else $("#undertaker").val(g_userNameList);
		
		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");

			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#partiesCertificateNo').val(g_params.subRow.content.partiesCertificateNo);
			$('#partiesContact').val(g_params.subRow.content.partiesContact);
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesZip').val(g_params.subRow.content.partiesZip);
			
			$('#caseAddr').val(g_params.subRow.content.caseAddr);
			$('#caseSource').val(g_params.subRow.content.caseSource);
			$('#base').val(g_params.subRow.content.base);
			$('#advice').val(g_params.subRow.content.advice);
			
			if(!$.utils.isNull(g_params.subRow.content.illegalType))
				$('#illegalType').selectpicker('val', g_params.subRow.content.illegalType.split(','));
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
		//移除第二承办人
		$('#trUndertaker').remove();

		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");

			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.subRow.content.partiesCertificateNo));
			$('#tdPartiesContact').text($.utils.getNotNullVal(g_params.subRow.content.partiesContact));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.subRow.content.partiesZip));
			
			$('#tdCaseAddr').text($.utils.getNotNullVal(g_params.subRow.content.caseAddr));
			$('#tdCaseSource').text($.utils.getNotNullVal(g_params.subRow.content.caseSource));
			$('#tdBase').text($.utils.getNotNullVal(g_params.subRow.content.base));
			$('#tdAdvice').text($.utils.getNotNullVal(g_params.subRow.content.advice));
			
			var illegalType = "";
			if(!$.utils.isNull(g_params.subRow.content.illegalType)){
				if(g_params.subRow.content.illegalType.indexOf("1") != -1){
					illegalType += '破坏电力设施、';
				}
				if(g_params.subRow.content.illegalType.indexOf("2") != -1){
					illegalType += '扰乱供电秩序、';
				}
				if(g_params.subRow.content.illegalType.indexOf("3") != -1){
					illegalType += '盗窃电';
				}
			}
			$('#tdIllegalType').text(illegalType);
		}
		
		//设置右侧的高度和左侧一致
		if($("#content-left").height() < 500) $("#content-left").height(500);
		$("#content-right").height($("#content-left").height());
		
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);

		//显示历史处理意见
		$('#trHistoryAuditList').css('display', '');
		getHistoryAuditList(g_params.row.id, "2");
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre2_1.html', params, function(){});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre2_1.html', params, function(){});
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
	//选择第二承办人
	$("#undertaker").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择第二承办人', ['900px', '550px'], '/rales/ael/case/case-new-undertaker.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#undertaker").val(retParams[0].userNameList);
		});
    });
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.registerId = g_params.row.id;
	data.tableTitleMark = $('#tableTitleMark').text();
	data.illegalType = $.trim($("#illegalType").val());
	if(g_params.type == 1 || g_params.type == 2){
		data.partiesName = $('#partiesName').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.partiesCertificateNo = $('#partiesCertificateNo').val();
		data.partiesContact = $('#partiesContact').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesZip = $('#partiesZip').val();
		data.caseAddr = $('#caseAddr').val();
		data.caseSource = $('#caseSource').val();
		data.base = $('#base').val();
		data.advice = $('#advice').val();
	}else{
		data = $.extend(data, g_params.subRow.content);
	}
	if(g_params.subRow && g_params.subRow.content && g_params.subRow.content.illegalType){
		data.illegalTypeOld = g_params.subRow.content.illegalType;
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
//        	illegalContent: {required: true},
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
	if($.utils.isEmpty(g_userIdList)){
		top.app.message.notice("请选择第二承办人！");
		return;
	}
	if(g_params.type == 1 && g_userIdList == top.app.info.userInfo.userId){
		top.app.message.notice("不能选择自己作为第二承办人！");
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
	//用于更新流程中的案件编号
	submitData["taskId"] = g_params.row.taskId;
	submitData["processInstanceId"] = g_params.row.processInstanceId;
	submitData["processDefinitionId"] = g_params.row.processDefinitionId;
	
	submitData["codeType"] = g_codeType;
	submitData["writType"] = g_codeType;
	submitData["subType"] = "";
	submitData["content"] = JSON.stringify(getTableParams());
	submitData["associateExecutor"] = g_userIdList;
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
				top.app.info.iframe.params.row.associateExecutor = g_userIdList;
				top.app.info.iframe.params.row.associateUserName = g_userNameList;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
