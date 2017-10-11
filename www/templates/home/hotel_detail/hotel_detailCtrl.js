angular.module('hotelDetail-controllers', [])
  .controller('hotelDetailCtrl', function($scope, $rootScope, $stateParams) {
	$scope.back = function() {
		$rootScope.$ionicGoBack();
	};
	$scope.switch = false;
  $scope.roomnum = $stateParams.hotelDetail.roomnum
	$scope.profiles = $stateParams.hotelDetail.profiles;
	$scope.num =  $stateParams.hotelDetail.num;
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
	$scope.call = function() {
		var number = $scope.num;
		window.plugins.CallNumber.callNumber(onSuccess, onError, number, true);

		function onSuccess(result) {

		}

		function onError(result) {

		}
	};

});
