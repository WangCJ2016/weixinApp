angular.module('binding-controller', [])
  .controller('bindingCtrl', ['$scope', 'ApiService', 'DuplicateLogin', 'systemBusy', '$ionicPopup', '$ionicBackdrop', '$state', '$timeout', '$ionicLoading', '$ionicViewSwitcher', function($scope, ApiService,DuplicateLogin,systemBusy,$ionicPopup, $ionicBackdrop, $state, $timeout, $ionicLoading, $ionicViewSwitcher) {
  $scope.bindWhether = false;
  ApiService.getCustomerInfo({customerId:localStorage.getItem('customerId')}).success(function(res){
    
    if (res.success) {
      if (res.dataObject.cardNo!==undefined) {
        $scope.bindWhether = true;
        $scope.name = res.dataObject.name;
        $scope.cardNo = res.dataObject.cardNo;
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
		name: "",
		cardNo: ""
	};
	$scope.buttonBtn = function() {
    var data = {}
    data.customerId = $scope.sendData.customerId;
    data.name = encodeURI($scope.sendData.name);
    data.cardNo = $scope.sendData.cardNo
		ApiService.custom(data).success(function(res) {
      if(res.success){
        $ionicLoading.show({
  				template: "绑定成功",
  				noBackdrop: 'true',
  			});
  			$timeout(function() {
  				$ionicLoading.hide();
  				$state.go('setting');
  				$ionicViewSwitcher.nextDirection("back");
  			}, 2000);
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
	};
}]);
