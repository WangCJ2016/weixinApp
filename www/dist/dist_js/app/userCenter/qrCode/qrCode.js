angular.module('qrCode-controller', [])
.controller('qrCodeCtrl',['$scope', '$stateParams', function($scope,$stateParams){
	if (localStorage.getItem('imghead')) {
		$scope.imghead = localStorage.getItem('imghead');
	}

	$scope.name = localStorage.getItem('userName');
}]);
