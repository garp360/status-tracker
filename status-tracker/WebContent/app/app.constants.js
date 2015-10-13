	(function() {
    'use strict';
    angular
    	.module('app.constants',[])
    	.constant('ROUTES', {
    		'AUTH' : { 
    			LOGOUT : 'login',
    			LOGIN_SUCCESS : 'dashboard'
    		},
    		'APP' : {
    			DASHBOARD : 'dashboard',
        		LOGIN : 'login'
    		}
    	});
})();