var g_navIndex = 1, g_params = {}, g_backUrl = "", g_pid = "";
$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_pid = $.utils.getUrlParam(window.location.search,"_pid");
	g_params = top.app.info.iframe.params;
	initNavButton();
});

function initNavButton(){
	//初始化导航条
	$('.nav-detail li').hover(function () {
		$('span', this).css('background', '#1FAEFF');
		$('a', this).css('color', '#000');
	}, function () {
		if(this.id == 'navDetail1' && g_navIndex == 1){
		}else if(this.id == 'navDetail2' && g_navIndex == 2){
		}else if(this.id == 'navDetail3' && g_navIndex == 3){
		}else {
			$('span', this).css('background', '#d4d4d4');
			$('a', this).css('color', '#666');
		}
	});
	//初始化导航条按钮
	$('#navDetail1').click(function () {
		g_navIndex = 1;
		$('#navDetail1 span').css('background', '#1FAEFF');
		$('#navDetail2 span').css('background', '#d4d4d4');
		$('#navDetail3 span').css('background', '#d4d4d4');
		$('#navDetail1 a').css('color', '#000');
		$('#navDetail2 a').css('color', '#666');
		$('#navDetail3 a').css('color', '#666');
		
		document.getElementById("case-iframe").src="/rales/ael/force/form-1.html";
    });
	$('#navDetail2').click(function () {
		g_navIndex = 2;
		$('#navDetail1 span').css('background', '#d4d4d4');
		$('#navDetail2 span').css('background', '#1FAEFF');
		$('#navDetail3 span').css('background', '#d4d4d4');
		$('#navDetail1 a').css('color', '#666');
		$('#navDetail2 a').css('color', '#000');
		$('#navDetail3 a').css('color', '#666');
		
		document.getElementById("case-iframe").src="/rales/ael/force/form-2.html";
    });
	$('#navDetail3').click(function () {
		g_navIndex = 3;
		$('#navDetail1 span').css('background', '#d4d4d4');
		$('#navDetail2 span').css('background', '#d4d4d4');
		$('#navDetail3 span').css('background', '#1FAEFF');
		$('#navDetail1 a').css('color', '#666');
		$('#navDetail2 a').css('color', '#666');
		$('#navDetail3 a').css('color', '#000');
		
		document.getElementById("case-iframe").src="/rales/ael/force/form-3.html";
    });
	
	//判断是否触发
	var navIndex = $.utils.getUrlParam(window.location.search,"navIndex");
	if(navIndex == 1) $('#navDetail1').trigger("click");
	else if(navIndex == 2) $('#navDetail2').trigger("click");
	else if(navIndex == 3) $('#navDetail3').trigger("click");
}

var ifr = document.getElementById('case-iframe');
ifr.onload = function() {
	//重置iframe高度
	ifr.style.height = '0px';
    var iDoc = ifr.contentDocument || ifr.document;
    ifr.style.height = $.utils.calcPageHeight(iDoc) + 'px';
}