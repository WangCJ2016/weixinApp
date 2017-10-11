angular.module('ctrl-controller', [])
  .controller('ctrl', ['$scope', '$state', '$rootScope', 'ApiService', 'DuplicateLogin', 'systemBusy', '$timeout', '$ionicLoading', '$ionicViewSwitcher', function($scope,$state,$rootScope, ApiService, DuplicateLogin, systemBusy, $timeout, $ionicLoading, $ionicViewSwitcher) {

    $scope.select = true;
    $scope.pageNo = 1;
    $scope.moreDataCanBeLoaded = true;
    $ionicLoading.show({
      template: '<ion-spinner icon="ios"></ion-spinner>'
    });
    if (!localStorage.getItem('customerId')) {
      $ionicLoading.hide();

      $timeout(function(res){
        $state.go('login');

      },50)
    }
    else {
      ApiService.queryCustomerOrders({
        customerId: localStorage.getItem('customerId'),
        type: 'waiting',
        pageNo: $scope.pageNo ,
        pageSize: 5,
      }).success(function(res) {
        if (res.success) {
          $scope.pageNo++;
          $ionicLoading.hide();
          $scope.orders = res.result;
          //待入住=>已入住
          $scope.inHouse = function(house, hotelName, orderCode, code,hotelId) {
            $scope.InhotelName = hotelName;
            $scope.InorderCode = orderCode;
            var data = {
              house: house,
              hotelName: hotelName,
              orderCode: orderCode,
              subOrderCode: code,
              hotelId:hotelId
            };
            $state.go('inHouse', {
              data: data
            });
            $ionicViewSwitcher.nextDirection("back");
          };
        } else {
          if (res.msg === '非法请求') {
            $ionicLoading.show({
              template: DuplicateLogin
            });
            $timeout(function() {
              $ionicLoading.hide();
              $state.go('login')
            }, 2000)
          } else {
            $ionicLoading.show({
              template: systemBusy
            });
            $timeout(function() {
              $ionicLoading.hide();
              $state.go('tab.home')
            }, 2000)
          }
        }
      });
      //加载更多
      $scope.loadMoreData = function() {
        ApiService.queryCustomerOrders({
          customerId: localStorage.getItem('customerId'),
          type: 'waiting',
          pageNo: $scope.pageNo,
          pageSize: 5
        }).success(function(res) {
          if (res.success ) {
            for (var i = 0; i < res.result.length; i++) {
              $scope.orders.push(res.result[i]);
              $scope.$broadcast("scroll.infiniteScrollComplete");
            }
            $scope.moreDataCanBeLoaded = false;
            $scope.pageNo++;

          } else {
            $scope.moreDataCanBeLoaded = false;
            if (res.msg === '非法请求') {
              $ionicLoading.show({
                template: DuplicateLogin
              });
              $timeout(function() {
                $ionicLoading.hide();
                $state.go('login')
              }, 2000)
            } else {
              $ionicLoading.show({
                template: systemBusy
              });
              $timeout(function() {
                $ionicLoading.hide();
                $state.go('tab.home')
              }, 2000)
            }
          }

        });
      };
      //待入住
      $scope.waitingIn = function() {
        $scope.select = true;
      };
      //已入住
      $scope.hasIn = function() {
        $scope.select = false;
        ApiService.queryCustomerOrders({
          customerId: localStorage.getItem('customerId'),
          type: 'already',
          pageNo: 1,
          pageSize: 5
        }).success(function(res) {
          if (res.success) {
            $scope.beHouses = res.result;
          } else {
            if (res.msg === '非法请求') {
              $ionicLoading.show({
                template: DuplicateLogin
              });
              $timeout(function() {
                $ionicLoading.hide();
                $state.go('login')
              }, 2000)
            } else {
              $ionicLoading.show({
                template: systemBusy
              });
              $timeout(function() {
                $ionicLoading.hide();
                $state.go('tab.home')
              }, 2000)
            }
          }
        });
      };

      //goCheckIn
      $scope.goCheckIn = function(houseId, subOrderCode, code,hotelName,houseName,hotelId) {
        sessionStorage.setItem('serviceHotelId',hotelId);
        sessionStorage.setItem('serviceHouseId',houseId);
        sessionStorage.setItem('hotelName', hotelName);
        sessionStorage.setItem('houseName', houseName);
        sessionStorage.setItem('subOrderCode', subOrderCode);
        var data = {
          houseId: houseId,
          subOrderId: subOrderCode,
          subOrderCode: code
        };
        $state.go('checkIn', {
          data: data
        });
      };
    }





  }]);
