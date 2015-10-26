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
    		factory.isReportReady = isReportReady;

    		function getReport(authUser, reportId) 
    		{
    			$log.debug("StatusFactory.getReport( " + " empId=[" + authUser.$id + " ], reportId=[ " + reportId + " ]");
    			var deferred = $q.defer();
    			var ref = statusRef.child(authUser.$id);
    			var reportRef = statusRef.child(authUser.$id).child("reports").child(reportId);
    			$firebaseObject(ref).$loaded().then(function(employee) {
    				employee.lastName = authUser.name.last;
    				employee.firstName = authUser.name.first;
    				return employee.$save();
    			}).then(function(employee){
    				return $firebaseObject(reportRef).$loaded();
    			}).then(function(report) {
					report.lastModified = moment().utc().valueOf();
					report.employeeId = authUser.$id;
					if(!report.items) 
					{
						report.items = [];
					}
    				return report.$save();
    			}, function(error){
    				deferred.reject("REPORT:: " + error);
    			}).then(function(report){
    				deferred.resolve($firebaseObject(reportRef).$loaded());
    			});
    			return deferred.promise;
    		}
    		
    		function saveReport(authUser, reportId, items)
    		{
    			var deferred = $q.defer();
    			$firebaseObject(statusRef.child(authUser.$id).child("reports").child(reportId)).$loaded().then(function(report) {
    				report.items = items;
    				return report.$save();
    			}).then(function() {
    				deferred.resolve(getReport(authUser.$id, reportId));
    			});
    			return deferred.promise;
    		}

    		function createGuid()
			{
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			        return v.toString(16);
			    });
			}
    		
    		function isReportReady(reportId) {
    			var deferred = $q.defer();
    			
    			$firebaseArray(statusRef).$loaded().then(function(employees){
    				var missing = [];
					
    				for(var i=0; i<employees.length; i++) {
    					var emp = employees[i];
    					var hasReports = emp.reports != null;
    					var hasThisReport = hasReports && emp.reports[reportId].items != null && emp.reports[reportId].items.length > 0;
    					
    					if(!hasReports || !hasThisReport)
    					{
    						missing.push(emp);
    					}
    				}
    				deferred.resolve(missing);
    			});
				return deferred.promise;
    		}
    		
 
    		
			return factory;
    	};
})();

