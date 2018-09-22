var g_auditStatusDict0 = [{'ID': '10', 'NAME': '通过'}, {'ID': '0', 'NAME': '返回经办人'}, {'ID': '1', 'NAME': '返回会办人'}]; 
var g_auditStatusDict1 = [{'ID': '10', 'NAME': '通过'}, {'ID': '0', 'NAME': '返回经办人'}, {'ID': '1', 'NAME': '返回会办人'}, {'ID': '2', 'NAME': '返回法制审核员'}]; 
var g_auditStatusDict2 = [{'ID': '10', 'NAME': '通过'}, {'ID': '0', 'NAME': '返回经办人'}, {'ID': '1', 'NAME': '返回会办人'}, {'ID': '2', 'NAME': '返回法制审核员'}, {'ID': '3', 'NAME': '返回副处长审批'}];
var g_auditStatusDict3 = [{'ID': '10', 'NAME': '通过'}, {'ID': '0', 'NAME': '返回经办人'}, {'ID': '1', 'NAME': '返回会办人'}, {'ID': '2', 'NAME': '返回法制审核员'}, {'ID': '3', 'NAME': '返回副处长审批'}, {'ID': '4', 'NAME': '返回处长审批'}]; 
var g_auditStatusDict4 = [{'ID': '10', 'NAME': '通过'}, {'ID': '0', 'NAME': '返回经办人'}, {'ID': '1', 'NAME': '返回会办人'}, {'ID': '2', 'NAME': '返回法制审核员'}, {'ID': '3', 'NAME': '返回副处长审批'}, {'ID': '4', 'NAME': '返回处长审批'}, {'ID': '5', 'NAME': '返回法规处审批'}];
var g_userIdList = "", g_userCodeList = "", g_userNameList = "";
var g_jumpStatusDict1 = [{'ID': '1', 'NAME': '法制审核员'}, {'ID': '2', 'NAME': '副处长'}, {'ID': '3', 'NAME': '处长'}];
var g_jumpStatusDict2 = [{'ID': '2', 'NAME': '副处长'}, {'ID': '3', 'NAME': '处长'}];
var g_jumpStatusDict3 = [{'ID': '3', 'NAME': '处长'}, {'ID': '4', 'NAME': '法规处领导'}, {'ID': '5', 'NAME': '委领导'}];
var g_jumpStatusDict4 = [{'ID': '4', 'NAME': '法规处领导'}, {'ID': '5', 'NAME': '委领导'}];

/**
 * 获取处理意见列表
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
			    								'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].userRoleMemo) + '意见</td>' +
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
		top.app.layer.editLayer('选择指派人', ['900px', '550px'], '/rales/ael/case/case-law-user.html', params, function(retParams){
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
	if(g_params.row.activityName == '初步审批' || g_params.row.activityName == '调查报告审批' || g_params.row.activityName == '行政处罚审批' || 
			g_params.row.activityName == '结案报告审批' || g_params.row.activityName == '案件移送(立案)审批' || g_params.row.activityName == '案件移送(调查报告)审批' ||
			g_params.row.activityName == '不予行政处罚决定审批' || g_params.row.activityName == '行政检查审批' || g_params.row.activityName == '第二承办人审批' || 
			g_params.row.activityName == '先行登记保存证据审批' || g_params.row.activityName == '行政强制措施及相关事项内部审批' || g_params.row.activityName == '行政处罚决定法制审核'|| 
			g_params.row.activityName == '听证审批表审批' || g_params.row.activityName == '行政处罚没收财物处理审批' || g_params.row.activityName == '行政处罚延期（分期）缴纳罚款审批' || 
			g_params.row.activityName == '行政强制执行及相关事项内部审批' || g_params.row.activityName == '销案审批'){
		$('#trAuditStatus').css('display', 'none');
		$('#trJumpStatus').css('display', '');
		top.app.addComboBoxOption($("#jumpStatus"), g_jumpStatusDict1);
	}else if(g_params.row.activityName == '法制审核员审批'){
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict0);
		$('#trJumpStatus').css('display', '');
		top.app.addComboBoxOption($("#jumpStatus"), g_jumpStatusDict2);
	}else if(g_params.row.activityName == '部门领导审批'){
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict1);
		$('#trJumpStatus').css('display', '');
		top.app.addComboBoxOption($("#jumpStatus"), g_jumpStatusDict3);
	}else if(g_params.row.activityName == '单位领导审批'){
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict2);
		$('#trJumpStatus').css('display', '');
		top.app.addComboBoxOption($("#jumpStatus"), g_jumpStatusDict4);
//		$('#trNeedLawOfficeAudit').css('display', '');
	}else if(g_params.row.activityName == '法规处领导审批'){
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict3);
	}else if(g_params.row.activityName == '委领导审批'){
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict4);
	}else if(g_params.row.activityName == '法规处指派'){
		top.app.addComboBoxOption($("#auditStatus"), g_auditStatusDict3);
//		$('#trAuditStatus').css('display', 'none');
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