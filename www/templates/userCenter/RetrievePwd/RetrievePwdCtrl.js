angular.module('RetrievePwd-controller', [])
  .controller('RetrievePwdCtrl', function($scope, $ionicLoading,$timeout,ApiService, $log, $state) {
	$scope.sendData = {
		telephone: "",
		type: "RPSW",
		code: ""
	};
	$scope.getVerifyCode = function() {
		ApiService.RetrievePwd($scope.sendData).success(function(res) {
			if(res.success){
				$ionicLoading.show({
					template: "获取验证码成功",
					noBackdrop: 'true',

				});

				$timeout(function() {
					$ionicLoading.hide();

				}, 2000);
			}else{
				$ionicLoading.show({
					template: res.msg,
					noBackdrop: 'true',

				});

				$timeout(function() {
					$ionicLoading.hide();

				}, 2000);
			}
		});
	};
	$scope.RetrievePwdBtn = function() {
		ApiService.verify($scope.sendData).success(function(res) {
            console.log(res)
			if (res.success == true) {
				$state.go('login');

			}else{
				$ionicLoading.show({
					template: "获取验证码错误",
					noBackdrop: 'true',

				});

				$timeout(function() {
					$ionicLoading.hide();

				}, 2000);
			}
		});
	};

});
