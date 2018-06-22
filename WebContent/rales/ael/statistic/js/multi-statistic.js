var g_navIndex = 1;
$(function () {
	//实现日期联动
	$.date.initSearchDate('divBeginMonth', 'divEndMonth', 'YYYY-MM');
	$.date.initSearchDate('divBeginYear', 'divEndYear', 'YYYY');
	$('#searchBeginMonth').val($.date.dateFormat(new Date(), 'YYYY-MM'));
	$('#searchEndMonth').val($.date.dateFormat(new Date(), 'YYYY-MM'));
	initView();
});

function initView(){
	var datetime = new Date();
	var searchYearDict = [], curYear = parseInt(datetime.getFullYear()), html = "";
	$('#searchYear').empty();
	for(var i = curYear; i >= curYear - 10; i--){
		html += "<option value='" + i + "'>" + i + "</option>";
	}
	$('#searchYear').append(html);
	$('.selectpicker').selectpicker('refresh');
	
	initFuncBtnEvent();
}

function initFuncBtnEvent(){
	$("#optionalFlow1").click(function () {
		setTabStatus('1');
    });
	$("#optionalFlow2").click(function () {
		setTabStatus('2');
    });
	$("#optionalFlow3").click(function () {
		setTabStatus('3');
    });
	$("#optionalFlow4").click(function () {
		setTabStatus('4');
    });
	$("#optionalFlow5").click(function () {
		setTabStatus('5');
    });

	//搜索点击事件
	$("#btnSearch").click(function () {
		loadIframe();
    });
	$("#btnReset").click(function () {
		$("#searchBeginMonth").val($.date.dateFormat(new Date(), 'YYYY-MM'));
		$("#searchEndMonth").val($.date.dateFormat(new Date(), 'YYYY-MM'));
		$("#searchBeginYear").val("");
		$("#searchEndYear").val("");
		$("input:radio[name=radioSearchTime]")[0].checked = true;;
		//刷新数据，否则下拉框显示不出内容
		$('.selectpicker').selectpicker('refresh');
		loadIframe();
    });
}

/**
 * 切换tab状态
 * @param index
 * @returns
 */
function setTabStatus(index){
	//判断当前状态
	if(g_navIndex == index) return;
	else{
		$("#optionalFlow" + index).addClass('btn-primary');
		$("#optionalFlow" + index).removeClass('btn-outline');
		$("#optionalFlow" + index).removeClass('btn-default');
		//显示内容
		$("#optionalContent" + index).addClass('activity');
		var nIndex = parseInt(index);
		for(var i = 1; i <= 8; i++){
			if(i == nIndex) continue;
			var tmpVal = i + "";
			if(g_navIndex == tmpVal){
				$("#optionalFlow" + tmpVal).addClass('btn-outline');
				$("#optionalFlow" + tmpVal).addClass('btn-default');
				$("#optionalFlow" + tmpVal).removeClass('btn-primary');
				
				$("#optionalContent" + tmpVal).removeClass('activity');
			}
		}
		g_navIndex = index;
		loadIframe();
	}
}

function loadIframe(){
	if(g_navIndex == '1'){
		document.getElementById("case-iframe").src="/rales/ael/statistic/multi-form-1.html";
	}else if(g_navIndex == '2'){
		document.getElementById("case-iframe").src="/rales/ael/statistic/multi-form-2.html";
	}else if(g_navIndex == '3'){
		document.getElementById("case-iframe").src="/rales/ael/statistic/multi-form-3.html";
	}else if(g_navIndex == '4'){
		document.getElementById("case-iframe").src="/rales/ael/statistic/multi-form-4.html";
	}else if(g_navIndex == '5'){
		document.getElementById("case-iframe").src="/rales/ael/statistic/multi-form-5.html";
	}
}

var ifr = document.getElementById('case-iframe');
ifr.onload = function() {
	//重置iframe高度
	ifr.style.height = '0px';
    var iDoc = ifr.contentDocument || ifr.document;
    ifr.style.height = $.utils.calcPageHeight(iDoc) + 'px';
}