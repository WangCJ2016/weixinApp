angular.module('hotelService-controllers', [])
.controller('hotelService',function($scope,$stateParams,$rootScope){
	$scope.back = function() {
		$rootScope.$ionicGoBack();
	};
	$scope.switch = false;
	$scope.profiles = $stateParams.hotelDetail.profiles;
	$scope.assorts = $stateParams.hotelDetail.assorts.map(function(assort) {
		var index = assort.indexOf('-');
		return {
			name: assort.slice(0, index),
			img: assort.slice(index + 1),

		};
	});
	$scope.services = $stateParams.hotelDetail.services.map(function(assort) {
		var index = assort.indexOf('-');
		return {
			name: assort.slice(0, index),
			img: assort.slice(index + 1),

		};
	});
});
