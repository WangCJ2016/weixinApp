angular.module('accountDetail-controller', [])
	.controller('accountDetailCtrl', ['$scope', 'ApiService', '$state', '$rootScope', '$stateParams', function($scope, ApiService, $state,$rootScope,$stateParams) {
		
		$scope.goBack = function(){
			$rootScope.$ionicGoBack();
		}
		$scope.house = $stateParams.data.house;
		$scope.hotelName = $stateParams.data.hotelName;
	}]);
