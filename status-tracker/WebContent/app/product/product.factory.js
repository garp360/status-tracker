(function() {
    'use strict';

    angular
    	.module('astadia.status.tracker')
    	.factory('ProductFactory', ProductFactory);

    	ProductFactory.$inject = ['$q', '$log', '$firebaseArray', '$firebaseObject'];
    
    	function ProductFactory($q, $log, $firebaseArray, $firebaseObject) 
    	{
    		var factory = {};
    		var productRef = new Firebase("https://astadia-status.firebaseio.com/products");
    		
    		factory.all = getAllProducts;
    		factory.product = getProduct;
    		factory.versions = getAllVersionsForProduct;
    		
    		function getAllProducts() {
    			return $firebaseArray(productRef).$loaded();
    		};

    		function getProduct(product) {
    			return $firebaseObject(productRef.child(product)).$loaded();
    		};

    		function getAllVersionsForProduct(product) {
    			return $firebaseArray(productRef.child(product).child("versions")).$loaded();
    		};

			return factory;
    	};
})();

