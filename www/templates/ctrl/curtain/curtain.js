angular.module('curtain-controller', [])
  .controller('curtainCtrl', function($scope, ApiService, $rootScope, $stateParams) {
    $scope.goback = function() {
      $rootScope.$ionicGoBack();
    };
    var data = {
      ip: sessionStorage.getItem('ip'),
      deviceType: 'CURTAIN'
    };
    $scope.curtainBtns = [{ title: '打开', type: 'OPEN' }, { title: '停止', type: 'STOP' }, { title: '关闭', type: 'CLOSE' }]
    ApiService.queryCurtains(data).success(function(res) {
      if (res.success) {
        console.log(res)
        for (var curtains in res.dataObject) {
          //console.log(curtains)
          res.dataObject[curtains].forEach(function(curtain) {
            curtain.brightness = 50
          })
        }
        $scope.curtainArrays = res.dataObject
        $scope.title = Object.keys(res.dataObject)[0]
        $scope.length = Object.keys(res.dataObject).length
        more()
        $scope.curtainCtrl = function(actionType, curtain, index) {
          curtain.chuanglianActiveIndex = index
         	console.log(curtain)
          var data = {
            houseId: sessionStorage.getItem('houseId'),
            deviceType: 'CURTAIN',
            port: sessionStorage.getItem('port'),
            serverId: sessionStorage.getItem('serverId'),
            actionType: actionType,
            wayId: curtain.wayId,
            brightness: 100
          };
          ApiService.smartHostControl(data).success(function(res) {
            console.log(res)
          });
        };
        $scope.change = function(value, actionType) {

        };
        $scope.onRelease = function(e,brightness, wayId) {
        	e.stopPropagation()
        	e.preventDefault()
          var data = {
            houseId: sessionStorage.getItem('houseId'),
            deviceType: 'CURTAIN',
            port: sessionStorage.getItem('port'),
            serverId: sessionStorage.getItem('serverId'),
            actionType: 'OPEN',
            wayId: wayId,
            brightness: brightness
          };
          ApiService.smartHostControl(data).success(function(res) {
            console.log(res)
          });
        };
      }
    });
    //多个窗帘

    function more() {
      $scope.potArray = []
      if ($scope.length > 1) {
        for (var i = $scope.length - 1; i >= 0; i--) {
          $scope.potArray.push(i)
        }
      }
      $scope.perWidth = 100 / $scope.length
      $scope.tvState = 0
    }

    //向右滑
    $scope.onSwipeRight = function() {
      if ($scope.tvState > 0) {
        $scope.tvState--
          $scope.title = Object.keys($scope.curtainArrays)[$scope.tvState]
      }
    }
    //向左滑
    $scope.onSwipeLeft = function() {
      if ($scope.tvState < $scope.length - 1) {
        $scope.tvState++
          $scope.title = Object.keys($scope.curtainArrays)[$scope.tvState]
      }
    }


  });
