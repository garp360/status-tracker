(function() {
	'use strict';
	
	angular
		.module('astadia.status.tracker')
		.config(['$stateProvider', '$urlRouterProvider', 'ROUTES', function($stateProvider, $urlRouterProvider, ROUTES) 
		{
			$urlRouterProvider.otherwise('/');
	 
			$stateProvider
			
			.state(ROUTES.APP.DASHBOARD, 
			{
	        	url:'/',
	    		templateUrl: 'app/dashboard/dashboard.html',
	    		controller: 'DashboardController',
	    		resolve : {
	    			authUser : function(AuthFactory) {
	    				return AuthFactory.getAuthUser();
	    			},
	    			status : function(authUser, StatusFactory) {
	    				return StatusFactory.status(authUser.$id, "2015");
	    			},
	    			latestStatus : function(status){
	    				var latestStatus = null;
	    				var month = parseInt(moment().format('M'));
	    				var yStatus = status[0];
	    				for(var i = month; i>=0; i--) {
	    					var reportId = "m" + i;
		    				if(latestStatus == null) {
								for ( var property in yStatus) {
									if (yStatus.hasOwnProperty(property) && property === reportId) {
										latestStatus = yStatus[property];
										break;
									}
								}
	    					} else {
	    						break;
	    					}
	    				}
	    				return latestStatus;
	    			},
	    			products : function(ProductFactory) {
	    				return ProductFactory.all();
	    			}, 
	    			roles : function(RoleFactory) {
	    				return RoleFactory.all();
	    			},
	    			report : function(products, roles) {
    					return {
    						product: products[0],
	    					version: products[0].versions[0],
	    					role : roles[1],
	    					allocation: 25
    					};
	    			}
	    		},
				authenticate: true
			})
			
			.state(ROUTES.APP.LOGIN, 
			{
	        	url:'/login',
	    		templateUrl: 'sec/auth/login.html',
	    		controller: 'AuthController',
	    		authenticate: false
			});
			
		}]);
		
})();