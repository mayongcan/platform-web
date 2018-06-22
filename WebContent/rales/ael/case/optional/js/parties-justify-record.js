var g_params = {}, g_backUrl = null, g_sexDict = "";
var g_codeType = "30", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	initView();
});

function initView(){
	$.date.initSearchDate('divInquiryBeginDate', 'divInquiryEndDate', 'YYYY-MM-DD HH:mm:ss');

	top.app.addRadioButton($("#divJustifySex"), g_sexDict, 'radioJustifySex');
	$('#tdIllegalContent').text(g_params.row.illegalContent);
	$("#inquiryUser").val(g_params.row.createUserName + "," + g_params.row.associateUserName);
	$("#recorder").val(top.app.info.userInfo.userName);

	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
		$('#recorder').val(top.app.info.userInfo.userName);
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		$('#inquiryBeginDate').val(g_params.subRow.beginDate);
		$("#inquiryEndDate").val(g_params.subRow.endDate);
		$("#inquiryAddress").val(g_params.subRow.address);
		$("#justifyName").val(g_params.subRow.claimant);
		top.app.addRadioButton($("#divJustifySex"), g_sexDict, 'radioJustifySex', g_params.subRow.sex);
		$("#justifyIdCard").val(g_params.subRow.idcard);
		$("#company").val(g_params.subRow.company);
		$("#phone").val(g_params.subRow.contact);
		$("#inquiryUser").val(g_params.subRow.inquirerBy);
		$("#recorder").val(g_params.subRow.recordBy);
		$("#justifyRecord").val(g_params.subRow.enterContent);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdInquiryBeginDate').text(g_params.subRow.beginDate);
		$("#tdInquiryEndDate").text(g_params.subRow.endDate);
		$('#tdInquiryAddress').text($.utils.getNotNullVal(g_params.subRow.address));
		$('#tdJustifyName').text($.utils.getNotNullVal(g_params.subRow.claimant));
		$('#tdJustifySex').text(top.app.getDictName(g_params.subRow.sex, g_sexDict));
		$('#tdJustifyIdCard').text($.utils.getNotNullVal(g_params.subRow.idcard));
		$('#tdCompany').text($.utils.getNotNullVal(g_params.subRow.company));
		$('#tdPhone').text($.utils.getNotNullVal(g_params.subRow.contact));
		$('#tdInquiryUser').text($.utils.getNotNullVal(g_params.subRow.inquirerBy));
		$('#tdRecorder').text($.utils.getNotNullVal(g_params.subRow.recordBy));
		$('#tdJustifyRecord').text($.utils.getNotNullVal(g_params.subRow.enterContent));
		
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/parties-justify-record-pre.html', params, function(){});
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
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/parties-justify-record-pre.html', params, function(){});
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
		data.inquiryBeginDate = $('#inquiryBeginDate').val();
		data.inquiryEndDate = $('#inquiryEndDate').val();
		data.inquiryAddress = $('#inquiryAddress').val();
		data.justifyName = $('#justifyName').val();

		var sex = $('#divJustifySex input:radio:checked').val();
		data.justifySex = $.utils.isNull(sex) ? '3' : sex;
		
		data.justifyIdCard = $('#justifyIdCard').val();
		data.company = $('#company').val();
		data.phone = $('#phone').val();
		data.inquiryUser = $('#inquiryUser').val();
		data.recorder = $('#recorder').val();
		data.justifyRecord = $('#justifyRecord').val();
	}else{
		data.inquiryBeginDate = $('#tdInquiryBeginDate').text();
		data.inquiryEndDate = $('#tdInquiryEndDate').text();
		data.inquiryAddress = $('#tdInquiryAddress').text();
		data.justifyName = $('#tdJustifyName').text();
		data.justifySex = g_params.subRow.sex;
		data.justifyIdCard = $('#tdJustifyIdCard').text();
		data.company = $('#tdCompany').text();
		data.phone = $('#dPhone').text();
		data.inquiryUser = $('#tdInquiryUser').text();
		data.recorder = $('#tdRecorder').text();
		data.justifyRecord = $('#tdJustifyRecord').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		inquiryBeginDate: {required: true},
    		inquiryEndDate: {required: true},
    		inquiryAddress: {required: true},
    		justifyName: {required: true},
    		justifyIdCard: {required: true, isIdCardNo: true},
    		company: {required: true},
    		phone: {required: true, isMobile: true},
    		inquiryUser: {required: true},
    		recorder: {required: true},
    		justifyRecord: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editPleadRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addPleadRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["illegalContent"] = $('#tdIllegalContent').text();

	submitData["beginDate"] = $('#inquiryBeginDate').val();
	submitData["endDate"] = $("#inquiryEndDate").val();
	submitData["address"] = $("#inquiryAddress").val();
	submitData["claimant"] = $("#justifyName").val();
	var sex = $('#divJustifySex input:radio:checked').val();
	submitData["sex"] = $.utils.isNull(sex) ? '3' : sex;
	
	submitData["idcard"] = $("#justifyIdCard").val();
	submitData["company"] = $("#company").val();
	submitData["contact"] = $("#phone").val();
	submitData["inquirerBy"] = $("#inquiryUser").val();
	submitData["recordBy"] = $("#recorder").val();
	submitData["enterContent"] = $("#justifyRecord").val();
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
