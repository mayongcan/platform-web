var g_params = {}, g_iframeIndex = null;

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//启动加载层
	top.app.message.loading(0);
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

/**
 * 初始化界面
 */
function initView(){
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/device/getDetailInfo",
	    method: 'GET',
//	    async: false,
//	   	timeout:5000,
	   	data:{
	    	access_token: top.app.cookies.getCookiesToken(),
	    	id: g_params.row.id
	   	},
	   	success: function(data){
	   		if(top.app.message.code.success == data.RetCode){
	   		//显示附件列表
	   			$('#resultList').empty();
	   			for (var i = 0; i < data.RetData.length; i++) {
	   				var ret = "合格", style='';
	   				if($.utils.isNull(data.RetData[i].objMap)) {
	   					ret = "不合格";
	   					style='style="color:red"'
	   				}
	   				var html = '<tr>' + 
	   								'<td class="reference-td" rowspan="2">' + (i+1) + '</td>' + 
	   								'<td class="reference-td" rowspan="2" ' + style + '>' + ret + '</td>';
	   				if($.utils.isNull(data.RetData[i].objMap)){
	   					html += '<td class="reference-td">上传资料</td>' +
	   							'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_model) +'</td>' +
	   							'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_auth) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_menu) +'</td>' +
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_pow) +'</td>' + 		   					
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.frequencyRange) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.periodDate) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.deviceId) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.name) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.bandwidth) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.emissionLimits) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.approvedDate) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.antGain) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_code) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.et_equ_no) +'</td>' + 
		   					'</tr>';
	   					html += '<td class="reference-td">设备核准库</td>' +
	   							'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
		   					'</tr>';
	   				}else{
	   					html += 
	   							'<td class="reference-td">上传资料</td>' +
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_model) +'</td>' +
	   							'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_auth) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_menu) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_pow) +'</td>' + 		   					
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.frequencyRange) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.periodDate) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.deviceId) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.name) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.bandwidth) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.emissionLimits) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.approvedDate) +'</td>' +  
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.antGain) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.equ_code) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].equsMap.et_equ_no) +'</td>' + 
			   				'</tr>';
	   					html += 
	   							'<td class="reference-td">设备核准库</td>' +
	   							'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.model) +'</td>' + 
								'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.code) +'</td>' + 
								'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.vendor) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.transmissionPower) +'</td>' + 			   					
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.frequencyRange) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.periodDate) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.deviceId) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.name) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.bandwidth) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.emissionLimits) +'</td>' + 
			   					'<td class="reference-td">' + $.utils.getNotNullVal(data.RetData[i].objMap.approvedDate) +'</td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' + 
			   					'<td class="reference-td"></td>' +
		   					'</tr>';
	   				}
	   				$('#resultList').append(html);
	   			}
	   		}
			top.app.message.loadingClose();
	   	}
	});
}
