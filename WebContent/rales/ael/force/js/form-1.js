var g_params = {}, g_backUrl = null, g_submitType = 0;
var g_codeType = "11", g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	initView();
});

function initView(){
	
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
		$('#tableTitleMark').text(g_params.row.rapCode);
		$('#content-right').remove();

		$('#tdCaseNo').text($.utils.getNotNullVal(g_params.row.caseCode));
		$('#tdCaseDate').text($.date.dateFormat(g_params.row.rapFiling, "yyyy-MM-dd"));
		$('#caseParties').val($.utils.getNotNullVal(g_params.row.rapParties));
		$('#caseDesc').val(g_params.row.rapIntroduction);
		$('#suggest').val(g_params.row.advice);
		g_userIdList = g_params.row.associateExecutor;
		g_userNameList = g_params.row.associateUserName;
		$("#undertaker").val(g_userNameList);
		
		g_relevanceIdList = g_params.row.rapRelevanceId;
		g_relevanceCodeList = rales.getWritListByRelevanceId(g_params.row.rapRelevanceId);
		$("#relevanceId").val(g_relevanceCodeList);
		fileupload.initFileEditSelector('files', g_params.row.rapFiles);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.row.rapCode);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnSave").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');

		$('#tdCaseNo').text($.utils.getNotNullVal(g_params.row.caseCode));
		$('#tdCaseDate').text($.date.dateFormat(g_params.row.rapFiling, "yyyy-MM-dd"));
		$('#tdCaseParties').text($.utils.getNotNullVal(g_params.row.rapParties));
		$('#tdCaseDesc').text($.utils.getNotNullVal(g_params.row.rapIntroduction));
		$('#tdSuggest').text($.utils.getNotNullVal(g_params.row.advice));
		$('#tdUndertaker').text($.utils.getNotNullVal(g_params.row.associateUserName));
		
		//设置右侧的高度和左侧一致
		if($("#content-left").height() < 500) $("#content-left").height(500);
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.row.rapFiles);
		rales.initCodeRelevance(g_params.row.rapRelevanceId);
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/evidence-preserve-audit-pre.html', params, function(){});
    });
	//保存
	$("#btnSave").click(function () {
		g_submitType = 0;
		$("form").submit();
    });
	//提交
	$("#btnOK").click(function () {
		if(g_params.row == null || g_params.row == undefined || g_params.row.id == null || g_params.row.id == undefined){
   			top.app.message.notice("请先保存证据保全措施审批表后再提交！");
   			return;
		}
		
		top.app.message.confirm("确定提交审批？", function(){
			g_submitType = 1;
			$("form").submit();
		});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/evidence-preserve-audit-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
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
	data.tableTitleMark = $('#tableTitleMark').text();
	data.caseNo = $('#tdCaseNo').text();
	data.caseDate = $('#tdCaseDate').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.caseDesc = $('#caseDesc').val();
		data.suggest = $('#suggest').val();
		data.caseParties = $('#caseParties').val();
	}else{
		data.caseDesc = $('#tdCaseDesc').text();
		data.suggest = $('#tdSuggest').text();
		data.caseParties = $('#tdCaseParties').text();
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
        	fileupload.uploadAction(function(){
        		if($.utils.isEmpty(g_userIdList)){
        			top.app.message.notice("请选择第二承办人！");
        			return false;
        		}
        		if(g_userIdList == top.app.info.userInfo.userId){
        			top.app.message.notice("不能选择自己作为第二承办人！");
        			return false;
        		}
        		return true;
        	}, false, true, "-1", function(){submitAction();});
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/force/editForceInfo?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.row.rapId;
		submitData["registerId"] = g_params.row.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/force/addForceInfo?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
	}
	submitData["codeType"] = g_codeType;
	submitData["filingDate"] = $('#tdCaseDate').text();
	submitData["parties"] = $("#caseParties").val();
	submitData["introduction"] = $("#caseDesc").val();
	submitData["advice"] = $("#suggest").val();
	submitData["associateExecutor"] = g_userIdList;
//	submitData["relevanceId"] = g_relevanceIdList;
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
			if(top.app.message.code.success == data.RetCode){
				//判断是否为提交按钮
				if(g_submitType == 1){
					//进行流程启动
					startFlow();
				}else{
					top.app.message.loadingClose();
		   			top.app.message.notice("数据保存成功！");
					parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
				}
	   		}else{
				top.app.message.loadingClose();
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 启动流程
 * @returns
 */
function startFlow(){
	var submitData = {}, url = "";
	if($.utils.isEmpty(parent.g_params.reaudit)){
		submitData["registerId"] = parent.g_params.row.id;
		submitData["id"] = parent.g_params.row.rapId;
		submitData["code"] = parent.g_params.row.rapCode;
		submitData["associateExecutor"] = parent.g_params.row.associateExecutor;
		url = "/api/rales/ael/force/startForceFlow";
	}else{
		submitData["taskId"] = g_params.row.taskId;
		submitData["processInstanceId"] = g_params.row.processInstanceId;
		submitData["processDefinitionId"] = g_params.row.processDefinitionId;
		submitData["registerId"] = g_params.row.id;
		submitData["subFlowProgress"] = "10";
		submitData["otherFlowId"] = g_params.row.rapId;
		url = "/api/rales/ael/case/caseFlowNext";
	}
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + url + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据提交成功！");
				parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
