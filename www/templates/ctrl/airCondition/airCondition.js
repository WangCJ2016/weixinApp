angular.module('airCondition-controller', [])
  .controller('airCtrl', function($scope, ApiService, $rootScope, $stateParams, $timeout, $ionicLoading) {
    $scope.goback = function() {
      $rootScope.$ionicGoBack();
    };
    // 空调开关状态
    $scope.status = 'OFF'
    // 起始设置温度
    $scope.temp = ''
    var data1 = {
      deviceName: encodeURI('空调'),
      houseId: sessionStorage.getItem('houseId')
    }
    ApiService.queryDeviceType(data1)
      .success(function(res) {
        $scope.deviceType = res.dataObject
        var data = {
          ip: sessionStorage.getItem('ip'),
          deviceType: $scope.deviceType,
          houseId: sessionStorage.getItem('houseId')
        };
        ApiService.ctrlHostDeviceByType(data).success(function(res) {
          if (res.success) {
            $scope.length = res.dataObject.devices.length
            $scope.title = res.dataObject.devices[0].name.replace(/[0-9$]/g, '')
            //more(res.dataObject)
            $scope.airConditionArrays = []
            res.dataObject.devices.forEach(function(air) {
              var airData = {}
              airData.deviceId = air.deviceId
              airData.index = 0
              airData.model = '制冷'
              airData.status = 'OFF'
              airData.speed = 0
              airData.speedArray = []
              var ways = air.ways;
              if (ways) {
                // console.log(ways)
                airWays(ways, airData)
              }

              $scope.airConditionArrays.push(airData)
            })
            more()
            $scope.airState = 0
            $scope.model = '制冷'

            //向右滑
            $scope.onSwipeRight = function(e) {
              e.preventDefault()
              e.stopPropagation()
              if ($scope.airState > 0) {
                $scope.airState--
                  changeTempArray('制冷')
                $scope.title = res.dataObject.devices[$scope.airState].name.replace(/[0-9$]/g, '')
              }
            }
            //向左滑
            $scope.onSwipeLeft = function(e) {
              e.preventDefault()
              e.stopPropagation()
              if ($scope.airState < $scope.length - 1) {
                $scope.airState++
                  changeTempArray('制冷')
                $scope.title = res.dataObject.devices[$scope.airState].name.replace(/[0-9$]/g, '')
              }
            }
            $scope.onDrag = function(e) {
              e.preventDefault()
              e.stopPropagation()
            }
            var index = 0;

            //改变模式
            $scope.changeModel = function() {
              var arr = $scope.airConditionArrays[$scope.airState]
              $scope.airConditionArrays[$scope.airState].index = 0
              if ($scope.airConditionArrays[$scope.airState].model == '制冷') {
                $scope.airConditionArrays[$scope.airState].model = '制热';
                changeTempArray('制热')

              } else {
                $scope.airConditionArrays[$scope.airState].model = '制冷';
                changeTempArray('制冷')
              }
              changeTem('ON')
            };
            //$scope.temp = arr[0];
            //温度加
            $scope.tempAdd = function() {
              changeTem('plus')
            };
            //温度减
            $scope.tempReduce = function() {
              changeTem('mius')
            };
            $scope.speedChange = function() {
              var air = $scope.airConditionArrays[$scope.airState]
              air.speed ++ 
              air.speedArray = []
              for(var i = 1 ; i<= air.speed%4 ; i++) {
                air.speedArray.push('speed_' + i)
              }
              changeTem()
            }
            //关闭空调
            $scope.off = function(deviceId) {
              var air = $scope.airConditionArrays[$scope.airState]
              if (air.status === 'OFF') {
                air.status = 'ON'
                changeTem('ON')
              } else {
                air.status = 'OFF'
                var arr = $scope.airConditionArrays[$scope.airState]
                var data = {
                  deviceId: deviceId,
                  houseId: sessionStorage.getItem('houseId'),
                  deviceType: $scope.deviceType,
                  port: sessionStorage.getItem('port'),
                  serverId: sessionStorage.getItem('serverId'),
                  key: 'OFF',
                  mode: arr.model === '制冷' ? 'COOL' : 'WARM',
                  wind: 1,
                  onOff: 'OFF'
                };
                air.temp = null
              ApiService.smartHostControl(data).success(function(res) {
                console.log(res)
              });
              }
            };
          } else {
            $timeout(function() {
              $ionicLoading.hide();
            }, 1000);
          }
        });
      })


    //多个空调
    function more() {
      $scope.potArray = []
      if ($scope.length > 1) {
        for (var i = $scope.length - 1; i >= 0; i--) {
          $scope.potArray.push(i)
        }
      }
      $scope.perWidth = 100 / $scope.length
    }
    // 空调数据排列
    function airWays(ways, airData) {
     // console.log(ways)
      if ($scope.deviceType === 'VIRTUAL_AIR_REMOTE') {
        var allKey = [],
          coolKey = [],
          warmKey = [],
          coolName, warmName;

        function numberOrder(a, b) {
          return a - b;
        }
        coolKey = ways.filter(function(way) {
          return way.remoteKey.indexOf('COOL') > -1
        }).map(function(way) {
          coolName = way.remoteKey.slice(0, -2);
          return way.remoteKey.slice(-2)
        })

        var coolWays = coolKey.sort(numberOrder).map(function(item) {
          return coolName + item
        });

        warmKey = ways.filter(function(way) {
          return way.remoteKey.indexOf('WARM') > -1
        }).map(function(way) {
          warmName = way.remoteKey.slice(0, -2);
          return way.remoteKey.slice(-2)
        })
        var warmWays = warmKey.sort(numberOrder).map(function(item) {
          return warmName + item
        });
        airData.coolWays = coolWays
        airData.warmWays = warmWays
      }
      if ($scope.deviceType === 'VIRTUAL_CENTRAL_AIR_REMOTE') {
        var coolWays = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30]
        var warmWays = [20, 21, 22, 23, 24, 25, 26, 28, 29, 30]
      }
      airData.coolWays = coolWays
      airData.warmWays = warmWays
    }

    // 改变temp数组
    function changeTempArray(model) {
      if ($scope.deviceType === 'VIRTUAL_AIR_REMOTE') {
        if (model === '制冷' && $scope.airConditionArrays[$scope.airState].coolWays) {
          $scope.airConditionArrays[$scope.airState].temp = $scope.airConditionArrays[$scope.airState].coolWays[0].slice(-2)
        } else if ($scope.airConditionArrays[$scope.airState].warmWays) {
          $scope.airConditionArrays[$scope.airState].temp = $scope.airConditionArrays[$scope.airState].warmWays[0].slice(-2)
        }
      } else {
        if (model === '制冷' && $scope.airConditionArrays[$scope.airState].coolWays) {
          $scope.temp = $scope.airConditionArrays[$scope.airState].coolWays[0]
        } else if ($scope.airConditionArrays[$scope.airState].warmWays) {
          $scope.temp = $scope.airConditionArrays[$scope.airState].warmWays[0]
        }
      }
    }
    //改变温度
    function changeTem(type) {
      navigator.vibrate(100);
      var arr = $scope.airConditionArrays[$scope.airState]
      //console.log(arr)
      var temArr = []
      var index = arr.index
      arr.status = 'ON'
      if (arr.model === '制冷') {
        temArr = arr.coolWays
      } else {
        temArr = arr.warmWays
      }
      if (type === 'plus' && index + 1 <= temArr.length - 1) {
        index = index + 1
        arr.index = index
      }
      if (type === 'mius' && index - 1 >= 0) {
        index = index - 1
        arr.index = index
      }
      if (type === 'ON') {
        index = Math.floor(temArr.length/2)
        arr.index = index
       // console.log(index)
      }
      var data = {
        deviceId: arr.deviceId,
        houseId: sessionStorage.getItem('houseId'),
        deviceType: $scope.deviceType,
        port: sessionStorage.getItem('port'),
        serverId: sessionStorage.getItem('serverId'),
        key: temArr[index],
        mode: arr.model === '制冷' ? 'COOL' : 'WARM',
        wind: arr.speed%4
      };
      if ($scope.deviceType === 'VIRTUAL_AIR_REMOTE') {
        arr.temp = temArr[index].slice(-2);
      } else {
        arr.temp = temArr[index]
      }
    
      ApiService.smartHostControl(data).success(function(res) {
        console.log(res)
      });

    }
  });
