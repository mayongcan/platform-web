var g_optionalFlowIndex = 1, g_statTypeDict = [], g_statWorkDict = [], g_netTsDict = [], g_statAreaCodeDict = [];

$(function () {
	//实现日期联动
	$.date.initSearchDate('divHandleBegin', 'divHandleEnd');
	g_statTypeDict = rales.getDictByCode("00052006");
	g_statWorkDict = rales.getDictByCode("00062006");
	g_netTsDict = rales.getDictByCode("00452006");
	g_statAreaCodeDict = rales.getDictByCode("00032006");
	top.app.addComboBoxOption($("#searchStatType"), g_statTypeDict, true);
	top.app.addComboBoxOption($("#searchStatWork"), g_statWorkDict, true);
	initFuncBtnEvent();
});
function initFuncBtnEvent(){
	$("#optionalFlow1").click(function () {
		setTabStatus(1);
    });
	$("#optionalFlow2").click(function () {
		setTabStatus(2);
    });
	//搜索点击事件
	$("#btnSearch").click(function () {
		loadData();
    });
	$("#btnReset").click(function () {
		$("#searchStatName").val("");
		$("#searchStatType").val("");
		$("#searchStatLg").val("");
		$("#searchStatLa").val("");
		$("#searchRadius").val("");
		$("#searchStatWork").val("");
		$("#searchBegin").val("");
		$("#searchEnd").val("");
		$("#searchStatOrg").val("");
		$('.selectpicker').selectpicker('refresh');
		loadData();
    });
}

/**
 * 切换tab状态
 * @param index
 * @returns
 */
function setTabStatus(index){
	//判断当前状态
	if(g_optionalFlowIndex == index) return;
	else{
		$("#optionalFlow" + index).addClass('btn-primary');
		$("#optionalFlow" + index).removeClass('btn-outline');
		$("#optionalFlow" + index).removeClass('btn-default');
		//显示内容
		$("#optionalContent" + index).addClass('activity');
		var nIndex = parseInt(index);
		for(var i = 1; i <= 2; i++){
			if(i == nIndex) continue;
			var tmpVal = i + "";
			if(g_optionalFlowIndex == tmpVal){
				$("#optionalFlow" + tmpVal).addClass('btn-outline');
				$("#optionalFlow" + tmpVal).addClass('btn-default');
				$("#optionalFlow" + tmpVal).removeClass('btn-primary');
				
				$("#optionalContent" + tmpVal).removeClass('activity');
			}
		}
		g_optionalFlowIndex = index;
		loadData();
	}
}

function loadData(){
	if(g_optionalFlowIndex == 1){
		document.getElementById("case-iframe").src="/rales/sam/info/station-info-list.html";
	}else if(g_optionalFlowIndex == 2){
		document.getElementById("case-iframe").src="/rales/sam/info/station-info-map.html";
	}
}

var ifr = document.getElementById('case-iframe');
ifr.onload = function() {
	//重置iframe高度
	ifr.style.height = '0px';
    var iDoc = ifr.contentDocument || ifr.document;
    ifr.style.height = $.utils.calcPageHeight(iDoc) + 'px';
}