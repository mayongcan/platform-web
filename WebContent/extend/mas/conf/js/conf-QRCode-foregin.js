var g_params = {};
var g_id = null;
var g_operUrl = null;

function getUrlParms(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

$(function () {
    // g_iframeIndex = parent.layer.getFrameIndex(window.name);
    g_id = getUrlParms("id");
    initView();
});


/**
 * 获取从父窗口传送过来的值
 * @param value
 */
// function receiveParams(value) {
//     g_params = value;
//     g_id = g_params.id;
//     g_operUrl = g_params.operUrl;
//     //初始化界面
//     initView();
// }

/**
 * 初始化界面
 */
function initView() {

    var data = {};
    data["confId"] = g_id;
    $.ajax({
        url: top.app.conf.url.apigateway + "/api/extend/mas/inf/showQrCode?access_token=" + top.app.cookies.getCookiesToken(),
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            if (top.app.message.code.success == data.RetCode) {
                console.log(top.app.conf.url.res.url + data.rows[0].qrPath);
                $("#QRPath").attr("src", top.app.conf.url.res.url + data.rows[0].qrPath);
            }
        }

    });
}

