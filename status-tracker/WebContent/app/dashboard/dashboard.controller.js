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
    		$scope.report = getMonitorableReport(report); 
    		$scope.toDelete = [];
    		$scope.reportDate = report.$id;

    		$scope.onProductChange = onProductChangeEventHandler;
    		$scope.clearErrorMsg = clearErrorMsg;
    		$scope.logout = logout;    		
    		$scope.addEntry = addEntry;    		
    		$scope.edit = edit;    		
    		$scope.remove = remove;    		
    		$scope.toggle = toggle;
    		
    		function onProductChangeEventHandler(prodId) 
    		{
    			var found = false;
    			angular.forEach($scope.products, function(product) {
    				if(!found && product.$id === prodId) 
    				{
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
    			var items = [];
    			angular.forEach($scope.report.items, function(item)
    			{
    				if(!item.selected) {
    					items.push(item);
    				}
    			});
    			
    			StatusFactory.saveReport($scope.authUser.$id, report.$id, items).then(function(report){
    				$scope.report = getMonitorableReport(report);
    			}, function(error) {
    				$scope.errorMessage = error;
    			});
    			$scope.isEdit = false;
    		};

    		function toggle(selected) 
    		{
    			angular.forEach($scope.report.items, function(item){
    				item.selected = selected;
    			});
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
    			var items = $scope.report.items != null ? $scope.report.items : [];
    			
    			if(statusAlreadyExists()) 
    			{
    				$scope.errorMessage = "This item alreay exists!";
    			}
    			else
    			{
    				items.push(transformReportItem(reportForm));
	    			StatusFactory.saveReport($scope.authUser.$id, report.$id, items).then(function(report){
	    				$scope.report = getMonitorableReport(report);
	    			}, function(error) {
	    				$scope.errorMessage = error;
	    			});
    			}
    		};
    		
    		function statusAlreadyExists() 
    		{
    			var exists = false;
    			angular.forEach(report.items, function(item){
    				if(!exists && 	
						item.product === reportForm.product.name &&
						item.version === reportForm.version.name &&
						item.role === reportForm.role.name)
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
    		
    		function transformReportItem(item){
    			return {
    				product: item.product.name,
    				version: item.version.name,
    				role: item.role.name,
    				allocation: item.allocation
    			};
    		}
    	};
})();
