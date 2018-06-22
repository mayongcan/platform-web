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
		if($(this).children("a").children("span").html() == '销售明细'){
			if(typeof($("#iframeSaleDetail").attr("src")) == "undefined"){
				$('#iframeSaleDetail').attr('src', 'sale/sale-detail.html');
			}
		}else if($(this).children("a").children("span").html() == '按商品汇总'){
			if(typeof($("#iframeSaleGoods").attr("src")) == "undefined"){
				$('#iframeSaleGoods').attr('src', 'sale/sale-goods.html');
			}
		}else if($(this).children("a").children("span").html() == '按订单汇总'){
			if(typeof($("#iframeSaleOrder").attr("src")) == "undefined"){
				$('#iframeSaleOrder').attr('src', 'sale/sale-order.html');
			}
		}else if($(this).children("a").children("span").html() == '按客户汇总'){
			if(typeof($("#iframeSaleCustomer").attr("src")) == "undefined"){
				$('#iframeSaleCustomer').attr('src', 'sale/sale-customer.html');
			}
		}else if($(this).children("a").children("span").html() == '按订单创建人汇总'){
			if(typeof($("#iframeSaleCreateBy").attr("src")) == "undefined"){
				$('#iframeSaleCreateBy').attr('src', 'sale/sale-createby.html');
			}
		}else if($(this).children("a").children("span").html() == '按订单销售人汇总'){
			if(typeof($("#iframeSaleSellerBy").attr("src")) == "undefined"){
				$('#iframeSaleSellerBy').attr('src', 'sale/sale-sellerby.html');
			}
		}else if($(this).children("a").children("span").html() == '按业绩归属人汇总'){
			if(typeof($("#iframeSalePerformanceBy").attr("src")) == "undefined"){
				$('#iframeSalePerformanceBy').attr('src', 'sale/sale-performanceby.html');
			}
		}else if($(this).children("a").children("span").html() == '按店铺汇总'){
			if(typeof($("#iframeSaleShop").attr("src")) == "undefined"){
				$('#iframeSaleShop').attr('src', 'sale/sale-shop.html');
			}
		}
	}) 
}