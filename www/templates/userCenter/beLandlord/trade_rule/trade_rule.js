angular.module('tradeRule-controller', [])
.controller('tradeRuleCtrl',function($scope,$rootScope){
	$scope.back = function(){
		$rootScope.$ionicGoBack();
	};
});
