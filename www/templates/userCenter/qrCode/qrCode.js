angular.module('qrCode-controller', [])
.controller('qrCodeCtrl',function($scope,$stateParams){
	if (localStorage.getItem('imghead')) {
		$scope.imghead = localStorage.getItem('imghead');
	}

	$scope.name = localStorage.getItem('userName');
});
