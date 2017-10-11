angular.module('picShow-controller', [])
.controller('picShowCtrl',['$scope', '$stateParams', '$rootScope', '$ionicHistory', function($scope,$stateParams,$rootScope,$ionicHistory){
	$scope.imgs = $stateParams.data.imgsrcs;
	$scope.index = $stateParams.data.index;

	$scope.back = function(){
		$rootScope.$ionicGoBack();
	};
}]);
