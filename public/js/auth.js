$(document).ready(function () {

	var formErrors = {
		"noLogin" : "Введите логин.",
		"noPassw" : "Введите пароль.",
		"noPassLogin" : "Введите email или телефон в качестве логина.",
		"loginError" : "Не совпадает пара логин и пароль.",
		"noFindLogin" : "По данному логину не найден ни один пользователь.",
	};

	var interval;

	$(document).on('click', '#reset_pass', function() {

		if($(this).hasClass('sms_sending')) {
			return false;
		}
		$(this).addClass('sms_sending');

		var formCanSend = true,
			that = $(this),
			form = $('#auth_form'),
			errorDiv = form.find('.error_div'),
			login = $('input[name="login"]'),
			loginErr = login.parent().find('.error_near_input'),
			maybePhone = login.val().replace(/\D+/g,"").substr(-10);

		errorDiv.html("");
		form.find('input').removeClass('border_error_red form_no_error_input');


		if(checkTextInputBuyEmpty(login)) {
			login.addClass('border_error_red');
			formShowError('noLogin', errorDiv, formErrors, "li");
			formShowError('noLogin', loginErr, formErrors);
			formCanSend = false;
		} else {
			if(!validateEmail(login.val())) {
				if(maybePhone.length !== 10) {
					login.addClass('border_error_red');
					formShowError('noPassLogin', errorDiv, formErrors, "li");
					formShowError('noPassLogin', loginErr, formErrors);
					formCanSend = false;
				} else {
					login.addClass('form_no_error_input');
				}
			} else {
				login.addClass('form_no_error_input');
			}
		}

		if(formCanSend) {

			$('.auth_sendbysms').hide();
			$('.sending_wait').show();

			$.ajax({
				url: '/app/ajax/masters_site/auth/ajaxResetPassword.php',
				type: 'post',
				data: {login : login.val()},
				dataType: "json",
				cache: false,
				success: function(json){
					if(json.ok) {
						waitPass();
					} else {
						formShowError('noFindLogin', errorDiv, formErrors, "li");
						$('.auth_sendbysms').show();
						$('.sending_wait').hide();
					}

					that.removeClass('sms_sending');
				}
			});
		} else {
			that.removeClass('sms_sending');
		}

	});

	$(document).on('click', '._auth_now', function () {

		if($(this).hasClass('processing_button')) {
			return false;
		}
		$(this).addClass('processing_button');

		var formCanSend = true,
			that = $(this),
			form = $('#auth_form'),
			formData = form.serialize(),
			errorDiv = form.find('.error_div');

		errorDiv.html("");
		form.find('input').removeClass('border_error_red form_no_error_input');
		form.find('.error_near_input').html("").hide();

		var login = $('input[name="login"]'),
			password = $('input[name="password"]'),
			loginErr = login.parent().find('.error_near_input'),
			passwordErr = password.parent().find('.error_near_input'),
			maybePhone = login.val().replace(/\D+/g,"").substr(-10),
			backUrl = $('input[name="back_url"]');

		if(checkTextInputBuyEmpty(login)) {
			login.addClass('border_error_red');
			formShowError('noLogin', errorDiv, formErrors, "li");
			formShowError('noLogin', loginErr, formErrors);
			formCanSend = false;
		} else {
			if(!validateEmail(login.val())) {
				if(maybePhone.length !== 10) {
					login.addClass('border_error_red');
					formShowError('noPassLogin', errorDiv, formErrors, "li");
					formShowError('noPassLogin', loginErr, formErrors);
					formCanSend = false;
				} else {
					login.addClass('form_no_error_input');
				}
			} else {
				login.addClass('form_no_error_input');
			}
		}

		if(checkTextInputBuyEmpty(password)) {
			password.addClass('border_error_red');
			formShowError('noPassw', errorDiv, formErrors, "li");
			formShowError('noPassw', passwordErr, formErrors);
			formCanSend = false;
		} else {
			password.addClass('form_no_error_input');
		}

		if(formCanSend) {
			$.ajax({
				url: '/app/ajax/masters_site/auth/ajaxLogin.php',
				type: 'post',
				data: formData,
				dataType: "json",
				cache: false,
				success: function(json){
					if(json.ok) {

						if(checkTextInputBuyEmpty(backUrl) || "https://m.akson.ru/masters/auth/" === backUrl.val()) {
							window.location.href = "https://m.akson.ru/masters/";
						} else {
							window.location.href = backUrl.val();
						}

					} else {
						formShowError('loginError', errorDiv, formErrors, "li");
					}

					that.removeClass('processing_button');
				}
			});
		} else {
			that.removeClass("processing_button");
		}

	});

	function waitPass() {

		$('.auth_sendbysms').hide();
		$('.sending_wait').hide();
		$('.timer_holder_div').show();

		var timer = 30;
		$('#timer').text(timer);

		interval = setInterval(function () {
			timer--;
			$('#timer').text(timer);

			if (timer === 0) {
				clearInterval(interval);
				$('.auth_sendbysms').show();
				$('.timer_holder_div').hide();
			}

		}, 1000);
	}

});