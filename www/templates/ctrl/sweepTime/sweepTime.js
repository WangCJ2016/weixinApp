angular.module('sweepTime-controller', [])
  .controller('sweepTimeCtrl', function($scope, $rootScope, ApiService, $stateParams) {
    $scope.back = function() {
      $rootScope.$ionicGoBack();
    }
    var data = {
      hotelId: sessionStorage.getItem('serviceHotelId'),
      customerId: localStorage.getItem('customerId'),
      houseId: sessionStorage.getItem('serviceHouseId'),
      type: $stateParams.id
    }
    $scope.waitingStatus = false;
    $scope.handleStatus = false;
    $scope.completeStatus = false;
    ApiService.serviceHandleRecords(data).success(function(res) {
      if (res.success) {
        switch (res.result[0].content) {
          case '等待':
            $scope.waitingStatus = true;
            break;
          case '已处理':
            $scope.handleStatus = true;
            break;
          case '打扫完成':
            $scope.completeStatus = true;
            break;
          default:
            break
        }
      }
    })
    $scope.contenSwitch = false;
    $scope.changeTime = function() {
      $scope.timeSwitch = true;
    };
    $scope.times = ['13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];
    $scope.selectTime = function(id, time) {
      $scope.index = id;
      $scope.timeSwitch = false;
    };
  });
