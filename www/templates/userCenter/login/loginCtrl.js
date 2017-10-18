angular.module('login-controller', [])
  .controller('loginCtrl', function($scope, $rootScope,ApiService, $ionicPopup,$ionicHistory,$state, $ionicLoading, $timeout) {
  localStorage.removeItem('customerId');
  localStorage.removeItem('imghead');
  localStorage.removeItem('loginCount');
  localStorage.removeItem('token');
	$scope.sendData = {
		account: "",
		password: ""
	};
	$scope.loginBtn = function() {
		var re = /^1[34578]\d{9}$/;
		var re1 = /[a-zA-Z\d+]{6,36}/;
		if (re.test($scope.sendData.account)) {
			if (re1.test($scope.sendData.password)) {
				ApiService.login($scope.sendData).success(function(res) {
					if (res.success) {
						localStorage.setItem('imghead',res.dataObject.headPicture?res.dataObject.headPicture:'');
						localStorage.setItem("customerId", res.dataObject.id);
						localStorage.setItem("loginCount", res.dataObject.loginCount);
						localStorage.setItem("token", res.dataObject.token);
						localStorage.setItem("userName", res.dataObject.telephone);
						$ionicLoading.show({
							template: "登录成功",
							noBackdrop: 'true',

						});
						$timeout(function() {
							$ionicLoading.hide();
							var backState = ['ChangePwd','RetrievePwd','register'];
							var ifback = false;
							for (var i = 0; i < backState.length; i++) {
								if($ionicHistory.viewHistory().backView.stateName===backState[i]){
									ifback = true;
								}
							}
							if(!ifback){
								$rootScope.$ionicGoBack();
							}else{
								$state.go('tab.userCenter');
							}
						}, 1000);
					} else {
						$ionicLoading.show({
							template: "密码错误",
							noBackdrop: 'true',

						});

						$timeout(function() {
							$ionicLoading.hide();

						}, 2000);
					}

				});
			} else {
				$ionicLoading.show({
					template: "请输入正确密码",
					noBackdrop: 'true',

				});
				$timeout(function() {
					$ionicLoading.hide();

				}, 2000);
			}
		} else {
			$ionicLoading.show({
				template: "请输入正确手机号",
				noBackdrop: 'true',

			});
			$timeout(function() {
				$ionicLoading.hide();

			}, 1000);
		}


	};
});
