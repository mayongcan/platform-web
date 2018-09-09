g_loadCheckBoxStyle = false;
var g_params = {}, g_iframeIndex = null;
var g_filePath = null, g_fileSize = 0, g_fileNum = 0;

var arrayFileUrl = [], arrayFileName = [];

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.app.layer.editLayerRet = true;
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '520px'
	});
//	setTimeout(function () {
//		$("input[type=checkbox]").each(function(i){
//	    	var $check = $(this);
//	        var name = $check.attr("name");
//	        if(!name) { name = $check.attr("id");}
//	        if(!name) return;
//	        var id = name + "-" + i;
//	        var $label = $('<label for="'+ id +'"></label>');
//	        $check.attr("id", id).parent().addClass("checkbox").append($label);
//	    });
//    }, 100);
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/clr/laws/getList",
	    method: 'GET',
	    async: false,
	   	timeout:5000,
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	id: g_params.row.id
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   			g_params.row = data.rows[0];
	   			initView();
	   		}
	   	}
	});
}

/**
 * 初始化界面
 */
function initView(){
	$('#name').val(g_params.row.name);
	//显示文件列表
	if(!$.utils.isNull(g_params.row.files)){
		arrayFileUrl = g_params.row.files.split(',');
		for(var i = 0; i < arrayFileUrl.length; i++){
			arrayFileName[i] = arrayFileUrl[i].substring(arrayFileUrl[i].lastIndexOf("/") + 1);
		}
	}
	$('#selectFile').empty();
	var html = "";
	var length = arrayFileUrl.length;
	for (var i = 0; i < length; i++) {
		html += "<option value='" + arrayFileUrl[i] + "'>" + arrayFileName[i] + "</option>";
	}
	$('#selectFile').append(html);
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
	//下载附件
	$("#layerOk").click(function () {
//		if(!$.utils.isEmpty($('#selectFile').val())){
//			window.open(top.app.conf.url.res.downloadFile + "?files=" + $('#selectFile').val());
//		}
//		else
//			top.app.message.notice("当前列表没有附件！");
		var fileList = "";
		$("input[type=checkbox]").each(function(i, functio){
	    	var $check = $(this);
	    	if($check.is(":checked")) {
	    		fileList += $check.attr("url") + ","
	    	}
	    });
		setTimeout(function () {
			if(!$.utils.isEmpty(fileList))
				window.open(top.app.conf.url.res.downloadFile + "?files=" + fileList);
			else{
				top.app.message.notice("请选择需要下载的附件！");
			}
	    }, 500);
    });
	
	//显示附件列表
	$('#resultList').empty();
	for (var i = 0; i < length; i++) {
		if($.utils.isEmpty(arrayFileUrl[i])) continue;
		var html = '<tr>' + 
						'<td class="reference-td1" style="text-align: center;">' +
							'<div class="checkbox">' +
							    '<input type="checkbox" id="type+' + i +'" name="type+' + i +'" url="' + arrayFileUrl[i] + '">' +
							    '<label for="type+' + i +'" name="type+' + i +'"> </label>' +
							'</div>' +
						'</td>' + 
						'<td class="reference-td">' + arrayFileName[i] + '</td>' + 
						'<td class="reference-td">' + 
							'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDel(\'' + arrayFileUrl[i] + '\')">' + 
								'删除' + 
							'</button>' +
							'<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="btnEventDownload(\'' + arrayFileUrl[i] + '\')">' + 
								'下载' + 
							'</button>' +
						'</td>' + 
					'</tr>';
		$('#resultList').append(html);
	}
}

function btnEventDel(url){
	var length = arrayFileUrl.length;
	var files = "", num = 0;
	for (var i = 0; i < length; i++) {
		if(url == arrayFileUrl[i]) continue;
		files += arrayFileUrl[i] + ",";
		num++;
	}
	//更新数据
	var submitData = {};
	//如果变更了clientId，则需要传送到后端
	submitData["id"] = g_params.row.id;
	submitData["isUpdateFiles"] = "1";
	submitData["files"] = files;
	submitData["num"] = num;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/clr/laws/edit" + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				g_params.row = data.RetData;
				//刷新界面
				initView();
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function btnEventDownload(url){
	if(!$.utils.isEmpty(url)){
		window.open(top.app.conf.url.res.downloadFile + "?files=" + $('#selectFile').val());
	}
	else
		top.app.message.notice("附件的下载地址为空！");
}
