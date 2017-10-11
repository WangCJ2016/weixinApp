angular.module('myOrderForm-controller', [])
	.controller('myOrderFormCtrl', ['$scope', '$state', 'ApiService', 'DuplicateLogin', 'systemBusy', '$timeout', '$ionicLoading', '$stateParams', function($scope,$state,ApiService, DuplicateLogin,systemBusy,$timeout,$ionicLoading,$stateParams) {
		$scope.select = true;
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner>'
		});
			//进行中订单
		ApiService.queryLandlordOrders({
			hotelId:$stateParams.id,
			customerId: localStorage.getItem('customerId'),
			type: 'ongoing',
			pageNo: 1,
			pageSize: 2
		}).success(function(res) {
			$ionicLoading.hide();

			if (res.success) {
				$scope.orders = res.result;
			}else {
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
		$scope.goAccountDetail = function(house,hotelName){
			
 		 	var data = {
				hotelName:hotelName,
				house:house
			}
			$state.go("accountDetail",{data:data})
		}
			//一结束订单
		ApiService.queryLandlordOrders({
			hotelId:$stateParams.id,
			customerId: localStorage.getItem('customerId'),
			type: 'end'
		}).success(function(res) {
			if (res.success) {
				$scope.endOrders = res.result;

			}
		});
	}]);
