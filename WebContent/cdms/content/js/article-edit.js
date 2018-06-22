var g_params = {}, g_comboBoxTree = null, g_imagePath = null, g_multiImagesPath = null;
$(function () {
	formValidate();
	//取消按钮
	$("#layerCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href= "article.html?_pid=" + pid;
    });
	$("#layerOk").click(function () {
		$("form").submit();
    });
	//初始化ckeditor
	CKEDITOR.replace('editorContent',{
		filebrowserImageUploadUrl: top.app.conf.url.res.uploadCKEditorImage,
		filebrowserUploadUrl: top.app.conf.url.res.uploadCKEditorFile
	});
	g_params = top.app.info.iframe.params;
	initTree();
	getArticleContent();
	initView();
});

/**
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#categoryId') , function (objNode, cb) {
		$.ajax({
		    url: top.app.conf.url.api.cdms.content.category.getCategoryTree,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken()
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
					cb.call(this, data.RetData);
					setTimeout(function () {
						if(g_params.type == "edit" && g_params.rows.categoryId != null && g_params.rows.categoryId != undefined)
							g_comboBoxTree.setValueById(g_params.rows.categoryId);
				    }, 300);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	}, '100%');
}

/**
 * 获取文章内容
 */
function getArticleContent(){
	//如果是编辑状态，则获取文章内容
	if(g_params.type == "edit"){
		$.ajax({
		    url: top.app.conf.url.api.cdms.content.article.getArticleContent,
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
		    	articleId: g_params.rows.articleId
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
		    		CKEDITOR.instances.editorContent.setData(data.RetData);
		    	}else{
		    		top.app.message.error(data.RetMsg);
		    	}
			}
		});
	}
}

/**
 * 初始化界面
 */
function initView(){
	top.app.addComboBoxOption($("#status"), g_params.statDict);
	getLiveTeam();
	$('#divWeightDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss', allowInputToggle: true});
	$('#divPublishDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss', allowInputToggle: true});
	$('#divPeriodDate').datetimepicker({locale: 'zh-CN', format: 'YYYY-MM-DD HH:mm:ss', allowInputToggle: true});
	//判断是新增还是修改
	if(g_params.type == "edit"){
		$('#title').val(g_params.rows.title);
		$('#shortTitle').val(g_params.rows.shortTitle);
		$('#articleDesc').val(g_params.rows.articleDesc);
		$('#keywords').val(g_params.rows.keywords);
		$('#weight').val(g_params.rows.weight);
		$('#weightDate').val(g_params.rows.weightDate);
		$('#source').val(g_params.rows.source);
		$('#author').val(g_params.rows.author);
		$('#link').val(g_params.rows.link);
		$('#isOutLink').val(g_params.rows.isOutLink);
		$('#publishDate').val(g_params.rows.publishDate);
		$('#status').val(g_params.rows.status);
		$('#periodDate').val(g_params.rows.periodDate);
		$('#isLive').val(g_params.rows.isLive);
		$('#liveTeamId').val(g_params.rows.liveTeamId);
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});
	}else{
		//初始化文件上传框
		$('input[type="file"]').prettyFile({text:"请选择图片"});
	}
	
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');
}

function getLiveTeam(){
	$.ajax({
	    url: top.app.conf.url.api.cdms.im.getTeamKeyVal,
	    method: 'GET',
	    data: {
	    	access_token: top.app.cookies.getCookiesToken()
	    },success: function(data){
	    	if(top.app.message.code.success == data.RetCode){
	    		if(data.RetData != null && data.RetData != undefined && data.RetData.length > 0){
	    			top.app.addComboBoxOption($("#liveTeamId"), data.RetData);
	    			//刷新数据，否则下拉框显示不出内容
	    			$('.selectpicker').selectpicker('refresh');
	    		}
	    	}else{
	    		top.app.message.error(data.RetMsg);
	    	}
		}
	});
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	title: {required: true},
        	weight: {required: true, digits:true}
        },
        messages: {
        	title: {required: "请输入文章标题"}
        },
        //重写showErrors
        showErrors: function (errorMap, errorList) {
            $.each(errorList, function (i, v) {
                //在此处用了layer的方法
                layer.tips(v.message, v.element, { tips: [1, '#3595CC'], time: 2000 });
                return false;
            });  
        },
        //失去焦点时不验证
        onfocusout: false,
        submitHandler: function () {
            //提交内容
        	ajaxUpload();
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.rows != null && g_params.rows != undefined)
		submitData['articleId'] = g_params.rows.articleId;
	submitData["categoryId"] = g_comboBoxTree.getNodeId();
	submitData["title"] = $.trim($("#title").val());
	submitData["shortTitle"] = $("#shortTitle").val();
	submitData["articleDesc"] = $("#articleDesc").val();
	submitData["keywords"] = $("#keywords").val();
	submitData["weight"] = $("#weight").val();
	submitData["weightDate"] = $("#weightDate").val();
	submitData["source"] = $("#source").val();
	submitData["author"] = $("#author").val();
	submitData["link"] = $("#link").val();
	submitData["isOutLink"] = $("#isOutLink").val();
	submitData["publishDate"] = $("#publishDate").val();
	submitData["status"] = $("#status").val();
	submitData["periodDate"] = $("#periodDate").val();
	submitData["content"] = CKEDITOR.instances.editorContent.getData();
	submitData["isLive"] = $("#isLive").val();
	submitData["liveTeamId"] = $("#liveTeamId").val();
	
	if(g_imagePath != null && g_imagePath != undefined)
		submitData["image"] = g_imagePath;
	if(g_multiImagesPath != null && g_multiImagesPath != undefined)
		submitData["multiImages"] = g_multiImagesPath;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.alert("数据保存成功！");

	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href= "article.html?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}

/**
 * 提交图片
 */
function ajaxUpload(){
	if(!g_comboBoxTree.isSelectNode()){
		top.app.message.alert("请选择文章所属栏目！");
		return;
	}
	var hasImage = true, hasMultiImages = true;
	var finishImage = 0, finishMultiImages = 0;
	if($("#image")[0].files[0] == null || $("#image")[0].files[0] == undefined){
		hasImage = false;
		finishImage = 1;
	}
	if($("#multiImages")[0].files[0] == null || $("#multiImages")[0].files[0] == undefined){
		hasMultiImages = false;
		finishMultiImages = 1;
	}
	//上传图片到资源服务器
	if(hasImage){
		top.app.uploadImage($("#image")[0].files[0], function(data){
			g_imagePath = data;
			finishImage = 1;
		});
	}
	if(hasMultiImages){
		top.app.uploadMultiImage($("#multiImages")[0].files, function(data){
			g_multiImagesPath = data;
			finishMultiImages = 1;
		});
	}
	top.app.message.loading();
	//使用定时器判断是否已上传结束
	$('#onTime').timer({
	    duration: '1s',
	    callback: function() {
	    	if(finishImage == 1 && finishMultiImages == 1){
	    		$("#onTime").timer('pause');
	    		submitAction();
	    	}
	    },
	    repeat: true //重复调用
	});
	
}