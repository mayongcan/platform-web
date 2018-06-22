var g_params = {}, g_backUrl = null;
var g_resultList = [], g_index = 0, g_jsonData = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	
	//1新增 2编辑 3查看
	if(g_params.type == 1){
		getNewContent();
	}else if(g_params.type == 2){
		getEditContent();
	}else if(g_params.type == 3){
		getViewContent();
	}

	//提交
	$("#btnOK").click(function () {
		submitAction();
    });
	$("#btnAdd").click(function () {
		addContent();
    });
	$("#btnDel").click(function () {
		removeContent();
    });
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });

}

function getNewContent(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseCodeRelevanceList",
	    method: 'GET',
	   	data:{
	   		access_token: top.app.cookies.getCookiesToken(),
            size: 100,   	//页面大小
            page: 0,  		//当前页
            registerId: g_params.row.id,
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			//整理输出顺序
	   			g_resultList = [];
	   			g_index = data.rows.length;
	   			var tmpRows = data.rows;
	   			tmpRows = resetList(tmpRows, '穗工信无罚决');
	   			tmpRows = resetList(tmpRows, '穗工信无当场罚决');
	   			tmpRows = resetList(tmpRows, '穗工信无调报');
	   			tmpRows = resetList(tmpRows, '穗工信无登');
	   			tmpRows = resetList(tmpRows, '穗工信无立呈');
	   			tmpRows = resetList(tmpRows, '穗工信无听报');
	   			tmpRows = resetList(tmpRows, '穗工信无结');
	   			for(var i = 0; i < tmpRows.length; i++){
   					g_resultList.push(tmpRows[i]);
	   			}
	   			$('#tableList').empty();
	   			for(var i = 0; i < g_resultList.length; i++){
	   				var html = '<tr id="trAddContent' + i + '">' + 
			   						'<td class="reference-td" style="width:50px">' + 
									   	(i + 1) + 
									'</td>' + 
									'<td class="reference-td" id="tdCode' + i + '">' + 
										g_resultList[i].code + 
									'</td>' + 
									'<td class="reference-td" style="width:200px">' + 
									   	'<input type="text" id="pageNo' + i + '" name="pageNo' + i + '" class="form-control">' + 
									'</td>' + 
								'</tr>';
	   				$('#tableList').append(html);
	   			}
	   			//最后添加备注
   				var html = 	'<tr id="tableList">' + 
								'<td class="reference-td" style="width:50px">' + 
								   	'备注' + 
								'</td>' + 
								'<td class="reference-td">' + 
									'<input type="text" id="memoContent" name="memoContent" class="form-control">' + 
								'</td>' + 
								'<td class="reference-td" style="width:200px">' + 
								   	'<input type="text" id="memoPageNo" name="memoPageNo" class="form-control">' + 
								'</td>' + 
							'</tr>';
				$('#tableMemo').append(html);
	   		}
	   	}
	});
}

//添加问题
function addContent(){
	var html =  '<tr id="trAddContent' + g_index + '">' + 
					'<td class="reference-td" style="width:50px">' + 
					   	(g_index + 1) + 
					'</td>' + 
					'<td class="reference-td">' + 
						'<input type="text" id="code' + g_index + '" name="code' + g_index + '" class="form-control">' + 
					'</td>' + 
					'<td class="reference-td" style="width:200px">' + 
					   	'<input type="text" id="pageNo' + g_index + '" name="pageNo' + g_index + '" class="form-control">' + 
					'</td>' + 
				'</tr>';
	$('#tableAddList').append(html);
	g_index++;
}

function removeContent(){
	if(g_index == g_resultList.length){
		top.app.message.notice("不能移除自动生成的内容！");
		return ;
	}
	for(var i = g_index; i > 1; i--){
		if(document.getElementById("trAddContent" + i)){
			$('#trAddContent' + i).remove();
			g_index = i;
			break;
		}
	}
}

function resetList(data, code){
	for(var i = 0; i < data.length; i++){
		if(data[i].code.indexOf(code) != -1){
			g_resultList.push(data[i]);
			data.splice(i, 1);
			break;
		}
	}
	return data;
}

function getEditContent(){
	g_jsonData = eval("(" + g_params.subRow.content + ")");
	g_resultList = g_jsonData.list;
	var memo = g_jsonData.memo;
	g_index = g_resultList.length;//g_jsonData.listSize;
	
	$('#tableList').empty();
	//列出自动排序生成的列表
	for(var i = 0; i < g_jsonData.listSize; i++){
		var html = '<tr id="trAddContent' + i + '">' + 
					'<td class="reference-td" style="width:50px">' + 
					   	(i + 1) + 
					'</td>' + 
					'<td class="reference-td" id="tdCode' + i + '">' + 
						g_resultList[i].code + 
					'</td>' + 
					'<td class="reference-td" style="width:200px">' + 
					   	'<input type="text" id="pageNo' + i + '" name="pageNo' + i + '" value="' + g_resultList[i].pageNo + '" class="form-control">' + 
					'</td>' + 
				'</tr>'
		$('#tableList').append(html);
	}
	//列出主动添加
	for(var i = g_jsonData.listSize; i < g_resultList.length; i++){
		var html = '<tr id="trAddContent' + i + '">' + 
					'<td class="reference-td" style="width:50px">' + 
					   	(i + 1) + 
					'</td>' + 
					'<td class="reference-td">' + 
						'<input type="text" id="code' + i + '" name="code' + i + '" value="' + g_resultList[i].code + '" class="form-control">' + 
					'</td>' + 
					'<td class="reference-td" style="width:200px">' + 
					   	'<input type="text" id="pageNo' + i + '" name="pageNo' + i + '" value="' + g_resultList[i].pageNo + '" class="form-control">' + 
					'</td>' + 
				'</tr>'
		$('#tableList').append(html);
	}
	//最后添加备注
	var html = 	'<tr id="tableList">' + 
				'<td class="reference-td" style="width:50px">' + 
				   	'备注' + 
				'</td>' + 
				'<td class="reference-td">' + 
					'<input type="text" id="memoContent" name="memoContent" value="' + memo.memoContent + '" class="form-control">' + 
				'</td>' + 
				'<td class="reference-td" style="width:200px">' + 
				   	'<input type="text" id="memoPageNo" name="memoPageNo" value="' + memo.memoPageNo + '" class="form-control">' + 
				'</td>' + 
			'</tr>';
	$('#tableMemo').append(html);
	
}

function getViewContent(){
	g_jsonData = eval("(" + g_params.subRow.content + ")");
	g_resultList = g_jsonData.list;
	var memo = g_jsonData.memo;
	g_index = g_resultList.length;
	
	$('#tableList').empty();
	//列出自动排序生成的列表
	for(var i = 0; i < g_resultList.length; i++){
		var html = '<tr id="trAddContent' + i + '">' + 
					'<td class="reference-td" style="width:50px">' + 
					   	(i + 1) + 
					'</td>' + 
					'<td class="reference-td" id="tdCode' + i + '">' + 
						g_resultList[i].code + 
					'</td>' + 
					'<td class="reference-td" style="width:200px">' + 
						g_resultList[i].pageNo + 
					'</td>' + 
				'</tr>'
		$('#tableList').append(html);
	}
	//最后添加备注
	var html = 	'<tr id="tableList">' + 
				'<td class="reference-td" style="width:50px">' + 
				   	'备注' + 
				'</td>' + 
				'<td class="reference-td">' + 
					memo.memoContent + 
				'</td>' + 
				'<td class="reference-td" style="width:200px">' + 
					memo.memoPageNo + 
				'</td>' + 
			'</tr>';
	$('#tableMemo').append(html);

	$('#btnOK').remove();
	$('#btnAdd').remove();
	$('#btnDel').remove();
	$('#btnCancel').text("返 回")
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
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/editCaseCatalog?access_token=" + top.app.cookies.getCookiesToken(),
		submitData["id"] = g_params.id;
	} else{
		url = top.app.conf.url.apigateway + "/api/rales/ael/case/addCaseCatalog?access_token=" + top.app.cookies.getCookiesToken(),
//		submitData["code"] = $('#tableTitleMark').text();
//		submitData["codeCurNum"] = g_codeCurNum;
		submitData["registerId"] = g_params.row.id;
	}
	//获取列表
	var list = [];
	for(var i = 0; i < g_index; i++){
		if(document.getElementById("trAddContent" + i)){
			var obj = new Object();
			if(document.getElementById("tdCode" + i)) obj.code = $('#tdCode' + i).text();
			else obj.code = $('#code' + i).val();
			obj.pageNo = $('#pageNo' + i).val();
			list.push(obj);
		}
	}
	//获取备注
	var memo = new Object();
	memo.memoContent = $('#memoContent').val();
	memo.memoPageNo = $('#memoPageNo').val();
	//组合成对象
	var content = new Object();
	content.list = list;
	content.memo = memo;
	if(g_jsonData != null)
		content.listSize = g_jsonData.listSize;
	else
		content.listSize = g_resultList.length;
	//转换json
	submitData["content"] = JSON.stringify(content);
	
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
				window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}