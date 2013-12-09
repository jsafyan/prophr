Template.searchbar.events({
	//search logic
	'keyup, click .glyphicon-search': function(e, template) {
		e.preventDefault();

		var searchQuery = $("input").val();
		console.log("Query: " + searchQuery);
		if (searchQuery.length > 1) {
			Meteor.call('searchItems', searchQuery, function(e, result) {
    			if (typeof e === 'undefined') {
        			Session.set('searchResults', result);
        			console.log(result);
    			} else {
        		//handle error here.
    			}
			});
		} else {
			Session.set('searchResults', null);
		}
	}
});