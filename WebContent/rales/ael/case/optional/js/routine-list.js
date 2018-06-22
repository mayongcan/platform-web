var g_params = {}, g_iframeIndex = null, $table = $('#tableList');
var g_selectRowsId = [];
$(function () {
	g_iframeIndex = parent.layer.getFrameIndex(window.name);
	//取消按钮
	$("#layerCancel").click(function () {
		parent.layer.close(g_iframeIndex);
    });
	$("#layerOk").click(function () {
		submitAction();
    });
});

/**
 * 获取从父窗口传送过来的值
 * @param value
 */
function receiveParams(value){
	g_params = value;
//	if(!$.utils.isEmpty(g_params.relevanceCodeList)){
//		var tmpIdArray = g_params.relevanceIdList.split(',');
//		var tmpCodeArray = g_params.relevanceCodeList.split(',');
//		for(var i = 0;i < tmpIdArray.length; i++){
//			var rowObj = []; 
//			rowObj.id = tmpIdArray[i];
//			rowObj.code = tmpCodeArray[i];
//			g_selectRowsId.push(rowObj);
//		}
//	}
	//初始化界面
	initView();
}

/**
 * 初始化界面
 */
function initView(){
	//搜索参数
	var searchParams = function (p) {
        var retParam = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		    access_token: top.app.cookies.getCookiesToken(),
            size: p.limit,   						//页面大小
            page: p.offset / p.limit,  		//当前页
        };
        return retParam;
    };
    //初始化列表
	$table.bootstrapTable({
        url: top.app.conf.url.apigateway + "/api/rales/ael/routine/getAllList",   		//请求后台的URL（*）
        queryParams: searchParams,										//传递参数（*）
        uniqueId: 'id',
        height: 400,
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
					if(g_selectRowsId[i].id == rowsData.id) {
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
				if(g_selectRowsId[i].id == rowData.id) {
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
					if(g_selectRowsId[i].id == rowsData.id) {
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
 * 提交数据
 */
function submitAction(){
	var rows = g_selectRowsId;
	if(rows.length == 0 || rows.length > 1){
		top.app.message.notice("请选择一条记录进行操作！");
		return;
	}
	
	top.app.message.confirm("确定要将选择的内容纳入巡查记录？", function(){
		top.app.message.loading();
		var submitData = {};
		submitData["registerId"] = g_params.registerId;
		submitData["oldRegisterId"] = rows[0].id;
		//提交审批
		$.ajax({
			url: top.app.conf.url.apigateway + "/api/rales/ael/routine/addRoutineRecord?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'POST',
			data:JSON.stringify(submitData),
			contentType: "application/json",
			success: function(data){
				top.app.message.loadingClose();
				if(top.app.message.code.success == data.RetCode){
		   			top.app.message.notice("纳入巡查记录成功！");
		   			//关闭页面前设置结果
		   			parent.app.layer.editLayerRet = true;
		   			parent.layer.close(g_iframeIndex);
		   		}else{
		   			top.app.message.error(data.RetMsg);
		   		}
	        }
		});
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

function serialNumberTable(value,row,index){
    return appTable.tableFormatSerialNumber($table, index);
}