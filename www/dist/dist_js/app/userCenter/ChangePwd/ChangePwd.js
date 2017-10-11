angular.module('ChangePwd-controller', [])
  .controller('ChangePwdCtrl', ['$scope', 'ApiService', 'DuplicateLogin', 'systemBusy', '$ionicLoading', '$ionicPopup', '$ionicBackdrop', '$state', '$timeout', function($scope, ApiService, DuplicateLogin,systemBusy,$ionicLoading,$ionicPopup, $ionicBackdrop, $state, $timeout) {
	$scope.sendData = {
		customerId: localStorage.getItem("customerId"),
		oldPassword: '',
		password: "",

	};
	$scope.password_repeat = '';

	$scope.changepwdBtn11 = function() {
		ApiService.changepwd($scope.sendData).success(function(res) {
			if (res.success) {
				$ionicLoading.show({
					template: '修改成功',
					noBackdrop: 'true',
				});
				localStorage.removeItem('customerId');
				$timeout(function() {
					$ionicLoading.hide();
					$state.go('login');
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
}]);
