var g_params = {}, g_iframeIndex = null;
var g_tagIdList = [], g_tagNameList = [];

$(function () {

    g_iframeIndex = parent.layer.getFrameIndex(window.name);
    formValidate();
    //取消按钮
    $("#layerCancel").click(function () {
        parent.layer.close(g_iframeIndex);
    });
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value) {
    g_params = value;
    //初始化界面
    initView();
    //获取标签列表
    getConfTagList();
}

/**
 * 初始化界面
 */
function initView() {
    //判断是新增还是修改
    if (g_params.type == "edit") {
        $('#confName').val(g_params.rows.confName);
    }
    //刷新数据，否则下拉框显示不出内容
    $('.selectpicker').selectpicker('refresh');
}

function getConfTagList() {
    $.ajax({
        url: top.app.conf.url.apigateway + "/api/extend/mas/conf/getConfTagList",
        method: 'GET',
        async: false,
        timeout: 5000,
        data: {
            access_token: top.app.cookies.getCookiesToken()
        },
        success: function (data) {
            if (top.app.message.code.success == data.RetCode) {
                $('#confTagList').empty();
                var html = "";
                for (var i = 0; i < data.rows.length; i++) {
                    html += '<button type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="addTag(\'' + data.rows[i].id + '\', \'' + data.rows[i].tagName + '\')">' +
                        data.rows[i].tagName +
                        '</button>';
                }
                $('#confTagList').append(html);
            }
        }
    });
}

function addTag(id, tagName) {
    for (var i = 0; i < g_tagIdList.length; i++) {
        if (id == g_tagIdList[i]) {
            top.app.message.notice("当前标签已添加！");
            return;
        }
    }
    $('#confSelectTag').append(
        '<button id="tagSelect' + id + '" type="button" class="btn btn-outline btn-default btn-table-opreate" onclick="removeTag(\'' + id + '\', \'' + tagName + '\')">' +
        tagName + '  <i class="glyphicon glyphicon-remove" aria-hidden="true"></i>' +
        '</button>'
    );
    g_tagIdList.push(id);
    g_tagNameList.push(tagName);
}

function removeTag(id, tagName) {
    $('#tagSelect' + id).remove();
    for (var i = 0; i < g_tagIdList.length; i++) {
        if (id == g_tagIdList[i]) {
            g_tagIdList.splice(i, 1);
            g_tagNameList.splice(i, 1);
            return;
        }
    }
}

/**
 * 表单验证
 */
function formValidate() {
    $("#divEditForm").validate({
        rules: {
            confName: {required: true},
        },
        messages: {},
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, {tips: [1, '#3595CC'], time: 2000});
                return false;
            });
        },
        //失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
            submitAction();
        }
    });
}

/**
 * 提交数据
 */
function submitAction() {
    if (g_tagIdList.length == 0) {
        top.app.message.notice("请选择签到信息！");
        return;
    }
    //定义提交数据
    var submitData = {};
    submitData["confName"] = $("#confName").val();
    submitData["tagList"] = g_tagIdList.toString();
    submitData["tagNameList"] = g_tagNameList.toString();
    if (location.port == 80) {
        submitData["codeUrl"] = "http://" + document.domain + "/extend/mas/mobile/conf-QRCode-sign.html";
    } else {
        submitData["codeUrl"] = "http://" + document.domain + ":" + location.port + "/extend/mas/mobile/conf-QRCode-sign.html";
    }

    //异步处理
    $.ajax({
        url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
        method: 'POST',
        data: JSON.stringify(submitData),
        contentType: "application/json",
        success: function (data) {
            top.app.message.loadingClose();
            if (top.app.message.code.success == data.RetCode) {
                //关闭页面前设置结果
                parent.app.layer.editLayerRet = true;
                top.app.message.notice("数据保存成功！");
                parent.layer.close(g_iframeIndex);
            } else {
                top.app.message.error(data.RetMsg);
            }
        }
    });
}