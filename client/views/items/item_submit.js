// Load filepicker function asynchronously
(function(a){if(window.filepicker){return}var b=a.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===a.location.protocol?"https:":"http:")+"//api.filepicker.io/v1/filepicker.js";var c=a.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d={};d._queue=[];var e="pick,pickMultiple,pickAndStore,read,write,writeUrl,export,convert,store,storeUrl,remove,stat,setKey,constructWidget,makeDropPane".split(",");var f=function(a,b){return function(){b.push([a,arguments])}};for(var g=0;g<e.length;g++){d[e[g]]=f(e[g],d._queue)}window.filepicker=d})(document);
filepicker.setKey("A3QRRvT93T4SaRHWgFLsUz");

var image_url = '';

Template.itemSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		var item = {
			name: $(e.target).find('[name=name]').val(),
			price: parseFloat($(e.target).find('[name=reserve_price]').val()),
			description: $(e.target).find('[name=description]').val(),
			date: $(e.target).find('[name=exp_date]:checked').val(),
			image_url: image_url
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

		filepicker.pickAndStore({services: ['COMPUTER', 'DROPBOX',
			'EVERNOTE', 'FACEBOOK', 'FLICKR', 'GOOGLE_DRIVE', 'GMAIL',
			'IMAGE_SEARCH', 'URL', 'WEBCAM']},{}, function(InkBlobs) {
   				console.log(JSON.stringify(InkBlobs));
   				image_url = InkBlobs[0].url;
   				// Create an image preview. TO-DO: allow for deletion of image through preview
   				function loadImage(path, width, height, target) {
    				$('<img src='+ path +'>').load(function() {
      					$(this).width(width).height(height).appendTo(target);
    				});
				}
   				loadImage(image_url, 150, 150,'#image-preview');
		});
	}
});