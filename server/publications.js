Meteor.publish('items', function() {
	return Items.find();
});
Meteor.publish('bids', function() {
	return Bids.find();
});