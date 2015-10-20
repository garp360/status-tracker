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

    		function getReport(empId, reportId) 
    		{
    			$log.debug("StatusFactory.getReport( " + " empId=[" + empId + " ], reportId=[ " + reportId + " ]");
    			var deferred = $q.defer();
    			
    			var ref = statusRef.child(empId).child("reports").child(reportId);
    			$firebaseObject(ref).$loaded().then(function(report) {
					report.lastModified = moment().utc().valueOf();
					report.employeeId = empId;
					if(!report.items) 
					{
						report.items = [];
					}
    				return report.$save();
    			}, function(error){
    				deferred.reject("REPORT:: " + error);
    			}).then(function(report){
    				deferred.resolve($firebaseObject(ref).$loaded());
    			});
    			return deferred.promise;
    		}
    		
    		function saveReport(empId, reportId, item)
    		{
    			var deferred = $q.defer();
    			$firebaseObject(statusRef.child(empId).child("reports").child(reportId)).$loaded().then(function(report) {
    				if(!report.items) 
    				{
    					report.items = [];
    				}
    				report.items.push(transformReportItem(item));
    				deferred.resolve(report.$save());
    			});
    			return deferred.promise;
    		}

    		function transformReportItem(item){
    			return {
    				product: item.product.name,
    				version: item.version.name,
    				role: item.role.name,
    				allocation: item.allocation
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

