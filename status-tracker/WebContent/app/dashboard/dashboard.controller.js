(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.controller('DashboardController', DashboardController);
    	
    	DashboardController.$inject = ['$scope', '$log', '$state', '$controller', 'AuthFactory', 'ProductFactory', 'StatusFactory', 'ROUTES', 'authUser', 'status', 'products', 'roles', 'report'];
    	
    	function DashboardController ($scope, $log, $state, $controller, AuthFactory, ProductFactory, StatusFactory, ROUTES, authUser, status, products, roles, report) 
    	{
    		$scope.errorMsg = false;
    		$scope.isEdit = false;
    		$scope.errorMessage = "";
    		$scope.authUser = authUser;
    		$scope.status = status;
    		$scope.products = products;
    		$scope.roles = roles;
    		$scope.report = report; 
    		$scope.latestStatus = getLatestStatus(); 
    		$scope.toDelete = [];
    		$scope.reportDate = moment().format('MMMM YYYY');

    		$scope.onProductChange = onProductChangeEventHandler;
    		$scope.clearErrorMsg = clearErrorMsg;
    		$scope.logout = logout;    		
    		$scope.save = save;    		
    		$scope.edit = edit;    		
    		$scope.remove = remove;    		
    		$scope.selectAll = selectAll;
    		
    		function onProductChangeEventHandler(prodId) 
    		{
    			var found = false;
    			angular.forEach($scope.products, function(product) {
    				if(!found && product.$id === prodId) {
    					found = true;
    					$scope.report.product = product;
    		    		$scope.report.version = product.versions[0];
    				}
    			});
    		};
    		
    		function edit() {
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

    		function selectAll() {
    			
    		};

    		function clearErrorMsg() {
    			$scope.errorMsg = false;
    		};
    		
    		function logout() {
    			AuthFactory.logout();
    			$state.go(ROUTES.AUTH.LOGOUT);
    		};
    		
    		function save() 
    		{
    			var reportId = moment().format('MMMYYYY');
    			
    			if($scope.latestStatus && $scope.latestStatus.$id) 
    			{
    				reportId = $scope.latestStatus.$id;
    			}
    			
    			if(!$scope.report.version) 
    			{
    				$scope.report.version = $scope.report.product.versions[0];
    			}
    			
    			StatusFactory.save($scope.authUser.$id, reportId, $scope.report).then(function(status){
    				$scope.status = status; 
    				$scope.latestStatus = getLatestStatus();
    			}, function(error) {
    				$scope.errorMsg = true;
    				$scope.errorMessage = error;
    			});
    		}
    		
    		function getLatestStatus() 
    		{
				var latestReport = null;
				var modReport = [];
				
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
				
				if(latestReport)
				{
					angular.forEach(latestReport, function(reportEntry)
					{
						modReport.push({
								selected: false,
								entry : reportEntry
							}
						);
					});
				}
	
				return modReport;
    		}
    	};
})();
