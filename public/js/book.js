$(document).ready(function () {

	if($('#ya_map').length > 0) {
		ymaps.ready(init);
		var myMap;
		var zoneCenterCoords = $("#zoneCenter").val().split(',');
		function init() {

			myMap = new ymaps.Map("ya_map", {
				center: zoneCenterCoords,
				zoom: 16,
				controls: [],
			});

			myPlacemark = new ymaps.Placemark(
				zoneCenterCoords, {},
				{
					iconLayout: 'default#image',
					iconImageHref: 'https://m.akson.ru/templates/masters/public/images/red_placemark.png',
					iconImageSize: [22, 32],
					iconImageOffset: [-11, -32]
				}
			);
			myMap.geoObjects.add(myPlacemark);

		}
	}
});