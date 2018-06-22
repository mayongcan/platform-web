var tagLength = null, confId = null, access_token = null, confName = null, signId = null;
var afterIfExist = false, frontIfExist = false, localIfExist= false;
$(function () {

	var params = {};
	var url = location.search;
	if (url.indexOf("?") != -1) {//表示有参数，url后的？参数
		var submitParams = url.substr(1);
		var strs = submitParams.split("&");
		confId = strs[0].split("=")[1];
		confName = strs[1].split("=")[1];
		signId = strs[2].split("=")[1];
	}
	formValidate();
	init();

	$("#afterImage").change(function () {
		var file = this.files[0];
		if (window.FileReader) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			//监听文件读取结束后事件
			reader.onloadend = function (e) {
				upload(e.target.result.split(",")[1], confName + "-" + signId + "-后视全景", "after");
				$("#afterImageDiv").hide();
			};
		}

	});
	$("#frontImage").change(function () {
		var file = this.files[0];
		if (window.FileReader) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			//监听文件读取结束后事件
			reader.onloadend = function (e) {
				upload(e.target.result.split(",")[1], confName + "-" + signId + "-前视全景", "front");
				$("#frontImageDiv").hide();
			};
		}
	});
	$("#localImage").change(function () {
		var file = this.files[0];
		if (window.FileReader) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			//监听文件读取结束后事件
			reader.onloadend = function (e) {
				upload(e.target.result.split(",")[1], confName + "-" + signId + "-局部特写", "local");
				$("#localImageDiv").hide();
			};
		}
	});



});

/*
 * 初始化是判断是否有图片存在
 */
function init(){
	var addData = {};
	addData["confId"] = confId;
	addData["createBy"] = signId;
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/extend/mas/confImg/getImgList?access_token=" + top.app.cookies.getCookiesToken(),
		method: 'POST',
		data: JSON.stringify(addData),
		contentType: "application/json",
		success: function (data) {
			if (top.app.message.code.success == data.RetCode) {
				for(var i = 0; i<data.rows.length;i++){
					if("后视全景" == data.rows[i].imageTag){
						$("#after").html("");
						var str = '<li class="weui-uploader__file" style="background-image:url(' + data.rows[i].imagePath + ')"></li>';
						$("#after").html(str)
						$("#after" ).attr("src",  data.rows[i].imagePath);
						$("#after").attr("imgurl", data.rows[i].imagePath);
						
						$("#afterImageDiv").hide();
						afterIfExist = true;
					}
					if("前视全景" == data.rows[i].imageTag){
						$("#front").html("");
						var str = '<li class="weui-uploader__file" style="background-image:url(' + data.rows[i].imagePath + ')"></li>';
						$("#front").html(str)
						$("#frontImageDiv").hide();
						frontIfExist = true;
					}
					if("局部特写" == data.rows[i].imageTag){
						$("#local").html("");
						var str = '<li class="weui-uploader__file" style="background-image:url(' + data.rows[i].imagePath + ')"></li>';
						$("#local").html(str)
						$("#localImageDiv").hide();
						localIfExist = true;
					}
				}
			}
		}
	});
} 


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
	submitData["siteId"] = confId;
	submitData["createBy"] = signId;
	var paths = "";
	var tags = "";
	if($("#after").has("li").length == 1){
		if(false == afterIfExist){
			paths += $("#after").attr("imgurl");
			tags += "后视全景";
		}
	}
	if ($("#front").has("li").length ==1) {
		if(false == frontIfExist){

			if (paths != "") {
				paths += ",";
			}
			if (tags != "") {
				tags += ",";
			}
			paths += $("#front").attr("imgurl");
			tags += "前视全景";
		}
	}
	if ($("#local").has("li").length == 1) {
		if(false == localIfExist){

			if (paths != "") {
				paths += ",";
			}
			if (tags != "") {
				tags += ",";
			}
			paths += $("#local").attr("imgurl");
			tags += "局部特写";
		}
	}

	submitData["paths"] = paths;
	submitData["tags"] = tags;

	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/extend/mas/confImg/addSiteImg?access_token=" + top.app.cookies.getCookiesToken(),
		method: 'POST',
		data: JSON.stringify(submitData),
		contentType: "application/json",
		success: function (data) {
			if (top.app.message.code.success == data.RetCode) {
				$("#subtons").hide();
				$(".weui-uploader__input-box").hide();

				$.alert("上传成功");  //alert("上传成功");

			}
		}
	});
}


var upload = function uploadImg(path, name, id) {

	var subData = {};
	subData["path"] = path;
	subData["name"] = name;
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/extend/mas/confImg/uploadImg?access_token=" + top.app.cookies.getCookiesToken(),
		method: 'POST',
		data: JSON.stringify(subData),
		contentType: "application/json",
		success: function (data) {
			if (top.app.message.code.success == data.RetCode) {
				// alert(top.app.conf.url.res.url + data.path);

				$("#" + id).html("");

				var str = '<li class="weui-uploader__file" style="background-image:url(' + top.app.conf.url.res.url + data.path + ')"></li>';

				$("#" + id).html(str);

				$("#" + id).attr("src", top.app.conf.url.res.url + data.path);
				$("#" + id).attr("imgurl", data.path);
			}
		}
	});
}

