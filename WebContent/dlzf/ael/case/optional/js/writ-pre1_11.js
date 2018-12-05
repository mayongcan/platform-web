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

	//获取字典
//	if($.utils.isNull(g_params.sexDict)) g_params.sexDict = top.app.getDictDataByDictTypeValue('SYS_SEX_TYPE');
//	if(g_params.data.personType == '1') {
//		$("#divPersonType2").remove();
//	}
//	else {
//		$("#divPersonType1").remove();
//	}

	$('#tdPartiesName').text($.utils.getNotNullVal(g_params.data.partiesName));
	$('#tdPartiesPrincipal').text($.utils.getNotNullVal(g_params.data.partiesPrincipal));
	$('#tdPartiesPhone').text($.utils.getNotNullVal(g_params.data.partiesPhone));
	$('#tdPartiesAddr').text($.utils.getNotNullVal(g_params.data.partiesAddr));
//	$('#tdPartiesSex').text($.utils.getNotNullVal(top.app.getDictName(g_params.data.partiesSex, g_params.sexDict)));
//	$('#tdPartiesCertificateNo').text($.utils.getNotNullVal(g_params.data.partiesCertificateNo));
//	$('#tdCompanyName').text($.utils.getNotNullVal(g_params.data.companyName));
//	$('#tdCompanyJob').text($.utils.getNotNullVal(g_params.data.companyJob));
//	$('#tdCompanyAddr').text($.utils.getNotNullVal(g_params.data.companyAddr));
	$('#tdIllegalReason').text($.utils.getNotNullVal(g_params.data.illegalReason));
	$('#tdCompanyCode').text($.utils.getNotNullVal(g_params.data.companyCode));
	rales.setDateInfo($('#dataYear'), $('#dataMonth'), $('#dataDay'), g_params.data.illegalDate);
//	$('#tdIllegalDate').text($.utils.getNotNullVal(g_params.data.illegalDate));
	$('#tdIllegalAddr').text($.utils.getNotNullVal(g_params.data.illegalAddr));
	$('#tdIllegalRule').text($.utils.getNotNullVal(g_params.data.illegalRule));
	if(g_params.data.defendType == '1') $('#tdDefendType').text("并听取了你（单位）的陈述申辩");
	else $('#tdDefendType').text("对此，你（单位）未作陈述申辩");
	$("input[type='radio'][name=defendType][value=" + g_params.data.defendType + "]").attr("checked",true);
	$('#tdBaseRule').text($.utils.getNotNullVal(g_params.data.baseRule));
	if(g_params.data.punishType1 != '1') $("#divPunishType1").remove();
	if(g_params.data.punishType2 != '1') $("#divPunishType2").remove();

	
	var num = digitUppercase(g_params.data.punishMoneyAll);
	if($.utils.isEmpty(num)){
		num = "零";
	}
	num = num.replace("元整", "");
//	if($.utils.isEmpty(num)){
//		$('#punishMoney1').text("零");
//		$('#punishMoney2').text("零");
//		$('#punishMoney3').text("零");
//		$('#punishMoney4').text("零");
//	}else{
//		num = num.replace('元', '').replace('万', '-').replace('亿', '-').replace('拾', '-').replace('佰', '-').replace('仟', '-').replace('整', '');
//		var array = num.split('-'), val1 = "零", val2 = "零", val3 = "零", val4 = "零";
//		if(array.length == 1){
//			val1 = array[0];
//		}
//		if(array.length == 2){
//			val1 = array[1];
//			val2 = array[0];
//		}
//		if(array.length == 3){
//			val1 = array[2];
//			val2 = array[1];
//			val3 = array[0];
//		}
//		if(array.length == 4){
//			val1 = array[3];
//			val2 = array[2];
//			val3 = array[1];
//			val4 = array[0];
//		}
//		$('#punishMoney4').text($.utils.getNotNullVal(val1));
//		$('#punishMoney3').text($.utils.getNotNullVal(val2));
//		$('#punishMoney2').text($.utils.getNotNullVal(val3));
//		$('#punishMoney1').text($.utils.getNotNullVal(val4));
//	}
	$('#punishMoneyVal').text($.utils.getNotNullVal(num));
	$('#tdPunishMoneyAll').text($.utils.getNotNullVal(g_params.data.punishMoneyAll));
	$('#tdPunishGetType').text($.utils.getNotNullVal(g_params.data.punishGetType));

	if(g_params.data.punishMoneyType1 != '1') $("#divPunishMoneyType1").remove();
	if(g_params.data.punishMoneyType2 != '1') $("#divPunishMoneyType2").remove();
	$('#tdBankName').text($.utils.getNotNullVal(g_params.data.bankName));
	$('#tdBankCode').text($.utils.getNotNullVal(g_params.data.bankCode));
	$('#tdBankUserName').text($.utils.getNotNullVal(g_params.data.bankUserName));
	$('#tdReview1').text($.utils.getNotNullVal(g_params.data.review1));
	$('#tdReview2').text($.utils.getNotNullVal(g_params.data.review2));
	$('#tdLawsuit').text($.utils.getNotNullVal(g_params.data.lawsuit));
}

var digitUppercase = function(n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(shiftRight(n,1+i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(shiftLeft(n, 1));
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
};

// 向右移位
function shiftRight(number, digit){
    digit = parseInt(digit, 10);
    var value = number.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + digit) : digit))
}
// 向左移位
function shiftLeft(number, digit){
    digit = parseInt(digit, 10);
    var value = number.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - digit) : -digit))
}
