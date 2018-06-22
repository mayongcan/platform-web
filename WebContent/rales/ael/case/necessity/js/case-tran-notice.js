var g_params = {}, g_backUrl = null;
var  g_codeType = "4", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divTranDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	$('#tdCaseParties').text($.utils.getNotNullVal(g_params.row.parties));
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.row.illegalContent));
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
		$('#operator').val(g_params.row.createUserName + "、" + g_params.row.associateUserName);
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$('#tranDate').val(g_params.subRow.transferDate);
		$("#acceptMaster").val(g_params.subRow.acceptance);
		$("#operator").val(g_params.subRow.operator);
		$("#memo").val(g_params.subRow.memo);
		$("#provision").val(g_params.subRow.legalBasis);
		$("#materials").val(g_params.subRow.materialsNumber);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdTranDate').text($.utils.getNotNullVal(g_params.subRow.transferDate));
		$('#tdAcceptMaster').text($.utils.getNotNullVal(g_params.subRow.acceptance));
		$('#tdOperator').text($.utils.getNotNullVal(g_params.subRow.operator));
		$('#tdMemo').text($.utils.getNotNullVal(g_params.subRow.memo));
		$('#tdProvision').text($.utils.getNotNullVal(g_params.subRow.legalBasis));
		$('#tdMaterials').text($.utils.getNotNullVal(g_params.subRow.materialsNumber));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.printType = 2;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/case-tran-notice-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/case-tran-notice-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.caseParties = $('#tdCaseParties').text();
	data.illegalContent = $('#tdIllegalContent').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.tranDate = $('#tranDate').val();
		data.acceptMaster = $('#acceptMaster').val();
		data.operator = $('#operator').val();
		data.memo = $('#memo').val();
		data.provision = $('#provision').val();
		data.materials = $('#materials').val();
	}else{
		data.tranDate = $('#tdTranDate').text();
		data.acceptMaster = $('#tdAcceptMaster').text();
		data.operator = $('#tdOperator').text();
		data.memo = $('#tdMemo').text();
		data.provision = $('#tdProvision').text();
		data.materials = $('#tdMaterials').text();
	}
	return data;
}


/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		tranDate: {required: true},
    		acceptMaster: {required: true},
    		operator: {required: true},
    		memo: {required: true},
    		provision: {required: true},
    		materials: {required: true, digits:true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCaseTranserNotice?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCaseTranserNotice?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["parties"] = $.utils.getNotNullVal(g_params.row.parties);
	submitData["illegalContent"] = $.utils.getNotNullVal(g_params.row.illegalContent);
	submitData["transferDate"] = $('#tranDate').val();
	submitData["acceptance"] = $("#acceptMaster").val();
	submitData["operator"] = $("#operator").val();
	submitData["memo"] = $("#memo").val();
	submitData["legalBasis"] = $("#provision").val();
	submitData["materialsNumber"] = $("#materials").val();
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
				top.app.info.iframe.params = g_params;
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}