(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.controller('DashboardController', DashboardController);
    	
    	DashboardController.$inject = ['$scope', '$log', '$state', '$controller', 'AuthFactory', 'ProductFactory', 'StatusFactory', 'ROUTES', 'authUser', 'report', 'products', 'roles', 'reportForm'];
    	
    	function DashboardController ($scope, $log, $state, $controller, AuthFactory, ProductFactory, StatusFactory, ROUTES, authUser, report, products, roles, reportForm) 
    	{
    		$scope.isEdit = false;
    		$scope.errorMessage = "";
    		$scope.authUser = authUser;
    		$scope.products = products;
    		$scope.roles = roles;
    		$scope.reportForm = reportForm; 
    		$scope.report = report; 
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
    			$scope.errorMessage = "";
    		};
    		
    		function logout() 
    		{
    			AuthFactory.logout();
    			$state.go(ROUTES.AUTH.LOGOUT);
    		};
    		
    		function addEntry() 
    		{
    			if(statusAlreadyExists()) 
    			{
    				$scope.errorMessage = "This item alreay exists!";
    			}
    			else
    			{
	    			StatusFactory.saveReport($scope.authUser.$id, report.$id, reportForm).then(function(report){
	    				$scope.report = getMonitorableReport(report);
	    			}, function(error) {
	    				$scope.errorMessage = error;
	    			});
    			}
    		};
    		
    		function statusAlreadyExists() {
    			var exists = false;
    			angular.forEach(report.items, function(item){
    				if(!exists && 	
						item.product == reportForm.product &&
						item.version == reportForm.version &&
						item.role == reportForm.role)
    				{
    					exists = true;
    				}
    					
    			});
    			return exists;
    		};
    		
    		function getMonitorableReport(report) 
    		{
				if(report)
				{
					angular.forEach(report.items, function(item)
					{
						item.selected = false;
					});
				}
	
				return report;
    		};
    	};
})();
