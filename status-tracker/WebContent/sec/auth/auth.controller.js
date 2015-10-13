(function() {
	'use strict';

	angular.module('astadia.auth').controller('AuthController', AuthController);

	AuthController.$inject = [ '$scope', '$log', '$controller', '$state', '$timeout', '$firebaseAuth', 'AuthFactory', 'ROUTES'];

	function AuthController($scope, $log, $controller, $state, $timeout, $firebaseAuth, AuthFactory, ROUTES) {
		var authRef = $firebaseAuth(new Firebase("https://astadia-authx.firebaseio.com"));

		$scope.token = {};
		$scope.authUser = {};
		$scope.isAuth = false;

		$scope.login = login;
		$scope.logout = logout;

		authRef.$onAuth(function(authData) {
			if (authData) {
				$scope.isAuth = true;
			} else {
				$scope.authUser = {};
				$scope.isAuth = false;
				$scope.authUser = {};
			}
		});

		function login() {
			AuthFactory.login({
				username : $scope.token.username,
				password : $scope.token.password
			}).then(function(authUser) {
				$log.debug("AUTH_USER = {" + authUser + "}");
				$scope.authUser = authUser;
				$state.go(ROUTES.AUTH.LOGIN_SUCCESS);
			}, function(error) {
				$log.debug("ERROR: " + error);
			});
		};

		function logout() {
			AuthFactory.logout();
			$state.go(ROUTES.AUTH.LOGOUT);
		};
	};
})();