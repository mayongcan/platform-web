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
	setData();
	rales.fixALinkWidth();
	//是否触发打印
	if(g_params.isPrint){
		rales.printOfficeFile($("#printBody"), g_iframeIndex);
	}
}

//写入数据内容
function setData(){
	$('#tableTitleMark').text(g_params.data.tableTitleMark);
	$('#tableContentList').empty();
	if(typeof g_params.data.list !== 'object') g_params.data.list = eval("(" + g_params.data.list + ")");
	for(var i = 0; i < g_params.data.list.length; i++){
		$('#tableContentList').append('<tr>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].name + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].totalCnt + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].level + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].specification + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].model + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].feature + 
										'</td>' + 
										'<td class="reference-td">' + 
										g_params.data.list[i].memo + 
										'</td>' + 
									'</tr>')
	}
}
