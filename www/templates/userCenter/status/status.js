angular.module('status-controller', [])
  .controller('statusCtrl', function($scope, ApiService,DuplicateLogin,systemBusy,$state, $stateParams, $ionicLoading, $ionicPopup, $timeout) {
    ApiService.viewOrderDetail({
      orderCode: $stateParams.id
    }).success(function(res) {

      if (res.success) {
        $scope.order = res.dataObject;
        //取消子订单
        $scope.cancel = function(id) {

          $ionicPopup.confirm({
              template: "确定要取消预订吗",
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
                ApiService.cancleSubOrder({
                  subOrderCode: id
                }).success(function(res) {
                  
                  if (res.success) {

                    $ionicLoading.show({
                      template: '取消成功'
                    });
                    $state.go('Pay');
                    $timeout(function() {
                      $ionicLoading.hide();
                    }, 1000);
                  }else{
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
              } else {

              }
            });
        };

        //计算最近入住时间
        var times = $scope.order.hotels[0].houses[0].inTimes.slice(0, 10);
        var times = times.split('年');
        times[1] = times[1].split('月');
        times = times[0] + '-' + times[1][0] + '-' + times[1][1];


        function DateDiff(sDate1) { //sDate1和sDate2是2006-12-18格式
          var aDate, oDate1, oDate2, iDays;
          aDate = sDate1.split("-");
          oDate1 = new Date().setFullYear(aDate[0], aDate[1] - 1, aDate[2]); //转换为12-18-2006格式
          oDate2 = new Date();
          iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
          return iDays;
        }
        if (DateDiff(times) < 0) {
          $scope.leaveTimes = 0;
        } else {
          $scope.leaveTimes = DateDiff(times);
        }

        //是否可以取消订单
        //是否可以取消子订单
        $scope.order.hotels.forEach(function(hotel) {
          hotel.houses.forEach(function(house) {
            var times = house.inTimes.slice(0, 10);
            var times = times.split('年');
            times[1] = times[1].split('月');
            times = times[0] + '-' + times[1][0] + '-' + times[1][1];
            var cancelTime = times.split('-');
            var dataif = new Date(cancelTime[0], cancelTime[1] - 1, cancelTime[2], 14, 00, 00).getTime() - new Date().getTime() > 86400000 ? true : false;
            if(dataif&&house.status==0){
              house.orderCancel=true;

            }
            if(dataif&&house.status==4){
              house.yiCancel=true;
            }
          });
        });

      }else{
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
  });
