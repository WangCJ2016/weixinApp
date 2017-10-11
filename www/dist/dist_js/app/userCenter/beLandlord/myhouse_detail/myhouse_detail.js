angular.module('myHouseDetail-controller', [])
	.controller('myHouseDetailCtrl', ['$scope', 'ApiService', '$stateParams', '$state', 'DuplicateLogin', 'systemBusy', '$timeout', '$ionicLoading', function($scope, ApiService, $stateParams, $state, DuplicateLogin,systemBusy,$timeout,$ionicLoading) {

		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner>'
		});
		ApiService.landlordHotelHouses({
			hotelId: $stateParams.id
		}).success(function(res) {
			
			$ionicLoading.hide();
			if (res.success) {
				$scope.hotels = res.result;
				var houseTypex = [],
					hotels = [];
				$scope.hotels.forEach(function(hotel) {
					if (houseTypex.indexOf(hotel.houseTypex) == -1) {
						houseTypex.push(hotel.houseTypex);
					}
				});

				for (var i = 0; i < houseTypex.length; i++) {
					hotels[i] = {};

				}
				for (var i = 0; i < houseTypex.length; i++) {
					hotels[i].houseTypex = houseTypex[i];
					hotels[i].houses = [];
				}

				for (var i = 0; i < houseTypex.length; i++) {
					for (var j = 0; j < $scope.hotels.length; j++) {
						if ($scope.hotels[j].houseTypex == houseTypex[i]) {
							hotels[i].houses.push($scope.hotels[j]);

						}
					}
				}
				$scope.hotels = hotels;
			}else{
				if (res.msg==='非法请求') {
          $ionicLoading.show({
            template: DuplicateLogin
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('login')
          },2000)
        }else {
          $ionicLoading.show({
            template: systemBusy
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('tab.home')
          },2000)
        }
			}
		});
		$scope.myhouseIntr = function(id,price) {
			sessionStorage.setItem("hotelId", $stateParams.id);
			$state.go('myhouseIntr', {
				id: id,
				price:price
			});
		};
	}]);
