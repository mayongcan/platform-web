var g_params = {}, g_backUrl = null;
var g_codeType = "29", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divCaseBeginVolumeDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date(),});
	$('#divCaseTestVolumeDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divCaseSaveVolumeDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, defaultDate: new Date(),});
	$('#divCaseSaveLimitDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	//获取立案审批信息
	var filingInfo = rales.getCaseFilingInfo(g_params.row.id);
	$('#tdIllegalContent').text(filingInfo.illegalContent);
	$('#tdBePunishUser').text(filingInfo.name);
	$('#tdHandleOrg').text("广州市工业和信息化委员会");
	$('#tdHandleUser').text(g_params.row.createUserName + "、" + g_params.row.associateUserName);
	$('#tdCaseBeginDate').text($.date.dateFormat(filingInfo.filingDate, "yyyy-MM-dd"));
	$('#tdCaseEndDate').text($.date.dateFormat(filingInfo.endDate, "yyyy-MM-dd"));
	
	$('#caseVolumeUser').val(top.app.info.userInfo.userName);

	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();

		$('#caseName').val(g_params.subRow.name);
		$("#caseBeginVolumeDate").val($.date.dateFormat(g_params.subRow.volumeDate, "yyyy-MM-dd"));
		$("#caseVolumeUser").val(g_params.subRow.volumeBy);
		$("#caseTestVolumeDate").val($.date.dateFormat(g_params.subRow.checkDate, "yyyy-MM-dd"));
		$("#caseTestVolumeUser").val(g_params.subRow.checkBy);
		$("#caseSaveVolumeDate").val($.date.dateFormat(g_params.subRow.fileDate, "yyyy-MM-dd"));
		$("#caseSaveVolumeNum").val(g_params.subRow.fileNumber);
		$("#caseSaveLimitDate").val($.date.dateFormat(g_params.subRow.storageLimit,"yyyy-MM-dd"));
		$("#totalNum").val(g_params.subRow.totalNum);
		$("#totalPage").val(g_params.subRow.totalPage);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		
		$('#tdCaseName').text($.utils.getNotNullVal(g_params.subRow.name));
		$('#tdCaseBeginVolumeDate').text($.date.dateFormat(g_params.subRow.volumeDate, "yyyy-MM-dd"));
		$('#tdCaseVolumeUser').text($.utils.getNotNullVal(g_params.subRow.volumeBy));
		$('#tdCaseTestVolumeDate').text($.date.dateFormat(g_params.subRow.checkDate, "yyyy-MM-dd"));
		$('#tdCaseTestVolumeUser').text($.utils.getNotNullVal(g_params.subRow.checkBy));
		$('#tdCaseSaveVolumeDate').text($.date.dateFormat(g_params.subRow.fileDate, "yyyy-MM-dd"));
		$('#tdCaseSaveVolumeNum').text($.utils.getNotNullVal(g_params.subRow.fileNumber));
		$('#tdCaseSaveLimitDate').text($.date.dateFormat(g_params.subRow.storageLimit, "yyyy-MM-dd"));
		$('#tdTotalNum').text($.utils.getNotNullVal(g_params.subRow.totalNum));
		$('#tdTotalPage').text($.utils.getNotNullVal(g_params.subRow.totalPage));
	}
	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/case-volume-pre.html', params, function(){});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//预览
	$("#btnPreview").click(function () {
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/case-volume-pre.html', params, function(){});	
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	caseName: {required: true},
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
        		submitAction();
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCaseVolume?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCaseVolume?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["name"] = $("#caseName").val();
	submitData["penalizedPerson"] = $("#tdBePunishUser").text();
	submitData["institution"] = $("#tdHandleOrg").text();
	submitData["operator"] = $("#tdHandleUser").text();
	submitData["filingDate"] = $("#tdCaseBeginDate").text();
	submitData["endDate"] = $("#tdCaseEndDate").text();
	submitData["volumeDate"] = $("#caseBeginVolumeDate").val();
	submitData["volumeBy"] = $("#caseVolumeUser").val();
	submitData["checkDate"] = $("#caseTestVolumeDate").val();
	submitData["checkBy"] = $("#caseTestVolumeUser").val();
	submitData["fileDate"] = $("#caseSaveVolumeDate").val();
	submitData["fileNumber"] = $("#caseSaveVolumeNum").val();
	submitData["storageLimit"] = $("#caseSaveLimitDate").val();
	submitData["totalNum"] = $("#totalNum").val();
	submitData["totalPage"] = $("#totalPage").val();
	
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
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.illegalContent = $('#tdIllegalContent').text();
	data.tdBePunishUser = $('#tdBePunishUser').text();
	data.tdHandleOrg = $('#tdHandleOrg').text();
	data.tdHandleUser = $('#tdHandleUser').text();
	data.caseBeginDate = $('#tdCaseBeginDate').text();
	data.caseEndDate = $('#tdCaseEndDate').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.caseName = $('#caseName').val();
		data.caseBeginVolumeDate = $('#caseBeginVolumeDate').val();
		data.caseVolumeUser = $('#caseVolumeUser').val();
		data.caseTestVolumeDate = $('#caseTestVolumeDate').val();
		data.caseTestVolumeUser = $('#caseTestVolumeUser').val();
		data.caseSaveVolumeDate = $('#caseSaveVolumeDate').val();
		data.caseSaveVolumeNum = $('#caseSaveVolumeNum').val();
		data.caseSaveLimitDate = $('#caseSaveLimitDate').val();
		data.totalNum = $('#totalNum').val();
		data.totalPage = $('#totalPage').val();
	}else{
		data.caseName = $('#tdCaseName').text();
		data.caseBeginVolumeDate = $('#tdCaseBeginVolumeDate').text();
		data.caseVolumeUser = $('#tdCaseVolumeUser').text();
		data.caseTestVolumeDate = $('#tdCaseTestVolumeDate').text();
		data.caseTestVolumeUser = $('#tdCaseTestVolumeUser').text();
		data.caseSaveVolumeDate = $('#tdCaseSaveVolumeDate').text();
		data.caseSaveVolumeNum = $('#tdCaseSaveVolumeNum').text();
		data.caseSaveLimitDate = $('#tdCaseSaveLimitDate').text();
		data.totalNum = $('#tdTotalNum').text();
		data.totalPage = $('#tdTotalPage').text();
	}
	return data;
}

