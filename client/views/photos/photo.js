Template.photo.helpers({
	url: function() {
		return this.url;
	}
});

Template.photo.events({
	'click #delete': function(e) {
		e.preventDefault();
		
		var url = this.url;
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

		Meteor.call('deletePhoto', this._id, function(error) {
			if (error) {
				console.log(error);
			}
		});

		var photoList = Session.get("photos");
		var index = photoList.indexOf(this._id);
		if (index > -1) {
			photoList.splice(index, 1);
		}
		Session.set("photos", photoList);

		var total = Session.get("uploadCount");
		total = total - 1;
		Session.set("uploadCount", total);
	}
})