var g_params = {}, g_backUrl = null,g_inquiryReportProcedureDict = "";
var g_codeType = "16", g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_tmpReportId = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	g_inquiryReportProcedureDict = top.app.getDictDataByDictTypeValue('AEL_INQUIRY_REPORT_PROCEDURE');
	top.app.addComboBoxOption($("#inquiryReportProcedure"), g_inquiryReportProcedureDict);
	initView();
});

function initView(){
	$('#tdHandleSuggest').text(g_params.row.advice);
	
	//获取立案审批信息
	var filingInfo = rales.getCaseFilingInfo(g_params.row.id);
	$('#tdIllegalContent').text(filingInfo.illegalContent);
	$('#tdPartiesName').text(filingInfo.name);
	$('#tdPartiesCertificateNo').text(filingInfo.certificateNo);
	$('#tdPartiesCompany').text(filingInfo.company);
	$('#tdPartiesContacts').text(filingInfo.legalRepresentative);
	$('#tdPartiesAddress').text(filingInfo.address);
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		//生成一个月日时分秒,作为临时ID,当取消的时候，则删除临时数据
		g_tmpReportId = parseInt($.date.dateFormat(new Date(), "MMddhhmmss"));
		$('#tableMaterialsListTr2').remove();
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		$('#tableMaterialsListTr2').remove();
		
		$('#caseProcess').val(g_params.subRow.investigativeProcedure);
		$("#inquiryReportProcedure").val(g_params.subRow.inquiryReportProcedure);
		$("#memo").val(g_params.subRow.memo);
		
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
		$('#tableMaterialsListTr1').remove();
		
		$('#tdCaseProcess').text($.utils.getNotNullVal(g_params.subRow.investigativeProcedure));
		$("#tdInquiryReportProcedure").text(top.app.getDictName(g_params.subRow.inquiryReportProcedure, g_inquiryReportProcedureDict));
		$('#tdMemo').text($.utils.getNotNullVal(g_params.subRow.memo));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);
	
		//获取材料清单列表
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/case/getReportMaterialList",
		    method: 'GET',
		   	data:{
		   		access_token: top.app.cookies.getCookiesToken(),
		   		reportId: g_params.subRow.id,
		   		registerId: g_params.subRow.registerId,
		   	},
		   	success: function(data){
		   		if(top.app.message.code.success == data.RetCode){
		   			var html = "";
		   			$('#tableMaterialsList').empty();
		   			var length = (data.rows.length < 1) ? 1 : data.rows.length;
		   			for(var i = 0; i < length; i++){
		   				var borderBottom = "";
		   				if(i == length - 1) borderBottom = "border-bottom-width:0px;"
		   				if(data.rows[i] == null || data.rows == undefined){
		   					html += '<tr>' + 
										'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">　</td>' + 
										'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">　</td>' + 
										'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">　</td>' + 
									'</tr>';
		   				}else{
			   				html += '<tr>' + 
										'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">' + 
											data.rows[i].certificateName + 
										'</td>' + 
										'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">' + 
											data.rows[i].grade + 
										'</td>' + 
										'<td class="reference-td1" style="text-align: center;border-left-width:0px;' + borderBottom + '">' + 
											data.rows[i].totalCnt + 
										'</td>' + 
									'</tr>';
		   				}
		   			}
		   			$('#tableMaterialsList').append(html);
		   		}
		   		//设置右侧的高度和左侧一致
		   		$("#content-right").height($("#content-left").height());
		   	}
		});
	}
	
	//清单查询
	$("#btnListSearch").click(function () {
		var params = {};
		params.registerId = g_params.row.id;
		if(g_params.type == 1) {
			params.reportId = g_tmpReportId;
		}else {
			params.reportId = g_params.subRow.id;
		}
		top.app.layer.editLayer('材料清单', ['900px', '600px'], '/rales/ael/case/necessity/case-survey-report-materials.html', params, function(){
//   			重新加载列表
//			$table.bootstrapTable('refresh');
		});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		//删除临时创建的证据清单
		if(g_params.type == 1 && g_tmpReportId != null && g_tmpReportId != undefined) {
			top.app.message.loading();
			$.ajax({
				url: top.app.conf.url.apigateway + "/api/rales/ael/case/delReportMaterialByReport?access_token=" + top.app.cookies.getCookiesToken(),
			    method: 'POST',
				data: g_tmpReportId + "",
				contentType: "application/json",
				success: function(data){
					top.app.message.loadingClose();
					top.app.info.iframe.params = g_params;
					var pid = $.utils.getUrlParam(window.location.search,"_pid");
					window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
		        }
			});
		}else{
			top.app.info.iframe.params = g_params;
			var pid = $.utils.getUrlParam(window.location.search,"_pid");
			window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
		}
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
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	caseProcess: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCaseReport?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCaseReport?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();
	submitData["parties"] = $('#tdPartiesName').text();
	submitData["certificateNo"] = $('#tdPartiesCertificateNo').text();
	submitData["company"] = $('#tdPartiesCompany').text();
	submitData["legalRepresentative"] = $('#tdPartiesContacts').text();
	submitData["address"] = $('#tdPartiesAddress').text();
	
	submitData["investigativeProcedure"] = $('#caseProcess').val();
	submitData["inquiryReportProcedure"] = $("#inquiryReportProcedure").val();
	submitData["memo"] = $("#memo").val();
	//获取临时ID，需要更新
	if(g_tmpReportId != null && g_tmpReportId != undefined) submitData["tmpReportId"] = g_tmpReportId;
	
	submitData["relevanceId"] = g_relevanceIdList;
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
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
