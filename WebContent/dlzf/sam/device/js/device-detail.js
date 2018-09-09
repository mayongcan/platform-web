var g_params = {}, g_backUrl = null;
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	initView();
});

function initView(){
	if(!$.utils.isNull(g_params) && !$.utils.isNull(g_params.row)){
		$('#deviceId').text(g_params.row.deviceId);
		$('#code').text(g_params.row.code);
		$('#model').text(g_params.row.model);
		$('#name').text(g_params.row.name);
		$('#frequencyRange').text(g_params.row.frequencyRange);
		$('#transmissionPower').text(g_params.row.transmissionPower);
		$('#bandwidth').text(g_params.row.bandwidth);
		$('#emissionLimits').text(g_params.row.emissionLimits);
		$('#vendor').text(g_params.row.vendor);
		$('#periodDate').text(g_params.row.periodDate);
		$('#approvedDate').text($.date.dateFormat(g_params.row.approvedDate, "yyyy-MM-dd"));
	}
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
	
}
