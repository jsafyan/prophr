Router.map(function() {
	this.route('itemsList', {
		path: '/',
		
		waitOn: function() {
			return [Meteor.subscribe('items'), Meteor.subscribe('photos')];
		}
	});
	this.route('itemPage', {
		path: '/items/:_id',
		data: function() {
			return Items.findOne(this.params._id);
		}
	});
	this.route('itemSubmit', {
		path: '/submit',
		before: function() {
			AccountsEntry.signInRequired(this);
			this.subscribe('photos').wait();
		}
	});
	this.route('itemEdit', {
		path: '/items/:_id/edit',
		data: function() {
			return Items.findOne(this.params._id);
		},
		waitOn: function() {
			return [Meteor.subscribe('items'), Meteor.subscribe('photos')];
		},
		before: function() {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('userProfile', {
		path: '/dashboard/',
		data: function() {
			return Meteor.users.findOne(Meteor.user());
		},
		before: function() {
			AccountsEntry.signInRequired(this);
		}
	});
});

// Pre-loading hooks
Router.configure({
	before: function() {
		// clear any visible error messages
		Errors.clearSeen();
		/*
		var routeName = this.route.name;

		// no need to check whether logged in at these URLs
		if (_.include(['itemsList', 'itemPage'], routeName)) {
			return;
		}
		
		var user = Meteor.user();

		if (!user) {
			this.render(Meteor.loggingIn() ? 'loading' : 'accessDenied');
			return this.stop();
		}
		*/
	}
});