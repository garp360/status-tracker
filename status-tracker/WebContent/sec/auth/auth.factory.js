(function() {
    'use strict';

    angular
    	.module('astadia.auth')
    	.factory('AuthFactory', AuthFactory);

    	AuthFactory.$inject = ['$q', '$log', '$firebaseAuth', '$firebaseArray', '$firebaseObject'];
    
    	function AuthFactory($q, $log, $firebaseAuth, $firebaseArray, $firebaseObject) 
    	{
    		var factory = {};
    		var authRef = new Firebase("https://astadia-authx.firebaseio.com");
    		var userRef = new Firebase("https://astadia-authx.firebaseio.com/users");
    		var roleRef = new Firebase("https://astadia-authx.firebaseio.com/roles");
    		
    		factory.isAuthenticated = isAuth;
    		factory.getAuth = getAuth;
    		factory.getAuthUser = getAuthUser;
			factory.login = login;
			factory.logout = logout;
			
			function login (token) 
			{
				var deferred = $q.defer();
				
				if(__validate(token)) 
				{
					$firebaseAuth(authRef).$authWithPassword({email: token.username, password: token.password}).then(function(auth) {
						return getAuthUser();
					}, function(error) {
						deferred.reject("LOGIN::Invalid login! ERROR: " + error);
					}).then(function(authUser) {
						deferred.resolve(authUser);
					}, function(error) {
						deferred.reject("LOGIN::Roles not found! ERROR: " + error);
					});
				}
				else 
				{
					deferred.reject("LOGIN::Invalid login! ERROR: Invalid credentials.");
				}
		
				return deferred.promise;
			};
			
			function logout() 
			{
				return $firebaseAuth(authRef).$unauth();
			};
			
			function isAuth() 
			{
				var auth = false;
				if($firebaseAuth(authRef).$getAuth())
				{
					auth = true;
				}
				return auth;
			};
			
			function getAuthUser() 
			{
				var deferred = $q.defer();
				var lookupId = "";
				var authUser = {};
				
				getAuth().then(function(auth) {
					lookupId = auth.uid;
					return $firebaseObject(userRef.child(lookupId)).$loaded();
				}, function(error) {
					deferred.reject("AUTH_USER::User lookup failed! ERROR: " + error);
				}).then(function(user) {
					authUser = user;
					return $firebaseArray(roleRef.child(lookupId)).$loaded();
				}, function(error) {
					deferred.reject("AUTH_USER::Role lookup failed! ERROR: " + error);
				}).then(function(roles) {
					authUser.roles = roles;
					deferred.resolve(authUser);
				}, function(error) {
					deferred.reject("GENERAL::ERROR: " + error);
				});
				
				return deferred.promise;
			};
			
			function getAuth() 
			{
				var deferred = $q.defer();
				deferred.resolve($firebaseAuth(authRef).$getAuth());
				return deferred.promise;
			};
			
			function __validate(token) 
			{
				return (token && token.username && token.password && token.username.trim().length > 0 && token.password.trim().length > 0);
			};

			return factory;
    	};
})();

