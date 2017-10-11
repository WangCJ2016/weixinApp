angular.module('Pay-controller', [])
    .controller('PayCtrl', function($scope, $state, DuplicateLogin,systemBusy,$timeout,$ionicLoading, ApiService) {
	if (!localStorage.getItem('customerId')) {
		$state.go('login');
	} else {
		$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner>'
		});
		$scope.pageNo = 1;
		$scope.moreDataCanBeLoaded = true;
		ApiService.queryOrderPage({
			customerId: localStorage.getItem('customerId'),
			status: 1,
			pageNo: $scope.pageNo,
			pageSize:5
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
			ApiService.queryOrderPage({
				customerId: localStorage.getItem('customerId'),
				status: 1,
				pageNo: $scope.pageNo,
				pageSize:5
			}).success(function(res) {
      
				if (res.success) {
          if(res.result.length > 0){
            for (var i = 0; i < res.result.length; i++) {
              $scope.orders.push(res.result[i]);
            }
            $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.pageNo++;
          }else{
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
	}
});
