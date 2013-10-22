if (Items.find().count() === 0) {
	var now = new Date().getTime();

	Items.insert({
		name: 'Nexus 4',
    	owner: 'Larry Page',
    	description: 'Gotta get rid of this thing so I can get my Nexus 5',
    	price: 150,
    	image_url: 'http://cdn0.sbnation.com/entry_photo_images/7166649/n4_hands_111_large_verge_medium_landscape.jpg',
    	submitted: now
	});

	Items.insert({
		name: 'iPhone 5s',
    	owner: 'Tim Cook',
    	description: 'I like this phone, but I prefer my iphone 6',
    	price: 400,
    	image_url: 'http://i.i.cbsi.com/cnwk.1d/i/tim2/2013/08/24/iphone-5s-shop-le-monde-edit.jpg',
    	submitted: now
	});

	Items.insert({
		name: 'Blackberry',
   		owner: 'Waterloo',
    	description: 'Not sure why this has not sold yet',
    	price: 400,
    	image_url: 'http://wp.streetwise.co/wp-content/uploads//2013/06/blackberry-q10.jpg',
    	submitted: now
	});

	Items.insert({
		name: 'Golden-Crowned Kinglet',
		owner: 'jsafyan',
		description: 'Is this even legal to sell?',
		price: 30,
		image_url: 'http://i.imgur.com/MLlVqkr.jpg',
		submitted: now
	})
}
