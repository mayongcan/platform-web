var g_navIndex = 1, g_subIndex = 1, g_params = {}, g_btnType = 1, g_isEdit = 0, g_addInquiryReportProcedure = false;
$(function () {
	g_subIndex = $.utils.getUrlParam(window.location.search,"subIndex");
	g_params = top.app.info.iframe.params;
	initView();
	initNavButton();
	//判断如果案件已完结,则移除相关内容
	if(g_params.isFinish){
		$('#auditNoticeTip').remove();
	}
});

function initView(){
	//必要流程
	if($.utils.isEmpty(g_params.row.subFlowProgress)){
		//设置顶部显示
		$('#caseRegisterCode').text(g_params.row.code);
		if(g_params.row.flowProgress == '3' || g_params.row.flowProgress == '5')
			$('#flowProgressName').text(top.app.getDictName(g_params.row.flowProgress, g_params.flowProgressDict));
		else
			$('#flowProgressName').text(top.app.getDictName(g_params.row.flowProgress, g_params.flowProgressDict) + "报告");
		
		//设置按钮显示和操作
		if(g_params.row.activityName == '立案审批' || g_params.row.activityName == '行政处罚' || g_params.row.activityName == '结案报告'){
			$('#btnAudit').text("提交审批");
			$('#flowProgressNotice').text("待提交审批，请提交审批！");
			g_btnType = 2;
			g_isEdit = 1;
		}else if(g_params.row.activityName == '归档'){
			$('#btnAudit').text("结束流程");
			g_btnType = 3;
			g_isEdit = 1;
		}else if(g_params.row.activityName == '案件登记编辑' || g_params.row.activityName == '立案审批编辑'
			|| g_params.row.activityName == '调查报告编辑' || g_params.row.activityName == '行政处罚编辑' || g_params.row.activityName == '结案报告编辑'){
			$('#btnAudit').text("重新提交");
			$('#flowProgressNotice').text("待编辑，请重新编辑后提交审批！");
			g_btnType = 4;
			g_isEdit = 1;
		}else if(g_params.row.activityName == '调查报告' ){
			$('#btnAudit').text("提交审批");
			$('#flowProgressNotice').text("待创建，请创建后提交审批！");
			//如果是调查报告，提交流程的时候需要写入调查报告处理程序
			g_btnType = 2;
			g_isEdit = 1;
			g_addInquiryReportProcedure = true;
		}else{
			g_btnType = 1;
		}
	}//非必要流程
	else{
		//设置顶部显示
		$('#caseRegisterCode').text(g_params.row.otherFlowCode);
		if(g_params.row.subFlowProgress == '10')
			$('#flowProgressName').text("证据保全措施审批报告");
		else if(g_params.row.subFlowProgress == '11')
			$('#flowProgressName').text("听证审批报告");
		else if(g_params.row.subFlowProgress == '12')
			$('#flowProgressName').text("听证报告书");
		
		if(g_params.row.activityName == '决议书编辑' || g_params.row.activityName == '听证审批表编辑' || g_params.row.activityName == '听证报告书编辑'){
			$('#btnAudit').text("重新提交");
			$('#flowProgressNotice').text("待编辑，请重新编辑后提交审批！");
			g_btnType = 4;
		}else{
			g_btnType = 1;
		}
	}
}

function initNavButton(){
	//审批按钮点击
	$('#btnAudit').click(function () {
		if(g_btnType == 1){
			//根据必要流程的状态，进入不同的审批页面
			top.app.info.iframe.params = g_params;
			top.app.info.iframe.params.navIndex = g_navIndex;
			var pid = $.utils.getUrlParam(window.location.search,"_pid");
			var url = "";
			if($.utils.isEmpty(g_params.row.subFlowProgress)){
				if(g_params.row.flowProgress == '1')
					url = "/rales/ael/case/audit/audit-1.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				else if(g_params.row.flowProgress == '2')
					url = "/rales/ael/case/audit/audit-2.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				else if(g_params.row.flowProgress == '3')
					url = "/rales/ael/case/audit/audit-3.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				else if(g_params.row.flowProgress == '4')
					url = "/rales/ael/case/audit/audit-4.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				else if(g_params.row.flowProgress == '5')
					url = "/rales/ael/case/audit/audit-5.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
			}else{
				if(g_params.row.subFlowProgress == '10'){			//证据保全措施审批
					url = "/rales/ael/case/audit/audit-10.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				}else if(g_params.row.subFlowProgress == '11'){		//听证审批
					url = "/rales/ael/case/audit/audit-11.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				}else if(g_params.row.subFlowProgress == '12'){		//听证报告书
					url = "/rales/ael/case/audit/audit-12.html?_pid=" + pid + "&backUrl=/rales/ael/case/case-detail.html";
				}
			}
			window.location.href = encodeURI(url);
		}else if(g_btnType == 2 || g_btnType == 4){
			//先判断是否有创建文书
			if(g_btnType == 2 && g_navIndex != 2) {
				$('#navDetail2').trigger("click");
				setTimeout(function () {
					submitAudit();
			    }, 1500);
			}else{
				submitAudit();
			}
		}else if(g_btnType == 3){
			submitAudit();
		}
    });
	
	//初始化导航条
	$('.nav-detail li').hover(function () {
		$('span', this).css('background', '#1FAEFF');
		$('a', this).css('color', '#000');
	}, function () {
		if(this.id == 'navDetail1' && g_navIndex == 1){
		}else if(this.id == 'navDetail2' && g_navIndex == 2){
		}else if(this.id == 'navDetail3' && g_navIndex == 3){
		}else {
			$('span', this).css('background', '#d4d4d4');
			$('a', this).css('color', '#666');
		}
	});
	//初始化导航条按钮
	$('#navDetail1').click(function () {
		g_navIndex = 1;
		$('#navDetail1 span').css('background', '#1FAEFF');
		$('#navDetail2 span').css('background', '#d4d4d4');
		$('#navDetail3 span').css('background', '#d4d4d4');
		$('#navDetail1 a').css('color', '#000');
		$('#navDetail2 a').css('color', '#666');
		$('#navDetail3 a').css('color', '#666');
		
		document.getElementById("case-iframe").src="/rales/ael/case/base/info.html";
    });
	$('#navDetail2').click(function () {
		g_navIndex = 2;
		$('#navDetail1 span').css('background', '#d4d4d4');
		$('#navDetail2 span').css('background', '#1FAEFF');
		$('#navDetail3 span').css('background', '#d4d4d4');
		$('#navDetail1 a').css('color', '#666');
		$('#navDetail2 a').css('color', '#000');
		$('#navDetail3 a').css('color', '#666');
		
		document.getElementById("case-iframe").src="/rales/ael/case/necessity/index.html";
    });
	$('#navDetail3').click(function () {
		g_navIndex = 3;
		$('#navDetail1 span').css('background', '#d4d4d4');
		$('#navDetail2 span').css('background', '#d4d4d4');
		$('#navDetail3 span').css('background', '#1FAEFF');
		$('#navDetail1 a').css('color', '#666');
		$('#navDetail2 a').css('color', '#666');
		$('#navDetail3 a').css('color', '#000');
		
		document.getElementById("case-iframe").src="/rales/ael/case/optional/index.html?subIndex=" + g_subIndex;
    });
	
	//判断是否触发
	var navIndex = $.utils.getUrlParam(window.location.search,"navIndex");
	if(navIndex == 1) $('#navDetail1').trigger("click");
	else if(navIndex == 2) $('#navDetail2').trigger("click");
	else if(navIndex == 3) $('#navDetail3').trigger("click");
}

//提交审批
function submitAudit(){
	if(g_btnType == 2 && $("#case-iframe")[0].contentWindow.getTableCnt() == 0){
		top.app.message.notice("请先创建审批文书再提交！");
		return;
	}
	var notice = "确定要提交审批？";
	if(g_btnType == 4) notice = "确定要重新提交审批？";
	if(g_btnType == 3) notice = "确定要结束流程？";
	top.app.message.confirm(notice, function(){
		top.app.message.loading();
		var submitData = {};
		submitData["taskId"] = g_params.row.taskId;
		submitData["processInstanceId"] = g_params.row.processInstanceId;
		submitData["processDefinitionId"] = g_params.row.processDefinitionId;
		submitData["registerId"] = g_params.row.id;
		//用于处理非必要流程外的三个流程
		if(!$.utils.isEmpty(g_params.row.subFlowProgress)){
			submitData["subFlowProgress"] = g_params.row.subFlowProgress;
			submitData["otherFlowId"] = g_params.row.otherFlowId;
		}
		//判断是否需要写入调查报告的程序处理类型
		if(g_addInquiryReportProcedure){
			$.ajax({
				url: top.app.conf.url.apigateway + '/api/rales/ael/case/getCaseReportList',
			    method: 'GET',
			    async: false,
			   	timeout:5000,
			   	data:{
			   		access_token: top.app.cookies.getCookiesToken(),
			   		registerId: g_params.row.id
			   	},
				success: function(data){
					if(top.app.message.code.success == data.RetCode && data.rows != null && data.rows != undefined && data.rows.length > 0){
						submitData["inquiryReportProcedure"] = data.rows[0].inquiryReportProcedure;
			   		}
		        }
			});
		}
		//提交审批
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/case/caseFlowNext?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data:JSON.stringify(submitData),
			contentType: "application/json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
		   			top.app.message.notice("数据提交成功！");
		   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
		   			window.location.href = "/rales/ael/case/case-todo.html?_pid=" + pid;
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
	});
}

var ifr = document.getElementById('case-iframe');
ifr.onload = function() {
	//重置iframe高度
	ifr.style.height = '0px';
    var iDoc = ifr.contentDocument || ifr.document;
    ifr.style.height = $.utils.calcPageHeight(iDoc) + 'px';
}