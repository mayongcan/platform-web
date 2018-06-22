var g_params = null, g_backUrl = "";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	getArticleContent();
	initView();
	top.app.message.loadingClose();
});

/**
 * 获取文章内容
 */
function getArticleContent(){
	$.ajax({
	    url: top.app.conf.url.apigateway + "/api/itp/cms/getArticleContent?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken(),
	    	id: g_params.rows.id
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		$('#content').html(data.RetData);
	    	}else{
	    		top.app.message.error(data.RetMsg);
	    	}
		}
	});
}

/**
 * 初始化界面
 */
function initView(){
	$('#title').text(g_params.rows.title);
	$('#shortTitle').text(g_params.rows.shortTitle);
	$('#categoryName').text(g_params.rows.categoryName);
	$('#articleDesc').text(g_params.rows.articleDesc);
	$('#keywords').text(g_params.rows.keywords);
	$('#weight').text(g_params.rows.weight);
	$('#weightDate').text(g_params.rows.weightDate);
	$('#source').text(g_params.rows.source);
	$('#author').text(g_params.rows.author);
	$('#articleLink').text(g_params.rows.articleLink);
	$('#isOutLink').text(g_params.rows.isOutLink);
	$('#publishDate').text(g_params.rows.publishDate);
	$('#status').text(g_params.rows.status);
	$('#totalHits').text(g_params.rows.totalHits);
	$('#hits').text(g_params.rows.hits);
	$('#content').text(g_params.rows.content);
	
	if(!$.utils.isEmpty(g_params.rows.image)) {
		var tmpImage = top.app.conf.url.res.url + g_params.rows.image;
		$('#image').html('<a href="' + tmpImage + '" target="_blank" onMouseOver="itp.onMouseOverImage(event, \'' + tmpImage +'\')", onMouseOut="itp.onMouseOutImage()" title="">显示图片</a>');
	}
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}
