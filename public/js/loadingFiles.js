$(document).ready(function () {

	/*Функция проверки типа файла*/
	function checkFilesTypes(file, checkArray) {

		//Какие презентации можно загрузить
		var userTypesArray = ["png", "jpeg", "jpg", "gif"];

		// Какие прайс листы можно загрузить
		var allowPricesFiles = ["pdf", "xls", "xlsx", "doc", "docx", "pptx", "jpeg", "jpg", "djvu"];

		if(checkArray === "full_price_list")
			userTypesArray = allowPricesFiles;

		if(checkArray === "full_portfolio")
			userTypesArray = ["zip", "7z", "rar", "tar", "gz"];

		var nameArra = file.name.split('.');
		var curType = nameArra[nameArra.length - 1].toLowerCase();

		if(userTypesArray.indexOf(curType) > -1) {

		} else {
			return false;
		}

		// return file.size <= 5242880;
		return true;

	}

	/*Крутим загрузчик*/
	function setRotateAngel(element, procent) {

		var rightBar = element.find(".right-side");
		var leftBar = element.find(".left-side");
		var pie = element.find('.pie');

		var howMuchDegresses = Math.round(parseInt(3.6 * procent));

		if (howMuchDegresses >= 360) howMuchDegresses = 359;

		if(procent <= 50 ){
			pie.css({"clip" : "rect(0, 32px, 32px, 16px)"});
			leftBar.hide();

			rightBar.css({transform: "rotate("+ howMuchDegresses +"deg)"});
			rightBar.show();
		} else {
			rightBar.css({transform: "rotate(179deg)"});
			leftBar.css({ transform: "rotate("+ howMuchDegresses +"deg)" });
			pie.css({"clip" : "inherit"});

			rightBar.show();
			leftBar.show();
		}

	}

	/*загружаем изображение*/
	function uploadReviewImages (object, progressBar, that, parentForm, imgLoc) {

		var files = object;

		var fileNameSufix = that.parent().parent().parent().data("suffix");


		if(files.length === 0)
			return false;

		var formData = new FormData();

		$.each( files, function( key, value ){
			formData.append( 'file['+key+']', value );
		});

		var imgMunber = that.data('imgnum');

		formData.append('suffix', fileNameSufix + "_" + imgMunber);

		that.parent().find('.back_img').addClass('img_div_uploader_opacity');

		var urlPath = "/app/ajax/masters_site/create_executer/uploadFile.php";

		/*if ($("form").is("#create_zakaz_form")) {
			urlPath = "/ajax/masters_site/create_order/uploadFile.php";
		}*/

		$.ajax({
			url: urlPath,
			type: "POST",
			contentType: false,
			processData: false,
			cache: false,
			data: formData,
			dataType: 'json',
			xhr: function(){
				var xhr = $.ajaxSettings.xhr();
				xhr.upload.addEventListener('progress', function(evt){
					if(evt.lengthComputable) {

						progressBar.show();

						parentForm.find('.ce_save_button').addClass('notActive');

						var percentComplete = Math.ceil(evt.loaded / evt.total * 100);

						setRotateAngel(progressBar, percentComplete);
					}
				}, false);
				return xhr;
			},
			success: function(respond, textStatus, jqXHR) {

				progressBar.hide();

				that.parent().find('.back_img').removeClass('img_div_uploader_opacity');

				parentForm.find('.ce_save_button').removeClass('notActive');

				if( typeof respond.error === 'undefined' ) {

					that.parent().find('.img_div_uploader')
						.append("<input value='"+ respond.files[0] +"' name='"+fileNameSufix+"["+ imgMunber +"]' type='hidden'>");

					that.parent().find('.back_img').css(
						{
							'background': "url('"+imgLoc+"') no-repeat center",
							'background-size' : 'cover'
						}).addClass('addBackExists').show();
					that.parent().find('.delete_image_preview').show();

				}
				else{
					console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
				}

				that.removeClass('nowUploading');
				that.closest('.' + fileNameSufix).addClass('uploaded');

			},
			error: function( jqXHR, textStatus, errorThrown ){
				console.log('ОШИБКИ AJAX запроса: ' + textStatus );
			}
		});

	}

	$(document).on('click', '.back_img', function () {

		var input = $(this).parent().parent().find('input[type="file"]');

		console.log(input.data('imgnum'));

		input.trigger('click');

	});

	/*Событие на выбор файла*/
	$("body").on('change', ".photo_to_upload", function(event){

		if($(this).hasClass('nowUploading')) return;

		event.stopPropagation();
		event.preventDefault();

		var parentForm = $(this).closest('form');

		$('.images_error_newopinion').hide();

		var that = $(this);

		var file_id = that.data('imgnum');
		var curProgressbar = $(this).parent().find(".pie-wrapper");

		var maxImg = that.parent().parent().parent().data('max_images');
		var suffix = that.parent().parent().parent().data('suffix');
		var countImgs = $('.'+suffix).length;

		var next_file_id = findEmptyIndex(suffix);
		var needTopast = true;
		var whatPath = that.parent().find('.back_img');

		if(whatPath.hasClass('addBackExists') || countImgs > maxImg)
			needTopast = false;

		if (this.files && this.files[0]) {

			if (checkFilesTypes(this.files[0]) && this.files[0].size < 6291456) {

				parentForm.find('input[name="'+suffix+'[' + file_id + ']"]').remove();

				var reader = new FileReader();

				var imgLoc;
				var th = this.files;
				reader.onloadend = function () {
					imgLoc = reader.result;
					uploadReviewImages(th, curProgressbar, that, parentForm, imgLoc);
				};
				reader.readAsDataURL(this.files[0]);

				if(needTopast) {
					var str = getImageUploderDiv(suffix, next_file_id);

					if(window.image_before)
						that.parent().parent().before(str);
					else
						that.parent().parent().after(str);
				}

			} else {
				$('.images_error_newopinion').show();
			}

		}
	});

	$(document).on('click', '.delete_image_preview', function () {
		var imgNum = $(this).data('imgnum'),
			suffix = $(this).data('suffix'),
			parentForm = $(this).closest('form'),
			countImgs = $('.'+suffix).length,
			holderImg = $(this).closest('.'+suffix).parent(),
			maxImages = holderImg.data('max_images');

		parentForm.find('input[name="'+suffix+'[' + imgNum + ']"]').remove();
		if(countImgs === 1) {
			$(this).parent().find('.back_img').attr('style', '').removeClass('addBackExists');
			$(this).hide();
		} else {
			$(this).closest('.'+suffix).fadeOut(300, function () {
				countImgs = $('.'+suffix + '.uploaded').length;
				$(this).remove();
				if(countImgs === maxImages + 1) {
					var imgNumbweNext = findEmptyIndex(suffix);

					if(window.image_before)
						holderImg.find('.'+suffix).first().before(getImageUploderDiv(suffix, imgNumbweNext));
					else
						holderImg.find('.'+suffix).last().after(getImageUploderDiv(suffix, imgNumbweNext));

				}
			});
		}

	});

	function findEmptyIndex(suffix) {
		var maxImg = $('.'+suffix).parent().data('max_images');
		for(var i = 0; i <= maxImg; i++) {

			var elem = $('.'+suffix).find('.photo_to_upload[data-imgnum="'+ i +'"]');

			if(typeof elem === 'undefined' ||elem.length === 0) {
				return i;
			}
		}
	}

	/*Шаблон доп. кнопочки*/
	function getImageUploderDiv(suffix, imgNun) {
		return '<div class="'+suffix+'">' +
			'<div class="upload-file-container">' +
			'<div class="pie-wrapper progress-95" style="display: none;">' +
			'<div class="pie">' +
			'<div class="right-side half-circle"></div>' +
			'<div class="left-side half-circle"></div>' +
			'</div>' +
			'<div class="shadow"></div>' +
			'</div>' +
			'<div class="img_div_uploader"><div class="back_img"></div><div class="delete_image_preview" data-imgnum="'+imgNun+'" data-suffix="'+ suffix +'"></div></div>' +
			'<input type="file" size="5" accept="image/*" name="avatar" class="photo_to_upload" data-imgnum="'+imgNun+'" title=""/>' +
			'</div></div>';
	}

	/*загрузка файлов прайс листов и архива всего портфолио в анкете исполнителя*/
	$( '.inputfile' ).each(function () {

		var that = $(this)
		var progressBar = that.parent().find(".pie-wrapper");
		var parentForm = $(this).closest('form');
		var fileInputType = $(this).data("file_input_type");

		var label  = $(this).parent().find('label');
		var	labelVal = label.html();

		$(this).on('change', function( event ) {

			event.stopPropagation();
			event.preventDefault();

			$('.erorr_loading').hide();

			var files = this.files;

			console.log('file');

			if(files.length === 0)
				return;


			for (var i = 0; i < files.length; i++) {

				if(!checkFilesTypes(files[i], fileInputType)) {

					if(fileInputType === "full_price_list") {
						$('.price_error').show();
					} else if(fileInputType === "full_portfolio"){
						$('.portfile_error_format').show();
					}

					return
				} else {

					if(files[i].size > 5242880) {
						if(fileInputType === "full_price_list") {
							$('.file_size_error_price').show();
						} else if(fileInputType === "full_portfolio"){
							$('.portfile_error_size').show();
						}

						return
					}

				}
			}

			$('input[name="' + fileInputType + '[]"]').remove();

			var that2 = this;

			var formData = new FormData();

			$.each( files, function( key, value ){
				formData.append( 'file['+key+']', value );
			});

			formData.append('suffix', fileInputType);

			$.ajax({
				url: "/app/ajax/masters_site/create_executer/uploadFile.php",
				type: "POST",
				contentType: false,
				processData: false,
				cache: false,
				data: formData,
				dataType: 'json',
				xhr: function(){
					var xhr = $.ajaxSettings.xhr();
					xhr.upload.addEventListener('progress', function(evt){
						if(evt.lengthComputable) {

							progressBar.show();
							label.parent().find( 'span' ).text("Загрузка...");
							label.hide();

							$('.submitads').addClass('notActive');

							var percentComplete = Math.ceil(evt.loaded / evt.total * 100);

							setRotateAngel(progressBar, percentComplete);
						}
					}, false);
					return xhr;
				},
				success: function(respond, textStatus, jqXHR) {

					label.show();
					progressBar.hide();

					$('.submitads').removeClass('notActive');

					if( typeof respond.error === 'undefined' ){
						var files_path = respond.files;
						var value = '';
						$.each( files_path, function(key, val) {
							value += '<input type="hidden" class="inputToRemove" name="' + fileInputType + '[]" value="'+ val +'">';
						});

						parentForm.append(value);

						var fileName = '';

						if( that2.files && that2.files.length > 1 )
							fileName = ( that2.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', that2.files.length );
						else
							fileName = event.target.value.split( '\\' ).pop();

						if( fileName )
							label.parent().find( 'span' ).html(fileName + '<span class="delete_price" data-input="'+fileInputType+'">[x]</span>');
						else
							label.innerHTML = labelVal;
					}
					else{
						console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
					}

				},
				error: function( jqXHR, textStatus, errorThrown ){
					console.log('ОШИБКИ AJAX запроса: ' + textStatus );
				}
			});
		});
	});

	$(document).on('click', '.delete_price', function () {

		var suffix = $(this).data('input');

		$('input[name="'+suffix+'[]"]').remove();

		var input = $('input[data-file_input_type="'+ suffix +'"]');

		console.log(input.data('file_input_type'));

		input.replaceWith(input = input.val('').clone(true));


		$(this).parent().html("");

	});

});