angular.module('landlordProfit-controller', [])
  .controller('landlordProfitCtrl', ['$scope', '$ionicNativeTransitions', '$state', 'ApiService', '$ionicHistory', function($scope, $ionicNativeTransitions, $state, ApiService, $ionicHistory) {
	$scope.goback = function() {
		$ionicNativeTransitions.stateGo($ionicHistory.viewHistory().backView.stateId, {}, {}, {
			"type": "slide",
			"direction": "right" // in milliseconds (ms), default 400
		});
	};
	$scope.joinus = function() {

		if (!localStorage.getItem('customerId')) {
			$state.go('login');
		} else {
			$state.go('joinUs');
		}
	};

}]);
