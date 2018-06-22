
var imUtils = imUtils || {};
(function() {
	
	imUtils.appKey = "1c11f4f64dce2f9c2536d5b08bfdd4fc";
	imUtils.appSecret = "5773ea09506a";
	imUtils.Nonce = "12345";
	
	/**
	 * 创建群
	 */
	imUtils.createTeam = function(tname, intro, callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/create.action',
		    method : 'POST',
		    data: {
		    	tname: tname,
		    	owner: top.app.info.userInfo.userCode,
		    	members: "[\"" + top.app.info.userInfo.userCode + "\"]",
		    	intro: intro,
		    	msg: "创建群",
		    	magree: "0",
		    	joinmode: "0",
		    	beinvitemode: "1",
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("创建群失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("创建群失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}
	
	/**
	 * 删除群
	 */
	imUtils.delTeam = function(tid, callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/remove.action',
		    method : 'POST',
		    data: {
		    	tid: tid,
		    	owner: top.app.info.userInfo.userCode,
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("删除群失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("删除群失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}
	
	/**
	 * 更新群
	 */
	imUtils.updateTeam = function(tid, tname, intro, callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/update.action',
		    method : 'POST',
		    data: {
		    	tid: tid,
		    	owner: top.app.info.userInfo.userCode,
		    	tname: tname,
		    	intro: intro,
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("更新群失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("更新群失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}
	
	/**
	 * 获取某用户所加入的群信息
	 */
	imUtils.getUserTeamList = function(callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/joinTeams.action',
		    method : 'POST',
		    data: {
		    	accid: top.app.info.userInfo.userCode,
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("获取群列表失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("获取群列表失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}
	
	/**
	 * 拉人入群
	 */
	imUtils.addToTeam = function(tid, members, callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/add.action',
		    method : 'POST',
		    data: {
		    	tid: tid,
		    	owner: top.app.info.userInfo.userCode,
		    	members: members,
		    	magree: "0",
		    	msg: '邀请入群'
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("拉人入群失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("拉人入群失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}

	/**
	 * 踢人出群
	 */
	imUtils.kickToTeam = function(tid, member, callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/kick.action',
		    method : 'POST',
		    data: {
		    	tid: tid,
		    	owner: top.app.info.userInfo.userCode,
		    	member: member,
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("踢人出群失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("踢人出群失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}

	/**
	 * 群信息与成员列表查询
	 */
	imUtils.queryTeam = function(tids, callbackSuccess, callbackError){
		var curTime = parseInt((new Date).getTime() / 1000);
		$.ajax({
		    url : 'https://api.netease.im/nimserver/team/query.action',
		    method : 'POST',
		    data: {
		    	tids: "[\"" + tids + "\"]", //tids,
		    	ope: "1",
		    },
		    beforeSend : function(req) {
		    	req.setRequestHeader('appKey', imUtils.appKey);
		    	req.setRequestHeader('Nonce', imUtils.Nonce);
		    	req.setRequestHeader('CurTime', curTime);
		    	req.setRequestHeader('CheckSum', sha1(imUtils.appSecret + imUtils.Nonce + curTime));
		    	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		    },success: function(data){
		    	if(data.code == '200'){
			    	if(callbackSuccess != undefined && callbackSuccess != null) callbackSuccess(data);
		    	}else{
					if(callbackError != undefined && callbackError != null) callbackError(data);
					console.error("群成员查询失败:" + data.desc);
		    	}
			},error:function(xhr, textStatus, errorThrown){
				console.error("群成员查询失败:" + xhr);
				if(callbackError != undefined && callbackError != null) callbackError();
    	   	}
		});
	}
})();