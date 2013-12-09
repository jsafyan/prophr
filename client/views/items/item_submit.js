// Load filepicker function asynchronously
(function(a){if(window.filepicker){return}var b=a.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===a.location.protocol?"https:":"http:")+"//api.filepicker.io/v1/filepicker.js";var c=a.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d={};d._queue=[];var e="pick,pickMultiple,pickAndStore,read,write,writeUrl,export,convert,store,storeUrl,remove,stat,setKey,constructWidget,makeDropPane".split(",");var f=function(a,b){return function(){b.push([a,arguments])}};for(var g=0;g<e.length;g++){d[e[g]]=f(e[g],d._queue)}window.filepicker=d})(document);
filepicker.setKey("A3QRRvT93T4SaRHWgFLsUz");

var image_url = '';
var image_width = '';
var image_height = '';

Template.itemSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		var item = {
			name: $(e.target).find('[name=name]').val(),
			price: parseFloat($(e.target).find('[name=reserve_price]').val()),
			zip: $(e.target).find('[name=zip_code]').val(),
			description: $(e.target).find('[name=description]').val(),
			date: $(e.target).find('[name=exp_date]:checked').val(),
			image_url: image_url,
			image_width: image_width,
			image_height: image_height
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

		filepicker.pickAndStore({mimetype: 'image/*', services: ['COMPUTER', 'DROPBOX',
			'EVERNOTE', 'FACEBOOK', 'FLICKR', 'GOOGLE_DRIVE', 'GMAIL',
			'IMAGE_SEARCH', 'URL', 'WEBCAM']},{}, function(InkBlobs) {
   				console.log(JSON.stringify(InkBlobs));
   				image_url = InkBlobs[0].url;
   				// Get image dimensions to store for faster client side rendering
   				var inkblob = {url : image_url};
   				filepicker.stat(inkblob, {width: true, height: true}, function(metadata) {
   					image_width = metadata.width;
   					image_height = metadata.height;
   				});
   				// Create an image preview. TO-DO: allow for deletion of image through preview
   				function loadImage(path, width, height, target) {
    				$('<img src='+ path +' height="{{image_height}}" width="{{image_width}}">').load(function() {
      					$(this).width(width).height(height).appendTo(target);
    				});
				}
				$('#image-preview').fadeIn();
   				loadImage(image_url, 150, 150,'#image-preview');
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
					$('#image-preview').fadeOut();
					console.log("Photo deleted: " + result);
				}
			});
		} catch(error) {
			console.log("Something went wrong with filepicker deletion request" + error);
		}
	}
});