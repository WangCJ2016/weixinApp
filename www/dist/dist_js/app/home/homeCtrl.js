angular.module('home-controller', [])
  .controller('homeCtrl', ['$scope', '$ionicPlatform', '$cordovaAppAvailability', '$ionicScrollDelegate', '$rootScope', 'ApiService', '$ionicSlideBoxDelegate', '$stateParams', '$state', '$ionicLoading', 'mainADs', '$location', '$ionicViewSwitcher', '$ionicPopup', function($scope, $ionicPlatform, $cordovaAppAvailability, $ionicScrollDelegate, $rootScope, ApiService, $ionicSlideBoxDelegate, $stateParams, $state, $ionicLoading, mainADs, $location, $ionicViewSwitcher, $ionicPopup) {
    $ionicSlideBoxDelegate.update();
    $ionicSlideBoxDelegate.loop(true);
    //选择的城市
    $scope.city = localStorage.getItem('city') ? localStorage.getItem('city') : '杭州';
    $scope.$on('cityChange', function() {
      $scope.city = localStorage.getItem('city');
      pageNo = 1
      getHomePageHotels()
    });

    $scope.$on('cityChange', function() {
      var city = sessionStorage.getItem("city");
      var CityReg = /市$/;
      if (CityReg.test(city)) {
        $scope.city = city.substring(0, city.length - 1);
      } else {
        $scope.city = city;
      }
      pageNo = 1
      getHomePageHotels()
    });
    var city = sessionStorage.getItem("city");
    var CityReg = /市$/;
    if (CityReg.test(city)) {
      $scope.city = city.substring(0, city.length - 1);
    } else {
      $scope.city = city;
    }
    //定位
    //Ã–Ã·Â¹Ã£Â¸Ã¦
    $scope.mainADs = mainADs.data.result;

    //
    $scope.goSelectBussiniss = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $state.go('selectBussiniss');
      $ionicViewSwitcher.nextDirection("forward");
    };
    //副广告
    ApiService.getHomePageBanner({
      level: 1
    }).success(function(res) {
      $scope.subADs = res.result;
    });
    //酒店列表
    var pageNo = 1;
    $scope.moreDataCanBeLoaded = true;

    function getHomePageHotels() {
      ApiService.getHomePageHotels({
        pageNo: pageNo,
        pageSize: 5,
        address: encodeURI($scope.city || '杭州市')
      }).success(function(res) {
        if (res.success) {
          // $ionicLoading.hide();
          $scope.hotels = res.result.map(function(hotel) {
            //评价星星
            hotel.full_stars = [];
            hotel.full_stars.length = parseInt(hotel.stars, 10) || 5;
            hotel.star_blank = [];
            hotel.star_blank.length = 5 - hotel.full_stars.length;
            return hotel
          })
          pageNo++;
        }
      });
    }
    getHomePageHotels()
    $scope.loadMoreData = function() {
      ApiService.getHomePageHotels({
        pageNo: pageNo,
        pageSize: 5,
        address: encodeURI(sessionStorage.getItem("city") || '杭州')
      }).success(function(res) {
        console.log(res)
        if (res.success && res.result.length > 0) {
          for (var i = 0; i < res.result.length; i++) {
            $scope.hotels.push(res.result[i]);
          }
          $scope.$broadcast("scroll.infiniteScrollComplete");
          pageNo++;

        } else {
          $scope.moreDataCanBeLoaded = false;
        }
      });
    };
    //酒店详详情
    $scope.goHotelDetail = function(id) {
      $state.go('houseDtail', {
        id: id
      });
      $ionicViewSwitcher.nextDirection("forward");
    };
    //goNearBy
    $scope.goNearBy = function() {
      $state.go('nearby', { city: sessionStorage.getItem('city') })
    }
    //滚动置顶
    $scope.$on('getHeight', function() {

    });
    $scope.swipe = function() {
      var scrollTop = $ionicScrollDelegate.getScrollPosition().top;
      //var opacity = angular.element(document.querySelector('#fixed'))[0].style.opacity
      angular.element(document.querySelector('#fixed'))[0].style.opacity = scrollTop * 0.002;
      angular.element(document.querySelector('#fixedHeader'))[0].style.opacity = scrollTop * 0.002;
      angular.element(document.querySelector('#fixedHeaderDefalut'))[0].style.opacity = 1 - scrollTop * 0.002 * 2;
    };



  }]);
