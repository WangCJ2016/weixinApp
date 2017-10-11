angular.module('inHouse-controller', [])
  .controller('inHouseCtrl', ['$scope', '$stateParams', '$state', 'DuplicateLogin', 'systemBusy', '$ionicPopup', 'ApiService', '$ionicLoading', '$timeout', function($scope, $stateParams, $state,DuplicateLogin,systemBusy,$ionicPopup,ApiService, $ionicLoading, $timeout) {

    $scope.house = $stateParams.data.house;
    $scope.hotelName = $stateParams.data.hotelName;
    $scope.orderCode = $stateParams.data.orderCode;
    sessionStorage.setItem('hotelName', $scope.hotelName);
    sessionStorage.setItem('houseName', $scope.house.houseName);
    var time = $stateParams.data.house.inTime.split(' ')[0].split('-');
    var inTime = new Date(time[0], time[1] - 1, time[2], 14, 00, 00).getTime();
    sessionStorage.setItem('subOrderCode', $stateParams.data.house.subOrderCode);
    $scope.inTime = inTime > new Date().getTime();
    //入住
    $scope.inHome = function() {
      var data = {
        subOrderCode: $scope.house.subOrderCode,
        operate: 'in'
      };
      ApiService.modifySubOrdersStatus(data).success(function(res) {
        if (res.success) {
          var data = {
            houseId: $scope.house.houseId,
            subOrderId: $scope.orderCode,
            subOrderCode: $stateParams.data.subOrderCode
          };
          sessionStorage.setItem('serviceHotelId',$stateParams.data.hotelId);
          sessionStorage.setItem('serviceHouseId',$scope.house.houseId);
          $state.go('checkIn', {
            data: data
          });
        }else{
          $ionicLoading.show({
            template:res.msg
          })
          $timeout(function(res){
            $ionicLoading.hide()
          },2000)
        }
      });
    };
    //取消订房
    $scope.cancleSubOrder = function() {
			$ionicPopup.show({
          template: "确定要取消退房吗?",
          buttons: [{
            text: '确定',
            onTap: function() {
              return 1;
            }
          }, {
            text: '取消'
          }],
          cssClass: 'ajk',
        })
				.then(function(res){
					if(res){
						ApiService.cancleSubOrder({
							subOrderCode: $scope.house.subOrderCode
						}).success(function(res) {
							if (res.success) {
								$ionicLoading.show({
									template: '取消订单成功'
								});
								$timeout(function() {
									$state.go('tab.home');
								}, 1000);
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
					}
				})

    };
  }]);
