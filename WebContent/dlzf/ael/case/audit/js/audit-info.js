var g_auditStatusDict1 = [], g_auditStatusDict2 = [], g_auditStatusDict3 = [], g_auditStatusDict4 = [];
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";

/**
 * 获取审批意见列表
 * @returns
 */
function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseSuggestList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		registerId: g_params.row.id,
	    		counterpartType: g_counterpartType,
				page: 0,
				size:50
		    },success: function(data){
			    	if(top.app.message.code.success == data.RetCode){
			    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
			    			g_dataList = data.rows;
			    			$('#resultList').empty();
			    			for(var i = 0; i < data.rows.length; i++){
			    				var html = '<tr>' + 
		    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createUserName) + '</td>' + 
		    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].result) + '</td>' + 
		    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate) + '</td>' + 
		    								'</tr>';
			    				$('#resultList').append(html);
			    			}
			    		}
			    		//设置右侧的高度和左侧一致
			    		$("#content-right").height($("#content-left").height());
		   		}
			}
		});
	}
}

function initOtherInfo(){
	//返回
	$("#btnCancel").click(function () {
		top.app.info.iframe.params = g_params;
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		var g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
		var cancelUrl = $.utils.getUrlParam(window.location.search,"cancelUrl");
		if($.utils.isEmpty(cancelUrl))
			window.location.href = g_backUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
		else
			window.location.href = cancelUrl + "?_pid=" + pid + "&navIndex=" + g_params.navIndex;
    });

	//选择指派人
	$("#assignHandleUser").click(function () {
		//设置参数
		var params = {};
		params.userIdList = g_userIdList;
		params.userCodeList = g_userCodeList;
		params.userNameList = g_userNameList;
		top.app.layer.editLayer('选择指派人', ['900px', '550px'], '/rales/ael/case/case-new-undertaker.html', params, function(retParams){
			if(retParams == null || retParams == undefined && retParams.length > 0) {
				top.app.message.alert("获取返回内容失败！");
				return;
			}
			g_userIdList = retParams[0].userIdList;
			g_userCodeList = retParams[0].userCodeList;
			g_userNameList = retParams[0].userNameList;
			$("#assignHandleUser").val(retParams[0].userNameList);
		});
    });

	//判断当前任务节点名称
	if(g_params.row.activityName == '部门领导审批'){
		g_auditStatusDict1 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_1');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict1);
	}else if(g_params.row.activityName == '单位领导审批'){
		g_auditStatusDict2 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_2');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict2);
		$('#trNeedLawOfficeAudit').css('display', '');
	}else if(g_params.row.activityName == '法规处领导审批'){
		g_auditStatusDict3 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_3');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict3);
	}else if(g_params.row.activityName == '委领导审批'){
		g_auditStatusDict4 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_4');
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict4);
	}else if(g_params.row.activityName == '法规处指派'){
//		g_auditStatusDict3 = top.app.getDictDataByDictTypeValue('AEL_CASE_AUDIT_STATUS_3');
//		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict3);
		$('#trAuditStatus').css('display', 'none');
		//显示指派选择框
		$('#trAssignHandleUser').css('display', '');
	}else{
		$('#trAuditStatus').css('display', 'none');
	}
	
	//第二承办人审批时，会办意见
	if(g_params.row.associateExecutor == top.app.info.userInfo.userId || g_params.row.createBy == top.app.info.userInfo.userId) 
		$('#tdTextResult').text("会办意见");
	//设置右侧的高度和左侧一致
	$("#content-right").height($("#content-left").height());
}