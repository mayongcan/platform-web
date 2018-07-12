var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
var g_selectRowsId = [];

$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
	//初始化界面
	initView();
	initTable();
}

/**
 * 初始化界面
 */
function initView(){
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#groupName').val(g_params.rows.groupName);
		if(!$.utils.isEmpty(g_params.rows.sizeNameList)){
			var tmpIdArray = g_params.rows.sizeIdList.split(',');
			var tmpNameArray = g_params.rows.sizeNameList.split(',');
			for(var i = 0;i < tmpIdArray.length; i++){
				var rowObj = []; 
				rowObj.id = tmpIdArray[i];
				rowObj.sizeName = tmpNameArray[i];
				g_selectRowsId.push(rowObj);
			}
		}
	}
}

function initTable(){
	//搜索参数
	var searchParams = function (p) {
        var retParam = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: p.limit,   						//页面大小
            page: p.offset / p.limit,  				//当前页
            merchantsId: scms.getUserMerchantsId(),
        };
        return retParam;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/scms/base/getSizeInfoList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 380,
        onClickRow: function(row, $el){
    		appTable.setRowClickStatus($table, row, $el);
        }
    });
	
	//checkbox监听事件
	$table.on('check.bs.table', function (row, rowData) {
		if($.utils.isNull(g_selectRowsId)) {
			g_selectRowsId = [];
			g_selectRowsId.push(rowData);
		}
		else g_selectRowsId.push(rowData);
    });
	$table.on('check-all.bs.table', function (rows, rowsData) {
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
	$table.on('uncheck.bs.table', function (row, rowData) {
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
	$table.on('uncheck-all.bs.table', function (rows, rowsData) {
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
	//刷新table后，重置选中行
	$table.on('refresh.bs.table', function () {
		g_selectRowsId = [];
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	groupName: {required: true},
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
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;

	submitData["merchantsId"] = scms.getUserMerchantsId();
	submitData["groupName"] = $("#groupName").val();
	
	var rows = g_selectRowsId;
	var idList = "", nameList = "";
	$.each(rows, function(i, rowData) {
		if(idList != "") idList = idList + ",";
		if(nameList != "") nameList = nameList + ",";
		idList = idList + rowData.id;
		nameList = nameList + rowData.sizeName;
	});
	
	submitData["sizeIdList"] = idList;
	submitData["sizeNameList"] = nameList;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
				//关闭页面前设置结果
				parent.app.layer.editLayerRet = true;
	   			top.app.message.notice("数据保存成功！");
				parent.layer.close(g_iframeIndex);
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 格式化
 * @param value
 * @param row
 */
function tableFormatCheckbox(value, row) {
	var hasVal = false;
	for(var i = 0; i < g_selectRowsId.length; i++){
		if(g_selectRowsId[i].id == row.id) {
			hasVal = true;
			break;
		} 
	}
	return hasVal;
}
