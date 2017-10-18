angular.module('clean-controller', [])
  .controller('cleanCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicPopup', '$state', 'ApiService', 'DuplicateLogin', 'systemBusy', '$ionicLoading', '$timeout', '$ionicViewSwitcher', function($scope, $stateParams, $rootScope,$ionicPopup,$state, ApiService,DuplicateLogin,systemBusy,$ionicLoading, $timeout, $ionicViewSwitcher) {
  $scope.goback = function() {
		$rootScope.$ionicGoBack();
	};
  $scope.hotelName = sessionStorage.getItem('hotelName');
  $scope.houseName = sessionStorage.getItem('houseName');
	$scope.leave = function() {
		$ionicPopup.show({
			template: "确定要退房吗?",
			buttons: [{
				text: '确定',
				onTap:function(){
					return 1;
				}
			}, {
				text: '取消'
			}],
			cssClass: 'ajk',
		})
  .then(function(res) {
	if (res) {
		ApiService.modifySubOrdersStatus({
			subOrderCode: $stateParams.data.subOrderCode,
			operate: 'leave'
		}).success(function(res) {
			if (res.success) {
				$ionicLoading.show({
					template: '退房成功',
          noBackdrop: 'true',
          duration: 2000
				});
				$timeout(function() {
					$state.go('tab.home');
					$ionicViewSwitcher.nextDirection("back");
				}, 1000);
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
	} else {

	}
});
	};
	$scope.goService = function(type) {
		if (type == '打扫') {
      var sweepData = {
        hotelId:sessionStorage.getItem('serviceHotelId'),
        customerId:localStorage.getItem('customerId'),
        houseId:sessionStorage.getItem('serviceHouseId'),
        content:encodeURI('打扫'),
        type:1
      }
      ApiService.customerCallService(sweepData).success(function(res){
        if (res.success) {
          $state.go('sweepTime',{id:1});
        }
      })

		} else if (type == '维修') {
			$state.go('maintain',{id:2});

		}
	};
}]);
