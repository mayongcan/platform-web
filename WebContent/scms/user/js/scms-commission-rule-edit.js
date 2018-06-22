var g_params = null, g_backUrl = "", g_commissionIndex = 1, g_commissionStart = [], g_commissionEnd = [], g_commissionIsValid = true;
var $tableUser = $('#tableListUser'), g_sexDict = [];
var g_selectRowsId = [];

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	g_sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
	initView();
	initData();
	initTableUser();
    //加载用户列表
    $tableUser.bootstrapTable('refresh', {"url": top.app.conf.url.apigateway + "/api/scms/user/getMerchantsUserList"});
	formValidate();
	$('.selectpicker').selectpicker('refresh');
	top.app.message.loadingClose();
});

function initView(){
	top.app.addComboBoxOption($("#clearingType"), g_params.clearingTypeDict);
	top.app.addComboBoxOption($("#clearingPeriod"), g_params.clearingPeriodDict);
	//获取店铺下拉列表
	scms.getShopPullDown($("#shopId"), scms.getUserMerchantsId(), false);
	$('#clearingStart2').empty();
	for(var i = 1; i <= 31; i++){
		$('#clearingStart2').append('<option value="' + i + '号">' + i + '号</option>');
	}
	$('.selectpicker').selectpicker('refresh');
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
	//添加提成区间
	$('#btnAddCommission').click(function () {
		addCommission("0.00", "0.00", "0.00");
    });

	// 下拉框变更事件
	$('#clearingPeriod').on('changed.bs.select',
		function(e) {
			changePeriodEvent();
		}
	);
	$('#shopId').on('changed.bs.select',
		function(e) {
			g_selectRowsId = [];
		    //店铺切换，重新加载用户列表
		    $tableUser.bootstrapTable('refresh', {"url": top.app.conf.url.apigateway + "/api/scms/user/getMerchantsUserList"});
		}
	);
	
	//格式化百分比
	new Cleave('#percent0', {
	    numeral: true,
	    numeralIntegerScale: 2,
	    numeralDecimalScale: 2
	});
}

function changePeriodEvent(){
	if ($('#clearingPeriod').val() == '1') {
		$('#trClearingStart1').css('display', 'none');
		$('#trClearingStart2').css('display', 'none');
	} else if ($('#clearingPeriod').val() == '2') {
		$('#trClearingStart1').css('display', '');
		$('#trClearingStart2').css('display', 'none');
	} else if ($('#clearingPeriod').val() == '3') {
		$('#trClearingStart1').css('display', 'none');
		$('#trClearingStart2').css('display', '');
	}
}

function inputEvent(index){
	for(var i = index; i >= 1; i--){
		if(i == 1) $('#end0').val($('#end' + index).val());
		else{
			if(document.getElementById("start" + i)){
				$('#start' + (i - 1)).val($('#end' + index).val());
//				$('#end' + (i - 1)).val($('#end' + index).val());
				break;
			}
		}
	}
}

function removeCommission(index){
	//衔接数据
	if(index == 1) $('#end0').val(0);
	else{
		for(var i = index - 1; i >= 1; i--){
			if(document.getElementById("start" + i)){
				$('#start' + i).val($('#start' + index).val());
				break;
			}
		}
	}
	//删除
	$('#trCommissionSet' + index).remove();
}

function getComissionPercent(){
	//需要判断规则是否合理，如果end >= start 下级
	g_commissionIsValid = true;
	var dataList = [];
	for(var i = g_commissionIndex; i >= 0; i--){
		var obj = new Object();
		if(document.getElementById("percent" + i)){
			if(i == 0) {
				obj.start = $('#end' + i).val();
				obj.end = -1;
				obj.percent = $('#percent' + i).val();
			}
			else{
				obj.start = g_commissionStart[i].getRawValue(); //$('#start' + i).val();
				obj.end = g_commissionEnd[i].getRawValue();
				obj.percent = $('#percent' + i).val();
				//规则不合理
				if(parseInt(obj.start) > parseInt(obj.end)) g_commissionIsValid = false;
			}
			dataList.push(obj);
		}
	}
	return dataList;
}

function initData(){
	if(g_params.type == 'edit'){
		$('#ruleName').val(g_params.row.ruleName);
		$("#shopId").val(g_params.row.shopId);
		$("#clearingType").val(g_params.row.clearingType);
		$("#clearingPeriod").val(g_params.row.clearingPeriod);
		if(g_params.row.clearingPeriod == "2")
			$("#clearingStart1").val(g_params.row.clearingStart);
		else if(g_params.row.clearingPeriod == "3")
			$("#clearingStart2").val(g_params.row.clearingStart);
		changePeriodEvent();
		
		//显示提成设置
		var dataList = eval("(" + g_params.row.commissionPercent + ")");
		var data0 = dataList[dataList.length - 1];
		$('#percent0').val(data0.percent);
		$('#end0').val(data0.start);
		for(var i = (dataList.length - 2);i >= 0; i--){
			addCommission(dataList[i].start, dataList[i].end, dataList[i].percent);
		}
		
		//显示选中的用户列表
		if(!$.utils.isEmpty(g_params.row.userIdList)){
			var tmpIdArray = g_params.row.userIdList.split(',');
			for(var i = 0;i < tmpIdArray.length; i++){
				var rowObj = []; 
				rowObj.userId = tmpIdArray[i];
				g_selectRowsId.push(rowObj);
			}
		}
	}
}

function addCommission(start, end, percent){
	var html = '<tr id="trCommissionSet' + g_commissionIndex + '">' +
					'<td class="reference-td">' +
						'<div class="input-group" style="float:left;width:133px">' + 
							'<span class="input-group-addon">¥</span>' + 
							'<input type="text" id="start' + g_commissionIndex + '" name="start' + g_commissionIndex + '" class="form-control" value="' + start + '" disabled>' +
						'</div>' + 
					   	'<div style="float:left;margin-left:10px;margin-right:10px;">至</div> ' +
						'<div class="input-group" style="float:left;width:133px">' + 
							'<span class="input-group-addon">¥</span>' + 
					   		'<input type="text" id="end' + g_commissionIndex + '" name="end' + g_commissionIndex + '" class="form-control" value="' + end + '" oninput="inputEvent(' + g_commissionIndex + ')" onporpertychange="inputEvent(' + g_commissionIndex + ')">' +
					   	'</div>' + 
					'</td>' +
					'<td class="reference-td">' +
						'<div class="input-group">' + 
					   		'<input type="text" id="percent' + g_commissionIndex + '" name="percent' + g_commissionIndex + '" class="form-control" value="' + percent + '">' +
					   		'<span class="input-group-addon">%</span>' +
						'</div>' + 
					'</td>' +
					'<td class="reference-td">' +
					   	'<button type="button" class="btn btn-outline btn-default btn-table-opreate" style="height: 30px;padding: 6px 14px;" onclick="removeCommission(' + g_commissionIndex + ')">' +
							'<i class="glyphicon glyphicon-trash" aria-hidden="true"></i> 删除 ' +
					  	'</button>' +
					'</td>' +
					'<script>new Cleave("#percent' + g_commissionIndex + '", {numeral: true,numeralIntegerScale: 2,numeralDecimalScale: 2});</script> ' +
					'<script>g_commissionStart[' + g_commissionIndex + '] = new Cleave("#start' + g_commissionIndex + '", {numeral: true,numeralThousandsGroupStyle: "thousand"});</script> ' +
					'<script>g_commissionEnd[' + g_commissionIndex + '] = new Cleave("#end' + g_commissionIndex + '", {numeral: true,numeralThousandsGroupStyle: "thousand"});</script> ' +
				'</tr>';
	$('#tbodyCommissionSet').prepend(html);
	g_commissionIndex++;
}

/**
 * 初始化列表信息
 */
function initTableUser(){
	//搜索参数
	var searchParamsUser = function (params) {
        var param = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: params.limit,   						//页面大小
            page: params.offset / params.limit,  		//当前页
			merchantsId: scms.getUserMerchantsId(),
			shopId: $("#shopId").val(),
        };
        return param;
    };
    //初始化列表
	$tableUser.bootstrapTable({
        queryParams: searchParamsUser,										//传递参数（*）
        uniqueId: 'userId',
        onClickRow: function(row, $el){
	        	g_selectUserRow = row;
	        	appTable.setRowClickStatus($tableUser, row, $el);
        }
    });

	//checkbox监听事件
	$tableUser.on('check.bs.table', function (row, rowData) {
		if($.utils.isNull(g_selectRowsId)) {
			g_selectRowsId = [];
			g_selectRowsId.push(rowData);
		}
		else g_selectRowsId.push(rowData);
    });
	$tableUser.on('check-all.bs.table', function (rows, rowsData) {
		if($.utils.isNull(g_selectRowsId)) g_selectRowsId = rowsData;
		else{
			var length = g_selectRowsId.length;
			var tmpLength = rowsData.length;
			var isExist = false;
			for(var i = 0; i < tmpLength; i++){
				isExist = false;
				for(var j = 0; j < length; j++){
					if(g_selectRowsId[i].userId == rowsData.userId) {
						isExist = true;
						break;
					} 
				}
				if(!isExist){
					g_selectRowsId.push(rowsData[i]);
				}
			}
		}
    });
	$tableUser.on('uncheck.bs.table', function (row, rowData) {
		if($.utils.isNull(g_selectRowsId)) return;
		else{
			for(var i = 0; i < g_selectRowsId.length; i++){
				if(g_selectRowsId[i].userId == rowData.userId) {
					g_selectRowsId.splice(i, 1);
					break;
				} 
			}
		}
    });
	$tableUser.on('uncheck-all.bs.table', function (rows, rowsData) {
		if($.utils.isNull(g_selectRowsId)) return;
		else{
			var tmpLength = rowsData.length;
			for(var i = 0; i < tmpLength; i++){
				for(var j = 0; j < g_selectRowsId.length; j++){
					if(g_selectRowsId[i].userId == rowsData.userId) {
						g_selectRowsId.splice(j, 1);
						break;
					} 
				}
			}
		}
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	ruleName: {required: true},
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
            //提交内容
        		submitAction();
        }
    });
}

/**
 * 提交数据
 * @returns
 */
function submitAction(){
	var merchantsId = scms.getUserMerchantsId();
	if($.utils.isEmpty(merchantsId)){
		top.app.message.noticeError("您没有绑定商户，不能进行当前操作！");
		return;
	}
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.row.id;
	
	submitData["merchantsId"] = merchantsId;
	submitData["ruleName"] = $('#ruleName').val();
	submitData["shopId"] = $("#shopId").val();
	submitData["clearingType"] = $("#clearingType").val();
	submitData["clearingPeriod"] = $("#clearingPeriod").val();
	if($('#clearingPeriod').val() == '1')
		submitData["clearingStart"] = '';
	else if($('#clearingPeriod').val() == '2')
		submitData["clearingStart"] = $("#clearingStart1").val();
	else if($('#clearingPeriod').val() == '3')
		submitData["clearingStart"] = $("#clearingStart2").val();
	submitData["commissionPercent"] = JSON.stringify(getComissionPercent());
	if(g_commissionIsValid == false){
		top.app.message.noticeError("请检查您的提成设置，销量区间设值不当！");
		return;
	}
	
	var idList = "";
	for(var i = 0; i < g_selectRowsId.length; i++){
		idList += g_selectRowsId[i].userId + ",";
	}
	if(idList != '') idList = idList.substring(0, idList.length - 1);
	submitData["userIdList"] = idList;
	
	top.app.message.loading();
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
	    dataType: "json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


function tableFormatIsAdmin(value, row) {
	if(value == '1') return "<span style='color:red'>是</span>";
	else return "否";
}

function tableFormatSex(value, row) {
	return appTable.tableFormatDictValue(g_sexDict, value);
}


/**
 * 格式化
 * @param value
 * @param row
 */
function tableFormatCheckbox(value, row) {
	var hasVal = false;
	for(var i = 0; i < g_selectRowsId.length; i++){
		if(g_selectRowsId[i].userId == row.userId) {
			hasVal = true;
			break;
		} 
	}
	return hasVal;
}