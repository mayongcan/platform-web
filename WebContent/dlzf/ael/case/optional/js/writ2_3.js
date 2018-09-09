var g_params = {}, g_backUrl = null;
var g_codeType = rales.writOptional2_3, g_codeCurNum = "";
var g_dataList = [];
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		//获取最新文书编号
		g_codeCurNum = rales.showCodeCurNum(g_codeType);
		$('#content-right').remove();
	}else if(g_params.type == 2){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();

		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			var content = eval("(" + g_params.subRow.content + ")");
			g_dataList = eval("(" + content.list + ")");
			if($.utils.isNull(g_dataList)) g_dataList = [];
			refreshView();	
		}
	}else if(g_params.type == 3){
		$('#tableTitleMark').text(g_params.subRow.code);
		$('#content-right').remove();
		$('#divBtnAdd').remove();
		$('#tdOperater').remove();
		$("#btnOK").remove();
		$("#btnCancel").text('返 回');

		if(!$.utils.isNull(g_params.subRow.content)){
			//转换json
			var content = eval("(" + g_params.subRow.content + ")");
			g_dataList = eval("(" + content.list + ")");
			if($.utils.isNull(g_dataList)) g_dataList = [];
			refreshView();	
		}
	}
	
	//打印
	$("#btnPrint").click(function () {
		var params = {};
		params.isPrint = true;
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre2_3.html', params, function(){});
    });
	//提交
	$("#btnOK").click(function () {
		submitAction();
    });
	//预览
	$("#btnPreview").click(function () {
		//设置参数
		var params = {};
		params.data = getTableParams();
		top.app.layer.editLayer('预览', ['725px', '600px'], '/rales/ael/case/optional/writ-pre2_3.html', params, function(){});
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex + "&subIndex=" + g_params.subIndex;
    });
	//新增
	$("#btnAdd").click(function () {
		//设置参数
		var params = {};
		params.type= "add";
		top.app.layer.editLayer('新增物品清单', ['710px', '400px'], '/rales/ael/case/optional/writ2_3-edit.html', params, function(retParams){
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
										g_dataList[i].totalCnt + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].level + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].specification + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].model + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].feature + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_dataList[i].memo + 
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
	top.app.layer.editLayer('编辑物品清单', ['710px', '400px'], '/rales/ael/case/optional/writ2_3-edit.html', params, function(retParams){
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
	data.tableTitleMark = $('#tableTitleMark').text();
	data.list = g_dataList;
	return data;
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

	var data = {};
	data.tableTitleMark = $('#tableTitleMark').text();
	data.list = JSON.stringify(g_dataList);
	
	submitData["content"] = JSON.stringify(data);
	
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