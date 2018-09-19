var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional1_10, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divStopDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	$('#divHandleDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
	$('#divChangeDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date()});
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
			$('#companyName').val(g_params.subRow.content.companyName);
			$('#rule1').val(g_params.subRow.content.rule1);
			$('#rule2').val(g_params.subRow.content.rule2);
			$('#rule3').val(g_params.subRow.content.rule3);
			$('#rule4').val(g_params.subRow.content.rule4);
			$('#ruleEvidence').val(g_params.subRow.content.ruleEvidence);
			$('#rule5').val(g_params.subRow.content.rule5);
			$('#rule6').val(g_params.subRow.content.rule6);
			$('#rule7').val(g_params.subRow.content.rule7);
			$('#rule8').val(g_params.subRow.content.rule8);
			if(g_params.subRow.content.stopAction1 == '1') $("#stopAction1").attr("checked",true);
			if(g_params.subRow.content.stopAction2 == '1') $("#stopAction2").attr("checked",true);
			if(g_params.subRow.content.stopAction3 == '1') $("#stopAction3").attr("checked",true);
			$('#stopDate').val(g_params.subRow.content.stopDate);
			$('#content').val(g_params.subRow.content.content);
			$('#handleDate').val(g_params.subRow.content.handleDate);
			$('#org').val(g_params.subRow.content.org);
			$('#changeDate').val(g_params.subRow.content.changeDate);
			$('#contactUser').val(g_params.subRow.content.contactUser);
			$('#contactPhone').val(g_params.subRow.content.contactPhone);
			$('#contactAddr').val(g_params.subRow.content.contactAddr);
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
			$('#tdCompanyName').text($.utils.getNotNullVal(g_params.subRow.content.companyName));
			$('#tdRule1').text($.utils.getNotNullVal(g_params.subRow.content.rule1));
			$('#tdRule2').text($.utils.getNotNullVal(g_params.subRow.content.rule2));
			$('#tdRule3').text($.utils.getNotNullVal(g_params.subRow.content.rule3));
			$('#tdRule4').text($.utils.getNotNullVal(g_params.subRow.content.rule4));
			$('#tdRuleEvidence').text($.utils.getNotNullVal(g_params.subRow.content.ruleEvidence));
			$('#tdRule5').text($.utils.getNotNullVal(g_params.subRow.content.rule5));
			$('#tdRule6').text($.utils.getNotNullVal(g_params.subRow.content.rule6));
			$('#tdRule7').text($.utils.getNotNullVal(g_params.subRow.content.rule7));
			$('#tdRule8').text($.utils.getNotNullVal(g_params.subRow.content.rule8));
			if(g_params.subRow.content.stopAction1 == '1') $("#stopAction1").attr("checked",true);
			if(g_params.subRow.content.stopAction2 == '1') $("#stopAction2").attr("checked",true);
			if(g_params.subRow.content.stopAction3 == '1') $("#stopAction3").attr("checked",true);
			$('#tdStopDate').text($.utils.getNotNullVal(g_params.subRow.content.stopDate));
			$('#tdContent').text($.utils.getNotNullVal(g_params.subRow.content.content));
			$('#tdHandleDate').text($.utils.getNotNullVal(g_params.subRow.content.handleDate));
			$('#tdOrg').text($.utils.getNotNullVal(g_params.subRow.content.org));
			$('#tdChangeDate').text($.utils.getNotNullVal(g_params.subRow.content.changeDate));
			$('#tdContactUser').text($.utils.getNotNullVal(g_params.subRow.content.contactUser));
			$('#tdContactPhone').text($.utils.getNotNullVal(g_params.subRow.content.contactPhone));
			$('#tdContactAddr').text($.utils.getNotNullVal(g_params.subRow.content.contactAddr));
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_10.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_10.html', params, function(){});
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

	var stopAction1 = '0', stopAction2 = '0', stopAction3 = '0';
	if($('#stopAction1').prop('checked')) stopAction1 = '1';
	if($('#stopAction2').prop('checked')) stopAction2 = '1';
	if($('#stopAction3').prop('checked')) stopAction3 = '1';
	data.stopAction1 = stopAction1;
	data.stopAction2 = stopAction2;
	data.stopAction3 = stopAction3;
	if(g_params.type == 1 || g_params.type == 2){	
		data.partiesName = $('#partiesName').val();
		data.companyName = $('#companyName').val();
		data.rule1 = $('#rule1').val();
		data.rule2 = $('#rule2').val();
		data.rule3 = $('#rule3').val();
		data.rule4 = $('#rule4').val();
		data.ruleEvidence = $('#ruleEvidence').val();
		data.rule5 = $('#rule5').val();
		data.rule6 = $('#rule6').val();
		data.rule7 = $('#rule7').val();
		data.rule8 = $('#rule8').val();
		data.stopDate = $('#stopDate').val();
		data.content = $('#content').val();
		data.handleDate = $('#handleDate').val();
		data.org = $('#org').val();
		data.changeDate = $('#changeDate').val();
		data.contactUser = $('#contactUser').val();
		data.contactPhone = $('#contactPhone').val();
		data.contactAddr = $('#contactAddr').val();
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