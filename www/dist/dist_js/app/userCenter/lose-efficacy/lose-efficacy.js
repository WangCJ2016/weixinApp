angular.module('loseEfficacy-controller', [])
    .controller('loseEfficacyCtrl', ['$scope', '$state', '$ionicLoading', 'ApiService', '$timeout', 'DuplicateLogin', 'systemBusy', function($scope, $state, $ionicLoading, ApiService,$timeout,DuplicateLogin,systemBusy) {
	if (!localStorage.getItem('customerId')) {
		$state.go('login');
	} else {
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner>'
		});
		$scope.pageNo = 1;
		$scope.moreDataCanBeLoaded = true;
		ApiService.queryCustomerOrders({
			customerId: localStorage.getItem('customerId'),
			pageNo: $scope.pageNo,
			pageSize: 5,
      type:'end'
		}).success(function(res) {
			if (res.success) {
				$ionicLoading.hide();
				$scope.orders = res.result;
				$scope.pageNo++;
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
		$scope.loadMoreData = function() {
      ApiService.queryCustomerOrders({
  			customerId: localStorage.getItem('customerId'),
  			pageNo: $scope.pageNo,
  			pageSize: 5,
        type:'end'
  		}).success(function(res) {

				if (res.success) {
          if (res.result.length > 0) {
            for (var i = 0; i < res.result.length; i++) {
  						$scope.orders.push(res.result[i]);
  						$scope.$broadcast("scroll.infiniteScrollComplete");
  					}
  					$scope.pageNo++;
          }else {
            $scope.moreDataCanBeLoaded = false;
          }

				} else {
					$scope.moreDataCanBeLoaded = false;
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
		};
    //订单详情
    $scope.goOrderDetail = function(order){
      $state.go('endOrderDetail',{data:order})
    }
	}
}]);
