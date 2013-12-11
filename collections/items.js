Items = new Meteor.Collection('items');

Items.index = Meteor.lunr(function() {
    this.field('name', {boost: 10});
    this.field('description');
    this.ref('_id');
});
/***********Search***************/
Meteor.startup(function(e) {
	Items.index = Meteor.lunr(function() {
    this.field('name', {boost: 10});
    this.field('description');
    this.ref('_id');
	});

	var allItems = Items.find({},{fields: {name: 1, description: 1}});

	allItems.forEach(function(item) {
    	Items.index.add(item);
	});



Meteor.methods({
    searchItems: function(matchText) {
        check(matchText, String);
        return Items.index.search(matchText);
    }
});
});

/********************************/

Items.allow({
	update: ownsDocument,
	remove: ownsDocument
});
Items.deny({
	update: function(userId, item, fieldNames) {
		// may only edit the following fields:
		return (_.without(fieldNames, 'name', 'description').length > 0);
	}
});

Meteor.methods({
	itemList: function(itemAttributes) {
		var user = Meteor.user();

		// ensure the user is logged in
		if (!user) {
			throw new Meteor.Error(401, "Please login to post new listings");
		}

		// ensure the item has a name
		if (!itemAttributes.name) {
			throw new Meteor.Error(422, "Please add a name for your listing");
		}

		// ensure the item has a reserve price
		if (!itemAttributes.price) {
			throw new Meteor.Error(422, "Please add a reserve price for your listing");
		}

		// ensure the item has a zip code
		if (!itemAttributes.zip) {
			throw new Meteor.Error(422, "Please add your zip code");
		}

		// ensure the item has a description
		if (!itemAttributes.description) {
			throw new Meteor.Error(422, "Please add a description for your listing");
		}

		// ensure the item has an expiration date
		if (!itemAttributes.date) {
			throw new Meteor.Error(422, "Please add an expiration date for your listing");
		}

		// validate zip code
		var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(itemAttributes.zip);
		if (!isValidZip) {
			throw new Meteor.Error(422, "Please add a valid zip");
		}

		var now = moment(new Date());
		var expires = moment(now);

		if (itemAttributes.date === "3 hours") {
			expires.add('hours', 3);
		} else if (itemAttributes.date === "1 day") {
			expires.add('days', 1);
		} else if (itemAttributes.date === "4 days") {
			expires.add('days', 4);
		} else {
			expires.add('days', 7);
		}
		console.log(expires.format("dddd, MMMM Do YYYY, h:mm:ss a"));

		//convert price to 2 decimals
		itemAttributes.price = itemAttributes.price.toFixed(2);

		// pick out the whitelisted keys
		var item = _.extend(_.pick(itemAttributes, 'name', 'price', 
			'description','image_url', 'image_width', 'image_height', 'zip'), {
			userId: user._id,
			owner: user.username,
			submitted: now,
			expires: expires.toDate(),
			expired: false
		});
		// debugging
		console.log(item);

		// get the item id from the insert
		var itemId = Items.insert(item);
		Items.index.add(item);

		return itemId;
	},
	expireItem: function(id) {
		var now = moment();
		// ensure the expiration date has actually passed
		if (!now.isAfter(item.expires)) {
			throw new Meteor.Error(422, "The server has incorrectly attempted to expire this item");
		}

		Items.update({_id: id}, {$set: {expired: true}});
		console.log("server expiration");
	},
	deleteItem: function(id) {
		var item = Items.findOne(id);
		var now = moment();
		// don't allow deletion of item after expiration of listing
		if (now.isAfter(item.expires)) {
			throw new Meteor.Error(422, "Cannot delete finished listings.");
		}
		var url = item.image_url;
		//delete the photo from filepicker
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
		// Remove the associated bids first
		Bids.remove({listingId: id});
		Items.remove({_id: id});
	}
});
Items.allow({
	insert: function(userId, doc) {
		// only allow posting if you are logged in
		return !!userId;
	}
});