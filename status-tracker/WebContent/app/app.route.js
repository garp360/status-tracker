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
	    			reportId : function() {
	    				return moment().utc().format('MMMYYYY').toUpperCase();
	    			},
	    			report : function(authUser, reportId, StatusFactory) {
	    				var deferred = $q.defer();
	    				StatusFactory.getReport(authUser.$id, reportId).then(function(report){
	    					if(report)
		    				{
		    					angular.forEach(report.items, function(item)
		    					{
		    						item.selected = false;
		    					});
		    				}
	    					deferred.resolve( report );
	    				});
	    				return deferred.promise;
	    			},
	    			products : function(ProductFactory) {
	    				return ProductFactory.all();
	    			}, 
	    			roles : function(RoleFactory) {
	    				return RoleFactory.all();
	    			},
	    			reportForm : function(products, roles) {
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