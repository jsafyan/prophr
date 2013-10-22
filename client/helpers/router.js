Router.map(function() {
	this.route('itemsList', {path: '/'});
	this.route('itemPage', {
		path: '/items/:_id',
		data: function() {
			return Items.findOne(this.params._id);
		}}),
	this.route('itemSubmit', {path: '/submit'});
	this.route('itemEdit', {
		path: '/items/:_id/edit',
		data: function() {
			return Items.findOne(this.params._id);
		}
	});
	this.route('userProfile', {
		path: '/profile/',
		data: function() {
			return Meteor.users.findOne(Meteor.user());
		}
	});
});

// Restrict access to certain pages to logged in users
Router.configure({
	before: function() {
		// clear any visible error messages
		Errors.clearSeen();

		var routeName = this.context.route.name;

		// no need to check whether logged in at these URLs
		if (_.include(['itemsList', 'itemPage'], routeName)) {
			return;
		}

		var user = Meteor.user();

		if (!user) {
			this.render(Meteor.loggingIn() ? 'loading' : 'accessDenied');
			return this.stop();
		}
	}
});