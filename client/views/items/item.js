// Create a dependency variable to change in the getTime()
// call and to cause the expiration function to depend upon it
var timeDep = new Deps.Dependency();
// the current time
var currentTime;
// the interval with which the expiration function is called
var interval;

// sets currentTime equal to the current time and changes
// the timeDep dependency variable
function getTime() {
	var time = new Date();
	var std = time.getHours();
	var min = time.getMinutes();
	//timeValue = std + ":" + min + ":" + time.getSeconds();
	//timeValue = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
	currentTime = new Date();

	timeDep.changed();
};

// Initialize the page by finding the time and setting up
// a recurring call to the expiration function
Template.itemDetail.created = function() {
	getTime();
	interval = Meteor.setInterval(getTime, 1000);
}

// Clears the repeated function calls upon destruction of the template
Template.itemDetail.destroyed = function() {
	Meteor.clearInterval(interval);
};


Template.itemDetail.helpers({
	// ("this" is the item in the Template context)
	// checks that the item belongs to the current user
	ownItem: function() {
		return this.userId == Meteor.userId();
	},
	// returns the remaining time for the listing
	expiration: function() {
		timeDep.depend();
		var time_left = Math.floor(moment.duration(this.expires - currentTime).asSeconds());
		var days = Math.floor(time_left / (60 * 60 * 24));
		var hours = Math.floor((time_left / (60 * 60)) % 24);
		var minutes = Math.floor((time_left / 60) % 60);
		var seconds = Math.floor(time_left % 60);
		if (seconds >= 0) {
			return "Expires in " + days + " days, " + hours + 
			" hours, " + minutes + " minutes, " + seconds + " seconds";
		} else {
			Meteor.clearInterval(interval);
			return "Expired!";
		}
	}
});

Template.itemDetail.events({
	'submit form': function(e, template) {
		e.preventDefault();

		if (!Meteor.user()) {
			Errors.throw("Please login to place a bid");
		}

		var bid = {
			value: $(e.target).find('[name=bid]').val(),
			listingId: template.data._id
		}
		console.log('submitted:' + bid.listingId);

		Meteor.call('placeBid', bid, function(error, id) {
			if (error) {
				// display the error to the user
				Errors.throw(error.reason);
			} else {
				// TO-DO: fix router params to use Router.go('itemPage', id);
				Router.go('/items/' + id);
			}
		});
	}
});