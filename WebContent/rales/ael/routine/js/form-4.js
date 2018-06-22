var g_params = {}, g_backUrl = null, g_dataInfo = [], g_type = 1;
var g_codeType = "24", g_codeCurNum = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = parent.g_params;
	g_type = g_params.type;
	initView();
});

function initView(){
	if(g_params.row != null && g_params.row != undefined && g_params.row.id != null && g_params.row.id != undefined){
		g_dataInfo = rales.getCurPunishDecision(g_params.row.id);
		$('#tdCaseParties').text(g_params.row.rapParties);
	}
	//如果发现内容为空，则设置为新增
	if($.utils.isEmpty(g_dataInfo.code)) g_type = 1;
	

	//1新增 2编辑 3查看
	if(g_type == 1){
		//增加表单验证
		formValidate();
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
	}else if(g_type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#content-right').remove();

		$('#tdCaseAddress').text(g_dataInfo.address);
		
		$('#illegalFact').val(g_dataInfo.factMalfeasance);
		$("#rules").val(g_dataInfo.strip);
	}else if(g_type == 3){
		$('#tableTitleMark').text(g_dataInfo.code);
		$('#tableUploadList').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');

		$('#tdCaseAddress').text($.utils.getNotNullVal(g_dataInfo.address));
		
		$('#tdIllegalFact').text($.utils.getNotNullVal(g_dataInfo.factMalfeasance));
		$('#tdRules').text($.utils.getNotNullVal(g_dataInfo.strip));
	}
	
	//打印
	$("#btnPrint").click(function () {
		top.app.message.chooseEvent("打印选择", "请选择打印项", "打印第一联", "打印第二联",function(){
			var params = {};
			params.isPrint = true;
			params.printType = 1;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/cur-punish-decision-pre.html', params, function(){});
		}, function(){
			var params = {};
			params.isPrint = true;
			params.printType = 2;
			params.data = getTableParams();
			top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/cur-punish-decision-pre.html', params, function(){});
		});
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
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/cur-punish-decision-pre.html', params, function(){});		
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		parent.location.href = parent.g_backUrl + "?_pid=" + parent.g_pid;
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
    		factMalfeasance: {required: true},
    		strip: {required: true},
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
        		submitAction();
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCurPunishDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_dataInfo.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCurPunishDecision?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["code"] = $('#tableTitleMark').text();
		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	submitData["codeType"] = g_codeType;
	
	submitData["parties"] = $('#tdCaseParties').text();
	submitData["address"] = $('#caseAddress').val();
	submitData["factMalfeasance"] = $('#illegalFact').val();
	submitData["strip"] = $("#rules").val();
	
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

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.caseParties = $('#tdCaseParties').text();
	if(g_type == 1 || g_type == 2){
		data.caseAddress = $('#caseAddress').val();
		data.illegalFact = $('#illegalFact').val();
		data.rules = $('#rules').val();
	}else{
		data.caseAddress = $('#tdCaseAddress').text();
		data.illegalFact = $('#tdIllegalFact').text();
		data.rules = $('#tdRules').text();
	}
	return data;
}

