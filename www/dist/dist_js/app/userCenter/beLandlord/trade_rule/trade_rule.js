angular.module('tradeRule-controller', [])
.controller('tradeRuleCtrl',['$scope', '$rootScope', function($scope,$rootScope){
	$scope.back = function(){
		$rootScope.$ionicGoBack();
	};
}]);
