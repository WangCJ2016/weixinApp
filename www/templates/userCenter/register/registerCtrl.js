angular.module('register-controller', [])
    .controller('registerCtrl',function($scope,ApiService,$ionicLoading,$ionicBackdrop,$state,$timeout,$interval){
	$scope.checked = true;

   	$scope.sendData = {
    		telephone:"",
    		code:"",
    		password:"",
    		type:"REG"
	};
  $scope.getCodeValue = '获取验证码';
  $scope.getCodeValueSwitch = true;
	$scope.getVerifyCode = function () {
		ApiService.getREG($scope.sendData).success(function(res){
			if(res.success===true){
				$ionicLoading.show({
					template: "获取验证码成功",
					noBackdrop: 'true',
				});
        $scope.getCodeValue = 60;
        $scope.getCodeValueSwitch = false;
        $interval(function(){
          if ($scope.getCodeValue>0) {
              $scope.getCodeValue--;
          }else{
            $scope.getCodeValueSwitch = true;
            $scope.getCodeValue = '获取验证码';
          }
        },1000)
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

	$scope.registerBtn = function(){
		
   		ApiService.register($scope.sendData).success(function(res){
			if(res.success){
				localStorage.setItem('customerId',res.dataObject.id);
   			  $ionicLoading.show({
				template: '注册成功!',
				noBackdrop: 'true',

			});
				$timeout(function() {
					$ionicLoading.hide();
					$state.go('login');
				}, 2000);
			} else {
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

});
