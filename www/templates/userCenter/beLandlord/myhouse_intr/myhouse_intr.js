angular.module('myHouseIntr-controller', [])
	.controller('myhouseIntrCtrl', function($scope, ApiService, house, $state, $stateParams) {

		$scope.house = house.data.dataObject;
		$scope.myhouseDevice = function() {
			$state.go('myhouseDevice', {
				mess: $scope.house.assort
			});
		};
		$scope.assorts = $scope.house.assort.split(',');
		$scope.goback = function() {
			$state.go('myhouseDetail', {
				id: sessionStorage.getItem('hotelId')
			});
		};
	});
