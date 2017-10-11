angular.module('setPwd-controller', [])
.controller('setPwdCtrl',['$scope', 'ApiService', '$state', function($scope,ApiService,$state){
	$scope.password='';
	$scope.password_repeat='';
	var data={
		customerId:localStorage.getItem('customerId'),
		password:$scope.password
	};
	$scope.changepwd = function(){
		ApiService.changepwd(data).success(function(res){
			if(res.success==true){
				$state.go('login');
			}
		});
	};
}]);
