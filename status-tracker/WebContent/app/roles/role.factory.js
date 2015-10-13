(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.factory('RoleFactory', RoleFactory);

    	RoleFactory.$inject = ['$q', '$log', '$firebaseArray', '$firebaseObject'];
    
    	function RoleFactory($q, $log, $firebaseArray, $firebaseObject) 
    	{
    		var factory = {};
    		var rolesRef = new Firebase("https://astadia-status.firebaseio.com/roles");
    		
    		factory.all = getAllRoles;
    		
    		function getAllRoles() {
    			return $firebaseArray(rolesRef).$loaded();
    		}
    		
			return factory;
    	};
})();

