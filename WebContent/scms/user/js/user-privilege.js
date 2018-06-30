var g_params = null, g_backUrl = "";

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	initView();
	formValidate();
	top.app.message.loadingClose();
});


function initView(){
	if(!$.utils.isEmpty(g_params.row.privilegeContent)){
		var jsonData = eval("(" + g_params.row.privilegeContent + ")");
		$("#addOrder").prop("checked", jsonData.addOrder);
		$("#editOrder").prop("checked", jsonData.editOrder);
		$("#addGoods").prop("checked", jsonData.addGoods);
		$("#editGoods").prop("checked", jsonData.editGoods);
		$("#delGoods").prop("checked", jsonData.delGoods);
		$("#addGoodsCategory").prop("checked", jsonData.addGoodsCategory);
		$("#editGoodsCategory").prop("checked", jsonData.editGoodsCategory);
		$("#delGoodsCategory").prop("checked", jsonData.delGoodsCategory);
		$("#addDailyExpenses").prop("checked", jsonData.addDailyExpenses);
		$("#editDailyExpenses").prop("checked", jsonData.editDailyExpenses);
		$("#delDailyExpenses").prop("checked", jsonData.delDailyExpenses);
		$("#addCustomer").prop("checked", jsonData.addCustomer);
		$("#editCustomer").prop("checked", jsonData.editCustomer);
		$("#delCustomer").prop("checked", jsonData.delCustomer);
		$("#addSupplier").prop("checked", jsonData.addSupplier);
		$("#editSupplier").prop("checked", jsonData.editSupplier);
		$("#delSupplier").prop("checked", jsonData.delSupplier);
		$("#addCustomerType").prop("checked", jsonData.addCustomerType);
		$("#editCustomerType").prop("checked", jsonData.editCustomerType);
		$("#delCustomerType").prop("checked", jsonData.delCustomerType);
		$("#addCustomerLevel").prop("checked", jsonData.addCustomerLevel);
		$("#editCustomerLevel").prop("checked", jsonData.editCustomerLevel);
		$("#delCustomerLevel").prop("checked", jsonData.delCustomerLevel);
		$("#addColor").prop("checked", jsonData.addColor);
		$("#editColor").prop("checked", jsonData.editColor);
		$("#delColor").prop("checked", jsonData.delColor);
		$("#addTexture").prop("checked", jsonData.addTexture);
		$("#editTexture").prop("checked", jsonData.editTexture);
		$("#delTexture").prop("checked", jsonData.delTexture);
		$("#addSize").prop("checked", jsonData.addSize);
		$("#editSize").prop("checked", jsonData.editSize);
		$("#delSize").prop("checked", jsonData.delSize);
		$("#addVender").prop("checked", jsonData.addVender);
		$("#editVender").prop("checked", jsonData.editVender);
		$("#delVender").prop("checked", jsonData.delVender);
		$("#addTransport").prop("checked", jsonData.addTransport);
		$("#editTransport").prop("checked", jsonData.editTransport);
		$("#delTransport").prop("checked", jsonData.delTransport);
		$("#addPayInfo").prop("checked", jsonData.addPayInfo);
		$("#editPayInfo").prop("checked", jsonData.editPayInfo);
		$("#delPayInfo").prop("checked", jsonData.delPayInfo);
		$("#addTagInfo").prop("checked", jsonData.addTagInfo);
		$("#editTagInfo").prop("checked", jsonData.editTagInfo);
		$("#delTagInfo").prop("checked", jsonData.delTagInfo);
	}
	
	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
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
	//定义提交数据
	var submitData = {};
	submitData["id"] = g_params.row.merchantsUserId;
	var content = new Object();
	content.addOrder = $('#addOrder').prop('checked');
	content.editOrder = $('#editOrder').prop('checked');
	content.addGoods = $('#addGoods').prop('checked');
	content.editGoods = $('#editGoods').prop('checked');
	content.delGoods = $('#delGoods').prop('checked');
	content.addGoodsCategory = $('#addGoodsCategory').prop('checked');
	content.editGoodsCategory = $('#editGoodsCategory').prop('checked');
	content.delGoodsCategory = $('#delGoodsCategory').prop('checked');
	content.addDailyExpenses = $('#addDailyExpenses').prop('checked');
	content.editDailyExpenses = $('#editDailyExpenses').prop('checked');
	content.delDailyExpenses = $('#delDailyExpenses').prop('checked');
	content.addCustomer = $('#addCustomer').prop('checked');
	content.editCustomer = $('#editCustomer').prop('checked');
	content.delCustomer = $('#delCustomer').prop('checked');
	content.addSupplier = $('#addSupplier').prop('checked');
	content.editSupplier = $('#editSupplier').prop('checked');
	content.delSupplier = $('#delSupplier').prop('checked');
	content.addCustomerType = $('#addCustomerType').prop('checked');
	content.editCustomerType = $('#editCustomerType').prop('checked');
	content.delCustomerType = $('#delCustomerType').prop('checked');
	content.addCustomerLevel = $('#addCustomerLevel').prop('checked');
	content.editCustomerLevel = $('#editCustomerLevel').prop('checked');
	content.delCustomerLevel = $('#delCustomerLevel').prop('checked');
	content.addColor = $('#addColor').prop('checked');
	content.editColor = $('#editColor').prop('checked');
	content.delColor = $('#delColor').prop('checked');
	content.addTexture = $('#addTexture').prop('checked');
	content.editTexture = $('#editTexture').prop('checked');
	content.delTexture = $('#delTexture').prop('checked');
	content.addSize = $('#addSize').prop('checked');
	content.editSize = $('#editSize').prop('checked');
	content.delSize = $('#delSize').prop('checked');
	content.addVender = $('#addVender').prop('checked');
	content.editVender = $('#editVender').prop('checked');
	content.delVender = $('#delVender').prop('checked');
	content.addTransport = $('#addTransport').prop('checked');
	content.editTransport = $('#editTransport').prop('checked');
	content.delTransport = $('#delTransport').prop('checked');
	content.addPayInfo = $('#addPayInfo').prop('checked');
	content.editPayInfo = $('#editPayInfo').prop('checked');
	content.delPayInfo = $('#delPayInfo').prop('checked');
	content.addTagInfo = $('#addTagInfo').prop('checked');
	content.editTagInfo = $('#editTagInfo').prop('checked');
	content.delTagInfo = $('#delTagInfo').prop('checked');
	submitData["privilegeContent"] = JSON.stringify(content);
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