var MyCron = new Cron();


// check for expired listings every two minutes
MyCron.addJob(2, function() {
	console.log("Looking for listings to expire...");
	// find all non-expired listings that should be expired
	var activeListings = Items.find({expired: false}).fetch();
	var now = moment();
	var count = 0;
	for (var i = 0; i < activeListings.length; i++) {
		if (now.isAfter(activeListings[i].expires)) {
			activeListings[i].expired = true;
			count += 1;
		}
	}
	console.log("Expired " + count + " listings");
});