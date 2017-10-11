angular.module('collectCtrl-controller', [])
    .controller('collectCtrl', function($scope, ApiService,$rootScope,$state,$ionicLoading,DuplicateLogin,$timeout) {
	if (!localStorage.getItem('customerId')) {
		$state.go('login');

	} else {

		ApiService.getCustomerCollect({ customerId: localStorage.getItem('customerId') }).success(function(res) {
      if (res.success) {
        $scope.collects = res.result;
      }else {
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
	}
	$scope.back = function(){
		$state.go('tab.home')
	};
});
