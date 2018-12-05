var g_params = {}, g_iframeIndex = null;

$(function () {

    g_iframeIndex = parent.layer.getFrameIndex(window.name);
    top.app.message.loading();

});

/**
 * 获取从父窗口传送过来的值
 *
 * @param value
 */
function receiveParams(value) {
    g_params = value;
    // 初始化界面
    loadResultData();
}

function loadResultData(data) {
    top.app.message.loadingClose();
    $.ajax({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getNetStDict",
        method: 'GET',
        async: false,
        timeout: 5000,
        data: {
            access_token: top.app.cookies.getCookiesToken(),
        },
        success: function (data) {
            if (top.app.message.code.success == data.RetCode) {
                g_netStDict = data.RetData;
                for (var i = 0; i < g_netStDict.length; i++) {
                    if (g_netStDict[i].ID.indexOf(g_params.telMode) != -1) {
                        $('#telMode').html(g_netStDict[i].NAME);
                        break;
                    }
                }
            }
        }
    });
    $.ajax({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getNetSvnDict",
        method: 'GET',
        async: false,
        timeout: 5000,
        data: {
            access_token: top.app.cookies.getCookiesToken(),
        },
        success: function (data) {
            if (top.app.message.code.success == data.RetCode) {
                g_netSvnDict = data.RetData;
                for (var i = 0; i < g_netSvnDict.length; i++) {
                    if (g_netSvnDict[i].ID.indexOf(g_params.sysType) != -1) {
                        $('#sysType').html(g_netSvnDict[i].NAME);
                        break;
                    }
                }
                console.log(g_netSvnDict);
            }
        }
    });
    $('#statAddr').html(g_params.statAddr);
    $('#statHeight').html(g_params.statHeight);


    $('#longitude').html(g_params.longitude);
    $('#latitude').html(g_params.latitude);
    $('#freqBegin').html(g_params.freqBegin);
    $('#freqEnd').html(g_params.freqEnd);
    $('#pow').html(g_params.pow);
    $('#recStatus').html(g_params.recStatus);
    $('#antennaHeight').html(g_params.antennaHeight);
    $('#antennaMode').html(g_params.antennaMode);
    $('#freqPoint').html(g_params.freqPoint);
    $('#channelWidth').html(g_params.channelWidth);

    if (g_params.pdfPath2) {
        var dataPath = JSON.parse(g_params.pdfPath2);
        console.log(dataPath);
        for (var i = 0; i < dataPath.length; i++) {
            var html = '<tr>'
                + '<td class="reference-td" style="text-align: center;">'
                + $.utils.getNotNullVal(dataPath[i].stationName) + '</td>'
                + '<td class="reference-td" style="text-align: center;">'
                + $.utils.getNotNullVal(dataPath[i].stationAddr) + '</td>'
                + '<td class="reference-td" style="text-align: center;">'
                + $.utils.getNotNullVal(dataPath[i].freq) + '</td>'
                + '</tr>';
            $('#resultList1').append(html);
        }
    }
    if (g_params.pdfPath3) {
        dataPath = JSON.parse(g_params.pdfPath3);
        for (var i = 0; i < dataPath.length; i++) {
            var html = '<tr>'
                + '<td class="reference-td" style="text-align: center;">'
                + $.utils.getNotNullVal(dataPath[i].stationName) + '</td>'
                + '<td class="reference-td" style="text-align: center;">'
                + $.utils.getNotNullVal(dataPath[i].stationAddr) + '</td>'
                + '<td class="reference-td" style="text-align: center;">'
                + $.utils.getNotNullVal(dataPath[i].freq) + '</td>'
                + '</tr>';
            $('#resultList2').append(html);
        }
    }

}