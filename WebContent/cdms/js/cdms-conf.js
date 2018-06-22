/*!
 * 作者：zzd
 * 时间：2017-05-19
 * 描述：扩展配置项
 */
var app = top.app || {};
(function() {
	app.conf.url.api.cdms = {}
	
	app.conf.url.api.cdms.staff = {};
	app.conf.url.api.cdms.staff.bind = {};
	app.conf.url.api.cdms.staff.bind.getUserList = top.app.conf.url.apigateway + "/api/cdms/staff/bind/getUserList";
	app.conf.url.api.cdms.staff.bind.getMemberUserList = top.app.conf.url.apigateway + "/api/cdms/staff/bind/getMemberUserList";
	app.conf.url.api.cdms.staff.exam = {};
	app.conf.url.api.cdms.staff.exam.getQuestionList = top.app.conf.url.apigateway + "/api/cdms/staff/exam/getQuestionList";
	app.conf.url.api.cdms.staff.exam.getContentList = top.app.conf.url.apigateway + "/api/cdms/staff/exam/getContentList";
	app.conf.url.api.cdms.staff.saleslog = {};
	app.conf.url.api.cdms.staff.saleslog.getSaleslogList = top.app.conf.url.apigateway + "/api/cdms/staff/saleslog/getSaleslogList";
	app.conf.url.api.cdms.staff.trainlog = {};
	app.conf.url.api.cdms.staff.trainlog.getTrainlogList = top.app.conf.url.apigateway + "/api/cdms/staff/trainlog/getTrainlogList";
	//任务
	app.conf.url.api.cdms.staff.task = {};
	app.conf.url.api.cdms.staff.task.getList = top.app.conf.url.apigateway + "/api/cdms/staff/task/getList";
	
	app.conf.url.api.cdms.staff.drugsales = {};
	app.conf.url.api.cdms.staff.drugsales.getList  = top.app.conf.url.apigateway + "/api/cdms/staff/drugsales/getList";
	
	app.conf.url.api.cdms.member = {};
	app.conf.url.api.cdms.member.member = {};
	app.conf.url.api.cdms.member.member.getMemberList = top.app.conf.url.apigateway + "/api/cdms/member/member/getMemberList";
	app.conf.url.api.cdms.member.member.getMemberFamilyList = top.app.conf.url.apigateway + "/api/cdms/member/member/getMemberFamilyList";
	app.conf.url.api.cdms.member.member.getMemberCaseList = top.app.conf.url.apigateway + "/api/cdms/member/member/getMemberCaseList";
	app.conf.url.api.cdms.member.member.getMemberCaseMedicationList = top.app.conf.url.apigateway + "/api/cdms/member/member/getMemberCaseMedicationList";
	app.conf.url.api.cdms.member.member.getDeviceSphygmometerList = top.app.conf.url.apigateway + "/api/cdms/member/member/getDeviceSphygmometerList";
	app.conf.url.api.cdms.member.member.getDeviceBloodList = top.app.conf.url.apigateway + "/api/cdms/member/member/getDeviceBloodList";
	app.conf.url.api.cdms.member.member.getDeviceLungList = top.app.conf.url.apigateway + "/api/cdms/member/member/getDeviceLungList";
	app.conf.url.api.cdms.member.member.getDeviceStepList = top.app.conf.url.apigateway + "/api/cdms/member/member/getDeviceStepList";
	app.conf.url.api.cdms.member.device = {};
	app.conf.url.api.cdms.member.device.getDeviceList = top.app.conf.url.apigateway + "/api/cdms/member/device/getDeviceList";
	app.conf.url.api.cdms.member.member.getMemberKeyVal = top.app.conf.url.apigateway + "/api/cdms/member/member/getMemberKeyVal";
	
	app.conf.url.api.cdms.member.member.addDiseaseDiagnosis = top.app.conf.url.apigateway + "/api/cdms/member/member/addDiseaseDiagnosis";
	app.conf.url.api.cdms.member.member.getMemberAttr = top.app.conf.url.apigateway + "/api/cdms/member/member/getMemberAttr";
	
	app.conf.url.api.cdms.merchant = {};
	app.conf.url.api.cdms.merchant.industry = {};
	app.conf.url.api.cdms.merchant.industry.getIndustryTree = top.app.conf.url.apigateway + "/api/cdms/merchant/industry/getIndustryTree";
	app.conf.url.api.cdms.merchant.merchant = {};
	app.conf.url.api.cdms.merchant.merchant.getMerchantList = top.app.conf.url.apigateway + "/api/cdms/merchant/merchant/getMerchantList";
	app.conf.url.api.cdms.merchant.merchant.getMerchantKeyVal = top.app.conf.url.apigateway + "/api/cdms/merchant/merchant/getMerchantKeyVal";
	
	app.conf.url.api.cdms.goods = {};
	app.conf.url.api.cdms.goods.category = {};
	app.conf.url.api.cdms.goods.category.getCategoryTree = top.app.conf.url.apigateway + "/api/cdms/goods/category/getCategoryTree";
	app.conf.url.api.cdms.goods.brand = {};
	app.conf.url.api.cdms.goods.brand.getBrandList = top.app.conf.url.apigateway + "/api/cdms/goods/brand/getBrandList";
	app.conf.url.api.cdms.goods.brand.getBrandKeyVal = top.app.conf.url.apigateway + "/api/cdms/goods/brand/getBrandKeyVal";
	app.conf.url.api.cdms.goods.goods = {};
	app.conf.url.api.cdms.goods.goods.getGoodsList = top.app.conf.url.apigateway + "/api/cdms/goods/goods/getGoodsList";
	app.conf.url.api.cdms.goods.goods.getGoodsSpecList = top.app.conf.url.apigateway + "/api/cdms/goods/goods/getGoodsSpecList";
	app.conf.url.api.cdms.goods.goods.getGoodsPartList = top.app.conf.url.apigateway + "/api/cdms/goods/goods/getGoodsPartList";

	app.conf.url.api.cdms.order = {};
	app.conf.url.api.cdms.order.order = {};
	app.conf.url.api.cdms.order.order.getOrderList = top.app.conf.url.apigateway + "/api/cdms/order/order/getOrderList";
	
	app.conf.url.api.cdms.rule = {};
	app.conf.url.api.cdms.rule.exam = {};
	app.conf.url.api.cdms.rule.exam.getExamList = top.app.conf.url.apigateway + "/api/cdms/rule/exam/getExamList";
	app.conf.url.api.cdms.rule.train = {};
	app.conf.url.api.cdms.rule.train.getTrainList = top.app.conf.url.apigateway + "/api/cdms/rule/train/getTrainList";
	app.conf.url.api.cdms.rule.sales = {};
	app.conf.url.api.cdms.rule.sales.getSalesList = top.app.conf.url.apigateway + "/api/cdms/rule/sales/getSalesList";
	
	app.conf.url.api.cdms.content = {};
	app.conf.url.api.cdms.content.category = {};
	app.conf.url.api.cdms.content.category.getCategoryTree = top.app.conf.url.apigateway + "/api/cdms/content/category/getCategoryTree";
	app.conf.url.api.cdms.content.recommend = {};
	app.conf.url.api.cdms.content.recommend.getRecommendList = top.app.conf.url.apigateway + "/api/cdms/content/recommend/getRecommendList";
	app.conf.url.api.cdms.content.recommend.getRecommendArticleList = top.app.conf.url.apigateway + "/api/cdms/content/recommend/getRecommendArticleList";
	app.conf.url.api.cdms.content.article = {};
	app.conf.url.api.cdms.content.article.getArticleList = top.app.conf.url.apigateway + "/api/cdms/content/article/getArticleList";
	app.conf.url.api.cdms.content.article.getArticleContent = top.app.conf.url.apigateway + "/api/cdms/content/article/getArticleContent";
	app.conf.url.api.cdms.content.article.getArticleImageList = top.app.conf.url.apigateway + "/api/cdms/content/article/getArticleImageList";
	app.conf.url.api.cdms.content.article.getArticleKeyVal = top.app.conf.url.apigateway + "/api/cdms/content/article/getArticleKeyVal";

	app.conf.url.api.cdms.exam = {};
	app.conf.url.api.cdms.exam.category = {};
	app.conf.url.api.cdms.exam.category.getCategoryTree = top.app.conf.url.apigateway + "/api/cdms/exam/category/getCategoryTree";
	app.conf.url.api.cdms.exam.question = {};
	app.conf.url.api.cdms.exam.question.getQuestionList = top.app.conf.url.apigateway + "/api/cdms/exam/question/getQuestionList";
	app.conf.url.api.cdms.exam.question.getContentList = top.app.conf.url.apigateway + "/api/cdms/exam/question/getContentList";
	
	app.conf.url.api.cdms.obps = {};
	app.conf.url.api.cdms.obps.suggesion = {};
	app.conf.url.api.cdms.obps.suggesion.getList = top.app.conf.url.apigateway + "/api/cdms/obps/suggesion/getList";
	app.conf.url.api.cdms.obps.suggesion.getBindList = top.app.conf.url.apigateway + "/api/cdms/obps/suggesion/getBindList";
	
	app.conf.url.api.cdms.msg = {};
	app.conf.url.api.cdms.msg.category = {};
	app.conf.url.api.cdms.msg.category.getCategoryTree = top.app.conf.url.apigateway + "/api/cdms/msg/category/getCategoryTree";
	
	app.conf.url.api.cdms.msg.info = {};
	app.conf.url.api.cdms.msg.info.getList = top.app.conf.url.apigateway + "/api/cdms/msg/info/getList";
	
	app.conf.url.api.cdms.im = {};
	app.conf.url.api.cdms.im.getTeamList = top.app.conf.url.apigateway + "/api/cdms/im/getTeamList";
	app.conf.url.api.cdms.im.getTeamKeyVal = top.app.conf.url.apigateway + "/api/cdms/im/getTeamKeyVal";

})();
