angular.module('userCenter-controller', [])
    .controller('userCenter', function($scope, $state, $ionicViewSwitcher) {
    	//console.log(sessionStorage.getItem('_city'))
	$scope.useName = '注册/登录';
	$scope.imghead = 'imgs/wcj/imghead.png';
	$scope.tip = false;
	if (localStorage.getItem('customerId')) {
		$scope.useName = localStorage.getItem('userName')||'aijuke';

		if(localStorage.getItem('loginCount')<=1){
			$scope.tip = true;
      localStorage.setItem('loginCount',2)
		}

		if (localStorage.getItem('imghead')) {
			
			$scope.imghead = localStorage.getItem('imghead')||'imgs/wcj/imghead.png';

		}
	}

	$scope.headimg = function() {
		if (localStorage.getItem('customerId')) {
			$state.go('setting');
			$ionicViewSwitcher.nextDirection("forward");
		} else {
			$state.go('login');
			$ionicViewSwitcher.nextDirection("forward");
		}
	};

});
