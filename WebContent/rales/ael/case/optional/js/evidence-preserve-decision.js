var g_params = {}, g_backUrl = null;
var g_codeType = "12", g_codeCurNum = "";
var g_tmpPreservationId = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	//实现日期联动
	$.date.initSearchDate('divDetainBegin', 'divDetainEnd');
	$.date.initSearchDate('divCloseUpBegin', 'divCloseUpEnd');
	$.date.initSearchDate('divSaveBegin', 'divSaveEnd');
	$('#divDetainDay').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divCloseUpDay').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	$('#divSaveDay').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});
	
	$('#tdIllegalContent').text(g_params.row.illegalContent);
	$('#tdCaseParties').text(g_params.row.parties);
	$('#tdDate').text($.date.dateFormat(g_params.row.occurrenceDate, "yyyy-MM-dd"));
	$('#tdAddress').text(g_params.row.address);

	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		//生成一个月日时分秒,作为临时ID,当取消的时候，则删除临时数据
		g_tmpPreservationId = parseInt($.date.dateFormat(new Date(), "MMddhhmmss"));
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$('#caseRulesCountry').val(g_params.subRow.caseRulesCountry);
		$("#caseClauseCountry").val(g_params.subRow.caseClauseCountry);
		$("#caseRulesProvince").val(g_params.subRow.caseRulesProvince);
		$("#caseClauseProvince").val(g_params.subRow.caseClauseProvince);
		$("#rules").val(g_params.subRow.content);
		$("#detainDay").val(g_params.subRow.detainNumber);
		$("#detainBegin").val($.date.dateFormat(g_params.subRow.detainBeginDate, "yyyy-MM-dd"));
		$("#detainEnd").val($.date.dateFormat(g_params.subRow.detainEndDate, "yyyy-MM-dd"));
		$("#closeUpDay").val(g_params.subRow.sealNumber);
		$("#closeUpBegin").val($.date.dateFormat(g_params.subRow.sealBeginDate, "yyyy-MM-dd"));
		$("#closeUpEnd").val($.date.dateFormat(g_params.subRow.sealEndDate, "yyyy-MM-dd"));
		$("#saveDay").val(g_params.subRow.saveNumber);
		$("#saveBegin").val($.date.dateFormat(g_params.subRow.saveBeginDate, "yyyy-MM-dd"));
		$("#saveEnd").val($.date.dateFormat(g_params.subRow.saveEndDate, "yyyy-MM-dd"));
		$("input[name=radioHandleType][value=" + g_params.subRow.handleType + "]").attr("checked",true);
		$("#saveAddress").val(g_params.subRow.saveAddress);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#tableMaterialsListTr1').remove();
		$('#content-top-print').css('right', '26%');
		
		$('#tdCaseRulesCountry').text($.utils.getNotNullVal(g_params.subRow.caseRulesCountry));
		$('#tdCaseClauseCountry').text($.utils.getNotNullVal(g_params.subRow.caseClauseCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_params.subRow.caseRulesProvince));
		$('#tdCaseClauseProvince').text($.utils.getNotNullVal(g_params.subRow.caseClauseProvince));
		$('#tdRules').text($.utils.getNotNullVal(g_params.subRow.content));
		$('#tdDetainDay').text($.utils.getNotNullVal(g_params.subRow.detainNumber));
		$('#tdDetainBegin').text($.date.dateFormat(g_params.subRow.detainBeginDate, "yyyy-MM-dd"));
		$('#tdDetainEnd').text($.date.dateFormat(g_params.subRow.detainEndDate, "yyyy-MM-dd"));
		$('#tdCloseUpDay').text($.utils.getNotNullVal(g_params.subRow.sealNumber));
		$('#tdCloseUpBegin').text($.date.dateFormat(g_params.subRow.sealBeginDate, "yyyy-MM-dd"));
		$('#tdCloseUpEnd').text($.date.dateFormat(g_params.subRow.sealEndDate, "yyyy-MM-dd"));
		$('#tdSaveDay').text($.utils.getNotNullVal(g_params.subRow.saveNumber));
		$('#tdSaveBegin').text($.date.dateFormat(g_params.subRow.saveBeginDate, "yyyy-MM-dd"));
		$('#tdSaveEnd').text($.date.dateFormat(g_params.subRow.saveEndDate, "yyyy-MM-dd"));
		$('#tdSaveAddress').text($.utils.getNotNullVal(g_params.subRow.saveAddress));
		$("input[name=radioHandleType][value=" + g_params.subRow.handleType + "]").attr("checked",true);
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);
	}

	$("input[name='radioHandleType']").bind("click",function(){  
		loadRadioStatus();
	}); 
	loadRadioStatus();
	
	//清单查询
	$("#btnObjectList").click(function () {
		var params = {};
		params.registerId = g_params.row.id;
		if(g_params.type == 1) {
			params.preservationId = g_tmpPreservationId;
		}else {
			params.preservationId = g_params.subRow.id;
		}
		
		if(g_params.type == 3) params.isEdit = false;
		else params.isEdit = true;
		top.app.layer.editLayer('物品清单', ['900px', '600px'], '/rales/ael/case/optional/evidence-preserve-decision-goods.html', params, function(){
   			//重新加载列表
//			$table.bootstrapTable('refresh');
		});
    });

	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/evidence-preserve-decision-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/evidence-preserve-decision-pre.html', params, function(){});
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
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/evidence-preserve-decision-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		//删除临时创建的证据清单
		if(g_params.type == 1 && g_tmpPreservationId != null && g_tmpPreservationId != undefined) {
			top.app.message.loading();
			$.ajax({
				url: top.app.conf.url.apigateway + "/api/rales/ael/case/delEvidenceGoodsByPreservationId?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: g_tmpPreservationId + "",
				contentType: "application/json",
				success: function(data){
					top.app.message.loadingClose();
					top.app.info.iframe.params = g_params;
					var pid = $.utils.getUrlParam(window.location.search,"_pid");
					window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
		        }
			});
		}else{
			top.app.info.iframe.params = g_params;
			var pid = $.utils.getUrlParam(window.location.search,"_pid");
			window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
		}
    });
}

function loadRadioStatus(){
	if($('#tdHandleType input:radio:checked').val() == '1'){
		$("#divHandleType1-1").css('display', '');
		$("#divHandleType1-2").css('display', '');
		$("#divHandleType2-1").css('display', 'none');
		$("#divHandleType2-2").css('display', 'none');
		$("#divHandleType3-1").css('display', 'none');
		$("#divHandleType3-2").css('display', 'none');
		$("#divHandleType3-3").css('display', 'none');
	}else if($('#tdHandleType input:radio:checked').val() == '2'){
		$("#divHandleType1-1").css('display', 'none');
		$("#divHandleType1-2").css('display', 'none');
		$("#divHandleType2-1").css('display', '');
		$("#divHandleType2-2").css('display', '');
		$("#divHandleType3-1").css('display', 'none');
		$("#divHandleType3-2").css('display', 'none');
		$("#divHandleType3-3").css('display', 'none');
	}else{
		$("#divHandleType1-1").css('display', 'none');
		$("#divHandleType1-2").css('display', 'none');
		$("#divHandleType2-1").css('display', 'none');
		$("#divHandleType2-2").css('display', 'none');
		$("#divHandleType3-1").css('display', '');
		$("#divHandleType3-2").css('display', '');
		$("#divHandleType3-3").css('display', '');
	}
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
	data.date = $('#tdDate').text();
	data.address = $('#tdAddress').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.caseRulesCountry = $('#caseRulesCountry').val();
		data.caseClauseCountry = $('#caseClauseCountry').val();
		data.caseRulesProvince = $('#caseRulesProvince').val();
		data.caseClauseProvince = $('#caseClauseProvince').val();
		data.rules = $('#rules').val();
		data.detainDay = $('#detainDay').val();
		data.detainBegin = $('#detainBegin').val();
		data.detainEnd = $('#detainEnd').val();
		data.closeUpDay = $('#closeUpDay').val();
		data.closeUpBegin = $('#closeUpBegin').val();
		data.closeUpEnd = $('#closeUpEnd').val();
		data.saveDay = $('#saveDay').val();
		data.saveBegin = $('#saveBegin').val();
		data.saveEnd = $('#saveEnd').val();
		data.saveAddress = $('#saveAddress').val();
	}else{
		data.caseRulesCountry = $('#tdCaseRulesCountry').text();
		data.caseClauseCountry = $('#tdCaseClauseCountry').text();
		data.caseRulesProvince = $('#tdCaseRulesProvince').text();
		data.caseClauseProvince = $('#tdCaseClauseProvince').text();
		data.rules = $('#tdRules').text();
		data.detainDay = $('#tdDetainDay').text();
		data.detainBegin = $('#tdDetainBegin').text();
		data.detainEnd = $('#tdDetainEnd').text();
		data.closeUpDay = $('#tdCloseUpDay').text();
		data.closeUpBegin = $('#tdCloseUpBegin').text();
		data.closeUpEnd = $('#tdCloseUpEnd').text();
		data.saveDay = $('#tdSaveDay').text();
		data.saveBegin = $('#tdSaveBegin').text();
		data.saveEnd = $('#tdSaveEnd').text();
		data.saveAddress = $('#tdSaveAddress').text();
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
    		caseClauseCountry: {required: true},
    		caseRulesProvince: {required: true},
    		caseClauseProvince: {required: true},
    		rules: {required: true},
    		saveAddress: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editEvidencePreserveDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addEvidencePreserveDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["parties"] = $('#tdCaseParties').text();
	submitData["address"] = $('#tdAddress').text();
	submitData["occurrenceDate"] = $('#tdDate').text();
	
	submitData["caseRulesCountry"] = $('#caseRulesCountry').val();
	submitData["caseClauseCountry"] = $("#caseClauseCountry").val();
	submitData["caseRulesProvince"] = $("#caseRulesProvince").val();
	submitData["caseClauseProvince"] = $("#caseClauseProvince").val();
	submitData["content"] = $("#rules").val();
	var handleType = $('#tdHandleType input:radio:checked').val();
	submitData["handleType"] = handleType;
	if(handleType == '1'){
		submitData["detainNumber"] = $("#detainDay").val();
		submitData["detainBeginDate"] = $("#detainBegin").val();
		submitData["detainEndDate"] = $("#detainEnd").val();
	}else if(handleType == "2"){
		submitData["sealNumber"] = $("#closeUpDay").val();
		submitData["sealBeginDate"] = $("#closeUpBegin").val();
		submitData["sealEndDate"] = $("#closeUpEnd").val();
	}else if(handleType == "3"){
		submitData["saveNumber"] = $("#saveDay").val();
		submitData["saveBeginDate"] = $("#saveBegin").val();
		submitData["saveEndDate"] = $("#saveEnd").val();
		submitData["saveAddress"] = $("#saveAddress").val();
	}
	
	//获取临时ID，需要更新
	if(g_tmpPreservationId != null && g_tmpPreservationId != undefined) submitData["tmpPreservationId"] = g_tmpPreservationId;
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
