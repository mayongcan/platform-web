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
	//获取回复内容
	getResultList();
}


/**
 * 获取审批意见列表
 * @returns
 */
function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/ael/webreport/getReportReplyList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		reportId: g_params.row.id,
				page: 0,
				size:50
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
			    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
			    			g_dataList = data.rows;
			    			$('#resultList').empty();
			    			for(var i = 0; i < data.rows.length; i++){
			    				var html = '<tr>' + 
		    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].reply) + '</td>' + 
		    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createByName) + '</td>' + 
		    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate) + '</td>' + 
		    								'</tr>';
			    				$('#resultList').append(html);
			    			}
			    		}
			    		//设置右侧的高度和左侧一致
			    		$("#content-right").height($("#content-left").height());
		   		}
			}
		});
	}
}