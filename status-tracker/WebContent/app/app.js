(function() {
	'use strict';
	angular

	.module( 'astadia.status.tracker', [ 'ui.router', 'ngMessages', 'firebase', 'astadia.auth', 'app.constants' ])

	.run( function($rootScope, $state, AuthFactory, ROUTES) {
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
			if (toState.authenticate && !AuthFactory.isAuthenticated()) 
			{
				$state.transitionTo(ROUTES.APP.LOGIN);
				event.preventDefault();
			}
		});
	});
})();