var g_params = {}, g_backUrl = null;
var g_codeType = rales.writNecessity5_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict, true, ' ');
	$('#divCaseBeginDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true,});
	$('#divCasePunishDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true, });
	$('#divBirthDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true,});
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
		//关联内容
		$('#caseDesc').val(g_params.row.clueSummary);

		//关联内容-立案审批表
		var dataInfo = rales.getWritContent(g_params.row.id, rales.writNecessity2_1, "");
		if(!$.utils.isNull(dataInfo.content)){
			var g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
			//转换json
			if(typeof dataInfo.content !== 'object') dataInfo.content = eval("(" + dataInfo.content + ")");

			$('#partiesZip').val($.utils.getNotNullVal(dataInfo.content.partiesZip));
			$('#partiesPhone').val($.utils.getNotNullVal(dataInfo.content.partiesPhone));
			$('#partiesAddr').val($.utils.getNotNullVal(dataInfo.content.partiesAddr));
		}
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");
			
			$('#caseName').val(g_params.subRow.content.caseName);
			$('#caseNo').val(g_params.subRow.content.caseNo);
			$('#caseBeginDate').val(g_params.subRow.content.caseBeginDate);
			$('#punish').val(g_params.subRow.content.punish);
			$('#casePunishDate').val(g_params.subRow.content.casePunishDate);

			$('#partiesCompany').val(g_params.subRow.content.partiesCompany);
			$('#delegate').val(g_params.subRow.content.delegate);
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#birthDate').val(g_params.subRow.content.birthDate);
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#partiesZip').val(g_params.subRow.content.partiesZip);
			
			$('#result').val(g_params.subRow.content.result);
			$('#handleDetail').val(g_params.subRow.content.handleDetail);
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

			$('#tdCaseName').text($.utils.getNotNullVal(g_params.subRow.content.caseName));
			$('#tdCaseNo').text($.utils.getNotNullVal(g_params.subRow.content.caseNo));
			$('#tdCaseBeginDate').text($.utils.getNotNullVal(g_params.subRow.content.caseBeginDate));
			$('#tdPunish').text($.utils.getNotNullVal(g_params.subRow.content.punish));
			$('#tdCasePunishDate').text($.utils.getNotNullVal(g_params.subRow.content.casePunishDate));
			
			$('#tdPartiesCompany').text($.utils.getNotNullVal(g_params.subRow.content.partiesCompany));
			$('#tdDelegate').text($.utils.getNotNullVal(g_params.subRow.content.delegate));
			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdBirthDate').text($.utils.getNotNullVal(g_params.subRow.content.birthDate));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdPartiesZip').text($.utils.getNotNullVal(g_params.subRow.content.partiesZip));
			
			$('#tdResult').text($.utils.getNotNullVal(g_params.subRow.content.result));
			$('#tdHandleDetail').text($.utils.getNotNullVal(g_params.subRow.content.handleDetail));
		}
		
		//设置右侧的高度和左侧一致
		if($("#content-left").height() < 500) $("#content-left").height(500);
		$("#content-right").height($("#content-left").height());
		
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);
		
		//显示历史处理意见
		$('#trHistoryAuditList').css('display', '');
		getHistoryAuditList(g_params.row.id, "5");
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre5_1.html', params, function(){});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre5_1.html', params, function(){});
    });
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
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
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.registerId = g_params.row.id;
	data.tableTitleMark = $('#tableTitleMark').text();
	var personType = '0'
	if($('#personType1').prop('checked')) personType = '1';
	if($('#personType2').prop('checked')) personType = '2';
	data.personType = personType;
	if(g_params.type == 1 || g_params.type == 2){
		data.caseName = $('#caseName').val();
		data.caseNo = $('#caseNo').val();
		data.caseBeginDate = $('#caseBeginDate').val();
		data.punish = $('#punish').val();
		data.casePunishDate = $('#casePunishDate').val();
		
		data.partiesCompany = $('#partiesCompany').val();
		data.delegate = $('#delegate').val();
		data.partiesName = $('#partiesName').val();
		data.birthDate = $('#birthDate').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.partiesZip = $('#partiesZip').val();
		
		data.result = $('#result').val();
		data.handleDetail = $('#handleDetail').val();
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
