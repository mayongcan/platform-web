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

function initView(){
	//移除文书编号
	$('#tableTitleMark').remove();
	
	//公民选择
	$('input[type=checkbox][id=personType1]').change(function() { 
		$("#personType1").attr("checked",true);
		$("#personType2").attr("checked",false);
	});
	$('input[type=checkbox][id=personType2]').change(function() { 
		$("#personType2").attr("checked",true);
		$("#personType1").attr("checked",false);
	});
	
	setData();
	var height = ($('#tdAdviceContent').height() < 80) ? 130 : ($('#tdAdviceContent').height() + 70);
	$('#tdAdvice').height(height);
	height = ($('#tdSuggestContent').height() < 80) ? 130 : ($('#tdSuggestContent').height() + 70);
	$('#tdSuggest').height(height);
	height = ($('#tdDeptSuggestContent').height() < 80) ? 130 : ($('#tdDeptSuggestContent').height() + 70);
	$('#tdDeptSuggest').height(height);
	height = ($('#tdLawSuggestContent').height() < 80) ? 130 : ($('#tdLawSuggestContent').height() + 70);
	$('#tdLawSuggest').height(height);
	height = ($('#tdUnitSuggestContent').height() < 80) ? 130 : ($('#tdUnitSuggestContent').height() + 70);
	$('#tdUnitSuggest').height(height);
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);

	if(g_params.data.personType == '1') {
		$("#personType1").attr("checked",true);
		$('#trPersonType2_1').css('display', 'none');
		$('#trPersonType2_2').css('display', 'none');
	}
	else if(g_params.data.personType == '2') {
		$("#personType2").attr("checked",true);
		$('#trPersonType1_1').css('display', 'none');
		$('#trPersonType1_2').css('display', 'none');
	}
	//获取字典
	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');

	if(g_params.data.personType == '1') $("#personType1").attr("checked",true);
	else if(g_params.data.personType == '2') $("#personType2").attr("checked",true);

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
	$('#tdPartiesAge').text($.utils.getNotNullVal(g_params.data.partiesAge));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
	$('#tdLegalRepresentative').text($.utils.getNotNullVal(g_params.data.legalRepresentative));
	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdCompanyPhone').text($.utils.getNotNullVal(g_params.data.companyPhone));
	$('#tdBaseInfo').text($.utils.getNotNullVal(g_params.data.baseInfo));
	$('#tdHearingInfo').text($.utils.getNotNullVal(g_params.data.hearingInfo));
	$('#tdAdviceContent').text($.utils.getNotNullVal(g_params.data.advice));

	//承办人意见，显示历史处理意见
	getHistoryAuditListPreview_1(g_params.data.registerId, "4");
}

//获取历史审批意见列表
function getHistoryAuditListPreview_1(id, counterpartType, divObj, divContain){
	if(!$.utils.isEmpty(id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/ael/case/getCaseSuggestList",   		//请求后台的URL（*）
		    method: 'GET',
		    async: false,
		   	timeout:5000,
		    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		registerId: id,
	    		counterpartType: counterpartType,
				page: 0,
				size:50
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
		    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
		    			$('#tdSuggestContent').empty();
		    			$('#tdDeptSuggestContent').empty();
		    			$('#tdLawSuggestContent').empty();
		    			$('#tdUnitSuggestContent').empty();
		    			var html = "";
		    			for(var i = 0; i < data.rows.length; i++){
		    				if(top.app.hasRoleName(data.rows[i].userRoleName, "行政执法人员")){
			    				html = $.utils.getNotNullVal(data.rows[i].createUserName) + '意见：' + $.utils.getNotNullVal(data.rows[i].result) + 
	    								"<span style='margin-left:20px;'>时间：" + $.utils.getNotNullVal(data.rows[i].createDate) + "</span><br/>";
			    				$('#tdSuggestContent').append(html);
		    				}
		    				else if(top.app.hasRoleName(data.rows[i].userRoleName, "法制审核员")){
			    				html = $.utils.getNotNullVal(data.rows[i].createUserName) + '意见：' + $.utils.getNotNullVal(data.rows[i].result) + 
	    								"<span style='margin-left:20px;'>时间：" + $.utils.getNotNullVal(data.rows[i].createDate) + "</span><br/>";
			    				$('#tdSuggestContent').append(html);
		    				}
		    				else if(top.app.hasRoleName(data.rows[i].userRoleName, "部门领导") || top.app.hasRoleName(data.rows[i].userRoleName, "单位领导")){
			    				html = $.utils.getNotNullVal(data.rows[i].createUserName) + '意见：' + $.utils.getNotNullVal(data.rows[i].result) + 
	    								"<span style='margin-left:20px;'>时间：" + $.utils.getNotNullVal(data.rows[i].createDate) + "</span><br/>";
			    				$('#tdSuggestContent').append(html);
		    				}
		    				else if(top.app.hasRoleName(data.rows[i].userRoleName, "法规处领导")){
		    					html = $.utils.getNotNullVal(data.rows[i].createUserName) + '意见：' + $.utils.getNotNullVal(data.rows[i].result) + 
												"<span style='margin-left:20px;'>时间：" + $.utils.getNotNullVal(data.rows[i].createDate) + "</span><br/>";
					    				$('#tdLawSuggestContent').append(html);
		    				}else if(top.app.hasRoleName(data.rows[i].userRoleName, "委领导")){
			    				html = $.utils.getNotNullVal(data.rows[i].createUserName) + '意见：' + $.utils.getNotNullVal(data.rows[i].result) + 
	    								"<span style='margin-left:20px;'>时间：" + $.utils.getNotNullVal(data.rows[i].createDate) + "</span><br/>";
			    				$('#tdUnitSuggestContent').append(html);
		    				}
		    			}
	    				//重置高度
	    				var height = ($('#tdSuggest').height() < 80) ? 130 : ($('#tdSuggest').height() + 70);
	    				$('#tdSuggest').height(height);

	    				height = ($('#tdDeptSuggest').height() < 80) ? 130 : ($('#tdDeptSuggest').height() + 70);
	    				$('#tdDeptSuggest').height(height);

	    				height = ($('#tdLawSuggest').height() < 80) ? 130 : ($('#tdLawSuggest').height() + 70);
	    				$('#tdLawSuggest').height(height);

	    				height = ($('#tdUnitSuggest').height() < 80) ? 130 : ($('#tdUnitSuggest').height() + 70);
	    				$('#tdUnitSuggest').height(height);
		    		}
		   		}
			}
		});
	}
}
