(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.controller('DashboardController', DashboardController);
    	
    	DashboardController.$inject = ['$scope', '$log', '$state', '$controller', 'AuthFactory', 'ProductFactory', 'StatusFactory', 'ROUTES', 'authUser', 'status', 'products', 'roles', 'report'];
    	
    	function DashboardController ($scope, $log, $state, $controller, AuthFactory, ProductFactory, StatusFactory, ROUTES, authUser, status, products, roles, report) 
    	{
    		$scope.errorMsg = null;
    		$scope.authUser = authUser;
    		$scope.status = status;
    		$scope.products = products;
    		$scope.roles = roles;
    		$scope.report = report; 
    		$scope.latestStatus = getLatestStatus(); 

    		$scope.onProductChange = updateReport;
    		$scope.clearErrorMsg = clearErrorMsg;
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
    		
    		function clearErrorMsg() {
    			$scope.errorMsg = null;
    		}
    		
    		function logout() {
    			AuthFactory.logout();
    			$state.go(ROUTES.AUTH.LOGOUT);
    		};
    		
    		function save() {
    			var reportId = moment().format('MMMYYYY');
    			
    			if($scope.latestStatus && $scope.latestStatus.$id) 
    			{
    				reportId = $scope.latestStatus.$id;
    			}
    			
    			if(!$scope.report.version) {
    				$scope.report.version = $scope.report.product.versions[0];
    			}
    			
    			StatusFactory.save($scope.authUser.$id, reportId, $scope.report).then(function(status){
    				$scope.status = status; 
    				$scope.latestStatus = getLatestStatus();
    			}, function(error) {
    				$scope.errorMsg = error;
    			});
    		}
    		
    		function getLatestStatus() {
				var latestReport = null;
				
				angular.forEach($scope.status, function(report)
				{
					if(latestReport == null)
					{
						latestReport = report;
					}
					else
					{
						if(moment(report.date).utc().isAfter(moment(latestReport.date).utc()))
						{
							latestReport = report;
						}
					}
				});
	
				return latestReport;
    		}
    	};
})();
