Template.map.rendered = function() {
	var map = L.map('map-canvas').setView([51.505, -0.09], 13);
	L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-9ijuk24y/{z}/{x}/{y}.png', {
		maxZoom: 18
	}).addTo(map);
	L.circle([51.505, -.09], 200).addTo(map);
}