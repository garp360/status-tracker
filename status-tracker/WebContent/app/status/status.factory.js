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
    		
    		factory.status = getStatus;
    		factory.save = save;
    		
    		function getStatus(empId) 
    		{
    			var ref = statusRef.child(empId).child("status");
    			return $firebaseArray(ref).$loaded();
    		}
    		
    		function save(empId, reportId, entry) 
    		{
    			var deferred = $q.defer();
    			var reportEntry = transformReportEntry(entry);
    			
    			getEmployee(empId).then(function(employee) {
    				if(!employee.status) 
    				{
    					employee.status = {};
    					employee.status[reportId] = [];
    				} 
    				else if (!employee.status[reportId]) 
    				{
    					employee.status[reportId] = [];
    				}
    				
    				if(!statusAlreadyExists(employee.status[reportId], reportEntry)) {
    					employee.status[reportId].push(reportEntry);    					
    				} else {
    					deferred.reject("Entry already exists");
    				}
    				
    				return employee.$save();
    			}).then(function(employee){
    				return getStatus(empId);
    			}).then(function(status){
    				deferred.resolve(status);
    			});
		
    			return deferred.promise;
    		}
    		
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
    		
    		function getEmployee(empId) {
    			var ref = statusRef.child(empId);
    			return $firebaseObject(ref).$loaded();
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

