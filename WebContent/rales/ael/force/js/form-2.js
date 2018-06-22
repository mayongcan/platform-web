var g_params = {}, g_backUrl = null, g_dataInfo = [], g_type = 1;
var g_codeType = "12", g_codeCurNum = "";
var g_tmpPreservationId = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	g_type = g_params.type;
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
	
	if(g_params.row != null && g_params.row != undefined && g_params.row.id != null && g_params.row.id != undefined)
		g_dataInfo = rales.getEvidencePreserveDecision(g_params.row.id);
	//如果发现内容为空，则设置为新增
	if($.utils.isEmpty(g_dataInfo.code)) {
		//如果是查看，则不用设置为新增
		if(g_type != 3) g_type = 1;
	}
	
	//1新增 2编辑 3查看
	if(g_type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		//生成一个月日时分秒,作为临时ID,当取消的时候，则删除临时数据
		g_tmpPreservationId = parseInt($.date.dateFormat(new Date(), "MMddhhmmss"));
		fileupload.initFileNewSelector('files');
	}else if(g_type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#content-right').remove();
		
		$('#caseRulesCountry').val(g_dataInfo.caseRulesCountry);
		$("#caseClauseCountry").val(g_dataInfo.caseClauseCountry);
		$("#caseRulesProvince").val(g_dataInfo.caseRulesProvince);
		$("#caseClauseProvince").val(g_dataInfo.caseClauseProvince);
		$("#rules").val(g_dataInfo.content);
		$("#detainDay").val(g_dataInfo.detainNumber);
		$("#detainBegin").val($.date.dateFormat(g_dataInfo.detainBeginDate, "yyyy-MM-dd"));
		$("#detainEnd").val($.date.dateFormat(g_dataInfo.detainEndDate, "yyyy-MM-dd"));
		$("#closeUpDay").val(g_dataInfo.sealNumber);
		$("#closeUpBegin").val($.date.dateFormat(g_dataInfo.sealBeginDate, "yyyy-MM-dd"));
		$("#closeUpEnd").val($.date.dateFormat(g_dataInfo.sealEndDate, "yyyy-MM-dd"));
		$("#saveDay").val(g_dataInfo.saveNumber);
		$("#saveBegin").val($.date.dateFormat(g_dataInfo.saveBeginDate, "yyyy-MM-dd"));
		$("#saveEnd").val($.date.dateFormat(g_dataInfo.saveEndDate, "yyyy-MM-dd"));
		$("#saveAddress").val(g_dataInfo.saveAddress);
		$("input[name=radioHandleType][value=" + g_dataInfo.handleType + "]").attr("checked",true);
		fileupload.initFileEditSelector('files', g_dataInfo.files);
	}else if(g_type == 3){
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnSave").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#tableMaterialsListTr1').remove();
		$('#content-top-print').css('right', '26%');
		
		$('#tdCaseRulesCountry').text($.utils.getNotNullVal(g_dataInfo.caseRulesCountry));
		$('#tdCaseClauseCountry').text($.utils.getNotNullVal(g_dataInfo.caseClauseCountry));
		$('#tdCaseRulesProvince').text($.utils.getNotNullVal(g_dataInfo.caseRulesProvince));
		$('#tdCaseClauseProvince').text($.utils.getNotNullVal(g_dataInfo.caseClauseProvince));
		$('#tdRules').text($.utils.getNotNullVal(g_dataInfo.content));
		$('#tdDetainDay').text($.utils.getNotNullVal(g_dataInfo.detainNumber));
		$('#tdDetainBegin').text($.date.dateFormat(g_dataInfo.detainBeginDate, "yyyy-MM-dd"));
		$('#tdDetainEnd').text($.date.dateFormat(g_dataInfo.detainEndDate, "yyyy-MM-dd"));
		$('#tdCloseUpDay').text($.utils.getNotNullVal(g_dataInfo.sealNumber));
		$('#tdCloseUpBegin').text($.date.dateFormat(g_dataInfo.sealBeginDate, "yyyy-MM-dd"));
		$('#tdCloseUpEnd').text($.date.dateFormat(g_dataInfo.sealEndDate, "yyyy-MM-dd"));
		$('#tdSaveDay').text($.utils.getNotNullVal(g_dataInfo.saveNumber));
		$('#tdSaveBegin').text($.date.dateFormat(g_dataInfo.saveBeginDate, "yyyy-MM-dd"));
		$('#tdSaveEnd').text($.date.dateFormat(g_dataInfo.saveEndDate, "yyyy-MM-dd"));
		$('#tdSaveAddress').text($.utils.getNotNullVal(g_dataInfo.saveAddress));
		$("input[name=radioHandleType][value=" + g_dataInfo.handleType + "]").attr("checked",true);
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_dataInfo.files);
		rales.initCodeRelevance(g_dataInfo.relevanceId);
	}

	$("input[name='radioHandleType']").bind("click",function(){  
		loadRadioStatus();
	}); 
	loadRadioStatus();
	
	//清单查看
	$("#btnObjectList").click(function () {
		var params = {};
		params.registerId = g_params.row.id;
		if(g_type == 1) {
			params.preservationId = g_tmpPreservationId;
		}else {
			params.preservationId = g_dataInfo.id;
		}
		
		if(g_type == 3) params.isEdit = false;
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
	//保存
	$("#btnSave").click(function () {
		if(g_params.row == null || g_params.row == undefined || g_params.row.id == null || g_params.row.id == undefined){
   			top.app.message.notice("请先保存证据保全措施审批表！");
   			return;
		}
		$("form").submit();
    });
	//提交
	$("#btnOK").click(function () {
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
		if(g_type == 1 && g_tmpPreservationId != null && g_tmpPreservationId != undefined) {
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
	if(g_type == 1 || g_type == 2){
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
	if(g_type == 2){
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editEvidencePreserveDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_dataInfo.id;
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
				parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
