var g_params = {}, g_backUrl = null;
var g_opearTypeDict = "", g_implementTypeDict = "";
var g_codeType = "17", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_opearTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_TYPE');
	g_implementTypeDict = top.app.getDictDataByDictTypeValue('AEL_PUNISH_IMPLTYPE');
	top.app.addCheckBoxButton($("#divOpearType"), g_opearTypeDict, 'checkboxOpearType');
	top.app.addCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'checkboxImplementType');

	$('#tdCaseParties').text($.utils.getNotNullVal(g_params.row.parties));
	$('#tdIllegalContent').text($.utils.getNotNullVal(g_params.row.illegalContent));
	$('#tdCaseDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#tdCaseAddress').text(g_params.row.address);
	$('#lawExecutor1').text(g_params.row.createUserName);
	$('#lawExecutor2').text(g_params.row.associateUserName);

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

		top.app.addCheckBoxButton($("#divOpearType"), g_opearTypeDict, 'checkboxOpearType', g_params.subRow.type);
		top.app.addCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'implType', g_params.subRow.implType);
		
		$("#otherObtainEvidence").val(g_params.subRow.otherExplain);
		$("#rules").val(g_params.subRow.strip);
		$("#confiscateDevice").val(g_params.subRow.confiscateEquipmentNum);
		$("#confiscateIncome").val(g_params.subRow.confiscateIllegality);
		$("#fine").val(g_params.subRow.fine);
		$("#revoke").val(g_params.subRow.revokeNum);
		$("#address").val(g_params.subRow.lawAddress);
		$("#contacterName").val(g_params.subRow.lawContact);
		$("#contacterPhone").val(g_params.subRow.lawPhone);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
//		$('#content-left').addClass('box-view-float-left');
//		$('#content-top-print').css('right', '26%');
		
		$('#tdCaseRulesCountry').text($.utils.getNotNullVal(g_params.subRow.caseRulesCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_params.subRow.caseRulesProvince));
		top.app.addCheckBoxButton($("#divOpearType"), g_opearTypeDict, 'checkboxOpearType', g_params.subRow.type);
		top.app.addCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'implType', g_params.subRow.implType);
		
		$('#tdOtherObtainEvidence').text($.utils.getNotNullVal(g_params.subRow.otherExplain));
		$('#tdRules').text($.utils.getNotNullVal(g_params.subRow.strip));
		$('#tdConfiscateDevice').text($.utils.getNotNullVal(g_params.subRow.confiscateEquipmentNum));
		$('#tdConfiscateIncome').text($.utils.getNotNullVal(g_params.subRow.confiscateIllegality));
		$('#tdFine').text($.utils.getNotNullVal(g_params.subRow.fine));
		$('#tdRevoke').text($.utils.getNotNullVal(g_params.subRow.revokeNum));
		$('#tdAddress').text($.utils.getNotNullVal(g_params.subRow.lawAddress));
		$('#tdContacterName').text($.utils.getNotNullVal(g_params.subRow.lawContact));
		$('#tdContacterPhone').text($.utils.getNotNullVal(g_params.subRow.lawPhone));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}
	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.opearTypeDict = g_opearTypeDict;
			params.implementTypeDict = g_implementTypeDict;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/punish-notice-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.opearTypeDict = g_opearTypeDict;
			params.implementTypeDict = g_implementTypeDict;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/punish-notice-pre.html', params, function(){});
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
		params.opearTypeDict = g_opearTypeDict;
		params.implementTypeDict = g_implementTypeDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/punish-notice-pre.html', params, function(){});
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
	data.caseDate = $('#tdCaseDate').text();
	data.caseAddress = $('#tdCaseAddress').text();
	data.illegalContent = $('#tdIllegalContent').text();
	data.type = top.app.getCheckBoxButton($("#divOpearType"), g_opearTypeDict, 'checkboxOpearType');
	data.implType = top.app.getCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'checkboxImplementType');
	data.lawExecutor1 = $('#lawExecutor1').text();
	data.lawExecutor2 = $('#lawExecutor2').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.caseRulesCountry = $('#caseRulesCountry').val();
		data.caseRulesProvince = $('#caseRulesProvince').val();
		data.otherExplain = $('#otherObtainEvidence').val();
		data.rules = $('#rules').val();
		data.confiscateEquipmentNum = $('#confiscateDevice').val();
		data.confiscateIllegality = $('#confiscateIncome').val();
		data.fine = $('#fine').val();
		data.revokeNum = $('#revoke').val();
		data.address = $('#address').val();
		data.contacterName = $('#contacterName').val();
		data.contacterPhone = $('#contacterPhone').val();
	}else{
		data.caseRulesCountry = $('#tdCaseRulesCountry').text();
		data.caseRulesProvince = $('#tdCaseRulesProvince').text();
		data.otherExplain = $('#tdOtherObtainEvidence').text();
		data.rules = $('#tdRules').text();
		data.confiscateEquipmentNum = $('#tdConfiscateDevice').text();
		data.confiscateIllegality = $('#tdConfiscateIncome').text();
		data.fine = $('#tdFine').text();
		data.revokeNum = $('#tdRevoke').text();
		data.address = $('#tdAddress').text();
		data.contacterName = $('#tdContacterName').text();
		data.contacterPhone = $('#tdContacterPhone').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		caseRulesCountry: {required: true},
    		caseRulesProvince: {required: true},
    		address: {required: true},
    		contacterName: {required: true},
    		contacterPhone: {required: true, isMobile: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editPunishNotice?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addPunishNotice?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["tableType"] = "1";
	submitData["parties"] = $.utils.getNotNullVal(g_params.row.parties);
	submitData["illegalContent"] = $.utils.getNotNullVal(g_params.row.illegalContent);
	submitData["occurrenceDate"] = $.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd");
	submitData["address"] = g_params.row.address;
	submitData["caseRulesCountry"] = $('#caseRulesCountry').val();
	submitData["caseRulesProvince"] = $("#caseRulesProvince").val();
	submitData["type"] = top.app.getCheckBoxButton($("#divOpearType"), g_opearTypeDict, 'checkboxOpearType');
	submitData["implType"] = top.app.getCheckBoxButton($("#divImplementType"), g_implementTypeDict, 'implType');
	submitData["otherExplain"] = $("#otherObtainEvidence").val();
	submitData["strip"] = $("#rules").val();
	submitData["confiscateEquipmentNum"] = $("#confiscateDevice").val();
	submitData["confiscateIllegality"] = $("#confiscateIncome").val();
	submitData["fine"] = $("#fine").val();
	submitData["revokeNum"] = $("#revoke").val();
	submitData["lawAddress"] = $("#address").val();
	submitData["lawContact"] = $("#contacterName").val();
	submitData["lawPhone"] = $("#contacterPhone").val();
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