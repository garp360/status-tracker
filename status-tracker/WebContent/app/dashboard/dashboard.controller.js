(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.controller('DashboardController', DashboardController);
    	
    	DashboardController.$inject = ['$scope', '$log', '$state', '$controller', 'AuthFactory', 'ProductFactory', 'StatusFactory', 'ROUTES', 'authUser', 'report', 'products', 'roles', 'reportForm', 'monitoredReport'];
    	
    	function DashboardController ($scope, $log, $state, $controller, AuthFactory, ProductFactory, StatusFactory, ROUTES, authUser, report, products, roles, reportForm, monitoredReport) 
    	{
    		$scope.errorMsg = false;
    		$scope.isEdit = false;
    		$scope.errorMessage = "";
    		$scope.authUser = authUser;
    		$scope.products = products;
    		$scope.roles = roles;
    		$scope.reportForm = reportForm; 
    		$scope.report = monitoredReport; 
    		$scope.toDelete = [];
    		$scope.reportDate = report.$id;

    		$scope.onProductChange = onProductChangeEventHandler;
    		$scope.clearErrorMsg = clearErrorMsg;
    		$scope.logout = logout;    		
    		$scope.addEntry = addEntry;    		
    		$scope.edit = edit;    		
    		$scope.remove = remove;    		
    		$scope.selectAll = selectAll;
    		
    		function onProductChangeEventHandler(prodId) 
    		{
    			var found = false;
    			angular.forEach($scope.products, function(product) {
    				if(!found && product.$id === prodId) {
    					found = true;
    					$scope.reportForm.product = product;
    		    		$scope.reportForm.version = product.versions[0];
    				}
    			});
    		};
    		
    		function edit() 
    		{
    			$scope.isEdit = !$scope.isEdit;
    		};
    		
    		function remove() 
    		{
    			var report = [];
    			angular.forEach($scope.latestStatus, function(reportEntry)
    			{
    				if(!reportEntry.selected) {
    					report.push(reportEntry.entry);
    				}
    			});
    			StatusFactory.saveAll($scope.authUser.$id, $scope.latestStatus.$id, report);
    		};

    		function selectAll() 
    		{
    			
    		};

    		function clearErrorMsg() {
    			$scope.errorMsg = false;
    		};
    		
    		function logout() 
    		{
    			AuthFactory.logout();
    			$state.go(ROUTES.AUTH.LOGOUT);
    		};
    		
    		function addEntry() 
    		{
    			StatusFactory.saveReport($scope.authUser.$id, report.$id, reportForm).then(function(report){
    				$scope.report = report;
    			}, function(error) {
    				$scope.errorMsg = true;
    				$scope.errorMessage = error;
    			});
    		};
    		
    		function statusAlreadyExists(report, reportEntry) {
    			var exists = false;
    			angular.forEach(report, function(entry){
    				if(!exists && 	
    					entry.product == reportEntry.product &&
    					entry.version == reportEntry.version &&
    					entry.role == reportEntry.role)
    				{
    					exists = true;
    				}
    					
    			});
    			return exists;
    		}
    	};
})();
