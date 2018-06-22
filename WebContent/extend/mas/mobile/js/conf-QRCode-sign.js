var tagLength = null, confId = null, access_token = null, confName = null;
$(function () {

    app.getToken("mas", "111111");

    var params = {};
    //登陆接口，报错access_token
    var url = location.search;
    if (url.indexOf("?") != -1) {//表示有参数，url后的？参数
        var submitParams = url.substr(1);
        var strs = submitParams.split("&");
        params["confId"] = strs[0].split("=")[1];
        params["randomNum"] = strs[1].split("=")[1];
    }

    $.ajax({
        url: top.app.conf.url.apigateway + "/api/extend/mas/inf/confSignDetails?access_token=" + top.app.cookies.getCookiesToken(),
        method: "POST",
        data: JSON.stringify(params),
        contentType: "application/json",
        success: function (data) {
            if ("51006" == data.RetCode) {
                $("form").hide();
                $("#detailsDiv").append("<lable>" + data.RetMsg + "</label>");
            } else if (top.app.message.code.success == data.RetCode) {
                confName = data.masConf.confName;
                $("title").html(data.masConf.confName);
                confId = data.masConf.id;
                var tagList = data.masConfTag;
                var str = "";
                tagLength = tagList.length;
                for (var i = 0; i < tagList.length; i++) {
                    str += ' <div class="weui-cell"> '
                        + ' <div class="weui-cell__hd"><label id="tagName' + i + '" class="weui-label">' + tagList[i].tagName + '</label></div>'
                        + '<div class="weui-cell__bd">'
                        + '  <input class="weui-input" type="text"  id="tagVal' + i + '" name="tagVal' + i + '"   placeholder="' + tagList[i].tagName + '">'
                        + ' </div>'
                        + '  </div>'

                    // str += "<div style=\"margin-top:5%;width:100%;line-height:60px;height:60px;\">"
                    //     + "<div style=\"width:20%;float:left; padding-left:10px;\"><label id=\"tagName" + i + "\" style=\"text-align:right;height:25px; \">" + tagList[i].tagName + "</label></div>"
                    //     + "<div style=\"float:left;\ width:70%; \"><input type=\"text\" id=\"tagVal" + i + "\" name=\"tagVal" + i + "\" "
                    //     + "style=\"border-color:white;border-width:0;height:25px;width:200px; \" placeholder=\"\""
                    //     + " class=\"required\" ></div>"
                    //     + "</div>";
                }
                if ("" != str) {
                    $(".weui-cells_form").after(str);
                }
            }
        }
    });

    formValidate();
});

/**
 * 表单验证
 */
function formValidate() {
    $("#divEditForm").validate({
        rules: {},
        messages: {},
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                /*               layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });*/
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

    //定义提交数据
    var submitData = {};
    var signKey = "";
    var signVal = "";
    for (var i = 0; i < tagLength; i++) {
        signKey += $("#tagName" + i).html();
        signVal += $("#tagVal" + i).val();
        if (i != tagLength - 1) {
            signKey += ",";
            signVal += ",";
        }
    }
    submitData["signKey"] = signKey;
    submitData["signVal"] = signVal;
    submitData["siteId"] = confId;
    if ($("#confirm").is(":checked") == true) {
        submitData["tagList"] = signKey;
        submitData["tagVal"] = signVal;
    }
    //异步处理
    $.ajax({
        url: top.app.conf.url.apigateway + "/api/extend/mas/conf/addSignInfo?access_token=" + top.app.cookies.getCookiesToken(),
        method: 'POST',
        data: JSON.stringify(submitData),
        contentType: "application/json",
        success: function (data) {
            top.app.message.loadingClose();
            if (top.app.message.code.success == data.RetCode) {
                var url = "conf-img-upload.html?confId=" + confId + "&confName=" + confName + "&signId=" + data.signId;
                window.location.href = encodeURI("bindwx-success.html");
            }

        }
    });
}

function getToken(username, password, callbackSuccess) {
    $.ajax({
        url: app.conf.url.getTokenUrl,
        method: 'POST',
        data: {
            grant_type: "password",
            username: username,
            password: password
        },
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', app.conf.url.basicAuth);
        },
        success: function (data) {
            if (data.access_token == null || data.access_token == undefined || data.access_token == "") {
                if (callbackError != undefined && callbackError != null) callbackError("获取授权失败");
                return;
            }
            //将token相关数据写入cookies
            access_token = data.access_token;
            if (callbackSuccess != undefined && callbackSuccess != null) callbackSuccess();
        }
    });
}