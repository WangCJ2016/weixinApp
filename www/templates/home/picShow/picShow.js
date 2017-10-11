angular.module('picShow-controller', [])
.controller('picShowCtrl',function($scope,$stateParams,$rootScope,$ionicHistory){
	$scope.imgs = $stateParams.data.imgsrcs;
	$scope.index = $stateParams.data.index;

	$scope.back = function(){
		$rootScope.$ionicGoBack();
	};
});
