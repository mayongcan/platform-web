var g_params = {}, g_backUrl = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divDiscussDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	$('#tdIllegalContent').text(g_params.row.illegalContent);
	$('#recorder').val(top.app.info.userInfo.userName);
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
//		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
//		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$("#discussDate").val($.date.dateFormat(g_params.subRow.discussDate, "yyyy-MM-dd"));
		$("#discussAddress").val(g_params.subRow.discussAddress);
		$("#compere").val(g_params.subRow.compereBy);
		$("#recorder").val(g_params.subRow.recordBy);
		$("#joiner").val(g_params.subRow.joinBy);
		$("#discussInfo").val(g_params.subRow.situation);
		$("#discussResult").val(g_params.subRow.conclusion);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
//		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$("#tdDiscussDate").text($.date.dateFormat(g_params.subRow.discussDate, "yyyy-MM-dd"));
		$('#tdDiscussAddress').text($.utils.getNotNullVal(g_params.subRow.discussAddress));
		$('#tdCompere').text($.utils.getNotNullVal(g_params.subRow.compereBy));
		$('#tdRecorder').text($.utils.getNotNullVal(g_params.subRow.recordBy));
		$('#tdJoiner').text($.utils.getNotNullVal(g_params.subRow.joinBy));
		$('#tdDiscussInfo').text($.utils.getNotNullVal(g_params.subRow.situation));
		$('#tdDiscussResult').text($.utils.getNotNullVal(g_params.subRow.conclusion));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}
	
	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/collective-discuss-record-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/collective-discuss-record-pre.html', params, function(){});
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
	data.illegalContent = $('#tdIllegalContent').text();
	if(g_params.type == 1 || g_params.type == 2){
		data.discussDate = $('#discussDate').val();
		data.discussAddress = $('#discussAddress').val();
		data.compere = $('#compere').val();
		data.recorder = $('#recorder').val();
		data.joiner = $('#joiner').val();
		data.discussInfo = $('#discussInfo').val();
		data.discussResult = $('#discussResult').val();
	}else{
		data.discussDate = $('#tdDiscussDate').text();
		data.discussAddress = $('#tdDiscussAddress').text();
		data.compere = $('#tdCompere').text();
		data.recorder = $('#tdRecorder').text();
		data.joiner = $('#tdJoiner').text();
		data.discussInfo = $('#tdDiscussInfo').text();
		data.discussResult = $('#tdDiscussResult').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		discussAddress: {required: true},
    		compere: {required: true},
    		recorder: {required: true},
    		joiner: {required: true},
    		discussInfo: {required: true},
    		discussResult: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCollectiveRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCollectiveRecord?access_token=" + top.app.cookies.getCookiesToken(),
//		submitData["code"] = $('#tableTitleMark').text();
//		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
//	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();

	submitData["discussDate"] = $('#discussDate').val();
	submitData["discussAddress"] = $("#discussAddress").val();
	submitData["compereBy"] = $("#compere").val();
	submitData["recordBy"] = $("#recorder").val();
	submitData["joinBy"] = $("#joiner").val();
	submitData["situation"] = $("#discussInfo").val();
	submitData["conclusion"] = $("#discussResult").val();
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

