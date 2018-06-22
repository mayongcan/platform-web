var g_params = {}, g_backUrl = null, g_sexDict = "", g_dataInfo = [], g_type = 1;
var g_codeType = "30", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	g_type = g_params.type;
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	initView();
});

function initView(){
	$('#divInquiryBeginDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss ', allowInputToggle: true});
	$('#divInquiryEndDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss ', allowInputToggle: true});

	top.app.addRadioButton($("#divJustifySex"), g_sexDict, 'radioJustifySex');
	if(g_params.row != null && g_params.row != undefined && g_params.row.id != null && g_params.row.id != undefined){
		g_dataInfo = rales.getPleadRecord(g_params.row.id);
		$('#tdIllegalContent').text(g_params.row.rapIllegalContent);
	}
	//如果发现内容为空，则设置为新增
	if($.utils.isEmpty(g_dataInfo.id)) g_type = 1;

	//1新增 2编辑 3查看
	if(g_type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
		$('#recorder').val(top.app.info.userInfo.userName);
	}else if(g_type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#content-right').remove();
		
//		$("#inquiryUser").val(g_params.row.createUserName + "," + g_params.row.associateUserName);
		$("#recorder").val(top.app.info.userInfo.userName);
		
		$('#inquiryBeginDate').val(g_dataInfo.beginDate);
		$("#inquiryEndDate").val(g_dataInfo.endDate);
		$("#inquiryAddress").val(g_dataInfo.address);
		$("#justifyName").val(g_dataInfo.claimant);
		top.app.addRadioButton($("#divJustifySex"), g_sexDict, 'radioJustifySex', g_dataInfo.sex);
		$("#justifyIdCard").val(g_dataInfo.idcard);
		$("#company").val(g_dataInfo.company);
		$("#phone").val(g_dataInfo.contact);
		$("#inquiryUser").val(g_dataInfo.inquirerBy);
		$("#recorder").val(g_dataInfo.recordBy);
		$("#justifyRecord").val(g_dataInfo.enterContent);
		fileupload.initFileEditSelector('files', g_dataInfo.files);
	}else if(g_type == 3){
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');

//		$("#inquiryUser").val(g_params.row.createUserName + "," + g_params.row.associateUserName);
		$("#recorder").val(top.app.info.userInfo.userName);
		
		$('#tdInquiryBeginDate').text(g_dataInfo.beginDate);
		$("#tdInquiryEndDate").text(g_dataInfo.endDate);
		$('#tdInquiryAddress').text($.utils.getNotNullVal(g_dataInfo.address));
		$('#tdJustifyName').text($.utils.getNotNullVal(g_dataInfo.claimant));
		$('#tdJustifySex').text(top.app.getDictName(g_dataInfo.sex, g_sexDict));
		$('#tdJustifyIdCard').text($.utils.getNotNullVal(g_dataInfo.idcard));
		$('#tdCompany').text($.utils.getNotNullVal(g_dataInfo.company));
		$('#tdPhone').text($.utils.getNotNullVal(g_dataInfo.contact));
		$('#tdInquiryUser').text($.utils.getNotNullVal(g_dataInfo.inquirerBy));
		$('#tdRecorder').text($.utils.getNotNullVal(g_dataInfo.recordBy));
		$('#tdJustifyRecord').text($.utils.getNotNullVal(g_dataInfo.enterContent));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_dataInfo.files);
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
		if(g_params.row == null || g_params.row == undefined || g_params.row.id == null || g_params.row.id == undefined){
   			top.app.message.notice("请先保存现场检查记录表！");
   			return;
		}
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
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
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
	if(g_type == 1 || g_type == 2){
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
		data.justifySex = g_dataInfo.sex;
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
    		justifyIdCard: {required: true},
    		company: {required: true},
    		phone: {required: true},
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
	if(g_type == 2){
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editPleadRecord?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_dataInfo.id;
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
				parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
