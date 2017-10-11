angular.module('Consume-controller', [])
	.controller('ConsumeCtrl', function($scope, $state, ApiService,DuplicateLogin,systemBusy, $ionicLoading,$timeout) {
		if (!localStorage.getItem('customerId')) {
			$state.go('login');
		} else {
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner>'
			});
			$scope.pageNo = 1;
			$scope.moreDataCanBeLoaded = true;
			ApiService.customerConsumeRecords({
				customerId: localStorage.getItem('customerId'),
				pageNo: $scope.pageNo,
				pageSize: 7
			}).success(function(res) {

				if (res.success) {
					$ionicLoading.hide();
					$scope.consumes = res.result;
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
				ApiService.customerConsumeRecords({
					customerId: localStorage.getItem('customerId'),
					pageNo: $scope.pageNo,
					pageSize: 7
				}).success(function(res) {
	        console.log(res);
					if (res.success) {
						if (res.result.length > 0) {
							for (var i = 0; i < res.result.length; i++) {
								$scope.consumes.push(res.result[i]);
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
