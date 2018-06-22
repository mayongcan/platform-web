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
		if($(this).children("a").children("span").html() == '调货明细'){
			if(typeof($("#iframeAllotDetail").attr("src")) == "undefined"){
				$('#iframeAllotDetail').attr('src', 'allot/allot-detail.html');
			}
		}else if($(this).children("a").children("span").html() == '按商品汇总'){
			if(typeof($("#iframeAllotGoods").attr("src")) == "undefined"){
				$('#iframeAllotGoods').attr('src', 'allot/allot-goods.html');
			}
		}else if($(this).children("a").children("span").html() == '按调货单汇总'){
			if(typeof($("#iframeAllotOrder").attr("src")) == "undefined"){
				$('#iframeAllotOrder').attr('src', 'allot/allot-order.html');
			}
		}else if($(this).children("a").children("span").html() == '按调出店铺汇总'){
			if(typeof($("#iframeSrcAllotShop").attr("src")) == "undefined"){
				$('#iframeAllotSrcShop').attr('src', 'allot/allot-src-shop.html');
			}
		}else if($(this).children("a").children("span").html() == '按调入店铺汇总'){
			if(typeof($("#iframeAllotDestShop").attr("src")) == "undefined"){
				$('#iframeAllotDestShop').attr('src', 'allot/allot-dest-shop.html');
			}
		}
	}) 
}