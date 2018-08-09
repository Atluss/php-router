
window.image_before = true;


$(document).ready(function () {

	var formErrors = {
		"notNameCustumer": "Введите имя.",
		"notLastName": "Введите фамилию.",
		"notEmail": "Вы не правильно ввели электронную почту.",
		"notName": "Введите название организации/Имя.",
		"about": "Заполните информацию о себе.",
		"site": "Введите адрес сайта.",
		"address": "Введите адрес.",
		"notInputPass": "Введите оба пароля.",
		"passNotQuals": "Пароли не совпадают.",
		"notPhoneMaster": "Введите номер телефона",
		"phone": "Введите и подтвердите номер телефона.",
		"phoneNotConfirmed": "Вы не подтвердили номер телефона.",
		"category": "Вы не выбрали категорию работ.",
		"agrrement": "Для создания анкеты вы должны согласиться с правилами.",
		"priceNotInput": "Заполните позиции прайса.",
		"fromSendError": "Что то пошло не так при создании анкеты.",
	};

	$('input[name="phone"]').inputmask("phone", {
		mask: "+7 (###) ###-####",
		onKeyValidation: function () { //show some metadata in the console
			console.log($(this).val().replace(/\D+/g,"").length);
		}
	});

	$(document).on('click', '._select_child_list', function () {

		var list = $(this).parent(),
			id = $(this).data('id'),
			mainCat = $('._main_cat'),
			catName = $(this).text();

		$('._children_cat').removeClass('_cant_open');
		mainCat.data('id', id).addClass('selected_cats').find('span').text(catName);
		list.hide();
		$('._curent_list').hide();
		$('._curent_list[data-parent_id="' + id + '"]').show();

	});

	$(document).on('click', '._select_this_cat', function () {

		var catHolder = $('._children_cat'),
			catId = $(this).data('id'),
			catName = $(this).text(),
			list = $(this).closest('.mp_cat_drop_down_list');

		$('#category_id').val(catId);
		$('#category').val(catId);

		catHolder.addClass('selected_cats').find('span').text(catName);
		list.hide();

		$('#_vid_rabot_error').hide();

		var fatherInfo = $(this).parent().data('info'),
			elementInfo = $(this).data('info'),
			elementFullCode = fatherInfo.code + "/" + elementInfo.code,
			elementFullName = fatherInfo.name + " / " + elementInfo.name,
			strToAdd = strCategoryLine(elementInfo.name, elementFullCode, fatherInfo.code, elementInfo.id),
			father = $('.ms_category_block[data-cat_fat="'+ fatherInfo.code +'"]');

		console.log("father:", fatherInfo);
		console.log("child:", elementInfo);


		if($('input[value="'+ elementFullCode +'"]').length === 0) {
			if(father.length === 0) {

				var str = getFatherCategory(fatherInfo.name, fatherInfo.code);

				$('._add_category_list').before(str);
			}

			if($('input[value="'+elementInfo.id+'"]').length === 0)
				$('.ms_category_block[data-cat_fat="'+ fatherInfo.code +'"]').append(strToAdd);

		}

	});

	$(document).on('click', '._main_cat', function () {

		$('._children_cat').addClass('_cant_open').removeClass('selected_cats').find('span').text('Выберите вид работы');
		$('#category_id').val('');
		$('#category').val('');

		var list = $(this).parent().find('.mp_cat_drop_down_list');

		$('.mp_cat_drop_down_list').not(list).slideUp();

		if(list.is(':visible')) {
			list.slideUp();
		} else {
			list.slideDown();
		}

	});

	$(document).on('click', '._children_cat', function () {

		if($(this).hasClass('_cant_open')) return;

		var list = $(this).parent().find('.mp_cat_drop_down_list');



		if(list.is(':visible')) {
			list.slideUp();
		} else {
			list.slideDown();
		}
	});

	$(document).on('click', '.ce_del_this_cat', function () {

		var fathCode = $(this).parent().data('father');
		$(this).parent().remove();

		if($('.ms_categories_no_click[data-father="'+ fathCode +'"]').length === 0) {
			$('.ms_category_block[data-cat_fat="' + fathCode + '"]').remove();
		}

	});

	$(document).on('click', '.add_category_text', function () {
		var catChooserDiv = $('.category_chooser_div');

		if(catChooserDiv.is(':visible')) {
			catChooserDiv.hide();
		} else {
			catChooserDiv.show();
		}
	});

	$(document).on('change', '#open_edit_executor', function(){

		var isExist = $(this).data('is_exist'),
			isActive = $(this).data('active'),
			executerId = $(this).val(),
			that = $(this);

		$(this).prop('disabled', true);

		var checked = !!$(this).is(':checked');

		if(checked) {
			if(isExist === 0) window.location.href = "/masters/create_executer/";
		}

		$.ajax({
			url: '/app/ajax/masters_site/lk/updateExecuterActivity.php',
			type: 'post',
			data: {executer : executerId},
			dataType: "json",
			cache: false,
			success: function(json){
				if(json.ok) {
					if(json.active === "N") {
						$('.hide_form_edit_executor').hide();
					} else if(json.active === "Y"){
						$('.hide_form_edit_executor').show();
					}

					that.prop('disabled', false);
				}

				console.log(json);
			}

		});

	});

	$(document).on('click', '._open_to_edit', function () {

		var mainF = $(this).closest('.input_holder'),
			editZone = mainF.find('.edit_zone'),
			priceConstract = $(this).closest('.lk_input_input_holder').find('.create_price_holder'),
			imagesHolder = $(this).closest('.lk_input_holder').find('.lk_input_input_holder'),
			avatarHolder = $(this).closest('.lk_input_input_holder').find('div[data-suffix="avatar_image"]');


		priceConstract.removeClass('hidePriceHelp');
		priceConstract.find('input').attr('disabled', false);

		editZone.addClass('can_now_edit');
		editZone.find('input').attr('disabled', false);

		imagesHolder.addClass('nowEditImg');
		imagesHolder.find('input').attr('disabled', false);
		imagesHolder.find('.uploaded').find('.delete_image_preview').show();
		imagesHolder.find('.load_full_portfolio').show();

		avatarHolder.find('input').attr('disabled', false);
		avatarHolder.find('.delete_image_preview').show();

		$('#_save_executer_form').show();
	});

	$(document).on('focus', '.input_holder input', function () {
		$('#_save_executer_form').show();
	});

	$(document).on('click', '._add_lines', function () {

		var grIndex = $(this).parent().data('gnumber');
		// grIndex = parseInt(grIndex) + 1;

		var str = priceListLine(grIndex);

		$(this).parent().find('.cp_price_position_holder').append(str);

	});

	$(document).on('click', '._add_group', function () {
		var grIndex = $('.create_price_group_holder').last().data('gnumber');

		grIndex = parseInt(grIndex) + 1;

		var str = priceListGroup(grIndex);

		$(this).before(str);
	});

	$(document).on('click', '#_save_executer_form', function () {

		if($(this).hasClass('processing-button')) {
			return false;
		}

		$(this).addClass('processing-button');

		var formCanSend = true,
			that = $(this);

		// var data = $('#exucuter_form').serialize();
		var form = $('#exucuter_form'),
			formData = form.serialize(),
			errorDiv = form.find('.executer_short_form_error_holder');

		errorDiv.html("");
		form.find('input, textarea').removeClass('border_error_red');

		var nameInput = $('input[name="name"]'),
			addressInput = $('input[name="address"]'),
			aboutInput = $('#aboutTextArea'),
			firstGroupName = $('input[name="groupName[0]"]'),
			firstNamePriceItem = $('input[name="pricePos[0][]"]').first(),
			firstPriceItem = $('input[name="pricePrice[0][]"]').first();

		if(checkTextInputBuyEmpty(nameInput)) {
			nameInput.addClass('border_error_red');
			formShowError('notName', errorDiv, formErrors);
			formCanSend = false;
		}

		if(checkTextInputBuyEmpty(addressInput)) {
			addressInput.addClass('border_error_red');
			formShowError('address', errorDiv, formErrors);
			formCanSend = false;
		}

		if(checkTextInputBuyEmpty(aboutInput)) {
			aboutInput.addClass('border_error_red');

			formShowError('about', errorDiv, formErrors);
			formCanSend = false;
		}

		if($('input[name="category[]"]').length === 0) {
			$('.ce_main_cat_list').addClass('border_error_red');
			formShowError('category', errorDiv, formErrors);
			formCanSend = false;
		}

		if( checkTextInputBuyEmpty(firstGroupName) ||
			checkTextInputBuyEmpty(firstNamePriceItem) ||
			checkTextInputBuyEmpty(firstPriceItem)) {
			formShowError('priceNotInput', errorDiv, formErrors);
			$('.create_price_holder').addClass('border_error_red');
			formCanSend = false;
		}

		var formtype = $('#portFileImages').hasClass('nowEditImg') ? true : false;

		if(formtype) {
			formData += "&formPort=Y";
		}

		console.log(formData);
		console.log(formCanSend);

		if(formCanSend) {
			$.ajax({
				url: '/app/ajax/masters_site/lk/ajaxUpdateExecuterInfo.php',
				type: 'post',
				data: formData,
				dataType: "json",
				cache: false,
				success: function(json){

					if(formtype) {
						$.each(json.PORTFOLIO, function (index, article) {
							var indexM = article.im_index;
							$('input[name="protfile_image[' + indexM + ']"]').val(article.path);
						});
					}

					if(json.ok) {
						that.hide();
					} else {
						formShowError('fromSendError', errorDiv, formErrors);
					}

					that.removeClass('processing-button');

				}

			});
		} else {
			that.removeClass('processing-button');
		}

	});

	$(document).on('click', '.edit_short_form', function () {

		var passHolder = $('.passwords_ch_holder');

		if($(this).hasClass('edit_mode')) {
			$(this).removeClass('edit_mode');
			passHolder.hide();
			passHolder.find('input').attr('disabled', true);
		} else {
			$(this).addClass('edit_mode');
			passHolder.show();
			passHolder.find('input').attr('disabled', false);
		}

	});

	$(document).on('change', '#emails_me', function () {

		if($(this).prop("checked")) {
			$.ajax({
				url: '/app/ajax/masters_site/lk/ajaxUpdateMasterInfo.php',
				type: 'post',
				data: {setSubscribe : "Y"},
				success: function(json){}
			});
		} else {
			$.ajax({
				url: '/app/ajax/masters_site/lk/ajaxUpdateMasterInfo.php',
				type: 'post',
				data: {setSubscribe : "N"},
				success: function(json){}
			});
		}

	});

	$(document).on('click', '#_save_pass_button', function () {

		if($(this).hasClass('processing-button')) {
			return false;
		}

		var formCanSend = true;
		var form = $('.passwords_ch_holder'),
			formErrorDiv = form.find(".short_form_error");

		formErrorDiv.html("").hide();

		$(this).addClass('processing-button');

		form.find('input').removeClass('border_error_red');

		var pasDiv = $('.passwords_ch_holder'),
			pass1 = $('input[name="pass-one"]'),
			pass2 = $('input[name="pass-two"]');

		if(pasDiv.is(':visible')) {
			if(checkTextInputBuyEmpty(pass1) || checkTextInputBuyEmpty(pass2)) {
				pass1.addClass('border_error_red');
				pass2.addClass('border_error_red');
				formShowError('notInputPass', formErrorDiv, formErrors);
				formCanSend = false;
			}

			if(pass1.val() !== pass2.val()) {
				pass1.addClass('border_error_red');
				pass2.addClass('border_error_red');
				formShowError('passNotQuals', formErrorDiv, formErrors);
				formCanSend = false;
			}
		}

		if(formCanSend) {
			$.ajax({
				url: '/app/ajax/masters_site/lk/ajaxUpdateMasterInfo.php',
				type: 'post',
				data: {"pass-one" : pass1.val(), "pass-two" : pass2.val()},
				dataType: "json",
				cache: false,
				success: function(json){
					if(json.ok) {

						$('.short_form_success').html(json.ok).show();

						setTimeout(function () {
							$('.short_form_success').hide();
						}, 1000);

						if(pasDiv.is(':visible')) {
							pasDiv.hide();
							pasDiv.find('input').prop('disabled', true);
						}

					} else {
						formShowError('fromSendError', formErrorDiv, formErrors);
					}

					$("#_save_pass_button").removeClass('processing-button');
				}

			});
		} else {
			$("#_save_pass_button").removeClass('processing-button');
		}


	});

	function strCategoryLine(name, code, fatherCode, id) {
		return '<div class="ms_categories_no_click" data-father="'+fatherCode+'">' +
			'<span class="one-category m-b">'+ name + '</span>' +
			'<span class="ce_del_this_cat" title="удалить выбранную категорию"></span>' +
			'<input type="hidden" name="category[]" value="'+ code + '__' + id +'"/>' +
			'<input type="hidden" name="category_id[]" value="'+ id +'"/>' +
			'<div class="clear"></div>' +
			'</div>';
	}

	function getFatherCategory(name, code) {
		return '<div class="ms_category_block" data-cat_fat="' + code +'">' +
			'<div class="ms_category_block m-b">' + name + '</div>' +
			'</div>';
	}

	function priceListGroup(groupInx) {
		return '<div class="create_price_group_holder" data-gnumber="'+groupInx+'">' +
			'<div class="cp_titles_holder">Название группы</div>' +
			'<div class="cp_group_name_holder">' +
			'<div class="create_price_inputs_holder title_group">' +
			'<input type="text" class="cp_big_input" name="groupName['+groupInx+']" />' +
			'<span class="cp_remove_this_group"></span>' +
			'</div>' +
			'</div>' +
			'<div class="cp_price_position_holder">' +

			'<div class="create_price_inputs_holder">' +
			'<div class="cp_big_input_div">' +
			'<div class="label_input_pc">Наименование услуги:</div>' +
			'<input type="text" name="pricePos['+groupInx+'][]" class="cp_big_input" />' +
			'</div>' +
			'<div class="cp_small_input_div">' +
			'<div class="label_input_pc">Стоимость:</div>' +
			'<input type="text" name="pricePrice['+groupInx+'][]" class="cp_small_input" />' +
			'</div>' +
			'<div class="cp_real_small_div">' +
			'<div class="label_input_pc">Ед. изм:</div>' +
			'<input type="text" name="priceValut['+groupInx+'][]" value="" class="cp_real_small" />' +
			'</div>' +
			'</div>' +

			'<div class="create_price_inputs_holder">' +
			'<div class="cp_big_input_div">' +
			'<div class="label_input_pc">Наименование услуги:</div>' +
			'<input type="text" name="pricePos['+groupInx+'][]" class="cp_big_input" />' +
			'</div>' +
			'<div class="cp_small_input_div">' +
			'<div class="label_input_pc">Стоимость:</div>' +
			'<input type="text" name="pricePrice['+groupInx+'][]" class="cp_small_input" />' +
			'</div>' +
			'<div class="cp_real_small_div">' +
			'<div class="label_input_pc">Ед. изм:</div>' +
			'<input type="text" name="priceValut['+groupInx+'][]" value="" class="cp_real_small" />' +
			'</div>' +
			'<div class="clear"></div>' +
			'<span class="cp_remove_this_line"></span>' +
			'</div>' +

			'<div class="create_price_inputs_holder">' +
			'<div class="cp_big_input_div">' +
			'<div class="label_input_pc">Наименование услуги:</div>' +
			'<input type="text" name="pricePos['+groupInx+'][]" class="cp_big_input" />' +
			'</div>' +
			'<div class="cp_small_input_div">' +
			'<div class="label_input_pc">Стоимость:</div>' +
			'<input type="text" name="pricePrice['+groupInx+'][]" class="cp_small_input" />' +
			'</div>' +
			'<div class="cp_real_small_div">' +
			'<div class="label_input_pc">Ед. изм:</div>' +
			'<input type="text" name="priceValut['+groupInx+'][]" value="" class="cp_real_small" />' +
			'</div>' +
			'<div class="clear"></div>' +
			'<span class="cp_remove_this_line"></span>' +
			'</div>' +

			'</div>' +
			'<span class="dashed_text _add_lines">добавить строки</span>' +
			'</div>';
	}

	function priceListLine(groupInx) {
		return '<div class="create_price_inputs_holder">' +
			'<div class="cp_big_input_div">' +
			'<div class="label_input_pc">Наименование услуги:</div>' +
			'<input type="text" name="pricePos[' + groupInx + '][]" class="cp_big_input" />' +
			'</div>' +

			'<div class="cp_small_input_div">' +
			'<div class="label_input_pc">Стоимость:</div>' +
			'<input type="text" name="pricePrice[' + groupInx + '][]" class="cp_small_input" />' +
			'</div>' +

			'<div class="cp_real_small_div">' +
			'<div class="label_input_pc">Ед. изм:</div>' +
			'<input type="text" name="priceValut['+groupInx+'][]" value="" class="cp_real_small" />' +
			'</div>' +

			'<div class="clear"></div>' +
			'<span class="cp_remove_this_line"></span>' +
			'</div>';
	}

	ymaps.ready(init);
	var zoneCenterCoords = $("#zoneCenter").val().split(",");

	function init() {
		$(document).on("keyup", "#ya_address", function () {
			if ($(this).val().length > 2) {

				ymaps.suggest($(this).val(), {
					'boundedBy':
						[
							[parseFloat(zoneCenterCoords[0]) - 0.1, parseFloat(zoneCenterCoords[1]) - 0.1],
							[parseFloat(zoneCenterCoords[0]) + 0.1, parseFloat(zoneCenterCoords[1]) + 0.1]
						],
					'results': '5'
				}).then(function (items) {
					var listString = "";
					var listCounter = 1;
					items.forEach(function (entry) {
						listString += "<div class='ya_map_fast_item'>" + entry.displayName + "</div>";
						if (listCounter == items.length) {
							$(".fast_yamaps_points").html(listString);
							$(".fast_yamaps_points").slideDown(300);
						} else {
							listCounter++;
						}
					});
				})
			}
		});

		$(document).on('click', '.ya_map_fast_item', function () {
			var adress = $(this).text();
			$("#ya_address").val(adress);
			$(".fast_yamaps_points").slideUp(300);

			crds(adress).then(function (coords) {
				// console.log(coords);
				$('#coords').val(coords);
			});
		});

		function crds(crd, callback) {
			return ymaps.geocode(crd)
				.then(function (res) {
					return res.geoObjects.get(0).geometry.getCoordinates();
				});
		}
	}
});