angular.module('invoice-controller', [])
  .controller('invoceCtrl', function($scope, $ionicHistory, $ionicNativeTransitions,$state, $stateParams) {
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
});
