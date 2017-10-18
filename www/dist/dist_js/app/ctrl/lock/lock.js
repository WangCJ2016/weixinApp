angular.module('lock-controller', [])
  .controller('lockCtrl', ['$scope', 'ApiService', '$ionicLoading', '$state', '$rootScope', function($scope, ApiService,$ionicLoading,$state,$rootScope) {
      var ctrl_houseName = sessionStorage.getItem('houseName')
      ctrl_houseName ? $scope.name = sessionStorage.getItem('houseName').replace(/[0-9]/g, '') : null
      ctrl_houseName ? $scope.num = sessionStorage.getItem('houseName').replace(/[^0-9]/g, '') : null
      $scope.goback = function() {
        $rootScope.$ionicGoBack();
      }
      $scope.activeIndex = -1
      $scope.arrys = [{ title: '电源', name: 'source' }, { title: '门', name: 'door' }, { title: '电梯', name: 'elevator' }]
      //获取锁
      var data = {
        ip: sessionStorage.getItem('ip'),
        deviceType: 'FINGERPRINT_LOCK',
        houseId: sessionStorage.getItem('houseId')
      };
      ApiService.ctrlHostDeviceByType(data).success(function(res) {
          if (res && res.success) {
            var deviceId = res.dataObject.devices[0].deviceId;
           // console.log(deviceId)
            if (res.dataObject) {
              $scope.lockCtrl = function(name, index) {
             //  console.log(name, index)
              	$scope.activeIndex = index
                switch (name) {
                  case 'door':
                    openDoor(deviceId);
                    break;
                  case 'source':
                    break;
                  default:
                    break;
                }
              }
            };
          }
        })
     

    function openDoor(deviceId) {
      var data = {
        houseId: sessionStorage.getItem('houseId'),
        deviceType: 'FINGERPRINT_LOCK',
        port: sessionStorage.getItem('port'),
        serverId: sessionStorage.getItem('serverId'),
        deviceId: deviceId,
        subOrderCode: sessionStorage.getItem('subOrderCode')
      };
      $ionicLoading.show({
				template: "开锁成功",
				noBackdrop: 'true',
				duration: 2000
			});
      ApiService.smartHostControl(data).success(function(res) {
         $rootScope.$ionicGoBack();
      });
    }
  }]);
