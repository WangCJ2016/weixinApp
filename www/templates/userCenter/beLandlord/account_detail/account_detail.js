angular.module('accountDetail-controller', [])
	.controller('accountDetailCtrl', function($scope, ApiService, $state,$rootScope,$stateParams) {
		
		$scope.goBack = function(){
			$rootScope.$ionicGoBack();
		}
		$scope.house = $stateParams.data.house;
		$scope.hotelName = $stateParams.data.hotelName;
	});
