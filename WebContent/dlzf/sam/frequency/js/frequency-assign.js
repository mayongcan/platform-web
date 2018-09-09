

$(function () {
	top.app.message.loading();
	//初始化字典
	initDict();
	initView();
	formValidate();
	top.app.message.loadingClose();
	
});

/**
 * 初始化字典
 * @returns
 */
function initDict(){
}


function initView(){
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	statName: {required: true},
        },
        messages: {
        },
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
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
 * @returns
 */
function submitAction(){
	top.app.message.loading();
	//定义提交数据
	var submitData = {};
	submitData["statName"] = $("#statName").val();
	submitData["statAddr"] = $("#statAddr").val();
	submitData["statHeight"] = $("#statHeight").val();
	submitData["sysType"] = $("#sysType").val();
	submitData["telMode"] = $("#telMode").val();
	submitData["longitude"] = $("#longitude").val();
	submitData["latitude"] = $("#latitude").val();
	submitData["freqBegin"] = $("#freqBegin").val();
	submitData["freqEnd"] = $("#freqEnd").val();
	submitData["freqStep"] = $("#freqStep").val();
	submitData["receivingThreshold"] = $("#receivingThreshold").val();
	submitData["ciThreshold"] = $("#ciThreshold").val();
	submitData["workType"] = $('#divWorkType input:radio:checked').val();
	submitData["pow"] = $("#pow").val();
	submitData["recStatus"] = $("#recStatus").val();
	submitData["antennaHeight"] = $("#antennaHeight").val();
	submitData["antennaMode"] = $("#antennaMode").val();
	submitData["antennaAngle"] = $("#antennaAngle").val();
	submitData["diAngle"] = $("#diAngle").val();
	submitData["memo"] = $("#memo").val();
	//异步处理
	$.ajax({
		url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/addSimulate?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			//加载结果数据
	   			loadResultData(data.RetData);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

function loadResultData(data){
	$('#tableResult1').css('display', '');
	$('#tableResult2').css('display', '');
	$('#btnDetail').css('display', '');

	$("#btnDetail").click(function () {
		window.open(top.app.conf.url.res.url + "2_" + data.id + "_" + data.freqBegin + "-" + data.freqEnd + ".pdf");
    });
	
	$.ajax({
        url: top.app.conf.url.apigateway + "/api/rales/sam/frequency/getSimulateEmcList",   		//请求后台的URL（*）
	    method: 'GET',
	    data: {
    		access_token: top.app.cookies.getCookiesToken(),
    		simulateId: data.id,
			page: 0,
			size:50
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		if(!$.utils.isNull(data.rows) && data.rows.length > 0){
	    			$('#resultList1').empty();
	    			for(var i = 0; i < data.rows.length; i++){
	    				var html = '<tr>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].occupyCount) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].maxPower) + '</td>' +
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].maxPowerName) + '</td>' +
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].quality) + '</td>' +
    								'</tr>';
	    				$('#resultList1').append(html);
	    			}
	    			
	    			$('#resultList2').empty();
	    			for(var i = 0; i < data.rows.length; i++){
	    				var img = '<img src="/rales/img/icon-no.png" style="width:20px;height:20px;">';
		    			if(data.rows[i].isUse == '1') img = '<img src="/rales/img/icon-yes.png" style="width:20px;height:20px;">';
	    				var html = '<tr>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].frequency) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + $.utils.getNotNullVal(data.rows[i].quality) + '</td>' + 
    									'<td class="reference-td" style="text-align: center;">' + img + '</td>' + 
    								'</tr>';
	    				$('#resultList2').append(html);
	    			}
	    		}
	   		}
		}
	});
}