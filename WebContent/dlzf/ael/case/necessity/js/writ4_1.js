var g_params = {}, g_backUrl = null;
var g_codeType = rales.writNecessity4_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict, true, ' ');;
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

		//关联内容-立案审批表
		var dataInfo = rales.getWritContent(g_params.row.id, rales.writNecessity2_1, "");
		if(!$.utils.isNull(dataInfo.content)){
			var g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
			//转换json
			if(typeof dataInfo.content !== 'object') dataInfo.content = eval("(" + dataInfo.content + ")");

			$('#partiesName').val($.utils.getNotNullVal(dataInfo.content.partiesName));
			$('#companyName').val($.utils.getNotNullVal(dataInfo.content.partiesName));
			$('#partiesPhone').val($.utils.getNotNullVal(dataInfo.content.partiesPhone));
			$('#companyPhone').val($.utils.getNotNullVal(dataInfo.content.partiesPhone));
			$('#partiesAddr').val($.utils.getNotNullVal(dataInfo.content.partiesAddr));
			$('#companyAddr').val($.utils.getNotNullVal(dataInfo.content.partiesAddr));
		}

		var dataInfo3 = rales.getWritContent(g_params.row.id, rales.writNecessity3_1, "");
		if(!$.utils.isNull(dataInfo3.content)){
			//转换json
			if(typeof dataInfo3.content !== 'object') dataInfo3.content = eval("(" + dataInfo3.content + ")");

			$('#partiesAge').val($.utils.getNotNullVal(dataInfo3.content.partiesAge));
		}
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
			
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#partiesSex').val(g_params.subRow.content.partiesSex);
			$('#partiesAge').val(g_params.subRow.content.partiesAge);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#partiesCertificateNo').val(g_params.subRow.content.partiesCertificateNo);
			$('#partiesPhone').val(g_params.subRow.content.partiesPhone);
			$('#companyName').val(g_params.subRow.content.companyName);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#companyAddr').val(g_params.subRow.content.companyAddr);
			$('#companyPhone').val(g_params.subRow.content.companyPhone);
			$('#baseInfo').val(g_params.subRow.content.baseInfo);
			$('#hearingInfo').val(g_params.subRow.content.hearingInfo);
			$('#advice').val(g_params.subRow.content.advice);
			
			if(!$.utils.isNull(g_params.subRow.content.punishType))
				$('#punishType').selectpicker('val', g_params.subRow.content.punishType.split(','));
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

			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.subRow.content.partiesSex, g_sexDict)));
			$('#tdPartiesAge').text($.utils.getNotNullVal(g_params.subRow.content.partiesAge));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.subRow.content.partiesCertificateNo));
			$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.subRow.content.partiesPhone));
			$('#tdCompanyName').text($.utils.getNotNullVal(g_params.subRow.content.companyName));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.subRow.content.companyAddr));
			$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.subRow.content.companyPhone));
			$('#tdBaseInfo').text($.utils.getNotNullVal(g_params.subRow.content.baseInfo));
			$('#tdHearingInfo').text($.utils.getNotNullVal(g_params.subRow.content.hearingInfo));
			$('#tdAdvice').text($.utils.getNotNullVal(g_params.subRow.content.advice));

			var punishType = "";
			if(!$.utils.isNull(g_params.subRow.content.punishType)){
				if(g_params.subRow.content.punishType.indexOf("1") != -1){
					punishType += '警告、';
				}
				if(g_params.subRow.content.punishType.indexOf("2") != -1){
					punishType += '罚款、';
				}
				if(g_params.subRow.content.punishType.indexOf("3") != -1){
					punishType += '没收违法所得';
				}
			}
			$('#tdPunishType').text(punishType);
		}
		
		//设置右侧的高度和左侧一致
		if($("#content-left").height() < 500) $("#content-left").height(500);
		$("#content-right").height($("#content-left").height());
		
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);

		//显示历史处理意见
		$('#trHistoryAuditList').css('display', '');
		getHistoryAuditList(g_params.row.id, "4");
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre4_1.html', params, function(){});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.sexDict = g_sexDict;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre4_1.html', params, function(){});
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
	data.punishType = $.trim($("#punishType").val());
	if(g_params.type == 1 || g_params.type == 2){
		data.partiesName = $('#partiesName').val();
		data.partiesSex = $('#partiesSex').val();
		data.partiesAge = $('#partiesAge').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.partiesCertificateNo = $('#partiesCertificateNo').val();
		data.partiesPhone = $('#partiesPhone').val();
		data.companyName = $('#companyName').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.companyAddr = $('#companyAddr').val();
		data.companyPhone = $('#companyPhone').val();
		data.baseInfo = $('#baseInfo').val();
		data.hearingInfo = $('#hearingInfo').val();
		data.advice = $('#advice').val();
	}else{
		data = $.extend(data, g_params.subRow.content);
	}
	if(g_params.subRow && g_params.subRow.content && g_params.subRow.content.punishType){
		data.punishTypeOld = g_params.subRow.content.punishType;
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
	var personType = '0'
	if($('#personType1').prop('checked')) personType = '1';
	if($('#personType2').prop('checked')) personType = '2';
	if(personType == '0'){
		top.app.message.notice("请选择公民或法人、其他组织！");
		return;
	}
	if(personType == '1' && $('#partiesName').val() == ''){
		top.app.message.notice("请输入公民姓名！");
		return;
	}
	if(personType == '2' && $('#companyName').val() == ''){
		top.app.message.notice("请输入组织名称！");
		return;
	}
	
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
