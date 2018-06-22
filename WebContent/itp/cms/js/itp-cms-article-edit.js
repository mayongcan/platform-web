var g_params = null, g_backUrl = "";
var g_imagePath = null;

$(function () {
	g_backUrl = $.utils.getUrlParam(window.location.search, "backUrl");
	g_params = top.app.info.iframe.params;
	top.app.message.loading();
	//初始化ckeditor
	CKEDITOR.replace('editorContent',{
		filebrowserImageUploadUrl: top.app.conf.url.res.uploadCKEditorImage,
		filebrowserUploadUrl: top.app.conf.url.res.uploadCKEditorFile
	});
	initTree();
	getArticleContent();
	initView();
	formValidate();
	top.app.message.loadingClose();
});

/**
 * 初始化树
 */
function initTree(){
	//创建下拉树菜单
	g_comboBoxTree = AppCombotree.createNew();
	g_comboBoxTree.init($('#categoryId') , g_params.allTreeData, '100%');
}

/**
 * 获取文章内容
 */
function getArticleContent(){
	//如果是编辑状态，则获取文章内容
	if(g_params.type == "edit"){
		$.ajax({
		    url: top.app.conf.url.apigateway + "/api/itp/cms/getArticleContent?access_token=" + top.app.cookies.getCookiesToken(),
		    method: 'GET',
		    data: {
		    	access_token: top.app.cookies.getCookiesToken(),
		    	id: g_params.rows.id
		    },success: function(data){
		    	if(top.app.message.code.success == data.RetCode){
		    		setTimeout(function () {
			    		CKEDITOR.instances.editorContent.setData(data.RetData);
				    }, 500);
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
		$('#articleLink').val(g_params.rows.articleLink);
		$('#isOutLink').val(g_params.rows.isOutLink);
		$('#publishDate').val(g_params.rows.publishDate);
		$('#status').val(g_params.rows.status);
		$('#totalHits').val(g_params.rows.totalHits);
		$('#hits').val(g_params.rows.hits);
		$('#content').val(g_params.rows.content);
		//初始化文件上传框
		$('#image').prettyFile({text:"请选择图片", placeholder:"若不修改图片，请留空"});

		g_comboBoxTree.setValueById(g_params.rows.categoryId, 300);
	}else{
		//初始化文件上传框
		$('#image').prettyFile({text:"请选择图片"});
	}
	//刷新数据，否则下拉框显示不出内容
	$('.selectpicker').selectpicker('refresh');

	//提交
	$("#btnOK").click(function () {
		$("form").submit();
    });
	//返回
	$("#btnCancel").click(function () {
		var pid = $.utils.getUrlParam(window.location.search,"_pid");
		window.location.href = g_backUrl + "?_pid=" + pid;
    });
}

/**
 * 表单验证
 */
function formValidate(){
	$("#divEditForm").validate({
        rules: {
        	title: {required: true},
        },
        messages: {
        	
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
        	ajaxUploadImage();
        }
    });
}

/**
 * 提交数据
 */
function submitAction(){
	//定义提交数据
	var submitData = {};
	if(g_params.type == "edit")
		submitData["id"] = g_params.rows.id;

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
	
	if(g_imagePath != null && g_imagePath != undefined)
		submitData["image"] = g_imagePath;
	//异步处理
	$.ajax({
		url: g_params.operUrl + "?access_token=" + top.app.cookies.getCookiesToken(),
	    method: 'POST',
		data:JSON.stringify(submitData),
		contentType: "application/json",
		success: function(data){
			top.app.message.loadingClose();
			if(top.app.message.code.success == data.RetCode){
	   			top.app.message.notice("数据保存成功！");
	   			var pid = $.utils.getUrlParam(window.location.search,"_pid");
	   			window.location.href = g_backUrl + "?_pid=" + pid;
	   		}else{
	   			top.app.message.error(data.RetMsg);
	   		}
        }
	});
}


function ajaxUploadImage(){
	if($("#image")[0].files[0] == null || $("#image")[0].files[0] == undefined){
		submitAction();
	}
	//上传图片到资源服务器
	top.app.uploadImage($("#image")[0].files[0], function(data){
		g_imagePath = data;
		//提交数据
		submitAction();
	});
}

