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
		if($(this).children("a").children("span").html() == '进货/返厂明细'){
			if(typeof($("#iframePurchaseDetail").attr("src")) == "undefined"){
				$('#iframePurchaseDetail').attr('src', 'purchase/purchase-detail.html');
			}
		}else if($(this).children("a").children("span").html() == '按商品汇总'){
			if(typeof($("#iframePurchaseGoods").attr("src")) == "undefined"){
				$('#iframePurchaseGoods').attr('src', 'purchase/purchase-goods.html');
			}
		}else if($(this).children("a").children("span").html() == '按订单汇总'){
			if(typeof($("#iframePurchaseOrder").attr("src")) == "undefined"){
				$('#iframePurchaseOrder').attr('src', 'purchase/purchase-order.html');
			}
		}else if($(this).children("a").children("span").html() == '按供货商汇总'){
			if(typeof($("#iframePurchaseCustomer").attr("src")) == "undefined"){
				$('#iframePurchaseCustomer').attr('src', 'purchase/purchase-supplier.html');
			}
		}else if($(this).children("a").children("span").html() == '按订单创建人汇总'){
			if(typeof($("#iframePurchaseCreateBy").attr("src")) == "undefined"){
				$('#iframePurchaseCreateBy').attr('src', 'purchase/purchase-createby.html');
			}
		}else if($(this).children("a").children("span").html() == '按店铺汇总'){
			if(typeof($("#iframePurchaseShop").attr("src")) == "undefined"){
				$('#iframePurchaseShop').attr('src', 'purchase/purchase-shop.html');
			}
		}
	}) 
}