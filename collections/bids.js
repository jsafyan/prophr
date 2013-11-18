Bids = new Meteor.Collection('bids');

Meteor.methods({
	placeBid: function(bid) {
		var user = Meteor.user();
		var item = Items.findOne(bid.listingId);
		var now = moment(new Date());

		// ensure the user is logged in
		if (!user) {
			throw new Meteor.Error(401, "Please login to place a bid");
		}

		// ensure the bid value is a number
		check(Number(bid.value), Number);

		// ensure the bid value is greater than the current price
		if (Number(bid.value) <= item.price) {
			throw new Meteor.Error(422, "You must bid higher than the current price");
		}

		// check that the auction hasn't expired
		if (now.isAfter(item.expires)) {
			throw new Meteor.Error(422, "This listing has expired");
		}

		var bid = _.extend(_.pick(bid, 'value', 'listingId'), {
			userId: user._id,
			submitted: now,
			itemName: item.name
		});

		//debugging 
		console.log(bid);

		var bidId = Bids.insert(bid);

		// increment the item price
		var oldPrice = item.price;
		Items.update(bid.listingId, {
			$inc: {price: Number(bid.value) - oldPrice},
			$set: {highestBidder: user._id}
		});

		return bid.listingId;

	}
});

Bids.allow({
	insert: function(userId, doc) {
		// only allow bidding if you are logged in
		return !!userId;
	}
});