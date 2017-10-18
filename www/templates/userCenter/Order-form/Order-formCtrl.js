angular.module('Orderform-controller', [])
  .controller('OrderformCtrl', function($scope, $stateParams, ApiService, DuplicateLogin, systemBusy, $ionicLoading, $timeout, $state, $ionicPopup) {

    ApiService.viewOrderDetail({
      orderCode: $stateParams.id
    }).success(function(res) {
      if (res.success) {
        $scope.order = res.dataObject;
        //支付订单

        $scope.pay = function() {
          var tradeNo = res.dataObject.orderCode
          var price = res.dataObject.totalFee;
          ApiService.getOrderInfo({ orderCode: tradeNo, fee: price })
            .success(function(res) {
              console.log(res)
              _AP.pay('https://mapi.alipay.com/gateway.do?' + res.dataObject);
            })
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

    //取消订单
    $scope.cancelOrder = function() {
      $ionicPopup.confirm({
          template: "确定要取消订单吗",
          buttons: [{
            text: '确定',
            onTap: function(e) {
              return 1;
            }
          }, {
            text: '取消'
          }],
          cssClass: 'ajk'
        })
        .then(function(res) {
          if (res) {
            ApiService.cancelOrder({
              orderCode: $stateParams.id
            }).success(function(res) {
              if (res.success) {
                $ionicLoading.show({
                  template: '取消成功'
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
                $state.go('Nopay');
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
          } else {

          }
        });

    };

  });
