$(document).ready(function () {

});

function number_format( number, decimals, dec_point, thousands_sep ) {
	var i, j, kw, kd, km;

	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substr(0, j) + thousands_sep : "");
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

	return km + kw + kd;
}

function checkTextInputBuyEmpty(input) {
	var val = input.val();
	return val === "" || typeof val === 'undefined';
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function formShowError (error, element, errorsText, tag) {

	var errorStrs = {
		getError: function (key) {
			return typeof errorsText[key] === 'undefined' ? "Ошибки нету в списке ошибок:-)" : errorsText[key];
		}
	},
	div;

	if(tag === "" || typeof tag === 'undefined') {
		div = errorStrs.getError(error);
	} else {
		div = "<" + tag + ">"+errorStrs.getError(error)+"</" + tag + ">";
	}

	element.append(div).show();
}