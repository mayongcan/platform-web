var g_params = {}, g_iframeIndex = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
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
	$('#name').text($.utils.getNotNullVal(g_params.rows.name));
	$('#certificateNo').text($.utils.getNotNullVal(g_params.rows.certificateNo));
	$('#company').text($.utils.getNotNullVal(g_params.rows.company));
	$('#legalRepresentative').text($.utils.getNotNullVal(g_params.rows.legalRepresentative));
	$('#address').text($.utils.getNotNullVal(g_params.rows.address));
	$('#zip').text($.utils.getNotNullVal(g_params.rows.zip));
	$('#contactPhone').text($.utils.getNotNullVal(g_params.rows.contactPhone));
	$('#result').text(top.app.getDictName(g_params.rows.result, g_params.resultDict));

	//显示文件列表
	var arrayFileUrl = [], arrayFileName = [];
	if(!$.utils.isNull(g_params.rows.files)){
		arrayFileUrl = g_params.rows.files.split(',');
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
	
	//查看附件内容
	$("#btnCheck").click(function () {
		if(!$.utils.isEmpty($('#selectFile').val()))
			window.open(top.app.conf.url.res.url + $('#selectFile').val());
		else
			top.app.message.notice("当前列表没有附件！");
    });
}
