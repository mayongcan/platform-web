var g_params = {}, g_backUrl = null, g_dataInfo = [], g_type = 1;
var g_codeType = "13", g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	g_type = g_params.type;
	initView();
});

function initView(){
	if(g_params.row != null && g_params.row != undefined && g_params.row.id != null && g_params.row.id != undefined)
		g_dataInfo = rales.getDelegationStorage(g_params.row.id);
	//如果发现内容为空，则设置为新增
	if($.utils.isEmpty(g_dataInfo.code)) {
		//如果是查看，则不用设置为新增
		if(g_type != 3) g_type = 1;
	}

	//1新增 2编辑 3查看
	if(g_type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
		fileupload.initFileNewSelector('files');
	}else if(g_type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#content-right').remove();
		
		$('#storageCompany').val(g_dataInfo.parties);

		g_relevanceIdList = $.utils.getNotNullVal(g_dataInfo.preservationId);
		g_relevanceCodeList = $.utils.getNotNullVal(g_dataInfo.preservationCode);
		$("#preservationId").val(g_relevanceCodeList);
		fileupload.initFileEditSelector('files', g_dataInfo.files);
	}else if(g_type == 3){
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnSave").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');
		
		$('#tdStorageCompany').text($.utils.getNotNullVal(g_dataInfo.parties));
		$("#tdPreservationId").text($.utils.getNotNullVal(g_dataInfo.preservationCode));
		
		//设置右侧的高度和左侧一致
		$("#content-right").height($("#content-left").height());
		rales.initFilesList(g_dataInfo.files);
	}
	
	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/delegation-storage-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/delegation-storage-pre.html', params, function(){});
		});
    });
	//保存
	$("#btnSave").click(function () {
		if(g_params.row == null || g_params.row == undefined || g_params.row.id == null || g_params.row.id == undefined){
   			top.app.message.notice("请先保存证据保全措施审批表！");
   			return;
		}
		$("form").submit();
    });
	//提交
	$("#btnOK").click(function () {
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/delegation-storage-pre.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
    });

	//选择需要关联的文书
	$("#preservationId").click(function () {
		//设置参数
		var params = {};
		params.registerId = g_params.row.id;
		params.relevanceIdList = g_relevanceIdList;
		params.relevanceCodeList = g_relevanceCodeList;
		top.app.layer.editLayer('选择需要关联的证据保全决定书', ['700px', '550px'], '/rales/ael/case/select/evidence-preserve-decision-sel.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_relevanceIdList = retParams[0].relevanceIdList;
			g_relevanceCodeList = retParams[0].relevanceCodeList;
			$("#preservationId").val(retParams[0].relevanceCodeList);
		});
    });
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	if(g_type == 1 || g_type == 2){
		data.storageCompany = $('#storageCompany').val();
	}else{
		data.storageCompany = $('#tdStorageCompany').text();
	}
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	storageCompany: {required: true},
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editDelegationStorage?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_dataInfo.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addDelegationStorage?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	submitData["parties"] = $('#storageCompany').val();
	submitData["preservationId"] = g_relevanceIdList;
	submitData["preservationCode"] = g_relevanceCodeList;
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