var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional1_13, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
var g_askListIndex1 = 1, g_askListIndex2 = 1, g_askListIndex3 = 1;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	$.date.initSearchDate('divCheckDateBegin', 'divCheckDateEnd', "YYYY-MM-DD HH:mm");
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict, true, ' ');;
	
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
			
			$('#checkDateBegin').val(g_params.subRow.content.checkDateBegin);
			$('#checkDateEnd').val(g_params.subRow.content.checkDateEnd);
			$('#checkAddr').val(g_params.subRow.content.checkAddr);
			$('#askUser1').val(g_params.subRow.content.askUser1);
			$('#askUser2').val(g_params.subRow.content.askUser2);
			$('#askUserCardNo1').val(g_params.subRow.content.askUserCardNo1);
			$('#askUserCardNo2').val(g_params.subRow.content.askUserCardNo2);
			$('#recordUser').val(g_params.subRow.content.recordUser);
			
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesIdCard').val(g_params.subRow.content.partiesIdCard);
			$('#partiesUnit').val(g_params.subRow.content.partiesUnit);
			$('#partiesJob').val(g_params.subRow.content.partiesJob);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesZip').val(g_params.subRow.content.partiesZip);
			$("input[type='radio'][name=relationship][value=" + g_params.subRow.content.relationship + "]").attr("checked",true);
			$('#other').val(g_params.subRow.content.other);
			
			$('#lawOffice').val(g_params.subRow.content.lawOffice);
			$('#lawUser1').val(g_params.subRow.content.lawUser1);
			$('#lawUser2').val(g_params.subRow.content.lawUser2);
			$('#lawUserCardNo1').val(g_params.subRow.content.lawUserCardNo1);
			$('#lawUserCardNo2').val(g_params.subRow.content.lawUserCardNo2);
			$('#noticeUser').val(g_params.subRow.content.noticeUser);
			
			if(!$.utils.isEmpty(g_params.subRow.content.noticeAnswer))
				$("input[type='radio'][name=noticeAnswer][value=" + g_params.subRow.content.noticeAnswer + "]").attr("checked",true);
			
			$('#inquiryQuestion').val(g_params.subRow.content.inquiryQuestion);
			$('#inquiryAnswer').val(g_params.subRow.content.inquiryAnswer);

			$('#defendQuestion').val(g_params.subRow.content.defendQuestion);
			$('#defendAnswer').val(g_params.subRow.content.defendAnswer);

			$('#addrQuestion').val(g_params.subRow.content.addrQuestion);
			$('#addrAnswer').val(g_params.subRow.content.addrAnswer);
			

			if(!$.utils.isEmpty(g_params.subRow.content.askList1)){
				var askList1 = eval("(" + g_params.subRow.content.askList1 + ")");
				for(var index = 0; index < askList1.length; index++){
					$('#tbodyAskList1').append('<tr id="trQuestion1_' + g_askListIndex1 + '">' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion1_' +  g_askListIndex1 + '" colspan="3">' + 
								'<textarea id="inquiryQuestion1_' +  g_askListIndex1 + '" name="inquiryQuestion1_' +  g_askListIndex1 + '" class="form-control" style="height:120px">' + askList1[index].inquiryQuestion + '</textarea>' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;">' + 
								'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(1, ' + g_askListIndex1 + ')">删 除</button>' + 
							'</td>' + 
						'</tr>' + 
						'<tr id="trAnswer1_' + g_askListIndex1 + '">' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer1_' +  g_askListIndex1 + '" colspan="3">' + 
								'<textarea id="inquiryAnswer1_' +  g_askListIndex1 + '" name="inquiryAnswer1_' +  g_askListIndex1 + '" class="form-control" style="height:120px">' + askList1[index].inquiryAnswer + '</textarea>' + 
							'</td>' + 
						'</tr>')
						g_askListIndex1++;
				}
			}

			if(!$.utils.isEmpty(g_params.subRow.content.askList2)){
				var askList2 = eval("(" + g_params.subRow.content.askList2 + ")");
				for(var index = 0; index < askList2.length; index++){
					$('#tbodyAskList2').append('<tr id="trQuestion2_' + g_askListIndex2 + '">' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion2_' +  g_askListIndex2 + '" colspan="3">' + 
								'<textarea id="inquiryQuestion2_' +  g_askListIndex2 + '" name="inquiryQuestion2_' +  g_askListIndex2 + '" class="form-control" style="height:120px">' + askList2[index].inquiryQuestion + '</textarea>' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;">' + 
								'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(2, ' + g_askListIndex2 + ')">删 除</button>' + 
							'</td>' + 
						'</tr>' + 
						'<tr id="trAnswer2_' + g_askListIndex2 + '">' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer2_' +  g_askListIndex2 + '" colspan="3">' + 
								'<textarea id="inquiryAnswer2_' +  g_askListIndex2 + '" name="inquiryAnswer2_' +  g_askListIndex2 + '" class="form-control" style="height:120px">' + askList2[index].inquiryAnswer + '</textarea>' + 
							'</td>' + 
						'</tr>')
						g_askListIndex2++;
				}
			}

			if(!$.utils.isEmpty(g_params.subRow.content.askList3)){
				var askList3 = eval("(" + g_params.subRow.content.askList3 + ")");
				for(var index = 0; index < askList3.length; index++){
					$('#tbodyAskList3').append('<tr id="trQuestion3_' + g_askListIndex3 + '">' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion3_' +  g_askListIndex3 + '" colspan="3">' + 
								'<textarea id="inquiryQuestion3_' +  g_askListIndex3 + '" name="inquiryQuestion3_' +  g_askListIndex3 + '" class="form-control" style="height:120px">' + askList3[index].inquiryQuestion + '</textarea>' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;vertical-align: middle;">' + 
								'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(3, ' + g_askListIndex3 + ')">删 除</button>' + 
							'</td>' + 
						'</tr>' + 
						'<tr id="trAnswer3_' + g_askListIndex3 + '">' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer3_' +  g_askListIndex3 + '" colspan="3">' + 
								'<textarea id="inquiryAnswer3_' +  g_askListIndex3 + '" name="inquiryAnswer3_' +  g_askListIndex3 + '" class="form-control" style="height:120px">' + askList3[index].inquiryAnswer + '</textarea>' + 
							'</td>' + 
						'</tr>')
						g_askListIndex3++;
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
			
			$('#tdCheckDateBegin').text($.utils.getNotNullVal(g_params.subRow.content.checkDateBegin));
			$('#tdCheckDateEnd').text($.utils.getNotNullVal(g_params.subRow.content.checkDateEnd));
			$('#tdCheckAddr').text($.utils.getNotNullVal(g_params.subRow.content.checkAddr));
			$('#tdAskUser1').text($.utils.getNotNullVal(g_params.subRow.content.askUser1));
			$('#tdAskUser2').text($.utils.getNotNullVal(g_params.subRow.content.askUser2));
			$('#tdAskUserCardNo1').text($.utils.getNotNullVal(g_params.subRow.content.askUserCardNo1));
			$('#tdAskUserCardNo2').text($.utils.getNotNullVal(g_params.subRow.content.askUserCardNo2));
			$('#tdRecordUser').text($.utils.getNotNullVal(g_params.subRow.content.recordUser));
			
			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesIdCard').text($.utils.getNotNullVal(g_params.subRow.content.partiesIdCard));
			$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.subRow.content.partiesUnit));
			$('#tdPartiesJob').text($.utils.getNotNullVal(g_params.subRow.content.partiesJob));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.subRow.content.partiesZip));
			$("input[type='radio'][name=relationship][value=" + g_params.subRow.content.relationship + "]").attr("checked",true);
			$('#tdOther').text($.utils.getNotNullVal(g_params.subRow.content.other));
			
			$('#tdLawOffice').text($.utils.getNotNullVal(g_params.subRow.content.lawOffice));
			$('#tdLawUser1').text($.utils.getNotNullVal(g_params.subRow.content.lawUser1));
			$('#tdLawUser2').text($.utils.getNotNullVal(g_params.subRow.content.lawUser2));
			$('#tdLawUserCardNo1').text($.utils.getNotNullVal(g_params.subRow.content.lawUserCardNo1));
			$('#tdLawUserCardNo2').text($.utils.getNotNullVal(g_params.subRow.content.lawUserCardNo2));
			$('#tdNoticeUser').text($.utils.getNotNullVal(g_params.subRow.content.noticeUser));
			$("input[type='radio'][name=noticeAnswer][value=" + g_params.subRow.content.noticeAnswer + "]").attr("checked",true);
			
			$('#tdInquiryQuestion').text($.utils.getNotNullVal(g_params.subRow.content.inquiryQuestion));
			$('#tdInquiryAnswer').text($.utils.getNotNullVal(g_params.subRow.content.inquiryAnswer));

			$('#tdDefendQuestion').text($.utils.getNotNullVal(g_params.subRow.content.defendQuestion));
			$('#tdDefendAnswer').text($.utils.getNotNullVal(g_params.subRow.content.defendAnswer));

			$('#tdAddrQuestion').text($.utils.getNotNullVal(g_params.subRow.content.addrQuestion));
			$('#tdAddrAnswer').text($.utils.getNotNullVal(g_params.subRow.content.addrAnswer));

			if(!$.utils.isEmpty(g_params.subRow.content.askList1)){
				var askList1 = eval("(" + g_params.subRow.content.askList1 + ")");
				for(var index = 0; index < askList1.length; index++){
					$('#tbodyAskList1').append('<tr>' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion1_' +  g_askListIndex1 + '" colspan="3">' + 
								askList1[index].inquiryQuestion + 
							'</td>' + 
						'</tr>' + 
						'<tr>' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer1_' +  g_askListIndex1 + '" colspan="3">' + 
								askList1[index].inquiryAnswer + 
							'</td>' + 
						'</tr>')
						g_askListIndex1++;
				}
			}

			if(!$.utils.isEmpty(g_params.subRow.content.askList2)){
				var askList2 = eval("(" + g_params.subRow.content.askList2 + ")");
				for(var index = 0; index < askList2.length; index++){
					$('#tbodyAskList2').append('<tr>' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion2_' +  g_askListIndex2 + '" colspan="3">' + 
								askList2[index].inquiryQuestion + 
							'</td>' + 
						'</tr>' + 
						'<tr>' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer2_' +  g_askListIndex2 + '" colspan="3">' + 
								askList2[index].inquiryAnswer + 
							'</td>' + 
						'</tr>')
						g_askListIndex2++;
				}
			}

			if(!$.utils.isEmpty(g_params.subRow.content.askList3)){
				var askList3 = eval("(" + g_params.subRow.content.askList3 + ")");
				for(var index = 0; index < askList3.length; index++){
					$('#tbodyAskList3').append('<tr>' + 
							'<td class="reference-td" style="width:100px;">' + 
							   	'问' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryQuestion3_' +  g_askListIndex3 + '" colspan="3">' + 
								askList3[index].inquiryQuestion + 
							'</td>' + 
						'</tr>' + 
						'<tr>' + 
							'<td class="reference-td">' + 
							   	'答' + 
							'</td>' + 
							'<td class="reference-td" id="tdInquiryAnswer3_' +  g_askListIndex3 + '" colspan="3">' + 
								askList3[index].inquiryAnswer + 
							'</td>' + 
						'</tr>')
						g_askListIndex3++;
				}
			}
		}

		//移除增加按钮
		$("#btnAddAsk1").remove();
		$("#btnAddAsk2").remove();
		$("#btnAddAsk3").remove();
		
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_13.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_13.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
    });

	//新增
	$("#btnAddAsk1").click(function () {
		$('#tbodyAskList1').append('<tr id="trQuestion1_' + g_askListIndex1 + '">' + 
										'<td class="reference-td" style="width:100px;">' + 
										   	'问' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion1_' +  g_askListIndex1 + '" colspan="3">' + 
											'<textarea id="inquiryQuestion1_' +  g_askListIndex1 + '" name="inquiryQuestion1_' +  g_askListIndex1 + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;">' + 
											'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(1, ' + g_askListIndex1 + ')">删 除</button>' + 
										'</td>' + 
									'</tr>' + 
									'<tr id="trAnswer1_' + g_askListIndex1 + '">' + 
										'<td class="reference-td">' + 
										   	'答' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryAnswer1_' +  g_askListIndex1 + '" colspan="3">' + 
											'<textarea id="inquiryAnswer1_' +  g_askListIndex1 + '" name="inquiryAnswer1_' +  g_askListIndex1 + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
									'</tr>')
		g_askListIndex1++;
    });
	$("#btnAddAsk2").click(function () {
		$('#tbodyAskList2').append('<tr id="trQuestion2_' + g_askListIndex2 + '">' + 
										'<td class="reference-td" style="width:100px;">' + 
										   	'问' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion2_' +  g_askListIndex2 + '" colspan="3">' + 
											'<textarea id="inquiryQuestion2_' +  g_askListIndex2 + '" name="inquiryQuestion2_' +  g_askListIndex2 + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;">' + 
											'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(2, ' + g_askListIndex2 + ')">删 除</button>' + 
										'</td>' + 
									'</tr>' + 
									'<tr id="trAnswer2_' + g_askListIndex2 + '">' + 
										'<td class="reference-td">' + 
										   	'答' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryAnswer2_' +  g_askListIndex2 + '" colspan="3">' + 
											'<textarea id="inquiryAnswer2_' +  g_askListIndex2 + '" name="inquiryAnswer2_' +  g_askListIndex2 + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
									'</tr>')
		g_askListIndex2++;
    });
	$("#btnAddAsk3").click(function () {
		$('#tbodyAskList3').append('<tr id="trQuestion3_' + g_askListIndex3 + '">' +
										'<td class="reference-td" style="width:100px;">' + 
										   	'问' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion3_' +  g_askListIndex3 + '" colspan="3">' + 
											'<textarea id="inquiryQuestion3_' +  g_askListIndex3 + '" name="inquiryQuestion3_' +  g_askListIndex3 + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryQuestion" rowspan="2" style="width: 120px;vertical-align: middle;">' + 
											'<button type="button" class="btn btn-primary no-print" style="margin-right:30px;width: 100px;" onclick="removeQuestion(3, ' + g_askListIndex3 + ')">删 除</button>' + 
										'</td>' + 
									'</tr>' + 
									'<tr id="trAnswer3_' + g_askListIndex3 + '">' + 
										'<td class="reference-td">' + 
										   	'答' + 
										'</td>' + 
										'<td class="reference-td" id="tdInquiryAnswer3_' +  g_askListIndex3 + '" colspan="3">' + 
											'<textarea id="inquiryAnswer3_' +  g_askListIndex3 + '" name="inquiryAnswer3_' +  g_askListIndex3 + '" class="form-control" style="height:120px"></textarea>' + 
										'</td>' + 
									'</tr>')
		g_askListIndex3++;
    });
}
function removeQuestion(index, sub){
	$('#trQuestion' + index + "_" + sub).remove();
	$('#trAnswer' + index + "_" + sub).remove();
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	if(g_params.type == 1 || g_params.type == 2){		
		data.checkDateBegin = $('#checkDateBegin').val();
		data.checkDateEnd = $('#checkDateEnd').val();
		data.checkAddr = $('#checkAddr').val();
		data.askUser1 = $('#askUser1').val();
		data.askUser2 = $('#askUser2').val();
		data.askUserCardNo1 = $('#askUserCardNo1').val();
		data.askUserCardNo2 = $('#askUserCardNo2').val();
		data.recordUser = $('#recordUser').val();
		data.partiesName = $('#partiesName').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesIdCard = $('#partiesIdCard').val();
		data.partiesUnit = $('#partiesUnit').val();
		data.partiesJob = $('#partiesJob').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesZip = $('#partiesZip').val();
		data.relationship = $('#tdRelationship input:radio:checked').val();
		data.other = $('#other').val();
		
		data.lawOffice = $('#lawOffice').val();
		data.lawUser1 = $('#lawUser1').val();
		data.lawUser2 = $('#lawUser2').val();
		data.lawUserCardNo1 = $('#lawUserCardNo1').val();
		data.lawUserCardNo2 = $('#lawUserCardNo2').val();
		data.noticeUser = $('#noticeUser').val();
		data.noticeAnswer = $('#tdNoticeAnswer input:radio:checked').val();
		
		data.inquiryQuestion = $('#inquiryQuestion').val();
		data.inquiryAnswer = $('#inquiryAnswer').val();

		data.defendQuestion = $('#defendQuestion').val();
		data.defendAnswer = $('#defendAnswer').val();

		data.addrQuestion = $('#addrQuestion').val();
		data.addrAnswer = $('#addrAnswer').val();

		var askList1 = [];
		for(var i = 1; i < g_askListIndex1;i++){
			var obj = {};
			obj.inquiryQuestion = $('#inquiryQuestion1_' + i).val();
			obj.inquiryAnswer = $('#inquiryAnswer1_' + i).val();
			if(!$.utils.isEmpty(obj.inquiryQuestion) && !$.utils.isEmpty(obj.inquiryAnswer)){
				askList1.push(obj)
			}
		}
		data.askList1 = JSON.stringify(askList1);

		var askList2 = [];
		for(var i = 1; i < g_askListIndex2;i++){
			var obj = {};
			obj.inquiryQuestion = $('#inquiryQuestion2_' + i).val();
			obj.inquiryAnswer = $('#inquiryAnswer2_' + i).val();
			if(!$.utils.isEmpty(obj.inquiryQuestion) && !$.utils.isEmpty(obj.inquiryAnswer)){
				askList2.push(obj)
			}
		}
		data.askList2 = JSON.stringify(askList2);

		var askList3 = [];
		for(var i = 1; i < g_askListIndex3;i++){
			var obj = {};
			obj.inquiryQuestion = $('#inquiryQuestion3_' + i).val();
			obj.inquiryAnswer = $('#inquiryAnswer3_' + i).val();
			if(!$.utils.isEmpty(obj.inquiryQuestion) && !$.utils.isEmpty(obj.inquiryAnswer)){
				askList3.push(obj)
			}
		}
		data.askList3 = JSON.stringify(askList3);
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
        	checkDateBegin: {required: true},
        	checkDateEnd: {required: true},
        	checkAddr: {required: true},
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