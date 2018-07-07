var g_params = {}, g_backUrl = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	$('#name').text(g_params.row.name);
	$('#contactPhone').text(g_params.row.contactPhone);
	$('#content').text(g_params.row.content);
	$('#address').text(g_params.row.address);
	$('#reportDate').text(g_params.row.reportDate);
	$('#reportReply').text(g_params.row.reportReply);
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}