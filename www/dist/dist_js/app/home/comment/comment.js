angular.module('commentCtrl-controller', [])
	.controller('commentCtrl', ['$scope', '$rootScope', '$stateParams', 'ApiService', '$state', function($scope, $rootScope,$stateParams, ApiService, $state) {
		//返回
		$scope.stars = $stateParams.stars;
		$scope.star_full = [];
		$scope.star_full.length = $scope.stars;
		$scope.star_blank = [];
		$scope.star_blank.length = 5 - $scope.stars;
		$scope.goHouseDtail = function() {
			$rootScope.$ionicGoBack();
		};
		ApiService.getHotelFeedback({
			hotelId: $stateParams.id
		}).success(function(res) {
			$scope.customers = res.result;
		});
	}]);
