var g_params = {}, g_iframeIndex = null;
var g_filePath = null, g_fileSize = 0, g_fileNum = 0;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	//设置select的宽度
	$('.selectpicker').selectpicker({
		width: '520px'
	});
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	$('#name').val(g_params.row.name);
	//显示文件列表
	var arrayFileUrl = [], arrayFileName = [];
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
		if(!$.utils.isEmpty($('#selectFile').val())){
			window.open(top.app.conf.url.res.downloadFile + "?files=" + $('#selectFile').val());
		}
		else
			top.app.message.notice("当前列表没有附件！");
    });
}
