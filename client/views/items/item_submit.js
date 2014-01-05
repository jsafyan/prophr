// Load filepicker function asynchronously
(function(a){if(window.filepicker){return}var b=a.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===a.location.protocol?"https:":"http:")+"//api.filepicker.io/v1/filepicker.js";var c=a.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d={};d._queue=[];var e="pick,pickMultiple,pickAndStore,read,write,writeUrl,export,convert,store,storeUrl,remove,stat,setKey,constructWidget,makeDropPane".split(",");var f=function(a,b){return function(){b.push([a,arguments])}};for(var g=0;g<e.length;g++){d[e[g]]=f(e[g],d._queue)}window.filepicker=d})(document);
filepicker.setKey("A3QRRvT93T4SaRHWgFLsUz");

var userLat;
var userLng;
Session.setDefault("uploadCount", 0);
Session.setDefault("photos", []);

Template.itemSubmit.helpers({
	photos: function() {
		var photos = Session.get("photos");
		console.log(photos);
		console.log(Photos.find({_id: {$in: photos}}).fetch());
		return Photos.find({_id: { $in: Session.get("photos")}});
	}
});

Template.itemSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		var photos = Session.get("photos");

		var item = {
			name: $(e.target).find('[name=name]').val(),
			price: parseFloat($(e.target).find('[name=reserve_price]').val()),
			zip: $(e.target).find('[name=zip_code]').val(),
			description: $(e.target).find('[name=description]').val(),
			date: $(e.target).find('[name=exp_date]:checked').val(),
			photos: photos,
			lat: userLat,
			lng: userLng
		}

		Meteor.call('itemList', item, function(error, id) {
			if (error) {
				// display the error to the user
				Errors.throw(error.reason);
			} else {
				// TO-DO: fix router params to use Router.go('itemPage', id);
				Router.go('/items/' + id);
			}
		});
	},

	'click #upload': function(e) {
		e.preventDefault();

		// Delete any extant photos
		if (Session.get("uploadCount") >= 3) {
			Errors.throw("Sorry, there's a three photo limit for now.");
			return;
		}

		filepicker.pickAndStore({mimetype: 'image/*', maxFiles: 3, services: ['COMPUTER', 'DROPBOX',
			'EVERNOTE', 'FACEBOOK', 'FLICKR', 'GOOGLE_DRIVE', 'GMAIL', 'URL', 'WEBCAM']},
			{}, function(InkBlobs) {
				for (var i = 0; i < InkBlobs.length; i++) {
					var photo = {
						url: InkBlobs[i].url,
						name: InkBlobs[i].filename,
						size: InkBlobs[i].size,
						listed: false
					}
					Meteor.call('addPhoto', photo, function(error, id) {
						if (error) {
							Errors.throw(error.reason);
						} else {
							var photoList = Session.get("photos");
							photoList.push(id);
							Session.set("photos", photoList);
							var total = Session.get("uploadCount");
							total = total + 1;
							Session.set("uploadCount", total);
							console.log("Upload count: " + Session.get("uploadCount"));
						}
					});
				}
   				/*
   				// Create an image preview. TO-DO: allow for deletion of image through preview
   				function loadImage(path, width, height, target) {
    				$('<img src='+ path +' style="width:100%">').load(function() {
      					$(this).width(width).height(height).appendTo(target);
    				});
				}
				$('#image-preview').fadeIn();
   				loadImage(image_url, 150, 150,'#image-preview');
   				*/
		});
	},
	'click #delete-photo': function(e) {
		e.preventDefault();

		var url = image_url + "?key=" + "A3QRRvT93T4SaRHWgFLsUz";
		try {
			HTTP.del(url, function(error, result) {
				if (error) {
					console.log("Photo deletion error: " + error);
				} else {
					$('#image-preview').fadeOut(100, function () { $('#image-preview').remove(); });
					console.log("Photo deleted: " + result);
				}
			});
		} catch(error) {
			console.log("Something went wrong with filepicker deletion request" + error);
		}
	},
	'click #geolocation': function(e) {
		e.preventDefault();
		var options = {
  			enableHighAccuracy: true,
  			timeout: 5000,
  			maximumAge: 0
		};

		function success(pos) {
  			var crd = pos.coords;

  			console.log('Latitude : ' + crd.latitude);
  			console.log('Longitude: ' + crd.longitude);
  			console.log('More or less ' + crd.accuracy + ' meters.');
  			userLat = crd.latitude;
  			userLng = crd.longitude;
		};

		function error(err) {
  			console.warn('ERROR(' + err.code + '): ' + err.message);
		};

		navigator.geolocation.getCurrentPosition(success, error, options);
		$("#success-message").show();
	}
});