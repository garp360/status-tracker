(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.factory('StatusFactory', StatusFactory);

    	StatusFactory.$inject = ['$q', '$log', '$firebaseArray', '$firebaseObject'];
    
    	function StatusFactory($q, $log, $firebaseArray, $firebaseObject) 
    	{
    		var factory = {};
    		var statusRef = new Firebase("https://astadia-status.firebaseio.com/employees");
    		
    		factory.getReport = getReport;
    		factory.saveReport = saveReport;

    		function getCurrentReport(empId) 
    		{
    			var deferred = $q.defer();
    			
    			var ref = statusRef.child(empId).child("reports").child(reportId);
    			$firebaseArray(ref).$loaded().then(function(report) {
    				deferred.resolve(report);
    			}, function(error){
    				deferred.reject("REPORT:: " + error);
    			});
    			return deferred.promise;
    		}
    		
    		function saveReport(empId, report)
    		{
    			
    		}

    		function transformReportEntry(reportEntry){
    			return {
    				product: reportEntry.product.name,
    				version: reportEntry.version.name,
    				role: reportEntry.role.name,
    				allocation: reportEntry.allocation
    			}
    		}
    		
    		function createGuid()
			{
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			        return v.toString(16);
			    });
			}
    		
			return factory;
    	};
})();

