var g_params = {}, g_backUrl = null;
var g_codeType = "26", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#divDesArrayDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD', allowInputToggle: true});

	$('#tdIllegalContent').text(g_params.row.illegalContent);

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
		
		$('#applyUser').val(g_params.subRow.proposer);
		$("#address").val(g_params.subRow.address);
		$("#legal").val(g_params.subRow.representative);
		$("#job").val(g_params.subRow.position);
		$("#phone").val(g_params.subRow.phone);
		$("#beApplyUser").val(g_params.subRow.respondent);
		$("#beApplyAddress").val(g_params.subRow.respondentAddress);
		$("#beApplyLegal").val(g_params.subRow.respondentLegalAddress);
		$("#beApplyJob").val(g_params.subRow.respondentLegal);
		$("#beApplyPhone").val(g_params.subRow.respondentPhone);
		$("#desArrayDate").val($.date.dateFormat(g_params.subRow.arrivalDate, "yyyy-MM-dd"));
		$("#courtName").val(g_params.subRow.courtname);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdApplyUser').text($.utils.getNotNullVal(g_params.subRow.proposer));
		$('#tdAddress').text($.utils.getNotNullVal(g_params.subRow.address));
		$('#tdLegal').text($.utils.getNotNullVal(g_params.subRow.representative));
		$('#tdJob').text($.utils.getNotNullVal(g_params.subRow.position));
		$('#tdPhone').text($.utils.getNotNullVal(g_params.subRow.phone));
		$('#tdBeApplyUser').text($.utils.getNotNullVal(g_params.subRow.respondent));
		$('#tdBeApplyAddress').text($.utils.getNotNullVal(g_params.subRow.respondentAddress));
		$('#tdBeApplyLegal').text($.utils.getNotNullVal(g_params.subRow.respondentLegalAddress));
		$('#tdBeApplyJob').text($.utils.getNotNullVal(g_params.subRow.respondentLegal));
		$('#tdBeApplyPhone').text($.utils.getNotNullVal(g_params.subRow.respondentPhone));
		$("#tdDesArrayDate").text($.date.dateFormat(g_params.subRow.arrivalDate, "yyyy-MM-dd"));
		$('#tdCourtName').text($.utils.getNotNullVal(g_params.subRow.courtname));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_params.subRow.files);
	}
	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/perform-application-pre-2.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/perform-application-pre-2.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/perform-application-pre-2.html', params, function(){});
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
		data.applyUser = $('#applyUser').val();
		data.address = $('#address').val();
		data.legal = $('#legal').val();
		data.job = $('#job').val();
		data.phone = $('#phone').val();
		data.beApplyUser = $('#beApplyUser').val();
		data.beApplyAddress = $('#beApplyAddress').val();
		data.beApplyLegal = $('#beApplyLegal').val();
		data.beApplyJob = $('#beApplyJob').val();
		data.beApplyPhone = $('#beApplyPhone').val();
		data.desArrayDate = $('#desArrayDate').val();
		data.courtName = $('#courtName').val();
	}else{
		data.applyUser = $('#tdApplyUser').text();
		data.address = $('#tdAddress').text();
		data.legal = $('#tdLegal').text();
		data.job = $('#tdJob').text();
		data.phone = $('#tdPhone').text();
		data.beApplyUser = $('#tdBeApplyUser').text();
		data.beApplyAddress = $('#tdBeApplyAddress').text();
		data.beApplyLegal = $('#tdBeApplyLegal').text();
		data.beApplyJob = $('#tdBeApplyJob').text();
		data.beApplyPhone = $('#tdBeApplyPhone').text();
		data.desArrayDate = $('#tdDesArrayDate').text();
		data.courtName = $('#tdCourtName').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		applyUser: {required: true},
    		address: {required: true},
    		legal: {required: true},
    		job: {required: true},
    		phone: {required: true},
    		beApplyUser: {required: true},
    		beApplyAddress: {required: true},
    		beApplyLegal: {required: true},
    		beApplyJob: {required: true},
    		beApplyPhone: {required: true, isMobile: true},
    		desArrayDate: {required: true},
    		courtName: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editImplement?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addImplement?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["type"] = "2";
	submitData["illegalContent"] = $('#tdIllegalContent').text();

	submitData["proposer"] = $('#applyUser').val();
	submitData["address"] = $("#address").val();
	submitData["representative"] = $("#legal").val();
	submitData["position"] = $("#job").val();
	submitData["phone"] = $("#phone").val();
	submitData["respondent"] = $("#beApplyUser").val();
	submitData["respondentAddress"] = $("#beApplyAddress").val();
	submitData["respondentLegalAddress"] = $("#beApplyLegal").val();
	submitData["respondentLegal"] = $("#beApplyJob").val();
	submitData["respondentPhone"] = $("#beApplyPhone").val();
	submitData["arrivalDate"] = $("#desArrayDate").val();
	submitData["courtname"] = $("#courtName").val();
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

