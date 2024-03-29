Template.itemEdit.events({
	'submit form': function(e) {
		e.preventDefault();

		var currentItemId = this._id;

		var itemProperties = {
			name: $(e.target).find('[name=name]').val(),
			description: $(e.target).find('[name=description]').val()
		}

		Items.update(currentItemId, {$set: itemProperties}, function(error) {
			if (error) {
				// display the error to the user
				Errors.throw(error.reason);
			} else {
				Router.go('/items/' + currentItemId);
			}
		});
	},

	'click .delete': function(e) {
		e.preventDefault();

		if (confirm("Delete this item?")) {
			var currentItemId = this._id;
			Meteor.call('deleteItem', currentItemId, function(error, res) {
				if (error) {
					Errors.throw(error.reason);
				} else {
					// Return to the main page
					Router.go('/');
				}
			});
		}
	}
});