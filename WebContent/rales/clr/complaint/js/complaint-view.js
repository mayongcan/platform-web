var g_params = {}, g_backUrl = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search,"backUrl");
	g_params = top.app.info.iframe.params;
	//获取历史审批意见
	getResultList();
	initView();
	initData();
});

function getResultList(){
	if(!$.utils.isNull(g_params.row) && !$.utils.isNull(g_params.row.id)){
		$.ajax({
	        url: top.app.conf.url.apigateway + "/api/rales/clr/complaint/getComplaintSuggestList",   		//请求后台的URL（*）
		    method: 'GET',
		    data: {
	    		access_token: top.app.cookies.getCookiesToken(),
	    		complaintId: g_params.row.id,
				page: 0,
				size:50
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
		    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
		    			g_dataList = data.rows;
		    			$('#resultList').empty();
		    			for(var i = 0; i < data.rows.length; i++){
		    				var fileList = "";
		    				if(!$.utils.isNull(data.rows[i].files)) {
		    					fileList += '<table style="width: 100%;">' + 
												'<tbody>' + 
												'<tr>' + 
													'<td class="reference-td1" style="border-width: 0px;">' + 
														'<select class="selectpicker" id="selectFile' + i + '">';
		    					var arrayFileUrl = [], arrayFileName = [];
		    					arrayFileUrl = data.rows[i].files.split(',');
		    					for(var index = 0; index < arrayFileUrl.length; index++){				
		    						arrayFileName[index] = arrayFileUrl[index].substring(arrayFileUrl[index].lastIndexOf("/") + 1);
		    						fileList += "<option value='" + arrayFileUrl[index] + "'>" + arrayFileName[index] + "</option>";
		    					}
			    				fileList +='</select>' + 
													'</td>' + 
													'<td class="reference-td1" style="width:40px;border-width: 0px;">' + 
														'<button type="button" class="btn btn-white" onclick="getFile(' + i +')">查看附件</button>' + 
													'</td>' + 
												'</tr>' + 
											'</tbody>' + 
										'</table>';
		    				}
		    				var html = '<tr>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createUserName) + '</td>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].content) + '</td>' + 
	    									'<td class="reference-td1">' + $.utils.getNotNullVal(data.rows[i].createDate) + '</td>' +
	    									'<td class="reference-td1">' + 
	    										fileList +
			    							'</td>' + 
	    								'</tr>';
		    				$('#resultList').append(html);
		    				$('#selectFile'+i+'').selectpicker('refresh');
		    				$('#selectFile'+i+'').selectpicker('render');
		    			}
		    		}
		    		//设置右侧的高度和左侧一致
		    		$("#content-right").height($("#content-left").height());
		   		}
			}
		});
	}
}

function getFile(index){
	if(!$.utils.isEmpty($('#selectFile' + index).val()))
		window.open(top.app.conf.url.res.url + $('#selectFile' + index).val());
	else
		top.app.message.notice("当前列表没有附件！");
}

function initView(){
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });

	//查看附件内容
	$("#btnCheck").click(function () {
		if(!$.utils.isEmpty($('#selectFile').val()))
			window.open(top.app.conf.url.res.url + $('#selectFile').val());
		else
			top.app.message.notice("当前列表没有附件！");
    });
}

function initData(){
	$('#tdType').text(top.app.getDictName(g_params.row.type, g_params.typeDict));
	$('#tdSource').text(top.app.getDictName(g_params.row.source, g_params.sourceDict));
	$('#tdSex').text(top.app.getDictName(g_params.row.sex, g_params.sexDict));
	$('#tdName').text(g_params.row.name);
	$('#tdCertificateNo').text(g_params.row.certificateNo);
	$('#tdAge').text(g_params.row.age);
	$('#tdCompany').text(g_params.row.company);
	$('#tdAddress').text(g_params.row.address);
	$('#tdPhone').text(g_params.row.phone);
	$('#tdSendBy').text(g_params.row.sendByName);
	$('#tdContent').text(g_params.row.content);
	$('#tdFeedback').text(g_params.row.feedback);
	$('#tdDraftOpinion').text(g_params.row.draftOpinion);
	$('#tdFinalOpinion').text(g_params.row.finalOpinion);
	
	//显示文件列表
	var arrayFileUrl = [], arrayFileName = [];
	if(!$.utils.isNull(g_params.row.files)){
		arrayFileUrl = g_params.row.files.split(',');
		for(var i = 0; i < arrayFileUrl.length; i++){
			arrayFileName[i] = arrayFileUrl[i].substring(arrayFileUrl[i].lastIndexOf("/") + 1);
		}
	}
	for (var i = 0; i < length; i++) {
		console.log(arrayFileUrl[i]);
		console.log(arrayFileName[i]);
	}
	$('#selectFile').empty();
	var html = "";
	var length = arrayFileUrl.length;
	for (var i = 0; i < length; i++) {
		html += "<option value='" + arrayFileUrl[i] + "'>" + arrayFileName[i] + "</option>";
	}
	$('#selectFile').append(html);
	
}