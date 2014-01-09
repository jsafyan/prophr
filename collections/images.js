Photos = new Meteor.Collection('photos');

Meteor.methods({
	addPhoto: function (photo) {
		console.log(photo.url);
		if (!photo.url) {
			throw new Meteor.Error(422, "Uh oh, there was an error in uploading the photo.");
		}

		var photoId = Photos.insert(photo);

		return photoId;
	},
	deletePhoto: function(id) {
		Photos.remove({_id: id});
	}
});

Photos.allow({
	insert: function(userId, doc) {
		// only allow user to upload photos if logged in
		return !!userId;
	}
});