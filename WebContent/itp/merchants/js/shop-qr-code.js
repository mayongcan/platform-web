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
	$('#qrcBody').empty();
	$('#qrcBody').qrcode({width: 256,height: 256,text: encrypto(g_params.code) });
	
	//canvas转img
    var qrcSrc = $("canvas")[0].toDataURL();
    $("#qrcBodyImg .qrcImg").attr("src", qrcSrc);
	$("#qrcBody").hide();//隐藏canvas部分
	$("#qrcBodyImg").show();//显示img部分

	$("#layerOk").click(function () {
		$("#printContent").print({
			noPrintSelector: ".no-print",
			title: "　",
			deferred: $.Deferred().done(function(){
			})
		});
    });
}

//加密
function encrypto( code ) {
	var c=String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }
    return(escape(c));
}

//解密
function decrypto( code ) { 
	code=unescape(code);
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++){
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
    return c;
}
