Template.bid.helpers({
	value: function() {
		return this.value.toFixed(2);
	},
	currentPrice: function() {
		return Items.find(this.listingId).fetch()[0].price.toFixed(2);
	}
});