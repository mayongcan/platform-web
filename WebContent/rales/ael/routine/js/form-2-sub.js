var g_params = {}, g_backUrl = null, g_questionIndex = 1, g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	initView();
});

function initView(){
	//实现日期联动
	$.date.initSearchDate('divInvestigativeBegin', 'divInvestigativeEnd', 'YYYY-MM-DD HH:mm:ss');
	top.app.addRadioButton($("#divBeInvestigativeSex"), g_sexDict, 'radioBeInvestigativeSex');
	
	$('#tdIllegalContent').text(g_params.row.rapIllegalContent);

	//1新增 2编辑 3查看
	if(g_params.subType == 1){
		//增加表单验证
		formValidate();
//		//获取最新文书编号
//		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		addQuestion();
		fileupload.initFileNewSelector('files');
		$('#beInvestigativeName').val(g_params.registerRow.rapParties);
		$('#beInvestigativeIdCard').val(g_params.registerRow.rapCertificateNo);
		$('#beInvestigativeCompany').val(g_params.registerRow.rapCompany);
		$('#contacterPhone').val(g_params.registerRow.rapPhone);
		$('#investigativeUser').val(top.app.info.userInfo.userName);
		$('#recordUser').val(top.app.info.userInfo.userName);
	}else if(g_params.subType == 2){
		//增加表单验证
		formValidate();
//		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		addExistQuestion();
		
		$('#investigativeBegin').val(g_params.subRow.beginDate);
		$("#investigativeEnd").val(g_params.subRow.endDate);
		$("#investigativeAddress").val(g_params.subRow.address);
		$("#investigativeUser").val(g_params.subRow.investigationBy);
		$("#recordUser").val(g_params.subRow.recordBy);
		$("#beInvestigativeName").val(g_params.subRow.investigatorName);
		top.app.addRadioButton($("#divBeInvestigativeSex"), g_sexDict, 'radioBeInvestigativeSex', g_params.subRow.investigatorSex);
		$("#beInvestigativeIdCard").val(g_params.subRow.investigatorIdcard);
		$("#beInvestigativeCompany").val(g_params.subRow.company);
		$("#contacterPhone").val(g_params.subRow.phone);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.subType == 3){
//		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		addExistQuestion();
		$("#btnAddQuestion").remove();
//		$("#btnRemoveQuestion").remove();
		
		$('#tdInvestigativeBegin').text(g_params.subRow.beginDate);
		$("#tdInvestigativeEnd").text(g_params.subRow.endDate);
		$('#tdInvestigativeAddress').text($.utils.getNotNullVal(g_params.subRow.address));
		$('#tdInvestigativeUser').text($.utils.getNotNullVal(g_params.subRow.investigationBy));
		$('#tdRecordUser').text($.utils.getNotNullVal(g_params.subRow.recordBy));
		$('#tdBeInvestigativeName').text($.utils.getNotNullVal(g_params.subRow.investigatorName));
		$('#tdBeInvestigativeSex').text(top.app.getDictName(g_params.subRow.investigatorSex, g_sexDict));
		$('#tdBeInvestigativeIdCard').text($.utils.getNotNullVal(g_params.subRow.investigatorIdcard));
		$('#tdBeInvestigativeCompany').text($.utils.getNotNullVal(g_params.subRow.company));
		$('#tdContacterPhone').text($.utils.getNotNullVal(g_params.subRow.phone));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}
	
	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/investigative-record-pre.html', params, function(){});
    });
	//添加问题
	$("#btnAddQuestion").click(function () {
		addQuestion();
    });
//	$("#btnRemoveQuestion").click(function () {
//		removeQuestion();
//    });
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/investigative-record-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = "/rales/ael/routine/routine-detail.html?_pid=" + pid + "&navIndex=2" + "&backUrl=/rales/ael/routine/routine.html";
    });
}

//添加问题
function addExistQuestion(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getInquiryRecordQuestionList",
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
	   		recordId:g_params.subRow.id
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
//	   			if(data.rows.length == 0 && g_params.subType == 2) addQuestion();
	   			for(var i = 0; i < data.rows.length; i++){
	   				var html = '<tr id="trQuestion' + g_questionIndex + '">' + 
	   								'<td class="reference-td" style="width:120px;">问</td>' + 
	   								'<td class="reference-td" colspan="3">' + 
	   									'<input type="text" id="question' + g_questionIndex + '" name="question' + g_questionIndex + '" value="' + data.rows[i].question + '"  class="form-control">' + 
	   								'</td>' + 
	   								'<td style="width: 30px;font-size:18px;padding-left: 20px;" rowspan="2">' + 
		   								'<i class="glyphicon glyphicon-trash" aria-hidden="true" style="cursor: pointer;margin-top: 15px;margin-right:20px;" id="tdQuestionDel' + g_questionIndex + '" onclick="questionDel(\'' + g_questionIndex + '\')"></i>' + 
		   							'</td>' +
	   							'</tr>' + 
	   							'<tr id="trAnswer' + g_questionIndex + '">' + 
	   								'<td class="reference-td" style="width:120px;">答</td>' + 
	   								'<td class="reference-td" colspan="3">' + 
	   									'<input type="text" id="answer' + g_questionIndex + '" name="answer' + g_questionIndex + '" value="' + data.rows[i].answer + '" class="form-control">' + 
	   								'</td>' + 
	   							'</tr>';
	   				$('#tableQuestionList').append(html);
	   				g_questionIndex ++;
	   			}
	   			if(g_params.subType == 3)
	   				$("#content-right").height($("#content-left").height());
	   		}
	   	}
	});
}

//添加问题
function addQuestion(){
	var html = '<tr id="trQuestion' + g_questionIndex + '">' + 
					'<td class="reference-td" style="width:120px;">问</td>' + 
					'<td class="reference-td" colspan="3">' + 
						'<input type="text" id="question' + g_questionIndex + '" name="question' + g_questionIndex + '"  class="form-control">' + 
					'</td>' + 
					'<td style="width: 30px;font-size:18px;padding-left: 20px;" rowspan="2">' + 
						'<i class="glyphicon glyphicon-trash" aria-hidden="true" style="cursor: pointer;margin-top: 15px;margin-right:20px;" id="tdQuestionDel' + g_questionIndex + '" onclick="questionDel(\'' + g_questionIndex + '\')"></i>' + 
					'</td>' +
				'</tr>' + 
				'<tr id="trAnswer' + g_questionIndex + '">' + 
					'<td class="reference-td" style="width:120px;">答</td>' + 
					'<td class="reference-td" colspan="3">' + 
						'<input type="text" id="answer' + g_questionIndex + '" name="answer' + g_questionIndex + '" class="form-control">' + 
					'</td>' + 
				'</tr>';
	$('#tableQuestionList').append(html);
	g_questionIndex ++;
}

function questionDel(index){
	$('#trQuestion' + index).remove();
	$('#trAnswer' + index).remove();
}

////移除问题
//function removeQuestion(){
//	if(g_questionIndex == 2){
//		top.app.message.notice("不能移除所有问题！");
//		return ;
//	}
//	for(var i = g_questionIndex; i > 1; i--){
//		if(document.getElementById("trQuestion" + i)){
//			$('#trQuestion' + i).remove();
//			$('#trAnswer' + i).remove();
//			g_questionIndex = i;
//			break;
//		}
//	}
//}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.illegalContent = $('#tdIllegalContent').text();
	
	data.questionCnt = 0;
	data.question = [];
	data.answer = [];
	for(var i = 0; i < g_questionIndex; i++){
		if(document.getElementById("trQuestion" + i)){
			data.question[data.questionCnt] = $('#question' + i).val();
			data.answer[data.questionCnt] = $('#answer' + i).val();
			data.questionCnt++;
		}
	}
	if(g_params.subType == 1 || g_params.subType == 2){
		data.investigativeBegin = $('#investigativeBegin').val();
		data.investigativeEnd = $('#investigativeEnd').val();
		data.investigativeAddress = $('#investigativeAddress').val();
		data.investigativeUser = $('#investigativeUser').val();
		data.recordUser = $('#recordUser').val();
		data.beInvestigativeName = $('#beInvestigativeName').val();
		var sex = $('#divBeInvestigativeSex input:radio:checked').val();
		data.beInvestigativeSex = $.utils.isNull(sex) ? '3' : sex;
		data.beInvestigativeIdCard = $('#beInvestigativeIdCard').val();
		data.beInvestigativeCompany = $('#beInvestigativeCompany').val();
		data.contacterPhone = $('#contacterPhone').val();
	}else{
		data.investigativeBegin = $('#tdInvestigativeBegin').text();
		data.investigativeEnd = $('#tdInvestigativeEnd').text();
		data.investigativeAddress = $('#tdInvestigativeAddress').text();
		data.investigativeUser = $('#tdInvestigativeUser').text();
		data.recordUser = $('#tdRecordUser').text();
		data.beInvestigativeName = $('#tdBeInvestigativeName').text();
		data.beInvestigativeSex = g_params.subRow.investigatorSex;//$('#tdBeInvestigativeSex').text();
		data.beInvestigativeIdCard = $('#tdBeInvestigativeIdCard').text();
		data.beInvestigativeCompany = $('#tdBeInvestigativeCompany').text();
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
    		investigativeAddress: {required: true},
    		investigativeUser: {required: true},
    		recordUser: {required: true},
    		beInvestigativeName: {required: true},
    		beInvestigativeIdCard: {required: true},
    		beInvestigativeCompany: {required: true},
    		contacterPhone: {required: true},
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
	if(g_params.subType == 2){
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editInquiryRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.subRow.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addInquiryRecord?access_token=" + top.app.cookies.getCookiesToken(),
//		submitData["code"] = $('#tableTitleMark').text();
//		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
//	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();

	submitData["beginDate"] = $('#investigativeBegin').val();
	submitData["endDate"] = $("#investigativeEnd").val();
	submitData["address"] = $("#investigativeAddress").val();
	submitData["investigationBy"] = $("#investigativeUser").val();
	submitData["recordBy"] = $("#recordUser").val();
	submitData["investigatorName"] = $("#beInvestigativeName").val();
	var sex = $('#divBeInvestigativeSex input:radio:checked').val();
	submitData["investigatorSex"] = $.utils.isNull(sex) ? '3' : sex;
	submitData["investigatorIdcard"] = $("#beInvestigativeIdCard").val();
	submitData["company"] = $("#beInvestigativeCompany").val();
	submitData["phone"] = $("#contacterPhone").val();
	//已上传的附件路径
	submitData["files"] = fileupload.getUploadFilePath();
	
	//添加问题表
	var questionList = [], obj = null;
	for(var i = 1; i < g_questionIndex; i++){
		if(document.getElementById("trQuestion" + i)){
			//没有内容的不显示
			if($.utils.isEmpty($('#question' + i).val()) || $.utils.isEmpty($('#answer' + i).val())) continue;
			obj = new Object();
			obj.question = $('#question' + i).val();
			obj.answer = $('#answer' + i).val();
			questionList.push(obj);
		}
	}
	submitData["questionList"] = JSON.stringify(questionList);
	
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
	   			window.location.href = "/rales/ael/routine/routine-detail.html?_pid=" + pid + "&navIndex=2" + "&backUrl=/rales/ael/routine/routine.html";
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
