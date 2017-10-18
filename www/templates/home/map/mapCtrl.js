angular.module('map-controller', [])
  .controller('mapCtrl', function($scope, $rootScope, $stateParams, $cordovaAppAvailability, $ionicActionSheet, $cordovaFileOpener2) {
    $scope.back = function() {
      $rootScope.$ionicGoBack();
    };
    $scope.btnshow = true;
    var geolocation;

    //我的位置
    $scope.myplace = function() {
      $scope.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 18
      });
      var lnglatXY = [sessionStorage.getItem('longitude'), sessionStorage.getItem('latitude')]; //地图上所标点的坐标
      var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                $scope.startAddress = result.regeocode.formattedAddress
            }
        });
        var marker = new AMap.Marker({  //加点
             map: $scope.map,
             position: lnglatXY
         });
         $scope.map.setFitView();
    };
    $scope.myplace();
    //导航
    $scope.init = function() {
      $scope.btnshow = false;
      var keywords = [$scope.startAddress, $stateParams.destination];
      var map = new AMap.Map("container");
      AMap.plugin(["AMap.Driving"], function() {
        var drivingOption = {
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: map
        };
        var driving = new AMap.Driving(drivingOption); //构造驾车导航类
        //根据起终点坐标规划驾车路线
        driving.search([{
          keyword: keywords[0]
        }, {
          keyword: keywords[1]
        }], function(status, result) {
          console.log(result)
          $scope.selectMapApp = function() {
            mapApp = [];
            if (ionic.Platform.isIOS()) {
              $cordovaAppAvailability.check('baidumap://')
                .then(function() {
                  mapApp.push({
                    text: '百度地图'
                  });
                }, function() {});
              $cordovaAppAvailability.check('iosamap://')
                .then(function() {
                  mapApp.push({
                    text: '高德地图'
                  });
                }, function() {});
              $cordovaAppAvailability.check('http://')
                .then(function() {
                  mapApp.push({
                    text: '苹果地图'
                  });
                }, function() {});
            } else {
              $cordovaAppAvailability.check('com.baidu.BaiduMap')
                .then(function() {
                  mapApp.push({
                    text: '百度地图'
                  });
                }, function() {});
              $cordovaAppAvailability.check('com.autonavi.minimap')
                .then(function() {
                  mapApp.push({
                    text: '高德地图'
                  });
                }, function() {});
            }
            var hideSheet = $ionicActionSheet.show({
              buttons: mapApp,
              cancelText: '取消',
              buttonClicked: function(index) {
                hideSheet();
                if (ionic.Platform.isIOS()) {
                  if (mapApp[index].text == '百度地图') {
                    window.location.href = 'baidumap://map/direction?origin=' + result.origin.lat + ',' + result.origin.lng + '&destination=' + result.destination.lat + ',' + result.destination.lng + '&mode=driving&src=webapp.navi.yourCompanyName.yourAppName';
                  } else if (mapApp[index].text == '高德地图') {
                    window.location.href = 'iosamap://path?sourceApplication=applicationName&sid=BGVIS1&slat=' + result.origin.lat + '&slon=' + result.origin.lng + '&sname=' + keywords[0] + '&did=BGVIS2&dlat=' + result.destination.lat + '&dlon=' + result.destination.lng + '&dname=' + keywords[1] + '&dev=0&t=0';
                  } else if (mapApp[index].text == '苹果地图') {
                    window.location.href = 'http://maps.apple.com/?saddr=' + result.origin.lat + ',' + result.origin.lng + '&daddr=' + result.destination.lat + ',' + result.destination.lng + '&dirflg=r';
                  }
                } else {
                  if (mapApp[index].text == '百度地图') {
                    window.location.href = 'bdapp://map/direction?origin=' + result.origin.lat + ',' + result.origin.lng + '&destination=' + result.destination.lat + ',' + result.destination.lng + '&mode=driving&src=webapp.navi.yourCompanyName.yourAppName';
                  } else if (mapApp[index].text == '高德地图') {
                    window.location.href = 'androidamap://route?sourceApplication=applicationName&sid=BGVIS1&slat=' + result.origin.lat + '&slon=' + result.origin.lng + '&sname=' + keywords[0] + '&did=BGVIS2&dlat=' + result.destination.lat + '&dlon=' + result.destination.lng + '&dname=' + keywords[1] + '&dev=0&t=0';
                  }
                }
              }
            });
          };
        });
      });
    };
  });
