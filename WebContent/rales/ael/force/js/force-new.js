var g_isDraft = "0";
var g_codeType = rales.writOptional3_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_sexDict = "";
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
$(function () {
	initView();
});

function initView(){
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	top.app.addComboBoxOption($("#partiesSex"), g_sexDict);
	//公民选择
	$('input[type=checkbox][id=personType1]').change(function() { 
		$("#personType1").attr("checked",true);
		$("#personType2").attr("checked",false);
	});
	$('input[type=checkbox][id=personType2]').change(function() { 
		$("#personType2").attr("checked",true);
		$("#personType1").attr("checked",false);
	});
	//增加表单验证
	formValidate();
	//获取最新文书编号
	g_codeCurNum = rales.showCodeCurNum(g_codeType);
	$('#content-right').remove();
	fileupload.initFileNewSelector('files');

	//提交
	$("#btnSaveAsDraft").click(function () {
		g_isDraft = "1";
		$("form").submit();
    });
	//提交
	$("#btnOK").click(function () {
		g_isDraft = "0";
		$("form").submit();
    });

	//选择第二承办人
	$("#undertaker").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择第二承办人', ['900px', '550px'], '/rales/ael/case/case-new-undertaker.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#undertaker").val(retParams[0].userNameList);
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
	var personType = '0'
	if($('#personType1').prop('checked')) personType = '1';
	if($('#personType2').prop('checked')) personType = '2';
	data.personType = personType;

	data.illegalAction = $('#illegalAction').val();
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
	data.auditType = $('#tdAuditType input:radio:checked').val();
	data.base = $('#base').val();
	return data;
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
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

	if($.utils.isEmpty(g_userIdList)){
		top.app.message.notice("请选择第二承办人！");
		return;
	}
	if(g_userIdList == top.app.info.userInfo.userId){
		top.app.message.notice("不能选择自己作为第二承办人！");
		return;
	}
	
	//定义提交数据
	var submitData = {};
	var url = top.app.conf.url.apigateway + "/api/rales/ael/force/startForceFlow2?access_token=" + top.app.cookies.getCookiesToken();
	submitData["code"] = $('#tableTitleMark').text();
	submitData["codeCurNum"] = g_codeCurNum;
	submitData["codeType"] = g_codeType;
	submitData["writType"] = g_codeType;
	submitData["subType"] = "";
	submitData["content"] = JSON.stringify(getTableParams());
	submitData["isDraft"] = g_isDraft;
	submitData["associateExecutor"] = g_userIdList;
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
				var pid = $.utils.getUrlParam(window.location.search,"_pid");
				window.location.href = "force-new.html?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}
