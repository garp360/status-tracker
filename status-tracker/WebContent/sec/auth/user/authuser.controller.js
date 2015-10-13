(function() {
	'use strict';

	angular.module('astadia.auth').controller('AuthUserController', AuthUserController);

	AuthUserController.$inject = [ '$scope', '$log', '$controller', '$state', '$timeout', '$firebaseAuth', 'AuthFactory', 'AUTH_STATE'];

	function AuthUserController($scope, $log, $controller, $state, $timeout, $firebaseAuth, AuthFactory, AUTH_STATE) {
		var ref = $firebaseAuth(new Firebase("https://astadia-authx.firebaseio.com"));

		$scope.token = {};
		$scope.authUser = {};
		$scope.isAuth = false;

		$scope.login = login;
		$scope.logout = logout;

		ref.$onAuth(function(authData) {
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
				$scope.authUser = authUser;
				$state.go(AUTH_STATE.LOGIN_SUCCESS_ROUTE);
			}, function(error) {
				$log.debug("ERROR: " + error);
			});
		}
		;

		function logout() {
			AuthFactory.logout();
			$state.go(AUTH_STATE.LOGOUT_ROUTE);
		}
		;

	}
	;
})();