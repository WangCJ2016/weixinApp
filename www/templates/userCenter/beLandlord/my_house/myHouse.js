angular.module('myHouse-controller', [])
	.controller('myHouseCtrl', function($scope, ApiService,DuplicateLogin,systemBusy,$state, $ionicLoading,$timeout,$stateParams) {
		if (!localStorage.getItem('customerId')) {
			$state.go('login');
		} else {
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner>'
			});
			var pageNo = 1;
	    $scope.moreDataCanBeLoaded = true;
			ApiService.landlordHotels({
				customerId: localStorage.getItem('customerId'),
				pageNo: pageNo,
	      pageSize: 7
			}).success(function(res) {
				if (res.success) {
					pageNo++;
					$ionicLoading.hide();
					$scope.hotels = res.result;
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
	      ApiService.landlordHotels({
					customerId: localStorage.getItem('customerId'),
	        pageNo: pageNo,
	        pageSize: 7
	      }).success(function(res) {
	        if (res.success) {
						if (res.result.length > 0) {
							for (var i = 0; i < res.result.length; i++) {
		            $scope.hotels.push(res.result[i]);
		          }
							$scope.$broadcast("scroll.infiniteScrollComplete");
		          pageNo++;
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



			$scope.seeHouse = function(id) {
				$state.go('seeHouse', {
					id: id
				});
			};
		}
	});
