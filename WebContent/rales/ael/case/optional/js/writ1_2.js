var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional1_2, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
var g_askListIndex = 1;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	$.date.initSearchDate('divCheckDateBegin', 'divCheckDateEnd', "YYYY-MM-DD HH:mm");
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict, true, ' ');;
	rales.getLawUserKeyVal($("#lawUser1"), true, ' ');
	rales.getLawUserKeyVal($("#lawUser2"), true, ' ');

	//公民选择
	$('input[type=checkbox][id=personType1]').change(function() { 
		$("#personType1").attr("checked",true);
		$("#personType2").attr("checked",false);
	});
	$('input[type=checkbox][id=personType2]').change(function() { 
		$("#personType2").attr("checked",true);
		$("#personType1").attr("checked",false);
	});
	
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
			
			if(g_params.subRow.content.personType == '1') $("#personType1").attr("checked",true);
			else $("#personType2").attr("checked",true);
			
			$('#checkDateBegin').val(g_params.subRow.content.checkDateBegin);
			$('#checkDateEnd').val(g_params.subRow.content.checkDateEnd);
			$('#checkAddr').val(g_params.subRow.content.checkAddr);
			$('#checkContent').val(g_params.subRow.content.checkContent);
			$('#companyName').val(g_params.subRow.content.companyName);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#companyAddr').val(g_params.subRow.content.companyAddr);
			$('#companyCreditCode').val(g_params.subRow.content.companyCreditCode);
			$('#companyPhone').val(g_params.subRow.content.companyPhone);
			$('#companyPrincipal').val(g_params.subRow.content.companyPrincipal);
			$('#companyCurUser').val(g_params.subRow.content.companyCurUser);
			$('#companyIdCard').val(g_params.subRow.content.companyIdCard);
			$('#companyPost').val(g_params.subRow.content.companyPost);
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesJob').val(g_params.subRow.content.partiesJob);
			$('#partiesIdCard').val(g_params.subRow.content.partiesIdCard);
			$('#partiesUnit').val(g_params.subRow.content.partiesUnit);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesZip').val(g_params.subRow.content.partiesZip);
			$('#lawOffice').val(g_params.subRow.content.lawOffice);
			$('#lawUser1').val(g_params.subRow.content.lawUser1);
			$('#lawUser2').val(g_params.subRow.content.lawUser2);
			$('#lawUserCardNo1').val(g_params.subRow.content.lawUserCardNo1);
			$('#lawUserCardNo2').val(g_params.subRow.content.lawUserCardNo2);
			$('#noticeUser').val(g_params.subRow.content.noticeUser);
			
			if(!$.utils.isEmpty(g_params.subRow.content.noticeAnswer))
				$("input[type='radio'][name=noticeAnswer][value=" + g_params.subRow.content.noticeAnswer + "]").attr("checked",true);
			$('#checkDetail').val(g_params.subRow.content.checkDetail);
			$('#inquiryQuestion').val(g_params.subRow.content.inquiryQuestion);
			$('#inquiryAnswer').val(g_params.subRow.content.inquiryAnswer);
			$('#rule1').val(g_params.subRow.content.rule1);
			$('#rule2').val(g_params.subRow.content.rule2);
			$('#rule3').val(g_params.subRow.content.rule3);
			$('#rule4').val(g_params.subRow.content.rule4);
			$('#ruleAnswer').val(g_params.subRow.content.ruleAnswer);
			//1111111111111111111111111
			$('#enclosure').val(g_params.subRow.content.enclosure);
			//11111111111111111111111111111111
			if(g_params.subRow.content.selectEnclosure == '1') $("#selectEnclosure").attr("checked",true);
			if(g_params.subRow.content.selectUser1 == '1') $("#selectUser1").attr("checked",true);
			if(g_params.subRow.content.selectUser2 == '1') $("#selectUser2").attr("checked",true);
			
			$('.selectpicker').selectpicker('refresh');
			
			if(!$.utils.isEmpty(g_params.subRow.content.askList)){
				var askList = eval("(" + g_params.subRow.content.askList + ")");
				for(var index = 0; index < askList.length; index++){
					$('#tbodyAskList').append('<tr id="trQuestion' + g_askListIndex + '">' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion' +  g_askListIndex + '" colspan="3">' + 
								'<textarea id="inquiryQuestion' +  g_askListIndex + '" name="inquiryQuestion' +  g_askListIndex + '" class="form-control" style="height:120px">' + askList[index].inquiryQuestion + '</textarea>' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;">' + 
								'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(' + g_askListIndex + ')">删 除</button>' + 
							'</td>' + 
						'</tr>' + 
						'<tr id="trAnswer' + g_askListIndex + '">' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer' +  g_askListIndex + '" colspan="3">' + 
								'<textarea id="inquiryAnswer' +  g_askListIndex + '" name="inquiryAnswer' +  g_askListIndex + '" class="form-control" style="height:120px">' + askList[index].inquiryAnswer + '</textarea>' + 
							'</td>' + 
						'</tr>')
						g_askListIndex++;
				}
			}
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
			
			if(g_params.subRow.content.personType == '1') $("#personType1").attr("checked",true);
			else $("#personType2").attr("checked",true);
			
			$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.subRow.content.checkDateBegin));
			$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.subRow.content.checkDateEnd));
			$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.subRow.content.checkAddr));
			$('#tdCheckContent').text($.utils.getNotNullVal(g_params.subRow.content.checkContent));
			$('#tdCompanyName').text($.utils.getNotNullVal(g_params.subRow.content.companyName));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.subRow.content.companyAddr));
			$('#tdCompanyCreditCode').text($.utils.getNotNullVal(g_params.subRow.content.companyCreditCode));
			$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.subRow.content.companyPhone));
			$('#tdCompanyPrincipal').text($.utils.getNotNullVal(g_params.subRow.content.companyPrincipal));
			$('#tdCompanyCurUser').text($.utils.getNotNullVal(g_params.subRow.content.companyCurUser));
			$('#tdCompanyIdCard').text($.utils.getNotNullVal(g_params.subRow.content.companyIdCard));
			$('#tdCompanyPost').text($.utils.getNotNullVal(g_params.subRow.content.companyPost));
			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.subRow.content.partiesJob));
			$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.subRow.content.partiesIdCard));
			$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.subRow.content.partiesUnit));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.subRow.content.partiesZip));
			$('#tdLawOffice').text($.utils.getNotNullVal(g_params.subRow.content.lawOffice));
			$('#tdLawUser1').text($.utils.getNotNullVal(g_params.subRow.content.lawUser1));
			$('#tdLawUser2').text($.utils.getNotNullVal(g_params.subRow.content.lawUser2));
			$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.subRow.content.lawUserCardNo1));
			$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.subRow.content.lawUserCardNo2));
			$('#tdNoticeUser').text($.utils.getNotNullVal(g_params.subRow.content.noticeUser));
			
			if(!$.utils.isEmpty(g_params.subRow.content.noticeAnswer))
				$("input[type='radio'][name=noticeAnswer][value=" + g_params.subRow.content.noticeAnswer + "]").attr("checked",true);
			$('#tdCheckDetail').text($.utils.getNotNullVal(g_params.subRow.content.checkDetail));
			$('#tdInquiryQuestion').text($.utils.getNotNullVal(g_params.subRow.content.inquiryQuestion));
			$('#tdInquiryAnswer').text($.utils.getNotNullVal(g_params.subRow.content.inquiryAnswer));
			$('#tdRule1').text($.utils.getNotNullVal(g_params.subRow.content.rule1));
			$('#tdRule2').text($.utils.getNotNullVal(g_params.subRow.content.rule2));
			$('#tdRule3').text($.utils.getNotNullVal(g_params.subRow.content.rule3));
			$('#tdRule4').text($.utils.getNotNullVal(g_params.subRow.content.rule4));
			$('#tdRuleAnswer').text($.utils.getNotNullVal(g_params.subRow.content.ruleAnswer));
			//1111111111111111111
			$('#tdEnclosure').text($.utils.getNotNullVal(g_params.subRow.content.enclosure));
			//111111111111111
			if(g_params.subRow.content.selectEnclosure == '1') $("#selectEnclosure").attr("checked",true);
			if(g_params.subRow.content.selectUser1 == '1') $("#selectUser1").attr("checked",true);
			if(g_params.subRow.content.selectUser2 == '1') $("#selectUser2").attr("checked",true);
			
			
			if(!$.utils.isEmpty(g_params.subRow.content.askList)){
				var askList = eval("(" + g_params.subRow.content.askList + ")");
				for(var index = 0; index < askList.length; index++){
					$('#tbodyAskList').append('<tr id="trQuestion' + g_askListIndex + '">' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion' +  g_askListIndex + '" colspan="3">' + 
								askList[index].inquiryQuestion + 
							'</td>' + 
						'</tr>' + 
						'<tr id="trAnswer' + g_askListIndex + '">' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer' +  g_askListIndex + '" colspan="3">' + 
								askList[index].inquiryAnswer + 
							'</td>' + 
						'</tr>')
						g_askListIndex++;
				}
			}
		}

		//移除增加按钮
		$("#btnAddAsk").remove();
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
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_2.html', params, function(){});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_2.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
    });
	//新增
	$("#btnAddAsk").click(function () {
		$('#tbodyAskList').append('<tr id="trQuestion' + g_askListIndex + '">' + 
										'<td class="reference-td" style="width:100px;">' + 
										   	'问' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion' +  g_askListIndex + '" colspan="3">' + 
											'<textarea id="inquiryQuestion' +  g_askListIndex + '" name="inquiryQuestion' +  g_askListIndex + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;">' + 
											'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(' + g_askListIndex + ')">删 除</button>' + 
										'</td>' + 
									'</tr>' + 
									'<tr id="trAnswer' + g_askListIndex + '">' + 
										'<td class="reference-td">' + 
										   	'答' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryAnswer' +  g_askListIndex + '" colspan="3">' + 
											'<textarea id="inquiryAnswer' +  g_askListIndex + '" name="inquiryAnswer' +  g_askListIndex + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
									'</tr>')
		g_askListIndex++;
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

function removeQuestion(index){
	$('#trQuestion' + index).remove();
	$('#trAnswer' + index).remove();
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();

	var personType = '0'
	if($('#personType1').prop('checked')) personType = '1';
	if($('#personType2').prop('checked')) personType = '2';
	data.personType = personType;
	
	data.relevanceCodeList = g_relevanceCodeList;
	
	if(g_params.type == 1 || g_params.type == 2){		
		data.checkDateBegin = $('#checkDateBegin').val();
		data.checkDateEnd = $('#checkDateEnd').val();
		data.checkAddr = $('#checkAddr').val();
		data.checkContent = $('#checkContent').val();
		data.companyName = $('#companyName').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.companyAddr = $('#companyAddr').val();
		data.companyCreditCode = $('#companyCreditCode').val();
		data.companyPhone = $('#companyPhone').val();
		data.companyPrincipal = $('#companyPrincipal').val();
		data.companyCurUser = $('#companyCurUser').val();
		data.companyIdCard = $('#companyIdCard').val();
		data.companyPost = $('#companyPost').val();
		data.partiesName = $('#partiesName').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesJob = $('#partiesJob').val();
		data.partiesIdCard = $('#partiesIdCard').val();
		data.partiesUnit = $('#partiesUnit').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesZip = $('#partiesZip').val();
		data.lawOffice = $('#lawOffice').val();
		data.lawUser1 = $('#lawUser1').val();
		data.lawUser2 = $('#lawUser2').val();
		data.lawUserCardNo1 = $('#lawUserCardNo1').val();
		data.lawUserCardNo2 = $('#lawUserCardNo2').val();
		data.noticeUser = $('#noticeUser').val();
		data.noticeAnswer = $('#noticeAnswer').val();
		data.checkDetail = $('#checkDetail').val();
		data.inquiryQuestion = $('#inquiryQuestion').val();
		data.inquiryAnswer = $('#inquiryAnswer').val();
		data.rule1 = $('#rule1').val();
		data.rule2 = $('#rule2').val();
		data.rule3 = $('#rule3').val();
		data.rule4 = $('#rule4').val();
		data.ruleAnswer = $('#ruleAnswer').val();
		//1111111111111111111
		data.enclosure = $('#enclosure').val();
		if($('#selectUser1').prop('checked')) data.selectUser1 = '1';
		else data.selectUser1 = '0';
		if($('#selectUser2').prop('checked')) data.selectUser2 = '1';
		else data.selectUser2 = '0';
		//1111111111111111111111
		if($('#selectEnclosure').prop('checked')) data.selectEnclosure = '1';
		else data.selectEnclosure = '0';
		
		var askList = [];
		for(var i = 1; i < g_askListIndex;i++){
			var obj = {};
			obj.inquiryQuestion = $('#inquiryQuestion' + i).val();
			obj.inquiryAnswer = $('#inquiryAnswer' + i).val();
			if(!$.utils.isEmpty(obj.inquiryQuestion) && !$.utils.isEmpty(obj.inquiryAnswer)){
				askList.push(obj)
			}
		}
		data.askList = JSON.stringify(askList);
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
//        	checkDateBegin: {required: true},
//        	checkDateEnd: {required: true},
//        	checkAddr: {required: true},
//        	checkContent: {required: true},
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