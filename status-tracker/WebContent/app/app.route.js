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
	    			_report : function(authUser, reportId, StatusFactory) {
	    				return StatusFactory.getReport(authUser, reportId);
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
	    			},
	    			missingReports : function(reportId, StatusFactory) {
	    				return StatusFactory.isReportReady(reportId);
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