var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional1_16, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
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
			
			$('#caseNo').val(g_params.subRow.content.caseNo);
			$('#illegalAction').val(g_params.subRow.content.illegalAction);
			$('#signUser').val(g_params.subRow.content.signUser);
			$('#cardType').val(g_params.subRow.content.cardType);
			$('#cardNo').val(g_params.subRow.content.cardNo);
			$('#address').val(g_params.subRow.content.address);
			$("input[type='radio'][name=receiveType][value=" + g_params.subRow.content.receiveType + "]").attr("checked",true);
			$('#phone').val(g_params.subRow.content.phone);
			$('#fax').val(g_params.subRow.content.fax);
			$('#email').val(g_params.subRow.content.email);
			$('#zip').val(g_params.subRow.content.zip);
			$('#otherType').val(g_params.subRow.content.otherType);
			$('#memo').val(g_params.subRow.content.memo);
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
			
			$('#tdCaseNo').text($.utils.getNotNullVal(g_params.subRow.content.caseNo));
			$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.subRow.content.illegalAction));
			$('#tdSignUser').text($.utils.getNotNullVal(g_params.subRow.content.signUser));
			$('#tdCardType').text($.utils.getNotNullVal(g_params.subRow.content.cardType));
			$('#tdCardNo').text($.utils.getNotNullVal(g_params.subRow.content.cardNo));
			$('#tdAddress').text($.utils.getNotNullVal(g_params.subRow.content.address));
			$("input[type='radio'][name=receiveType][value=" + g_params.subRow.content.receiveType + "]").attr("checked",true);
			$('#tdPhone').text($.utils.getNotNullVal(g_params.subRow.content.phone));
			$('#tdFax').text($.utils.getNotNullVal(g_params.subRow.content.fax));
			$('#tdEmail').text($.utils.getNotNullVal(g_params.subRow.content.email));
			$('#tdZip').text($.utils.getNotNullVal(g_params.subRow.content.zip));
			$('#tdOtherType').text($.utils.getNotNullVal(g_params.subRow.content.otherType));
			$('#tdMemo').text($.utils.getNotNullVal(g_params.subRow.content.memo));
		}
		
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
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_16.html', params, function(){});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre1_16.html', params, function(){});
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
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.caseNo = $('#caseNo').val();
		data.illegalAction = $('#illegalAction').val();
		data.signUser = $('#signUser').val();
		data.cardType = $('#cardType').val();
		data.cardNo = $('#cardNo').val();
		data.address = $('#address').val();
		data.receiveType = $('#tdReceiveType input:radio:checked').val();
		data.phone = $('#phone').val();
		data.fax = $('#fax').val();
		data.email = $('#email').val();
		data.zip = $('#zip').val();
		data.otherType = $('#otherType').val();
		data.memo = $('#memo').val();
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
        	caseNo: {required: true},
        	illegalAction: {required: true},
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
