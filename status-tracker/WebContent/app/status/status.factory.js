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
    		
    		function getStatus(empId) 
    		{
    			var ref = statusRef.child(empId).child("status");
    			return $firebaseArray(ref).$loaded();
    		}
    		
			return factory;
    	};
})();

