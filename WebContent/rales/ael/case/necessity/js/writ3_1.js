var g_params = {}, g_backUrl = null;
var g_codeType = rales.writNecessity3_1, g_codeCurNum = "";
var g_relevanceIdList = "", g_relevanceCodeList = "";
var g_dataList = [];
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
		
		//关联内容-立案审批表
		var dataInfo = rales.getWritContent(g_params.row.id, rales.writNecessity2_1, "");
		if(!$.utils.isNull(dataInfo.content)){
			var g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
			//转换json
			if(typeof dataInfo.content !== 'object') dataInfo.content = eval("(" + dataInfo.content + ")");
			if(dataInfo.content.personType == '1') $("#personType1").attr("checked",true);
			else $("#personType2").attr("checked",true);

			$('#partiesName').val($.utils.getNotNullVal(dataInfo.content.partiesName));
			$('#partiesSex').val($.utils.getNotNullVal(top.app.getDictName(dataInfo.content.partiesSex, g_sexDict)));
			$('#partiesAge').val($.utils.getNotNullVal(dataInfo.content.partiesAge));
			$('#partiesAddr').val($.utils.getNotNullVal(dataInfo.content.partiesAddr));
			$('#partiesCertificateNo').val($.utils.getNotNullVal(dataInfo.content.partiesCertificateNo));
			$('#partiesPhone').val($.utils.getNotNullVal(dataInfo.content.partiesPhone));
			$('#companyName').val($.utils.getNotNullVal(dataInfo.content.companyName));
			$('#legalRepresentative').val($.utils.getNotNullVal(dataInfo.content.legalRepresentative));
			$('#companyAddr').val($.utils.getNotNullVal(dataInfo.content.companyAddr));
			$('#companyPhone').val($.utils.getNotNullVal(dataInfo.content.companyPhone));
			
			$('#illegalAction').val(dataInfo.content.illegalContent);
		}
	}else if(g_params.type == 2){
		//增加表单验证
		formValidate();
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		
		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");
			
			$('#illegalAction').val(g_params.subRow.content.illegalAction);
			$('#partiesName').val(g_params.subRow.content.partiesName);
			$('#partiesCertificateNo').val(g_params.subRow.content.partiesCertificateNo);
			$('#partiesUnit').val(g_params.subRow.content.partiesUnit);
			$('#legalRepresentative').val(g_params.subRow.content.legalRepresentative);
			$('#partiesAddr').val(g_params.subRow.content.partiesAddr);
			$('#inquiryDesc').val(g_params.subRow.content.inquiryDesc);
			$('#memo').val(g_params.subRow.content.memo);

			//转换json
			if(!$.utils.isEmpty(g_params.subRow.content.list)){
//				g_dataList = eval("(" + g_params.subRow.content.list + ")");
				g_dataList = g_params.subRow.content.list;
				if($.utils.isNull(g_dataList)) g_dataList = [];
				refreshView();
			}	
		}
		//显示文书列表
		g_relevanceIdList = g_params.subRow.relevanceId;
		g_relevanceCodeList = rales.getWritListByRelevanceId(g_params.subRow.relevanceId);
		$("#relevanceId").val(g_relevanceCodeList);
		fileupload.initFileEditSelector('files', g_params.subRow.files);
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#tableUploadList').remove();
		$('#divBtnAdd').remove();
		$("#tdOperater").remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');
		$('#content-left').addClass('box-view-float-left');
		$('#content-top-print').css('right', '26%');

		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			g_params.subRow.content = eval("(" + g_params.subRow.content + ")");
			
			$('#tdIllegalAction').text($.utils.getNotNullVal(g_params.subRow.content.illegalAction));
			$('#tdPartiesName').text($.utils.getNotNullVal(g_params.subRow.content.partiesName));
			$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.subRow.content.partiesCertificateNo));
			$('#tdPartiesUnit').text($.utils.getNotNullVal(g_params.subRow.content.partiesUnit));
			$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.subRow.content.legalRepresentative));
			$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.subRow.content.partiesAddr));
			$('#tdInquiryDesc').text($.utils.getNotNullVal(g_params.subRow.content.inquiryDesc));
			$('#tdMemo').text($.utils.getNotNullVal(g_params.subRow.content.memo));

			//转换json
			if(!$.utils.isEmpty(g_params.subRow.content.list)){
//				g_dataList = eval("(" + g_params.subRow.content.list + ")");
				g_dataList = g_params.subRow.content.list;
				if($.utils.isNull(g_dataList)) g_dataList = [];
				refreshView();
			}	
		}
		
		//设置右侧的高度和左侧一致
		if($("#content-left").height() < 500) $("#content-left").height(500);
		$("#content-right").height($("#content-left").height());
		
		rales.initFilesList(g_params.subRow.files);
		rales.initCodeRelevance(g_params.subRow.relevanceId);
		
		//显示历史审批意见
		$('#trHistoryAuditList').css('display', '');
		getHistoryAuditList(g_params.row.id, "3");
	}

	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre3_1.html', params, function(){});
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/necessity/writ-pre3_1.html', params, function(){});
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

	//新增
	$("#btnAdd").click(function () {
		//设置参数
		var params = {};
		params.type= "add";
		top.app.layer.editLayer('新增', ['710px', '400px'], '/rales/ael/case/necessity/writ3_1-edit.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_dataList.push(retParams[0]);
			refreshView();
		});
    });
}

function refreshView(){
	$('#tableContentList').empty();
	for(var i = 0; i < g_dataList.length; i++){
		var operate = "";
		if(g_params.type != 3){
			operate = '<td class="reference-td">' + 
						'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventEdit(' + i + ')" style="margin-right:10px;">' + 
							'编辑' + 
						'</button>' +
						'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDel(' + i + ')">' + 
							'删除' + 
						'</button>' +
					'</td>';
		}
		$('#tableContentList').append('<tr>' + 
										'<td class="reference-td">' + 
										g_dataList[i].name + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].grade + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].totalCnt + 
										'</td>' + 
										operate + 
									'</tr>')
	}
}

function btnEventEdit(index){
	//设置参数
	var params = {};
	params.type= "edit";
	params.rows = g_dataList[index];
	top.app.layer.editLayer('编辑', ['710px', '400px'], '/rales/ael/case/necessity/writ3_1-edit.html', params, function(retParams){
		if(retParams == null || retParams == undefined && retParams.length > 0) {
			top.app.message.alert("获取返回内容失败！");
			return;
		}
//		g_dataList.push(retParams[0]);
		g_dataList.splice(index, 1, retParams[0]);
		refreshView();
	});
}

function btnEventDel(index){
	g_dataList.splice(index, 1);
	refreshView();
}

/**
 * 获取页面表格参数值
 * @returns
 */
function getTableParams(){
	var data = {};
	data.registerId = g_params.row.id;
	data.tableTitleMark = $('#tableTitleMark').text();
	data.list = g_dataList;
	if(g_params.type == 1 || g_params.type == 2){
		data.illegalAction = $('#illegalAction').val();
		data.partiesName = $('#partiesName').val();
		data.partiesCertificateNo = $('#partiesCertificateNo').val();
		data.partiesUnit = $('#partiesUnit').val();
		data.legalRepresentative = $('#legalRepresentative').val();
		data.partiesAddr = $('#partiesAddr').val();
		data.inquiryDesc = $('#inquiryDesc').val();
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
//        	illegalAction: {required: true},
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
