angular.module('bindingPhone-controller', [])
  .controller('bindingPhoneCtrl', function($scope, ApiService,DuplicateLogin,systemBusy, $ionicPopup, $ionicBackdrop, $state, $timeout, $ionicLoading, $ionicViewSwitcher) {
    ApiService.getCustomerInfo({
      customerId: localStorage.getItem('customerId')
    }).success(function(res) {

      if (res.success) {
        if (res.dataObject.telephone !== undefined) {
          $scope.bindWhether = true;
          $scope.num = res.dataObject.telephone;
        }
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
    })
    $scope.sendData = {
      customerId: localStorage.getItem("customerId"),
      telephone: "",
      code: ''
    };

    $scope.bindingPhoneBtn = function() {
      ApiService.bindingPhone($scope.sendData).success(function(res) {

        if (res.success) {
          $ionicLoading.show({
            template: "获取验证码成功",
            noBackdrop: 'true',

          });
          $timeout(function() {
            $ionicLoading.hide();
          }, 2000);
        } else {
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
    };

    $scope.telBtn = function() {
      var sendData1 = {
        customerId: localStorage.getItem("customerId"),
        telephone: $scope.sendData.telephone,
        code: $scope.sendData.code
      };
      ApiService.telephoneBinding(sendData1).success(function(res) {
        
        if (res.success) {
          $ionicLoading.show({
            template: "手机绑定成功",
            noBackdrop: 'true',

          });
          $timeout(function() {
            $ionicLoading.hide();
            $state.go('setting');
            $ionicViewSwitcher.nextDirection("back");
          }, 2000);
        } else {
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
    };
  });
