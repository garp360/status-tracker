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
    		
    		function save(empId, year, month, report) 
    		{
    			var deferred = $q.defer();
    			var ref = statusRef.child(empId).child("status").child("y" + year).child("m" + month);
    			$firebaseArray(ref).$loaded().then(function(status){
    				status.push(report);
    				return status.$save();
    			}).then(function(status){
    				deferred.resolve(status);
    			});
    			
    			return deferred.promise;
    		}
    		
			return factory;
    	};
})();

