Template.userProfile.helpers({
	ownItems: function() {
		return Items.find({userId: Meteor.userId()});
	},
	ownBids: function() {
		return Bids.find({userId: Meteor.userId()});
	},
	itemTotal: function() {
		return Items.find({userId: Meteor.userId()}).count();
	},
	bidTotal: function() {
		return Bids.find({userId: Meteor.userId()}).count();
	}
});