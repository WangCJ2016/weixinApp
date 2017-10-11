angular.module('invoice-controller', [])
  .controller('invoceCtrl', ['$scope', '$ionicHistory', '$ionicNativeTransitions', '$state', '$stateParams', function($scope, $ionicHistory, $ionicNativeTransitions,$state, $stateParams) {
	$scope.back = function() {
		$ionicNativeTransitions.stateGo('orderDetail', {
			'order': $stateParams.order
		}, {
			cache: false
		}, {
			"type": "slide",
			"direction": "right" // 'left|right|up|down', default 'left' (which is like 'next')
        // in milliseconds (ms), default 400
		});
	};
}]);
