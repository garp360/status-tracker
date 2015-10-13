(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.controller('DashboardController', DashboardController);
    	
    	DashboardController.$inject = ['$scope', '$log', '$state', '$controller', 'AuthFactory', 'ProductFactory', 'StatusFactory', 'ROUTES', 'authUser', 'status', 'products', 'roles', 'report', 'latestStatus'];
    	
    	function DashboardController ($scope, $log, $state, $controller, AuthFactory, ProductFactory, StatusFactory, ROUTES, authUser, status, products, roles, report,latestStatus) 
    	{
    		$scope.authUser = authUser;
    		$scope.status = status;
    		$scope.products = products;
    		$scope.roles = roles;
    		$scope.report = report; 
    		$scope.latestStatus = latestStatus; 

    		$scope.onProductChange = updateReport;
    		$scope.logout = logout;    		
    		$scope.save = save;    		
    		
    		function updateReport(prodId) {
    			var found = false;
    			angular.forEach($scope.products, function(product) {
    				if(!found && product.$id === prodId) {
    					found = true;
    					$scope.report.product = product;
    		    		$scope.report.version = product.versions[0];
    				}
    			});
    		};
    		
    		function logout() {
    			AuthFactory.logout();
    			$state.go(ROUTES.AUTH.LOGOUT);
    		};
    		
    		function save() {
    			StatusFactory.save()
    		}
    	};
})();
