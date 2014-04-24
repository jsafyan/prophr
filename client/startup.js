Meteor.startup(function() {
	AccountsEntry.config = {
    	logo: 'logo.png',
    	privacyUrl: '/privacy-policy',
    	termsUrl: '/terms-of-use',
    	homeRoute: '/',
    	dashboardRoute: '/dashboard',
    	profileRoute: 'profile',
    	passwordSignupFields: 'EMAIL_ONLY'
	}
});