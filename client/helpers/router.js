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
		onBeforeAction: function() {
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
		onBeforeAction: function() {
			AccountsEntry.signInRequired(this);
		}
	});
	this.route('userProfile', {
		path: '/dashboard/',
		data: function() {
			return Meteor.users.findOne(Meteor.user());
		},
		onBeforeAction: function() {
			AccountsEntry.signInRequired(this);
		}
	});
});

// Pre-loading hooks
Router.configure({
	onBeforeAction: function() {
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
	},
	layoutTemplate: 'layout',
	yieldTemplates: 
	 {header: 
		{to: 'header'}
	}
});