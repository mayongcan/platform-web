/*!
 * 作者：zzd
 * 时间：2018-06-19
 * 描述：文件上传工具类
 */
var fileupload = fileupload || {};
(function() {
	//文件上传框-名称
	fileupload.fileObjId = "";
	//上传成功后的文件路径
	fileupload.filePath = "";
	//文件列表（已上传的列表）
	fileupload.fileList = [];
	//文件列表（准备上传的列表）
	fileupload.fileToUploadList = [];
	//控件预览文件
	fileupload.previewFile = [];
	//控件预览配置
	fileupload.previewConfig = [];

	/**
	 * 初始化新建文件选择器
	 */
	fileupload.initFileNewSelector = function(inputFileId){
		fileupload.fileObjId = inputFileId;
		$("#" + inputFileId).fileinput({
	        showUpload: false,
	        dropZoneEnabled: false,
	        fileActionSettings:{
	        	showUpload: false,
	        },
			uploadUrl: top.app.conf.url.res.url,			//需要这个参数，才能显示删除按钮
	        language: 'zh',
	        maxFileCount: 10,
	        msgPlaceholder: '请选择需要上传的附件',
	        previewSettings:{
	            image: {width: "auto", height: "auto", 'max-width': "100%", 'max-height': "100%"},
	            html: {width: "153px", height: "100px"},
	            text: {width: "153px", height: "100px"},
	            office: {width: "153px", height: "100px"},
	            gdocs: {width: "153px", height: "100px"},
	            video: {width: "153px", height: "100px"},
	            audio: {width: "100%", height: "30px"},
	            flash: {width: "153px", height: "100px"},
	            object: {width: "153px", height: "100px"},
	            pdf: {width: "153px", height: "100px"},
	            other: {width: "153px", height: "100px"}
	        }
	    });

		//删除单个文件事件
		$('#'+ inputFileId).on('filedeleted', function(event, key, jqXHR, data) {
		    
		});
	    //清理所有文件事件
		$('#' + inputFileId).on('filecleared', function(event) {
			fileupload.fileToUploadList = [];
		});
		//文件选择后的事件
		$("#" + inputFileId).on("filebatchselected", function(event, files) {
			fileupload.fileToUploadList = files;
		});
	}

	/**
	 * 初始化修改文件选择器
	 */
	fileupload.initFileEditSelector = function(inputFileId, filesList){
		fileupload.fileObjId = inputFileId;
		if(!$.utils.isEmpty(filesList)){
			fileupload.fileList = filesList.split(",");
			for(var i = 0; i < fileupload.fileList.length; i++){
				if($.utils.isEmpty(fileupload.fileList[i])) continue;
				//fileupload.previewFile.push(top.app.conf.url.res.url + fileupload.fileList[i]);
				//获取问文件后缀
				var ext = fileupload.fileList[i].substr(fileupload.fileList[i].lastIndexOf(".") + 1);
				if(fileupload.isAssetTypeAnImage(ext)){
					//如果为图片文件，则可以显示预览
					var fileName = fileupload.fileList[i].substr(fileupload.fileList[i].lastIndexOf("/") + 1);
					var html = "<img src='" + top.app.conf.url.res.url + fileupload.fileList[i] + "' class='file-preview-image kv-preview-data' alt='" + fileName + "' title='" + fileName + "' />";
					fileupload.previewFile.push(html);
				}else{
					//获取文件名
					var fileName = fileupload.fileList[i].substr(fileupload.fileList[i].lastIndexOf("/") + 1);
					var html = "<div class='file-preview-text' style='word-break: break-all;color: #555;cursor:pointer' onclick=fileupload.openFile(" + i+ ") >" +
				    				"<h3><i class='glyphicon glyphicon-file' style='font-size:60px;color:#aaa'></i></h3>" +
				    				fileName + 
								"</div>";
					fileupload.previewFile.push(html);
				}
				var conf = {};
				conf.key = fileupload.fileList[i];
				fileupload.previewConfig.push(conf);
			}
		} 
		
		$("#" + inputFileId).fileinput({
			showUpload: false,
	        dropZoneEnabled: false,
	        msgPlaceholder: '若不需要修改，请留空...',
	        initialPreview: fileupload.previewFile,
	        initialPreviewConfig: fileupload.previewConfig, 
//	        initialPreviewAsData: true,
	        deleteLocal: true,			//自定义参数，是否进行本地删除
	        overwriteInitial: false,
	        fileActionSettings:{
	        	showUpload: false,
	        },
			uploadUrl: top.app.conf.url.res.url,			//需要这个参数，才能显示删除按钮
	        language: 'zh',
	        maxFileCount: 10,
	        previewSettings:{
	            image: {width: "auto", height: "auto", 'max-width': "100%", 'max-height': "100%"},
	            html: {width: "153px", height: "100px"},
	            text: {width: "153px", height: "100px"},
	            office: {width: "153px", height: "100px"},
	            gdocs: {width: "153px", height: "100px"},
	            video: {width: "153px", height: "100px"},
	            audio: {width: "100%", height: "30px"},
	            flash: {width: "153px", height: "100px"},
	            object: {width: "153px", height: "100px"},
	            pdf: {width: "153px", height: "100px"},
	            other: {width: "153px", height: "100px"}
	        }
	    });
		
		//删除单个文件事件
		$('#'+ inputFileId).on('filedeleted', function(event, key, jqXHR, data) {debugger
		    for(var i = 0; i < fileupload.fileList.length; i++){
		    	if(fileupload.fileList[i] == key){
		    		fileupload.fileList.splice(i, 1);
			    	break;
		    	}
		    }
		});
	    //清理所有文件事件
		$('#' + inputFileId).on('filecleared', function(event) {
			fileupload.fileList = [];
			fileupload.fileToUploadList = [];
		});
		//文件选择后的事件
		$("#" + inputFileId).on("filebatchselected", function(event, files) {
			fileupload.fileToUploadList = files;
		});
	}

	/**
	 * 显示预览
	 */
	fileupload.showPreview = function(inputFileId, filesList){
		//显示图片预览
		if(!$.utils.isEmpty(filesList)){
			var goodsPhotoList = filesList.split(",");
			for(var i = 0; i < goodsPhotoList.length; i++){
				if($.utils.isEmpty(goodsPhotoList[i])) continue;
				$('#' + inputFileId).append('<div class="file-preview-frame krajee-default file-preview-initial file-sortable kv-preview-thumb">' +
											'<div class="kv-file-content" style="width: 100px;height:100px">' +
												'<img src="' + top.app.conf.url.res.url + goodsPhotoList[i] + '" class="file-preview-image kv-preview-data" style="width: auto; height: auto; max-width: 100%; max-height: 100%;">' +
											'</div>' +
										'</div>');
			}
		} 
	}

	/**
	 * 文件上传
	 */
	fileupload.uploadAction = function(checkFunc, isImage, isMulti, modifyName, callbackFunc){
		if(checkFunc) {
			//判断是否需要校验,如果校验函数结果不通过，则返回
			if(!checkFunc()) return;
		}
		if($.utils.isNull(fileupload.fileToUploadList) || fileupload.fileToUploadList.length == 0){
			if(callbackFunc) callbackFunc();
			return;
		}
		//上传图片
		if(isImage){
			if(isMulti){
				//多个
				top.app.uploadMultiImage(fileupload.fileToUploadList, function(data){
					fileupload.filePath = data;
					//回调
					if(callbackFunc) callbackFunc();
				}, modifyName);
			}else{
				top.app.uploadImage(fileupload.fileToUploadList[0], function(data){
					fileupload.filePath = data;
					//回调
					if(callbackFunc) callbackFunc();
				}, modifyName);
			}
		}else{
			//上传文件
			if(isMulti){
				//多个
				top.app.uploadMultiFile(fileupload.fileToUploadList, function(data){
					fileupload.filePath = data;
					//回调
					if(callbackFunc) callbackFunc();
				}, modifyName);
			}else{
				top.app.uploadFile(fileupload.fileToUploadList[0], function(data){
					fileupload.filePath = data;
					//回调
					if(callbackFunc) callbackFunc();
				}, modifyName);
			}
		}
	}

	/**
	 * 获取上传后的路径
	 */
	fileupload.getUploadFilePath = function(){
		//转换图片列表
		var imageList = "";
		for(var i = 0; i < fileupload.fileList.length; i++){
			imageList += fileupload.fileList[i] + ",";
		}
		if(imageList != "") imageList = imageList.substring(0, imageList.length - 1);
		if(fileupload.filePath != null && fileupload.filePath != undefined && fileupload.filePath != ""){
			if(imageList == "") 
				imageList = fileupload.filePath;
			else
				imageList = imageList + "," + fileupload.filePath;
		}
			
		return imageList;
	}
	
	fileupload.isAssetTypeAnImage = function(ext) {
		return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1;
	}
	
	fileupload.openFile = function(index){
		window.open(top.app.conf.url.res.url + fileupload.fileList[index]);
	}

})();