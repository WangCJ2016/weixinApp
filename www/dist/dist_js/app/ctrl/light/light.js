angular.module('light-controller', [])
  .controller('lightCtrl', ['$scope', '$rootScope', '$stateParams', 'quadrant', '$rootScope', 'ApiService', '$state', '$timeout', function($scope, $rootScope, $stateParams, quadrant, $rootScope, ApiService, $state, $timeout) {
    $scope.goback = function() {
      $rootScope.$ionicGoBack();
      //$state.go('checkIn');
    }
    $scope.tab_navs = ['卫生间', '卧室', '走廊', '其他']

    var data = {
      deviceType: 'SWITCH',
      ip: sessionStorage.getItem('ip'),
      houseId: sessionStorage.getItem('houseId')
    };
    //获取主机路线
    function getways() {
      ApiService.querySmartDeviceWays(data)
        .success(function(res) {
          if (res.success) {
            //console.log(res)
            $scope.lights = res.dataObject.ways
            $scope.allLights = $scope.lights.filter(function(light, index) {
              return light.name.indexOf('灯') > -1;
            });
            $scope.tabClick('卧室', 1)
          }
        })
    }
    getways();
    //切换tab
    $scope.tabClick = function(type, index) {
      $scope.lights = $scope.allLights.filter(function(light, index) {
        return light.name.indexOf(type) > -1;
      });
      $scope.lights.forEach(function(light, index) {
        var rotate = -90 + (30 * Math.round(index / 2)) * Math.pow(-1, index + 1)
        light.rotate = rotate
      })
    }
    // typeClick
    $scope.middle_round_rotate = 0 + 'deg'
    $scope.modleIndex = 1
    $scope.type_light = '卧室'
    $scope.typeClick = function(index, type) {
      $scope.middle_round_rotate = index * 25 - 25 + 'deg'
      $scope.modleIndex = index;
      $scope.type_light = type
      $scope.tabClick(type, index)
    }
    //灯控制
    $scope.lightCtrl = function(light) {
      var status = light.status == 'ON' ? "CLOSE" : 'OPEN';
      light.status = light.status == 'ON' ? "OFF" : 'ON';
      var data = {
        houseId: sessionStorage.getItem('houseId'),
        port: sessionStorage.getItem('port'),
        deviceType: 'SWITCH',
        serverId: sessionStorage.getItem('serverId'),
        actionType: status,
        wayId: light.wayId,
        brightness: 90
      };

      ApiService.smartHostControl(data).success(function(res) {
        console.log(res)
      });
    };

    // large_round 渲染
    var fontSize = window.innerWidth / 10
    var raduisX = fontSize * 7.733,
      raduisY = fontSize * 12.27,
      currentAngle = 0;
    $scope.large_round_rotate = 0
    $scope.onTouch = function(e) {
      e.preventDefault()
      var pageX = e.gesture.center.pageX
      var pageY = e.gesture.center.pageY
      var to = ((pageX - raduisX) / (pageY - raduisY))
      var whichquadrant = quadrant(pageX, raduisX, pageY, raduisY)
      if (whichquadrant === 3) {
        $scope.currentAngle = Math.atan(to) / (2 * Math.PI) * 360
      }
      if (whichquadrant === 4) {
        $scope.currentAngle = Math.atan(to) / (2 * Math.PI) * 360 + 180
      }
      if (whichquadrant === 2) {
        $scope.currentAngle = Math.atan(to) / (2 * Math.PI) * 360
      }
      if (whichquadrant === 1) {
        $scope.currentAngle = Math.atan(to) / (2 * Math.PI) * 360 + 180
      }
    }
    $scope.currentAngle = 0
    $scope.touchstart = function(e) {
      e.preventDefault()
      var pageX = e.gesture.center.pageX
      var pageY = e.gesture.center.pageY

      //判断第几象限
      var whichquadrant = quadrant(pageX, raduisX, pageY, raduisY)
      var to = ((pageX - raduisX) / (pageY - raduisY))
      let moveAngle
      if (whichquadrant === 3) {
        moveAngle = Math.atan(to) / (2 * Math.PI) * 360
      }
      if (whichquadrant === 4) {
        moveAngle = Math.atan(to) / (2 * Math.PI) * 360 + 180
      }
      if (whichquadrant === 2) {
        moveAngle = Math.atan(to) / (2 * Math.PI) * 360
      }
      if (whichquadrant === 1) {
        moveAngle = Math.atan(to) / (2 * Math.PI) * 360 + 180
      }
      $scope.large_round_rotate = $scope.large_round_rotate + moveAngle - $scope.currentAngle
      $scope.currentAngle = moveAngle
    }


    // websocket 
    $scope.websocket = new WebSocket("ws://www.live-ctrl.com/aijukex/stServlet.st?serverId=" + sessionStorage.getItem('serverId'))
    $scope.websocket.onmessage = function(event) {
      $scope.$apply(function() {
        var lightNow = event.data.split('.WAY.')
        $scope.allLights = $scope.allLights.map(function(light) {
          if (light.wayId === lightNow[0]) {
            light.status = lightNow[1]
          } else {
            light
          }
          return light
        })
        $scope.lights = $scope.allLights.filter(function(light, index) {
          return light.name.indexOf($scope.tab_navs[$scope.modleIndex]) > -1;
        });
       // console.log($scope.allLights, $scope.lights)
      })
    }
    $scope.$on("$destroy", function() {
      $scope.websocket.close()
      submitLights()
    })
    // 退出提交light状态
    function submitLights() {
      var onWayIds = ''
      $scope.allLights
        .filter(function(light) { return light.status === 'ON' })
        .forEach(light => {
          onWayIds = onWayIds + ',' + light.wayId
        })
      var offWayIds = ''
      $scope.allLights
        .filter(function(light) { return light.status === 'OFF' })
        .forEach(light => {
          offWayIds = offWayIds + ',' + light.wayId
        })
      //console.log(onWayIds)
      ApiService.modifyWaysStatus({
        onWayIds: onWayIds.slice(1),
        offWayIds: offWayIds.slice(1)
      }).success(function(res) {
        console.log(res)
      })
    }
  }]);
