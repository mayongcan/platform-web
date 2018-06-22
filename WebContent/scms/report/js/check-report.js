var g_tabList = null;

$(function () {
	//初始化tab
	g_tabList = new Vue({el:"#tabInfo"});
	initView();
});

/**
 * 初始化界面数据
 */
function initView(){
	//绑定tab元素
	$(document).on("click", ".tab-info", function(){
		if($(this).children("a").children("span").html() == '盘点明细'){
			if(typeof($("#iframeCheckDetail").attr("src")) == "undefined"){
				$('#iframeCheckDetail').attr('src', 'check/check-detail.html');
			}
		}else if($(this).children("a").children("span").html() == '按商品汇总'){
			if(typeof($("#iframeCheckGoods").attr("src")) == "undefined"){
				$('#iframeCheckGoods').attr('src', 'check/check-goods.html');
			}
		}else if($(this).children("a").children("span").html() == '按盘点单汇总'){
			if(typeof($("#iframeCheckOrder").attr("src")) == "undefined"){
				$('#iframeCheckOrder').attr('src', 'check/check-order.html');
			}
		}else if($(this).children("a").children("span").html() == '按店铺汇总'){
			if(typeof($("#iframeCheckShop").attr("src")) == "undefined"){
				$('#iframeCheckShop').attr('src', 'check/check-shop.html');
			}
		}
	}) 
}