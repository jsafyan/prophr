Template.map.helpers({

});

Template.map.rendered = function() {
	console.log(this.data);
	var lat = this.data.lat;
	var lng = this.data.lng;
	console.log(lat, lng);
	var map = L.map('map-canvas').setView([lat, lng], 13);
	L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-9ijuk24y/{z}/{x}/{y}.png', {
		maxZoom: 18
	}).addTo(map);
	L.circle([lat, lng], 300).addTo(map);
}