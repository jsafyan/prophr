Template.searchbar.events({
	//search logic
	'keyup, click .glyphicon-search': function(e, template) {
		e.preventDefault();

		var searchQuery = $("input").val();
		if (searchQuery.length > 0) {
			Meteor.call('searchItems', searchQuery, function(e, result) {
    			if (typeof e === 'undefined') {
        			Session.set('searchResults', result);
    			} else {
        		//handle error here.
    			}
			});
		} else {
			Session.set('searchResults', null);
		}
	}
});