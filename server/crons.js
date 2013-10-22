var MyCron = new Cron();


// check for expired listings every two minutes
MyCron.addJob(2, function() {
	console.log("Looking for listings to expire...");
	// find all non-expired listings that should be expired
	var activeListings = Items.find({expired: false}).fetch();
	var now = moment();
	for (var i = 0; i < activeListings.length; i++) {
		var count = 0;
		if (now.isAfter(activeListings[i].expires && !activeListings[i].expired)) {
			Items.update(activeListings[i]._id, {
				$set: {expired: true}
			}, function(error) {
				if (error) {
					throw new Meteor.Error(422, "Cron expiration error");
				}
			});
			count += 1;
		}
	}
	console.log("Expired " + count + " listings");
});