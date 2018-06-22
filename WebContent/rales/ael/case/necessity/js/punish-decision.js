var g_params = {}, g_backUrl = null;
var g_actionTypeDict = "", g_implementTypeDict = "";
var g_codeType = "25", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_actionTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_ACTION_TYPE');
	g_implementTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_IMPLTYPE');
	top.app.addCheckBoxButton($("#divActionType"), g_actionTypeDict, 'checkboxActionType');
	top.app.addCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'checkboxImplementType');
	$('#divPerformDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divPunishDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	//获取立案审批信息
	$('#tdCaseParties').text(g_params.row.parties);
	$('#tdCaseDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#tdCaseAddress').text(g_params.row.address);

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

		$('#caseRulesCountry').val(g_params.subRow.caseRulesCountry);
		$("#caseRulesProvince").val(g_params.subRow.caseRulesProvince);
		$("#violateRules").val(g_params.subRow.otherGist);
		$("#rules").val(g_params.subRow.orderGdStrip);

		top.app.addCheckBoxButton($("#divActionType"), g_actionTypeDict, 'checkboxActionType', g_params.subRow.actionType);
		top.app.addCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'implType', g_params.subRow.implType);
		
		$("#otherAction").val(g_params.subRow.otherMemo);
		$("#confiscateDevice").val(g_params.subRow.confiscateEquipmentNum);
		$("#confiscateIncome").val(g_params.subRow.confiscateIllegality);
		$("#fine").val(g_params.subRow.fine);
		$("#revoke").val(g_params.subRow.revokeNum);
		$("#performDate").val(g_params.subRow.carryDate);
		$("#punishDate").val(g_params.subRow.endDate);
		$("#punishAddress").val(g_params.subRow.fineAddress);
		$("#officeAddress").val(g_params.subRow.businessAddress);
		$("#officePhone").val(g_params.subRow.businessPhone);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		
		$('#tdCaseRulesCountry').text($.utils.getNotNullVal(g_params.subRow.caseRulesCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_params.subRow.caseRulesProvince));
		$('#tdViolateRules').text($.utils.getNotNullVal(g_params.subRow.otherGist));
		$('#tdRules').text($.utils.getNotNullVal(g_params.subRow.orderGdStrip));
		top.app.addCheckBoxButton($("#divActionType"), g_actionTypeDict, 'checkboxActionType', g_params.subRow.actionType);
		top.app.addCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'implType', g_params.subRow.implType);
		$('#tdOtherAction').text($.utils.getNotNullVal(g_params.subRow.otherMemo));
		$('#tdConfiscateDevice').text($.utils.getNotNullVal(g_params.subRow.confiscateEquipmentNum));
		$('#tdConfiscateIncome').text($.utils.getNotNullVal(g_params.subRow.confiscateIllegality));
		$('#tdFine').text($.utils.getNotNullVal(g_params.subRow.fine));
		$('#tdRevoke').text($.utils.getNotNullVal(g_params.subRow.revokeNum));
		$('#tdPerformDate').text($.date.dateFormat(g_params.subRow.carryDate, "yyyy-MM-dd"));
		$('#tdPunishDate').text($.date.dateFormat(g_params.subRow.endDate, "yyyy-MM-dd"));
		$('#tdPunishAddress').text($.utils.getNotNullVal(g_params.subRow.fineAddress));
		$('#tdOfficeAddress').text($.utils.getNotNullVal(g_params.subRow.businessAddress));
		$('#tdOfficePhone').text($.utils.getNotNullVal(g_params.subRow.businessPhone));
	}
	
	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.actionTypeDict = g_actionTypeDict;
			params.implementTypeDict = g_implementTypeDict;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/punish-decision-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.actionTypeDict = g_actionTypeDict;
			params.implementTypeDict = g_implementTypeDict;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/punish-decision-pre.html', params, function(){});
		});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.actionTypeDict = g_actionTypeDict;
		params.implementTypeDict = g_implementTypeDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/punish-decision-pre.html', params, function(){});
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
        	caseRulesCountry: {required: true},
        	caseRulesProvince: {required: true},
        	violateRules: {required: true},
        	rules: {required: true},
        	punishAddress: {required: true},
        	officeAddress: {required: true},
        	officePhone: {required: true, isMobile: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editPunishDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addPunishDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;

	submitData["parties"] = $('#tdCaseParties').text();
	submitData["address"] = $('#tdCaseAddress').text();
	submitData["recordDate"] = $('#tdCaseDate').text();
	
	submitData["caseRulesCountry"] = $('#caseRulesCountry').val();
	submitData["caseRulesProvince"] = $("#caseRulesProvince").val();
	submitData["otherGist"] = $("#violateRules").val();
	submitData["orderGdStrip"] = $("#rules").val();
	submitData["actionType"] = top.app.getCheckBoxButton($("#divActionType"), g_actionTypeDict, 'checkboxActionType');
	submitData["implType"] = top.app.getCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'implType');
	submitData["otherMemo"] = $("#otherAction").val();
	submitData["confiscateEquipmentNum"] = $("#confiscateDevice").val();
	submitData["confiscateIllegality"] = $("#confiscateIncome").val();
	submitData["fine"] = $("#fine").val();
	submitData["revokeNum"] = $("#revoke").val();
	submitData["carryDate"] = $("#performDate").val();
	submitData["endDate"] = $("#punishDate").val();
	submitData["fineAddress"] = $("#punishAddress").val();
	submitData["businessAddress"] = $("#officeAddress").val();
	submitData["businessPhone"] = $("#officePhone").val();
	
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

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.caseParties = $('#tdCaseParties').text();
	data.caseDate = $('#tdCaseDate').text();
	data.caseAddress = $('#tdCaseAddress').text();
	data.actionType = top.app.getCheckBoxButton($("#divActionType"), g_actionTypeDict, 'checkboxActionType');
	data.implType = top.app.getCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'checkboxImplementType');
	
	if(g_params.type == 1 || g_params.type == 2){
		data.caseRulesCountry = $('#caseRulesCountry').val();
		data.caseRulesProvince = $('#caseRulesProvince').val();
		data.violateRules = $('#violateRules').val();
		data.rules = $('#rules').val();
		data.otherMemo = $('#otherAction').val();
		data.confiscateEquipmentNum = $('#confiscateDevice').val();
		data.confiscateIllegality = $('#confiscateIncome').val();
		data.fine = $('#fine').val();
		data.revokeNum = $('#revoke').val();
		data.performDate = $('#performDate').val();
		data.punishDate = $('#punishDate').val();
		data.punishAddress = $('#punishAddress').val();
		data.officeAddress = $('#officeAddress').val();
		data.officePhone = $('#officePhone').val();
	}else{
		data.caseRulesCountry = $('#tdCaseRulesCountry').text();
		data.caseRulesProvince = $('#tdCaseRulesProvince').text();
		data.violateRules = $('#tdViolateRules').text();
		data.rules = $('#tdRules').text();
		data.otherMemo = $('#tdOtherAction').text();
		data.confiscateEquipmentNum = $('#tdConfiscateDevice').text();
		data.confiscateIllegality = $('#tdConfiscateIncome').text();
		data.fine = $('#tdFine').text();
		data.revokeNum = $('#tdRevoke').text();
		data.performDate = $('#tdPerformDate').text();
		data.punishDate = $('#tdPunishDate').text();
		data.punishAddress = $('#tdPunishAddress').text();
		data.officeAddress = $('#tdOfficeAddress').text();
		data.officePhone = $('#tdOfficePhone').text();
	}
	return data;
}

