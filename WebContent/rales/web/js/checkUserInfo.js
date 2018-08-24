var value=null;
var openId = null;
$(function(){
	getUserInfo();
})

function getUserInfo(){
	wchat.getUserInfo("USS-170311-001","00beeba4e75bbc60047bd957606b0105",wchat.getIdentity(),function(data) {
		var result = JSON.parse(data);
		if(result.status==1){
			//判断是否存在openId
			var submitData = {};
			submitData["openId"] = result.data.openId;
			openId = result.data.openId;
			$.ajax({
				url: top.app.conf.url.apigateway + "/api/rales/web/checkOpenId",
//				url: "http://192.168.20.147:8050/api/adpf/userInfo/checkOpenId",
				method: 'POST',
				data:JSON.stringify(submitData),
				contentType: "application/json",
				success: function(data){
					if(top.app.message.code.success == data.RetCode){
						//打开app
						openApp();
					}else{
						$(".logindiv").show();
					}
				}
			});
		}else{
			console.log(result.message);
		}
	});
	wchat.showConsoleMessage(true);
}

function saveUserInfo(){
	if($(".userCode").val() == ""){
		$(".userCode").attr("placeholder","请输入账号");
		return false;
	}

	if($(".password").val() == ""){
		$(".password").attr("placeholder","请输入密码");
		return false;
	}

	var subData = {};
	subData["userCode"] = $(".userCode").val();
	subData["password"] = $(".password").val();
	subData["openId"] = openId;
	$.ajax({
//		url:"http://192.168.20.147:8050/api/adpf/userInfo/saveUserInfo",
		url: top.app.conf.url.apigateway + "/api/rales/websaveUserInfo",
		method: 'POST',
		data:JSON.stringify(subData),
		contentType: "application/json",
		success: function(data){
			if(top.app.message.code.success == data.RetCode){
				//打开app
				openApp();
			}else{
				alert(data.RetMsg);
			}
		}
	});
}

function openApp(){
	wchat.openAppWithUriString("dlzf://?openId=" + openId,function(data) {
		var result = JSON.parse(data);
		if(result.status==1){

		}else{
			console.log(result.message);
		}
	});
}